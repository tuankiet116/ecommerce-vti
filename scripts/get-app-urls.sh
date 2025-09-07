#!/bin/bash

# get-app-urls.sh - Script to get REAL AWS Load Balancer URLs after deployment
# Usage: ./get-app-urls.sh [prod|dev]
# Example URLs you'll get:
#   Frontend: http://a1b2c3d4e5f6-123456789.ap-southeast-2.elb.amazonaws.com
#   Backend:  http://a7b8c9d0e1f2-987654321.ap-southeast-2.elb.amazonaws.com

set -e

# Default values
NAMESPACE=""
HELP=false
ENVIRONMENT=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -n|--namespace)
      NAMESPACE="$2"
      shift 2
      ;;
    -e|--environment)
      ENVIRONMENT="$2"
      NAMESPACE="ecommerce-vti-$2"
      shift 2
      ;;
    -h|--help)
      HELP=true
      shift
      ;;
    dev|prod)
      ENVIRONMENT="$1"
      NAMESPACE="ecommerce-vti-$1"
      shift
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

# Show help
if [ "$HELP" = true ]; then
  echo "Usage: $0 [OPTIONS] [dev|prod]"
  echo ""
  echo "Get application URLs for deployed services"
  echo ""
  echo "Options:"
  echo "  -n, --namespace    Kubernetes namespace"
  echo "  -e, --environment  Environment (dev/prod) - auto-sets namespace"
  echo "  -h, --help         Show this help message"
  echo ""
  echo "Examples:"
  echo "  $0 dev                    # Use dev environment"
  echo "  $0 prod                   # Use prod environment"
  echo "  $0 -n ecommerce-vti-dev   # Specify namespace directly"
  exit 0
fi

# Auto-detect namespace if not provided
if [ -z "$NAMESPACE" ]; then
  NAMESPACE="ecommerce-vti-dev"
  ENVIRONMENT="dev"
fi

echo "🔍 Getting application URLs for namespace: $NAMESPACE"
echo "=================================================="

# Check if namespace exists
if ! kubectl get namespace "$NAMESPACE" &> /dev/null; then
  echo "❌ Namespace '$NAMESPACE' not found"
  echo "💡 Available namespaces:"
  kubectl get namespaces | grep ecommerce-vti || echo "   No ecommerce-vti namespaces found"
  exit 1
fi

echo ""
echo "📊 Service Status:"
kubectl get services -n "$NAMESPACE" -o wide

echo ""
echo "🌐 Application URLs:"
echo "==================="

# Frontend URL
echo "� Frontend Application:"
FRONTEND_LB=$(kubectl get service frontend-loadbalancer -n "$NAMESPACE" -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "")
if [ ! -z "$FRONTEND_LB" ] && [ "$FRONTEND_LB" != "null" ]; then
  echo "   ✅ http://$FRONTEND_LB"
else
  echo "   ⏳ Load Balancer provisioning... (usually takes 3-5 minutes)"
  echo "   💡 Try: kubectl get service frontend-loadbalancer -n $NAMESPACE"
fi

echo ""
echo "🔧 Backend API:"
BACKEND_LB=$(kubectl get service backend-loadbalancer -n "$NAMESPACE" -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "")
if [ ! -z "$BACKEND_LB" ] && [ "$BACKEND_LB" != "null" ]; then
  echo "   ✅ API: http://$BACKEND_LB"
  echo "   📚 API Docs: http://$BACKEND_LB/docs"
  echo "   👨‍💼 Admin Panel: http://$BACKEND_LB/admin"
  echo "   📊 Horizon: http://$BACKEND_LB/horizon"
  echo "   📝 Log Viewer: http://$BACKEND_LB/log-viewer"
else
  echo "   ⏳ Load Balancer provisioning... (usually takes 3-5 minutes)"
  echo "   💡 Try: kubectl get service backend-loadbalancer -n $NAMESPACE"
fi

echo ""
echo "🔧 Alternative Access Methods:"
echo "=============================="
echo "If Load Balancers are not ready, you can use port forwarding:"
echo ""
echo "Frontend (port 3000):"
echo "  kubectl port-forward service/frontend-service 3000:3000 -n $NAMESPACE"
echo "  Then access: http://localhost:3000"
echo ""
echo "Backend (port 8000):"
echo "  kubectl port-forward service/backend-service 8000:9000 -n $NAMESPACE"
echo "  Then access: http://localhost:8000"
echo ""

echo "📋 Pod Status:"
kubectl get pods -n "$NAMESPACE"

echo ""
echo "✅ Use this script anytime: ./scripts/get-app-urls.sh $ENVIRONMENT"

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
