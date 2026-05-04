#!/usr/bin/env bash
# Поднять сайт «в интернет»: Nginx → Next.js на 3002, затем HTTPS (Let's Encrypt).
# Запуск на VPS под root из каталога репозитория (обычно /var/www/septus):
#
#   cd /var/www/septus && git pull
#   bash deploy/enable-public-site.sh ваш-домен.ru ваш@email.ru
#
# Если нет записи DNS для www, только вершина домена:
#   SKIP_WWW=1 bash deploy/enable-public-site.sh ваш-домен.ru ваш@email.ru
#
# До запуска: в REG.RU A-запись @ → IP сервера (и www → тот же IP, если без SKIP_WWW).

set -euo pipefail

DOMAIN="${1:-}"
EMAIL="${2:-}"

usage() {
  echo "Использование:"
  echo "  bash deploy/enable-public-site.sh <домен> <email-для-certbot>"
  echo "Пример:"
  echo "  bash deploy/enable-public-site.sh septus.ru admin@septus.ru"
  echo "Только домен без www:"
  echo "  SKIP_WWW=1 bash deploy/enable-public-site.sh septus.ru admin@septus.ru"
  exit 1
}

[[ -z "$DOMAIN" || -z "$EMAIL" ]] && usage

if [[ "${SKIP_WWW:-0}" == "1" ]]; then
  SERVER_NAMES="$DOMAIN"
else
  SERVER_NAMES="$DOMAIN www.$DOMAIN"
fi

echo "==> certbot / nginx пакеты"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y certbot python3-certbot-nginx nginx

mkdir -p /var/www/html

echo "==> Конфиг Nginx: server_name $SERVER_NAMES"
cat >/etc/nginx/sites-available/septus <<NGINX
upstream septus_next {
    server 127.0.0.1:3002;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name ${SERVER_NAMES};

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        proxy_pass http://septus_next;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 60s;
        proxy_redirect off;
    }
}
NGINX

# У тимвебового пакета иногда уже есть свой default — чтобы не конфликтовал серверный блок.
if [[ -e /etc/nginx/sites-enabled/default ]]; then
  rm -f /etc/nginx/sites-enabled/default
fi

ln -sf /etc/nginx/sites-available/septus /etc/nginx/sites-enabled/septus

nginx -t
systemctl reload nginx

echo "==> Сертификат Let's Encrypt (убедитесь, что DNS уже смотрит на этот сервер)"
if [[ "${SKIP_WWW:-0}" == "1" ]]; then
  certbot --nginx \
    --non-interactive --agree-tos -m "$EMAIL" \
    --redirect \
    -d "$DOMAIN"
else
  certbot --nginx \
    --non-interactive --agree-tos -m "$EMAIL" \
    --redirect \
    -d "$DOMAIN" -d "www.$DOMAIN"
fi

echo ""
echo "==> Обновите base URL приложения под HTTPS и пересоберите:"
echo "    nano /var/www/septus/.env"
echo "    # NEXT_PUBLIC_BASE_URL=https://${DOMAIN}"
echo "    cd /var/www/septus && npm run build && pm2 reload deploy/ecosystem.config.cjs --update-env"
echo ""
echo "Откройте в браузере: https://${DOMAIN}"
