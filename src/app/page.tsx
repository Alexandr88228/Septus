import HomePageClient from './HomePageClient';
import { fetchSanitySiteContent } from '../sanity/fetchers';
import { getCatalogProducts } from '../lib/catalog-data';

export const revalidate = 60;

export default async function Home() {
  const cmsContent = await fetchSanitySiteContent().catch((error) => {
    console.warn('Sanity CMS unavailable for homepage, using local catalog fallback', error);
    return null;
  });

  if (cmsContent) {
    return <HomePageClient initialData={cmsContent} />;
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
      }}
    />
  );
}
