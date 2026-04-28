'use client';

declare global {
  interface Window {
    ym?: (id: number, action: string, target: string, params?: Record<string, unknown>) => void;
  }
}

export function getMetrikaId(): number | null {
  const rawId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  if (!rawId) return null;
  const parsed = Number(rawId);
  return Number.isFinite(parsed) ? parsed : null;
}

export function trackGoal(goal: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const id = getMetrikaId();
  if (!id || !window.ym) return;
  window.ym(id, 'reachGoal', goal, params);
}
