import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getPromotionCards } from '../../lib/promotions-data';

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.septus.ru';

export const metadata: Metadata = {
  title: 'Акции и спецпредложения',
  description: 'Скидки для пенсионеров, новых клиентов, по рекомендации и для застройщиков. Септики под ключ в СПб и ЛО.',
  alternates: { canonical: '/promotions/' },
  openGraph: {
    title: 'Акции | Септус',
    description: 'Специальные предложения на монтаж и оборудование.',
    url: `${siteUrl}/promotions/`,
    type: 'website',
  },
  twitter: { card: 'summary', title: 'Акции | Септус', description: 'Специальные предложения на монтаж и оборудование.' },
};

function formatPeriod(validFrom?: string, validUntil?: string) {
  if (!validFrom && !validUntil) return null;
  const from = validFrom ? new Date(validFrom).toLocaleDateString('ru-RU') : '';
  const until = validUntil ? new Date(validUntil).toLocaleDateString('ru-RU') : '';
  if (from && until) return `${from} — ${until}`;
  if (until) return `до ${until}`;
  if (from) return `с ${from}`;
  return null;
}

export default async function PromotionsPage() {
  const cards = await getPromotionCards();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <nav className="mb-8 text-sm text-slate-600" aria-label="Хлебные крошки">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-[#84b827]">
                Главная
              </Link>
            </li>
            <span className="text-slate-400">/</span>
            <li className="font-semibold text-slate-900">Акции</li>
          </ol>
        </nav>

        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#84b827]">Спецпредложения</p>
          <h1 className="section-heading mt-3">Акции</h1>
          <p className="mt-4 text-lg text-slate-600">Условия уточняйте у менеджера — подберём выгодный вариант под ваш объект.</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
          {cards.map((card) => {
            const period = formatPeriod(card.validFrom, card.validUntil);
            return (
              <article
                key={card.id}
                className="relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-md transition hover:-translate-y-1 hover:border-[#84b827]/40 hover:shadow-xl"
              >
                {card.badge ? (
                  <span className="absolute right-6 top-6 z-10 rounded-full bg-[#0b1734] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#84b827]">{card.badge}</span>
                ) : null}
                {card.imageUrl ? (
                  <div className="relative -mx-8 -mt-8 mb-6 aspect-[21/9] w-[calc(100%+4rem)] max-w-none bg-slate-100">
                    <Image src={card.imageUrl} alt={card.imageAlt || card.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                  </div>
                ) : null}
                <h2 className="text-xl font-black text-slate-950">{card.title}</h2>
                {period ? <p className="mt-2 text-xs font-semibold text-slate-500">{period}</p> : null}
                <p className="mt-4 flex-1 leading-relaxed text-slate-600">{card.description}</p>
                <Link href={card.buttonHref || '/#lead'} className="btn-primary mt-8 inline-flex w-full justify-center">
                  {card.buttonText || 'Получить условия'}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
