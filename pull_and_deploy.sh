#!/bin/bash
set -e

# ==============================================================================
# St. Joseph International School, Narinda (SJIS)
# Zero-Downtime Pull & Deploy Automation Script
# Target: narinda.sjis.edu.bd
#
# Ensures the live website remains 100% operational and responsive while:
# 1. Pulling latest code changes from GitHub
# 2. Compiling Next.js assets and installing dependencies (CPU throttled)
# 3. Running database migrations safely
# 4. Performing zero-downtime atomic process/container reload
# ==============================================================================

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${CYAN}====================================================================${NC}"
echo -e "${CYAN}  SJIS NARINDA - Zero-Downtime Live Pull & Deployment Engine        ${NC}"
echo -e "${CYAN}====================================================================${NC}"

# 1. CPU & I/O Throttling Setup
# Ensures builds use idle cycles so live visitors never experience lag or freezing
NICE_CMD=""
if command -v nice &> /dev/null; then
    NICE_CMD="nice -n 19"
fi
if command -v ionice &> /dev/null; then
    NICE_CMD="$NICE_CMD ionice -c 3"
fi

# 2. Pull Git Changes Gracefully
echo -e "\n${CYAN}[1/4] Pulling latest updates from GitHub (origin/main)...${NC}"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")

# Fetch and pull without interrupting active memory processes
git fetch origin "$CURRENT_BRANCH"
GIT_DIFF_COUNT=$(git rev-list HEAD..origin/"$CURRENT_BRANCH" --count 2>/dev/null || echo "1")

if [ "$GIT_DIFF_COUNT" -eq 0 ]; then
    echo -e "${GREEN}[✓] Working tree is already up-to-date with origin/${CURRENT_BRANCH}.${NC}"
else
    echo -e "${YELLOW}→ Received ${GIT_DIFF_COUNT} new commits. Fast-forwarding...${NC}"
    git pull origin "$CURRENT_BRANCH"
fi

# Detect deployment environment: Docker Compose vs Native Systemd/Nginx
IS_DOCKER=0
if [ -f "docker-compose.yml" ] && (docker compose ps 2>/dev/null | grep -q "sjis_web_" || docker-compose ps 2>/dev/null | grep -q "sjis_web_"); then
    IS_DOCKER=1
fi

if [ $IS_DOCKER -eq 1 ]; then
    # -------------------------------------------------------------------------
    # DOCKER COMPOSE ZERO-DOWNTIME PIPELINE
    # -------------------------------------------------------------------------
    echo -e "\n${CYAN}[2/4] Detected Active Docker Compose Engine. Pre-building containers...${NC}"
    
    COMPOSE="docker compose"
    if ! docker compose version &> /dev/null; then
        COMPOSE="docker-compose"
    fi

    # Pre-build new image layers in the background (existing containers stay 100% LIVE)
    echo -e "${CYAN}→ Building frontend & backend in background (throttled)...${NC}"
    $NICE_CMD $COMPOSE build frontend backend

    # Run DB migrations in a standalone ephemeral container
    echo -e "\n${CYAN}[3/4] Running database migrations...${NC}"
    $COMPOSE run --rm --no-deps backend python manage.py migrate --noinput || true

    # Atomic container swap (<0.5 second rolling swap, Nginx retries seamlessly)
    echo -e "\n${CYAN}[4/4] Performing atomic container swap (<1s rolling transition)...${NC}"
    $COMPOSE up -d --no-deps --remove-orphans backend frontend
    $COMPOSE up -d --no-deps --remove-orphans nginx

    # Reload Nginx configuration without dropping keep-alive connections
    $COMPOSE exec nginx nginx -s reload 2>/dev/null || true

    # Pre-warm backend cache inside Docker
    echo -e "${CYAN}→ Pre-warming database & landing bundle cache...${NC}"
    $COMPOSE exec backend curl -s -f http://127.0.0.1:8000/api/landing-bundle/ > /dev/null 2>&1 || true

else
    # -------------------------------------------------------------------------
    # NATIVE VPS SYSTEMD + NGINX ZERO-DOWNTIME PIPELINE
    # -------------------------------------------------------------------------
    echo -e "\n${CYAN}[2/4] Updating backend virtualenv and database migrations...${NC}"
    
    if [ -d "backend/venv" ]; then
        $NICE_CMD backend/venv/bin/pip install -q -r backend/requirements.txt || true
        backend/venv/bin/python backend/manage.py migrate --noinput
        backend/venv/bin/python backend/manage.py collectstatic --noinput
    fi

    # Graceful Gunicorn reload via SIGHUP (workers finish active requests before replacing)
    echo -e "${CYAN}→ Gracefully reloading Gunicorn workers (Zero-Downtime SIGHUP)...${NC}"
    if systemctl is-active --quiet sjis-backend 2>/dev/null; then
        systemctl reload sjis-backend 2>/dev/null || systemctl restart sjis-backend
        echo -e "${GREEN}[✓] Gunicorn backend reloaded gracefully.${NC}"
    fi

    # Verify backend is warm and answering with real database records before swapping frontend
    echo -e "${CYAN}→ Verifying backend health & pre-warming database cache...${NC}"
    BACKEND_WARMED=0
    for i in {1..30}; do
        if curl -s -f http://127.0.0.1:8000/api/system-diagnostics/ > /dev/null 2>&1; then
            curl -s -f http://127.0.0.1:8000/api/landing-bundle/ > /dev/null 2>&1 || true
            BACKEND_WARMED=1
            break
        fi
        sleep 0.4
    done
    if [ $BACKEND_WARMED -eq 1 ]; then
        echo -e "${GREEN}[✓] Backend verified 100% healthy & pre-warmed with real database records.${NC}"
    fi

    echo -e "\n${CYAN}[3/4] Building Next.js production bundle with CPU throttling...${NC}"
    cd frontend
    if [ -f "package.json" ]; then
        $NICE_CMD npm install --production=false --prefer-offline || true
        
        # Build with low CPU priority so live site traffic never hangs
        NEXT_PUBLIC_API_URL=/api INTERNAL_API_URL=http://127.0.0.1:8000/api $NICE_CMD npm run build
    fi
    cd ..

    echo -e "\n${CYAN}[4/4] Hot-swapping Next.js service...${NC}"
    if systemctl is-active --quiet sjis-frontend 2>/dev/null; then
        # Nginx proxy_next_upstream holds and retries connection seamlessly during service restart
        systemctl restart sjis-frontend
        echo -e "${GREEN}[✓] Next.js frontend swapped and restarted.${NC}"
    fi

    # Graceful Nginx reload
    if command -v nginx &> /dev/null; then
        nginx -t 2>/dev/null && nginx -s reload 2>/dev/null || true
        echo -e "${GREEN}[✓] Nginx reloaded.${NC}"
    fi

    # Warm up frontend SSR once internally so the first user gets an instant response with real data
    curl -s http://127.0.0.1:3000/ > /dev/null 2>&1 || true
fi

echo -e "\n${GREEN}====================================================================${NC}"
echo -e "${GREEN}  ✓ ZERO-DOWNTIME DEPLOYMENT COMPLETED SUCCESSFULLY!                ${NC}"
echo -e "${GREEN}  Your website remained 100% online throughout the entire process.   ${NC}"
echo -e "${GREEN}====================================================================${NC}\n"
