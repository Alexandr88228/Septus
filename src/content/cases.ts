/** Кейсы: в `images` укажите пути к фото с монтажа, например `/cases/vsevolozhsk-1.webp` (файлы в `public/cases/`). */

export type CaseStudy = {
  slug: string;
  title: string;
  location: string;
  summary: string;
  works: string[];
  equipment: Array<{ label: string; value: string }>;
  images: string[];
  seoTitle?: string;
  seoDescription?: string;
};

/** Редактируйте тексты и фото кейсов здесь */
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'montazh-biodevays-pro-vsevolozhsk',
    title: 'Частный дом, Всеволожск',
    location: 'Всеволожск',
    summary: 'Монтаж автономной станции биологической очистки на участке со сложным грунтом.',
    works: [
      'Выезд инженера и съёмка высотных отметок',
      'Подбор станции под нагрузку и грунт',
      'Земляные работы и подготовка площадки',
      'Установка корпуса, подключение к выпуску из дома',
      'Пусконаладка и инструктаж заказчика',
    ],
    equipment: [
      { label: 'Модель', value: 'Биодевайс ПРО' },
      { label: 'Пользователи', value: 'до 6 человек' },
      { label: 'Сброс', value: 'самотечный' },
      { label: 'Срок монтажа', value: '1 день' },
    ],
    images: ['/catalog-images/biodevays-pro/septik-biodevays-pro.webp'],
  },
  {
    slug: 'yunilos-astra-gatchina-vysokie-ugv',
    title: 'Коттедж, Гатчина',
    location: 'Гатчина',
    summary: 'Установка станции при высоком уровне грунтовых вод с принудительным сбросом.',
    works: [
      'Гидрогеологическая оценка участка',
      'Усиленное основание и крепление корпуса',
      'Монтаж насосного узла и кабельных трасс',
      'Подключение к внутренней канализации',
      'Проверка герметичности и тестовый пуск',
    ],
    equipment: [
      { label: 'Модель', value: 'Юнилос Астра' },
      { label: 'Пользователи', value: 'до 5 человек' },
      { label: 'Сброс', value: 'принудительный' },
      { label: 'Срок монтажа', value: '1 день' },
    ],
    images: ['/catalog-images/yunilos-astra/septik-yunilos-astra-5.webp'],
  },
  {
    slug: 'ital-bio-pushkin-kompakt',
    title: 'Дача, Пушкин',
    location: 'Пушкин',
    summary: 'Компактное решение на ограниченном участке с аккуратным благоустройством.',
    works: [
      'Разработка схемы подводки без заезда крупной техники',
      'Монтаж станции и дренажного поля',
      'Подключение электроснабжения компрессора',
      'Обратная засыпка и планировка газона',
    ],
    equipment: [
      { label: 'Модель', value: 'Итал Био' },
      { label: 'Пользователи', value: 'до 5 человек' },
      { label: 'Сброс', value: 'самотечный' },
      { label: 'Срок монтажа', value: '1 день' },
    ],
    images: ['/catalog-images/ital-bio/septik-ital-bio.webp'],
  },
  {
    slug: 'ital-antey-kudrovo-zima',
    title: 'Таунхаус, Кудрово',
    location: 'Кудрово',
    summary: 'Монтаж в зимний период с соблюдением технологии утепления и обратной засыпки.',
    works: [
      'Зимнее бурение и крепление траншеи',
      'Установка станции и обвязка трубопроводов',
      'Утепление патрубков и узлов',
      'Пуск и сдача объекта по акту',
    ],
    equipment: [
      { label: 'Модель', value: 'Итал Антей' },
      { label: 'Пользователи', value: 'до 5 человек' },
      { label: 'Сброс', value: 'самотечный / принудительный' },
      { label: 'Срок монтажа', value: '1 день' },
    ],
    images: ['/catalog-images/ital-antey/septik-ital-antey.webp'],
  },
];
