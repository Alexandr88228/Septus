# Static export and local API notes

## Important

Current production architecture for this repository is Next.js SSR/ISR on your own Node.js server.
Static export (`out/`) is optional and does not run server routes like `/api/lead/`.

## If you still build static output

```bash
npm install
npm run build:static
```

Then upload `out/` to static hosting.

## Form behavior

Lead forms in this project are configured to send requests only to:

```text
/api/lead/
```

This route must be served by your own Next.js server on the same domain.

## Server env required for leads

```env
BITRIX_WEBHOOK_URL=
BITRIX_ASSIGNED_BY_ID=
BITRIX_MANAGER_IDS=
BITRIX_SOURCE=Website
BITRIX_SOURCE_ID=WEB
LEAD_ALLOWED_ORIGINS=https://www.septus.ru,https://septus.ru
TELEGRAM_BOT_TOKEN=
TELEGRAM_MANAGER_CHAT_IDS=
```

## Quick check

```bash
curl -X POST https://www.septus.ru/api/lead/ \
  -H "Content-Type: application/json" \
  -H "Origin: https://www.septus.ru" \
  -d "{\"name\":\"Test\",\"phone\":\"79999999999\",\"productName\":\"Test product\"}"
```
