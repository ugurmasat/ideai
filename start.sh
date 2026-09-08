#!/bin/sh
set -e

echo "Starting IDEAI server..."

npx prisma db push --accept-data-loss
npx prisma db seed
cd .next/standalone
exec node server.js
