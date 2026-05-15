import type { Metadata } from 'next';
import CatalogBreadcrumbs from '../../components/CatalogBreadcrumbs';
import CatalogGrid from '../../components/CatalogGrid';
import CatalogPageHero from '../../components/CatalogPageHero';
import { getCatalogProducts } from '../../lib/catalog-data';
import { getSiteUrl } from '../../lib/absolute-site-url';

export const dynamic = 'force-static';
export const revalidate = 86400;

const siteUrl = getSiteUrl();

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

  return (
    <main className="min-h-screen bg-white py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <CatalogBreadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Каталог' }]} />
        </div>

        <CatalogPageHero
          title="Септики для дома, дачи и бизнеса"
          subtitle="Фильтры слева — подбор по назначению, числу пользователей, типу сброса и бюджету. Карточки ведут к моделям производителя."
        />

        <CatalogGrid products={products} />
      </div>
    </main>
  );
}
