import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';
import { fetchSanitySiteContent } from '../sanity/fetchers';
import { getCatalogProducts } from '../lib/catalog-data';
import { getAllCases } from '../lib/cases';

export const dynamic = 'force-static';
export const revalidate = 86400;

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.septus.ru';

export const metadata: Metadata = {
  title: 'Септики под ключ в Санкт-Петербурге и ЛО',
  description:
    'Монтаж септиков под ключ за 1 день: бесплатный выезд инженера, подбор модели, доставка и гарантия. Септус — СПб и Ленинградская область.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Септус — септики под ключ в Санкт-Петербурге и ЛО',
    description: 'Подбор, доставка и монтаж автономных септиков. Бесплатный замер и расчёт стоимости.',
    siteName: 'Септус',
    locale: 'ru_RU',
  },
};

export default async function Home() {
  const cmsContent = await fetchSanitySiteContent().catch((error) => {
    console.warn('Sanity CMS unavailable for homepage, using local catalog fallback', error);
    return null;
  });

  const allCases = await getAllCases();

  const casesForHome =
    cmsContent?.featuredCases?.length
      ? cmsContent.featuredCases
      : cmsContent?.allCaseStudies?.length
        ? cmsContent.allCaseStudies
        : allCases;

  if (cmsContent) {
    const products = cmsContent.products.length > 0 ? cmsContent.products : await getCatalogProducts();

    return (
      <HomePageClient
        initialData={{
          ...cmsContent,
          products,
          cases: casesForHome.slice(0, 4),
        }}
      />
    );
  }

  const products = await getCatalogProducts();

  return (
    <HomePageClient
      initialData={{
        homePage: null,
        products,
        benefits: [],
        projects: [],
        reviews: [],
        faqs: [],
        cases: allCases.slice(0, 4),
      }}
    />
  );
}
