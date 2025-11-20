#!/bin/bash

set -e  # Остановить при ошибке

# -----------------------------
# Цвета для вывода
# -----------------------------
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# -----------------------------
# Настройки
# -----------------------------
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

# Берём переменные из .env, если есть
DB_CONTAINER=${DB_HOST:-db}
DB_NAME=${DB_DATABASE:-mystore-dev}
DB_USER=${DB_USER:-postgres}
DB_PORT=${DB_PORT:-5432}
COMPOSE_FILE=${COMPOSE_FILE:-docker-compose.yml}

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

echo -e "${YELLOW}=== Starting deployment ===${NC}"

# -----------------------------
# Проверка готовности БД
# -----------------------------
if docker ps --format '{{.Names}}' | grep -q "^$DB_CONTAINER\$"; then
    echo -e "${YELLOW}Waiting for PostgreSQL at $DB_CONTAINER:$DB_PORT...${NC}"
    until docker exec "$DB_CONTAINER" pg_isready -U "$DB_USER" -d "$DB_NAME" > /dev/null 2>&1; do
        echo -e "${YELLOW}PostgreSQL is unavailable - sleeping${NC}"
        sleep 2
    done
    echo -e "${GREEN}PostgreSQL is ready!${NC}"

    # -----------------------------
    # Создание бэкапа
    # -----------------------------
    echo -e "${GREEN}Creating database backup...${NC}"
    if docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE" 2>/dev/null; then
        echo -e "${GREEN}✓ Backup created: $BACKUP_FILE${NC}"

        # Оставляем только последние 10 бэкапов
        ls -t "$BACKUP_DIR"/db_backup_*.sql 2>/dev/null | tail -n +11 | xargs -r rm || true
        echo -e "${GREEN}✓ Old backups cleaned (kept last 10)${NC}"
    else
        echo -e "${YELLOW}⚠ Database backup failed${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Database container '$DB_CONTAINER' not running, skipping backup${NC}"
fi

# -----------------------------
# Остановка контейнеров
# -----------------------------
echo -e "${YELLOW}Stopping containers...${NC}"
docker-compose -f "$COMPOSE_FILE" down --remove-orphans

# -----------------------------
# Сборка контейнеров
# -----------------------------
echo -e "${YELLOW}Building containers...${NC}"
docker-compose -f "$COMPOSE_FILE" build

# -----------------------------
# Запуск контейнеров
# -----------------------------
echo -e "${YELLOW}Starting containers...${NC}"
docker-compose -f "$COMPOSE_FILE" up --remove-orphans -d

# -----------------------------
# Проверка статуса
# -----------------------------
sleep 3
docker-compose -f "$COMPOSE_FILE" ps

echo -e "${GREEN}=== Deployment completed ===${NC}"
echo -e "${GREEN}Backup location: $BACKUP_FILE${NC}"