'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import LeadForm from './lead-form';
import { trackGoal } from '../lib/metrika';

type HomePageData = {
  homePage: any;
  products: any[];
  benefits: any[];
  projects: any[];
  reviews: any[];
  faqs: any[];
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

const defaultProjects = [
  { image: '/photos/photo_9_2026-04-12_13-00-49.jpg', location: 'Всеволожск', model: 'Биодевайс ПРО', duration: 'Монтаж за 1 день', complexity: 'Сложный грунт', result: 'Запуск в день установки' },
  { image: '/photos/photo_14_2026-04-12_13-00-49.jpg', location: 'Гатчина', model: 'Юнилос Астра', duration: 'Монтаж за 1 день', complexity: 'Высокие грунтовые воды', result: 'Стабильная работа без запаха' },
  { image: '/photos/photo_23_2026-04-12_13-00-49.jpg', location: 'Пушкин', model: 'Топас', duration: 'Монтаж за 1 день', complexity: 'Ограниченный участок', result: 'Компактное решение под ключ' },
  { image: '/photos/photo_31_2026-04-12_13-00-49.jpg', location: 'Кудрово', model: 'Волгарь', duration: 'Монтаж за 1 день', complexity: 'Зимний монтаж', result: 'Сдано по договору в срок' },
];

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
  { label: 'Средние грунтовые воды', value: 'medium', extra: 8000 },
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
  const [projects, setProjects] = useState<any[]>(initialData?.projects ?? []);
  const [reviews, setReviews] = useState<any[]>(initialData?.reviews ?? []);
  const [faqs, setFaqs] = useState<any[]>(initialData?.faqs ?? []);
  const [homePageContent, setHomePageContent] = useState<any>(initialData?.homePage ?? null);

  useEffect(() => {
    if (initialData) return;

    const loadData = async () => {
      try {
        const productsResponse = await fetch('/api/products');
        const localProducts = await productsResponse.json();
        setProducts(Array.isArray(localProducts) ? localProducts : []);
      } catch (fallbackError) {
        console.error('Fallback products loading failed:', fallbackError);
      }
    };

    loadData();
  }, [initialData]);

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
      <section id="home" className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-emerald-50 px-5 py-12 md:px-10 md:py-16">
        <div className="pointer-events-none absolute -top-20 -right-10 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-sky-200/20 blur-3xl" />
        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-7">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-600">{homePageContent?.heroBadge || 'Работа по договору | СПб и ЛО'}</span>
            <h1 className="max-w-4xl text-5xl font-black leading-[1.03] tracking-tight text-[#0b1734] md:text-7xl">{homePageContent?.heroTitle || 'СЕПТУС — септики под ключ СПБ и ЛО'}</h1>
            <p className="max-w-2xl text-2xl font-semibold leading-relaxed text-slate-700">{homePageContent?.heroText || 'Монтаж, доставка, запуск и гарантия до 10 лет. Бесплатный выезд инженера сегодня.'}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/catalog" onClick={() => trackGoal('click_catalog')} className="btn-outline text-base font-black">Смотреть каталог</Link>
              <Link href="#calculator" onClick={() => trackGoal('click_calculator')} className="inline-flex items-center justify-center rounded-[1.75rem] border border-[#84b827] bg-[#84b827] px-8 py-4 text-base font-black text-white shadow-medium transition hover:-translate-y-0.5 hover:bg-[#6d981f]">Рассчитать стоимость</Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(homePageContent?.heroBadges?.length ? homePageContent.heroBadges : ['★★★★★ 5.0 рейтинг', '350+ объектов', '8+ лет опыта', 'Гарантия 10 лет']).map((badge: string) => (
                <div key={badge} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-bold text-slate-700 shadow-sm">{badge}</div>
              ))}
            </div>
          </div>
          <div className="relative rounded-3xl border border-white/70 bg-white/80 p-4 shadow-2xl backdrop-blur md:p-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src={homePageContent?.heroImageUrl || '/photos/photo_6_2026-04-12_13-00-49.jpg'} alt={homePageContent?.heroImageAlt || 'Монтаж септика под ключ в Санкт-Петербурге и Ленинградской области'} fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover object-center" />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {['Бесплатный выезд инженера', 'Сертифицированное оборудование', 'Подбор под участок за 5 минут', 'Без скрытых доплат'].map((point) => (
                <div key={point} className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700">{point}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Почему выбирают нас</p>
          <h2 className="section-heading mt-4">Надежный подрядчик для септика под ключ</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {(benefits.length > 0 ? benefits.slice(0, 4) : defaultBenefits).map((item: any) => (
            <article key={item.id || item.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-medium">
              <h3 className="text-2xl font-extrabold leading-tight text-slate-900">{item.title}</h3>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">{item.description}</p>
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
                <Image src={(product.images && product.images[0]) || '/photos/photo_5_2026-04-12_13-00-49.jpg'} alt={product.name || product.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain p-4" />
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
                  <Link href={`/catalog/${product.slug || product.title?.toLowerCase().replace(/\s+/g, '-')}`} className="btn-outline flex-1 px-4 py-3 text-sm" onClick={() => trackGoal('open_product')}>Подробнее</Link>
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
              <h2 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">Предварительная стоимость септика под ключ</h2>
              <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-slate-300">Калькулятор считает оборудование, монтаж, грунт, уровень воды и длину трассы.</p>
            </div>

            <div className="mt-10 grid gap-6 animate-slide-in-left">
              <CalculatorGroup title="Сколько человек будет пользоваться канализацией?">
                {peopleOptions.map((option) => (
                  <CalculatorButton key={option.label} active={people === option.value} onClick={() => setPeople(option.value)}>
                    <span className="block text-lg font-extrabold">{option.label}</span>
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

          <div className="rounded-3xl bg-[#0b1734] p-8 text-white shadow-2xl animate-slide-in-right md:p-12">
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-sm uppercase tracking-wider text-[#84b827] font-bold">Стоимость септика под ключ</p>
                <p className="mt-6 text-4xl font-black text-[#84b827] md:text-6xl">
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
        <div className="space-y-8">
          <div className="animate-fade-in">
            <div>
              <p className="text-sm uppercase tracking-wider text-emerald-600 font-bold">Наши работы</p>
              <h2 className="section-heading">Галерея кейсов: наши монтажи</h2>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(projects.length > 0 ? projects.slice(0, 4) : defaultProjects).map((project: any) => (
              <article key={project.id || project.image} className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-medium">
                <div className="relative h-56 w-full">
                  <Image src={project.image?.startsWith('/') ? project.image : '/photos/photo_1_2026-04-12_13-00-49.jpg'} alt={project.location || 'Кейс монтажа'} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xl font-extrabold text-slate-900">{project.location}</p>
                  <div className="mt-3 space-y-2 text-base leading-relaxed text-slate-600">
                    <p><span className="font-semibold text-slate-800">Модель:</span> {project.model || 'Биодевайс ПРО'}</p>
                    <p><span className="font-semibold text-slate-800">Срок:</span> {project.duration || 'Монтаж за 1 день'}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
                <h3 className="mb-3 text-xl font-extrabold leading-snug text-[#84b827]">{item.step}</h3>
                <p className="text-base text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="container mx-auto px-4">
        <div className="glass rounded-3xl p-12 shadow-2xl hover-lift">
          <div className="text-center mb-12 animate-fade-in">
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
        <div className="relative overflow-hidden rounded-3xl p-6 text-white shadow-2xl hover-lift md:p-12" style={{ background: '#0b1734' }}>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-green-500/10"></div>
          <div className="pointer-events-none absolute top-20 left-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="pointer-events-none absolute bottom-20 right-20 w-80 h-80 bg-green-500/5 rounded-full blur-3xl"></div>

          <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl font-black leading-tight text-white md:text-5xl">{homePageContent?.leadTitle || 'Получите бесплатную консультацию'}</h2>
              <p className="mt-6 max-w-2xl text-slate-300 leading-relaxed text-lg">{homePageContent?.leadText || 'Оставьте данные и инженер свяжется в течение часа. Подготовим выгодное решение по вашему участку с учетом всех особенностей.'}</p>
            </div>
            <div className="glass-dark rounded-3xl p-10 shadow-2xl animate-slide-in-right">
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
