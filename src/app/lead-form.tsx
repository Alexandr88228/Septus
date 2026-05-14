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
  /** Заголовок над полями — по умолчанию «Оставить заявку», выровнен по центру */
  title?: string;
  subtitle?: string;
}

export default function LeadForm({ productName, theme = 'dark', title = 'Оставить заявку', subtitle }: LeadFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadFormData>();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const onSubmit = async (data: LeadFormData) => {
    setStatus('sending');
    setMessage('Отправляем заявку...');
    const endpoint = getDefaultLeadEndpoint();

    try {
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
      setMessage('Форма не смогла отправить заявку. Проверьте локальный серверный API /api/lead/.');
    }
  };

  const isDark = theme === 'dark';
  const sub =
    subtitle ??
    (isDark ? 'Нажимая кнопку, вы соглашаетесь с обработкой персональных данных' : 'Нажимая кнопку, вы соглашаетесь с обработкой данных');

  return (
    <section className="relative space-y-6 px-0">
      <div className="mb-8 text-center">
        <h3 className={`text-xl font-bold tracking-tight sm:text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
        <p className={`mt-2 max-w-md mx-auto text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>{sub}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-4">
        <div>
          <input
            {...register('name', { required: 'Введите имя' })}
            placeholder="Имя"
            className={`w-full rounded-2xl px-4 py-3.5 transition-all duration-300 focus:outline-none ${
              isDark
                ? 'border border-white/15 bg-[#222d49] text-white placeholder-slate-300 focus:border-emerald-400'
                : 'border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-emerald-500'
            }`}
          />
          {errors.name && <span className="mt-1 block text-sm text-red-400">{errors.name.message}</span>}
        </div>

        <div>
          <input
            {...register('phone', { required: 'Введите телефон' })}
            placeholder="Телефон"
            className={`w-full rounded-2xl px-4 py-3.5 transition-all duration-300 focus:outline-none ${
              isDark
                ? 'border border-white/15 bg-[#222d49] text-white placeholder-slate-300 focus:border-emerald-400'
                : 'border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-emerald-500'
            }`}
          />
          {errors.phone && <span className="mt-1 block text-sm text-red-400">{errors.phone.message}</span>}
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn-primary w-full justify-center px-6 py-4 text-base font-bold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'sending' ? 'Отправка...' : 'Получить расчет'}
        </button>

        {message && status !== 'success' && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm font-medium text-red-500">
            {message}
          </div>
        )}
      </form>

      {isPopupVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-2xl">
            <p className="mb-4 text-4xl">🎉</p>
            <h2 className="mb-3 text-2xl font-bold text-slate-950">Спасибо!</h2>
            <p className="mb-8 text-slate-600">Мы скоро свяжемся и подготовим расчёт для вашего участка.</p>
            <button
              type="button"
              onClick={() => setIsPopupVisible(false)}
              className="btn-primary inline-flex justify-center px-6 py-3 text-sm"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function getDefaultLeadEndpoint() {
  return '/api/lead/';
}
