import type { CaseStudy } from '../content/cases';
import type { PromotionCard } from '../content/promotions';
import type { Product, ProductCatalogVariant } from '../lib/products';
import { imageUrl } from './image';

function formatPriceFromParts(priceText: string | undefined, priceValue: unknown, pricePrefix: string | undefined, fallback: string): string {
  const trimmed = (priceText || '').trim();
  if (trimmed) return trimmed;
  const n = Number(priceValue);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  const prefix = (pricePrefix ?? 'от').trim();
  const formatted = Math.round(n).toLocaleString('ru-RU');
  return `${prefix} ${formatted} ₽`.replace(/\s+/g, ' ');
}

function estimatedVariantPrice(priceValue: number, baseUsers: number, users: number): string {
  if (!priceValue) return 'Цена по запросу';
  const ratio = users / Math.max(baseUsers, 1);
  const multiplier = Math.min(1.9, Math.max(0.75, ratio));
  const price = Math.round((priceValue * multiplier) / 100) * 100;
  return `от ${price.toLocaleString('ru-RU')} ₽`;
}

function dischargeLabelFromValue(discharge: string): string {
  const d = (discharge || '').toLowerCase();
  return d.includes('принуд') ? 'принудительная' : 'самотечная';
}

function normalizeDischargeValue(discharge: string): string {
  const d = (discharge || '').toLowerCase();
  return d.includes('принуд') ? 'принудительный' : 'самотечный';
}

function mapCatalogVariants(row: any, basePriceDisplay: string): ProductCatalogVariant[] {
  const models = Array.isArray(row.models) ? row.models : [];
  const baseUsers = Number(row.users) || 5;
  const priceValue = Number(row.priceValue) || 0;
  const seenSlugs = new Set<string>();

  const rows = models
    .filter((m: any) => m?.modelSlug)
    .map((m: any) => {
      const users = Number(m.users) || baseUsers;
      const discharge = normalizeDischargeValue(String(m.discharge || row.dischargeType || ''));
      const dischargeLabel = dischargeLabelFromValue(discharge);
      const priceTrim = (m.price || '').trim();
      const price =
        priceTrim ||
        (priceValue ? estimatedVariantPrice(priceValue, baseUsers, users) : basePriceDisplay || 'Цена по запросу');

      const modelSlug = String(m.modelSlug)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      return {
        modelSlug,
        title:
          (m.title || '').trim() ||
          `${row.name} — ${users} чел., ${dischargeLabel} сброс`,
        users,
        discharge,
        dischargeLabel,
        price,
        capacity: (m.capacity || '').trim(),
        burstDischarge: (m.burstDischarge || '').trim(),
      };
    })
    .filter((v) => {
      if (!v.modelSlug) return false;
      if (seenSlugs.has(v.modelSlug)) return false;
      seenSlugs.add(v.modelSlug);
      return true;
    });

  return rows;
}

export function mapSanityProducts(rows: any[] = []): Product[] {
  return rows
    .filter((row) => row?.name && row?.slug?.current)
    .map((row) => {
      const images = Array.isArray(row.images)
        ? row.images.map((image: any) => imageUrl(image, '', 900)).filter(Boolean)
        : [];

      const basePriceDisplay = formatPriceFromParts(row.price, row.priceValue, row.pricePrefix, 'Цена по запросу');
      const catalogVariants = mapCatalogVariants(row, basePriceDisplay);

      const specsExtra: Record<string, string> = {};
      if (Array.isArray(row.specsExtra)) {
        for (const pair of row.specsExtra) {
          const k = (pair?.key || '').trim();
          const v = (pair?.value || '').trim();
          if (k && v) specsExtra[k] = v;
        }
      }

      const specs: Record<string, string> = {
        'Количество пользователей': row.users ? `до ${row.users} чел` : '',
        Производительность: row.capacity || '',
        'Залповый сброс': row.burstDischargeLiters ? `${row.burstDischargeLiters} л` : '',
        'Тип сброса': row.dischargeType || '',
        Энергопотребление: row.energyUsage || '',
        Гарантия: row.warranty || '',
        Размеры: row.dimensions || '',
        Вес: row.weight || '',
        ...specsExtra,
      };

      return {
        id: row._id,
        name: row.name,
        slug: row.slug.current,
        brand: row.brand || row.name,
        description: row.description || '',
        price: basePriceDisplay,
        priceValue: Number(row.priceValue) || 0,
        pricePrefix: row.pricePrefix || undefined,
        priceWas: row.priceWas || undefined,
        seoTitle: row.seoTitle || undefined,
        seoDescription: row.seoDescription || undefined,
        catalogVariants: catalogVariants.length ? catalogVariants : undefined,
        images,
        features: Array.isArray(row.features) ? row.features : [],
        specs,
        users: Number(row.users) || 5,
        capacity: row.capacity || '',
        dailyCapacityLiters: Number(row.dailyCapacityLiters) || 0,
        burstDischargeLiters: Number(row.burstDischargeLiters) || 0,
        dischargeType: row.dischargeType || 'Самотечный / Принудительный',
        workPrinciple: row.workPrinciple || '',
        energyUsage: row.energyUsage || '',
        dimensions: row.dimensions || '',
        weight: row.weight || '',
        warranty: row.warranty || '',
        suitableFor: row.suitableFor || '',
        cleaningLevel: row.cleaningLevel || '',
        maintenance: row.maintenance || '',
      };
    });
}

export function mapHomeProjects(rows: any[] = []) {
  return rows.map((row) => ({
    ...row,
    image: imageUrl(row.image, row.image || '', 800),
  }));
}

export function mapReviews(rows: any[] = []) {
  return rows.map((row) => ({
    id: row._id,
    author: row.author,
    area: row.area,
    value: Number(row.value) || 5,
    text: row.text,
    photo: row.photo ? imageUrl(row.photo, '', 400) : undefined,
  }));
}

export function mapCaseStudies(rows: any[] = []): CaseStudy[] {
  return rows
    .filter((r) => r?.slug?.current)
    .map((r) => ({
      slug: r.slug?.current || (typeof r.slug === 'string' ? r.slug : ''),
      title: r.title || '',
      location: r.location || '',
      summary: r.summary || '',
      works: Array.isArray(r.works) ? r.works.filter(Boolean) : [],
      equipment: Array.isArray(r.equipment)
        ? r.equipment
            .filter((e: any) => e?.label && e?.value)
            .map((e: any) => ({ label: String(e.label), value: String(e.value) }))
        : [],
      images: Array.isArray(r.images) ? r.images.map((img: any) => imageUrl(img, '', 1200)).filter(Boolean) : [],
      seoTitle: r.seoTitle || undefined,
      seoDescription: r.seoDescription || undefined,
    }))
    .filter((c) => Boolean(c.slug));
}

function promotionInDateRange(row: any): boolean {
  const today = new Date();
  const day = today.toISOString().slice(0, 10);
  if (row.validFrom && String(row.validFrom) > day) return false;
  if (row.validUntil && String(row.validUntil) < day) return false;
  return true;
}

export function mapPromotions(rows: any[] = []): PromotionCard[] {
  return rows
    .filter((r) => r?.title)
    .filter(promotionInDateRange)
    .map((r) => {
      const discount = Number(r.discountPercent);
      const badgeFromPercent = Number.isFinite(discount) && discount > 0 ? `−${Math.round(discount)}%` : undefined;
      return {
        id: r._id,
        title: r.title,
        description: r.description || '',
        badge: (r.badge || '').trim() || badgeFromPercent,
        imageUrl: r.image ? imageUrl(r.image, '', 900) : undefined,
        imageAlt: r.image?.alt,
        buttonText: r.buttonText || 'Получить условия',
        buttonHref: r.buttonHref || '/#lead',
        validFrom: r.validFrom,
        validUntil: r.validUntil,
        discountPercent: Number.isFinite(discount) ? discount : undefined,
      };
    });
}
