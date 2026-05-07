import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { getSeriesArticles } from '../../../utils/content';

// Per-series RSS feed at /series/<slug>/feed.xml. Filters the site-wide
// article set by frontmatter series field. Each entry in
// src/content/series/<slug>.json gets a route automatically.
//
// Reads getCollection('series') directly so a load failure fails the
// build loudly rather than emitting an empty paths list (the previous
// version went through getAllSeries which catches errors and returns
// []). Each entry's series-data props feed the channel metadata.

export async function getStaticPaths() {
  const seriesEntries = await getCollection('series');
  return seriesEntries.map((entry) => ({
    params: { slug: entry.id.replace(/\.[^.]+$/, '') },
    props: {
      title: entry.data.title,
      description: entry.data.description,
    },
  }));
}

interface SeriesProps {
  title: string;
  description: string;
}

export async function GET(context: APIContext) {
  const slug = context.params.slug as string;
  const { title, description } = context.props as SeriesProps;
  const articles = await getSeriesArticles(slug);

  return rss({
    title: `${title} | Signals & Systems`,
    description,
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
