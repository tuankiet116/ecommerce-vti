#!/bin/bash

set -e

# Configuration
ENVIRONMENT=${1:-dev}
AWS_REGION=${AWS_REGION:-us-east-1}
AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID:-234139188789}

# Load environment-specific configuration
if [ -f "deployment/k8s/environments/${ENVIRONMENT}/.env" ]; then
    source "deployment/k8s/environments/${ENVIRONMENT}/.env"
else
    echo "Environment configuration not found: deployment/k8s/environments/${ENVIRONMENT}/.env"
    exit 1
fi

echo "🏗️  Building Docker images for ${ENVIRONMENT} environment..."

# Build backend images
echo "Building backend application image..."
docker build -f deployment/docker/backend.Dockerfile -t backend:${BACKEND_IMAGE_TAG} --target production .

echo "Building horizon worker image..."
docker build -f deployment/docker/backend.Dockerfile -t horizon:${BACKEND_IMAGE_TAG} --target horizon .

echo "Building scheduler worker image..."
docker build -f deployment/docker/backend.Dockerfile -t scheduler:${BACKEND_IMAGE_TAG} --target scheduler .

# Build frontend image
echo "Building frontend application image..."
docker build -f deployment/docker/frontend.Dockerfile -t frontend:${FRONTEND_IMAGE_TAG} .

# Tag images for ECR
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

docker tag backend:${BACKEND_IMAGE_TAG} ${ECR_REGISTRY}/${ECR_REPOSITORY}:backend-${BACKEND_IMAGE_TAG}
docker tag horizon:${BACKEND_IMAGE_TAG} ${ECR_REGISTRY}/${ECR_REPOSITORY}:horizon-${BACKEND_IMAGE_TAG}
docker tag scheduler:${BACKEND_IMAGE_TAG} ${ECR_REGISTRY}/${ECR_REPOSITORY}:scheduler-${BACKEND_IMAGE_TAG}
docker tag frontend:${FRONTEND_IMAGE_TAG} ${ECR_REGISTRY}/${ECR_REPOSITORY}:frontend-${FRONTEND_IMAGE_TAG}

echo "✅ Docker images built successfully!"
echo "Images tagged for ECR repository: ${ECR_REPOSITORY}"
