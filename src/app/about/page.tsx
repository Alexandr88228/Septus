import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'О компании',
  description: 'Септус — команда по подбору, доставке и монтажу автономных септиков под ключ в Санкт-Петербурге и Ленинградской области.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-secondary px-4 py-1 text-sm font-semibold text-white">О нас</span>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">Септус — проверенная автономная канализация</h1>
              <p className="mt-4 text-slate-600">Мы создаём и монтируем септики для дач, частных домов и небольших коммерческих объектов с вниманием к качеству и срокам.</p>
            </div>
            <Link href="/" className="inline-flex rounded-full border border-secondary bg-white px-5 py-3 text-sm font-semibold text-secondary transition hover:bg-slate-50">На главную</Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-300 bg-slate-100 p-6">
                <h2 className="text-xl font-semibold text-slate-900">Наша миссия</h2>
                <p className="mt-4 text-slate-600">Предоставлять удобные и экологичные системы очистки для частных домов, чтобы жить без запаха и с минимальными затратами на обслуживание.</p>
              </div>
              <div className="rounded-3xl border border-slate-300 bg-slate-100 p-6">
                <h2 className="text-xl font-semibold text-slate-900">Почему выбирают нас</h2>
                <ul className="mt-4 space-y-3 text-slate-600">
                  <li>Опыт с 2016 года и сотни установок.</li>
                  <li>Работаем под ключ: подбор, доставка, монтаж и сервис.</li>
                  <li>Гарантия до 10 лет и консультации на каждом этапе.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-300 bg-slate-100 p-6">
                <h2 className="text-xl font-semibold text-slate-900">Наши ценности</h2>
                <p className="mt-4 text-slate-600">Прозрачность, честность и забота о клиенте. Мы строим решения, которые легко эксплуатировать и обслуживать.</p>
              </div>
              <div className="rounded-3xl border border-slate-300 bg-slate-100 p-6">
                <h2 className="text-xl font-semibold text-slate-900">Команда</h2>
                <p className="mt-4 text-slate-600">Собрали профессионалов по монтажу и инженерии, которые работают в зоне ответственности до сдачи объекта.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
