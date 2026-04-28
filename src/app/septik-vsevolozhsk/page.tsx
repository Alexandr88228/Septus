import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Септик во Всеволожске',
  description: 'Установка септика во Всеволожске под ключ за 1 день. Бесплатный выезд инженера и расчет стоимости.',
};

export default function SeptikVsevolozhskPage() {
  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-4xl font-black text-slate-900">Септики под ключ во Всеволожске</h1>
        <p className="mt-4 text-lg text-slate-600">Подбираем модель под тип грунта и нагрузку дома. Монтаж, запуск и гарантия до 10 лет.</p>
        <ul className="mt-8 space-y-2 text-slate-700">
          <li>Бесплатный выезд инженера сегодня</li>
          <li>Монтаж за 1 день по договору</li>
          <li>Без скрытых доплат</li>
        </ul>
        <Link href="/lead" className="btn-primary mt-8">Получить расчет за 5 минут</Link>
      </div>
    </main>
  );
}
