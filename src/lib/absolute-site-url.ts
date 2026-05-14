const DEFAULT_SITE_URL = 'https://www.septus.ru';

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, '');
}

/** Базовый URL сайта для OG, canonical, robots, sitemap. */
export function getSiteUrl(): string {
  const raw = stripTrailingSlash(process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_SITE_URL);
  const isProductionBuild =
    process.env.NODE_ENV === 'production' || process.env.VERCEL === '1' || process.env.CI === 'true';
  if (isProductionBuild && /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?$/i.test(raw)) {
    return DEFAULT_SITE_URL;
  }
  return raw;
}

export function toAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return '';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = getSiteUrl();
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}
