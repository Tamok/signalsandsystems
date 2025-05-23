// Content collections configuration for Signals & Systems
import { defineCollection, z } from 'astro:content';

// Define a schema for articles
const articleCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    coverImage: z.string().optional(),
    series: z.string().optional(),
    order: z.number().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false)
  })
});

// Define a schema for series
const seriesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    startDate: z.string().transform((str) => new Date(str)),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).optional()
  })
});

// Export collections
export const collections = {
  'devlog': articleCollection,
  'series': seriesCollection,
};
