import { createImageUrlBuilder } from '@sanity/image-url';
import { client } from './client';

const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

export function imageUrl(source: any, fallback = '') {
  if (!source) return fallback;

  try {
    return urlFor(source).auto('format').fit('max').url();
  } catch {
    return fallback;
  }
}
