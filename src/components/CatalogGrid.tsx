'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '../lib/products';
import { trackGoal } from '../lib/metrika';

type SortMode = 'popular' | 'price' | 'name' | 'users' | 'capacity';
type UserFilter = '1-3' | '4-5' | '6-8' | '10+' | '30+';
type PurposeFilter =
  | 'private-house'
  | 'cottage'
  | 'dacha'
  | 'seasonal'
  | 'permanent'
  | 'bath'
  | 'kitchen'
  | 'settlement'
  | 'hotel'
  | 'cafe'
  | 'restaurant'
  | 'gas-station'
  | 'warehouse'
  | 'office'
  | 'business'
  | 'shop'
  | 'industrial'
  | 'recreation'
  | 'high-water';

const userOptions: Array<{ value: UserFilter; label: string; test: (users: number) => boolean }> = [
  { value: '1-3', label: '1-3', test: (users) => users <= 3 },
  { value: '4-5', label: '4-5', test: (users) => users >= 4 && users <= 5 },
  { value: '6-8', label: '6-8', test: (users) => users >= 6 && users <= 8 },
  { value: '10+', label: '10+', test: (users) => users >= 9 && users < 30 },
  { value: '30+', label: '30+ (бизнес)', test: (users) => users >= 30 },
];

const purposeOptions: Array<{ value: PurposeFilter; label: string; keywords: string[] }> = [
  { value: 'private-house', label: 'Для частного дома', keywords: ['дом', 'частн', 'семь', 'прожив'] },
  { value: 'cottage', label: 'Для коттеджа', keywords: ['коттедж', 'повыш', '6', 'круглогод'] },
  { value: 'dacha', label: 'Для дачи', keywords: ['дача', 'сезон', 'редкое'] },
  { value: 'seasonal', label: 'Для сезонного проживания', keywords: ['сезон', 'дача', 'редкое'] },
  { value: 'permanent', label: 'Для постоянного проживания', keywords: ['постоян', 'круглогод', 'семья'] },
  { value: 'bath', label: 'Для бани', keywords: ['баня', 'гостевой', 'небольш'] },
  { value: 'kitchen', label: 'Для кухни', keywords: ['кухн', 'залпов', 'жиро'] },
  { value: 'settlement', label: 'Для поселка', keywords: ['посел', '30', 'больш'] },
  { value: 'hotel', label: 'Для гостиницы', keywords: ['гостин', 'бизнес', '30'] },
  { value: 'cafe', label: 'Для кафе', keywords: ['кафе', 'кухн', 'бизнес'] },
  { value: 'restaurant', label: 'Для ресторана', keywords: ['ресторан', 'кухн', 'бизнес'] },
  { value: 'gas-station', label: 'Для АЗС', keywords: ['азс', 'бизнес', 'офис'] },
  { value: 'warehouse', label: 'Для склада', keywords: ['склад', 'офис', 'бизнес'] },
  { value: 'office', label: 'Для офиса', keywords: ['офис', 'бизнес'] },
  { value: 'business', label: 'Для бизнеса', keywords: ['бизнес', '30', 'гостин', 'кафе'] },
  { value: 'shop', label: 'Для магазина', keywords: ['магазин', 'бизнес'] },
  { value: 'industrial', label: 'Для промышленных предприятий', keywords: ['пром', 'предприят', '30'] },
  { value: 'recreation', label: 'Для базы отдыха', keywords: ['база отдыха', 'гостевой', 'посел'] },
  { value: 'high-water', label: 'Для высоких грунтовых вод', keywords: ['высокий угв', 'грунтов', 'принуд', 'насос', 'сложн'] },
];

const quickTags: Array<{ label: string; type: 'purpose' | 'users' | 'principle'; value: PurposeFilter | UserFilter | string }> = [
  { label: 'Для дачи', type: 'purpose', value: 'dacha' },
  { label: 'Для дома', type: 'purpose', value: 'private-house' },
  { label: 'Для коттеджа', type: 'purpose', value: 'cottage' },
  { label: 'Без откачки', type: 'principle', value: 'без откачки' },
  { label: 'Для высоких грунтовых вод', type: 'purpose', value: 'high-water' },
  { label: 'До 5 человек', type: 'users', value: '4-5' },
  { label: 'Недорогие', type: 'principle', value: 'недорогие' },
];

const principleOptions = [
  'Станции биологической очистки',
  'Без откачки',
  'Энергозависимые',
  'Энергонезависимые',
  'Аэробные',
  'Анаэробные',
  'Гибридные',
  'Недорогие',
];

const dischargeFilterOptions = ['Самотечный', 'Принудительный'];

export default function CatalogGrid({ products }: { products: Product[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<UserFilter[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState<PurposeFilter | ''>('');
  const [selectedPrinciple, setSelectedPrinciple] = useState('');
  const [selectedDischarge, setSelectedDischarge] = useState('');
  const [maxPrice, setMaxPrice] = useState(300000);
  const [minCapacity, setMinCapacity] = useState(0);
  const [sortBy, setSortBy] = useState<SortMode>('popular');

  const brandOptions = useMemo(() => unique(products.map((product) => product.brand)), [products]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const text = `${product.name} ${product.brand} ${product.description} ${product.suitableFor} ${product.dischargeType} ${product.features.join(' ')}`.toLowerCase();

      if (searchQuery && !text.includes(searchQuery.toLowerCase())) return false;
      if (selectedBrand && product.brand !== selectedBrand) return false;
      if (selectedPurpose && !matchesPurpose(product, selectedPurpose)) return false;
      if (selectedPrinciple && !matchesPrinciple(product, selectedPrinciple)) return false;
      if (selectedDischarge && !product.dischargeType.toLowerCase().includes(selectedDischarge.toLowerCase())) return false;
      if (product.priceValue > maxPrice) return false;
      if (product.dailyCapacityLiters < minCapacity) return false;
      if (selectedUsers.length > 0 && !selectedUsers.some((value) => userOptions.find((option) => option.value === value)?.test(product.users))) return false;

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'price') return a.priceValue - b.priceValue;
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'ru');
      if (sortBy === 'users') return a.users - b.users;
      if (sortBy === 'capacity') return b.dailyCapacityLiters - a.dailyCapacityLiters;
      return 0;
    });
  }, [products, searchQuery, selectedBrand, selectedPurpose, selectedPrinciple, selectedDischarge, maxPrice, minCapacity, selectedUsers, sortBy]);

  const hasActiveFilters = Boolean(
    searchQuery || selectedBrand || selectedPurpose || selectedPrinciple || selectedDischarge || selectedUsers.length || maxPrice !== 300000 || minCapacity !== 0,
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedUsers([]);
    setSelectedBrand('');
    setSelectedPurpose('');
    setSelectedPrinciple('');
    setSelectedDischarge('');
    setMaxPrice(300000);
    setMinCapacity(0);
    setSortBy('popular');
  };

  return (
    <div>
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#84b827]">Быстрый подбор</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {quickTags.map((tag) => (
            <button
              key={tag.label}
              type="button"
              onClick={() => {
                if (tag.type === 'purpose') setSelectedPurpose(tag.value as PurposeFilter);
                if (tag.type === 'users') setSelectedUsers([tag.value as UserFilter]);
                if (tag.type === 'principle') setSelectedPrinciple(tag.value);
              }}
              className="rounded-full border border-[#84b827]/40 bg-[#84b827]/10 px-4 py-2 text-sm font-extrabold text-[#10214a] transition hover:bg-[#84b827] hover:text-white"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-44">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#84b827]">Фильтры каталога</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Подбор септика</h2>
            </div>
            {hasActiveFilters && (
              <button type="button" onClick={resetFilters} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-[#84b827] hover:text-[#84b827]">
                Сбросить
              </button>
            )}
          </div>

          <div className="grid gap-5">
            <FilterInput label="Поиск" value={searchQuery} onChange={setSearchQuery} placeholder="Название, бренд..." />
            <FilterSelect label="По производителю" value={selectedBrand} onChange={setSelectedBrand} options={brandOptions} placeholder="Все производители" />
            <FilterSelect
              label="По назначению"
              value={selectedPurpose}
              onChange={(value) => setSelectedPurpose(value as PurposeFilter | '')}
              options={purposeOptions.map((option) => option.value)}
              placeholder="Любое назначение"
              getLabel={(value) => purposeOptions.find((option) => option.value === value)?.label ?? value}
            />
            <FilterSelect label="По принципу работы" value={selectedPrinciple} onChange={setSelectedPrinciple} options={principleOptions} placeholder="Любой принцип" />
            <FilterSelect label="Тип сброса" value={selectedDischarge} onChange={setSelectedDischarge} options={dischargeFilterOptions} placeholder="Любой сброс" />

            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-900">По количеству пользователей</label>
              <div className="flex flex-wrap gap-2">
                {userOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setSelectedUsers((current) =>
                        current.includes(option.value) ? current.filter((value) => value !== option.value) : [...current, option.value],
                      )
                    }
                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      selectedUsers.includes(option.value) ? 'bg-[#84b827] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-900">Цена до</label>
              <input type="range" min="60000" max="300000" step="10000" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} className="w-full accent-[#84b827]" />
              <p className="mt-2 text-sm font-semibold text-slate-700">до {maxPrice.toLocaleString('ru-RU')} ₽</p>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Найдено: <span className="font-bold text-slate-950">{filteredProducts.length}</span> из {products.length}
            </p>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortMode)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#84b827]">
              <option value="popular">По популярности</option>
              <option value="price">По цене</option>
              <option value="name">По названию</option>
              <option value="users">По пользователям</option>
              <option value="capacity">По производительности</option>
            </select>
          </div>

      <div className="grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <article key={product.id} className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <Link
              href={`/catalog/${product.slug}`}
              onClick={() => trackGoal('open_product', { productName: product.name })}
              className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
            >
              <Image
                src={product.images[0] || '/placeholder.jpg'}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-slate-950/90 px-3 py-1 text-xs font-semibold text-white">{getBadge(product)}</span>
            </Link>

            <div className="flex flex-1 flex-col p-6">
              <Link
                href={`/catalog/${product.slug}`}
                onClick={() => trackGoal('open_product', { productName: product.name })}
                className="mb-2 block text-xl font-bold text-slate-950 transition hover:text-emerald-700"
              >
                {product.name}
              </Link>

              <div className="mb-4">
                <span className="whitespace-nowrap text-xl font-black text-emerald-700 xl:text-2xl">{product.price}</span>
              </div>

              <div className="mb-5 grid gap-2 text-base text-slate-700">
                <p><span className="font-semibold text-slate-950">Производительность:</span> {product.capacity}</p>
                <p><span className="font-semibold text-slate-950">Тип обслуживания:</span> {getServiceType(product)}</p>
              </div>

              <div className="mb-5 flex flex-wrap gap-2">
                {product.features.slice(0, 2).map((feature) => (
                  <span key={feature} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {feature}
                  </span>
                ))}
              </div>

              <Link
                href={`/catalog/${product.slug}`}
                onClick={() => trackGoal('open_product', { productName: product.name })}
                className="mt-auto inline-flex items-center justify-center rounded-2xl bg-[#84b827] px-5 py-3 text-base font-black text-white transition hover:bg-[#6d981f]"
              >
                Посмотреть все модели
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="rounded-3xl bg-slate-50 py-14 text-center">
          <p className="text-xl font-bold text-slate-900">Товары не найдены</p>
          <p className="mt-2 text-slate-500">Попробуйте изменить параметры или сбросить фильтры.</p>
          <button type="button" onClick={resetFilters} className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">
            Сбросить фильтры
          </button>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

function FilterInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="mb-3 block text-sm font-semibold text-slate-900">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
      />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  getLabel = (option) => option,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  getLabel?: (value: string) => string;
}) {
  return (
    <div>
      <label className="mb-3 block text-sm font-semibold text-slate-900">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {getLabel(option)}
          </option>
        ))}
      </select>
    </div>
  );
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'ru'));
}

function matchesPurpose(product: Product, purpose: PurposeFilter): boolean {
  const option = purposeOptions.find((item) => item.value === purpose);
  if (!option) return true;

  const haystack = `${product.name} ${product.description} ${product.suitableFor} ${product.dischargeType} ${product.maintenance} ${product.features.join(' ')}`.toLowerCase();

  if (purpose === 'high-water') {
    return haystack.includes('угв') || haystack.includes('принуд') || haystack.includes('насос');
  }

  if (purpose === 'bath') {
    return product.users <= 4 || option.keywords.some((keyword) => haystack.includes(keyword));
  }

  if (purpose === 'cottage') {
    return product.users >= 6 || option.keywords.some((keyword) => haystack.includes(keyword));
  }

  return option.keywords.some((keyword) => haystack.includes(keyword));
}

function matchesPrinciple(product: Product, principle: string): boolean {
  const value = principle.toLowerCase();
  const haystack = `${product.name} ${product.description} ${product.workPrinciple} ${product.energyUsage} ${product.maintenance} ${product.features.join(' ')}`.toLowerCase();

  if (value.includes('без откачки')) return !haystack.includes('частая откачка') && (haystack.includes('био') || haystack.includes('аэроб') || haystack.includes('аэра'));
  if (value.includes('энергозавис')) return haystack.includes('вт') || haystack.includes('компрессор') || haystack.includes('насос');
  if (value.includes('энергонезавис')) return haystack.includes('энергонезавис');
  if (value.includes('аэроб')) return haystack.includes('аэроб') || haystack.includes('аэра');
  if (value.includes('анаэроб')) return haystack.includes('анаэроб') || haystack.includes('отстаив');
  if (value.includes('гибрид')) return haystack.includes('гибрид') || haystack.includes('анаэробно-аэроб');
  if (value.includes('недорог')) return product.priceValue <= 100000;
  if (value.includes('биолог')) return haystack.includes('биолог') || haystack.includes('биоочист');

  return haystack.includes(value);
}

function getBadge(product: Product) {
  if (product.priceValue < 90000) return 'Эконом';
  if (product.users >= 6) return 'Для коттеджа';
  if (product.dischargeType.toLowerCase().includes('принуд')) return 'Высокие грунтовые воды';
  return 'Для дома';
}

function getServiceType(product: Product) {
  const haystack = `${product.name} ${product.workPrinciple} ${product.maintenance} ${product.features.join(' ')}`.toLowerCase();
  return haystack.includes('ассениз') || haystack.includes('отстаив') || haystack.includes('осадка') ? 'ассенизатором' : 'своими руками';
}
