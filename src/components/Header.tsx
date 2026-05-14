'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { SVGProps } from 'react';
import { trackGoal } from '../lib/metrika';

const logoSrc = '/logo.webp';

const septicMenu = [
  { label: 'Евролос БИО', href: '/catalog/evrolos-bio' },
  { label: 'Евролос ПРО', href: '/catalog/evrolos-pro' },
  { label: 'Топас', href: '/catalog/topas' },
  { label: 'Топас С', href: '/catalog/topas-s' },
  { label: 'Юнилос Астра', href: '/catalog/yunilos-astra' },
  { label: 'Биодевайс ПРО', href: '/catalog/biodevays-pro' },
  { label: 'Биодевайс ГОСТ', href: '/catalog/biodevays-gost' },
  { label: 'Гринлос', href: '/catalog/grinlos' },
  { label: 'Волгарь', href: '/catalog/volgar' },
  { label: 'Коловеси', href: '/catalog/kolovesi' },
  { label: 'КИТ Био', href: '/catalog/kit-bio' },
  { label: 'Аэробокс', href: '/catalog/aeroboks' },
];

function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.9 4.6 18.7 19.7c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6.1 13.2 1.2 11.7c-1.1-.3-1.1-1.1.2-1.6L20.5 2.7c.9-.3 1.7.2 1.4 1.9Z" />
    </svg>
  );
}

function VkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.8 17.7c-6.2 0-9.8-4.3-10-11.4h3.1c.1 5.2 2.4 7.4 4.2 7.9V6.3h2.9v4.5c1.8-.2 3.6-2.2 4.2-4.5h2.9c-.4 2.8-2.3 4.8-3.6 5.6 1.3.7 3.4 2.4 4.2 5.8h-3.2c-.6-2.2-2.3-3.9-4.5-4.2v4.2h-.2Z" />
    </svg>
  );
}

function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2a9.8 9.8 0 0 0-8.5 14.8L2.3 22l5.3-1.4A9.8 9.8 0 1 0 12 2Zm0 17.9a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.1 8.1 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.3 0-.4.1-.6l.4-.5c.1-.2.1-.4 0-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.8-.9 2 0 1.2.9 2.3 1 2.5.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.2-.3-.2-.5-.3Z" />
    </svg>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { href: '/#home', label: 'Главная' },
    { href: '/catalog', label: 'Септики', mega: true },
    { href: '/order', label: 'Доставка и оплата' },
    { href: '/cases/', label: 'Услуги' },
    { href: '/promotions/', label: 'Акции' },
    { href: '/#contacts', label: 'Контакты' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur-2xl">
      <div className="border-b border-slate-100 bg-[#0b1734] text-white">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-3 px-4 py-2 text-xs font-semibold sm:justify-between">
          <span>Ежедневно с 09:00 до 21:00 · СПб и Ленинградская область</span>
          <div className="flex items-center gap-2">
            <a href="https://t.me/" target="_blank" rel="noreferrer" aria-label="Telegram" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#84b827]">
              <TelegramIcon className="h-4 w-4" />
            </a>
            <a href="https://vk.com/septusru" target="_blank" rel="noreferrer" aria-label="VK — Септус" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#84b827]">
              <VkIcon className="h-4 w-4" />
            </a>
            <a href="https://wa.me/79944283029" target="_blank" rel="noreferrer" aria-label="WhatsApp" onClick={() => trackGoal('click_whatsapp')} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#84b827]">
              <WhatsAppIcon className="h-4 w-4" />
            </a>
            <a href="https://max.ru/" target="_blank" rel="noreferrer" aria-label="Max" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[10px] font-black text-white transition hover:bg-[#84b827]">
              MAX
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-4 text-slate-950">
          <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-100 md:h-24 md:w-24">
            <Image src={logoSrc} alt="Логотип Септус" fill className="object-contain p-1.5" sizes="96px" priority />
          </span>
          <div className="min-w-0">
            <p className="text-2xl font-black uppercase leading-none tracking-tight text-[#0b1734] md:text-3xl">СЕПТУС</p>
            <p className="mt-1 max-w-[15rem] text-xs font-bold uppercase leading-snug tracking-[0.14em] text-slate-600 md:text-sm">Септики под ключ СПБ и ЛО</p>
          </div>
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          <a href="tel:+79944283029" onClick={() => trackGoal('click_phone')} className="inline-flex min-w-[12rem] items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#0b1734]">8 994 428-30-29</a>
          <Link href="/#lead" className="inline-flex items-center justify-center rounded-full bg-[#84b827] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-[#6d981f]">Заказать замер бесплатно</Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-2xl text-slate-700 lg:hidden"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu-drawer"
          aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {mobileMenuOpen ? '×' : '≡'}
        </button>
      </div>

      <nav className="hidden bg-[#10214a] lg:block" aria-label="Основное меню">
        <div className="container mx-auto flex items-center justify-center gap-1 px-4">
          {navItems.map((item) => (
            <div key={item.href} className="group relative">
              <Link href={item.href} className="block px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white transition hover:bg-white/10 hover:text-emerald-300">
                {item.label}
              </Link>
              {item.mega && (
                <div className="invisible absolute left-1/2 top-full w-[760px] -translate-x-1/2 rounded-b-3xl border border-white/10 bg-[#0b1734] p-6 opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#84b827]">Каталог септиков</p>
                      <p className="mt-1 text-xl font-black text-white">Популярные серии и производители</p>
                    </div>
                    <Link href="/catalog" className="rounded-full bg-[#84b827] px-4 py-2 text-sm font-extrabold text-white transition hover:bg-[#6d981f]">
                      Все септики
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {septicMenu.map((model) => (
                      <Link key={model.href} href={model.href} className="rounded-2xl bg-white/8 px-4 py-3 text-sm font-bold text-white transition hover:bg-[#84b827]">
                        {model.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true" id="mobile-menu-drawer">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
            aria-label="Закрыть меню"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 top-14 flex max-h-[calc(100dvh-3.5rem)] flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="text-lg font-black text-slate-900">Меню</p>
              <button type="button" className="rounded-lg px-3 py-2 text-2xl leading-none text-slate-600" onClick={() => setMobileMenuOpen(false)} aria-label="Закрыть">
                ×
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-bold text-slate-900">График работы</p>
                <p>ежедневно с 09:00 до 21:00</p>
              </div>
              <div className="mt-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl border border-slate-200 px-4 py-3 text-base font-bold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-600"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {septicMenu.map((model) => (
                  <Link
                    key={model.href}
                    href={model.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-600"
                  >
                    {model.label}
                  </Link>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <a href="https://t.me/" target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 px-3 py-3 text-center text-sm font-bold text-slate-700">
                  TG
                </a>
                <a href="https://vk.com/septusru" target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 px-3 py-3 text-center text-sm font-bold text-slate-700">
                  VK
                </a>
                <a href="https://wa.me/79944283029" target="_blank" rel="noreferrer" onClick={() => trackGoal('click_whatsapp')} className="rounded-xl border border-slate-200 px-3 py-3 text-center text-sm font-bold text-slate-700">
                  WA
                </a>
              </div>
              <a href="tel:+79944283029" onClick={() => trackGoal('click_phone')} className="mt-4 block rounded-xl bg-black px-4 py-3 text-center text-base font-bold text-white">
                8 994 428-30-29
              </a>
              <Link href="/#lead" onClick={() => setMobileMenuOpen(false)} className="mt-2 block rounded-xl bg-secondary px-4 py-3 text-center text-base font-extrabold text-white">
                Заказать замер бесплатно
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
