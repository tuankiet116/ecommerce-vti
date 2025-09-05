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
