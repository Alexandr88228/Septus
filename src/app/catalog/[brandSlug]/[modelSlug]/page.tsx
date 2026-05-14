import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import LeadForm from '../../../lead-form';
import CatalogBreadcrumbs from '../../../../components/CatalogBreadcrumbs';
import ProductViewTracker from '../../../../components/ProductViewTracker';
import { getCatalogProducts } from '../../../../lib/catalog-data';
import {
  buildAllModelRows,
  findModel,
  getBrandDisplayName,
  slugifyBrand,
} from '../../../../lib/catalog-routing';
import { getSiteUrl, toAbsoluteUrl } from '../../../../lib/absolute-site-url';

export const dynamic = 'force-static';
export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await getCatalogProducts();
  return buildAllModelRows(products)
    .filter((row) => row.modelSlug !== 'by')
    .map((row) => ({
      brandSlug: row.brandSlug,
      modelSlug: row.modelSlug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ brandSlug: string; modelSlug: string }> }): Promise<Metadata> {
  const { brandSlug, modelSlug } = await params;
  const products = await getCatalogProducts();
  const found = findModel(products, brandSlug, modelSlug);
  if (!found) {
    return { title: 'Модель не найдена' };
  }
  const { row, product } = found;
  const title = product.seoTitle || `${row.name} — купить и установить`;
  const description =
    product.seoDescription ||
    `${product.name} на ${row.users} чел., ${row.dischargeLabel} сброс. ${(product.description || '').slice(0, 140)}${product.description?.length > 140 ? '…' : ''}`;
  const image = product.images[0];
  const siteUrl = getSiteUrl();
  const ogImage = image ? toAbsoluteUrl(image) : toAbsoluteUrl('/logo.webp');
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${siteUrl}/catalog/${brandSlug}/${modelSlug}/`,
      images: [{ url: ogImage }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
    alternates: { canonical: `/catalog/${brandSlug}/${modelSlug}/` },
  };
}

export default async function CatalogModelPage({ params }: { params: Promise<{ brandSlug: string; modelSlug: string }> }) {
  const { brandSlug, modelSlug } = await params;
  if (modelSlug === 'by') {
    notFound();
  }

  const products = await getCatalogProducts();
  const found = findModel(products, brandSlug, modelSlug);
  if (!found) {
    notFound();
  }

  const { row, product } = found;
  const brandName = getBrandDisplayName(brandSlug, products);
  const siteUrl = getSiteUrl();
  const h1 = `${product.name} — ${row.users} чел., ${row.dischargeLabel} сброс`;

  const relatedProducts = products
    .filter((p) => slugifyBrand(p.brand) === brandSlug && p.slug !== product.slug)
    .slice(0, 3);

  const priceDigits = row.price.replace(/[^\d]/g, '') || String(product.priceValue || 0);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: h1,
    description: `${product.description || ''} Конфигурация: ${row.users} пользователей, ${row.discharge}.`.trim(),
    image: (product.images || []).map((u) => toAbsoluteUrl(u)).filter(Boolean),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
      price: priceDigits,
      url: `${siteUrl}/catalog/${brandSlug}/${modelSlug}/`,
    },
  };

  const variantSpecs: Record<string, string> = {
    ...product.specs,
    'Количество пользователей': `до ${row.users} человек`,
    'Производительность (оценка)': row.capacity,
    'Залповый сброс (оценка)': row.burstDischarge,
    'Тип сброса': row.discharge,
    Цена: row.price,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <ProductViewTracker productName={h1} />
      <Script id="product-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <div className="container mx-auto px-4 py-4">
        <CatalogBreadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Каталог', href: '/catalog/' },
            { label: brandName, href: `/catalog/${brandSlug}/` },
            { label: product.name, href: `/catalog/${brandSlug}/` },
            { label: h1 },
          ]}
        />
      </div>

      <section className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            {product.images && product.images.length > 0 ? (
              <div className="grid gap-4">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
                  <Image src={product.images[0]} alt={h1} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain p-4" priority />
                </div>
                {product.images.length > 1 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {product.images.slice(1).map((image, index) => (
                      <div key={image} className="relative aspect-square overflow-hidden rounded-xl bg-white">
                        <Image src={image} alt={`${h1} — фото ${index + 2}`} fill sizes="120px" className="object-contain p-2" />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-2xl bg-white text-slate-400">Изображение недоступно</div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#84b827]">{brandName}</p>
              <h1 className="mt-2 text-2xl font-black leading-tight text-slate-950 md:text-3xl">{h1}</h1>
              <p className="mt-4 text-xl font-bold text-[#84b827]">{row.price}</p>
            </div>

            <p className="text-slate-600 leading-relaxed">{product.description}</p>

            {product.features && product.features.length > 0 ? (
              <div>
                <h2 className="mb-3 text-lg font-bold text-slate-950">Преимущества</h2>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex gap-3 text-slate-600">
                      <span className="mt-1.5 inline-flex h-2 w-2 shrink-0 rounded-full bg-[#84b827]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="#lead-form" className="btn-primary flex-1 text-center">
                Оставить заявку
              </Link>
              <Link href={`/catalog/${brandSlug}/`} className="btn-outline flex-1 text-center">
                Все модели {brandName}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <div className="mb-6 text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">Технический паспорт</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">Характеристики</h2>
          </div>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {Object.entries(variantSpecs).map(([key, value], index) => (
              <div key={key} className={`grid gap-2 px-5 py-4 md:grid-cols-[260px_1fr] ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}`}>
                <span className="font-semibold text-slate-950">{key}</span>
                <span className="text-slate-600">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div id="lead-form" className="mt-14 rounded-2xl bg-white p-6 shadow-soft md:p-10">
          <LeadForm productName={h1} theme="light" title="Оставить заявку" subtitle="Укажите телефон — перезвоним и уточним детали по объекту." />
        </div>

        {relatedProducts.length > 0 ? (
          <div className="mt-14">
            <h2 className="mb-6 text-xl font-bold text-slate-950">Другие серии {brandName}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="rounded-2xl bg-white p-5 shadow-soft">
                  {relatedProduct.images[0] ? (
                    <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-slate-50">
                      <Image src={relatedProduct.images[0]} alt={relatedProduct.name} fill className="object-contain p-3" sizes="200px" />
                    </div>
                  ) : null}
                  <h3 className="text-lg font-semibold text-slate-950">{relatedProduct.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{relatedProduct.description}</p>
                  <p className="mt-3 font-semibold text-[#84b827]">{relatedProduct.price}</p>
                  <Link href={`/catalog/${brandSlug}/`} className="btn-outline mt-4 block w-full text-center text-sm">
                    Смотреть в каталоге бренда
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
