# E-commerce VTI - Deployment Guide

This directory contains all deployment configurations for the E-commerce VTI project, supporting both development and production environments on AWS EKS.

## 📁 Directory Structure

```
deployment/
├── docker/                    # Docker configurations
│   ├── backend.Dockerfile     # Multi-stage Dockerfile for Laravel backend
│   ├── frontend.Dockerfile    # Dockerfile for Next.js frontend
│   └── supervisor/            # Supervisor configs for backend services
├── k8s/                       # Kubernetes manifests
│   ├── base/                  # Base Kubernetes configurations
│   └── environments/          # Environment-specific overrides
│       ├── dev/               # Development environment
│       └── prod/              # Production environment
├── nginx/                     # Nginx configurations
├── scripts/                   # Deployment scripts
└── docker-compose.prod.yml    # Production Docker Compose
```

## 🏗️ Infrastructure Overview

### EKS Clusters

-   **Development**: `DE000079-eks-dev`
-   **Production**: `DE000079-eks-prod`

### ECR Repositories

-   **Development**: `de000079-ecr-repo-dev`
-   **Production**: `de000079-ecr-repo-prod`

### AWS Account

-   **Account ID**: `234139188789`
-   **Region**: `us-east-1`

## 🚀 Quick Start

### Prerequisites

1. AWS CLI configured with appropriate permissions
2. kubectl installed and configured
3. Docker installed
4. Helm installed (for external-secrets operator)

### Environment Setup

1. **Configure GitHub Secrets** (required for CI/CD):

    ```
    AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY

    # Development
    ECR_REPOSITORY_DEV=de000079-ecr-repo-dev
    EKS_CLUSTER_DEV=DE000079-eks-dev
    BACKEND_SECRETS_DEV=ecommerce-vti/backend/dev
    FRONTEND_SECRETS_DEV=ecommerce-vti/frontend/dev
    EXTERNAL_SECRETS_ROLE_DEV=arn:aws:iam::234139188789:role/external-secrets-dev-role

    # Production
    ECR_REPOSITORY_PROD=de000079-ecr-repo-prod
    EKS_CLUSTER_PROD=DE000079-eks-prod
    BACKEND_SECRETS_PROD=ecommerce-vti/backend/prod
    FRONTEND_SECRETS_PROD=ecommerce-vti/frontend/prod
    EXTERNAL_SECRETS_ROLE_PROD=arn:aws:iam::234139188789:role/external-secrets-prod-role
    ```

2. **Configure AWS Secrets Manager**:
   Create secrets in AWS Secrets Manager with the following structure:

    **Backend Secrets** (`ecommerce-vti/backend/{env}`):

    ```json
    {
        "APP_KEY": "base64:your-app-key",
        "DB_HOST": "your-database-host",
        "DB_DATABASE": "your-database-name",
        "DB_USERNAME": "your-database-user",
        "DB_PASSWORD": "your-database-password",
        "REDIS_HOST": "your-redis-host"
    }
    ```

    **Frontend Secrets** (`ecommerce-vti/frontend/{env}`):

    ```json
    {
        "NEXT_PUBLIC_API_URL": "https://api.ecommerce-vti.example.com"
    }
    ```

### Manual Deployment

1. **Build and Push Images**:

    ```bash
    # For development
    ./deployment/scripts/build-images.sh dev
    ./deployment/scripts/push-images.sh dev

    # For production
    ./deployment/scripts/build-images.sh prod
    ./deployment/scripts/push-images.sh prod
    ```

2. **Deploy to Kubernetes**:

    ```bash
    # For development
    ./deployment/scripts/deploy.sh dev

    # For production
    ./deployment/scripts/deploy.sh prod
    ```

## 🔄 CI/CD Pipeline

The project uses GitHub Actions for automated deployment:

-   **Staging Branch** → Deploys to Development Environment
-   **Main Branch** → Deploys to Production Environment

### Workflow Triggers

1. **Push to `staging`**: Triggers deployment to development
2. **Push to `main`**: Triggers deployment to production
3. **Pull Requests**: Runs tests only

### Pipeline Steps

1. **Test**: Run backend (PHPUnit) and frontend (build) tests
2. **Build**: Create Docker images for all services
3. **Push**: Upload images to ECR
4. **Deploy**: Update Kubernetes manifests and deploy to EKS

## 🐳 Docker Images

The project builds multiple Docker images:

### Backend Services

-   **backend**: Main Laravel application (PHP-FPM)
-   **horizon**: Queue worker service
-   **scheduler**: Cron job scheduler

### Frontend Service

-   **frontend**: Next.js application with standalone output

## ☸️ Kubernetes Architecture

### Services Deployed

-   **backend-app**: Laravel application (2-3 replicas)
-   **frontend-app**: Next.js application (2-3 replicas)
-   **horizon-worker**: Queue processing (1 replica)
-   **scheduler-worker**: Cron jobs (1 replica)

### External Dependencies

-   **External Secrets Operator**: Manages secrets from AWS Secrets Manager
-   **AWS Load Balancer Controller**: For ingress management

### Networking

-   **Ingress**: ALB with SSL termination
-   **Services**: ClusterIP for internal communication
-   **Health Checks**: Liveness and readiness probes

## 🔒 Security

### Secrets Management

-   Environment variables stored in AWS Secrets Manager
-   External Secrets Operator syncs secrets to Kubernetes
-   No hardcoded secrets in manifests

### Network Security

-   Rate limiting via nginx
-   Security headers configured
-   TLS termination at load balancer

### Container Security

-   Non-root user in containers
-   Multi-stage builds for smaller attack surface
-   Minimal base images (Alpine Linux)

## 📊 Monitoring & Logging

### Health Checks

-   **Backend**: TCP socket check on port 9000
-   **Frontend**: HTTP check on root path
-   **Database**: PostgreSQL ready check
-   **Redis**: Ping command check

### Logging

-   Container logs available via `kubectl logs`
-   Nginx access and error logs
-   Application logs to stderr/stdout

## 🛠️ Troubleshooting

### Common Issues

1. **Image Pull Errors**:

    ```bash
    # Check ECR login
    aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 234139188789.dkr.ecr.us-east-1.amazonaws.com
    ```

2. **Secret Sync Issues**:

    ```bash
    # Check external-secrets operator
    kubectl get externalsecrets -n ecommerce-vti
    kubectl describe externalsecret backend-secrets -n ecommerce-vti
    ```

3. **Pod Failures**:
    ```bash
    # Check pod status
    kubectl get pods -n ecommerce-vti
    kubectl describe pod <pod-name> -n ecommerce-vti
    kubectl logs <pod-name> -n ecommerce-vti
    ```

### Useful Commands

```bash
# Check cluster connection
kubectl cluster-info

# View all resources
kubectl get all -n ecommerce-vti

# Scale deployments
kubectl scale deployment backend-app --replicas=3 -n ecommerce-vti

# Update image
kubectl set image deployment/backend-app backend=new-image -n ecommerce-vti

# Port forward for local testing
kubectl port-forward service/frontend-service 3000:3000 -n ecommerce-vti
```

## 🔄 Environment Differences

| Feature    | Development                   | Production                |
| ---------- | ----------------------------- | ------------------------- |
| Replicas   | 1 each                        | 3 each                    |
| Resources  | Lower limits                  | Higher limits             |
| Secrets    | dev namespace                 | prod namespace            |
| Domain     | dev.ecommerce-vti.example.com | ecommerce-vti.example.com |
| Monitoring | Basic                         | Enhanced                  |

## 📝 Environment Variables

### Backend Configuration

-   `APP_ENV`: Application environment (production/development)
-   `APP_DEBUG`: Debug mode (true/false)
-   `DB_*`: Database connection details
-   `REDIS_HOST`: Redis server hostname
-   `CACHE_DRIVER`: Cache driver (redis)
-   `QUEUE_CONNECTION`: Queue driver (redis)

### Frontend Configuration

-   `NODE_ENV`: Node environment (production)
-   `NEXT_PUBLIC_API_URL`: Backend API URL
-   `NEXT_TELEMETRY_DISABLED`: Disable Next.js telemetry

## 🤝 Contributing

When making changes to deployment configurations:

1. Test in development environment first
2. Update this README if adding new features
3. Ensure secrets are properly configured
4. Test both manual and CI/CD deployment methods

## 📞 Support

For deployment issues:

1. Check the troubleshooting section
2. Review GitHub Actions logs
3. Check Kubernetes events and logs
4. Verify AWS resources (EKS, ECR, Secrets Manager)
