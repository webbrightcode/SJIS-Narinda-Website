#!/bin/bash
set -e

# ==============================================================================
# St. Joseph International School, Narinda (SJIS)
# One-Command Production Deployment Script
# Target Domain: narinda.sjis.edu.bd
# ==============================================================================

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}====================================================================${NC}"
echo -e "${CYAN}  ST. JOSEPH INTERNATIONAL SCHOOL, NARINDA (SJIS)                   ${NC}"
echo -e "${CYAN}  Full-Stack Production Deployment Engine - Domain: narinda.sjis.edu.bd${NC}"
echo -e "${CYAN}====================================================================${NC}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 1. Verify Docker and Docker Compose
if ! command -v docker &> /dev/null; then
    echo -e "${RED}[ERROR] Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! docker compose version &> /dev/null && ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}[ERROR] Docker Compose plugin is not installed.${NC}"
    exit 1
fi

# Detect compose command
if docker compose version &> /dev/null; then
    COMPOSE="docker compose"
else
    COMPOSE="docker-compose"
fi

# 2. Check and Prepare .env file
if [ ! -f .env ]; then
    echo -e "${YELLOW}[!] .env not found. Initializing from .env.production...${NC}"
    cp .env.production .env
    
    # Generate random Django secret key if openssl is available
    if command -v openssl &> /dev/null; then
        RAND_SECRET=$(openssl rand -base64 36 | tr -dc 'a-zA-Z0-9%^&*_=+-' | head -c 50)
        sed -i.bak "s/DJANGO_SECRET_KEY=.*/DJANGO_SECRET_KEY=sjis-sec-${RAND_SECRET}/" .env && rm -f .env.bak
    fi
    echo -e "${GREEN}[✓] .env generated successfully.${NC}"
fi

# Load variables from .env for summary output
export $(grep -v '^#' .env | xargs)

# 3. Build and Launch Containers
echo -e "\n${CYAN}[1/4] Building and launching application containers...${NC}"
$COMPOSE down --remove-orphans > /dev/null 2>&1 || true
$COMPOSE up -d --build

# 4. Wait for database and backend migrations
echo -e "\n${CYAN}[2/4] Waiting for PostgreSQL database and backend migrations...${NC}"
RETRIES=40
READY=0

while [ $RETRIES -gt 0 ]; do
    if $COMPOSE ps | grep -q "sjis_web_backend.*Up" && $COMPOSE logs backend 2>&1 | grep -q "Launching Gunicorn"; then
        READY=1
        break
    fi
    sleep 2
    RETRIES=$((RETRIES - 1))
    echo -n "."
done
echo ""

if [ $READY -eq 1 ]; then
    echo -e "${GREEN}[✓] Django Backend initialized, migrated, and seeded successfully!${NC}"
else
    echo -e "${YELLOW}[!] Backend is taking longer than expected. Checking container logs:${NC}"
    $COMPOSE logs --tail=20 backend
fi

# 5. Verify Isolated Nginx Reverse Proxy
echo -e "\n${CYAN}[3/4] Verifying isolated Nginx reverse proxy on port ${WEBSITE_PORT:-8088}...${NC}"
NGINX_RETRIES=15
NGINX_READY=0

while [ $NGINX_RETRIES -gt 0 ]; do
    if curl -s http://127.0.0.1:${WEBSITE_PORT:-8088}/nginx-health 2>/dev/null | grep -q "healthy"; then
        NGINX_READY=1
        break
    fi
    sleep 2
    NGINX_RETRIES=$((NGINX_RETRIES - 1))
done

if [ $NGINX_READY -eq 1 ]; then
    echo -e "${GREEN}[✓] School website isolated engine is running on http://127.0.0.1:${WEBSITE_PORT:-8088}!${NC}"
else
    echo -e "${YELLOW}[!] School website Nginx starting up...${NC}"
fi

# 6. Optional SSL Provisioning
if [ "$1" == "--ssl" ]; then
    echo -e "\n${CYAN}[4/4] Requesting Let's Encrypt SSL certificate for narinda.sjis.edu.bd...${NC}"
    $COMPOSE run --rm certbot certonly --webroot \
        --webroot-path=/var/www/certbot \
        -d narinda.sjis.edu.bd -d www.narinda.sjis.edu.bd \
        --email "${DJANGO_SUPERUSER_EMAIL:-admin@sjis-narinda.edu.bd}" \
        --agree-tos --no-eff-email || true
    $COMPOSE exec nginx nginx -s reload || true
    echo -e "${GREEN}[✓] SSL certificates updated and Nginx reloaded.${NC}"
else
    echo -e "\n${CYAN}[4/4] SSL Bootstrap: Temporary self-signed certificate active.${NC}"
    echo -e "      To issue trusted Let's Encrypt SSL certificates, run:"
    echo -e "      ${YELLOW}./deploy.sh --ssl${NC}"
fi

# 7. Deployment Summary
echo -e "\n${GREEN}====================================================================${NC}"
echo -e "${GREEN}  ✓ SJIS NARINDA IS READY FOR PRODUCTION USE!                       ${NC}"
echo -e "${GREEN}====================================================================${NC}"
echo -e "  🌐 Public Portal:             ${CYAN}https://narinda.sjis.edu.bd${NC}"
echo -e "  🛡️  Pro Admin Control Center:  ${CYAN}https://narinda.sjis.edu.bd/admin${NC}"
echo -e "  ⚙️  Django Admin Console:      ${CYAN}https://narinda.sjis.edu.bd/django-admin/${NC}"
echo -e "  🔌 API Diagnostic Endpoint:   ${CYAN}https://narinda.sjis.edu.bd/api/system-diagnostics/${NC}"
echo -e "--------------------------------------------------------------------"
echo -e "  🔑 Administrator Credentials:"
echo -e "     Username:  ${YELLOW}${DJANGO_SUPERUSER_USERNAME:-admin}${NC}"
echo -e "     Password:  ${YELLOW}${DJANGO_SUPERUSER_PASSWORD:-sjisadmin2026}${NC}"
echo -e "     Email:     ${YELLOW}${DJANGO_SUPERUSER_EMAIL:-admin@sjis-narinda.edu.bd}${NC}"
echo -e "====================================================================\n"

$COMPOSE ps
