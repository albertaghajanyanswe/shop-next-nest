#!/bin/bash

BACKUP_DIR="./backups"

echo "Available backups:"
ls -lh "$BACKUP_DIR"/db_backup_*.sql 2>/dev/null || { echo "No backups found"; exit 1; }

read -p "Enter backup filename to restore: " BACKUP_FILE

if [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
    echo "File not found!"
    exit 1
fi

read -p "This will OVERWRITE current database. Continue? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "Cancelled"
    exit 0
fi

echo "Restoring from $BACKUP_FILE..."
docker exec -i db psql -U postgres mystore-dev < "$BACKUP_DIR/$BACKUP_FILE"
echo "✓ Database restored!"