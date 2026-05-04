import type { MetadataRoute } from 'next';
import { getCatalogProducts } from '../lib/catalog-data';

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.septus.ru';
  const products = await getCatalogProducts();
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/catalog',
    '/about',
    '/gallery',
    '/lead',
    '/order',
    '/setup/bitrix',
    '/septik-vsevolozhsk',
    '/septik-gatchina',
    '/septik-pushkin',
    '/septik-kudrovo',
  ].map((route) => ({
    url: withTrailingSlash(`${siteUrl}${route}`),
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: withTrailingSlash(`${siteUrl}/catalog/${product.slug}`),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}

function withTrailingSlash(url: string) {
  return url.endsWith('/') ? url : `${url}/`;
}
