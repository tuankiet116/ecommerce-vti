#!/bin/bash

set -e

# Configuration
ENVIRONMENT=${1:-dev}
AWS_REGION=${AWS_REGION:-us-east-1}

# Load environment-specific configuration
if [ -f "deployment/k8s/environments/${ENVIRONMENT}/.env" ]; then
    source "deployment/k8s/environments/${ENVIRONMENT}/.env"
else
    echo "Environment configuration not found: deployment/k8s/environments/${ENVIRONMENT}/.env"
    exit 1
fi

echo "🚀 Deploying to ${ENVIRONMENT} environment..."
echo "EKS Cluster: ${EKS_CLUSTER_NAME}"
echo "AWS Region: ${AWS_REGION}"

# Update kubeconfig
echo "Updating kubeconfig for EKS cluster..."
aws eks update-kubeconfig --region ${AWS_REGION} --name ${EKS_CLUSTER_NAME}

# Verify cluster connection
echo "Verifying cluster connection..."
kubectl cluster-info

# Install/upgrade external-secrets operator (if not exists)
echo "Checking external-secrets operator..."
if ! kubectl get namespace external-secrets-system &> /dev/null; then
    echo "Installing external-secrets operator..."
    helm repo add external-secrets https://charts.external-secrets.io
    helm repo update
    helm install external-secrets external-secrets/external-secrets -n external-secrets-system --create-namespace
    
    # Wait for external-secrets to be ready
    echo "Waiting for external-secrets operator to be ready..."
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=external-secrets -n external-secrets-system --timeout=300s
fi

# Deploy using Kustomize
echo "Deploying application manifests..."
cd deployment/k8s/environments/${ENVIRONMENT}

# Apply the manifests
kubectl apply -k .

echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=600s deployment/backend-app -n ecommerce-vti
kubectl wait --for=condition=available --timeout=600s deployment/frontend-app -n ecommerce-vti
kubectl wait --for=condition=available --timeout=600s deployment/horizon-worker -n ecommerce-vti
kubectl wait --for=condition=available --timeout=600s deployment/scheduler-worker -n ecommerce-vti

# Get service information
echo "✅ Deployment completed successfully!"
echo ""
echo "🔍 Service Information:"
kubectl get pods -n ecommerce-vti
echo ""
kubectl get services -n ecommerce-vti
echo ""
kubectl get ingress -n ecommerce-vti

# Show application URLs
echo ""
echo "🌐 Application URLs:"
if [ -n "${FRONTEND_DOMAIN}" ]; then
    echo "Frontend: https://${FRONTEND_DOMAIN}"
fi
if [ -n "${BACKEND_DOMAIN}" ]; then
    echo "Backend API: https://${BACKEND_DOMAIN}/api"
fi

echo ""
echo "📊 To check application status:"
echo "kubectl get pods -n ecommerce-vti"
echo "kubectl logs -f deployment/backend-app -n ecommerce-vti"
echo "kubectl logs -f deployment/frontend-app -n ecommerce-vti"
