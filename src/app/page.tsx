import HomePageClient from './HomePageClient';
import { fetchSanitySiteContent } from '../sanity/fetchers';
import { getCatalogProducts } from '../lib/catalog-data';

export const dynamic = 'force-static';
export const revalidate = 86400;

export default async function Home() {
  const cmsContent = await fetchSanitySiteContent().catch((error) => {
    console.warn('Sanity CMS unavailable for homepage, using local catalog fallback', error);
    return null;
  });

  if (cmsContent) {
    const products = cmsContent.products.length > 0 ? cmsContent.products : await getCatalogProducts();

    return (
      <HomePageClient
        initialData={{
          ...cmsContent,
          products,
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
      }}
    />
  );
}
