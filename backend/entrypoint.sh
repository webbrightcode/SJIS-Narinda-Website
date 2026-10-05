#!/bin/sh
set -e

echo "=========================================================="
echo " Starting SJIS Narinda Backend Service"
echo "=========================================================="

# If PostgreSQL is configured, wait until it's ready to accept connections
if [ -n "$POSTGRES_HOST" ] || [ -n "$DATABASE_URL" ]; then
  echo "Waiting for database connection..."
  python << 'EOF'
import os
import sys
import time
import dj_database_url
import psycopg2

db_url = os.getenv("DATABASE_URL")
if db_url:
    cfg = dj_database_url.parse(db_url)
    dbname = cfg.get('NAME')
    user = cfg.get('USER')
    password = cfg.get('PASSWORD')
    host = cfg.get('HOST')
    port = cfg.get('PORT') or 5432
else:
    dbname = os.getenv("POSTGRES_DB", "sjis_db")
    user = os.getenv("POSTGRES_USER", "postgres")
    password = os.getenv("POSTGRES_PASSWORD", "postgres")
    host = os.getenv("POSTGRES_HOST", "localhost")
    port = os.getenv("POSTGRES_PORT", "5432")

max_retries = 30
for attempt in range(1, max_retries + 1):
    try:
        conn = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port,
            connect_timeout=3
        )
        conn.close()
        print(f"Database reachable at {host}:{port}/{dbname} (attempt {attempt}).")
        sys.exit(0)
    except Exception as e:
        print(f"Waiting for database... (attempt {attempt}/{max_retries}: {e})")
        time.sleep(2)

print("Error: Database connection timeout.")
sys.exit(1)
EOF
fi

echo "Applying database migrations..."
python manage.py migrate --noinput

echo "Setting up administrator superuser credentials..."
python manage.py setup_admin

echo "Checking baseline institutional and faculty seed data..."
python manage.py init_production_data

echo "Collecting static assets..."
python manage.py collectstatic --noinput

echo "=========================================================="
echo " Launching Gunicorn WSGI HTTP Server..."
echo "=========================================================="
exec "$@"
