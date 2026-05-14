import { unstable_cache } from 'next/cache';
import { client } from './client';
import { imageUrl } from './image';
import { hasSanityConfig } from './env';
import { caseStudiesQuery, homePageQuery, productsQuery, promotionsQuery, reviewsQuery } from './queries';
import { mapCaseStudies, mapHomeProjects, mapPromotions, mapReviews, mapSanityProducts } from './mappers';
import { PUBLIC_PAGE_REVALIDATE_SECONDS } from '../lib/cache';
import { SANITY_CACHE_TAG } from '../lib/sanity-cache-tag';

async function fetchSanitySiteContentUncached() {
  if (!hasSanityConfig) {
    return null;
  }

  const [homePage, products, reviews, promotions, caseStudies] = await Promise.all([
    client.fetch(homePageQuery),
    client.fetch(productsQuery),
    client.fetch(reviewsQuery),
    client.fetch(promotionsQuery),
    client.fetch(caseStudiesQuery),
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
    promotions: mapPromotions(promotions),
    featuredCases: mapCaseStudies(Array.isArray(homePage?.featuredCaseStudies) ? homePage.featuredCaseStudies : []),
    allCaseStudies: mapCaseStudies(caseStudies),
  };
}

export const fetchSanitySiteContent = unstable_cache(fetchSanitySiteContentUncached, ['sanity-site-content'], {
  revalidate: PUBLIC_PAGE_REVALIDATE_SECONDS,
  tags: [SANITY_CACHE_TAG],
});
