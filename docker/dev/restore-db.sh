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

# -----------------------------
# Проверка параметра
# -----------------------------
if [ $# -lt 1 ]; then
  echo -e "${RED}❌ Usage: $0 <backup_file.sql>${NC}"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
  echo -e "${RED}❌ Backup file not found: $BACKUP_FILE${NC}"
  exit 1
fi

echo -e "${YELLOW}Restoring database from: $BACKUP_FILE${NC}"

# -----------------------------
# Настройки БД (можно брать из .env)
# -----------------------------
if [ -f .env ]; then
  set -o allexport
  source .env
  set +o allexport
fi

DB_CONTAINER=${DB_HOST:-db}
DB_NAME=${DB_DATABASE:-mystore-dev}
DB_USER=${DB_USER:-postgres}

# -----------------------------
# Проверка контейнера
# -----------------------------
if ! docker ps --format '{{.Names}}' | grep -q "^$DB_CONTAINER\$"; then
  echo -e "${RED}❌ DB container '$DB_CONTAINER' is not running${NC}"
  exit 1
fi

# -----------------------------
# Восстановление
# -----------------------------
docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" < "$BACKUP_FILE"

echo -e "${GREEN}✓ Database restored from $BACKUP_FILE${NC}"




# Например, восстановить бэкап по тегу Release_v1.0.1
./restore-db.sh backups/db_backup_Release_v1.0.1_20260329_152345.sql