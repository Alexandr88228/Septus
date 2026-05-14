'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { slugifyBrand } from '../lib/slug';
import { trackGoal } from '../lib/metrika';
import type { CaseStudy } from '../content/cases';

const LeadForm = dynamic(() => import('./lead-form'), {
  ssr: false,
  loading: () => <div className="rounded-2xl bg-white/10 p-6 text-sm font-semibold text-slate-200">Загружаем форму заявки...</div>,
});

type HomePageData = {
  homePage: any;
  products: any[];
  benefits: any[];
  projects: any[];
  reviews: any[];
  faqs: any[];
  cases?: CaseStudy[];
};

const catalogModels = [
  {
    title: 'Aqua 3',
    subtitle: 'Для семьи до 3 человек',
    price: 'от 189 000 ₽',
    features: ['Объем 2.5 м', 'Автономная работа', 'до 3 чел'],
  },
  {
    title: 'Aqua 5',
    subtitle: 'Для дома до 5 человек',
    price: 'от 259 000 ₽',
    features: ['Объем 3.5 м', 'Система аэрации', 'до 5 чел'],
  },
  {
    title: 'Aqua 8',
    subtitle: 'Для загородного дома',
    price: 'от 329 000 ₽',
    features: ['Объем 5.5 м', 'Противоотечная система', 'до 8 чел'],
  },
  {
    title: 'Dacha Pro',
    subtitle: 'Для дачи и сезонного проживания',
    price: 'от 149 000 ₽',
    features: ['Компактный корпус', 'Экономичный режим', 'легкая установка'],
  },
  {
    title: 'Mega Home',
    subtitle: 'Для большого дома и коттеджа',
    price: 'от 399 000 ₽',
    features: ['Объем 8 м', 'Для 10+ чел', 'Профессиональная автоматика'],
  },
];

const defaultBenefits = [
  { title: 'Монтаж за 1 день', description: 'Сильная монтажная команда с отработанным регламентом установки.' },
  { title: 'Гарантия до 10 лет', description: 'Официальная гарантия на оборудование и выполненные работы.' },
  { title: 'Без скрытых доплат', description: 'Фиксируем смету заранее и согласуем все этапы до старта.' },
  { title: 'Работаем по СПб и ЛО', description: 'Выезд инженера по городу и области, включая сложные участки.' },
];

const defaultImages = {
  hero: '/catalog-images/biodevays-standart/septik-biodevays-standart.webp',
  product: '/catalog-images/yunilos-astra/septik-yunilos-astra-5.webp',
};

const defaultReviews = [
  { author: 'Игорь, Парголово', value: 5.0, text: 'Поставили за один день, всё чисто и быстро.' },
  { author: 'Анна, Всеволожск', value: 5.0, text: 'Менеджер всё объяснил, цена без сюрпризов.' },
  { author: 'Сергей, Гатчина', value: 5.0, text: 'Работает тихо, запаха нет.' },
  { author: 'Марина, Пушкин', value: 5.0, text: 'Очень довольны монтажом и сервисом.' },
  { author: 'Дмитрий, Колтуши', value: 5.0, text: 'Помогли подобрать модель под высокий грунт.' },
  { author: 'Олег, Ломоносов', value: 5.0, text: 'Приехали вовремя, сделали качественно.' },
];

const faqItems = [
  { question: 'Какой септик выбрать?', answer: 'Мы подберем систему на основе количества людей, типа грунта и расстояния до коммуникаций.' },
  { question: 'Что если высокий уровень грунтовых вод?', answer: 'Предлагаем защитные основания и усиленные герметичные корпуса под ключ.' },
  { question: 'Сколько служит?', answer: 'Правильная эксплуатация дает 20+ лет работы без ремонта.' },
  { question: 'Можно ли зимой установить?', answer: 'Да, монтаж возможен круглый год при подготовке участка и утеплении инженерных узлов.' },
];

const peopleOptions = [
  { label: '1-3 человека', value: 3, model: 'септик для 1-3 человек', baseDistance: 'short' },
  { label: '4-5 человек', value: 5, model: 'септик для 4-5 человек', baseDistance: 'medium' },
  { label: '6-8 человек', value: 8, model: 'септик для 6-8 человек', baseDistance: 'medium' },
  { label: '9+ человек', value: 10, model: 'септик для 9+ человек', baseDistance: 'long' },
];

const residenceOptions = [
  { label: 'Сезонное проживание', value: 'seasonal' },
  { label: 'Постоянное проживание', value: 'permanent' },
];

const soilOptions = [
  { label: 'Песок / сухой грунт', value: 'sand', extra: 0 },
  { label: 'Суглинок / глина', value: 'clay', extra: 12000 },
  { label: 'Сложный грунт', value: 'complex', extra: 24000 },
];

const waterLevelOptions = [
  { label: 'Низкие грунтовые воды', value: 'low', extra: 0 },
  { label: 'Высокие грунтовые воды', value: 'high', extra: 18000 },
];

const distanceOptions = [
  { label: 'до 5 м от дома', value: 'short', extra: 0 },
  { label: 'до 10 м', value: 'medium', extra: 0 },
  { label: 'более 10 м', value: 'long', extra: 22000 },
];

const estimateMatrix: Record<string, { equipment: number; mounting: number }> = {
  '3-seasonal-short': { equipment: 89900, mounting: 29000 },
  '3-permanent-short': { equipment: 107000, mounting: 29000 },
  '5-seasonal-medium': { equipment: 116000, mounting: 32000 },
  '5-permanent-medium': { equipment: 124000, mounting: 35000 },
  '8-seasonal-medium': { equipment: 149000, mounting: 39000 },
  '8-permanent-medium': { equipment: 168000, mounting: 42000 },
  '10-seasonal-long': { equipment: 189000, mounting: 45000 },
  '10-permanent-long': { equipment: 218000, mounting: 49000 },
};

function CalculatorGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#222d49] p-5 shadow-lg md:p-6">
      <label className="mb-4 block text-base font-extrabold text-white">{title}</label>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function CalculatorButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-16 whitespace-normal rounded-2xl border-2 px-4 py-4 text-left text-sm font-bold leading-snug transition-all duration-300 hover-lift md:text-base ${
        active
          ? 'border-[#84b827] bg-[#84b827] text-white shadow-lg'
          : 'border-white/10 bg-[#0b1734] text-slate-100 hover:border-[#84b827] hover:bg-[#10214a]'
      }`}
    >
      {children}
    </button>
  );
}

function EstimateRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={strong ? 'font-bold text-white' : 'text-slate-300'}>{label}</span>
      <span className={strong ? 'text-lg font-black text-emerald-300' : 'font-bold text-white'}>{value}</span>
    </div>
  );
}

export default function HomePageClient({ initialData }: { initialData?: HomePageData | null }) {
  const [people, setPeople] = useState(3);
  const [residence, setResidence] = useState('seasonal');
  const [soil, setSoil] = useState('sand');
  const [waterLevel, setWaterLevel] = useState('low');
  const [distance, setDistance] = useState('short');
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [products, setProducts] = useState<any[]>(initialData?.products ?? []);
  const [benefits, setBenefits] = useState<any[]>(initialData?.benefits ?? []);
  const [reviews, setReviews] = useState<any[]>(initialData?.reviews ?? []);
  const [faqs, setFaqs] = useState<any[]>(initialData?.faqs ?? []);
  const [homePageContent, setHomePageContent] = useState<any>(initialData?.homePage ?? null);
  const casesPreview = initialData?.cases?.length ? initialData.cases.slice(0, 4) : [];

  const estimate = useMemo(() => {
    const selectedPeople = peopleOptions.find((item) => item.value === people) ?? peopleOptions[1];
    const selectedResidence = residenceOptions.find((item) => item.value === residence) ?? residenceOptions[0];
    const selectedSoil = soilOptions.find((item) => item.value === soil) ?? soilOptions[0];
    const selectedWaterLevel = waterLevelOptions.find((item) => item.value === waterLevel) ?? waterLevelOptions[0];
    const selectedDistance = distanceOptions.find((item) => item.value === distance) ?? distanceOptions[1];
    const baseDistance = selectedPeople.baseDistance;
    const base = estimateMatrix[`${selectedPeople.value}-${selectedResidence.value}-${baseDistance}`] ?? estimateMatrix['3-seasonal-short'];

    const equipment = base.equipment;
    const mounting = base.mounting;
    const extras = selectedSoil.extra + selectedWaterLevel.extra + selectedDistance.extra;
    const total = equipment + mounting + extras;

    return {
      equipment,
      mounting,
      extras,
      total,
      model: selectedPeople.model,
      soilLabel: selectedSoil.label,
      waterLevelLabel: selectedWaterLevel.label,
      distanceLabel: selectedDistance.label,
    };
  }, [people, residence, soil, waterLevel, distance]);

  const popularModelNames = [
    'Биодевайс ПРО',
    'Биодевайс ГОСТ',
    'Топас',
    'Юнилос Астра',
    'Волгарь',
    'Гринлос',
  ];

  const popularProducts = useMemo(() => {
    const selected: any[] = [];

    popularModelNames.forEach(name => {
      const match = products.find(product => product.name?.toLowerCase().includes(name.toLowerCase()));
      if (match && !selected.some(item => item.id === match.id)) {
        selected.push(match);
      }
    });

    products.forEach(product => {
      if (selected.length >= 6) return;
      if (!selected.some(item => item.id === product.id)) {
        selected.push(product);
      }
    });

    return selected.slice(0, 6);
  }, [products]);

  const displayedReviews = reviews.length > 0 ? reviews : defaultReviews;
  const activeReview = displayedReviews[activeReviewIndex % displayedReviews.length] ?? defaultReviews[0];
  const showPreviousReview = () => setActiveReviewIndex((current) => (current - 1 + displayedReviews.length) % displayedReviews.length);
  const showNextReview = () => setActiveReviewIndex((current) => (current + 1) % displayedReviews.length);

  return (
    <div className="space-y-16 pb-20">
      <section id="home" className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white px-4 py-8 sm:px-6 sm:py-10 md:rounded-[2rem] md:bg-gradient-to-br md:from-white md:via-slate-50 md:to-emerald-50/80 md:px-8 md:py-12 lg:py-14">
        <div className="pointer-events-none absolute -top-20 -right-10 hidden h-72 w-72 rounded-full bg-emerald-300/15 blur-3xl md:block" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 hidden h-64 w-64 rounded-full bg-sky-200/15 blur-3xl md:block" />
        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
          <div className="space-y-5 md:space-y-6">
            <span className="inline-flex max-w-full items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600 sm:text-xs sm:tracking-[0.2em]">
              {homePageContent?.heroBadge || 'Работа по договору | СПб и ЛО'}
            </span>
            <h1 className="hero-title max-w-3xl">
              {homePageContent?.heroTitle || 'Септус — септики под ключ в СПб и ЛО'}
            </h1>
            <p className="hero-lead max-w-xl">
              {homePageContent?.heroText || 'Монтаж, доставка, запуск и гарантия до 10 лет. Бесплатный выезд инженера по согласованию.'}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href={homePageContent?.heroCtaPrimaryHref || '/catalog/'}
                onClick={() => trackGoal('click_catalog')}
                className="btn-outline px-6 py-3.5 text-sm font-bold sm:text-base"
              >
                {homePageContent?.heroCtaPrimaryLabel || 'Смотреть каталог'}
              </Link>
              <Link
                href={homePageContent?.heroCtaSecondaryHref || '#calculator'}
                onClick={() => trackGoal('click_calculator')}
                className="inline-flex items-center justify-center rounded-[1.75rem] border border-[#84b827] bg-[#84b827] px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#6d981f] sm:text-base"
              >
                {homePageContent?.heroCtaSecondaryLabel || 'Рассчитать стоимость'}
              </Link>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {(homePageContent?.heroBadges?.length ? homePageContent.heroBadges : ['★★★★★ 5.0 рейтинг', '350+ объектов', '8+ лет опыта', 'Гарантия 10 лет']).map((badge: string) => (
                <div key={badge} className="rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 shadow-sm sm:text-sm">
                  {badge}
                </div>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-2 shadow-sm md:bg-white/90 md:p-3 md:shadow-lg md:backdrop-blur-sm">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white">
                <Image
                  src={homePageContent?.heroImageUrl || defaultImages.hero}
                  alt={homePageContent?.heroImageAlt || 'Монтаж септика под ключ в Санкт-Петербурге и Ленинградской области'}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-contain object-center p-2 sm:p-3"
                />
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {['Бесплатный выезд инженера', 'Сертифицированное оборудование', 'Подбор под участок', 'Без скрытых доплат'].map((point) => (
                  <div key={point} className="rounded-lg bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-700 md:bg-slate-50/90 md:text-sm">
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 sm:text-sm sm:tracking-[0.2em]">Почему выбирают нас</p>
          <h2 className="section-heading mt-3">Надёжный подрядчик для септика под ключ</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 md:gap-6">
          {(benefits.length > 0 ? benefits.slice(0, 4) : defaultBenefits).map((item: any) => (
            <article key={item.id || item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-medium md:rounded-3xl md:p-7">
              <h3 className="text-lg font-bold leading-snug text-slate-900 md:text-xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">{item.description}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="#lead" className="btn-secondary">Подобрать септик за 5 минут</Link>
        </div>
      </section>

      <section id="catalog" className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Популярные модели</p>
            <h2 className="section-heading mt-3">Лучшие решения для дома и дачи</h2>
          </div>
          <Link href="/catalog" className="btn-outline" onClick={() => trackGoal('click_catalog')}>Перейти в каталог</Link>
        </div>
        <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(popularProducts.length > 0 ? popularProducts.slice(0, 3) : catalogModels.slice(0, 3)).map((product: any, index) => (
            <article key={product.id || product.title} className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-medium">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-50">
                <Image src={(product.images && product.images[0]) || defaultImages.product} alt={product.name || product.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain p-4" />
                <span className="absolute left-3 top-3 rounded-full bg-slate-900/85 px-3 py-1 text-xs font-semibold text-white">{index === 0 ? 'Хит' : index === 1 ? 'Лучший выбор' : 'Для семьи'}</span>
              </div>
              <div className="flex flex-1 flex-col">
                <h3 className="mt-4 text-2xl font-extrabold leading-tight text-slate-900">{product.name || product.title}</h3>
                <p className="mt-3 line-clamp-3 text-base leading-relaxed text-slate-600">{product.description || product.subtitle}</p>
                <div className="mt-auto flex items-center justify-between gap-4 pt-5 text-base">
                  <span className="font-bold text-secondary">{product.price || 'Цена по запросу'}</span>
                  <span className="text-slate-500">до {product.users || 8} чел</span>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Link
                    href={`/catalog/${slugifyBrand(product.brand)}/`}
                    className="btn-outline flex-1 px-4 py-3 text-center text-sm"
                    onClick={() => trackGoal('open_product')}
                  >
                    Подробнее
                  </Link>
                  <Link href="#lead" className="btn-primary flex-1 px-4 py-3 text-sm">Подобрать</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="calculator" className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl bg-[#0b1734] p-6 shadow-2xl md:p-10">
            <div className="animate-fade-in">
              <p className="text-sm uppercase tracking-wider text-[#84b827] font-bold">Интерактивный расчет</p>
              <h2 className="mt-4 text-2xl font-bold leading-tight text-white md:text-3xl">Предварительная стоимость септика под ключ</h2>
              <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-300 md:mt-5 md:text-lg">Калькулятор считает оборудование, монтаж, грунт, уровень воды и длину трассы.</p>
            </div>

            <div className="mt-10 grid gap-6 animate-slide-in-left">
              <CalculatorGroup title="Сколько человек будет пользоваться канализацией?">
                {peopleOptions.map((option) => (
                  <CalculatorButton key={option.label} active={people === option.value} onClick={() => setPeople(option.value)}>
                    <span className="block text-base font-bold md:text-lg">{option.label}</span>
                  </CalculatorButton>
                ))}
              </CalculatorGroup>

              <div className="grid gap-6 lg:grid-cols-2">
                <CalculatorGroup title="Режим проживания">
                  {residenceOptions.map((option) => (
                    <CalculatorButton key={option.value} active={residence === option.value} onClick={() => setResidence(option.value)}>
                      {option.label}
                    </CalculatorButton>
                  ))}
                </CalculatorGroup>

                <CalculatorGroup title="Расстояние от дома до септика">
                  {distanceOptions.map((option) => (
                    <CalculatorButton key={option.value} active={distance === option.value} onClick={() => setDistance(option.value)}>
                      {option.label}
                    </CalculatorButton>
                  ))}
                </CalculatorGroup>
              </div>

              <CalculatorGroup title="Тип грунта">
                {soilOptions.map((option) => (
                  <CalculatorButton key={option.value} active={soil === option.value} onClick={() => setSoil(option.value)}>
                    {option.label}
                  </CalculatorButton>
                ))}
              </CalculatorGroup>

              <CalculatorGroup title="Уровень воды">
                {waterLevelOptions.map((option) => (
                  <CalculatorButton key={option.value} active={waterLevel === option.value} onClick={() => setWaterLevel(option.value)}>
                    {option.label}
                  </CalculatorButton>
                ))}
              </CalculatorGroup>
            </div>
          </div>

          <div className="rounded-3xl bg-[#0b1734] p-8 text-white shadow-2xl animate-slide-in-right md:p-12 lg:sticky lg:top-36 lg:self-start">
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-sm uppercase tracking-wider text-[#84b827] font-bold">Стоимость септика под ключ</p>
                <p className="mt-4 whitespace-nowrap text-3xl font-black text-[#84b827] md:text-5xl">
                  {estimate.total.toLocaleString('ru-RU')} ₽
                </p>
                <p className="mt-5 max-w-xl text-slate-300 leading-relaxed">Точная цена зависит от глубины выхода трубы, подъезда техники, грунта и выбранной модели. Инженер уточнит смету после осмотра участка.</p>
              </div>

              <div className="glass-dark rounded-2xl p-6">
                <div className="grid gap-4 text-sm">
                  <EstimateRow label="Оборудование" value={`${estimate.equipment.toLocaleString('ru-RU')} ₽`} />
                  <EstimateRow label="Монтаж и пусконаладка" value={`${estimate.mounting.toLocaleString('ru-RU')} ₽`} />
                    <EstimateRow label="Грунт, вода и трасса" value={`${estimate.extras.toLocaleString('ru-RU')} ₽`} />
                  <div className="border-t border-white/10 pt-4">
                    <EstimateRow label="Итого под ключ" value={`${estimate.total.toLocaleString('ru-RU')} ₽`} strong />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
                <p><span className="font-semibold text-white">Подходящая категория:</span> {estimate.model}</p>
                <p className="mt-2"><span className="font-semibold text-white">Грунт:</span> {estimate.soilLabel}</p>
                <p className="mt-2"><span className="font-semibold text-white">Уровень воды:</span> {estimate.waterLevelLabel}</p>
                <p className="mt-2"><span className="font-semibold text-white">Трасса:</span> {estimate.distanceLabel}</p>
              </div>

              <Link href="#lead" className="btn-secondary w-full justify-center hover-lift">Получить точный расчет</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="container mx-auto px-4">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 sm:text-sm">Наши работы</p>
            <h2 className="section-heading mt-2">Реальные монтажи</h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">Фото с объектов и описание работ. Полный список — в разделе кейсов.</p>
          </div>
          <Link href="/cases/" className="btn-outline shrink-0 text-sm">
            Все кейсы
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {casesPreview.map((c) => (
            <Link
              key={c.slug}
              href={`/cases/${c.slug}/`}
              className="group flex min-h-[100%] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#84b827]/40 hover:shadow-md md:rounded-3xl"
            >
              <div className="relative aspect-[4/3] w-full shrink-0 bg-slate-100">
                {c.images[0] ? (
                  <Image
                    src={c.images[0]}
                    alt={c.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain object-center p-3 transition duration-300 group-hover:scale-[1.02]"
                  />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-4 md:p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#84b827]">{c.location}</p>
                <p className="mt-1 text-base font-bold leading-snug text-slate-900 md:text-lg">{c.title}</p>
                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">{c.summary}</p>
                <span className="mt-4 text-xs font-bold text-[#10214a] group-hover:text-[#84b827] md:text-sm">Подробнее →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="reviews" className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="animate-fade-in">
            <p className="text-sm uppercase tracking-wider text-emerald-600 font-bold">Отзывы</p>
            <h2 className="section-heading mt-4">Оценка 5.0 и доверие клиентов</h2>
            <p className="mt-6 max-w-2xl text-slate-600 section-subtitle leading-relaxed">Реальные отзывы с подтверждением качества работ и четких сроков. Мы не продаем обещания, мы сдаем проекты.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl md:p-8">
            <article className="rounded-2xl bg-slate-50 p-7 transition md:p-8">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#84b827] text-xl font-bold text-white shadow-lg">
                  {activeReview.author.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{activeReview.author}</p>
                  <p className="text-xs text-slate-500">{activeReview.area || activeReview.author.split(',')[1]?.trim() || 'Санкт-Петербург'}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-1.5 w-1.5 rounded-full bg-[#84b827]"></div>
                      ))}
                    </div>
                    <p className="text-sm font-medium text-slate-500">
                      {(typeof activeReview.value === 'string' ? parseFloat(activeReview.value) : activeReview.value).toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-lg leading-relaxed text-slate-700">"{activeReview.text}"</p>
            </article>
            <div className="mt-6 flex items-center justify-between gap-4">
              <button type="button" onClick={showPreviousReview} aria-label="Предыдущий отзыв" className="flex h-12 w-12 items-center justify-center rounded-full border border-[#84b827] text-2xl font-black text-[#84b827] transition hover:bg-[#84b827] hover:text-white">
                ‹
              </button>
              <p className="text-sm font-bold text-slate-500">{activeReviewIndex + 1} / {displayedReviews.length}</p>
              <button type="button" onClick={showNextReview} aria-label="Следующий отзыв" className="flex h-12 w-12 items-center justify-center rounded-full border border-[#84b827] text-2xl font-black text-[#84b827] transition hover:bg-[#84b827] hover:text-white">
                ›
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="container mx-auto px-4">
        <div className="glass rounded-3xl p-6 shadow-2xl hover-lift md:p-12">
          <div className="text-center mb-12 animate-fade-in">
            <p className="text-sm uppercase tracking-wider text-emerald-600 font-bold">Как проходит работа</p>
            <h2 className="section-heading mt-4">Процесс установки за 5 шагов</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-5">
            {[
              { step: 'Заявка', desc: 'Оставляете заявку или звоните' },
              { step: 'Бесплатный выезд', desc: 'Инженер осматривает участок' },
              { step: 'Подбор модели', desc: 'Выбираем оптимальный септик' },
              { step: 'Монтаж за 1 день', desc: 'Установка и подключение' },
              { step: 'Гарантия и запуск', desc: 'Тестирование и обслуживание' }
            ].map((item, index) => (
              <div key={item.step} className="service-card rounded-3xl border border-slate-100 bg-white p-5 text-center shadow-soft hover-lift animate-scale-in md:p-6" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#84b827]/30 bg-[#84b827]/10 text-xl font-black text-[#84b827] shadow-xl mb-6">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-lg font-bold leading-snug text-[#84b827] md:mb-3 md:text-xl">{item.step}</h3>
                <p className="text-sm text-slate-600 leading-relaxed md:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="zamer-info" className="container mx-auto px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Условия</p>
            <h2 className="section-heading mt-2">Замер, доставка и оплата</h2>
            <p className="mt-3 text-sm text-slate-600 md:text-base">Кратко о главном — подробности на странице «Доставка и оплата».</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3 md:gap-6">
            {(Array.isArray(homePageContent?.infoBlocks) && homePageContent.infoBlocks.length > 0
              ? homePageContent.infoBlocks
              : [
                  {
                    label: 'Бесплатный замер',
                    body: 'Выезд инженера, подбор решения, смета за 3 дня, согласование монтажа и пуск за один день.',
                  },
                  {
                    label: 'Доставка',
                    body: 'Входит в стоимость «под ключ». Без монтажа — доставка до 80 км в подарок. Возможен самовывоз.',
                  },
                  {
                    label: 'Оплата',
                    body: 'Удобные варианты для частных клиентов. Юридическим лицам — оплата по счёту.',
                  },
                ]
            ).map((block: { label: string; body: string }) => (
              <div key={block.label} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 md:p-6">
                <p className="text-sm font-bold text-[#84b827]">{block.label}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{block.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href={homePageContent?.infoBlocksLinkHref || '/order/'}
              className="btn-outline inline-flex px-6 py-3 text-sm font-bold"
            >
              {homePageContent?.infoBlocksLinkLabel || 'Все условия доставки и оплаты'}
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" className="container mx-auto px-4">
        <div className="glass rounded-3xl p-6 shadow-2xl hover-lift md:p-10 lg:p-12">
          <div className="text-center mb-8 md:mb-12 animate-fade-in">
            <p className="text-sm uppercase tracking-wider text-emerald-600 font-bold">FAQ</p>
            <h2 className="section-heading mt-4">Частые вопросы и ответы</h2>
          </div>
          <div className="grid gap-6">
            {faqs.length > 0 ? faqs.map((item, index) => (
              <div key={item.id} className="faq-card glass rounded-2xl p-8 hover-lift animate-slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.question}</h3>
                <p className="text-slate-600 leading-relaxed">{item.answer}</p>
              </div>
            )) : faqItems.map((item, index) => (
              <div key={item.question} className="faq-card glass rounded-2xl p-8 hover-lift animate-slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.question}</h3>
                <p className="text-slate-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="lead" className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-2xl hover-lift md:p-10 lg:p-12" style={{ background: '#0b1734' }}>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-green-500/10"></div>
          <div className="pointer-events-none absolute top-20 left-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="pointer-events-none absolute bottom-20 right-20 w-80 h-80 bg-green-500/5 rounded-full blur-3xl"></div>

          <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-black leading-tight text-white md:text-4xl">{homePageContent?.leadTitle || 'Получите бесплатную консультацию'}</h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:mt-5 md:text-lg">{homePageContent?.leadText || 'Оставьте данные — инженер свяжется в течение часа и подготовит решение под ваш участок.'}</p>
            </div>
            <div className="glass-dark rounded-3xl p-6 shadow-2xl md:p-8 lg:p-10">
              <LeadForm title="Оставить заявку" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
