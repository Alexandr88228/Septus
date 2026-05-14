import { defineField, defineType } from 'sanity';

export const promotion = defineType({
  name: 'promotion',
  title: 'Акция',
  type: 'document',
  fields: [
    defineField({ name: 'isActive', title: 'Показывать на сайте', type: 'boolean', initialValue: true }),
    defineField({ name: 'title', title: 'Заголовок', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', title: 'Текст', type: 'text', rows: 5 }),
    defineField({
      name: 'badge',
      title: 'Бейдж (например −5% или B2B)',
      type: 'string',
    }),
    defineField({
      name: 'discountPercent',
      title: 'Процент скидки (число)',
      type: 'number',
      description: 'Для отображения; может дублировать бейдж.',
    }),
    defineField({
      name: 'image',
      title: 'Изображение',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt', type: 'string' })],
    }),
    defineField({ name: 'validFrom', title: 'Дата начала', type: 'date' }),
    defineField({ name: 'validUntil', title: 'Дата окончания', type: 'date' }),
    defineField({ name: 'buttonText', title: 'Текст кнопки', type: 'string', initialValue: 'Получить условия' }),
    defineField({ name: 'buttonHref', title: 'Ссылка кнопки', type: 'string', initialValue: '/#lead' }),
    defineField({ name: 'sortOrder', title: 'Порядок в списке', type: 'number', initialValue: 0 }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'badge', media: 'image' },
  },
  orderings: [{ title: 'Порядок', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] }],
});
