import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { SANITY_CACHE_TAG } from '../../../lib/sanity-cache-tag';

/**
 * Webhook / ручной сброс кэша после Publish в Sanity.
 * URL: POST /api/revalidate?secret=ВАШ_СЕКРЕТ
 * Тело от Sanity можно игнорировать — достаточно query secret.
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret') || request.headers.get('x-sanity-revalidate-secret');
  const expected = process.env.SANITY_REVALIDATE_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  }

  revalidateTag(SANITY_CACHE_TAG);

  return NextResponse.json({ ok: true, revalidated: SANITY_CACHE_TAG, at: new Date().toISOString() });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
