import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import CatalogBreadcrumbs from '../../components/CatalogBreadcrumbs';
import CatalogGrid from '../../components/CatalogGrid';
import { getCatalogProducts } from '../../lib/catalog-data';
import { getBrandDisplayName, groupProductsByBrandSlug } from '../../lib/catalog-routing';

export const dynamic = 'force-static';
export const revalidate = 86400;

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.septus.ru';

export const metadata: Metadata = {
  title: 'Каталог септиков',
  description: 'Каталог септиков по производителям и числу пользователей: модели, цены, характеристики и монтаж под ключ в СПб и ЛО.',
  alternates: { canonical: '/catalog/' },
  openGraph: {
    title: 'Каталог септиков | Септус',
    description: 'Подбор септика по бренду и модели. Доставка и установка.',
    url: `${siteUrl}/catalog/`,
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Каталог септиков | Септус', description: 'Подбор септика по бренду и модели.' },
};

export default async function CatalogPage() {
  const products = await getCatalogProducts();
  const groups = groupProductsByBrandSlug(products);
  const brandEntries = Array.from(groups.entries()).sort((a, b) =>
    getBrandDisplayName(a[0], products).localeCompare(getBrandDisplayName(b[0], products), 'ru'),
  );

  return (
    <main className="min-h-screen bg-white py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <CatalogBreadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Каталог' }]} />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <h1 className="section-heading">Септики для дома, дачи и бизнеса</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
            Сначала выберите производителя — затем число пользователей или конкретную модель. Ниже доступен расширенный подбор по фильтрам.
          </p>
        </div>

        <section className="mx-auto mt-12 max-w-6xl">
          <h2 className="text-center text-lg font-black text-slate-950">Производители</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {brandEntries.map(([brandSlug, plist]) => {
              const first = plist[0];
              const cover = first?.images[0];
              const name = getBrandDisplayName(brandSlug, products);
              const fromPrice = Math.min(...plist.map((p) => p.priceValue || 0).filter(Boolean));
              const priceLabel = fromPrice ? `от ${fromPrice.toLocaleString('ru-RU')} ₽` : 'Цена по запросу';
              return (
                <Link
                  key={brandSlug}
                  href={`/catalog/${brandSlug}/`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/40 shadow-sm transition hover:-translate-y-1 hover:border-[#84b827]/50 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] bg-white">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain p-6 transition duration-300 group-hover:scale-[1.02]"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-black text-slate-950">{name}</h3>
                    <p className="mt-2 text-sm text-slate-600">{plist.length} серий в каталоге</p>
                    <p className="mt-4 text-lg font-black text-[#84b827]">{priceLabel}</p>
                    <span className="mt-auto pt-4 text-sm font-bold text-[#10214a] group-hover:text-[#84b827]">Перейти к моделям →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-7xl border-t border-slate-200 pt-16">
          <h2 className="text-center text-lg font-black text-slate-950">Расширенный подбор</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">Фильтры по назначению, числу пользователей, типу сброса и бюджету.</p>
          <div className="mt-10">
            <CatalogGrid products={products} />
          </div>
        </section>
      </div>
    </main>
  );
}
