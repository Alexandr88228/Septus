import Image from 'next/image';
import Link from 'next/link';

type Props = {
  title: string;
  subtitle?: string;
  badge?: string;
};

export default function CatalogPageHero({ title, subtitle, badge }: Props) {
  return (
    <div className="mb-10 flex flex-col items-center text-center">
      <Link href="/" className="mb-6 block transition hover:opacity-90">
        <span className="relative mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200 md:h-28 md:w-28">
          <Image src="/logo.webp" alt="Септус" width={112} height={112} className="object-contain p-2" priority />
        </span>
      </Link>
      {badge ? (
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#84b827]">{badge}</p>
      ) : null}
      <h1 className={`section-heading max-w-4xl ${badge ? 'mt-3' : ''}`}>{title}</h1>
      {subtitle ? <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">{subtitle}</p> : null}
    </div>
  );
}

