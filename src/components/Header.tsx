'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FaTelegramPlane, FaVk, FaWhatsapp } from 'react-icons/fa';
import { trackGoal } from '../lib/metrika';

const logoSrc = '/for-site/%D0%9B%D0%BE%D0%B3%D0%BE%D1%82%D0%B8%D0%BF%D1%8B/NanoBanana_zameni-slovo-septus-na-septus_png.png';

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

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/#home', label: 'Главная' },
    { href: '/catalog', label: 'Септики', mega: true },
    { href: '/order', label: 'Доставка и оплата' },
    { href: '/#services', label: 'Услуги' },
    { href: '/#lead', label: 'Акции' },
    { href: '/#contacts', label: 'Контакты' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur-2xl">
      <div className="border-b border-slate-100 bg-[#0b1734] text-white">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-3 px-4 py-2 text-xs font-semibold sm:justify-between">
          <span>Ежедневно с 09:00 до 21:00 · СПб и Ленинградская область</span>
          <div className="flex items-center gap-2">
            <a href="https://t.me/" target="_blank" rel="noreferrer" aria-label="Telegram" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#84b827]">
              <FaTelegramPlane className="h-4 w-4" />
            </a>
            <a href="https://vk.com/" target="_blank" rel="noreferrer" aria-label="VK" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#84b827]">
              <FaVk className="h-4 w-4" />
            </a>
            <a href="https://wa.me/78005553535" target="_blank" rel="noreferrer" aria-label="WhatsApp" onClick={() => trackGoal('click_whatsapp')} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#84b827]">
              <FaWhatsapp className="h-4 w-4" />
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
            <Image src={logoSrc} alt="Логотип Септус" fill className="scale-[1.45] object-cover object-top" priority sizes="96px" />
          </span>
          <div className="min-w-0">
            <p className="text-2xl font-black uppercase leading-none tracking-tight text-[#0b1734] md:text-3xl">СЕПТУС</p>
            <p className="mt-1 max-w-[15rem] text-xs font-bold uppercase leading-snug tracking-[0.14em] text-slate-600 md:text-sm">Септики под ключ СПБ и ЛО</p>
          </div>
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          <a href="tel:88005553535" onClick={() => trackGoal('click_phone')} className="inline-flex min-w-[12rem] items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#0b1734]">8 800 555-35-35</a>
          <Link href="/#lead" className="inline-flex items-center justify-center rounded-full bg-[#84b827] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-[#6d981f]">Заказать замер бесплатно</Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-2xl text-slate-700 lg:hidden"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Открыть меню"
        >
          {mobileMenuOpen ? '×' : '≡'}
        </button>
      </div>

      <nav className="hidden bg-[#10214a] lg:block">
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

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-bold text-slate-900">График работы</p>
              <p>ежедневно с 09:00 до 21:00</p>
            </div>
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
            <div className="grid grid-cols-2 gap-2">
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
            <div className="grid grid-cols-3 gap-2">
              <a href="https://t.me/" target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 px-3 py-3 text-center text-sm font-bold text-slate-700">TG</a>
              <a href="https://vk.com/" target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 px-3 py-3 text-center text-sm font-bold text-slate-700">VK</a>
              <a href="https://wa.me/78005553535" target="_blank" rel="noreferrer" onClick={() => trackGoal('click_whatsapp')} className="rounded-xl border border-slate-200 px-3 py-3 text-center text-sm font-bold text-slate-700">WA</a>
            </div>
            <a href="tel:88005553535" onClick={() => trackGoal('click_phone')} className="block rounded-xl bg-black px-4 py-3 text-center text-base font-bold text-white">8 800 555-35-35</a>
            <Link href="/#lead" onClick={() => setMobileMenuOpen(false)} className="block rounded-xl bg-secondary px-4 py-3 text-center text-base font-extrabold text-white">Заказать замер бесплатно</Link>
          </div>
        </div>
      )}
    </header>
  );
}
