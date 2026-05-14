import { defineField, defineType } from 'sanity';

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Кейс / монтаж (страница «Наши работы»)',
  type: 'document',
  groups: [
    { name: 'main', title: 'Тексты', default: true },
    { name: 'works', title: 'Работы и оборудование' },
    { name: 'media', title: 'Фото' },
    { name: 'seo', title: 'SEO' },
    { name: 'publish', title: 'Публикация' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Название объекта',
      type: 'string',
      group: 'main',
      validation: (Rule) => Rule.required(),
      description: 'Как в заголовке карточки, например «Частный дом, Всеволожск».',
    }),
    defineField({
      name: 'slug',
      title: 'URL (slug)',
      type: 'slug',
      group: 'main',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
      description: 'Латиница и дефисы. Итоговый адрес: /cases/ваш-slug/',
    }),
    defineField({
      name: 'location',
      title: 'Локация (город/район)',
      type: 'string',
      group: 'main',
      description: 'Короткая строка над заголовком. Можно пусто.',
    }),
    defineField({
      name: 'summary',
      title: 'Краткое описание',
      type: 'text',
      rows: 4,
      group: 'main',
      description: 'Для карточки и SEO. Можно пусто — тогда подставится заголовок.',
    }),
    defineField({
      name: 'works',
      title: 'Выполненные работы',
      type: 'array',
      group: 'works',
      of: [{ type: 'string' }],
      description: 'Список строк. Пустой список на сайте просто скроет блок.',
    }),
    defineField({
      name: 'equipment',
      title: 'Оборудование (таблица)',
      type: 'array',
      group: 'works',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Параметр', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'value', title: 'Значение', type: 'string', validation: (Rule) => Rule.required() }),
          ],
        },
      ],
    }),
    defineField({
      name: 'images',
      title: 'Фото с объекта',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt', type: 'string' })],
        },
      ],
      description: 'Рекомендуется минимум 1 фото. Без фото страница откроется, но карточка будет пустой.',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      group: 'seo',
      description: 'Если пусто — используется название объекта.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Если пусто — берётся краткое описание.',
    }),
    defineField({
      name: 'isPublished',
      title: 'Показывать на сайте',
      type: 'boolean',
      initialValue: true,
      group: 'publish',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Порядок сортировки',
      type: 'number',
      initialValue: 0,
      group: 'publish',
      description: 'Меньше число — выше в списке кейсов.',
    }),
  ],
  preview: {
    select: { title: 'title', location: 'location', slug: 'slug.current', media: 'images.0' },
    prepare({ title, location, slug, media }) {
      const sub = [location, slug].filter(Boolean).join(' · ');
      return { title: title || 'Без названия', subtitle: sub || 'Нет slug', media };
    },
  },
  orderings: [{ title: 'Порядок', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] }],
});
