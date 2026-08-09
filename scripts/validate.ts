// validate.ts
// Pre-commit / CI validation for content articles.
//
// Replaces scripts/validate-article.cjs. Checks, for each .mdx article:
//   1. Frontmatter parses against the shared zod schema (src/schemas/content.ts).
//   2. MDX compiles (via @mdx-js/mdx).
//   3. Every cover image and inline asset resolves to a real file in public/.
//   4. Every http(s) link returns 2xx (HEAD, short timeout). Skippable with --no-links.
//   5. (Optional, --fuzzy-citation-check) every <CitedText> quote appears on the
//      cited page (string-similarity threshold).
//
// Modes:
//   --all                 Validate every article (default)
//   --changed             Validate only .mdx files changed vs origin/main
//   --file <path>         Validate one file
//
// Output:
//   --json                Emit machine-readable JSON (for CI) instead of the
//                         human-readable report.
//
// Exit code is non-zero if any article has a blocking failure.

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { compile } from '@mdx-js/mdx';
import matter from 'gray-matter';
import { articleFrontmatterSchema } from '../src/schemas/content.ts';
import { ARTICLE_COLLECTIONS } from '../src/utils/collections.ts';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// ──────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────

type Severity = 'error' | 'warning';

interface Finding {
  severity: Severity;
  rule: string;
  message: string;
  line?: number;
}

interface ArticleReport {
  file: string;
  findings: Finding[];
}

interface RunOptions {
  mode: 'all' | 'changed' | 'file';
  file?: string;
  json: boolean;
  links: boolean;
  fuzzy: boolean;
}

// ──────────────────────────────────────────────────────────────────────────
// Argument parsing
// ──────────────────────────────────────────────────────────────────────────

function parseArgs(argv: string[]): RunOptions {
  const opts: RunOptions = {
    mode: 'all',
    json: false,
    links: true,
    fuzzy: false
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--all') opts.mode = 'all';
    else if (arg === '--changed') opts.mode = 'changed';
    else if (arg === '--file') {
      opts.mode = 'file';
      opts.file = argv[++i];
    } else if (arg === '--json') opts.json = true;
    else if (arg === '--no-links') opts.links = false;
    else if (arg === '--fuzzy-citation-check') opts.fuzzy = true;
    else if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    } else {
      console.error(`Unknown arg: ${arg}`);
      printUsage();
      process.exit(2);
    }
  }
  if (opts.mode === 'file' && !opts.file) {
    console.error('--file requires a path');
    process.exit(2);
  }
  return opts;
}

function printUsage() {
  console.log(
    [
      'Usage: pnpm validate [--all | --changed | --file <path>] [--json] [--no-links] [--fuzzy-citation-check]',
      '',
      '  --all                     Validate every .mdx article (default)',
      '  --changed                 Validate only .mdx files changed vs origin/main',
      '  --file <path>             Validate one file',
      '  --json                    Emit JSON report instead of human-readable output',
      '  --no-links                Skip HTTP HEAD link checks (faster)',
      '  --fuzzy-citation-check    Verify <CitedText> quotes appear on cited pages'
    ].join('\n')
  );
}

// ──────────────────────────────────────────────────────────────────────────
// File collection
// ──────────────────────────────────────────────────────────────────────────

function listAllArticles(): string[] {
  const out: string[] = [];
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('_')) continue; // templates + _resources
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (full.endsWith('.mdx')) out.push(full);
    }
  }
  // Driven by the same registry the site routes off, so a new collection is
  // never validated in only some of the places that know about it.
  for (const collection of ARTICLE_COLLECTIONS) {
    const dir = path.join(CONTENT_DIR, collection);
    if (fs.existsSync(dir)) walk(dir);
  }
  return out;
}

function listChangedArticles(): string[] {
  let base = 'origin/main';
  try {
    execSync(`git rev-parse ${base}`, { stdio: 'ignore' });
  } catch {
    base = 'HEAD~1';
  }
  const raw = execSync(`git diff --name-only --diff-filter=AM ${base}...HEAD`, {
    encoding: 'utf8'
  });
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.endsWith('.mdx'))
    .filter((line) => line.startsWith('sastro/src/content/') || line.startsWith('src/content/'))
    .map((line) => (line.startsWith('sastro/') ? line.slice('sastro/'.length) : line))
    .map((line) => path.resolve(line))
    .filter((full) => fs.existsSync(full))
    .filter((full) => !path.basename(full).startsWith('_'));
}

// ──────────────────────────────────────────────────────────────────────────
// Per-article checks
// ──────────────────────────────────────────────────────────────────────────

async function validateFrontmatter(
  raw: string,
  findings: Finding[]
): Promise<{ data: any; content: string }> {
  const parsed = matter(raw);
  const result = articleFrontmatterSchema.safeParse(parsed.data);
  if (!result.success) {
    for (const issue of result.error.issues) {
      findings.push({
        severity: 'error',
        rule: 'frontmatter',
        message: `${issue.path.join('.')}: ${issue.message}`
      });
    }
  }
  return { data: parsed.data, content: parsed.content };
}

async function validateMdxCompile(content: string, findings: Finding[]): Promise<void> {
  try {
    await compile(content, { development: false });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    findings.push({ severity: 'error', rule: 'mdx-compile', message: msg });
  }
}

// House style: prose uses commas, semicolons, or regular hyphens. Em-dashes
// drift back regularly via AI-assisted writing; flag every occurrence so a
// reviewer either rewrites the sentence or replaces with a hyphen.
// Scans the entire raw file (including frontmatter) so em-dashes in title or
// description fields don't sneak through. Skips fenced code blocks where an
// em-dash might be quoting the literal character.
function validateNoEmDash(raw: string, findings: Finding[]): void {
  const lines = raw.split(/\r?\n/);
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (inFence) continue;
    if (line.includes('—')) {
      findings.push({
        severity: 'error',
        rule: 'no-em-dash',
        message: 'em-dash (—) found; use a comma, semicolon, or hyphen',
        line: i + 1,
      });
    }
  }
}

function validateAssets(data: any, content: string, findings: Finding[]): void {
  const isDraft = data?.draft === true;
  const references = new Set<string>();
  if (typeof data?.coverImage === 'string') references.add(data.coverImage);

  // Markdown images: ![alt](/path/to/img.png)
  const mdImg = /!\[[^\]]*\]\(([^)\s]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = mdImg.exec(content))) references.add(m[1]);

  // HTML/JSX <img src="…">
  const htmlImg = /<img[^>]*\ssrc=["']([^"']+)["']/g;
  while ((m = htmlImg.exec(content))) references.add(m[1]);

  for (const ref of references) {
    if (!ref || /^https?:/i.test(ref) || ref.startsWith('data:')) continue;
    // Ignore imported identifiers (Astro passes `src={coverImage}` objects - these
    // look like JSX expressions, not strings, so they won't land in this set).
    const normalized = ref.startsWith('/') ? ref.slice(1) : ref;
    const candidate = path.join(PUBLIC_DIR, normalized);
    if (!fs.existsSync(candidate)) {
      findings.push({
        // Drafts inherently have in-progress assets - surface the issue without
        // blocking the build.
        severity: isDraft ? 'warning' : 'error',
        rule: 'broken-asset',
        message: `asset not found in public/: ${ref}`
      });
    }
  }
}

function extractLinks(content: string): string[] {
  const links = new Set<string>();
  const mdLink = /\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g;
  const htmlHref = /href=["'](https?:\/\/[^"']+)["']/g;
  const citedUrl = /<CitedText[^>]*\burl=["'](https?:\/\/[^"']+)["']/g;
  for (const re of [mdLink, htmlHref, citedUrl]) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(content))) links.add(m[1]);
  }
  return Array.from(links);
}

async function headCheck(url: string, timeoutMs = 6000): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    if (res.ok) return true;
    // Some hosts 405 HEAD - retry GET
    if (res.status === 405 || res.status === 403) {
      const res2 = await fetch(url, { method: 'GET', signal: controller.signal });
      return res2.ok;
    }
    return false;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function validateLinks(content: string, findings: Finding[]): Promise<void> {
  const links = extractLinks(content);
  if (links.length === 0) return;
  const results = await Promise.all(links.map(async (url) => ({ url, ok: await headCheck(url) })));
  for (const { url, ok } of results) {
    if (!ok) {
      findings.push({
        severity: 'warning',
        rule: 'link-rot',
        message: `link not reachable (HEAD/GET): ${url}`
      });
    }
  }
}

async function validateFuzzyCitations(content: string, findings: Finding[]): Promise<void> {
  const { stringSimilarity } = await import('string-similarity-js');
  const re = /<CitedText\b[^>]*\burl=["']([^"']+)["'][^>]*>([\s\S]*?)<\/CitedText>/g;
  let m: RegExpExecArray | null;
  const pairs: { url: string; quote: string }[] = [];
  while ((m = re.exec(content))) {
    pairs.push({ url: m[1], quote: m[2].replace(/<[^>]+>/g, '').trim() });
  }
  for (const { url, quote } of pairs) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const html = await res.text();
      const text = html.replace(/<[^>]+>/g, ' ');
      const score = stringSimilarity(quote, text);
      if (score < 0.5) {
        findings.push({
          severity: 'warning',
          rule: 'fuzzy-citation',
          message: `low match score (${score.toFixed(2)}) between quote and ${url}`
        });
      }
    } catch {
      // network failures here are not validation failures
    }
  }
}

async function validateArticle(file: string, opts: RunOptions): Promise<ArticleReport> {
  const raw = fs.readFileSync(file, 'utf8');
  const findings: Finding[] = [];
  const { data, content } = await validateFrontmatter(raw, findings);
  await validateMdxCompile(content, findings);
  validateNoEmDash(raw, findings);
  validateAssets(data, content, findings);
  if (opts.links) await validateLinks(content, findings);
  if (opts.fuzzy) await validateFuzzyCitations(content, findings);
  return { file: path.relative(process.cwd(), file), findings };
}

// ──────────────────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────────────────

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  let files: string[] = [];
  if (opts.mode === 'all') files = listAllArticles();
  else if (opts.mode === 'changed') files = listChangedArticles();
  else if (opts.mode === 'file') files = [path.resolve(opts.file!)];

  if (files.length === 0) {
    if (!opts.json) console.log('No articles to validate.');
    else console.log(JSON.stringify({ reports: [], errorCount: 0, warningCount: 0 }));
    return;
  }

  const reports: ArticleReport[] = [];
  for (const file of files) {
    reports.push(await validateArticle(file, opts));
  }

  let errorCount = 0;
  let warningCount = 0;
  for (const r of reports) {
    for (const f of r.findings) {
      if (f.severity === 'error') errorCount++;
      else warningCount++;
    }
  }

  if (opts.json) {
    console.log(JSON.stringify({ reports, errorCount, warningCount }, null, 2));
  } else {
    for (const r of reports) {
      const label = r.findings.length === 0 ? 'ok' : `${r.findings.length} finding(s)`;
      console.log(`\n${r.file}  [${label}]`);
      for (const f of r.findings) {
        const tag = f.severity === 'error' ? 'ERROR' : 'warn';
        console.log(`  [${tag}] (${f.rule}) ${f.message}`);
      }
    }
    console.log(
      `\nSummary: ${reports.length} file(s), ${errorCount} error(s), ${warningCount} warning(s)`
    );
  }

  if (errorCount > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
