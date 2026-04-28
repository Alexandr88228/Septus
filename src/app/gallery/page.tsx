import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import RevealWrapper from '../../components/RevealWrapper';

const galleryImages = [
  '/catalog-images/biodevays-pro/septik-biodevays-pro.webp',
  '/catalog-images/yunilos-astra/septik-yunilos-astra-5.webp',
  '/catalog-images/topas/septik-topas.webp',
  '/catalog-images/evrobion/septik-volgar.webp',
  '/catalog-images/grinlos/septik-grinlos.webp',
  '/catalog-images/aeroboks/septik-aeroboks.webp',
  '/catalog-images/kolovesi/septik-kolovesi.webp',
  '/catalog-images/kit-bio/septik-kit-bio.webp',
  '/catalog-images/dalos/septik-dalos.webp',
  '/catalog-images/atlos/septik-atlos.webp',
  '/catalog-images/ital-antey/septik-ital-antey.webp',
  '/catalog-images/vodanoff/septik-vodanoff.webp',
];

export const metadata: Metadata = {
  title: 'Галерея кейсов: монтажи септиков',
  description: 'Галерея кейсов Септус: реальные монтажи септиков под ключ в Санкт-Петербурге и Ленинградской области.',
  alternates: { canonical: '/gallery' },
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-surface py-20">
      <div className="container mx-auto px-4">
        <RevealWrapper>
          <div className="max-w-4xl mx-auto text-center mb-12">
          <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-surface text-primary text-sm font-semibold mb-4">
            Галерея живых фото
          </span>
          <h1 className="section-heading">Галерея кейсов: наши монтажи</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Все реальные фото работ и установок. Вернитесь на главную страницу, чтобы узнать больше и оставить заявку.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryImages.map((image, index) => (
            <div key={image} className="overflow-hidden rounded-[1.5rem] bg-white shadow-sm">
              <Image
                src={image}
                alt={`Монтаж септика Септус: объект ${index + 1}`}
                width={480}
                height={360}
                loading="lazy"
                className="h-56 w-full object-contain p-4 transition duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-secondary">
            Вернуться на главную
          </Link>
        </div>
      </RevealWrapper>
      </div>
    </main>
  );
}
