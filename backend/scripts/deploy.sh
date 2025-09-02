#!/bin/bash
php artisan migrate --force
php artisan horizon:pause || echo "⚠️ Horizon may not be running"
sudo chmod -R 775 storage/ bootstrap/cache/
sudo supervisorctl restart shopera-horizon || echo "⚠️ Failed to restart Supervisor"
php artisan horizon:continue || echo "⚠️ Failed to resume Horizon"
sudo systemctl restart php8.4-fpm
sudo systemctl reload nginx