#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "============================================="
echo "==> [1/5] Installing Frontend Dependencies"
echo "============================================="
npm install --include=optional --include=dev

echo "============================================="
echo "==> [2/5] Building React Vite Frontend"
echo "============================================="
npm run build

echo "============================================="
echo "==> [3/5] Installing Python Dependencies"
echo "============================================="
pip install -r backend/requirements.txt

echo "============================================="
echo "==> [4/5] Applying Database Migrations"
echo "============================================="
python backend/manage.py migrate --no-input

echo "============================================="
echo "==> [4b/5] Seeding Products and Categories"
echo "============================================="
python backend/manage.py seed_products

echo "============================================="
echo "==> [5/5] Collecting Django Static Files"
echo "============================================="
python backend/manage.py collectstatic --no-input

echo "============================================="
echo "==> Aurelia Build Finished Successfully!"
echo "============================================="
