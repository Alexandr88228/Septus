import { defineField, defineType } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Каталог — серия / модель',
  type: 'document',
  fields: [
    defineField({ name: 'isPublished', title: 'Опубликовано на сайте', type: 'boolean', initialValue: true }),
    defineField({ name: 'name', title: 'Название серии', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      title: 'URL-серии (латиница)',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
      description: 'Например evrolos-bio. Страницы моделей: /catalog/{бренд}/{modelSlug}/',
    }),
    defineField({
      name: 'brand',
      title: 'Производитель (как на сайте)',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Из бренда строится URL /catalog/evrolos/ — используйте то же написание для серий одного бренда.',
    }),
    defineField({ name: 'description', title: 'Описание', type: 'text', rows: 5 }),
    defineField({
      name: 'price',
      title: 'Цена текстом («от … ₽»)',
      type: 'string',
      description: 'Если пусто — соберётся из числа и префикса.',
    }),
    defineField({
      name: 'pricePrefix',
      title: 'Префикс цены',
      type: 'string',
      initialValue: 'от',
      description: 'Например: от, от ',
    }),
    defineField({
      name: 'priceValue',
      title: 'Цена числом (для фильтра и расчётов)',
      type: 'number',
      validation: (Rule) => Rule.positive().integer(),
    }),
    defineField({
      name: 'priceWas',
      title: 'Старая цена (текстом, необязательно)',
      type: 'string',
      description: 'Для отображения «было …» на сайте (если добавите блок в шаблоне).',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      description: 'Если пусто — используется название серии.',
    }),
    defineField({ name: 'seoDescription', title: 'SEO description', type: 'text', rows: 3 }),
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
    defineField({ name: 'users', title: 'Пользователей (база для серии)', type: 'number', initialValue: 5 }),
    defineField({ name: 'capacity', title: 'Производительность текстом', type: 'string' }),
    defineField({ name: 'dailyCapacityLiters', title: 'Литров в сутки', type: 'number' }),
    defineField({ name: 'burstDischargeLiters', title: 'Залповый сброс, л', type: 'number' }),
    defineField({
      name: 'dischargeType',
      title: 'Тип сброса (серия)',
      type: 'string',
      options: { list: ['Самотечный', 'Принудительный', 'Самотечный / Принудительный'] },
    }),
    defineField({ name: 'workPrinciple', title: 'Принцип работы', type: 'string' }),
    defineField({ name: 'energyUsage', title: 'Энергопотребление', type: 'string' }),
    defineField({ name: 'dimensions', title: 'Размеры', type: 'string' }),
    defineField({ name: 'weight', title: 'Вес', type: 'string' }),
    defineField({ name: 'warranty', title: 'Гарантия', type: 'string' }),
    defineField({ name: 'suitableFor', title: 'Подходит для', type: 'text', rows: 3 }),
    defineField({ name: 'cleaningLevel', title: 'Степень очистки', type: 'string' }),
    defineField({ name: 'maintenance', title: 'Обслуживание', type: 'text', rows: 3 }),
    defineField({
      name: 'specsExtra',
      title: 'Доп. характеристики (таблица)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'key', title: 'Название', type: 'string' }),
            defineField({ name: 'value', title: 'Значение', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'models',
      title: 'Модели на сайте (варианты по людям / сбросу)',
      type: 'array',
      description:
        'Если заполнено — только эти строки попадут в каталог как отдельные URL. У каждой модели должен быть уникальный modelSlug в рамках бренда.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'modelSlug',
              title: 'Slug модели (латиница)',
              type: 'string',
              validation: (Rule) => Rule.required(),
              description: 'Например evrolos-bio-5-s',
            }),
            defineField({ name: 'title', title: 'Заголовок на странице модели', type: 'string' }),
            defineField({ name: 'users', title: 'Человек', type: 'number' }),
            defineField({
              name: 'discharge',
              title: 'Сброс',
              type: 'string',
              options: { list: ['самотечный', 'принудительный'] },
            }),
            defineField({ name: 'price', title: 'Цена этой модели (текст)', type: 'string' }),
            defineField({
              name: 'capacity',
              title: 'Производительность (текст, для строки каталога)',
              type: 'string',
            }),
            defineField({
              name: 'burstDischarge',
              title: 'Залповый сброс (текст)',
              type: 'string',
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'brand', media: 'images.0' },
  },
});
