#!/bin/sh
set -e

DB_PATH="${DATABASE_PATH:-/data/production.sqlite3}"

echo "[entrypoint] PerpWiki starting..."

# If DB exists, verify it's not corrupt
if [ -f "$DB_PATH" ]; then
  if sqlite3 "$DB_PATH" "PRAGMA integrity_check;" >/dev/null 2>&1; then
    echo "[entrypoint] Database OK ($(du -h "$DB_PATH" | cut -f1))"
  else
    echo "[entrypoint] Database is corrupt — removing"
    rm -f "$DB_PATH" "$DB_PATH-wal" "$DB_PATH-shm"
  fi
fi

# If no DB, try restoring from S3
if [ ! -f "$DB_PATH" ]; then
  if [ -n "$LITESTREAM_S3_BUCKET" ] && command -v litestream >/dev/null 2>&1; then
    echo "[entrypoint] Restoring from S3..."
    if litestream restore -config /app/litestream.yml "$DB_PATH" 2>/dev/null; then
      echo "[entrypoint] S3 restore OK ($(du -h "$DB_PATH" | cut -f1))"
    else
      echo "[entrypoint] S3 restore failed (no backup exists yet)"
      rm -f "$DB_PATH" "$DB_PATH-wal" "$DB_PATH-shm"
    fi
  fi

  # Copy seed database from the image
  if [ ! -f "$DB_PATH" ] && [ -f /app/seed.db ]; then
    cp /app/seed.db "$DB_PATH"
    echo "[entrypoint] Seed database copied ($(du -h "$DB_PATH" | cut -f1))"
  fi
fi

# Apply migrations
echo "[entrypoint] Applying migrations..."
for f in prisma/migrations/*/migration.sql; do
  [ -f "$f" ] && sqlite3 "$DB_PATH" < "$f" 2>/dev/null || true
done
echo "[entrypoint] Migrations complete"

echo "[entrypoint] Starting server on port ${PORT:-4001}..."
exec node server.js
