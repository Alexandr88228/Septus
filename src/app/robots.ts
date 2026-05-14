import type { MetadataRoute } from 'next';
import { getSiteUrl } from '../lib/absolute-site-url';

export const revalidate = 86400;

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
