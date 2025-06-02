// Utility functions for dynamic content sourcing in Signals & Systems using Astro Content Collections
// Adheres to project guidelines: content-first, type-safe, minimal
import { format } from 'date-fns';
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

// Define the schema types to match content/config.ts
type DevlogSchema = {
  title: string;
  description: string;
  publishDate: Date;
  coverImage?: string;
  series?: string;
  order?: number;
  tags?: string[];
  draft?: boolean;
};

type SeriesSchema = {
  title: string;
  description: string;
  startDate: Date;
  coverImage?: string;
  tags?: string[];
};

// Export interfaces for use in components
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

/**
 * Get all articles from all content collections
 */
export async function getAllArticles(): Promise<Article[]> {
  const allArticles: Article[] = [];
  
  try {
    // Get articles from the devlog collection
    const devlogEntries = await getCollection('devlog');
    const devlogArticles = devlogEntries
      .filter(entry => !entry.data.draft)
      .map(entry => ({
        title: entry.data.title,
        slug: `devlog/${entry.slug}`, // Include collection prefix for routing
        description: entry.data.description,
        publishDate: entry.data.publishDate,
        series: entry.data.series,
        order: entry.data.order,
        coverImage: entry.data.coverImage
      }));
    
    allArticles.push(...devlogArticles);
      // Get articles from the isomon collection
    const isomonEntries = await getCollection('isomon');
    const isomonArticles = isomonEntries
      .filter(entry => !entry.data.draft)
      .map(entry => ({
        title: entry.data.title,
        slug: `isomon/${entry.slug}`, // Include collection prefix for routing
        description: entry.data.description,
        publishDate: entry.data.publishDate,
        series: entry.data.series,
        order: entry.data.order,
        coverImage: entry.data.coverImage
      }));
    
    allArticles.push(...isomonArticles);
    
    // Get articles from the geo collection
    const geoEntries = await getCollection('geo');
    const geoArticles = geoEntries
      .filter(entry => !entry.data.draft)
      .map(entry => ({
        title: entry.data.title,
        slug: `geo/${entry.slug}`, // Include collection prefix for routing
        description: entry.data.description,
        publishDate: entry.data.publishDate,
        series: entry.data.series,
        order: entry.data.order,
        coverImage: entry.data.coverImage
      }));
    
    allArticles.push(...geoArticles);
    
    // Sort by publish date, newest first
    return allArticles.sort(
      (a, b) => b.publishDate.getTime() - a.publishDate.getTime()
    );
  } catch (error) {
    console.error("Error fetching articles:", error);
    return []; // Return empty array on error
  }
}

/**
 * Get all series from the series collection
 */
export async function getAllSeries(): Promise<Series[]> {
  try {
    // Get all series data from the series collection
    const seriesEntries = await getCollection('series');
    const result: Series[] = [];
    
    for (const entry of seriesEntries) {
      // Count articles in this series
      const articlesInSeries = await getSeriesArticles(entry.id);
      
      result.push({
        title: entry.data.title,
        slug: entry.id,
        description: entry.data.description,
        articleCount: articlesInSeries.length,
        startDate: entry.data.startDate,
        coverImage: entry.data.coverImage
      });
    }
    
    return result;
  } catch (error) {
    console.error("Error fetching series:", error);
    return [];
  }
}

/**
 * Get all articles in a specific series
 */
export async function getSeriesArticles(seriesSlug: string): Promise<Article[]> {
  try {
    const allArticles = await getAllArticles();
    return allArticles
      .filter(article => article.series && article.series.toLowerCase() === seriesSlug.toLowerCase())
      .sort((a, b) => {
        // First sort by order if available
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        // Fall back to date sorting
        return a.publishDate.getTime() - b.publishDate.getTime();
      });
  } catch (error) {
    console.error(`Error fetching series articles for ${seriesSlug}:`, error);
    return [];
  }
}

/**
 * Get an article by its slug
 * @param slug The slug of the article (with or without leading slash)
 */
export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    // Normalize the slug (remove leading slash if present)
    const normalizedSlug = slug.startsWith('/') ? slug.substring(1) : slug;
    
    // Split the slug to get the collection and entry ID
    const parts = normalizedSlug.split('/');
    if (parts.length < 2) return undefined;
    
    const collectionName = parts[0];
    const entryId = parts.slice(1).join('/');
      // Support multiple collections
    if (!['devlog', 'isomon', 'geo'].includes(collectionName)) {
      return undefined;
    }
    
    const entry = await getEntry(collectionName as 'devlog' | 'isomon' | 'geo', entryId);
    
    if (!entry) {
      return undefined;
    }
    
    return {
      title: entry.data.title,
      slug: `${collectionName}/${entry.slug}`, // No leading slash
      description: entry.data.description,
      publishDate: entry.data.publishDate,
      series: entry.data.series,
      order: entry.data.order,
      coverImage: entry.data.coverImage
    };
  } catch (error) {
    console.error(`Error fetching article with slug ${slug}:`, error);
    return undefined;
  }
}

/**
 * Get series information by its slug
 * @param slug The slug of the series
 */
export async function getSeriesBySlug(slug: string): Promise<Series | undefined> {
  try {
    const entry = await getEntry('series', slug);
    if (!entry) return undefined;
    
    const articlesInSeries = await getSeriesArticles(slug);
    
    return {
      title: entry.data.title,
      slug: entry.id,
      description: entry.data.description,
      articleCount: articlesInSeries.length,
      startDate: entry.data.startDate,
      coverImage: entry.data.coverImage
    };
  } catch (error) {
    console.error(`Error fetching series with slug ${slug}:`, error);
    return undefined;
  }
}

// GDPR/Consent: This site only stores analytics consent (granted/denied) in localStorage. No other user data is stored or tracked.
