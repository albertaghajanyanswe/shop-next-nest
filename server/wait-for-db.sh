#!/bin/bash

# # Ждем, пока база данных будет доступна на порту 5432
# until nc -z -v -w30 db 5432; do
#   echo "Waiting for database connection..."
#   sleep 1
# done

# # Когда база данных доступна, выполняем миграции и запускаем приложение
# echo "Database is up, running prisma db push"
# npx prisma db push

# # Запускаем приложение
# npm run start:dev










# # Скрипт ждёт пока Postgres будет доступен
# set -e

# host="$1"
# shift
# cmd="$@"

# until PGPASSWORD=$DB_PASSWORD psql -h "$host" -U "$DB_USER" -d "$DB_DATABASE" -c '\q'; do
#   >&2 echo "Postgres is unavailable - sleeping"
#   sleep 2
# done

# >&2 echo "Postgres is up - executing command"
# exec $cmd



set -e

host="$1"
shift
cmd="$@"

echo "Waiting for database connection on $host:5432..."

until nc -z "$host" 5432; do
  >&2 echo "Database is unavailable - sleeping"
  sleep 2
done

>&2 echo "Database is up - executing command"
exec $cmd