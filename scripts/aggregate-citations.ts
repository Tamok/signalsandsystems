// aggregate-citations.ts
// Scans all articles for <CitedText> metadata and aggregates unique citations with usage tracking.
// Outputs a single consolidated JSON file that tracks which series and articles use each citation.
//
// Uses an MDX AST walk (remark-mdx) rather than regex, so multi-line <CitedText> tags and
// attributes containing angle brackets are parsed correctly.

import fs from 'fs';
import path from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkFrontmatter from 'remark-frontmatter';
import { visit } from 'unist-util-visit';
import { CitationsFileSchema } from '../src/data/citations.schema.ts';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'data');

const mdxProcessor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter, ['yaml'])
  .use(remarkMdx);

// Utility to recursively get all files in a directory
function getAllFiles(dir: string, exts = ['.mdx', '.md']): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, exts));
    } else if (exts.includes(path.extname(file))) {
      results.push(filePath);
    }
  });
  return results;
}

// Walk the MDX AST to collect every <CitedText …> node's string-valued attributes.
// Matches both <CitedText …>children</CitedText> (flow/text) and self-closing <CitedText …/>.
function extractCitations(content: string, filePath: string): Record<string, string>[] {
  let tree;
  try {
    tree = mdxProcessor.parse(content);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to parse MDX in ${filePath}: ${message}`);
  }

  const citations: Record<string, string>[] = [];

  visit(tree, (node: any) => {
    if (
      (node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement') ||
      node.name !== 'CitedText'
    ) {
      return;
    }

    const meta: Record<string, string> = {};
    for (const attr of node.attributes || []) {
      if (attr.type !== 'mdxJsxAttribute' || !attr.name) continue;
      // Skip spread attributes and expression-valued attributes - we only track literal strings,
      // matching the pre-AST regex behavior.
      if (typeof attr.value === 'string') {
        meta[attr.name] = attr.value;
      }
    }
    citations.push(meta);
  });

  return citations;
}

// Extract frontmatter title from content
function extractTitle(content: string): string {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) return 'Untitled';

  const frontmatter = frontmatterMatch[1];
  const titleMatch = frontmatter.match(/^\s*title\s*:\s*["']?([^"'\r\n]+)["']?\s*$/m);
  return titleMatch ? titleMatch[1].trim() : 'Untitled';
}

// Get slug from file path
function getSlugFromPath(filePath: string): string {
  const relPath = path.relative(CONTENT_DIR, filePath);
  const parts = relPath.split(path.sep);
  if (parts.length < 2) return '';

  const filename = path.basename(parts[parts.length - 1], path.extname(parts[parts.length - 1]));
  const series = parts[0];
  return `${series}/${filename}`;
}

function isDraft(content: string): boolean {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) return false;

  const frontmatter = frontmatterMatch[1];
  const draftMatch = frontmatter.match(/^\s*draft\s*:\s*(true|"true"|'true')\s*$/m);
  return !!draftMatch;
}

// Utility to normalize citation objects for robust deduplication
function normalizeCitation(citation: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {};
  Object.keys(citation).sort().forEach((key) => {
    const value = citation[key];
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = typeof value === 'string' ? value.trim() : value;
    }
  });
  return cleaned;
}

function getCitationKey(citation: Record<string, any>): string {
  const title = (citation.title || '').toLowerCase().trim();
  const url = (citation.url || '').toLowerCase().trim();
  const author = (citation.author || '').toLowerCase().trim();
  return url ? `${title}||${url}` : `${title}||${author}`;
}

function mergeCitations(a: Record<string, any>, b: Record<string, any>): Record<string, any> {
  const merged: Record<string, any> = { ...a };
  for (const key of Object.keys(b)) {
    if (key === 'tags') {
      merged.tags = Array.from(new Set([...(a.tags || []), ...(b.tags || [])]));
    } else if (!merged[key] && b[key]) {
      merged[key] = b[key];
    } else if (merged[key] && b[key] && merged[key] !== b[key]) {
      if (typeof merged[key] === 'string' && typeof b[key] === 'string') {
        merged[key] = merged[key].length >= b[key].length ? merged[key] : b[key];
      }
    }
  }
  return merged;
}

function normalizeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  return tags
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => t.toLowerCase())
    .filter((t) => {
      if (seen.has(t)) return false;
      seen.add(t);
      return true;
    })
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1));
}

// Path segments starting with `_` are auxiliary (templates, _resources research notes)
// and should not be treated as article content.
function isAuxiliaryPath(filePath: string): boolean {
  const rel = path.relative(CONTENT_DIR, filePath);
  return rel.split(path.sep).some((seg) => seg.startsWith('_'));
}

function aggregateCitations() {
  const files = getAllFiles(CONTENT_DIR).filter((f) => !isAuxiliaryPath(f));
  const citations: Record<string, any> = {};

  console.log(`Processing ${files.length} files...`);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');

    if (isDraft(content)) {
      console.log(`Skipping draft: ${file}`);
      continue;
    }

    const relPath = path.relative(CONTENT_DIR, file);
    const parts = relPath.split(path.sep);
    const series = parts.length > 1 ? parts[0] : null;
    const articleSlug = getSlugFromPath(file);
    const articleTitle = extractTitle(content);

    if (!series || series === 'series') continue;

    const tagMatch = content.match(/tags:\s*\[([^\]]+)\]/);
    const tags = tagMatch ? tagMatch[1].split(',').map((t) => t.trim().replace(/['"]/g, '')) : [];

    const fileCitations = extractCitations(content, file);

    for (const citation of fileCitations) {
      const normalized = normalizeCitation(citation);
      const mergedTags = normalizeTags([...(normalized.tags || []), ...tags]);
      const key = getCitationKey(normalized);

      if (!citations[key]) {
        citations[key] = {
          ...normalized,
          tags: mergedTags,
          usedInSeries: [],
          usedInArticles: []
        };
      } else {
        citations[key] = mergeCitations(citations[key], { ...normalized, tags: mergedTags });
        citations[key].tags = normalizeTags(citations[key].tags || []);
      }

      if (series && !citations[key].usedInSeries.includes(series)) {
        citations[key].usedInSeries.push(series);
      }

      const articleUsage = {
        title: articleTitle,
        slug: articleSlug,
        series
      };

      if (!citations[key].usedInArticles.some((a: any) => a.slug === articleSlug)) {
        citations[key].usedInArticles.push(articleUsage);
      }
    }
  }

  const finalCitations = Object.values(citations).map((citation: any) => {
    citation.usedInSeries.sort();
    citation.usedInArticles.sort((a: any, b: any) => a.slug.localeCompare(b.slug));
    return citation;
  });

  finalCitations.sort((a, b) => (a.title || '').localeCompare(b.title || ''));

  const output = {
    lastUpdated: new Date().toISOString(),
    citations: finalCitations
  };

  // Validate against the zod schema before writing so the on-disk JSON never
  // drifts silently from the shape downstream components expect.
  const validated = CitationsFileSchema.parse(output);

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'consolidated-citations.json'),
    JSON.stringify(validated, null, 2)
  );

  console.log(`Generated consolidated citations with ${finalCitations.length} unique citations`);
  console.log(`Citations usage summary:`);

  finalCitations.forEach((citation: any) => {
    console.log(
      `- "${citation.title}" used in ${citation.usedInSeries.length} series, ${citation.usedInArticles.length} articles`
    );
  });
}

aggregateCitations();
