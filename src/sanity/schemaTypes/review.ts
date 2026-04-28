import { defineField, defineType } from 'sanity';

export const review = defineType({
  name: 'review',
  title: 'Отзывы',
  type: 'document',
  fields: [
    defineField({ name: 'author', title: 'Имя клиента', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'area', title: 'Город / район', type: 'string' }),
    defineField({ name: 'value', title: 'Оценка', type: 'number', initialValue: 5 }),
    defineField({ name: 'text', title: 'Текст отзыва', type: 'text', rows: 5 }),
    defineField({
      name: 'photo',
      title: 'Фото клиента или объекта',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt текст', type: 'string' })],
    }),
    defineField({ name: 'isPublished', title: 'Опубликован', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'author', subtitle: 'area', media: 'photo' },
  },
});
