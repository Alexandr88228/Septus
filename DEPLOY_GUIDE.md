# DEPLOY GUIDE

## 1. Локальный запуск

```bash
npm install
npm run dev
```

Сайт откроется на `http://localhost:3002`.

## 2. Production-сборка

```bash
npm run build
```

Сборка теперь делает SSR/ISR Next.js app:

1. `scripts/prepare-catalog-assets.js` подготавливает изображения каталога.
2. `npm run build:studio` собирает Sanity Studio в `public/admin`.
3. `next build` собирает Next.js приложение с API routes и ISR.

Папка `out` больше не является production-артефактом.

## 3. Production-запуск

```bash
npm run start
```

По умолчанию production server слушает `http://localhost:3002`.

## 4. Рекомендуемый деплой

Рекомендуемый вариант для текущей архитектуры — собственный Node.js-хостинг (VPS или выделенный сервер) с поддержкой Next.js SSR/ISR.

Базовая схема:

1. `npm run build`
2. `npm run start` (или через PM2/systemd)
3. Nginx как reverse proxy на порт приложения
4. Production env variables на сервере
5. Проверка прода до переключения домена

## 5. Обязательные env variables

```env
NEXT_PUBLIC_BASE_URL=https://septus.ru
NEXT_PUBLIC_SANITY_PROJECT_ID=rcq59yf9
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01

BITRIX_WEBHOOK_URL=
BITRIX_ASSIGNED_BY_ID=
BITRIX_MANAGER_IDS=
BITRIX_SOURCE=Website

TELEGRAM_BOT_TOKEN=
TELEGRAM_MANAGER_CHAT_IDS=

NEXT_PUBLIC_YANDEX_METRIKA_ID=
```

`BITRIX_WEBHOOK_URL=disabled` и `TELEGRAM_BOT_TOKEN=disabled` можно использовать только для smoke-тестов без отправки реальных заявок.

## 6. Что проверить в Preview

- `/`
- `/catalog/`
- несколько страниц `/catalog/<slug>/`
- `/admin/`
- `/sitemap.xml`
- `/api/products/`
- POST `/api/lead/`
- редиректы/trailing slash для SEO URL
- отправку реальной тестовой заявки в Bitrix24 после установки production env

## 7. Sanity Studio

Sanity Studio собирается в `public/admin` и отдаётся приложением по `/admin/`.

Если Sanity выдаёт ошибку CORS, добавьте origin `https://septus.ru` в Sanity Manage с включёнными credentials.

## 8. Rollback

До переключения DNS сохраните старую статическую версию сайта на текущем хостинге. Переключайте домен только после успешного Preview Deployment и проверки первой заявки.
# DEPLOY GUIDE

## 1. Локальный запуск

```bash
npm install
npm run dev
```

Сайт откроется на `http://localhost:3002`.

Если порт занят, в PowerShell выполните:

```powershell
Get-NetTCPConnection -LocalPort 3002 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

Затем снова запустите `npm run dev`.

## 2. Сборка production export

```bash
npm run build
```

Перед сборкой автоматически запускается `scripts/prepare-catalog-assets.js`: он копирует изображения товаров из `for site` в `public/catalog-images`.

## 3. Где готовая папка

После успешной сборки появляется папка:

```text
out/
```

Это статическая версия сайта для обычного хостинга.

## 4. Как загрузить на хостинг

1. Откройте файловый менеджер хостинга или FTP/SFTP.
2. Перейдите в корневую папку сайта, обычно это `public_html`, `www`, `htdocs` или папка домена.
3. Загрузите все содержимое папки `out`, не саму папку `out`, а файлы внутри нее.
4. Проверьте, что рядом с `index.html` лежат папки `_next`, `catalog`, `catalog-images`, `photos`.
5. Откройте домен в браузере.

## 5. Что прописать в домене

В DNS домена укажите IP хостинга:

```text
A @ <IP_ХОСТИНГА>
A www <IP_ХОСТИНГА>
```

Если хостинг просит CNAME для `www`, используйте:

```text
CNAME www your-domain.ru
```

После изменения DNS обновление может занять от 15 минут до 24 часов.

## 6. Важное про заявки

Статическая папка `out` не умеет выполнять серверный код сама по себе. Поэтому для заявок есть 2 production-варианта:

1. Разместить сайт на Node.js-хостинге и использовать локальный `/api/lead`.
2. Для обычного статического хостинга потребуется отдельный backend endpoint перед сборкой:

```env
LEAD_ENDPOINT=https://your-api.example.com/lead
```

Этот endpoint должен принять POST-запрос формы и отправить лид в Bitrix24, Telegram или email.

Если endpoint не указан, статический сайт покажет понятную ошибку отправки, но не сломает страницу.

## 7. Быстрая проверка перед загрузкой

```bash
npm install
npm run build
npm run dev
```

Проверьте:

- главная открывается;
- каталог открывается;
- фильтры меняют список товаров;
- быстрый осмотр открывает modal;
- сравнение открывает таблицу на 2-3 товара;
- карточка товара открывается;
- папка `out` создана.
