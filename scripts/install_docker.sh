#!/bin/bash

# Function to check if Docker is installed
check_docker() {
    if command -v docker &> /dev/null; then
        echo "Docker is already installed."
        docker --version
        exit 0
    fi
}

# Function to install on macOS
install_mac() {
    echo "Detected macOS."
    if command -v brew &> /dev/null; then
        echo "Homebrew detected. Installing Docker via Homebrew..."
        brew install --cask docker
        echo "Docker installed. Please open Docker Desktop from your Applications folder to start the daemon."
    else
        echo "Homebrew not found."
        echo "Please download and install Docker Desktop manually from: https://www.docker.com/products/docker-desktop/"
        exit 1
    fi
}

# Function to install on Linux
install_linux() {
    echo "Detected Linux."
    echo "Downloading and running official Docker installation script..."
    # This script is maintained by Docker and supports most distros (Ubuntu, Debian, CentOS, Fedora)
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
    
    echo "Adding current user to docker group..."
    sudo usermod -aG docker $USER
    echo "Docker installed. You may need to log out and back in for group changes to take effect."
}

# Function to install on Windows
install_windows() {
    echo "Detected Windows environment."
    # Check for winget (Windows Package Manager)
    if command -v winget &> /dev/null; then
        echo "Installing Docker Desktop via Winget..."
        winget install -e --id Docker.DockerDesktop
    # Check for Chocolatey
    elif command -v choco &> /dev/null; then
        echo "Installing Docker Desktop via Chocolatey..."
        choco install docker-desktop
    else
        echo "No compatible package manager found (winget or choco)."
        echo "Please download and install Docker Desktop manually from: https://www.docker.com/products/docker-desktop/"
        exit 1
    fi
}

# Main execution
check_docker

OS="$(uname -s)"
case "${OS}" in
    Linux*)     install_linux;;
    Darwin*)    install_mac;;
    CYGWIN*|MINGW*|MSYS*) install_windows;;
    *)          echo "Unknown operating system: ${OS}. Please install Docker manually."; exit 1;;
esac
