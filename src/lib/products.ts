import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  price: string;
  priceValue: number;
  images: string[];
  features: string[];
  specs: Record<string, string>;
  users: number;
  capacity: string;
  dailyCapacityLiters: number;
  burstDischargeLiters: number;
  dischargeType: string;
  workPrinciple: string;
  energyUsage: string;
  dimensions: string;
  weight: string;
  warranty: string;
  suitableFor: string;
  cleaningLevel: string;
  maintenance: string;
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const EXCLUDED_FOLDERS = new Set(['Логотипы']);

const RU_TO_LAT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
  э: 'e', ю: 'yu', я: 'ya',
};

const NORMALIZED_SPEC_KEYS: Array<{ match: RegExp; label: string }> = [
  { match: /пользовател|чел/i, label: 'Количество пользователей' },
  { match: /производительност|м3|м³/i, label: 'Производительность' },
  { match: /залпов|залп/i, label: 'Залповый сброс' },
  { match: /вес|масса/i, label: 'Вес' },
  { match: /размер|габарит/i, label: 'Размеры' },
  { match: /гарант/i, label: 'Гарантия' },
  { match: /назначен/i, label: 'Назначение' },
  { match: /электропотреб|мощност/i, label: 'Энергопотребление' },
];

type CatalogReference = Omit<Product, 'id' | 'slug' | 'name' | 'images' | 'specs' | 'capacity'> & {
  capacity: string;
  specs?: Record<string, string>;
};

const CATALOG_REFERENCE: Record<string, CatalogReference> = {
  'атлос': productReference({
    brand: 'Атлос',
    priceValue: 104900,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 250,
    dischargeType: 'самотечный или принудительный',
    workPrinciple: 'аэробная биологическая очистка',
    energyUsage: '60-80 Вт',
    dimensions: '1200 x 1200 x 2360 мм',
    weight: '155 кг',
    warranty: '3 года',
    suitableFor: 'дом постоянного проживания на 3-5 человек',
    cleaningLevel: 'до 98%',
    maintenance: '1-2 раза в год: удаление ила, проверка компрессора',
    features: ['Глубокая биоочистка', 'Компактный корпус', 'Подходит для круглогодичного проживания'],
  }),
  'аэробокс': productReference({
    brand: 'Аэробокс',
    priceValue: 84835,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 250,
    dischargeType: 'самотечный / принудительный',
    workPrinciple: 'аэробная очистка с компрессором',
    energyUsage: '45-60 Вт',
    dimensions: '1000 x 1000 x 2300 мм',
    weight: '135 кг',
    warranty: '3 года',
    suitableFor: 'дача и частный дом до 5 жильцов',
    cleaningLevel: 'до 98%',
    maintenance: 'сервис 1 раз в 6-12 месяцев',
    features: ['Доступная цена', 'Низкое энергопотребление', 'Быстрый монтаж'],
  }),
  'биодевайс гост': productReference({
    brand: 'Биодевайс',
    priceValue: 109900,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 250,
    dischargeType: 'самотечный / принудительный',
    workPrinciple: 'биологическая очистка с аэротенком',
    energyUsage: '60 Вт',
    dimensions: '1200 x 1200 x 2400 мм',
    weight: '150 кг',
    warranty: '5 лет',
    suitableFor: 'частный дом с постоянным проживанием',
    cleaningLevel: 'до 98%',
    maintenance: 'откачка стабилизированного ила 1-2 раза в год',
    features: ['Серия ГОСТ', 'Стабильная очистка', 'Усиленный корпус'],
  }),
  'биодевайс про': productReference({
    brand: 'Биодевайс',
    priceValue: 124900,
    users: 6,
    dailyCapacityLiters: 1200,
    burstDischargeLiters: 300,
    dischargeType: 'самотечный / принудительный',
    workPrinciple: 'многоступенчатая аэробная биоочистка',
    energyUsage: '65-85 Вт',
    dimensions: '1300 x 1300 x 2450 мм',
    weight: '165 кг',
    warranty: '5 лет',
    suitableFor: 'коттедж или дом с повышенной нагрузкой',
    cleaningLevel: 'до 98%',
    maintenance: 'регулярная промывка фильтров и сервис компрессора',
    features: ['Повышенный залповый сброс', 'Для круглогодичной эксплуатации', 'Расширенная комплектация'],
  }),
  'биодевайс стандарт': productReference({
    brand: 'Биодевайс',
    priceValue: 96900,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 220,
    dischargeType: 'самотечный',
    workPrinciple: 'аэробная станция биологической очистки',
    energyUsage: '55-70 Вт',
    dimensions: '1100 x 1100 x 2350 мм',
    weight: '145 кг',
    warranty: '5 лет',
    suitableFor: 'семья 3-5 человек, дача или дом',
    cleaningLevel: 'до 98%',
    maintenance: '1 раз в год при сезонном проживании',
    features: ['Оптимальная базовая серия', 'Надежная автоматика', 'Хорошее соотношение цены и ресурса'],
  }),
  'биодевайс эко': productReference({
    brand: 'Биодевайс',
    priceValue: 89900,
    users: 4,
    dailyCapacityLiters: 800,
    burstDischargeLiters: 180,
    dischargeType: 'самотечный',
    workPrinciple: 'аэробная очистка бытовых стоков',
    energyUsage: '45-60 Вт',
    dimensions: '1000 x 1000 x 2250 мм',
    weight: '125 кг',
    warranty: '3 года',
    suitableFor: 'дача, баня, небольшой дом',
    cleaningLevel: 'до 97%',
    maintenance: 'плановое удаление ила 1 раз в год',
    features: ['Экономичная линейка', 'Для небольших участков', 'Минимальные эксплуатационные расходы'],
  }),
  'волгарь': productReference({
    brand: 'Волгарь',
    priceValue: 110160,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 250,
    dischargeType: 'самотечный / принудительный',
    workPrinciple: 'биологическая очистка с аэробной камерой',
    energyUsage: '60 Вт',
    dimensions: '1200 x 1200 x 2350 мм',
    weight: '150 кг',
    warranty: '3 года',
    suitableFor: 'дом постоянного проживания до 5 человек',
    cleaningLevel: 'до 98%',
    maintenance: 'сервис 1-2 раза в год',
    features: ['Прочный корпус', 'Стабильная работа зимой', 'Подходит для семьи'],
  }),
  'гринлос': productReference({
    brand: 'Гринлос',
    priceValue: 118900,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 250,
    dischargeType: 'самотечный / принудительный',
    workPrinciple: 'станция глубокой биологической очистки',
    energyUsage: '60-80 Вт',
    dimensions: '1200 x 1200 x 2400 мм',
    weight: '155 кг',
    warranty: '5 лет',
    suitableFor: 'коттедж, дача, дом для постоянного проживания',
    cleaningLevel: 'до 98%',
    maintenance: 'регламентное обслуживание 1 раз в 6-12 месяцев',
    features: ['Популярная линейка', 'Глубокая очистка', 'Модели под разные грунты'],
  }),
  'далос': productReference({
    brand: 'Далос',
    priceValue: 99900,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 240,
    dischargeType: 'самотечный',
    workPrinciple: 'биологическая очистка с аэробным окислением',
    energyUsage: '55-70 Вт',
    dimensions: '1150 x 1150 x 2350 мм',
    weight: '140 кг',
    warranty: '3 года',
    suitableFor: 'частный дом и сезонная дача',
    cleaningLevel: 'до 97%',
    maintenance: 'удаление ила и промывка камер 1 раз в год',
    features: ['Компактное решение', 'Для типового дома', 'Доступный сервис'],
  }),
  'евробион': productReference({
    brand: 'Евробион',
    priceValue: 149900,
    users: 5,
    dailyCapacityLiters: 900,
    burstDischargeLiters: 390,
    dischargeType: 'самотечный / принудительный',
    workPrinciple: 'аэробная биологическая очистка с биозагрузкой',
    energyUsage: '60 Вт',
    dimensions: '1080 x 1080 x 2380 мм',
    weight: '155 кг',
    warranty: '5 лет',
    suitableFor: 'семья 3-5 человек с постоянным проживанием',
    cleaningLevel: 'до 98%',
    maintenance: 'сервис 1-2 раза в год, контроль компрессора',
    features: ['Большой залповый сброс', 'Стабильная биология', 'Для постоянного проживания'],
  }),
  'евролос био': productReference({
    brand: 'Евролос',
    priceValue: 95095,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 210,
    dischargeType: 'самотечный',
    workPrinciple: 'анаэробно-аэробная биоочистка с биофильтром',
    energyUsage: 'энергонезависимый / до 40 Вт с насосом',
    dimensions: '1400 x 1400 x 1850 мм',
    weight: '120 кг',
    warranty: '3 года',
    suitableFor: 'дача и дом, где нужен простой септик с биофильтром',
    cleaningLevel: 'до 95%',
    maintenance: 'откачка осадка 1 раз в 1-2 года',
    features: ['Низкая зависимость от электричества', 'Биофильтр', 'Простое обслуживание'],
  }),
  'евролос про': productReference({
    brand: 'Евролос',
    priceValue: 121900,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 260,
    dischargeType: 'принудительный',
    workPrinciple: 'станция глубокой биологической очистки',
    energyUsage: '60-80 Вт',
    dimensions: '1200 x 1200 x 2450 мм',
    weight: '160 кг',
    warranty: '3 года',
    suitableFor: 'участки с высоким УГВ и принудительным сбросом',
    cleaningLevel: 'до 98%',
    maintenance: 'сервис 1 раз в 6-12 месяцев',
    features: ['Принудительный сброс', 'Для высокого УГВ', 'Глубокая биоочистка'],
  }),
  'итал антей': productReference({
    brand: 'Итал',
    priceValue: 119900,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 250,
    dischargeType: 'самотечный / принудительный',
    workPrinciple: 'аэробная станция биологической очистки',
    energyUsage: '60 Вт',
    dimensions: '1200 x 1200 x 2350 мм',
    weight: '150 кг',
    warranty: '3 года',
    suitableFor: 'частный дом, коттедж, круглогодичное проживание',
    cleaningLevel: 'до 98%',
    maintenance: 'обслуживание 1-2 раза в год',
    features: ['Усиленный корпус', 'Стабильная очистка', 'Для сложных участков'],
  }),
  'итал био': productReference({
    brand: 'Итал',
    priceValue: 105900,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 240,
    dischargeType: 'самотечный',
    workPrinciple: 'биологическая очистка с аэробной камерой',
    energyUsage: '55-70 Вт',
    dimensions: '1150 x 1150 x 2300 мм',
    weight: '145 кг',
    warranty: '3 года',
    suitableFor: 'дача и дом до 5 пользователей',
    cleaningLevel: 'до 97%',
    maintenance: 'удаление ила 1 раз в год',
    features: ['Надежная базовая модель', 'Монтаж за 1 день', 'Для семьи'],
  }),
  'кибез': productReference({
    brand: 'КиБЕЗ',
    priceValue: 97900,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 220,
    dischargeType: 'самотечный',
    workPrinciple: 'аэробная биологическая очистка',
    energyUsage: '55 Вт',
    dimensions: '1100 x 1100 x 2300 мм',
    weight: '130 кг',
    warranty: '3 года',
    suitableFor: 'экономичное решение для дома или дачи',
    cleaningLevel: 'до 97%',
    maintenance: 'плановый сервис 1 раз в год',
    features: ['Доступный бюджет', 'Компактность', 'Простая эксплуатация'],
  }),
  'кит био': productReference({
    brand: 'КИТ',
    priceValue: 98000,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 240,
    dischargeType: 'самотечный / принудительный',
    workPrinciple: 'биологическая очистка в аэробной станции',
    energyUsage: '60 Вт',
    dimensions: '1200 x 1200 x 2350 мм',
    weight: '145 кг',
    warranty: '3 года',
    suitableFor: 'частный дом с постоянным проживанием',
    cleaningLevel: 'до 98%',
    maintenance: 'обслуживание 1-2 раза в год',
    features: ['Семейная станция', 'Оптимальная производительность', 'Подходит для дома'],
  }),
  'кит про': productReference({
    brand: 'КИТ',
    priceValue: 122000,
    users: 6,
    dailyCapacityLiters: 1200,
    burstDischargeLiters: 300,
    dischargeType: 'принудительный',
    workPrinciple: 'многоступенчатая аэробная очистка',
    energyUsage: '70-90 Вт',
    dimensions: '1300 x 1300 x 2450 мм',
    weight: '170 кг',
    warranty: '3 года',
    suitableFor: 'коттедж, высокий УГВ, повышенный залповый сброс',
    cleaningLevel: 'до 98%',
    maintenance: 'сервис компрессора и насосного отсека 1-2 раза в год',
    features: ['Для сложных условий', 'Увеличенная нагрузка', 'Принудительный отвод'],
  }),
  'коловеси': productReference({
    brand: 'Коловеси',
    priceValue: 187900,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 250,
    dischargeType: 'самотечный / принудительный',
    workPrinciple: 'финская схема биологической очистки',
    energyUsage: '60 Вт',
    dimensions: '1200 x 1200 x 2500 мм',
    weight: '170 кг',
    warranty: '5 лет',
    suitableFor: 'дом постоянного проживания с высоким требованием к надежности',
    cleaningLevel: 'до 98%',
    maintenance: 'регламентный сервис 1 раз в год',
    features: ['Премиальная конструкция', 'Стабильная очистка', 'Для постоянной нагрузки'],
  }),
  'колос': productReference({
    brand: 'Колос',
    priceValue: 93900,
    users: 4,
    dailyCapacityLiters: 800,
    burstDischargeLiters: 180,
    dischargeType: 'самотечный',
    workPrinciple: 'биологическая очистка бытовых стоков',
    energyUsage: '45-60 Вт',
    dimensions: '1000 x 1000 x 2250 мм',
    weight: '125 кг',
    warranty: '3 года',
    suitableFor: 'дача, гостевой дом, баня',
    cleaningLevel: 'до 97%',
    maintenance: 'сервис 1 раз в год',
    features: ['Для небольших объектов', 'Простая схема', 'Низкая цена владения'],
  }),
  'септик удача': productReference({
    brand: 'Удача',
    priceValue: 67900,
    users: 3,
    dailyCapacityLiters: 600,
    burstDischargeLiters: 150,
    dischargeType: 'самотечный',
    workPrinciple: 'энергонезависимое отстаивание и почвенная доочистка',
    energyUsage: 'не требуется',
    dimensions: '1200 x 1200 x 1600 мм',
    weight: '90 кг',
    warranty: '3 года',
    suitableFor: 'сезонная дача, баня, редкое проживание',
    cleaningLevel: 'до 75% + почвенная доочистка',
    maintenance: 'ассенизация 1 раз в 1-2 года',
    features: ['Энергонезависимый септик', 'Для сезонной дачи', 'Минимальная стоимость'],
  }),
  'топас': productReference({
    brand: 'Топас',
    priceValue: 142740,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 220,
    dischargeType: 'самотечный / принудительный',
    workPrinciple: 'станция глубокой биологической очистки',
    energyUsage: '60 Вт',
    dimensions: '1100 x 1200 x 2500 мм',
    weight: '230 кг',
    warranty: '3 года',
    suitableFor: 'частный дом для 4-5 человек',
    cleaningLevel: 'до 98%',
    maintenance: 'сервис 3-4 раза в год или по регламенту производителя',
    features: ['Одна из самых известных станций', 'Глубокая очистка', 'Развитая сервисная сеть'],
  }),
  'топас с': productReference({
    brand: 'Топас',
    priceValue: 127980,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 220,
    dischargeType: 'самотечный / принудительный',
    workPrinciple: 'упрощенная серия станции глубокой биоочистки',
    energyUsage: '55-60 Вт',
    dimensions: '1100 x 1200 x 2500 мм',
    weight: '220 кг',
    warranty: '3 года',
    suitableFor: 'дом или дача с постоянной нагрузкой до 5 человек',
    cleaningLevel: 'до 98%',
    maintenance: 'регламентный сервис 2-4 раза в год',
    features: ['Серия Topas-С', 'Проверенная схема очистки', 'Хороший выбор для семьи'],
  }),
  'юнилос астра': productReference({
    brand: 'Юнилос Астра',
    priceValue: 140505,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 250,
    dischargeType: 'самотечный / принудительный',
    workPrinciple: 'аэробная станция глубокой биологической очистки',
    energyUsage: '60 Вт',
    dimensions: '1120 x 1120 x 2360 мм',
    weight: '210 кг',
    warranty: '3 года',
    suitableFor: 'семья 3-5 человек, постоянное проживание',
    cleaningLevel: 'до 98%',
    maintenance: 'удаление ила и чистка фильтров 2-4 раза в год',
    features: ['Популярная серия', 'Высокая степень очистки', 'Подходит для круглогодичного дома'],
  }),
  'galay': productReference({
    brand: 'Galay',
    priceValue: 115900,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 250,
    dischargeType: 'самотечный / принудительный',
    workPrinciple: 'биологическая очистка с аэрацией',
    energyUsage: '60-75 Вт',
    dimensions: '1200 x 1200 x 2350 мм',
    weight: '145 кг',
    warranty: '3 года',
    suitableFor: 'дом и дача с круглогодичной эксплуатацией',
    cleaningLevel: 'до 98%',
    maintenance: 'плановый сервис 1 раз в 6-12 месяцев',
    features: ['Современная станция', 'Для семьи', 'Подходит для монтажа под ключ'],
  }),
  'novo eco': productReference({
    brand: 'Novo Eco',
    priceValue: 98900,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 220,
    dischargeType: 'самотечный',
    workPrinciple: 'аэробная очистка в компактном корпусе',
    energyUsage: '50-65 Вт',
    dimensions: '1100 x 1100 x 2300 мм',
    weight: '135 кг',
    warranty: '3 года',
    suitableFor: 'дача или дом до 5 пользователей',
    cleaningLevel: 'до 97%',
    maintenance: 'сервис 1 раз в год',
    features: ['Экономичная станция', 'Компактный монтаж', 'Для типовой семьи'],
  }),
  'vodanoff': productReference({
    brand: 'Vodanoff',
    priceValue: 108900,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 240,
    dischargeType: 'самотечный / принудительный',
    workPrinciple: 'биологическая очистка с аэробным блоком',
    energyUsage: '55-70 Вт',
    dimensions: '1150 x 1150 x 2350 мм',
    weight: '145 кг',
    warranty: '3 года',
    suitableFor: 'частный дом, коттедж, сезонная дача',
    cleaningLevel: 'до 98%',
    maintenance: 'удаление избыточного ила 1-2 раза в год',
    features: ['Сбалансированная модель', 'Для дома и дачи', 'Надежная работа в сезон'],
  }),
};

function toSlug(value: string): string {
  const transliterated = value
    .trim()
    .toLowerCase()
    .split('')
    .map((char) => RU_TO_LAT[char] ?? char)
    .join('');

  return transliterated
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildImageUrl(folder: string, file: string): string {
  return `/catalog-images/${toSlug(folder)}/${toSlug(path.parse(file).name)}.webp`;
}

function productReference(input: Omit<CatalogReference, 'price' | 'description' | 'capacity'> & { description?: string }): CatalogReference {
  const price = `от ${input.priceValue.toLocaleString('ru-RU')} ₽`;
  const capacity = `${input.dailyCapacityLiters} л/сутки`;
  return {
    ...input,
    price,
    capacity,
    description:
      input.description ??
      `${input.brand} — автономная канализация для загородного дома. Подбираем модель, тип сброса и монтаж под грунт, уровень воды и режим проживания.`,
  };
}

function normalizeSpecKey(rawKey: string): string {
  const normalized = rawKey.trim().toLowerCase();
  const matched = NORMALIZED_SPEC_KEYS.find((item) => item.match.test(normalized));
  return matched?.label ?? rawKey.trim();
}

function extractUserCount(text: string): number {
  const match = text.match(/(\d+)\s*(?:чел|пользов)/i);
  return match ? Number.parseInt(match[1], 10) : 5;
}

function extractCapacity(text: string): string {
  const match = text.match(/(\d+(?:[.,]\d+)?)\s*м(?:3|³)/i);
  return match ? `${match[1].replace(',', '.')} м³/сутки` : '1 м³/сутки';
}

async function extractFromWordDoc(docPath: string): Promise<Partial<Product>> {
  try {
    const buffer = fs.readFileSync(docPath);
    const { value: rawText } = await mammoth.extractRawText({ buffer });
    const text = rawText.replace(/\r/g, '\n');
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const specs: Record<string, string> = {};
    const features: string[] = [];

    for (const line of lines) {
      const parts = line.split(/[:\-]\s+/);
      if (parts.length >= 2) {
        const key = normalizeSpecKey(parts[0]);
        const value = parts.slice(1).join(' - ').trim();
        if (value) {
          specs[key] = value;
        }
      } else if (line.startsWith('•') || line.startsWith('-')) {
        features.push(line.replace(/^[•-]\s*/, ''));
      }
    }

    const users = specs['Количество пользователей']
      ? extractUserCount(specs['Количество пользователей'])
      : extractUserCount(text);
    const capacity = specs['Производительность'] ?? extractCapacity(text);

    const meaningfulLines = lines.filter((line) => line.length > 20).slice(0, 3);
    const description = meaningfulLines.join(' ') || undefined;

    return {
      description,
      specs,
      features: features.slice(0, 6),
      users,
      capacity,
    };
  } catch (error) {
    console.error('DOCX parsing failed:', error);
    return {};
  }
}

function isImageFile(fileName: string): boolean {
  return IMAGE_EXTENSIONS.includes(path.extname(fileName).toLowerCase());
}

async function getProductFromFolder(folderName: string, folderPath: string): Promise<Product | null> {
  const files = fs.readdirSync(folderPath);
  const imageFile = files.find(isImageFile);

  if (!imageFile) {
    return null;
  }

  const wordFile = files.find((file) => /\.docx$/i.test(file));
  const wordData = wordFile ? await extractFromWordDoc(path.join(folderPath, wordFile)) : {};

  const slug = toSlug(folderName);
  const reference = CATALOG_REFERENCE[folderName.toLowerCase()] ?? fallbackReference(folderName);
  const description = reference.description ?? wordData.description ?? `Септик ${folderName} для частного дома и дачи.`;
  const features = wordData.features?.length
    ? wordData.features
    : reference.features;
  const specs = buildSpecs(reference, wordData.specs);

  return {
    id: slug,
    name: folderName,
    slug,
    brand: reference.brand,
    description,
    price: reference.price,
    priceValue: reference.priceValue,
    images: [buildImageUrl(folderName, imageFile)],
    features,
    specs,
    users: reference.users,
    capacity: reference.capacity,
    dailyCapacityLiters: reference.dailyCapacityLiters,
    burstDischargeLiters: reference.burstDischargeLiters,
    dischargeType: reference.dischargeType,
    workPrinciple: reference.workPrinciple,
    energyUsage: reference.energyUsage,
    dimensions: reference.dimensions,
    weight: reference.weight,
    warranty: reference.warranty,
    suitableFor: reference.suitableFor,
    cleaningLevel: reference.cleaningLevel,
    maintenance: reference.maintenance,
  };
}

function buildSpecs(reference: CatalogReference, parsedSpecs?: Record<string, string>): Record<string, string> {
  return {
    Цена: reference.price,
    Производитель: reference.brand,
    'Количество пользователей': `до ${reference.users} человек`,
    'Производительность': reference.capacity,
    'Залповый сброс': `${reference.burstDischargeLiters} л`,
    'Тип сброса': reference.dischargeType,
    'Принцип работы': reference.workPrinciple,
    'Энергопотребление': reference.energyUsage,
    Габариты: reference.dimensions,
    Вес: reference.weight,
    Гарантия: reference.warranty,
    'Для чего подходит': reference.suitableFor,
    'Уровень очистки': reference.cleaningLevel,
    Обслуживание: reference.maintenance,
    ...(reference.specs ?? {}),
    ...(parsedSpecs ?? {}),
  };
}

function fallbackReference(folderName: string): CatalogReference {
  return productReference({
    brand: folderName,
    priceValue: 99900,
    users: 5,
    dailyCapacityLiters: 1000,
    burstDischargeLiters: 220,
    dischargeType: 'самотечный / принудительный',
    workPrinciple: 'биологическая очистка',
    energyUsage: '55-70 Вт',
    dimensions: '1100 x 1100 x 2300 мм',
    weight: '140 кг',
    warranty: '3 года',
    suitableFor: 'частный дом или дача',
    cleaningLevel: 'до 97%',
    maintenance: 'плановый сервис 1 раз в год',
    features: ['Эффективная очистка', 'Подходит для частного дома', 'Монтаж под ключ'],
  });
}

export async function getProductsFromFolder(): Promise<Product[]> {
  const rootPath = path.join(process.cwd(), 'for site');
  if (!fs.existsSync(rootPath)) {
    return [];
  }

  const entries = fs
    .readdirSync(rootPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !EXCLUDED_FOLDERS.has(entry.name))
    .map((entry) => entry.name);

  const products = await Promise.all(
    entries.map(async (folderName) => getProductFromFolder(folderName, path.join(rootPath, folderName))),
  );

  return products
    .filter((item): item is Product => Boolean(item))
    .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProductsFromFolder();
  return products.find((product) => product.slug === slug) ?? null;
}
