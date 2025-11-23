#!/bin/bash

echo "=== Setting up Infrastructure Tools ==="

# Function to install on macOS
install_mac() {
    if ! command -v brew &> /dev/null; then
        echo "Homebrew not found. Please install Homebrew first."
        exit 1
    fi

    echo "--- Checking AWS CLI ---"
    if ! command -v aws &> /dev/null; then
        echo "Installing AWS CLI..."
        brew install awscli
    else
        echo "AWS CLI is already installed."
    fi

    echo "--- Checking Terraform ---"
    if ! command -v terraform &> /dev/null; then
        echo "Installing Terraform..."
        brew install terraform
    else
        echo "Terraform is already installed."
        # Optional: brew upgrade terraform
    fi

    echo "--- Checking Ansible ---"
    if ! command -v ansible &> /dev/null; then
        echo "Installing Ansible..."
        brew install ansible
    else
        echo "Ansible is already installed."
    fi
}

# Function to install on Linux (Debian/Ubuntu)
install_linux() {
    echo "--- Checking AWS CLI ---"
    if ! command -v aws &> /dev/null; then
        echo "Installing AWS CLI..."
        sudo apt-get update
        sudo apt-get install -y awscli
    fi

    echo "--- Checking Terraform ---"
    if ! command -v terraform &> /dev/null; then
        echo "Installing Terraform..."
        # Add HashiCorp repo
        sudo apt-get update && sudo apt-get install -y gnupg software-properties-common
        wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg
        echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
        sudo apt-get update && sudo apt-get install -y terraform
    fi

    echo "--- Checking Ansible ---"
    if ! command -v ansible &> /dev/null; then
        echo "Installing Ansible..."
        sudo apt-add-repository -y ppa:ansible/ansible
        sudo apt-get update
        sudo apt-get install -y ansible
    fi
}

OS="$(uname -s)"
case "${OS}" in
    Darwin*)    install_mac;;
    Linux*)     install_linux;;
    *)          echo "Unsupported OS for automatic setup. Please install AWS CLI, Terraform, and Ansible manually."; exit 1;;
esac

echo "=== Infrastructure Tools Setup Complete ==="
