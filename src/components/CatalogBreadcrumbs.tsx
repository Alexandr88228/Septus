import Link from 'next/link';

export type CatalogCrumb = { label: string; href?: string };

export default function CatalogBreadcrumbs({ items }: { items: CatalogCrumb[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="text-sm text-slate-600">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1">
            {index > 0 ? <span className="text-slate-400 px-0.5">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="text-slate-600 transition hover:text-[#84b827]">
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-slate-900">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
