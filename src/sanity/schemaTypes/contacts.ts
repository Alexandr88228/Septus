import { defineField, defineType } from 'sanity';

export const contacts = defineType({
  name: 'contacts',
  title: 'Контакты',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Внутреннее название', type: 'string', initialValue: 'Контакты' }),
    defineField({ name: 'phone', title: 'Телефон', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'address', title: 'Адрес', type: 'string' }),
    defineField({ name: 'serviceArea', title: 'Зона обслуживания', type: 'text', rows: 3 }),
    defineField({ name: 'workingHours', title: 'График работы', type: 'string' }),
    defineField({ name: 'telegram', title: 'Telegram', type: 'url' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp', type: 'url' }),
    defineField({ name: 'max', title: 'Max', type: 'url' }),
    defineField({ name: 'vk', title: 'VK', type: 'url' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'phone' },
  },
});
