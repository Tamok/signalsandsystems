// Plain-zod frontmatter schemas for articles and series.
// Shared between:
//   - src/content/config.ts (wraps each in defineCollection for Astro's content layer)
//   - scripts/validate.ts   (validates raw frontmatter without going through Astro)
//
// Don't change the shape here without also verifying that content/config.ts still
// picks it up and that validate.ts can parse every existing article.

import { z } from 'zod';

export const articleFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.date(),
  updatedDate: z.date().optional(),
  coverImage: z.string().optional(),
  series: z.string().optional(),
  order: z.number().optional(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().default(false)
});

export const seriesFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  startDate: z.string().transform((str) => new Date(str)),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;
export type SeriesFrontmatter = z.infer<typeof seriesFrontmatterSchema>;
