import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Септик в Гатчине',
  description: 'Профессиональная установка септика в Гатчине. Подбор под грунт, монтаж и запуск под ключ.',
};

export default function SeptikGatchinaPage() {
  return (
    <main className="min-h-screen py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-4xl font-black text-slate-900">Септики под ключ в Гатчине</h1>
        <p className="mt-4 text-lg text-slate-600">Решения для постоянного проживания и дачи: расчет, доставка, монтаж и запуск в один день.</p>
        <Link href="/lead" className="btn-primary mt-8">Получить расчет за 5 минут</Link>
      </div>
    </main>
  );
}
