#!/bin/bash

# Script to get LoadBalancer URLs after deployment
# Usage: ./get-app-urls.sh [dev|prod]

ENVIRONMENT=${1:-dev}
NAMESPACE="ecommerce-vti-${ENVIRONMENT}"

echo "🔍 Getting LoadBalancer URLs for ${ENVIRONMENT} environment..."
echo "Namespace: ${NAMESPACE}"
echo ""

# Get Frontend URL
echo "🌐 Frontend Application:"
FRONTEND_LB=$(kubectl get svc frontend-loadbalancer -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null)
if [[ -n "$FRONTEND_LB" ]]; then
    echo "✅ Frontend URL: http://$FRONTEND_LB"
else
    echo "⏳ Frontend LoadBalancer still provisioning..."
fi

# Get Backend URL  
echo ""
echo "🚀 Backend API:"
BACKEND_LB=$(kubectl get svc backend-loadbalancer -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null)
if [[ -n "$BACKEND_LB" ]]; then
    echo "✅ Backend URL: http://$BACKEND_LB"
else
    echo "⏳ Backend LoadBalancer still provisioning..."
fi

# Show all services
echo ""
echo "📋 All Services:"
kubectl get svc -n $NAMESPACE -o wide

echo ""
echo "💡 Note: LoadBalancer URLs may take 2-3 minutes to become available after deployment."
echo "💡 You can also check AWS EC2 Console > Load Balancers for the NLB details."
