'use client';

import { useEffect } from 'react';
import { trackGoal } from '../lib/metrika';

export default function ProductViewTracker({ productName }: { productName: string }) {
  useEffect(() => {
    trackGoal('open_product', { productName });
  }, [productName]);

  return null;
}
