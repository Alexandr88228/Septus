import { defineField, defineType } from 'sanity';

export const homePage = defineType({
  name: 'homePage',
  title: 'Главная страница (один документ)',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Первый экран', default: true },
    { name: 'benefits', title: 'Преимущества' },
    { name: 'info', title: 'Инфоблоки и доставка' },
    { name: 'cases', title: 'Кейсы на главной' },
    { name: 'faq', title: 'FAQ' },
    { name: 'lead', title: 'Блок заявки' },
    { name: 'meta', title: 'Служебное' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Внутреннее название',
      type: 'string',
      initialValue: 'Главная страница',
      group: 'meta',
      description: 'Только для списка в Studio, на сайте не показывается.',
    }),
    defineField({ name: 'heroBadge', title: 'Плашка над заголовком', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTitle', title: 'Главный заголовок', type: 'string', group: 'hero' }),
    defineField({ name: 'heroText', title: 'Текст под заголовком', type: 'text', rows: 3, group: 'hero' }),
    defineField({
      name: 'heroImage',
      title: 'Фото в первом экране',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt текст', type: 'string' })],
      description: 'Необязательно — на сайте есть картинка по умолчанию.',
    }),
    defineField({
      name: 'heroBadges',
      title: 'Цифры и бейджи под hero',
      type: 'array',
      group: 'hero',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'heroCtaPrimaryLabel',
      title: 'Кнопка 1 — текст',
      type: 'string',
      initialValue: 'Смотреть каталог',
      group: 'hero',
    }),
    defineField({
      name: 'heroCtaPrimaryHref',
      title: 'Кнопка 1 — ссылка',
      type: 'string',
      initialValue: '/catalog/',
      group: 'hero',
      description: 'Лучше с ведущим / и при необходимости завершающим слэшем.',
    }),
    defineField({
      name: 'heroCtaSecondaryLabel',
      title: 'Кнопка 2 — текст',
      type: 'string',
      initialValue: 'Рассчитать стоимость',
      group: 'hero',
    }),
    defineField({
      name: 'heroCtaSecondaryHref',
      title: 'Кнопка 2 — ссылка',
      type: 'string',
      initialValue: '#calculator',
      group: 'hero',
    }),
    defineField({
      name: 'benefits',
      title: 'Преимущества («Почему мы»)',
      type: 'array',
      group: 'benefits',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Заголовок', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Описание', type: 'text', rows: 3 }),
          ],
        },
      ],
    }),
    defineField({
      name: 'infoBlocks',
      title: 'Три карточки (замер / доставка / оплата)',
      type: 'array',
      group: 'info',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Заголовок карточки', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'body', title: 'Текст', type: 'text', rows: 4 }),
          ],
        },
      ],
      description: 'Если пусто — на сайте остаются тексты по умолчанию.',
    }),
    defineField({
      name: 'infoBlocksLinkLabel',
      title: 'Текст ссылки под карточками',
      type: 'string',
      initialValue: 'Все условия доставки и оплаты',
      group: 'info',
    }),
    defineField({
      name: 'infoBlocksLinkHref',
      title: 'Ссылка под карточками',
      type: 'string',
      initialValue: '/order/',
      group: 'info',
    }),
    defineField({
      name: 'featuredCaseStudies',
      title: 'Кейсы на главной',
      type: 'array',
      group: 'cases',
      of: [{ type: 'reference', to: [{ type: 'caseStudy' }] }],
      description: 'Порядок в списке = порядок на главной. Если пусто — подставятся первые опубликованные кейсы.',
    }),
    defineField({
      name: 'projects',
      title: 'Кейсы (старый способ, без отдельных документов)',
      type: 'array',
      group: 'cases',
      description: 'Лучше использовать «Кейсы на главной» со ссылками на документы кейсов.',
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
      group: 'faq',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Вопрос', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'answer', title: 'Ответ', type: 'text', rows: 4 }),
          ],
        },
      ],
    }),
    defineField({ name: 'leadTitle', title: 'Заголовок блока заявки', type: 'string', group: 'lead' }),
    defineField({ name: 'leadText', title: 'Текст блока заявки', type: 'text', rows: 3, group: 'lead' }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title || 'Главная страница', subtitle: 'Редактируйте блоки ниже' };
    },
  },
});
