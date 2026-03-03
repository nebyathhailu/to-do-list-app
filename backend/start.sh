#!/bin/bash
set -e

php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

php -S 0.0.0.0:10000 -t public/