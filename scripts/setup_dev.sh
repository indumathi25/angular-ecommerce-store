#!/bin/bash

# Ensure we are running from the project root
if [ ! -f "Makefile" ]; then
    echo "Please run this script from the project root directory."
    exit 1
fi

echo "=== Setting up Local Development Environment ==="

# 1. Install Docker
echo "--- Checking Docker Configuration ---"
chmod +x scripts/install_docker.sh
./scripts/install_docker.sh
if [ $? -ne 0 ]; then
    echo "Docker installation failed. Please install Docker manually."
    exit 1
fi

# 2. Install Node.js
echo "--- Checking Node.js Configuration ---"
if command -v node &> /dev/null; then
    echo "Node.js is already installed: $(node -v)"
else
    echo "Node.js not found. Attempting installation..."
    OS="$(uname -s)"
    case "${OS}" in
        Linux*)
            if command -v apt &> /dev/null; then
                # Install Node.js 20.x LTS
                curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
                sudo apt-get install -y nodejs
            else
                echo "Automatic Node.js installation is only supported on apt-based Linux systems."
                echo "Please install Node.js manually."
                exit 1
            fi
            ;;
        Darwin*)
            if command -v brew &> /dev/null; then
                brew install node
            else
                echo "Homebrew not found. Please install Node.js manually."
                exit 1
            fi
            ;;
        CYGWIN*|MINGW*|MSYS*)
            if command -v winget &> /dev/null; then
                winget install OpenJS.NodeJS.LTS
            elif command -v choco &> /dev/null; then
                choco install nodejs
            else
                echo "Please install Node.js manually."
                exit 1
            fi
            ;;
        *)
            echo "Unknown OS. Please install Node.js manually."
            exit 1
            ;;
    esac
fi

# 3. Install Dependencies
echo "--- Installing Project Dependencies ---"
if [ -d "frontend" ]; then
    echo "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
else
    echo "Warning: 'frontend' directory not found. Skipping npm install."
fi

echo "=== Setup Complete ==="
echo "You can now run 'make start' or 'make docker-up' to launch the application."
