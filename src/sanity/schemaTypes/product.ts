import { defineField, defineType } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Каталог товаров',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Название серии', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'URL (slug)', type: 'slug', options: { source: 'name', maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'brand', title: 'Производитель', type: 'string' }),
    defineField({ name: 'description', title: 'Описание', type: 'text', rows: 4 }),
    defineField({ name: 'price', title: 'Цена текстом', type: 'string' }),
    defineField({ name: 'priceValue', title: 'Цена числом для фильтра', type: 'number' }),
    defineField({
      name: 'images',
      title: 'Фото',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt текст', type: 'string' })],
        },
      ],
    }),
    defineField({ name: 'features', title: 'Преимущества', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'users', title: 'Количество пользователей', type: 'number' }),
    defineField({ name: 'capacity', title: 'Производительность текстом', type: 'string' }),
    defineField({ name: 'dailyCapacityLiters', title: 'Литров в сутки', type: 'number' }),
    defineField({ name: 'burstDischargeLiters', title: 'Залповый сброс, л', type: 'number' }),
    defineField({ name: 'dischargeType', title: 'Тип сброса', type: 'string', options: { list: ['Самотечный', 'Принудительный', 'Самотечный / Принудительный'] } }),
    defineField({ name: 'workPrinciple', title: 'Принцип работы', type: 'string' }),
    defineField({ name: 'energyUsage', title: 'Энергопотребление', type: 'string' }),
    defineField({ name: 'dimensions', title: 'Размеры', type: 'string' }),
    defineField({ name: 'weight', title: 'Вес', type: 'string' }),
    defineField({ name: 'warranty', title: 'Гарантия', type: 'string' }),
    defineField({ name: 'suitableFor', title: 'Подходит для', type: 'text', rows: 3 }),
    defineField({ name: 'cleaningLevel', title: 'Степень очистки', type: 'string' }),
    defineField({ name: 'maintenance', title: 'Обслуживание', type: 'text', rows: 3 }),
    defineField({
      name: 'models',
      title: 'Модели внутри серии',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', title: 'Название модели', type: 'string' }),
            defineField({ name: 'users', title: 'Пользователей', type: 'number' }),
            defineField({ name: 'discharge', title: 'Тип сброса', type: 'string' }),
            defineField({ name: 'price', title: 'Цена', type: 'string' }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'brand', media: 'images.0' },
  },
});
