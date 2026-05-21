#!/bin/sh
set -e

echo "Running Prisma migrations..."

echo "$DB_URI" | sed -E 's#(postgresql://[^:]+:)[^@]+#\1****#'


npx prisma migrate deploy

echo "Starting application..."

exec "$@"