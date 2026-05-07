import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllArticles } from '../utils/content';

// Site-wide RSS feed at /feed.xml. Includes every published article
// across all collections, newest first. Per-series feeds live under
// /series/<slug>/feed.xml and filter the same source by series.

export async function GET(context: APIContext) {
  const articles = await getAllArticles();
  return rss({
    title: 'Signals & Systems',
    description:
      'Devlogs, isomon experiments, GEO research, and the Friction Principle series. Long-form writing on building software, systems, and the friction that keeps human cognition alive in an AI-augmented world.',
    site: context.site!,
    items: articles.map((article) => ({
      title: article.title,
      description: article.description,
      pubDate: article.publishDate,
      link: `/${article.slug}/`,
      categories: article.series ? [article.series] : undefined,
    })),
    customData: '<language>en-us</language>',
  });
}
