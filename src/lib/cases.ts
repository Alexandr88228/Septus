import { unstable_cache } from 'next/cache';
import { CASE_STUDIES, type CaseStudy } from '../content/cases';
import { client } from '../sanity/client';
import { hasSanityConfig } from '../sanity/env';
import { mapCaseStudies } from '../sanity/mappers';
import { caseStudiesQuery } from '../sanity/queries';
import { PUBLIC_PAGE_REVALIDATE_SECONDS } from './cache';
import { SANITY_CACHE_TAG } from './sanity-cache-tag';

export type { CaseStudy };

async function getSanityCasesUncached(): Promise<CaseStudy[]> {
  if (!hasSanityConfig) return [];
  try {
    const rows = await client.fetch(caseStudiesQuery);
    return mapCaseStudies(rows);
  } catch (error) {
    console.warn('Sanity case studies unavailable', error);
    return [];
  }
}

const getSanityCases = unstable_cache(getSanityCasesUncached, ['sanity-case-studies'], {
  revalidate: PUBLIC_PAGE_REVALIDATE_SECONDS,
  tags: [SANITY_CACHE_TAG],
});

export async function getAllCases(): Promise<CaseStudy[]> {
  const fromSanity = await getSanityCases();
  if (fromSanity.length > 0) return fromSanity;
  return CASE_STUDIES;
}

export async function getCaseBySlug(slug: string): Promise<CaseStudy | undefined> {
  return (await getAllCases()).find((c) => c.slug === slug);
}
