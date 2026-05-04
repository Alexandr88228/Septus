import RevealWrapper from '../../components/RevealWrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Доставка и оплата септика',
  description: 'Доставка, оплата и бесплатный замер для монтажа септика под ключ в СПб и Ленинградской области.',
  alternates: { canonical: '/order' },
};

export default function OrderPage() {
  return (
    <main className="min-h-screen bg-surface py-20">
      <div className="container mx-auto px-4">
        <RevealWrapper>
          <div className="max-w-3xl mx-auto rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/40">
          <span className="inline-flex items-center justify-center rounded-full bg-surface px-4 py-1 text-sm font-semibold text-primary mb-4">
            Доставка и оплата
          </span>
          <h1 className="section-heading">Доставка, оплата и бесплатный замер</h1>
          <p className="mt-4 text-slate-600 leading-7">
            На этой странице вы можете быстро запросить звонок от нашего инженера. Мы поможем подобрать модель, рассчитать монтаж, согласовать доставку и ответим на все вопросы.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <a href="tel:+79944283029" className="rounded-3xl bg-secondary px-6 py-5 text-center font-semibold text-white transition hover:bg-accent">
              Позвонить инженеру
              <span className="block text-sm font-normal text-white/80 mt-2">8 994 428-30-29</span>
            </a>
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="font-semibold text-slate-900">Или оставьте заявку</p>
              <p className="mt-3 text-slate-600">Наш инженер свяжется с вами в течение 15 минут, согласует выезд на замер и подготовит коммерческое предложение.</p>
              <a href="/#lead" className="mt-6 inline-flex rounded-full border border-secondary bg-white px-6 py-3 text-secondary font-semibold transition hover:bg-surface">Перейти к заявке</a>
            </div>
          </div>
        </div>
      </RevealWrapper>
      </div>
    </main>
  );
}
