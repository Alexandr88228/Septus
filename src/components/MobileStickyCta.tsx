'use client';

import Link from 'next/link';
import { trackGoal } from '../lib/metrika';

export default function MobileStickyCta() {
  return (
    <div className="fixed bottom-3 left-3 right-3 z-50 grid grid-cols-2 gap-2 md:hidden">
      <a
        href="tel:+79944283029"
        onClick={() => trackGoal('click_phone')}
        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-3 text-sm font-semibold text-white shadow-xl"
      >
        Позвонить
      </a>
      <Link
        href="/lead"
        className="inline-flex items-center justify-center rounded-xl bg-secondary px-3 py-3 text-sm font-semibold text-white shadow-xl"
      >
        Оставить заявку
      </Link>
    </div>
  );
}
