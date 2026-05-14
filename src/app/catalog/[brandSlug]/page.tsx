import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import CatalogBreadcrumbs from '../../../components/CatalogBreadcrumbs';
import { getCatalogProductBySlug, getCatalogProducts } from '../../../lib/catalog-data';
import {
  expandProductToModels,
  getBrandDisplayName,
  getLegacySeriesRedirectTarget,
  getUserCountsForBrand,
  groupProductsByBrandSlug,
  slugifyBrand,
} from '../../../lib/catalog-routing';

export const dynamic = 'force-static';
export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await getCatalogProducts();
  const brands = new Set(products.map((p) => slugifyBrand(p.brand)));
  return Array.from(brands).map((brandSlug) => ({ brandSlug }));
}

export async function generateMetadata({ params }: { params: Promise<{ brandSlug: string }> }): Promise<Metadata> {
  const { brandSlug } = await params;
  const products = await getCatalogProducts();
  const name = getBrandDisplayName(brandSlug, products);
  const title = `${name} — модели септиков`;
  const description = `Каталог ${name}: подбор по числу пользователей, характеристики, цены и монтаж под ключ в Санкт-Петербурге и ЛО.`;
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.septus.ru';
  return {
    title,
    description,
    openGraph: { title, description, url: `${siteUrl}/catalog/${brandSlug}/`, type: 'website' },
    twitter: { card: 'summary', title, description },
    alternates: { canonical: `/catalog/${brandSlug}/` },
  };
}

export default async function BrandCatalogPage({ params }: { params: Promise<{ brandSlug: string }> }) {
  const { brandSlug } = await params;
  const products = await getCatalogProducts();
  const groups = groupProductsByBrandSlug(products);

  if (groups.has(brandSlug)) {
    const brandProducts = groups.get(brandSlug)!;
    const counts = getUserCountsForBrand(brandSlug, products);
    const brandName = getBrandDisplayName(brandSlug, products);
    const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.septus.ru';

    return (
      <main className="min-h-screen bg-white py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <CatalogBreadcrumbs
              items={[
                { label: 'Главная', href: '/' },
                { label: 'Каталог', href: '/catalog/' },
                { label: brandName },
              ]}
            />
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#84b827]">Производитель</p>
            <h1 className="section-heading mt-3">{brandName}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
              Выберите число пользователей или конкретную серию. На странице модели — цена, характеристики, фото и заявка на расчёт монтажа.
            </p>
          </div>

          <section className="mx-auto mt-12 max-w-3xl">
            <h2 className="text-center text-lg font-black text-slate-950">По количеству человек</h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {counts.map((n) => (
                <Link
                  key={n}
                  href={`/catalog/${brandSlug}/by/${n}/`}
                  className="min-w-[8.5rem] rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-center text-sm font-black text-slate-900 shadow-sm transition hover:border-[#84b827] hover:bg-[#84b827]/10"
                >
                  {n} {n === 1 ? 'человек' : n < 5 ? 'человека' : 'человек'}
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-center text-lg font-black text-slate-950">Серии и линейки</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {brandProducts.map((product) => {
                const models = expandProductToModels(product);
                const cover = product.images[0];
                return (
                  <article
                    key={product.id}
                    id={`seriya-${product.slug}`}
                    className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/50 shadow-sm"
                  >
                    <div className="relative aspect-[16/10] bg-white">
                      {cover ? (
                        <Image src={cover} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-6" />
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl font-black text-slate-950">{product.name}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{product.description}</p>
                      <p className="mt-4 text-sm font-bold text-[#84b827]">Модели септиков</p>
                      <ul className="mt-3 grid gap-2 text-sm">
                        {models.slice(0, 8).map((m) => (
                          <li key={m.modelSlug}>
                            <Link href={`/catalog/${brandSlug}/${m.modelSlug}/`} className="font-semibold text-slate-800 underline-offset-2 hover:text-[#84b827] hover:underline">
                              {m.name}
                            </Link>
                            <span className="text-slate-500"> — {m.price}</span>
                          </li>
                        ))}
                        {models.length > 8 ? <li className="text-slate-500">… и другие конфигурации</li> : null}
                      </ul>
                      <div className="mt-auto pt-6">
                        <Link href={`/catalog/${brandSlug}/${models[0]?.modelSlug}/`} className="btn-primary inline-flex w-full justify-center text-center">
                          Открыть модель
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: `${brandName} — каталог`,
                url: `${siteUrl}/catalog/${brandSlug}/`,
                isPartOf: { '@type': 'WebSite', name: 'Септус', url: siteUrl },
              }),
            }}
          />
        </div>
      </main>
    );
  }

  const legacy = await getCatalogProductBySlug(brandSlug);
  if (legacy) {
    const target = getLegacySeriesRedirectTarget(legacy);
    if (target) redirect(target);
  }

  notFound();
}
