import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAllCases } from '../../lib/cases';

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.septus.ru';

export const metadata: Metadata = {
  title: 'Выполненные объекты',
  description: 'Реальные монтажи септиков в СПб и Ленинградской области: фото, описание работ и используемое оборудование.',
  alternates: { canonical: '/cases/' },
  openGraph: {
    title: 'Наши работы | Септус',
    description: 'Кейсы монтажа септиков под ключ.',
    url: `${siteUrl}/cases/`,
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Наши работы | Септус', description: 'Кейсы монтажа септиков под ключ.' },
};

export default async function CasesIndexPage() {
  const cases = await getAllCases();

  return (
    <main className="min-h-screen bg-slate-50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <nav className="mb-8 text-sm text-slate-600" aria-label="Хлебные крошки">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-[#84b827]">
                Главная
              </Link>
            </li>
            <span className="text-slate-400">/</span>
            <li className="font-semibold text-slate-900">Наши работы</li>
          </ol>
        </nav>

        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#84b827]">Услуги</p>
          <h1 className="section-heading mt-3">Выполненные монтажи</h1>
          <p className="mt-4 text-lg text-slate-600">Реальные объекты: состав работ, фото и характеристики оборудования. Нажмите карточку, чтобы открыть кейс.</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-8 sm:grid-cols-2">
          {cases.map((item) => (
            <Link
              key={item.slug}
              href={`/cases/${item.slug}/`}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] w-full shrink-0 bg-slate-100">
                {item.images[0] ? (
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-contain p-4 transition duration-300 group-hover:scale-[1.02]"
                  />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#84b827]">{item.location}</p>
                <h2 className="mt-2 text-xl font-black text-slate-900">{item.title}</h2>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{item.summary}</p>
                <span className="mt-4 inline-flex text-sm font-bold text-[#10214a] group-hover:text-[#84b827]">Подробнее →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
