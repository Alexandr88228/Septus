import { defineField, defineType } from 'sanity';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const product = defineType({
  name: 'product',
  title: 'Каталог: серия (и модели на сайте)',
  type: 'document',
  groups: [
    { name: 'basics', title: 'Главное', default: true },
    { name: 'pricing', title: 'Цены' },
    { name: 'seo', title: 'SEO' },
    { name: 'media', title: 'Фото и текст' },
    { name: 'specs', title: 'Характеристики' },
    { name: 'models', title: 'Модели в каталоге' },
  ],
  fields: [
    defineField({
      name: 'isPublished',
      title: 'Показывать на сайте',
      type: 'boolean',
      initialValue: true,
      group: 'basics',
      description: 'Снимите галочку, чтобы скрыть серию без удаления.',
    }),
    defineField({
      name: 'name',
      title: 'Название серии',
      type: 'string',
      group: 'basics',
      validation: (Rule) => Rule.required().error('Укажите название — так она отображается в каталоге'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug серии (URL, латиница)',
      type: 'slug',
      group: 'basics',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) =>
        Rule.required().custom((value) => {
          const current = typeof value === 'object' && value && 'current' in value ? (value as { current?: string }).current : '';
          if (!current?.trim()) return 'Сгенерируйте slug (кнопка Generate)';
          if (!slugPattern.test(current)) return 'Только латиница в нижнем регистре, цифры и дефис';
          return true;
        }),
      description: 'Например evrolos-bio. Старые ссылки /catalog/{slug}/ редиректят на страницу бренда, если slug совпадает с серией.',
    }),
    defineField({
      name: 'brand',
      title: 'Производитель (как на сайте)',
      type: 'string',
      group: 'basics',
      validation: (Rule) => Rule.required().error('Укажите бренд — от него строится раздел /catalog/...'),
      description: 'Например «Юнилос» или «Биодевайс». URL бренда строится автоматически (транслит).',
    }),
    defineField({
      name: 'description',
      title: 'Описание серии',
      type: 'text',
      rows: 5,
      group: 'media',
      description: 'Текст на карточке и на страницах моделей. Можно оставить пустым — тогда блок будет короче.',
    }),
    defineField({
      name: 'price',
      title: 'Цена текстом («от … ₽»)',
      type: 'string',
      group: 'pricing',
      description: 'Если пусто — сайт соберёт подпись из числа и префикса ниже.',
    }),
    defineField({
      name: 'pricePrefix',
      title: 'Префикс цены',
      type: 'string',
      initialValue: 'от',
      group: 'pricing',
      description: 'Обычно «от». Учитывается, если не заполнено поле «Цена текстом».',
    }),
    defineField({
      name: 'priceValue',
      title: 'Цена числом (для фильтров и сметы)',
      type: 'number',
      group: 'pricing',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (value === undefined || value === null) return true;
          if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return 'Число должно быть больше 0';
          if (!Number.isInteger(value)) return 'Только целое число (рубли)';
          return true;
        }),
      description: 'Необязательно: без числа на сайте будет «Цена по запросу», если нет текстовой цены.',
    }),
    defineField({
      name: 'priceWas',
      title: 'Старая цена (текстом)',
      type: 'string',
      group: 'pricing',
      description: 'Необязательно — для акций «было / стало».',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      group: 'seo',
      description: 'Если пусто — заголовок соберётся из названия и модели на сайте.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Если пусто — возьмётся краткий текст из описания серии.',
    }),
    defineField({
      name: 'images',
      title: 'Фото',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt текст', type: 'string' })],
        },
      ],
      description: 'Рекомендуется хотя бы одно фото. Без фото сайт покажет пустую область, но не сломается.',
    }),
    defineField({
      name: 'features',
      title: 'Преимущества (список)',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'media',
    }),
    defineField({
      name: 'users',
      title: 'Пользователей (база для серии)',
      type: 'number',
      initialValue: 5,
      group: 'specs',
      validation: (Rule) => Rule.min(1).max(50).integer(),
      description: 'Используется, если не заданы отдельные модели ниже.',
    }),
    defineField({ name: 'capacity', title: 'Производительность текстом', type: 'string', group: 'specs' }),
    defineField({ name: 'dailyCapacityLiters', title: 'Литров в сутки', type: 'number', group: 'specs' }),
    defineField({ name: 'burstDischargeLiters', title: 'Залповый сброс, л', type: 'number', group: 'specs' }),
    defineField({
      name: 'dischargeType',
      title: 'Тип сброса (серия)',
      type: 'string',
      group: 'specs',
      options: { list: ['Самотечный', 'Принудительный', 'Самотечный / Принудительный'] },
    }),
    defineField({ name: 'workPrinciple', title: 'Принцип работы', type: 'string', group: 'specs' }),
    defineField({ name: 'energyUsage', title: 'Энергопотребление', type: 'string', group: 'specs' }),
    defineField({ name: 'dimensions', title: 'Размеры', type: 'string', group: 'specs' }),
    defineField({ name: 'weight', title: 'Вес', type: 'string', group: 'specs' }),
    defineField({ name: 'warranty', title: 'Гарантия', type: 'string', group: 'specs' }),
    defineField({ name: 'suitableFor', title: 'Подходит для', type: 'text', rows: 3, group: 'specs' }),
    defineField({ name: 'cleaningLevel', title: 'Степень очистки', type: 'string', group: 'specs' }),
    defineField({ name: 'maintenance', title: 'Обслуживание', type: 'text', rows: 3, group: 'specs' }),
    defineField({
      name: 'specsExtra',
      title: 'Доп. характеристики (таблица)',
      type: 'array',
      group: 'specs',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'key',
              title: 'Название',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Значение',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'models',
      title: 'Модели на сайте',
      type: 'array',
      group: 'models',
      description:
        'Если список заполнен — в каталоге только эти варианты (отдельные страницы и URL). Если пусто — сайт построит варианты автоматически (менее предсказуемо).',
      validation: (Rule) =>
        Rule.custom((models) => {
          if (!Array.isArray(models) || models.length === 0) return true;
          const slugs = new Set<string>();
          for (const m of models) {
            const raw = (m as { modelSlug?: string })?.modelSlug?.trim().toLowerCase();
            if (!raw) return 'У каждой модели должен быть slug';
            if (!slugPattern.test(raw)) return `Slug «${raw}»: только латиница, цифры и дефис`;
            if (slugs.has(raw)) return `Повторяется slug модели «${raw}» — сделайте уникальным в рамках серии`;
            slugs.add(raw);
            const users = (m as { users?: number }).users;
            if (users === undefined || users === null || Number(users) < 1) return `Для модели «${raw}» укажите число пользователей (от 1)`;
            const discharge = (m as { discharge?: string }).discharge;
            if (!discharge) return `Для модели «${raw}» выберите тип сброса`;
          }
          return true;
        }),
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'modelSlug',
              title: 'Slug модели (латиница)',
              type: 'string',
              validation: (Rule) =>
                Rule.required().custom((value) => {
                  const v = (value || '').trim().toLowerCase();
                  if (!v) return 'Обязательное поле';
                  if (!slugPattern.test(v)) return 'Только латиница, цифры и дефис';
                  return true;
                }),
              description: 'Уникально в рамках бренда, напр. evrolos-bio-5-s',
            }),
            defineField({
              name: 'title',
              title: 'Заголовок на странице модели',
              type: 'string',
              description: 'Если пусто — сайт соберёт заголовок из серии, числа людей и сброса.',
            }),
            defineField({
              name: 'users',
              title: 'Человек',
              type: 'number',
              validation: (Rule) => Rule.required().min(1).max(50).integer(),
            }),
            defineField({
              name: 'discharge',
              title: 'Сброс',
              type: 'string',
              options: { list: ['самотечный', 'принудительный'] },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'price',
              title: 'Цена этой модели (текст)',
              type: 'string',
              description: 'Если пусто — цена оценится от числа серии или будет «Цена по запросу».',
            }),
            defineField({
              name: 'capacity',
              title: 'Производительность (текст)',
              type: 'string',
              description: 'Необязательно — иначе на сайте подставится оценка от числа людей.',
            }),
            defineField({
              name: 'burstDischarge',
              title: 'Залповый сброс (текст)',
              type: 'string',
              description: 'Необязательно — иначе подставится оценка.',
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'brand', media: 'images.0' },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Без названия',
        subtitle: subtitle ? `Бренд: ${subtitle}` : 'Укажите бренд',
        media,
      };
    },
  },
});
