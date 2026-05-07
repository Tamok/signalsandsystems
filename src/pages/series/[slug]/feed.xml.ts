import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllSeries, getSeriesArticles, getSeriesBySlug } from '../../../utils/content';

// Per-series RSS feed at /series/<slug>/feed.xml. Filters the site-wide
// article set by frontmatter series field. Each series collection in
// src/content/series/<slug>.json gets a route automatically.

export async function getStaticPaths() {
  const seriesList = await getAllSeries();
  return seriesList.map((series) => ({
    params: { slug: series.slug },
  }));
}

export async function GET(context: APIContext) {
  const slug = context.params.slug as string;
  const [series, articles] = await Promise.all([
    getSeriesBySlug(slug),
    getSeriesArticles(slug),
  ]);

  if (!series) {
    return new Response('Series not found', { status: 404 });
  }

  return rss({
    title: `${series.title} | Signals & Systems`,
    description: series.description,
    site: context.site!,
    items: articles.map((article) => ({
      title: article.title,
      description: article.description,
      pubDate: article.publishDate,
      link: `/${article.slug}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
