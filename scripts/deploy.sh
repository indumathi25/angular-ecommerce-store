#!/bin/bash
set -e

# Ensure we are in the project root
if [ ! -f "Makefile" ]; then
    echo "Please run this script from the project root directory."
    exit 1
fi

# 1. Check Tools
echo "--- Checking Infrastructure Tools ---"
MISSING_TOOLS=0
if ! command -v terraform &> /dev/null; then
    echo "Error: terraform is not installed."
    MISSING_TOOLS=1
fi
if ! command -v ansible &> /dev/null; then
    echo "Error: ansible is not installed."
    MISSING_TOOLS=1
fi
if ! command -v aws &> /dev/null; then
    echo "Error: aws is not installed."
    MISSING_TOOLS=1
fi

if [ $MISSING_TOOLS -eq 1 ]; then
    echo "Please run 'make setup-infra' to install missing tools."
    exit 1
fi

# 2. Check AWS Credentials
echo "--- Checking AWS Credentials ---"
if ! aws sts get-caller-identity &> /dev/null; then
    echo "AWS credentials not configured or invalid."
    echo "Please run 'aws configure' and provide your Access Key ID and Secret Access Key."
    exit 1
fi

# 3. Get Public IP for SSH access
echo "--- Detecting Public IP for Security Group ---"
MY_IP=$(curl -s ifconfig.me)
if [ -z "$MY_IP" ]; then
    echo "Could not detect public IP. Please provide it manually."
    exit 1
fi
echo "Detected Public IP: $MY_IP"

# 4. Terraform Apply
echo "=== Deploying Infrastructure with Terraform ==="
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Apply Terraform configuration
# We pass the detected IP to restrict SSH access to just this machine
terraform apply -var="allowed_ssh_cidr=${MY_IP}/32" -auto-approve

# 5. Get Outputs
INSTANCE_IP=$(terraform output -raw ec2_public_ip)
ALB_DNS=$(terraform output -raw alb_dns_name)
CLOUDFRONT_URL=$(terraform output -raw cloudfront_domain_name)

echo "Instance IP: $INSTANCE_IP"
echo "ALB DNS: $ALB_DNS"
echo "CloudFront URL: $CLOUDFRONT_URL"

# 6. Update Ansible Inventory
echo "=== Configuring Server with Ansible ==="
cd ../ansible

# Create inventory file dynamically
# We use the private key corresponding to the public key used in Terraform (default ~/.ssh/id_rsa)
cat > inventory.ini <<EOF
[app_servers]
$INSTANCE_IP ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/id_rsa ansible_ssh_common_args='-o StrictHostKeyChecking=no'
EOF

# 7. Run Ansible Playbook
# We need to wait a bit for the instance to be fully ready and SSH to be available
echo "Waiting for instance to be ready..."
sleep 30

ansible-playbook -i inventory.ini playbook.yml

echo "=== Deployment Complete ==="
echo "You can access your application at:"
echo "Direct EC2: http://$INSTANCE_IP"
echo "Load Balancer: http://$ALB_DNS"
echo "CloudFront: https://$CLOUDFRONT_URL"
