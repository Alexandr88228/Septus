import { NextResponse } from 'next/server';
import { getCatalogProducts } from '../../../lib/catalog-data';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  try {
    const products = await getCatalogProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}