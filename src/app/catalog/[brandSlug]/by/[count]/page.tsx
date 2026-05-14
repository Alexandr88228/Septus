import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import CatalogBreadcrumbs from '../../../../../components/CatalogBreadcrumbs';
import { getCatalogProducts } from '../../../../../lib/catalog-data';
import {
  getBrandDisplayName,
  getModelsForBrandAndUsers,
  getUserCountsForBrand,
  groupProductsByBrandSlug,
  slugifyBrand,
} from '../../../../../lib/catalog-routing';

export const dynamic = 'force-static';
export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await getCatalogProducts();
  const groups = groupProductsByBrandSlug(products);
  const out: { brandSlug: string; count: string }[] = [];
  for (const brandSlug of groups.keys()) {
    for (const n of getUserCountsForBrand(brandSlug, products)) {
      out.push({ brandSlug, count: String(n) });
    }
  }
  return out;
}

export async function generateMetadata({ params }: { params: Promise<{ brandSlug: string; count: string }> }): Promise<Metadata> {
  const { brandSlug, count } = await params;
  const products = await getCatalogProducts();
  const brandName = getBrandDisplayName(brandSlug, products);
  const title = `${brandName} — септик на ${count} чел.`;
  const description = `Модели ${brandName} на ${count} пользователей: самотечный и принудительный сброс, цены и характеристики.`;
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.septus.ru';
  return {
    title,
    description,
    openGraph: { title, description, url: `${siteUrl}/catalog/${brandSlug}/by/${count}/`, type: 'website' },
    twitter: { card: 'summary', title, description },
    alternates: { canonical: `/catalog/${brandSlug}/by/${count}/` },
  };
}

export default async function BrandByUsersPage({ params }: { params: Promise<{ brandSlug: string; count: string }> }) {
  const { brandSlug, count } = await params;
  const users = Number.parseInt(count, 10);
  const products = await getCatalogProducts();
  const groups = groupProductsByBrandSlug(products);

  if (!groups.has(brandSlug) || Number.isNaN(users)) {
    notFound();
  }

  const models = getModelsForBrandAndUsers(brandSlug, users, products);
  if (models.length === 0) {
    notFound();
  }

  const brandName = getBrandDisplayName(brandSlug, products);

  return (
    <main className="min-h-screen bg-white py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <CatalogBreadcrumbs
            items={[
              { label: 'Главная', href: '/' },
              { label: 'Каталог', href: '/catalog/' },
              { label: brandName, href: `/catalog/${brandSlug}/` },
              { label: `${users} чел.` },
            ]}
          />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#84b827]">Модели септиков</p>
          <h1 className="section-heading mt-3">
            {brandName} — {users}{' '}
            {users === 1 ? 'человек' : users < 5 ? 'человека' : 'человек'}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
            Выберите серию и тип сброса. На странице модели — подробные характеристики, фото и форма заявки.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
          {models.map((m) => (
            <article key={m.modelSlug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
              <h2 className="text-lg font-black text-slate-950">{m.name}</h2>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Производительность:</span> {m.capacity}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Залповый сброс:</span> {m.burstDischarge}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Сброс:</span> {m.discharge}
                </p>
                <p className="text-lg font-black text-[#84b827]">{m.price}</p>
              </div>
              <Link href={`/catalog/${brandSlug}/${m.modelSlug}/`} className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#84b827] px-4 py-3 text-sm font-black text-white transition hover:bg-[#6d981f]">
                Подробнее о модели
              </Link>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-xl text-center">
          <Link href={`/catalog/${brandSlug}/`} className="text-sm font-bold text-[#84b827] hover:underline">
            ← Все серии {brandName}
          </Link>
        </div>
      </div>
    </main>
  );
}
