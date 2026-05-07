// Utility functions for dynamic content sourcing in Signals & Systems using Astro Content Collections.
// One registry drives every cross-collection query - see collections.ts.
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { ARTICLE_COLLECTIONS, isArticleCollection, type ArticleCollection } from './collections';

export interface Article {
  title: string;
  slug: string;
  description: string;
  publishDate: Date;
  series?: string;
  order?: number;
  coverImage?: string;
}

export interface Series {
  title: string;
  slug: string;
  description: string;
  articleCount: number;
  startDate: Date;
  coverImage?: string;
}

type ArticleEntry = CollectionEntry<ArticleCollection>;

function toArticle(collection: ArticleCollection, entry: ArticleEntry): Article {
  return {
    title: entry.data.title,
    slug: `${collection}/${entry.slug}`,
    description: entry.data.description,
    publishDate: entry.data.publishDate,
    series: entry.data.series?.toLowerCase(),
    order: entry.data.order,
    coverImage: entry.data.coverImage,
  };
}

export async function getAllArticles(): Promise<Article[]> {
  try {
    const collected = await Promise.all(
      ARTICLE_COLLECTIONS.map(async (collection) => {
        const entries = (await getCollection(collection)) as ArticleEntry[];
        return entries
          .filter((entry) => !entry.data.draft)
          .map((entry) => toArticle(collection, entry));
      })
    );

    return collected
      .flat()
      .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getAllSeries(): Promise<Series[]> {
  try {
    const seriesEntries = await getCollection('series');
    const result: Series[] = [];

    for (const entry of seriesEntries) {
      const slug = entry.id.replace(/\.[^/.]+$/, '');
      const articlesInSeries = await getSeriesArticles(slug);

      result.push({
        title: entry.data.title,
        slug,
        description: entry.data.description,
        articleCount: articlesInSeries.length,
        startDate: entry.data.startDate,
        coverImage: entry.data.coverImage,
      });
    }

    return result;
  } catch (error) {
    console.error('Error fetching series:', error);
    return [];
  }
}

export async function getSeriesArticles(seriesSlug: string): Promise<Article[]> {
  try {
    const target = seriesSlug.toLowerCase();
    const allArticles = await getAllArticles();
    return allArticles
      .filter((article) => article.series === target)
      .sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return a.publishDate.getTime() - b.publishDate.getTime();
      });
  } catch (error) {
    console.error(`Error fetching series articles for ${seriesSlug}:`, error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const normalizedSlug = slug.startsWith('/') ? slug.substring(1) : slug;
    const parts = normalizedSlug.split('/');
    if (parts.length < 2) return undefined;

    const [collectionName, ...rest] = parts;
    if (!isArticleCollection(collectionName)) return undefined;

    const entryId = rest.join('/');
    const entry = (await getEntry(collectionName, entryId)) as ArticleEntry | undefined;
    if (!entry) return undefined;

    return toArticle(collectionName, entry);
  } catch (error) {
    console.error(`Error fetching article with slug ${slug}:`, error);
    return undefined;
  }
}

export async function getSeriesBySlug(slug: string): Promise<Series | undefined> {
  try {
    const entry = await getEntry('series', slug);
    if (!entry) return undefined;

    const articlesInSeries = await getSeriesArticles(slug);
    return {
      title: entry.data.title,
      slug: entry.id.replace(/\.[^/.]+$/, ''),
      description: entry.data.description,
      articleCount: articlesInSeries.length,
      startDate: entry.data.startDate,
      coverImage: entry.data.coverImage,
    };
  } catch (error) {
    console.error(`Error fetching series with slug ${slug}:`, error);
    return undefined;
  }
}
