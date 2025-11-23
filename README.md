# Secure Commerce App

This repository contains the source code and infrastructure configuration for the Secure Commerce App.

## Project Structure

- **[frontend/](./frontend/)**: The Angular application source code, including Docker configuration and CI/CD workflows.
- **[infrastructure/](./infrastructure/)**: Infrastructure as Code (IaC) using Terraform and Ansible to deploy the application to AWS.

## Getting Started

### Frontend

Navigate to the `frontend` directory to work on the application:

```bash
cd frontend
make install
make start
```

See [frontend/README.md](./frontend/README.md) for more details.

### Infrastructure

Navigate to the `infrastructure` directory to manage AWS resources:

```bash
cd infrastructure/terraform
# Initialize and apply Terraform...
```

See [infrastructure/README.md](./infrastructure/README.md) (if available) or the Terraform files for details.
