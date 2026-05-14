import { defineField, defineType } from 'sanity';

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Кейс / монтаж',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Название объекта',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL (slug)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'location', title: 'Локация (город/район)', type: 'string' }),
    defineField({ name: 'summary', title: 'Краткое описание', type: 'text', rows: 4 }),
    defineField({
      name: 'works',
      title: 'Выполненные работы',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'equipment',
      title: 'Оборудование',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Параметр', type: 'string' }),
            defineField({ name: 'value', title: 'Значение', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'images',
      title: 'Фото с объекта',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt', type: 'string' })],
        },
      ],
    }),
    defineField({ name: 'seoTitle', title: 'SEO title (необязательно)', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO description', type: 'text', rows: 3 }),
    defineField({ name: 'isPublished', title: 'Опубликован', type: 'boolean', initialValue: true }),
    defineField({ name: 'sortOrder', title: 'Порядок на главной', type: 'number', initialValue: 0 }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'location', media: 'images.0' },
  },
  orderings: [{ title: 'Порядок', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] }],
});
