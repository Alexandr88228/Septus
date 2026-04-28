
"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { trackGoal } from '../lib/metrika';

interface LeadFormData {
  name: string;
  phone: string;
}

interface LeadFormProps {
  productName?: string;
  theme?: 'dark' | 'light';
}

export default function LeadForm({ productName, theme = 'dark' }: LeadFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadFormData>();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const onSubmit = async (data: LeadFormData) => {
    setStatus('sending');
    setMessage('Отправляем заявку...');

    try {
      const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT || '/api/lead';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          productName: productName || 'Общий расчет',
          comment: '',
        }),
      });

      const result = await response
        .json()
        .catch(() => ({ success: response.ok }));

      if (response.ok && (result.success || result.accepted || !('success' in result))) {
        setStatus('success');
        setMessage(result.crmConfigured === false ? 'Заявка принята. Подключите CRM, чтобы заявки сразу попадали в Bitrix24.' : 'Спасибо! Мы скоро свяжемся.');
        trackGoal('submit_lead', { productName: productName || 'Общий расчет' });
        reset();
        setIsPopupVisible(true);
      } else {
        setStatus('error');
        setMessage(result.error || 'Ошибка отправки. Повторите попытку позже.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Форма не смогла отправить заявку. Для статического хостинга укажите NEXT_PUBLIC_LEAD_ENDPOINT или подключите серверный API.');
    }
  };

  const isDark = theme === 'dark';

  return (
    <section className="relative space-y-6">
      <div className="text-center mb-8">
        <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Получите бесплатную консультацию</h3>
        <p className={isDark ? 'text-slate-300' : 'text-slate-500'}>Нажимая кнопку, вы соглашаетесь с обработкой данных</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <input
            {...register('name', { required: 'Введите имя' })}
            placeholder="Имя"
            className={`w-full rounded-2xl px-4 py-4 transition-all duration-300 focus:outline-none ${
              isDark
                ? 'bg-[#222d49] border border-white/15 text-white placeholder-slate-300 focus:border-emerald-400 focus:bg-[#222d49]'
                : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
            }`}
          />
          {errors.name && <span className="text-red-400 text-sm mt-1 block">{errors.name.message}</span>}
        </div>

        <div>
          <input
            {...register('phone', { required: 'Введите телефон' })}
            placeholder="Телефон"
            className={`w-full rounded-2xl px-4 py-4 transition-all duration-300 focus:outline-none ${
              isDark
                ? 'bg-[#222d49] border border-white/15 text-white placeholder-slate-300 focus:border-emerald-400 focus:bg-[#222d49]'
                : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
            }`}
          />
          {errors.phone && <span className="text-red-400 text-sm mt-1 block">{errors.phone.message}</span>}
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full rounded-2xl bg-[#84b827] px-6 py-5 text-lg font-black text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#6d981f] disabled:cursor-not-allowed disabled:bg-slate-500 disabled:opacity-50"
        >
          {status === 'sending' ? 'Отправка...' : 'Получить расчет'}
        </button>

        {message && status !== 'success' && (
          <div className="text-center p-4 rounded-2xl text-sm font-medium bg-red-500/10 text-red-500 border border-red-500/20">
            {message}
          </div>
        )}
      </form>

      {isPopupVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl text-center">
            <p className="text-4xl mb-4">🎉</p>
            <h2 className="text-2xl font-bold text-slate-950 mb-3">Спасибо!</h2>
            <p className="text-slate-600 mb-8">Мы скоро свяжемся и подготовим расчёт для вашего участка.</p>
            <button
              onClick={() => setIsPopupVisible(false)}
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
