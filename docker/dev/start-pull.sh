#!/bin/bash

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}=== Starting deployment ===${NC}"

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

COMPOSE_FILE=${COMPOSE_FILE:-docker-compose-pull.yml}
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

DB_CONTAINER=${DB_HOST:-db}
DB_NAME=${DB_DATABASE:-mystore-dev}
DB_USER=${DB_USER:-postgres}

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

# -----------------------------
# Проверка образов
# -----------------------------
echo -e "${YELLOW}Checking images...${NC}"

docker manifest inspect "${DOCKER_USERNAME}/shop-backend:${IMAGE_TAG}" > /dev/null || {
  echo -e "${RED}❌ Backend image not found${NC}"
  exit 1
}

docker manifest inspect "${DOCKER_USERNAME}/shop-client:${IMAGE_TAG}" > /dev/null || {
  echo -e "${RED}❌ Client image not found${NC}"
  exit 1
}

echo -e "${GREEN}✓ Images exist${NC}"

# -----------------------------
# Backup DB
# -----------------------------
if docker ps --format '{{.Names}}' | grep -q "^$DB_CONTAINER\$"; then
  echo -e "${YELLOW}Creating DB backup...${NC}"
  docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE" || true
  echo -e "${GREEN}✓ Backup: $BACKUP_FILE${NC}"
fi

# -----------------------------
# Pull
# -----------------------------
echo -e "${YELLOW}Pulling images...${NC}"
docker compose -f "$COMPOSE_FILE" pull

# -----------------------------
# Deploy
# -----------------------------
echo -e "${YELLOW}Starting containers...${NC}"
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

# -----------------------------
# Check
# -----------------------------
sleep 5
docker compose ps

echo -e "${GREEN}=== Deployment completed ===${NC}"
echo -e "${GREEN}Version: ${IMAGE_TAG}${NC}"