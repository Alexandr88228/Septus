# Sanity CMS для Septus

Sanity используется как CMS для сайта и админ-панель менеджера.

## Что уже подключено

- Админ-панель: `/admin`
- Авторизация: через аккаунты Sanity
- Разделы: Главная страница, Каталог товаров, Категории, Цены, Акции, Отзывы, Контакты, SEO
- Загрузка фото: через поля изображений Sanity
- Сайт остается совместимым со статической папкой `out`

## 1. Создать Sanity project

В корне сайта выполните:

```bash
npx sanity@3 init
```

Выберите:

- Create new project
- Dataset: `production`
- Project output path: текущий проект

Если проект уже создан, возьмите `projectId` в Sanity Manage.

## 2. Настроить переменные

Создайте `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=ваш_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
```

Перезапустите сайт:

```bash
npm run dev
```

## 3. Открыть админку

После сборки для хостинга админка будет доступна внутри папки `out`:

```text
https://ваш-домен/admin
```

Для локальной работы со Studio используйте отдельную команду Sanity:

```bash
npm run studio
```

Она откроет Sanity Studio локально. Sanity попросит войти в аккаунт. Это и есть безопасный доступ по логину и паролю.

## 4. Добавить менеджера

Откройте Sanity Manage:

```text
https://www.sanity.io/manage
```

Далее:

1. Выберите проект Septus.
2. Откройте Members.
3. Invite member.
4. Укажите email менеджера.
5. Выдайте роль Editor.

## 5. Настроить CORS

В Sanity Manage откройте API → CORS origins и добавьте:

```text
http://localhost:3002
https://septus.ru
https://www.septus.ru
```

Разрешите credentials, если Sanity попросит это для Studio.

## 6. Как менеджеру менять контент

1. Открыть `/admin`.
2. Войти в Sanity.
3. Выбрать нужный раздел.
4. Внести правки.
5. Нажать Publish.

Видимый контент сайта обновляется через Sanity CDN и ISR. SEO-поля в HTML обновляются автоматически после следующей ISR-регенерации без ручной загрузки папки `out`.

## 7. Сборка для хостинга

```bash
npm run build
```

Команда соберет сайт и отдельно положит Sanity Studio в:

```text
public/admin
```

Production-деплой выполняется как Next.js SSR/ISR приложение на собственном Node.js-хостинге. Папка `out` больше не используется как production-артефакт.
