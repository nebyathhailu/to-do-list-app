#!/bin/bash
set -e

# Run migrations
php artisan migrate --force

# Cache configs
php artisan config:cache
php artisan route:cache

# Start server
php -S 0.0.0.0:10000 -t public/
```

Make it executable and reference it as your start command:
```
bash start.sh