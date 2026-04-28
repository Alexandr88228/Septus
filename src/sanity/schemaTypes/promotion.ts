import { defineField, defineType } from 'sanity';

export const promotion = defineType({
  name: 'promotion',
  title: 'Акции',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Название акции', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', title: 'Описание', type: 'text', rows: 4 }),
    defineField({ name: 'buttonText', title: 'Текст кнопки', type: 'string' }),
    defineField({ name: 'buttonHref', title: 'Ссылка кнопки', type: 'string' }),
    defineField({ name: 'validUntil', title: 'Действует до', type: 'date' }),
    defineField({ name: 'isActive', title: 'Активна', type: 'boolean', initialValue: true }),
  ],
});
