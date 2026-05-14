import { defineField, defineType } from 'sanity';

export const homePage = defineType({
  name: 'homePage',
  title: 'Главная страница',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Внутреннее название', type: 'string', initialValue: 'Главная страница' }),
    defineField({ name: 'heroBadge', title: 'Плашка над заголовком', type: 'string' }),
    defineField({ name: 'heroTitle', title: 'Главный заголовок', type: 'string' }),
    defineField({ name: 'heroText', title: 'Текст под заголовком', type: 'text', rows: 3 }),
    defineField({
      name: 'heroImage',
      title: 'Фото в первом экране',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt текст', type: 'string' })],
    }),
    defineField({
      name: 'heroBadges',
      title: 'Цифры и бейджи под hero',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'heroCtaPrimaryLabel', title: 'Кнопка 1 — текст', type: 'string', initialValue: 'Смотреть каталог' }),
    defineField({ name: 'heroCtaPrimaryHref', title: 'Кнопка 1 — ссылка', type: 'string', initialValue: '/catalog/' }),
    defineField({ name: 'heroCtaSecondaryLabel', title: 'Кнопка 2 — текст', type: 'string', initialValue: 'Рассчитать стоимость' }),
    defineField({ name: 'heroCtaSecondaryHref', title: 'Кнопка 2 — ссылка', type: 'string', initialValue: '#calculator' }),
    defineField({
      name: 'benefits',
      title: 'Преимущества (блок «Почему мы»)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Заголовок', type: 'string' }),
            defineField({ name: 'description', title: 'Описание', type: 'text', rows: 3 }),
          ],
        },
      ],
    }),
    defineField({
      name: 'infoBlocks',
      title: 'Инфоблоки (замер / доставка / оплата на главной)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Заголовок карточки', type: 'string' }),
            defineField({ name: 'body', title: 'Текст', type: 'text', rows: 4 }),
          ],
        },
      ],
    }),
    defineField({
      name: 'infoBlocksLinkLabel',
      title: 'Текст ссылки под инфоблоками',
      type: 'string',
      initialValue: 'Все условия доставки и оплаты',
    }),
    defineField({
      name: 'infoBlocksLinkHref',
      title: 'Ссылка под инфоблоками',
      type: 'string',
      initialValue: '/order/',
    }),
    defineField({
      name: 'featuredCaseStudies',
      title: 'Кейсы на главной',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'caseStudy' }] }],
      description: 'Порядок в массиве = порядок карточек. Если пусто — первые опубликованные кейсы.',
    }),
    defineField({
      name: 'projects',
      title: 'Кейсы (устаревший ввод без отдельных документов)',
      type: 'array',
      description: 'Оставлено для совместимости. Предпочтительно использовать «Кейсы на главной».',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'location', title: 'Локация', type: 'string' }),
            defineField({ name: 'model', title: 'Модель', type: 'string' }),
            defineField({ name: 'duration', title: 'Срок', type: 'string' }),
            defineField({
              name: 'image',
              title: 'Фото',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt текст', type: 'string' })],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQ',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Вопрос', type: 'string' }),
            defineField({ name: 'answer', title: 'Ответ', type: 'text', rows: 4 }),
          ],
        },
      ],
    }),
    defineField({ name: 'leadTitle', title: 'Заголовок блока заявки', type: 'string' }),
    defineField({ name: 'leadText', title: 'Текст блока заявки', type: 'text', rows: 3 }),
  ],
  preview: {
    select: { title: 'title' },
  },
});
