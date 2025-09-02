# Base stage for common setup
FROM php:8.4-fpm AS base

# Install dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libpq-dev zip unzip git curl libzip-dev libonig-dev \
    && docker-php-ext-install pdo pdo_pgsql pcntl zip bcmath mbstring \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy entrypoint script
COPY . .
RUN chmod +x ./docker/entrypoint.sh

# Development FPM stage
FROM base AS php-fpm
ENTRYPOINT ["./docker/entrypoint.sh"]
CMD ["php-fpm"]

# Development CLI stage
FROM base AS php-cli