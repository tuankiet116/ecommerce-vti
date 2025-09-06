# Multi-stage Dockerfile for Laravel Backend
FROM php:8.4-fpm AS base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    zip \
    unzip \
    git \
    curl \
    libzip-dev \
    libonig-dev \
    supervisor \
    cron \
    && docker-php-ext-install pdo pdo_pgsql pcntl zip bcmath mbstring \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Create user for Laravel
RUN groupadd -g 1000 www \
    && useradd -u 1000 -ms /bin/bash -g www www

# Development stage
FROM base AS development
COPY ./backend .
RUN composer install --no-dev --optimize-autoloader
RUN chown -R www:www /var/www/html
USER www
EXPOSE 9000
CMD ["php-fpm"]

# Production stage
FROM base AS production
COPY ./backend .
RUN composer install --no-dev --optimize-autoloader --no-interaction
RUN php artisan config:cache || true
RUN php artisan route:cache || true
RUN php artisan view:cache || true
RUN chown -R www:www /var/www/html \
    && chmod -R 755 /var/www/html/storage
USER www
EXPOSE 9000
CMD ["php-fpm"]

# Horizon worker stage
FROM base AS horizon
COPY ./backend .
RUN composer install --no-dev --optimize-autoloader --no-interaction
RUN chown -R www:www /var/www/html
USER www
CMD ["php", "artisan", "horizon"]

# Scheduler stage
FROM base AS scheduler
COPY ./backend .
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Create cron job for Laravel scheduler
RUN echo "* * * * * www cd /var/www/html && php artisan schedule:run >> /dev/null 2>&1" > /etc/cron.d/laravel-scheduler
RUN chmod 0644 /etc/cron.d/laravel-scheduler
RUN crontab /etc/cron.d/laravel-scheduler

# Create supervisor config for cron
COPY deployment/docker/supervisor/cron.conf /etc/supervisor/conf.d/cron.conf

RUN chown -R www:www /var/www/html
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
