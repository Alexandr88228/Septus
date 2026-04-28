import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Септик в Кудрово',
  description: 'Установка септика в Кудрово с гарантией и монтажом под ключ. Точный расчет стоимости за 5 минут.',
};

export default function SeptikKudrovoPage() {
  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-4xl font-black text-slate-900">Септики под ключ в Кудрово</h1>
        <p className="mt-4 text-lg text-slate-600">Надежные септики для частных домов и дач. Работа по договору, без скрытых доплат.</p>
        <Link href="/lead" className="btn-primary mt-8">Получить расчет за 5 минут</Link>
      </div>
    </main>
  );
}
