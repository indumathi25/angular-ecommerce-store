variable "aws_region" {
  description = "AWS region to deploy resources"
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  default     = "secure-commerce-app"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  default     = "prod"
}

variable "allowed_ssh_cidr" {
  description = "CIDR block allowed to SSH into the EC2 instance (e.g., your home IP)"
  type        = string
  # sensitive   = true # Uncomment if you want to hide this in logs
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t3.micro"
}

variable "public_key_path" {
  description = "Path to the public SSH key to deploy to the instance"
  default     = "~/.ssh/id_rsa.pub"
}
