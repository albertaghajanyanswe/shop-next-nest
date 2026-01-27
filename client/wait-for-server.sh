#!/bin/sh
set -e
echo "Starting wait-for-server script..."

# Загрузи env переменные
if [ -f .env.dev ]; then
  export $(cat .env.dev | grep -v '#' | xargs)
fi

# Если переменная не установлена, используй default
SERVER_URL=${NEXT_PUBLIC_SERVER_SERVICE:-http://server:4000}
HEALTH_CHECK_URL="${SERVER_URL}/api/health"

echo "🔄 Waiting for server ($HEALTH_CHECK_URL) to be ready..."

max_attempts=60
attempt=0

while [ $attempt -lt $max_attempts ]; do
  if curl -sf "$HEALTH_CHECK_URL" > /dev/null 2>&1; then
    echo "✅ Server is ready!"
    break
  fi
  
  attempt=$((attempt + 1))
  echo "⏳ Attempt $attempt/$max_attempts - Server not ready yet, retrying in 2 seconds..."
  sleep 2
done

if [ $attempt -eq $max_attempts ]; then
  echo "❌ Server did not become ready after ${max_attempts} attempts"
  exit 1
fi

echo "🚀 Building Next.js app..."
npx next build --no-lint

echo "✅ Build complete! Starting server..."
exec node server.js