#!/usr/bin/env bash
# Запуск на VPS под root (один раз).
#
# Если вставка из Windows даёт мусор ^[[200~ или "bash~": вводите команды по строкам
# или отключите bracketed paste в настройках терминала.
#
# Если нет curl:
#   apt-get update && apt-get install -y curl ca-certificates
# Альтернатива загрузки скрипта:
#   wget -qO- https://raw.githubusercontent.com/Alexandr88228/Septus/main/deploy/install-on-server.sh | bash
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/Alexandr88228/Septus.git}"
APP_DIR="${APP_DIR:-/var/www/septus}"
BRANCH="${BRANCH:-main}"

echo "==> Пакеты (Node 20, git, nginx, ufw)"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y ca-certificates curl git nginx ufw

if ! command -v node >/dev/null 2>&1 || [[ "$(node -v 2>/dev/null || true)" != v20* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

npm install -g pm2

ufw allow OpenSSH || true
ufw allow "Nginx Full" || true
yes | ufw enable || true

echo "==> Код в $APP_DIR"
mkdir -p "$(dirname "$APP_DIR")"
if [[ ! -d "$APP_DIR/.git" ]]; then
  git clone --branch "$BRANCH" --depth 1 "$REPO_URL" "$APP_DIR"
else
  cd "$APP_DIR"
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
  git reset --hard "origin/$BRANCH"
fi

cd "$APP_DIR"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo ""
  echo ">>> Создан .env из .env.example. Отредактируйте: nano $APP_DIR/.env"
  echo ">>>    NEXT_PUBLIC_BASE_URL=https://ваш-домен.ru"
  echo ">>>    Bitrix/Telegram при необходимости"
  echo ""
fi

echo "==> Сборка"
npm ci
npm run build

echo "==> PM2"
if pm2 describe septus >/dev/null 2>&1; then
  pm2 reload deploy/ecosystem.config.cjs --update-env
else
  pm2 start deploy/ecosystem.config.cjs
fi
pm2 save

echo ""
echo "Готово. Приложение на http://127.0.0.1:3002"
echo "Дальше: nginx + SSL по deploy/nginx-site.conf.example и certbot."
echo "Чтобы вход по ключу с ПК работал без пароля:"
echo "  mkdir -p ~/.ssh && chmod 700 ~/.ssh"
echo "  nano ~/.ssh/authorized_keys   # вставьте строку из id_ed25519_deploy.pub"
echo "  chmod 600 ~/.ssh/authorized_keys"
