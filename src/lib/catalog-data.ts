import { client } from '../sanity/client';
import { hasSanityConfig } from '../sanity/env';
import { mapSanityProducts } from '../sanity/mappers';
import { productsQuery } from '../sanity/queries';
import { getProductsFromFolder, type Product } from './products';

async function getSanityProducts(): Promise<Product[]> {
  if (!hasSanityConfig) return [];

  try {
    return mapSanityProducts(await client.fetch(productsQuery));
  } catch (error) {
    console.warn('Sanity products unavailable, using local catalog fallback', error);
    return [];
  }
}

export async function getCatalogProducts(): Promise<Product[]> {
  const [sanityProducts, localProducts] = await Promise.all([
    getSanityProducts(),
    getProductsFromFolder(),
  ]);

  if (sanityProducts.length === 0) {
    return localProducts;
  }

  const productsBySlug = new Map<string, Product>();
  localProducts.forEach((product) => productsBySlug.set(product.slug, product));
  sanityProducts.forEach((product) => productsBySlug.set(product.slug, product));

  return Array.from(productsBySlug.values()).sort((a, b) => a.name.localeCompare(b.name, 'ru'));
}

export async function getCatalogProductBySlug(slug: string): Promise<Product | null> {
  const products = await getCatalogProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getRelatedCatalogProducts(currentSlug: string, limit = 3): Promise<Product[]> {
  const products = await getCatalogProducts();
  return products.filter((product) => product.slug !== currentSlug).slice(0, limit);
}
