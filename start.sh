#!/bin/sh
set -e
npx prisma db push --accept-data-loss
npx prisma db seed
cd .next/standalone
exec node server.js
