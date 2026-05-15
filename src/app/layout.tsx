import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Manrope } from 'next/font/google';
import Header from '../components/Header';
import YandexMetrika from '../components/YandexMetrika';
import MobileStickyCta from '../components/MobileStickyCta';
import { getSiteUrl, toAbsoluteUrl } from '../lib/absolute-site-url';

const siteUrl = getSiteUrl();
const logoUrl = '/logo.webp';
const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(`${getSiteUrl()}/`),
  title: {
    default: 'Септус — септики под ключ в Санкт-Петербурге и ЛО',
    template: '%s | Септус',
  },
  description: 'Монтаж септиков под ключ за 1 день. Бесплатный выезд инженера по СПб и ЛО, гарантия до 10 лет, прозрачная смета без скрытых доплат.',
  icons: {
    icon: [{ url: logoUrl, type: 'image/webp' }],
    shortcut: logoUrl,
    apple: logoUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: siteUrl,
    title: 'Септус — септики под ключ в Санкт-Петербурге и ЛО',
    description: 'Подбор, доставка и монтаж септиков с гарантией. Бесплатный выезд инженера и расчет стоимости за 5 минут.',
    siteName: 'Септус',
    images: [{ url: toAbsoluteUrl(logoUrl), width: 512, height: 512, alt: 'Септус — логотип' }],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
};

export const preferredRegion = 'fra1';

export default function RootLayout({ children }: { children: ReactNode }) {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Септус',
    image: toAbsoluteUrl(logoUrl),
    url: siteUrl,
    telephone: '+7-994-428-30-29',
    email: 'septus-spb@yandex.ru',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Санкт-Петербург',
      addressRegion: 'Ленинградская область',
      addressCountry: 'RU',
    },
    areaServed: ['Санкт-Петербург', 'Ленинградская область'],
    priceRange: '₽₽₽',
    description: 'Подбор, доставка и монтаж автономных септиков под ключ для частных домов и дач.',
  };

  return (
    <html lang="ru">
      <head>
        <link rel="apple-touch-icon" href={logoUrl} />
        <Script id="local-business-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      </head>
      <body className={`${manrope.variable} min-h-screen font-sans antialiased flex flex-col overflow-x-hidden`}>
        <YandexMetrika />
        <Header />

        <main className="flex-1 z-10">
          <div className="container mx-auto px-4 py-10">{children}</div>
        </main>

        <footer id="contacts" className="relative bg-[#0b1734] text-slate-100 py-20 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-green-500/5"></div>
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

          <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[1.2fr_0.8fr] relative z-10">
            <div className="space-y-8">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-[#84b827] font-semibold">Контакты</p>
                <h2 className="text-5xl font-black tracking-tight text-white mt-4 leading-tight">Готовы обсудить проект?<br />
                  <span className="text-[#84b827]">Мы на связи</span>
                </h2>
                <p className="max-w-2xl text-slate-400 mt-6 text-lg leading-relaxed">Оставьте заявку или позвоните напрямую. Бесплатный выезд инженера по СПб и Ленинградской области, подбор септика и монтаж под ключ.</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="glass rounded-3xl p-8 hover-lift">
                  <p className="text-sm uppercase tracking-[0.3em] text-[#84b827] font-semibold">Телефон</p>
                  <a href="tel:+79944283029" className="mt-4 block text-2xl font-bold text-white hover:text-emerald-400 transition-colors duration-300">8 994 428-30-29</a>
                  <p className="mt-2 text-slate-400 text-sm">Звоните ежедневно с 09:00 до 21:00</p>
                </div>
                <div className="glass rounded-3xl p-8 hover-lift">
                  <p className="text-sm uppercase tracking-[0.3em] text-[#84b827] font-semibold">Email</p>
                  <a href="mailto:septus-spb@yandex.ru" className="mt-4 block text-2xl font-bold text-white hover:text-emerald-400 transition-colors duration-300">septus-spb@yandex.ru</a>
                  <p className="mt-2 text-slate-400 text-sm">Ответ в течение часа</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="glass rounded-3xl p-8 hover-lift">
                <p className="text-sm uppercase tracking-[0.3em] text-[#84b827] font-semibold">Адрес и зона обслуживания</p>
                <p className="mt-4 text-xl font-bold text-white">Весь Санкт-Петербург</p>
                <p className="mt-2 text-lg text-slate-300">Все районы Ленинградской области</p>
                <p className="mt-4 text-slate-400 leading-relaxed">Выезд инженера по СПб и всей Ленинградской области: север, юг, восток, запад, ближайшие пригороды и удаленные поселки. Подбор, доставка, монтаж и обслуживание автономных септиков под ключ.</p>
              </div>

              <div className="glass rounded-3xl p-8 hover-lift">
                <p className="text-sm uppercase tracking-[0.3em] text-[#84b827] font-semibold">Мы в соцсетях</p>
                <p className="mt-4 text-slate-300 leading-relaxed">Новости и примеры работ — в группе ВКонтакте.</p>
                <a
                  href="https://vk.com/septusru"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-[#84b827] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#6d981f]"
                >
                  Группа ВКонтакте
                </a>
              </div>
            </div>
          </div>

          <div className="container mx-auto mt-16 border-t border-slate-800/50 px-4 pt-8 text-sm text-slate-500 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p>© {new Date().getFullYear()} Септус. Все права защищены.</p>
              <div className="flex gap-6 text-xs">
                <span className="text-slate-400">Политика конфиденциальности</span>
                <span className="text-slate-400">Условия использования</span>
                <a href="/sitemap.xml" className="hover:text-emerald-400 transition-colors">Карта сайта</a>
              </div>
            </div>
          </div>
        </footer>
        <MobileStickyCta />
      </body>
    </html>
  );
}
