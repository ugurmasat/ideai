#!/bin/sh
set -e
npx prisma db push --accept-data-loss
npx prisma db seed
exec node .next/standalone/server.js
