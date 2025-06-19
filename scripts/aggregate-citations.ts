// aggregate-citations.ts
// Scans all articles for <CitedText> metadata and aggregates unique citations with usage tracking.
// Outputs a single consolidated JSON file that tracks which series and articles use each citation.

import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'data');

// Utility to recursively get all files in a directory
function getAllFiles(dir: string, exts = ['.mdx', '.md', '.astro']): string[] {
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

// Extract <CitedText ...>...</CitedText> or <CitedText ... /> metadata from file content
function extractCitations(content: string): any[] {
  const regex = /<CitedText\s+([^>]+?)(?:\/>|>(?:.|\n)*?<\/CitedText>)/g;
  const citations: any[] = [];
  let match;
  while ((match = regex.exec(content))) {
    const attrs = match[1];
    const meta: Record<string, string> = {};
    attrs.replace(/(\w+)="([^"]*)"/g, (_, key, value) => {
      meta[key] = value;
      return '';
    });
    citations.push(meta);
  }
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
  // Handle both Unix (\n) and Windows (\r\n) line endings
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) return false;
  
  const frontmatter = frontmatterMatch[1];
  // Look for draft: true (with optional spaces and quotes)
  const draftMatch = frontmatter.match(/^\s*draft\s*:\s*(true|"true"|'true')\s*$/m);  return !!draftMatch;
}

// Utility to normalize citation objects for robust deduplication
function normalizeCitation(citation: Record<string, any>): Record<string, any> {
  // Remove undefined, null, and empty string fields
  const cleaned: Record<string, any> = {};
  Object.keys(citation).sort().forEach(key => {
    const value = citation[key];
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = typeof value === 'string' ? value.trim() : value;
    }
  });
  return cleaned;
}

// Utility to normalize and merge citation objects for robust deduplication
function getCitationKey(citation: Record<string, any>): string {
  // Use lowercased title + url if present, else title + author
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
      // Prefer non-empty, longer, or more informative value
      if (typeof merged[key] === 'string' && typeof b[key] === 'string') {
        merged[key] = merged[key].length >= b[key].length ? merged[key] : b[key];
      }
    }
  }
  return merged;
}

function normalizeTags(tags: string[]): string[] {
  // Remove empty, trim, lowercase, and deduplicate, then capitalize first letter
  const seen = new Set<string>();
  return tags
    .map(t => t.trim())
    .filter(Boolean)
    .map(t => t.toLowerCase())
    .filter(t => {
      if (seen.has(t)) return false;
      seen.add(t);
      return true;
    })
    .map(t => t.charAt(0).toUpperCase() + t.slice(1));
}

function aggregateCitations() {
  const files = getAllFiles(CONTENT_DIR);
  const citations: Record<string, any> = {};
  
  console.log(`Processing ${files.length} files...`);
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Skip draft articles
    if (isDraft(content)) {
      console.log(`Skipping draft: ${file}`);
      continue;
    }
    
    const relPath = path.relative(CONTENT_DIR, file);
    const parts = relPath.split(path.sep);
    const series = parts.length > 1 ? parts[0] : null;
    const articleSlug = getSlugFromPath(file);
    const articleTitle = extractTitle(content);
    
    // Skip if no series (not an article)
    if (!series || series === 'series') continue;
    
    const tagMatch = content.match(/tags:\s*\[([^\]]+)\]/);
    let tags = tagMatch ? tagMatch[1].split(',').map(t => t.trim().replace(/['"]/g, '')) : [];
    
    const fileCitations = extractCitations(content);
    
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
        // Merge citation data
        citations[key] = mergeCitations(citations[key], { ...normalized, tags: mergedTags });
        citations[key].tags = normalizeTags(citations[key].tags || []);
      }
      
      // Track series usage
      if (series && !citations[key].usedInSeries.includes(series)) {
        citations[key].usedInSeries.push(series);
      }
      
      // Track article usage
      const articleUsage = {
        title: articleTitle,
        slug: articleSlug,
        series: series
      };
      
      if (!citations[key].usedInArticles.some((a: any) => a.slug === articleSlug)) {
        citations[key].usedInArticles.push(articleUsage);
      }
    }
  }
  
  // Convert to final format
  const finalCitations = Object.values(citations).map((citation: any) => {
    // Sort usage arrays for consistency
    citation.usedInSeries.sort();
    citation.usedInArticles.sort((a: any, b: any) => a.slug.localeCompare(b.slug));
    return citation;
  });
  
  // Sort citations by title
  finalCitations.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  
  const output = {
    lastUpdated: new Date().toISOString(),
    citations: finalCitations
  };
  
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);
  
  // Write the new consolidated file
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'consolidated-citations.json'), 
    JSON.stringify(output, null, 2)
  );
  
  console.log(`Generated consolidated citations with ${finalCitations.length} unique citations`);
  console.log(`Citations usage summary:`);
  
  finalCitations.forEach((citation: any) => {
    console.log(`- "${citation.title}" used in ${citation.usedInSeries.length} series, ${citation.usedInArticles.length} articles`);
  });
}

aggregateCitations();
