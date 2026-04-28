import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import type { Metadata } from 'next';
import LeadForm from '../../lead-form';
import type { Product } from '../../../lib/products';
import { getCatalogProductBySlug, getCatalogProducts, getRelatedCatalogProducts } from '../../../lib/catalog-data';
import ProductViewTracker from '../../../components/ProductViewTracker';

export const revalidate = 60;
export const dynamicParams = true;

const getSeriesUserCounts = (product: Product) => {
  const name = product.name.toLowerCase();

  if (name.includes('удача')) return [3, 4];
  if (name.includes('евролос био')) return [3, 4, 5, 8];
  if (name.includes('юнилос астра') || name.includes('топас')) return [3, 4, 5, 6, 8, 10];
  return [3, 5, 6, 8, 10];
};

const getDischargeModels = (product: Product) => {
  const dischargeType = product.dischargeType.toLowerCase();
  const hasForced = dischargeType.includes('принуд');
  const hasGravity = dischargeType.includes('самотеч') || !hasForced;

  return [
    ...(hasGravity ? [{ label: 'самотечная', value: 'самотечный' }] : []),
    ...(hasForced ? [{ label: 'принудительная', value: 'принудительный' }] : []),
  ];
};

const getEstimatedModelPrice = (product: Product, users: number) => {
  if (!product.priceValue) return product.price;

  const ratio = users / Math.max(product.users, 1);
  const multiplier = Math.min(1.9, Math.max(0.75, ratio));
  const price = Math.round((product.priceValue * multiplier) / 100) * 100;
  return `от ${price.toLocaleString('ru-RU')} ₽`;
};

const getSeriesModels = (product: Product) => {
  const users = getSeriesUserCounts(product);
  const dischargeTypes = getDischargeModels(product);

  return users.flatMap((count) =>
    dischargeTypes.map((discharge) => ({
      name: `${product.name} ${count} ${discharge.label}`,
      users: count,
      discharge: discharge.value,
      price: getEstimatedModelPrice(product, count),
      capacity: `${count * 200} л/сутки`,
      burstDischarge: `${count * 50} л`,
    })),
  );
};

export async function generateStaticParams() {
  const products = await getCatalogProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);
  if (!product) {
    return {
      title: 'Товар не найден',
      description: 'Запрошенная модель не найдена в каталоге.',
    };
  }
  return {
    title: `${product.name} — купить и установить`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Септус`,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
    alternates: { canonical: `/catalog/${product.slug}` },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedCatalogProducts(slug);
  const seriesModels = getSeriesModels(product);
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
      price: product.price.replace(/[^\d]/g, '') || '0',
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'}/catalog/${product.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <ProductViewTracker productName={product.name} />
      <Script id="product-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm text-slate-600">
          <Link href="/" className="hover:text-secondary">Главная</Link>
          <span className="mx-2">/</span>
          <Link href="/catalog" className="hover:text-secondary">Каталог</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-500">Септики</span>
          <span className="mx-2">/</span>
          <span className="text-slate-900">{product.name}</span>
        </nav>
      </div>

      {/* Product Details */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Gallery */}
          <div className="space-y-4">
            {product.images && product.images.length > 0 ? (
              <div className="grid gap-4">
                <div className="aspect-square overflow-hidden rounded-2xl bg-white">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="h-full w-full object-contain p-4"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-4">
                    {product.images.slice(1).map((image, index) => (
                      <div key={index} className="aspect-square overflow-hidden rounded-lg bg-white">
                        <Image
                          src={image}
                          alt={`${product.name} ${index + 2}`}
                          width={200}
                          height={200}
                          className="h-full w-full object-contain p-2"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square overflow-hidden rounded-2xl bg-white flex items-center justify-center">
                <div className="text-slate-400">Изображение недоступно</div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-secondary">Подкатегория септиков</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-950">{product.name}</h1>
              <p className="mt-4 text-xl font-semibold text-secondary">{product.price}</p>
            </div>

            <p className="text-slate-600">{product.description}</p>

            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-950 mb-4">Особенности</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="#lead-form" className="btn-primary flex-1 text-center">Оставить заявку</Link>
              <Link href="/catalog" className="btn-outline flex-1 text-center">Вернуться в каталог</Link>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="mt-16">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">Технический паспорт</p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">Характеристики {product.name}</h2>
              </div>
              <p className="max-w-xl text-sm text-slate-500">Данные для подбора модели, расчета монтажа и сравнения с другими станциями.</p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {Object.entries(product.specs).map(([key, value], index) => (
                <div key={key} className={`grid gap-3 px-5 py-4 md:grid-cols-[280px_1fr] ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}`}>
                  <span className="font-semibold text-slate-950">{key}</span>
                  <span className="text-slate-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#84b827]">Листинг моделей</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Модели {product.name}</h2>
            </div>
            <p className="max-w-xl text-sm text-slate-500">
              Категория: септики. Подкатегория 1-го порядка: {product.name}. Ниже перечислены модели 2-го порядка с самотечным и принудительным исполнением.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {seriesModels.map((model) => (
              <article key={model.name} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <p className="text-lg font-black text-slate-950">{model.name}</p>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p><span className="font-semibold text-slate-900">Пользователи:</span> до {model.users} чел</p>
                  <p><span className="font-semibold text-slate-900">Производительность:</span> {model.capacity}</p>
                  <p><span className="font-semibold text-slate-900">Залповый сброс:</span> {model.burstDischarge}</p>
                  <p><span className="font-semibold text-slate-900">Сброс:</span> {model.discharge}</p>
                  <p><span className="font-semibold text-slate-900">Оборудование:</span> {model.price}</p>
                </div>
                <Link href="#lead-form" className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-[#84b827] px-4 py-3 text-sm font-black text-white transition hover:bg-[#6d981f]">
                  Получить расчет
                </Link>
              </article>
            ))}
          </div>
        </div>

        {/* Lead Form */}
        <div id="lead-form" className="mt-16 rounded-2xl bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-bold text-slate-950 mb-6">Оставить заявку</h2>
          <LeadForm productName={product.name} theme="light" />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-950 mb-8">Похожие товары</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="rounded-2xl bg-white p-6 shadow-soft">
                  {relatedProduct.images && relatedProduct.images.length > 0 && (
                    <div className="aspect-square overflow-hidden rounded-lg bg-slate-50 mb-4">
                      <Image
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        width={300}
                        height={300}
                        className="h-full w-full object-contain p-3"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-slate-950 mb-2">{relatedProduct.name}</h3>
                  <p className="text-slate-600 text-sm mb-4">{relatedProduct.description}</p>
                  <p className="text-secondary font-semibold mb-4">{relatedProduct.price}</p>
                  <Link href={`/catalog/${relatedProduct.slug}`} className="btn-outline w-full text-center">
                    Подробнее
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}