resource "aws_key_pair" "deployer" {
  key_name   = "${var.project_name}-key"
  public_key = file(var.public_key_path)
}

resource "aws_instance" "app_server" {
  ami           = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS in us-east-1 (Update if region changes)
  instance_type = var.instance_type
  subnet_id     = aws_subnet.public_1.id # Placing in public subnet for demo simplicity (avoid NAT GW cost)
  
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
  key_name               = aws_key_pair.deployer.key_name

  tags = {
    Name = "${var.project_name}-instance"
  }

  # User data to install Python for Ansible
  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y python3 python3-pip
              EOF
}
