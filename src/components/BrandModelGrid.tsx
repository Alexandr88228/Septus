import Image from 'next/image';
import Link from 'next/link';
import type { CatalogModelRow } from '../lib/catalog-routing';

type Props = {
  brandSlug: string;
  models: CatalogModelRow[];
  imageSrc?: string;
  imageAlt?: string;
};

export default function BrandModelGrid({ brandSlug, models, imageSrc, imageAlt }: Props) {
  if (models.length === 0) return null;

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {models.map((m) => (
        <Link
          key={m.modelSlug}
          href={`/catalog/${brandSlug}/${m.modelSlug}/`}
          className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#84b827]/50 hover:shadow-md"
        >
          <div className="relative aspect-[4/3] bg-slate-50">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt || m.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-contain p-4 transition duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">Нет фото</div>
            )}
          </div>
          <div className="flex flex-1 flex-col p-4">
            <p className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 group-hover:text-[#84b827]">{m.name}</p>
            <p className="mt-2 text-base font-black text-[#84b827]">{m.price}</p>
            <span className="mt-3 text-xs font-bold text-slate-500 group-hover:text-[#10214a]">Подробнее →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
