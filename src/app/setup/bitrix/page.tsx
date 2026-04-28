import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Подключение Bitrix24',
  description: 'Пошаговая инструкция по подключению Bitrix24 к сайту: webhook, .env.local и проверка лидов.',
};

const steps = [
  { title: '1. Регистрация', text: 'Создайте портал в Bitrix24 и откройте раздел CRM.' },
  { title: '2. Настройка CRM', text: 'Проверьте, что в CRM доступны Лиды и воронка продаж.' },
  { title: '3. Создание Webhook', text: 'Входящий webhook с правами CRM -> скопируйте полный URL.' },
  { title: '4. Вставка в .env.local', text: 'Укажите BITRIX_WEBHOOK_URL, BITRIX_ASSIGNED_BY_ID и BITRIX_SOURCE.' },
  { title: '5. Проверка', text: 'Отправьте тестовую форму на сайте и проверьте появление лида в CRM.' },
];

export default function BitrixSetupPage() {
  return (
    <main className="min-h-screen bg-white py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-4xl font-black text-slate-900">Bitrix24: подключение за 5 шагов</h1>
        <p className="mt-4 text-slate-600">Инструкция для менеджера и владельца бизнеса без технического опыта.</p>
        <div className="mt-10 grid gap-4">
          {steps.map((step) => (
            <section key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-bold text-slate-900">{step.title}</h2>
              <p className="mt-2 text-slate-600">{step.text}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
