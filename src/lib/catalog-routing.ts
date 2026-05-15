import type { Product } from './products';
import { toSlug } from './slug';

export function slugifyBrand(brand: string): string {
  return toSlug(brand);
}

export type CatalogModelRow = {
  modelSlug: string;
  brandSlug: string;
  productSlug: string;
  name: string;
  users: number;
  discharge: string;
  dischargeLabel: string;
  price: string;
  capacity: string;
  burstDischarge: string;
};

function getSeriesUserCounts(product: Product): number[] {
  const name = product.name.toLowerCase();

  if (name.includes('удача')) return [3, 4];
  if (name.includes('евролос био')) return [3, 4, 5, 8];
  if (name.includes('юнилос астра') || name.includes('топас')) return [3, 4, 5, 6, 8, 10];
  return [3, 5, 6, 8, 10];
}

function getDischargeModels(product: Product): Array<{ label: string; value: string }> {
  const dischargeType = product.dischargeType.toLowerCase();
  const hasForced = dischargeType.includes('принуд');
  const hasGravity = dischargeType.includes('самотеч') || !hasForced;

  return [
    ...(hasGravity ? [{ label: 'самотечная', value: 'самотечный' }] : []),
    ...(hasForced ? [{ label: 'принудительная', value: 'принудительный' }] : []),
  ];
}

function getEstimatedModelPrice(product: Product, users: number): string {
  if (!product.priceValue) return product.price;

  const ratio = users / Math.max(product.users, 1);
  const multiplier = Math.min(1.9, Math.max(0.75, ratio));
  const price = Math.round((product.priceValue * multiplier) / 100) * 100;
  return `от ${price.toLocaleString('ru-RU')} ₽`;
}

export function expandProductToModels(product: Product): CatalogModelRow[] {
  const brandSlug = slugifyBrand(product.brand);

  if (product.catalogVariants?.length) {
    return product.catalogVariants.map((v) => ({
      modelSlug: v.modelSlug,
      brandSlug,
      productSlug: product.slug,
      name: v.title,
      users: v.users,
      discharge: v.discharge,
      dischargeLabel: v.dischargeLabel,
      price: v.price,
      capacity: v.capacity || `${v.users * 200} л/сутки`,
      burstDischarge: v.burstDischarge || `${v.users * 50} л`,
    }));
  }

  const users = getSeriesUserCounts(product);
  const dischargeTypes = getDischargeModels(product);

  return users.flatMap((count) =>
    dischargeTypes.map((discharge) => {
      const dKey = discharge.value.includes('принуд') ? 'p' : 's';
      const modelSlug = `${product.slug}-${count}-${dKey}`;
      return {
        modelSlug,
        brandSlug,
        productSlug: product.slug,
        name: `${product.name} — ${count} чел., ${discharge.label} сброс`,
        users: count,
        discharge: discharge.value,
        dischargeLabel: discharge.label,
        price: getEstimatedModelPrice(product, count),
        capacity: `${count * 200} л/сутки`,
        burstDischarge: `${count * 50} л`,
      };
    }),
  );
}

export function buildAllModelRows(products: Product[]): CatalogModelRow[] {
  return products.flatMap((p) => expandProductToModels(p));
}

export function groupProductsByBrandSlug(products: Product[]): Map<string, Product[]> {
  const map = new Map<string, Product[]>();
  for (const p of products) {
    const key = slugifyBrand(p.brand);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }
  for (const [, list] of map) {
    list.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }
  return map;
}

export function getBrandDisplayName(brandSlug: string, products: Product[]): string {
  const match = products.find((p) => slugifyBrand(p.brand) === brandSlug);
  return match?.brand ?? brandSlug;
}

export function findModel(products: Product[], brandSlug: string, modelSlug: string): { row: CatalogModelRow; product: Product } | null {
  for (const p of products) {
    if (slugifyBrand(p.brand) !== brandSlug) continue;
    const rows = expandProductToModels(p);
    const row = rows.find((r) => r.modelSlug === modelSlug);
    if (row) return { row, product: p };
  }
  return null;
}

export function getUserCountsForBrand(brandSlug: string, products: Product[]): number[] {
  const list = products.filter((p) => slugifyBrand(p.brand) === brandSlug);
  const counts = new Set<number>();
  for (const p of list) {
    expandProductToModels(p).forEach((r) => counts.add(r.users));
  }
  return Array.from(counts).sort((a, b) => a - b);
}

export function getModelsForBrandAndUsers(brandSlug: string, users: number, products: Product[]): CatalogModelRow[] {
  const list = products.filter((p) => slugifyBrand(p.brand) === brandSlug);
  const rows: CatalogModelRow[] = [];
  for (const p of list) {
    rows.push(...expandProductToModels(p).filter((r) => r.users === users));
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
}

/** Все сегменты для generateStaticParams: бренды + slug серий (старые URL). */
export function collectCatalogBrandSegmentParams(products: Product[]): { brandSlug: string }[] {
  const seen = new Set<string>();
  const params: { brandSlug: string }[] = [];

  const add = (slug: string) => {
    const key = slug?.trim();
    if (!key || seen.has(key)) return;
    seen.add(key);
    params.push({ brandSlug: key });
  };

  for (const p of products) {
    add(slugifyBrand(p.brand));
    add(p.slug);
  }

  return params;
}

/**
 * Старый URL вида /catalog/evrolos-pro/ (slug серии, не бренда) → страница бренда с якорем на серию.
 * null = сегмент уже валидный brandSlug, рендерим страницу.
 */
export function resolveCatalogBrandSegmentRedirect(segment: string, products: Product[]): string | null {
  if (groupProductsByBrandSlug(products).has(segment)) return null;

  const product = products.find((p) => p.slug === segment);
  if (!product) return null;

  const brandSlug = slugifyBrand(product.brand);
  if (product.slug === brandSlug) {
    return `/catalog/${brandSlug}/`;
  }

  return `/catalog/${brandSlug}/#seriya-${product.slug}`;
}

/** @deprecated используйте resolveCatalogBrandSegmentRedirect */
export function getLegacySeriesRedirectTarget(product: Product): string | null {
  return resolveCatalogBrandSegmentRedirect(product.slug, [product]);
}
