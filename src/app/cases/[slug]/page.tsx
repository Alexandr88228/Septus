import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import LeadForm from '../../lead-form';
import { getAllCases, getCaseBySlug } from '../../../lib/cases';
import { getSiteUrl, toAbsoluteUrl } from '../../../lib/absolute-site-url';

export const dynamicParams = false;

export async function generateStaticParams() {
  const list = await getAllCases();
  return list.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCaseBySlug(slug);
  if (!c) return { title: 'Кейс не найден' };
  const title = c.seoTitle || `${c.title} — монтаж септика`;
  const description = c.seoDescription || c.summary;
  const siteUrl = getSiteUrl();
  const raw = c.images[0];
  const ogImage = raw ? toAbsoluteUrl(raw) : toAbsoluteUrl('/logo.webp');
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${siteUrl}/cases/${slug}/`,
      images: [{ url: ogImage }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
    alternates: { canonical: `/cases/${slug}/` },
  };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getCaseBySlug(slug);
  if (!c) notFound();

  return (
    <main className="min-h-screen bg-slate-50 py-10 md:py-14">
      <div className="container mx-auto max-w-4xl px-4">
        <nav className="mb-8 text-sm text-slate-600" aria-label="Хлебные крошки">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-[#84b827]">
                Главная
              </Link>
            </li>
            <span className="text-slate-400">/</span>
            <li>
              <Link href="/cases/" className="hover:text-[#84b827]">
                Наши работы
              </Link>
            </li>
            <span className="text-slate-400">/</span>
            <li className="font-semibold text-slate-900">{c.title}</li>
          </ol>
        </nav>

        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative aspect-[16/10] bg-slate-100">
            {c.images[0] ? (
              <Image src={c.images[0]} alt={c.title} fill priority className="object-contain p-6 md:p-10" sizes="100vw" />
            ) : null}
          </div>
          <div className="p-6 md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#84b827]">{c.location}</p>
            <h1 className="mt-3 text-2xl font-black text-slate-950 md:text-3xl">{c.title}</h1>
            <p className="mt-4 text-lg text-slate-600">{c.summary}</p>

            {c.works.length > 0 ? (
              <>
                <h2 className="mt-10 text-lg font-black text-slate-950">Выполненные работы</h2>
                <ul className="mt-4 list-inside list-disc space-y-2 text-slate-700">
                  {c.works.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </>
            ) : null}

            {c.equipment.length > 0 ? (
              <>
                <h2 className="mt-10 text-lg font-black text-slate-950">Оборудование</h2>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  {c.equipment.map((row) => (
                    <div key={row.label} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">{row.label}</dt>
                      <dd className="mt-1 font-semibold text-slate-900">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : null}

            {c.images.length > 1 ? (
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {c.images.slice(1).map((src, i) => (
                  <div key={src} className="relative aspect-video overflow-hidden rounded-2xl bg-slate-100">
                    <Image src={src} alt={`${c.title} — фото ${i + 2}`} fill className="object-contain p-3" sizes="400px" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </article>

        <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <LeadForm
            productName={`Кейс: ${c.title}`}
            theme="light"
            title="Оставить заявку"
            subtitle="Расскажем стоимость под ваш участок."
          />
        </div>

        <div className="mt-8 text-center">
          <Link href="/cases/" className="text-sm font-bold text-[#84b827] hover:underline">
            ← Все объекты
          </Link>
        </div>
      </div>
    </main>
  );
}
