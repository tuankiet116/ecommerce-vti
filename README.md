# Ecommerce VTI mock project

## Prerequisites

- Docker & Docker Compose (recommended)
- Or, for manual setup:
    - PHP 8.3 or higher
    - Composer
    - PostgreSQL 16
    - Redis

---

## Quick Start with Docker

1. **Clone the repository:**

    ```zsh
    git clone <your-repo-url>
    cd backend
    ```

2. **Copy environment file:**

    ```zsh
    cp .env.example .env
    ```

3. **Configure environment variables:**

    - Edit `.env` to set your PostgreSQL and Redis credentials if needed.

4. **Start the containers:**

    ```zsh
    docker-compose up -d
    ```

5. **Install dependencies and generate key:**

    ```zsh
    docker-compose exec app composer install
    docker-compose exec app php artisan key:generate
    docker-compose exec app php artisan migrate --seed
    docker-compose exec app php optimize
    ```

6. **Access the application:**
    - The backend should be available at `http://localhost:8888` (or as configured in `docker-compose.yml`).
    - Horizon dashboard: `http://localhost:8888/horizon`
    - API Documentation: `http://localhost:8888/docs`
    - Log Viewer: `http://localhost:8888/log-viewer`

---

## Manual Setup (Local Machine)

1. **Clone the repository:**

    ```zsh
    git clone <your-repo-url>
    cd backend
    ```

2. **Install PHP dependencies:**

    ```zsh
    composer install
    ```

3. **Copy environment file and configure:**
    ```zsh
    cp .env.example .env
    ```
    - Edit `.env` to set your PostgreSQL and Redis credentials.

4 **Generate application key:**

```zsh
php artisan key:generate
```

5. **Run migrations and seeders:**

    ```zsh
    php artisan migrate --seed
    ```

6. **Start the queue worker and Horizon:**

    ```zsh
    php artisan horizon
    ```

7. **Start the development server:**
    ```zsh
    php artisan serve
    ```
    - The backend will be available at `http://localhost:8000`.
    - Horizon dashboard: `http://localhost:8000/horizon`
    - API Documentation: `http://localhost:8000/docs`
    - Log Viewer: `http://localhost:8000/log-viewer`

---

## Useful Commands

- Run tests:
    ```zsh
    php artisan test
    ```
- Start Horizon:
    ```zsh
    php artisan horizon
    ```

---

## Project Structure

- `app/` - Application core (Controllers, Models, Services, etc.)
- `routes/` - API and web routes
- `database/` - Migrations, seeders, factories
- `public/` - Public assets and entry point
- `resources/` - Views and frontend assets
- `docker/` - Docker configuration files

---

## Troubleshooting

- Ensure your `.env` file is properly configured for PostgreSQL and Redis.
- For Docker, ensure ports are not in use and Docker is running.
- For manual setup, ensure PHP, Composer, Node.js, PostgreSQL, and Redis are installed and running.

---

## 🌐 Application Access

### Local Development
- **Backend API**: `http://localhost:8000` (or `http://localhost:8888` with Docker)
- **Admin Panel**: `http://localhost:8000/admin`
- **Frontend**: `http://localhost:3000`
- **API Documentation**: `http://localhost:8000/docs`
- **Horizon Dashboard**: `http://localhost:8000/horizon`
- **Log Viewer**: `http://localhost:8000/log-viewer`

### Production (AWS EKS - Real URLs, No Domain Required)
After deployment, applications are accessible via **real AWS Load Balancer URLs**:

#### 🎯 Get Your Real Application URLs
```bash
# Quick way - Use our helper script to get REAL URLs
./scripts/get-app-urls.sh prod        # Production URLs
./scripts/get-app-urls.sh dev         # Development URLs

# Manual way - Get Real Load Balancer URLs
kubectl get service frontend-loadbalancer -n ecommerce-vti-prod
kubectl get service backend-loadbalancer -n ecommerce-vti-prod
```

#### 🌐 Real Production Access Points
You'll get URLs like these (examples):
- **Frontend**: `http://a1b2c3d4e5f6-123456789.ap-southeast-2.elb.amazonaws.com`
- **API**: `http://a7b8c9d0e1f2-987654321.ap-southeast-2.elb.amazonaws.com`
- **API Docs**: `http://a7b8c9d0e1f2-987654321.ap-southeast-2.elb.amazonaws.com/docs`
- **Admin Panel**: `http://a7b8c9d0e1f2-987654321.ap-southeast-2.elb.amazonaws.com/admin`
- **Horizon**: `http://a7b8c9d0e1f2-987654321.ap-southeast-2.elb.amazonaws.com/horizon`

> 💡 **AWS tự động tạo URL**: Sau khi deploy, AWS sẽ tự động tạo URL thực tế cho bạn!

#### Alternative Access (Port Forwarding)
If Load Balancers are not ready or for testing:
```bash
# Frontend
kubectl port-forward service/frontend-service 3000:3000 -n ecommerce-vti-prod
# Then access: http://localhost:3000

# Backend
kubectl port-forward service/backend-service 8000:9000 -n ecommerce-vti-prod  
# Then access: http://localhost:8000
```

**⏳ Note**: Load Balancers typically take 3-5 minutes to provision after first deployment.

---
