import Link from 'next/link';
import RevealWrapper from '../../components/RevealWrapper';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.septus.ru';

export const metadata: Metadata = {
  title: 'Доставка и оплата септика',
  description:
    'Бесплатный замер инженером, доставка в подарок при заказе под ключ, оплата по счёту для юрлиц. Септики Септус — СПб и Ленинградская область.',
  alternates: { canonical: '/order/' },
  openGraph: {
    title: 'Доставка и оплата | Септус',
    description: 'Условия доставки, оплаты и бесплатного замера для монтажа септика под ключ.',
    url: `${siteUrl}/order/`,
  },
};

function IconTruck() {
  return (
    <svg className="h-8 w-8 text-[#84b827]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10h2m8 0h2m-8 0H9" />
    </svg>
  );
}

function IconCard() {
  return (
    <svg className="h-8 w-8 text-[#84b827]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

function IconRuler() {
  return (
    <svg className="h-8 w-8 text-[#84b827]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
}

export default function OrderPage() {
  return (
    <main className="min-h-screen bg-surface py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <RevealWrapper>
          <nav className="mb-8 text-sm text-slate-600" aria-label="Хлебные крошки">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href="/" className="hover:text-[#84b827]">
                  Главная
                </Link>
              </li>
              <span className="text-slate-400">/</span>
              <li className="font-semibold text-slate-900">Доставка и оплата</li>
            </ol>
          </nav>

          <div className="mb-10 text-center md:text-left">
            <span className="inline-flex rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#84b827]">Условия</span>
            <h1 className="section-heading mt-4">Доставка, оплата и бесплатный замер</h1>
            <p className="mt-4 max-w-2xl text-slate-600 md:text-lg">
              Прозрачные условия: замер инженером, расчёт сметы, доставка и варианты оплаты для частных и корпоративных клиентов.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b1734]/5">
                <IconRuler />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Бесплатный замер</h2>
              <ul className="mt-4 flex-1 list-inside list-disc space-y-3 text-sm leading-relaxed text-slate-600">
                <li>К вам выезжает инженер-замерщик в заранее оговорённое время и подбирает техническое решение.</li>
                <li>В течение 3 дней вы получаете готовый сметный расчёт.</li>
                <li>Обсуждаете с менеджером решение и выбираете день монтажа.</li>
                <li>Монтаж за 1 день — готовое к эксплуатации оборудование.</li>
              </ul>
            </article>

            <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b1734]/5">
                <IconTruck />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Доставка</h2>
              <ul className="mt-4 flex-1 list-inside list-disc space-y-3 text-sm leading-relaxed text-slate-600">
                <li>Доставка входит в стоимость при заказе септика «под ключ».</li>
                <li>При покупке септика без монтажа доставка до 80 км — в подарок.</li>
                <li>Возможен самовывоз (обсуждается с менеджером).</li>
              </ul>
            </article>

            <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b1734]/5">
                <IconCard />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Оплата</h2>
              <ul className="mt-4 flex-1 list-inside list-disc space-y-3 text-sm leading-relaxed text-slate-600">
                <li>Для физических лиц — удобные способы оплаты по договору (уточняйте у менеджера).</li>
                <li>
                  <strong className="text-slate-800">Юридическим лицам</strong> — оплата по счёту.
                </li>
              </ul>
            </article>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <a
              href="tel:+79944283029"
              className="flex flex-col items-center justify-center rounded-3xl bg-[#84b827] px-6 py-8 text-center font-semibold text-white shadow-lg transition hover:bg-[#6d981f] md:items-start md:text-left"
            >
              <span className="text-lg">Позвонить инженеру</span>
              <span className="mt-2 text-2xl font-black">8 994 428-30-29</span>
            </a>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <p className="font-bold text-slate-900">Оставить заявку</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">Свяжемся в удобное время, согласуем выезд и подготовим коммерческое предложение.</p>
              <Link href="/#lead" className="btn-primary mt-6 inline-flex w-full justify-center">
                Перейти к форме
              </Link>
            </div>
          </div>
        </RevealWrapper>
      </div>
    </main>
  );
}
