# Contributing

Thanks for working on Signals & Systems. This guide is the fast path from
clean clone to a confident first PR.

## Prerequisites

- Node 20
- pnpm 10
- Git configured with your name + email

## Local setup

```sh
pnpm install
pnpm dev
```

Dev server at `localhost:4321`. Hot reload covers MDX content, components,
and styles.

## Editorial workflow (writing an article)

1. **Pick a collection**: `devlog`, `isomon`, `geo`, or `tfp`. Each lives
   under [src/content/<collection>/](./src/content/) and shares one
   frontmatter schema (see [src/schemas/content.ts](./src/schemas/content.ts)).
2. **Copy the template**:
   ```sh
   cp src/content/devlog/_ARTICLE_TEMPLATE.mdx \
      src/content/<collection>/<number>-<slug>.mdx
   ```
   Each collection has its own `_ARTICLE_TEMPLATE.mdx`.
3. **Fill frontmatter**: `title`, `description`, `publishDate`, optional
   `series` (must match a series slug), `order`, `coverImage`, `tags`,
   `draft`. Drafts are excluded from production listings.
4. **Import components at the top of the MDX**. There is no global
   component registry - each MDX file imports what it needs. See
   [COMPONENTS.md](./COMPONENTS.md) for the catalog.
5. **Add citations inline** with `<CitedText>`. Full contract in
   [docs/research-workflow.md](./docs/research-workflow.md).
6. **Rebuild the citation index** after adding or editing `<CitedText>`:
   ```sh
   pnpm tsx scripts/aggregate-citations.ts
   ```
   Commit the resulting [src/data/consolidated-citations.json](./src/data/consolidated-citations.json)
   diff alongside the article.
7. **Preview**:
   ```sh
   pnpm dev
   ```
   For build-time features (Pagefind search, static path generation), use:
   ```sh
   pnpm build && pnpm preview
   ```
8. **Validate before pushing**:
   ```sh
   pnpm validate:changed
   ```

## Code workflow (components, utilities)

- **Add a new article collection** in two places:
  1. Register it in [src/content/config.ts](./src/content/config.ts).
  2. Add its slug to `ARTICLE_COLLECTIONS` in
     [src/utils/collections.ts](./src/utils/collections.ts).
  The unified dynamic route and every helper in
  [src/utils/content.ts](./src/utils/content.ts) will pick it up.
- **New component**: drop it in [src/components/](./src/components/),
  keep it server-rendered unless it genuinely needs JS, and add an entry
  to [COMPONENTS.md](./COMPONENTS.md) in the same PR.
- **Interactive component**: prefer `<script>` (Astro's directive-less
  script) over `client:*` islands. Existing islands are the exception.
- **Accessibility**: charts take a `description` prop that becomes
  `aria-label` and seeds an SR-only data table. Wiring schematics expose
  `<title>`/`<desc>` via `aria-labelledby`. Keep focus traps on dialogs;
  see [src/scripts/focusTrap.ts](./src/scripts/focusTrap.ts).

## Commit style

Follow the existing log: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`,
`style:`, `test:`. One-line subject, wrap body at ~72 chars. Reference
issues with `#123` when applicable.

Examples:
```
feat(tfp): add article 02 - designing for deliberation
fix(nav): restore focus to hamburger when closing mobile menu
chore: rebuild citation index after tfp/01 edits
```

## CI gates

Every PR runs three checks:

- `Typecheck / astro-check` - [.github/workflows/typecheck.yml](./.github/workflows/typecheck.yml)
- `Validate content / validate` - [.github/workflows/validate.yml](./.github/workflows/validate.yml)
- `Accessibility audit (advisory) / a11y` - [.github/workflows/a11y.yml](./.github/workflows/a11y.yml)
  (advisory - does not block merges yet)

Merging to `main` triggers [.github/workflows/deploy.yml](./.github/workflows/deploy.yml),
which reruns typecheck + full validate, builds the site, indexes Pagefind,
and deploys to GitHub Pages.

## PR checklist

Use the template at [.github/pull_request_template.md](./.github/pull_request_template.md).
At minimum:

- [ ] `pnpm validate:changed` green
- [ ] Previewed locally (dev or preview, depending on the change)
- [ ] Re-ran `scripts/aggregate-citations.ts` if `<CitedText>` changed
- [ ] Updated [CHANGELOG.md](./CHANGELOG.md) if user-visible
- [ ] Updated [COMPONENTS.md](./COMPONENTS.md) if adding a component

## Gotchas

- `persona.json` at the repo root is **gitignored but load-bearing** for
  article writing (voice/style source of truth). If it's missing locally,
  say so rather than inventing voice.
- `src/content/*/_resources/` is gitignored across every collection.
  Don't reference files there as if they ship with the repo.
- Files matching `*-clean.mdx` are excluded from typecheck via
  [tsconfig.json](./tsconfig.json) - they're scratch copies, not content.
- Dark mode: the pre-hydration script in
  [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro) runs
  before CSS paints. If you add chrome that reads `localStorage`, do it
  inline in the head to avoid FOUC.

## When in doubt

Open a draft PR early and ask. The validators, typecheck, and advisory
a11y report will surface most issues before a human reviews.
