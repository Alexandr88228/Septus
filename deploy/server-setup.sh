#!/usr/bin/env bash
# Однократный запуск на ЧИСТОМ Ubuntu (от root или с sudo).
# bash deploy/server-setup.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/septus}"
DOMAIN="${DOMAIN:-}"

echo "==> Обновление пакетов"
apt-get update -y
apt-get install -y ca-certificates curl git nginx ufw

echo "==> Node.js 20 LTS (NodeSource)"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "==> PM2 глобально"
npm install -g pm2

echo "==> Firewall: SSH + HTTP + HTTPS"
ufw allow OpenSSH
ufw allow "Nginx Full"
ufw --force enable || true

echo "==> Каталог приложения: $APP_DIR"
mkdir -p "$APP_DIR"
chown -R "${SUDO_USER:-root}:${SUDO_USER:-root}" "$APP_DIR" 2>/dev/null || true

echo ""
echo "Дальше вручную (один раз):"
echo "1) Клонируйте репо:  git clone <URL_вашего_репо> $APP_DIR"
echo "2) Создайте $APP_DIR/.env по образцу .env.example / DEPLOY_GUIDE.md"
echo "3) cd $APP_DIR && npm ci && npm run build"
echo "4) pm2 start deploy/ecosystem.config.cjs && pm2 save && pm2 startup systemd -u root --hp /root"
echo "5) Скопируйте deploy/nginx-site.conf.example в /etc/nginx/sites-available/septus,"
echo "   замените server_name на ваш домен, затем:"
echo "   ln -sf /etc/nginx/sites-available/septus /etc/nginx/sites-enabled/"
echo "   nginx -t && systemctl reload nginx"
echo "6) Установите SSL: apt-get install -y certbot python3-certbot-nginx"
echo "   certbot --nginx -d ВАШ_ДОМЕН -d www.ВАШ_ДОМЕН"
if [[ -n "$DOMAIN" ]]; then
  echo "(вы передали DOMAIN=$DOMAIN — подставьте его в certbot и nginx)"
fi
echo ""
echo "GitHub Actions: добавьте секреты SSH_HOST, SSH_USER, SSH_PRIVATE_KEY, опционально DEPLOY_PATH=$APP_DIR"
