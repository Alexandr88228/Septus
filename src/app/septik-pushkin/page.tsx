import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Септик в Пушкине',
  description: 'Монтаж септика в Пушкине под ключ. Бесплатный выезд инженера, договор и гарантия до 10 лет.',
};

export default function SeptikPushkinPage() {
  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-4xl font-black text-slate-900">Септики под ключ в Пушкине</h1>
        <p className="mt-4 text-lg text-slate-600">Подберем систему под ваш участок, выполним монтаж и запустим оборудование с гарантией.</p>
        <Link href="/lead" className="btn-primary mt-8">Получить расчет за 5 минут</Link>
      </div>
    </main>
  );
}
