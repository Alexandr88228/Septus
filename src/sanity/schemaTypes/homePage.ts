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
      title: 'Цифры и бейджи',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'benefits',
      title: 'Преимущества',
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
      name: 'projects',
      title: 'Кейсы / монтажи',
      type: 'array',
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
    defineField({ name: 'leadTitle', title: 'Заголовок формы заявки', type: 'string' }),
    defineField({ name: 'leadText', title: 'Текст формы заявки', type: 'text', rows: 3 }),
  ],
  preview: {
    select: { title: 'title' },
  },
});
