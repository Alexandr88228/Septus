import { unstable_cache } from 'next/cache';
import { client } from './client';
import { imageUrl } from './image';
import { hasSanityConfig } from './env';
import { homePageQuery, productsQuery, reviewsQuery } from './queries';
import { mapHomeProjects, mapReviews, mapSanityProducts } from './mappers';

async function fetchSanitySiteContentUncached() {
  if (!hasSanityConfig) {
    return null;
  }

  const [homePage, products, reviews] = await Promise.all([
    client.fetch(homePageQuery),
    client.fetch(productsQuery),
    client.fetch(reviewsQuery),
  ]);

  return {
    homePage: homePage
      ? {
          ...homePage,
          heroImageUrl: imageUrl(homePage.heroImage, '', 1200),
          heroImageAlt: homePage.heroImage?.alt,
        }
      : null,
    products: mapSanityProducts(products),
    benefits: Array.isArray(homePage?.benefits) ? homePage.benefits : [],
    projects: mapHomeProjects(homePage?.projects),
    faqs: Array.isArray(homePage?.faqs) ? homePage.faqs : [],
    reviews: mapReviews(reviews),
  };
}

export const fetchSanitySiteContent = unstable_cache(fetchSanitySiteContentUncached, ['sanity-site-content'], {
  revalidate: 60,
});
