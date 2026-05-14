/** Базовый URL сайта для OG, canonical, ссылок в письмах. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.septus.ru';
  return raw.replace(/\/$/, '');
}

export function toAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return '';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = getSiteUrl();
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}
