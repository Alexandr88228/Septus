import { defineField, defineType } from 'sanity';

export const category = defineType({
  name: 'category',
  title: 'Категории',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Название', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'URL (slug)', type: 'slug', options: { source: 'title', maxLength: 96 } }),
    defineField({
      name: 'type',
      title: 'Тип категории',
      type: 'string',
      options: {
        list: [
          { title: 'Назначение', value: 'purpose' },
          { title: 'Принцип работы', value: 'principle' },
          { title: 'Производитель', value: 'brand' },
          { title: 'Быстрый тег', value: 'quickTag' },
        ],
      },
    }),
    defineField({ name: 'description', title: 'Описание', type: 'text', rows: 3 }),
    defineField({ name: 'sortOrder', title: 'Порядок сортировки', type: 'number' }),
  ],
});
