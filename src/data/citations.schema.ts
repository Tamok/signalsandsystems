// Zod schema for consolidated-citations.json.
// Used by scripts/aggregate-citations.ts to validate output before writing to disk
// so the JSON never drifts silently from the shape downstream components expect.

import { z } from 'zod';

export const CitationUsageSchema = z.object({
  title: z.string(),
  slug: z.string(),
  series: z.string()
});

export const CitationRecordSchema = z
  .object({
    // Identity (at least one of title/url/author is expected, but the aggregator
    // derives its dedup key from the combination, so none is individually required.)
    title: z.string().optional(),
    author: z.string().optional(),
    url: z.string().optional(),

    // Bibliographic metadata
    source: z.string().optional(),
    year: z.string().optional(),
    type: z.string().optional(),
    quote: z.string().optional(),

    tags: z.array(z.string()),

    usedInSeries: z.array(z.string()),
    usedInArticles: z.array(CitationUsageSchema)
  })
  // Preserve any ad-hoc <CitedText> prop we don't explicitly list here.
  .catchall(z.unknown());

export const CitationsFileSchema = z.object({
  lastUpdated: z.string(),
  citations: z.array(CitationRecordSchema)
});

export type CitationUsage = z.infer<typeof CitationUsageSchema>;
export type CitationRecord = z.infer<typeof CitationRecordSchema>;
export type CitationsFile = z.infer<typeof CitationsFileSchema>;
