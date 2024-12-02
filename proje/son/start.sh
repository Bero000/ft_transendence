#!/bin/sh

current_dir=$(dirname "$(readlink -f "$0")")
cd "$current_dir"

# Doğru dizine geç ve işlemleri başlat
cd "$current_dir"  # Burada `manage.py` dosyasının bulunduğu dizini belirtmelisiniz
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py collectstatic --no-input
echo "Starting Daphne server..."
daphne -b 0.0.0.0 -p 8001 -e ssl:8080:privateKey=/etc/nginx/ssl/key.pem:certKey=/etc/nginx/ssl/cert.pem proje.asgi:application
echo "Daphne server started"