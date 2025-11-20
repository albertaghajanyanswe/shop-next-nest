#!/bin/sh
# set -e

# # Используем переменную окружения DB_HOST, по умолчанию "db"
# DB_HOST=${DB_HOST:-db}

# echo "\n\n Waiting for database on $DB_HOST:5432..."

# while ! nc -z "$DB_HOST" 5432; do
#   echo "\n\n Database is unavailable - sleeping"
#   echo "Waiting for database on $DB_HOST:5432..."

#   sleep 0.5
# done

# echo "\n Database started"

# # Применяем миграции
# npx prisma migrate deploy

# # Генерируем Prisma client
# npx prisma generate

# # Запускаем приложение
# exec "$@"


set -e

DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}

echo "Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."

# Используем pg_isready (более надёжно)
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U postgres; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is ready!"

echo "Generating Prisma client..."
npx prisma generate

echo "Running Prisma db push..."
npx prisma db push

# Генерируем Prisma client

echo "Starting application..."
exec "$@"