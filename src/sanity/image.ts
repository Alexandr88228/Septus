import { createImageUrlBuilder } from '@sanity/image-url';
import { client } from './client';

const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

export function imageUrl(source: any, fallback = '', width = 900) {
  if (!source) return fallback;

  try {
    return urlFor(source).width(width).quality(76).auto('format').fit('max').url();
  } catch {
    return fallback;
  }
}
