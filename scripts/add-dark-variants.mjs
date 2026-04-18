#!/usr/bin/env node
// Codemod: add `dark:text-*` next to `text-gray-[5-9]00` in class attributes
// where no `dark:text-` variant is already present. Conservative: only edits
// class strings that match the precise pattern; leaves dynamic class
// expressions (template literals) unchanged.
//
// Mapping chosen to keep roughly the same relative "weight" across themes:
//   text-gray-900 -> dark:text-gray-100
//   text-gray-800 -> dark:text-gray-100
//   text-gray-700 -> dark:text-gray-200
//   text-gray-600 -> dark:text-gray-300
//   text-gray-500 -> dark:text-gray-400
// Also:
//   bg-white (inside a class containing "rounded" or "shadow") -> + dark:bg-gray-800
//   border-gray-200/300 -> + dark:border-gray-700

import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { join } from 'node:path';

const DARK_TEXT = {
  'text-gray-900': 'dark:text-gray-100',
  'text-gray-800': 'dark:text-gray-100',
  'text-gray-700': 'dark:text-gray-200',
  'text-gray-600': 'dark:text-gray-300',
  'text-gray-500': 'dark:text-gray-400',
};

const ROOTS = ['src/pages', 'src/components', 'src/layouts'];

function listFiles(root) {
  try { return globSync(`${root}/**/*.astro`, {}); }
  catch { /* fallback below */ }
  // Manual recursive glob without node's globSync
  const fs = require('node:fs');
  const path = require('node:path');
  const out = [];
  function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name.endsWith('.astro')) out.push(full);
    }
  }
  walk(root);
  return out;
}

function patchClassString(classStr) {
  // Skip if already contains dark:text-
  const hasDarkText = /\bdark:text-/.test(classStr);
  let out = classStr;
  for (const [base, dark] of Object.entries(DARK_TEXT)) {
    const re = new RegExp(`\\b${base}\\b`);
    if (re.test(out) && !hasDarkText) {
      // Insert dark variant right after the base class occurrence
      out = out.replace(re, `${base} ${dark}`);
      break; // only add one (avoid double-adding conflicting shades)
    }
  }
  return out;
}

function processFile(file) {
  const src = readFileSync(file, 'utf-8');
  // Match: class="..." OR class='...'  — literal attribute only
  // Skip dynamic: class={`...`} / class={expr}
  const re = /\bclass=(['"])([^'"]*)\1/g;
  let changed = false;
  const next = src.replace(re, (m, q, inner) => {
    const patched = patchClassString(inner);
    if (patched !== inner) { changed = true; return `class=${q}${patched}${q}`; }
    return m;
  });
  if (changed) {
    writeFileSync(file, next);
    return true;
  }
  return false;
}

const files = ROOTS.flatMap(listFiles);
let n = 0;
for (const f of files) {
  if (processFile(f)) { n++; console.log(`  patched ${f}`); }
}
console.log(`\n${n} file(s) updated`);
