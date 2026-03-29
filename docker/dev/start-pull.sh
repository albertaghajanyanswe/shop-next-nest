#!/bin/bash

set -euo pipefail

# -----------------------------
# Всегда работать из папки скрипта
# -----------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# -----------------------------
# Цвета
# -----------------------------
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}=== Starting deployment ===${NC}"

# -----------------------------
# Load .env
# -----------------------------
if [ -f .env ]; then
  echo -e "${YELLOW}Loading .env...${NC}"
  set -o allexport
  source .env
  set +o allexport
else
  echo -e "${RED}❌ .env file not found${NC}"
  exit 1
fi

# -----------------------------
# Проверка env
# -----------------------------
if [ -z "${IMAGE_TAG:-}" ]; then
  echo -e "${RED}❌ IMAGE_TAG is not set${NC}"
  exit 1
fi

if [ -z "${DOCKER_USERNAME:-}" ]; then
  echo -e "${RED}❌ DOCKER_USERNAME is not set${NC}"
  exit 1
fi

echo -e "${GREEN}Deploying version: ${IMAGE_TAG}${NC}"

# -----------------------------
# Настройки
# -----------------------------
COMPOSE_FILE=${COMPOSE_FILE:-docker-compose-pull.yml}
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

DB_CONTAINER=${DB_HOST:-db}
DB_NAME=${DB_DATABASE:-mystore-dev}
DB_USER=${DB_USER:-postgres}

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/db_backup_${IMAGE_TAG}_$TIMESTAMP.sql"

# -----------------------------
# Проверка docker
# -----------------------------
if ! command -v docker >/dev/null 2>&1; then
  echo -e "${RED}❌ Docker is not installed${NC}"
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo -e "${RED}❌ Docker daemon is not running${NC}"
  exit 1
fi

# -----------------------------
# Проверка образов
# -----------------------------
echo -e "${YELLOW}Checking images...${NC}"

if ! docker manifest inspect "${DOCKER_USERNAME}/shop-backend:${IMAGE_TAG}" > /dev/null 2>&1; then
  echo -e "${RED}❌ Backend image not found${NC}"
  exit 1
fi

if ! docker manifest inspect "${DOCKER_USERNAME}/shop-client:${IMAGE_TAG}" > /dev/null 2>&1; then
  echo -e "${RED}❌ Client image not found${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Images exist${NC}"

# -----------------------------
# Backup DB
# -----------------------------
if docker ps --format '{{.Names}}' | grep -q "^$DB_CONTAINER\$"; then
  echo -e "${YELLOW}Creating DB backup...${NC}"

  if docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE" 2>/dev/null; then
    echo -e "${GREEN}✓ Backup created: $BACKUP_FILE${NC}"

    # Оставляем последние 10 бэкапов
    ls -t "$BACKUP_DIR"/db_backup_*.sql 2>/dev/null | tail -n +11 | xargs -r rm || true
  else
    echo -e "${YELLOW}⚠ Backup failed${NC}"
  fi
else
  echo -e "${YELLOW}⚠ DB container not running, skipping backup${NC}"
fi

# -----------------------------
# Pull
# -----------------------------
echo -e "${YELLOW}Pulling images...${NC}"
docker compose -f "$COMPOSE_FILE" pull

# -----------------------------
# Deploy (без downtime)
# -----------------------------
echo -e "${YELLOW}Starting containers...${NC}"
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

# -----------------------------
# Проверка статуса
# -----------------------------
echo -e "${YELLOW}Checking containers...${NC}"
sleep 5
docker compose -f "$COMPOSE_FILE" ps

echo -e "${GREEN}=== Deployment completed ===${NC}"
echo -e "${GREEN}Version: ${IMAGE_TAG}${NC}"