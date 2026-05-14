import { unstable_cache } from 'next/cache';
import { client } from '../sanity/client';
import { hasSanityConfig } from '../sanity/env';
import { mapSanityProducts } from '../sanity/mappers';
import { productsQuery } from '../sanity/queries';
import { PUBLIC_PAGE_REVALIDATE_SECONDS } from './cache';
import { SANITY_CACHE_TAG } from './sanity-cache-tag';
import { getProductsFromFolder, type Product } from './products';

async function getSanityProductsUncached(): Promise<Product[]> {
  if (!hasSanityConfig) return [];

  try {
    return mapSanityProducts(await client.fetch(productsQuery));
  } catch (error) {
    console.warn('Sanity products unavailable, using local catalog fallback', error);
    return [];
  }
}

const getSanityProducts = unstable_cache(getSanityProductsUncached, ['sanity-products'], {
  revalidate: PUBLIC_PAGE_REVALIDATE_SECONDS,
  tags: [SANITY_CACHE_TAG],
});

async function getCatalogProductsUncached(): Promise<Product[]> {
  const [sanityProducts, localProducts] = await Promise.all([
    getSanityProducts(),
    getProductsFromFolder(),
  ]);

  if (sanityProducts.length === 0) {
    return localProducts;
  }

  /** В Sanity есть хотя бы один товар — источник правды только CMS (без склейки с файлами). */
  return sanityProducts.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
}

export const getCatalogProducts = unstable_cache(getCatalogProductsUncached, ['catalog-products'], {
  revalidate: PUBLIC_PAGE_REVALIDATE_SECONDS,
  tags: [SANITY_CACHE_TAG],
});

export async function getCatalogProductBySlug(slug: string): Promise<Product | null> {
  const products = await getCatalogProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getRelatedCatalogProducts(currentSlug: string, limit = 3): Promise<Product[]> {
  const products = await getCatalogProducts();
  return products.filter((product) => product.slug !== currentSlug).slice(0, limit);
}
