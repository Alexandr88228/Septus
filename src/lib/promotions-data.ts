import { unstable_cache } from 'next/cache';
import { PROMOTION_CARDS, type PromotionCard } from '../content/promotions';
import { client } from '../sanity/client';
import { hasSanityConfig } from '../sanity/env';
import { mapPromotions } from '../sanity/mappers';
import { promotionsQuery } from '../sanity/queries';
import { PUBLIC_PAGE_REVALIDATE_SECONDS } from './cache';
import { SANITY_CACHE_TAG } from './sanity-cache-tag';

async function getSanityPromotionsUncached(): Promise<PromotionCard[]> {
  if (!hasSanityConfig) return [];
  try {
    const rows = await client.fetch(promotionsQuery);
    return mapPromotions(rows);
  } catch (error) {
    console.warn('Sanity promotions unavailable', error);
    return [];
  }
}

const getSanityPromotions = unstable_cache(getSanityPromotionsUncached, ['sanity-promotions'], {
  revalidate: PUBLIC_PAGE_REVALIDATE_SECONDS,
  tags: [SANITY_CACHE_TAG],
});

export async function getPromotionCards(): Promise<PromotionCard[]> {
  const fromSanity = await getSanityPromotions();
  if (fromSanity.length > 0) return fromSanity;
  return PROMOTION_CARDS;
}
