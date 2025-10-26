#!/usr/bin/env sh
set -e

echo "Installing dependencies..."
npm ci

echo "Building..."
npm run build

echo "Deployment complete!"

