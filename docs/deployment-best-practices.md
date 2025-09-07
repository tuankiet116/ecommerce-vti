# Best Practice Kubernetes Deployment Architecture

## 1. Helm Charts (Recommended)
```yaml
# deployment/helm/ecommerce-vti/
Chart.yaml
values.yaml
values-prod.yaml  
values-dev.yaml
templates/
  deployment.yaml
  service.yaml
  configmap.yaml
  external-secrets.yaml
```

## 2. Kustomize với proper structure
```yaml
# deployment/k8s/
base/
  kustomization.yaml
  deployment.yaml
  service.yaml
overlays/
  prod/
    kustomization.yaml
    config-patch.yaml
  dev/
    kustomization.yaml
    config-patch.yaml
```

## 3. ArgoCD GitOps (Best practice)
- Git repository là single source of truth
- ArgoCD sync từ Git
- CI chỉ build & push images
- CD được handle bởi ArgoCD

## 4. Workflow Best Practice Structure:
```yaml
jobs:
  test: # Unit tests, integration tests
  build: # Build & push images  
  deploy-dev: # Auto deploy to dev
  deploy-prod: # Manual approval for prod
```
