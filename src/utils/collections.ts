export const ARTICLE_COLLECTIONS = ['devlog', 'isomon', 'geo', 'tfp', 'wymber'] as const;

export type ArticleCollection = (typeof ARTICLE_COLLECTIONS)[number];

export function isArticleCollection(value: string): value is ArticleCollection {
  return (ARTICLE_COLLECTIONS as readonly string[]).includes(value);
}
