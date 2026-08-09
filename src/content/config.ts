// Content collections configuration for Signals & Systems.
// Frontmatter shapes live in src/schemas/content.ts so scripts/validate.ts
// can reuse them without importing from the astro:content virtual module.

import { defineCollection } from 'astro:content';
import { articleFrontmatterSchema, seriesFrontmatterSchema } from '../schemas/content';

const articleCollection = defineCollection({
  type: 'content',
  schema: articleFrontmatterSchema
});

const seriesCollection = defineCollection({
  type: 'data',
  schema: seriesFrontmatterSchema
});

export const collections = {
  devlog: articleCollection,
  isomon: articleCollection,
  geo: articleCollection,
  tfp: articleCollection,
  wymber: articleCollection,
  series: seriesCollection
};
