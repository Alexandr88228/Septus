import { defineField, defineType } from 'sanity';

export const priceItem = defineType({
  name: 'priceItem',
  title: 'Цены',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Название сценария', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'people', title: 'Количество человек', type: 'string', options: { list: ['1-3', '4-5', '6-8', '10+'] } }),
    defineField({ name: 'residence', title: 'Проживание', type: 'string', options: { list: ['Сезонное', 'Постоянное'] } }),
    defineField({ name: 'distance', title: 'Длина трассы', type: 'string' }),
    defineField({ name: 'equipment', title: 'Оборудование, ₽', type: 'number' }),
    defineField({ name: 'mounting', title: 'Монтаж, ₽', type: 'number' }),
    defineField({ name: 'total', title: 'Под ключ, ₽', type: 'number' }),
    defineField({ name: 'isActive', title: 'Показывать', type: 'boolean', initialValue: true }),
  ],
});
