#!/usr/bin/env node
// Local accessibility audit: pa11y × (light | dark) × target URLs.
// Prints a Markdown table summary and writes JSON to a11y-report.json.

import pa11y from 'pa11y';
import httpServer from 'http-server';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PORT = 4321;
const ORIGIN = `http://localhost:${PORT}`;

const PATHS = [
  '/',
  '/articles',
  '/devlog/1-platform-setup',
  '/isomon/1-building-the-first-node',
  '/geo/1-what-is-geo-and-why-higher-ed-needs-it-now',
  '/tfp/00-introduction-friction-principle',
  '/resources',
  '/search',
  '/accessibility',
];

const THEMES = ['light', 'dark'];

const server = httpServer.createServer({ root: 'dist', cache: -1 });
await new Promise((r) => server.listen(PORT, r));
console.log(`serving dist/ at ${ORIGIN}`);

const findings = [];
const summary = [];

try {
  for (const theme of THEMES) {
    for (const path of PATHS) {
      const url = `${ORIGIN}${path}`;
      process.stdout.write(`  ${theme.padEnd(5)}  ${path.padEnd(60)} `);
      try {
        const result = await pa11y(url, {
          standard: 'WCAG2AA',
          runners: ['axe', 'htmlcs'],
          chromeLaunchConfig: { args: ['--no-sandbox', '--disable-setuid-sandbox'] },
          beforeScript: (page) => page.evaluateOnNewDocument((t) => {
            try { localStorage.setItem('ss-theme', t); } catch {}
          }, theme),
          timeout: 45000,
          wait: 500,
        });
        const errors = result.issues.filter((i) => i.type === 'error');
        const warnings = result.issues.filter((i) => i.type === 'warning');
        process.stdout.write(`${errors.length} err, ${warnings.length} warn\n`);
        summary.push({ theme, path, errors: errors.length, warnings: warnings.length });
        for (const issue of result.issues) {
          findings.push({ theme, path, ...issue });
        }
      } catch (err) {
        process.stdout.write(`FAIL: ${err.message}\n`);
        summary.push({ theme, path, errors: -1, warnings: -1, error: err.message });
      }
    }
  }
} finally {
  server.close();
}

writeFileSync('a11y-report.json', JSON.stringify({ summary, findings }, null, 2));

// Markdown table
console.log('\n## Summary\n');
console.log('| theme | path | errors | warnings |');
console.log('| --- | --- | ---: | ---: |');
for (const s of summary) {
  const e = s.error ? `**ERR** ${s.error}` : s.errors;
  console.log(`| ${s.theme} | ${s.path} | ${e} | ${s.warnings} |`);
}

// Group findings by (code, message) across theme/path
const byRule = new Map();
for (const f of findings.filter((x) => x.type === 'error')) {
  const key = `${f.code}`;
  if (!byRule.has(key)) byRule.set(key, { code: f.code, message: f.message, hits: [] });
  byRule.get(key).hits.push({ theme: f.theme, path: f.path, selector: f.selector, context: f.context });
}

console.log('\n## Unique error rules\n');
for (const rule of byRule.values()) {
  console.log(`### ${rule.code}`);
  console.log(`> ${rule.message}\n`);
  for (const h of rule.hits.slice(0, 5)) {
    console.log(`- [${h.theme}] \`${h.path}\` — \`${h.selector}\``);
  }
  if (rule.hits.length > 5) console.log(`- ...and ${rule.hits.length - 5} more`);
  console.log();
}

const totalErrors = summary.reduce((n, s) => n + Math.max(s.errors, 0), 0);
process.exit(totalErrors > 0 ? 1 : 0);
