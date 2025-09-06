# E-commerce VTI Deployment Makefile
.PHONY: help build-dev build-prod push-dev push-prod deploy-dev deploy-prod test clean

# Default environment
ENV ?= dev

# Help command
help: ## Show this help message
	@echo "E-commerce VTI Deployment Commands"
	@echo "=================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development commands
build-dev: ## Build Docker images for development
	@echo "🏗️  Building development images..."
	@./deployment/scripts/build-images.sh dev

push-dev: ## Push Docker images to ECR (development)
	@echo "🚀 Pushing development images to ECR..."
	@./deployment/scripts/push-images.sh dev

deploy-dev: ## Deploy to development environment
	@echo "🚀 Deploying to development environment..."
	@./deployment/scripts/deploy.sh dev

# Production commands
build-prod: ## Build Docker images for production
	@echo "🏗️  Building production images..."
	@./deployment/scripts/build-images.sh prod

push-prod: ## Push Docker images to ECR (production)
	@echo "🚀 Pushing production images to ECR..."
	@./deployment/scripts/push-images.sh prod

deploy-prod: ## Deploy to production environment
	@echo "🚀 Deploying to production environment..."
	@./deployment/scripts/deploy.sh prod

# Combined commands
dev-full: build-dev push-dev deploy-dev ## Full development deployment (build + push + deploy)
	@echo "✅ Development deployment completed!"

prod-full: build-prod push-prod deploy-prod ## Full production deployment (build + push + deploy)
	@echo "✅ Production deployment completed!"

# ECR login
ecr-login: ## Login to ECR
	@echo "🔐 Logging in to ECR..."
	@aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 234139188789.dkr.ecr.us-east-1.amazonaws.com

# Kubernetes commands
k8s-status: ## Check Kubernetes cluster status
	@echo "📊 Checking Kubernetes status..."
	@kubectl get pods -n ecommerce-vti
	@echo ""
	@kubectl get services -n ecommerce-vti
	@echo ""
	@kubectl get ingress -n ecommerce-vti

k8s-logs-backend: ## Show backend logs
	@kubectl logs -f deployment/backend-app -n ecommerce-vti

k8s-logs-frontend: ## Show frontend logs
	@kubectl logs -f deployment/frontend-app -n ecommerce-vti

k8s-logs-horizon: ## Show horizon worker logs
	@kubectl logs -f deployment/horizon-worker -n ecommerce-vti

k8s-logs-scheduler: ## Show scheduler logs
	@kubectl logs -f deployment/scheduler-worker -n ecommerce-vti

# Local development commands
local-up: ## Start local development environment
	@echo "🏠 Starting local development environment..."
	@docker-compose up -d

local-down: ## Stop local development environment
	@echo "🏠 Stopping local development environment..."
	@docker-compose down

# Testing commands
test: ## Run all tests
	@echo "🧪 Running tests..."
	@cd backend && composer test
	@cd frontend && pnpm test

test-backend: ## Run backend tests only
	@echo "🧪 Running backend tests..."
	@cd backend && composer test

test-frontend: ## Run frontend tests only
	@echo "🧪 Running frontend tests..."
	@cd frontend && pnpm test

# Utility commands
clean: ## Clean up Docker images and containers
	@echo "🧹 Cleaning up Docker resources..."
	@docker system prune -f
	@docker image prune -f

clean-all: ## Clean up all Docker resources (including volumes)
	@echo "🧹 Cleaning up all Docker resources..."
	@docker system prune -af --volumes

# Environment setup
setup-aws: ## Setup AWS CLI and verify access
	@echo "⚙️  Setting up AWS CLI..."
	@aws sts get-caller-identity
	@aws eks list-clusters --region us-east-1

setup-kubectl: ## Setup kubectl for EKS
	@echo "⚙️  Setting up kubectl..."
	@aws eks update-kubeconfig --region us-east-1 --name DE000079-eks-$(ENV)
	@kubectl cluster-info

# Security scan
security-scan: ## Run security scan on Docker images
	@echo "🔒 Running security scan..."
	@docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image backend:latest
	@docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image frontend:latest

# Backup commands
backup-secrets: ## Backup secrets from AWS Secrets Manager
	@echo "💾 Backing up secrets..."
	@aws secretsmanager get-secret-value --secret-id ecommerce-vti/backend/$(ENV) --query SecretString --output text > backup-backend-$(ENV).json
	@aws secretsmanager get-secret-value --secret-id ecommerce-vti/frontend/$(ENV) --query SecretString --output text > backup-frontend-$(ENV).json
	@echo "Secrets backed up to backup-*-$(ENV).json"

# Monitoring commands
monitor: ## Show resource usage
	@echo "📊 Resource usage:"
	@kubectl top nodes
	@echo ""
	@kubectl top pods -n ecommerce-vti

# Update commands
update-deps: ## Update dependencies
	@echo "⬆️  Updating dependencies..."
	@cd backend && composer update
	@cd frontend && pnpm update

# Documentation
docs: ## Generate documentation
	@echo "📚 Generating documentation..."
	@cd backend && php artisan scribe:generate

# Default target
.DEFAULT_GOAL := help
