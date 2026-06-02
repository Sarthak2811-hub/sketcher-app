#!/bin/sh
set -e

echo "[startup] Running prisma db push to apply schema..."
npx prisma db push --schema=packages/db/prisma/schema.prisma --skip-generate

echo "[startup] Schema applied. Starting HTTP backend..."
exec node apps/http-backend/dist/index.js
