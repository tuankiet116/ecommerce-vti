# E-commerce VTI - Deployment Guide

This directory contains all deployment configurations for the E-commerce VTI project, supporting both development and production environments on AWS EKS.

## 📁 Directory Structure

```
deployment/
├── docker/                    # Docker configurations
│   ├── backend.Dockerfile     # Multi-stage Dockerfile for Laravel backend
│   ├── frontend.Dockerfile    # Dockerfile for Next.js frontend
│   └── supervisor/            # Supervisor configs for backend services
├── helm/                      # Helm Chart (Primary deployment method)
│   ├── Chart.yaml             # Chart metadata
│   ├── values.yaml            # Default values
│   ├── values-dev.yaml        # Development overrides
│   ├── values-prod.yaml       # Production overrides
│   └── templates/             # Kubernetes templates
├── nginx/                     # Nginx configurations
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
4. **Helm v3.12+** installed

### Deployment with Helm Charts

1. **Deploy using Helm** (Recommended):

    ```bash
    # For development
    cd deployment/helm
    helm upgrade --install ecommerce-vti . \
      --namespace ecommerce-vti-dev \
      --create-namespace \
      --values ./values.yaml \
      --values ./values-dev.yaml \
      --set image.tag=your-image-tag

    # For production
    helm upgrade --install ecommerce-vti . \
      --namespace ecommerce-vti-prod \
      --create-namespace \
      --values ./values.yaml \
      --values ./values-prod.yaml \
      --set image.tag=your-image-tag
    ```

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

### **AWS Secrets Configuration:**

**Development:**

```bash
aws secretsmanager create-secret
  --name "ecommerce-vti/backend/dev"
  --secret-string '{
    "APP_KEY": "base64:your-dev-key",
    "MAIL_MAILER": "smtp",
    "MAIL_HOST": "smtp.gmail.com",
    "MAIL_PORT": "587",
    "MAIL_USERNAME": "your-email@gmail.com",
    "MAIL_PASSWORD": "your-app-password",
    "MAIL_FROM_ADDRESS": "noreply@ecommerce-vti.dev",
    "MAIL_FROM_NAME": "E-commerce VTI Dev"
  }'
```

**Production:**

````bash
aws secretsmanager create-secret
  --name "ecommerce-vti/backend/prod"
  --secret-string '{
    "APP_KEY": "base64:your-prod-key",
    "MAIL_MAILER": "smtp",
    "MAIL_HOST": "smtp.gmail.com",
    "MAIL_PORT": "587",
    "MAIL_USERNAME": "your-email@gmail.com",
    "MAIL_PASSWORD": "your-app-password",
    "MAIL_FROM_ADDRESS": "noreply@ecommerce-vti.com",
    "MAIL_FROM_NAME": "E-commerce VTI"
  }'
```    **Frontend Secrets** (`ecommerce-vti/frontend/{env}`):

    ```json
    {
        "NEXT_PUBLIC_API_URL": "https://api.ecommerce-vti.example.com"
    }
    ```

### Manual Deployment

**Note:** With Helm Charts, manual deployment is simplified:

1. **Build and Push Images**:

    ```bash
    # Build images
    docker build -f deployment/docker/backend.Dockerfile -t your-registry/backend:tag --target production .
    docker build -f deployment/docker/backend.Dockerfile -t your-registry/horizon:tag --target horizon .
    docker build -f deployment/docker/backend.Dockerfile -t your-registry/scheduler:tag --target scheduler .
    docker build -f deployment/docker/frontend.Dockerfile -t your-registry/frontend:tag .

    # Push images
    docker push your-registry/backend:tag
    docker push your-registry/horizon:tag
    docker push your-registry/scheduler:tag
    docker push your-registry/frontend:tag
    ```

2. **Deploy with Helm**:

    ```bash
    cd deployment/helm
    helm upgrade --install ecommerce-vti . \
      --namespace your-namespace \
      --create-namespace \
      --values ./values-{environment}.yaml \
      --set image.tag=your-tag
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
````

## 🔄 Environment Differences

| Feature           | Development                   | Production                 |
| ----------------- | ----------------------------- | -------------------------- |
| Replicas          | 1 each                        | 3 each                     |
| Resources         | Lower limits                  | Higher limits              |
| Secrets           | dev namespace                 | prod namespace             |
| Domain            | dev.ecommerce-vti.example.com | ecommerce-vti.example.com  |
| Database          | postgres-dev (256Mi/250m)     | postgres-prod (512Mi/500m) |
| Redis             | redis-dev (128Mi/100m)        | redis-prod (256Mi/200m)    |
| Database Password | devpassword123                | prodpassword123            |
| Database Name     | ecommerce_vti_dev             | ecommerce_vti_prod         |

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
