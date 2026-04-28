import { defineField, defineType } from 'sanity';

export const seoSettings = defineType({
  name: 'seoSettings',
  title: 'SEO',
  type: 'document',
  fields: [
    defineField({ name: 'page', title: 'Страница', type: 'string', options: { list: ['Главная', 'Каталог', 'Галерея', 'Заявка', 'Доставка и оплата', 'О компании'] } }),
    defineField({ name: 'path', title: 'Путь страницы', type: 'string', description: 'Например: /catalog' }),
    defineField({ name: 'h1', title: 'H1', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({
      name: 'ogImage',
      title: 'Картинка для соцсетей',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt текст', type: 'string' })],
    }),
  ],
  preview: {
    select: { title: 'page', subtitle: 'path' },
  },
});
