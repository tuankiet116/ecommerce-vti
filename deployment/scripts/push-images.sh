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

echo "🚀 Pushing Docker images to ECR for ${ENVIRONMENT} environment..."

# Login to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

# ECR repository URL
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Push images
echo "Pushing backend application image..."
docker push ${ECR_REGISTRY}/${ECR_REPOSITORY}:backend-${BACKEND_IMAGE_TAG}

echo "Pushing horizon worker image..."
docker push ${ECR_REGISTRY}/${ECR_REPOSITORY}:horizon-${BACKEND_IMAGE_TAG}

echo "Pushing scheduler worker image..."
docker push ${ECR_REGISTRY}/${ECR_REPOSITORY}:scheduler-${BACKEND_IMAGE_TAG}

echo "Pushing frontend application image..."
docker push ${ECR_REGISTRY}/${ECR_REPOSITORY}:frontend-${FRONTEND_IMAGE_TAG}

echo "✅ All images pushed successfully to ECR!"
echo "Repository: ${ECR_REPOSITORY}"
echo "Images:"
echo "  - backend-${BACKEND_IMAGE_TAG}"
echo "  - horizon-${BACKEND_IMAGE_TAG}"
echo "  - scheduler-${BACKEND_IMAGE_TAG}"
echo "  - frontend-${FRONTEND_IMAGE_TAG}"
