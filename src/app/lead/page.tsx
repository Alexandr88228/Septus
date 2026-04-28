import Link from 'next/link';
import type { Metadata } from 'next';
import LeadForm from '../lead-form';

export const metadata: Metadata = {
  title: 'Бесплатная консультация по септику',
  description: 'Оставьте заявку на бесплатный замер, подбор септика и расчет монтажа под ключ в СПб и Ленинградской области.',
  alternates: { canonical: '/lead' },
};

export default function LeadPage() {
  return (
    <main className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-secondary px-4 py-1 text-sm font-semibold text-white">Заявка</span>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">Получите бесплатную консультацию и замер</h1>
              <p className="mt-4 text-slate-600">Заполните форму, и наш менеджер свяжется с вами в кратчайшие сроки. Заявка передается напрямую в отдел продаж и монтажа.</p>
            </div>
            <Link href="/" className="inline-flex rounded-full border border-secondary bg-white px-5 py-3 text-sm font-semibold text-secondary transition hover:bg-slate-50">На главную</Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-300 bg-slate-100 p-6">
                <h2 className="text-xl font-semibold text-slate-900">Что происходит после отправки</h2>
                <ul className="mt-4 space-y-3 text-slate-600">
                  <li>1. Менеджер получает заявку и связывается с вами по телефону.</li>
                  <li>2. Согласовывается удобное время выезда замерщика.</li>
                  <li>3. После замера готовится коммерческое предложение.</li>
                  <li>4. При необходимости оформляется договор и планируется монтаж.</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-slate-300 bg-slate-100 p-6">
                <h2 className="text-xl font-semibold text-slate-900">Укажите, пожалуйста</h2>
                <ul className="mt-4 space-y-3 text-slate-600">
                  <li>Имя, телефон и удобное время для связи.</li>
                  <li>Причину обращения или тип объекта.</li>
                  <li>Адрес, если хотите назначить предварительный замер.</li>
                </ul>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
              <LeadForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
