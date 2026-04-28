import CatalogGrid from '../../components/CatalogGrid';
import type { Metadata } from 'next';
import { getCatalogProducts } from '../../lib/catalog-data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Каталог септиков',
  description: 'Каталог септиков для дома и дачи: подбор по количеству пользователей, производительности и бюджету.',
  alternates: { canonical: '/catalog' },
};

export default async function CatalogPage() {
  const products = await getCatalogProducts();

  return (
    <main className="min-h-screen bg-white py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <nav className="flex justify-center mb-6">
            <ol className="flex items-center space-x-2 text-sm text-slate-600">
              <li><a href="/" className="hover:text-primary transition">Главная</a></li>
              <li className="text-slate-400">/</li>
              <li className="text-slate-900 font-medium">Каталог</li>
            </ol>
          </nav>
          <h1 className="section-heading">Септики для дома, дачи и бизнеса</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
            Подберите серию по производителю, назначению, количеству пользователей и типу сброса. Все решения можно установить под ключ по СПб и Ленинградской области.
          </p>
        </div>

        <CatalogGrid products={products} />
      </div>
    </main>
  );
}
