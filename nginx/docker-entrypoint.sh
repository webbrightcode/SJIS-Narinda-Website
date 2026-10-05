#!/bin/sh
set -e

DOMAIN="narinda.sjis.edu.bd"
CERT_DIR="/etc/letsencrypt/live/$DOMAIN"
CERT_FILE="$CERT_DIR/fullchain.pem"
KEY_FILE="$CERT_DIR/privkey.pem"

# Ensure directories exist
mkdir -p "$CERT_DIR"
mkdir -p /var/www/certbot
mkdir -p /var/www/static
mkdir -p /var/www/media

# If valid SSL certificates are not yet present, generate self-signed fallback
# so Nginx boots successfully without certificate missing errors.
if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
    echo "Notice: SSL certificates for $DOMAIN not found at $CERT_FILE"
    echo "Creating temporary self-signed certificate for bootstrap..."
    openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
        -keyout "$KEY_FILE" \
        -out "$CERT_FILE" \
        -subj "/CN=$DOMAIN/O=St. Joseph International School/C=BD" > /dev/null 2>&1
    echo "Temporary certificate generated."
fi

exec "$@"
