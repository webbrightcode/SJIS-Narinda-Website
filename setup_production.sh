#!/bin/bash
set -e

# ==============================================================================
# St. Joseph International School, Narinda (SJIS)
# Bare-Metal / Native VPS Deployment Script (Ubuntu/Debian)
# Target Domain: narinda.sjis.edu.bd
# ==============================================================================

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}====================================================================${NC}"
echo -e "${CYAN}  SJIS NARINDA - Native VPS Setup (Ubuntu/Debian/Systemd)           ${NC}"
echo -e "${CYAN}====================================================================${NC}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 1. Ensure .env exists in backend
if [ ! -f backend/.env ]; then
    echo -e "${YELLOW}[!] Creating backend/.env from .env.production...${NC}"
    cp .env.production backend/.env
fi

# 2. Python Environment Setup
echo -e "\n${CYAN}[1/5] Setting up Python virtual environment...${NC}"
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r requirements.txt

# 3. Database Migrations, Superuser, and Data Seeding
echo -e "\n${CYAN}[2/5] Running migrations, admin setup, and seed data...${NC}"
./venv/bin/python manage.py migrate --noinput
./venv/bin/python manage.py setup_admin
./venv/bin/python manage.py init_production_data
./venv/bin/python manage.py collectstatic --noinput
cd ..

# 4. Frontend Build
echo -e "\n${CYAN}[3/5] Installing frontend dependencies & building Next.js...${NC}"
cd frontend
npm install --production=false
NEXT_PUBLIC_API_URL=/api INTERNAL_API_URL=http://127.0.0.1:8000/api npm run build
cd ..

# 5. Systemd Services & Nginx Config
echo -e "\n${CYAN}[4/5] Configuring systemd services & Nginx...${NC}"
if [ -d "/etc/systemd/system" ] && [ "$EUID" -eq 0 ]; then
    cp systemd/sjis-backend.service /etc/systemd/system/
    cp systemd/sjis-frontend.service /etc/systemd/system/
    systemctl daemon-reload
    systemctl enable --now sjis-backend
    systemctl enable --now sjis-frontend
    echo -e "${GREEN}[✓] Systemd services enabled and started.${NC}"

    if [ -d "/etc/nginx/sites-available" ]; then
        cp nginx/narinda.sjis.edu.bd.conf /etc/nginx/sites-available/
        ln -sf /etc/nginx/sites-available/narinda.sjis.edu.bd.conf /etc/nginx/sites-enabled/
        nginx -t && systemctl reload nginx
        echo -e "${GREEN}[✓] Nginx configuration activated.${NC}"
    fi
else
    echo -e "${YELLOW}[!] Not running as root or systemd not accessible.${NC}"
    echo -e "    Manual steps:"
    echo -e "    - sudo cp systemd/*.service /etc/systemd/system/"
    echo -e "    - sudo cp nginx/narinda.sjis.edu.bd.conf /etc/nginx/sites-available/"
    echo -e "    - sudo ln -s /etc/nginx/sites-available/narinda.sjis.edu.bd.conf /etc/nginx/sites-enabled/"
    echo -e "    - sudo systemctl daemon-reload && sudo systemctl restart sjis-backend sjis-frontend nginx"
fi

echo -e "\n${GREEN}====================================================================${NC}"
echo -e "${GREEN}  ✓ Native VPS Setup Completed for narinda.sjis.edu.bd              ${NC}"
echo -e "${GREEN}====================================================================${NC}"
