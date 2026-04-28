import { client } from './client';
import { imageUrl } from './image';
import { hasSanityConfig } from './env';
import { homePageQuery, productsQuery, reviewsQuery } from './queries';
import { mapHomeProjects, mapReviews, mapSanityProducts } from './mappers';

export async function fetchSanitySiteContent() {
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
          heroImageUrl: imageUrl(homePage.heroImage),
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
