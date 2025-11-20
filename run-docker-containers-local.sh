#!/bin/bash

set -e  # Остановить при ошибке

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Директория для бэкапов
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

# Имя файла с датой и временем
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

echo -e "${YELLOW}=== Starting deployment ===${NC}"

# Проверяем, запущен ли контейнер БД
if docker ps --format '{{.Names}}' | grep -q '^db$'; then
    echo -e "${GREEN}Creating database backup...${NC}"

    # Создаём бэкап
    if docker exec db pg_dump -U postgres mystore-dev > "$BACKUP_FILE" 2>/dev/null; then
        echo -e "${GREEN}✓ Backup created: $BACKUP_FILE${NC}"

        # Оставляем только последние 10 бэкапов
        ls -t "$BACKUP_DIR"/db_backup_*.sql | tail -n +11 | xargs -r rm
        echo -e "${GREEN}✓ Old backups cleaned (kept last 10)${NC}"
    else
        echo -e "${YELLOW}⚠ Database backup failed (container might be empty or not ready)${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Database container not running, skipping backup${NC}"
fi

echo -e "${YELLOW}Stopping containers...${NC}"
docker-compose down --remove-orphans

echo -e "${YELLOW}Building containers...${NC}"
docker-compose -f docker-compose-no-nginx.yml build --no-cache

echo -e "${YELLOW}Starting containers...${NC}"
docker-compose -f docker-compose.yml up --remove-orphans -d

echo -e "${GREEN}=== Deployment completed ===${NC}"
echo -e "${GREEN}Backup location: $BACKUP_FILE${NC}"

# Показать статус контейнеров
sleep 3
docker-compose ps