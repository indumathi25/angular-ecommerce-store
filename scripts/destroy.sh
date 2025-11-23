#!/bin/bash
set -e

# Ensure we are in the project root
if [ ! -f "Makefile" ]; then
    echo "Please run this script from the project root directory."
    exit 1
fi

# 1. Check Tools
echo "--- Checking Infrastructure Tools ---"
if ! command -v terraform &> /dev/null; then
    echo "Error: terraform is not installed."
    exit 1
fi
if ! command -v aws &> /dev/null; then
    echo "Error: aws is not installed."
    exit 1
fi

# 2. Check AWS Credentials
echo "--- Checking AWS Credentials ---"
if ! aws sts get-caller-identity &> /dev/null; then
    echo "AWS credentials not configured or invalid."
    exit 1
fi

# 3. Get Public IP for Security Group variable (required for destroy plan)
echo "--- Detecting Public IP ---"
MY_IP=$(curl -s ifconfig.me)
if [ -z "$MY_IP" ]; then
    echo "Could not detect public IP. Using 0.0.0.0/0 as fallback for destroy."
    MY_IP="0.0.0.0"
fi
echo "Detected Public IP: $MY_IP"

# 4. Terraform Destroy
echo "=== Destroying Infrastructure with Terraform ==="
cd infrastructure/terraform

# Initialize Terraform (in case it wasn't initialized)
terraform init

# Destroy Terraform configuration
terraform destroy -var="allowed_ssh_cidr=${MY_IP}/32" -auto-approve

echo "=== Infrastructure Destroyed ==="
