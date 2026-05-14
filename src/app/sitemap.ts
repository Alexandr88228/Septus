import type { MetadataRoute } from 'next';
import { getCatalogProducts } from '../lib/catalog-data';
import { buildAllModelRows, getUserCountsForBrand, groupProductsByBrandSlug } from '../lib/catalog-routing';
import { getAllCases } from '../lib/cases';

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
    '/cases',
    '/promotions',
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

  const groups = groupProductsByBrandSlug(products);
  const brandRoutes: MetadataRoute.Sitemap = Array.from(groups.keys()).map((brandSlug) => ({
    url: withTrailingSlash(`${siteUrl}/catalog/${brandSlug}`),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const byRoutes: MetadataRoute.Sitemap = [];
  for (const brandSlug of groups.keys()) {
    for (const n of getUserCountsForBrand(brandSlug, products)) {
      byRoutes.push({
        url: withTrailingSlash(`${siteUrl}/catalog/${brandSlug}/by/${n}`),
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.75,
      });
    }
  }

  const modelRoutes: MetadataRoute.Sitemap = buildAllModelRows(products).map((row) => ({
    url: withTrailingSlash(`${siteUrl}/catalog/${row.brandSlug}/${row.modelSlug}`),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const caseRoutes: MetadataRoute.Sitemap = (await getAllCases()).map((c) => ({
    url: withTrailingSlash(`${siteUrl}/cases/${c.slug}`),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }));

  return [...staticRoutes, ...brandRoutes, ...byRoutes, ...modelRoutes, ...caseRoutes];
}

function withTrailingSlash(url: string) {
  return url.endsWith('/') ? url : `${url}/`;
}
