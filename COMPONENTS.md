# Component index

Reference for every component and layout currently in
[src/](./src/). Each entry lists the file, what it does, props, and
any accessibility contract worth knowing. Keep this file in sync when
adding or modifying components - CI won't catch doc drift.

## Layouts

### [BaseLayout](./src/layouts/BaseLayout.astro)

Global head, skip-to-content link, consent dialog, pre-hydration theme
script, Nav/Footer slots, SubscribePopup.

**Props**
- `title?: string` - page title
- `description?: string` - meta description
- `ogImage?: string` - Open Graph image URL
- `canonicalURL?: URL | string` - defaults to `Astro.url`
- `includeSyntaxHighlighting?: boolean` - adds Fira Code + copyCode.js

**A11y:** skip link is the first focusable element on every page;
`<main id="main-content">` carries `tabindex="-1"` for skip targets.
Consent dialog uses `role="dialog"`, `aria-modal`, and a focus trap
wired via [src/scripts/focusTrap.ts](./src/scripts/focusTrap.ts).

### [ArticleLayout](./src/layouts/ArticleLayout.astro)

Chrome for individual articles - cover, metadata, author bio,
`<CitationList>`, series nav when applicable.

**Props:** same as BaseLayout plus `publishDate`, `updatedDate?`,
`coverImage?`, `series?`, `tags?`.

### [SeriesLayout](./src/layouts/SeriesLayout.astro)

Used by series landing pages (`/series/[slug]`), not by individual
articles.

## Site chrome

### [Nav](./src/components/Nav.astro)

Primary navigation, mobile menu, theme toggle.

**A11y:** mobile menu button exposes `aria-expanded`/`aria-controls`;
ESC and outside-click close the menu and restore focus to the button.
Theme toggle is a `<button>` with `aria-pressed` reflecting the active
theme, and `aria-label="Toggle dark mode"`.

### [Footer](./src/components/Footer.astro)

Footer nav, social links, policy links, "Cookie & Analytics
Preferences" button that reopens the consent dialog.

### [SGEO](./src/components/SGEO.astro)

Search and generative-engine optimization meta tags. Used by
privacy/cookies/accessibility pages.

**Props:** `title`, `description`.

## Article UI

### [AuthorBio](./src/components/AuthorBio.astro)

Author card (JELL) with GitHub/LinkedIn links. Rendered by
ArticleLayout at the end of each article.

### [SeriesNav](./src/components/SeriesNav.astro)

Previous/next navigation and full article list for series.

**Props:** `seriesTitle`, `seriesSlug`, `prevArticle`, `nextArticle`,
`allArticles`, `currentSlug`.

### [CalloutBox](./src/components/CalloutBox.astro)

Styled info/warning/error/tip/insight/stat/note/success/next callouts.

**Props:**
- `type: 'info' | 'warning' | 'error' | 'tip' | 'insight' | 'stat' | 'note' | 'success' | 'next'` (default: `'info'`)
- `title?: string` - overrides the per-type default title

Each variant has light and dark color tokens; see the per-type maps in
the source.

### [SubscribePopup](./src/components/SubscribePopup.astro)

Dismissible newsletter popup wired to the Buttondown form. Used once
in BaseLayout.

## Charts and diagrams

All chart components render Chart.js via Astro inline scripts (no
client islands). They accept a `description` prop used as
`aria-label` and to seed an SR-only data table.

### [ChartComponent](./src/components/ChartComponent.astro)

General-purpose Chart.js wrapper for line/bar/pie/doughnut.

**Props:** `type`, `data`, `title?`, `description?`, `height?`,
`width?`, `id?`, `options?`.

### [ChartWithData](./src/components/ChartWithData.astro)

Chart variant that renders a visible data table alongside the chart.
Used heavily in `tfp/02-designing-for-deliberation`.

### [DataChart](./src/components/DataChart.astro)

Chart variant used in GEO articles.

### [HeatmapChart](./src/components/HeatmapChart.astro)

Heatmap visualization used in TFP articles.

### [RadarChart](./src/components/RadarChart.astro)

Radar/spider chart used in TFP articles.

### [SankeyChart](./src/components/SankeyChart.astro)

Sankey flow diagram used in TFP articles.

### [ScatterChart](./src/components/ScatterChart.astro)

Scatter plot used in TFP articles. *(Known: 2 pre-existing
`implicitly any` warnings in the Chart.js callback signatures; tracked
for a future follow-up.)*

### [TimelineChart](./src/components/TimelineChart.astro)

Horizontal timeline chart used in TFP articles.

### [WiringSchematic](./src/components/WiringSchematic.astro)

Interactive SVG wiring schematic for electronics content.

**Props:** `title?`, `description?`, `width?`, `height?`, `id?`.

**A11y:** `<title>` and `<desc>` children are wired via
`aria-labelledby`; a `<details><summary>View as table</summary>` data
table alternative accompanies the SVG.

### [CodeBlock](./src/components/CodeBlock.astro)

Shiki-highlighted code block with copy-to-clipboard and optional line
numbers and filename header. Dark mode switches the background via
`.dark .code-block pre` rules in
[src/styles/global.css](./src/styles/global.css).

**Props:** `code`, `lang`, `filename?`, `theme?`, `showLineNumbers?`.

## Citation system

See [docs/research-workflow.md](./docs/research-workflow.md) for the
full authoring contract.

### [CitedText](./src/components/ui/CitedText.astro)

Inline `<CitedText>` component used in MDX to mark cited passages.

**Props:** `title`, `author?`, `year?`, `url?`, `source?`, `type?`,
`quote?`, `tags?`.

### [CitationItem](./src/components/ui/CitationItem.astro)

Single-citation drawer used by the list components.

**A11y:** real `<button>` toggle with keyboard parity, drawer animates
via height transitions, `aria-expanded` reflects open state.

### [GlobalCitationList](./src/components/ui/GlobalCitationList.astro)

All citations from [src/data/consolidated-citations.json](./src/data/consolidated-citations.json),
with tag filtering and sort (author / title / year). Rendered on
`/resources`.

### [SeriesCitationList](./src/components/ui/SeriesCitationList.astro)

Series-scoped citation list. Rendered on `/series/[slug]/resources`.

**Props:** `seriesSlug`.

### [CitationTagFilter](./src/components/ui/CitationTagFilter.astro)

Client-side tag filter shared by Global/SeriesCitationList.

**Props:** `tags`, `selectedTag?`, `filterKey`.

### [CitationList](./src/components/ui/CitationList.astro)

Auto-generated per-article citation list, built at render time from
`<CitedText>` occurrences on the page.

### [StatsDisplay](./src/components/ui/StatsDisplay.astro)

Stat grid used in GEO articles.

### [Quote](./src/components/ui/quote.astro)

Pull-quote component used across GEO and TFP articles.

## Utilities

### [src/utils/content.ts](./src/utils/content.ts)

Single entry point for cross-collection queries:
`getAllArticles`, `getAllSeries`, `getSeriesArticles`,
`getArticleBySlug`, `getSeriesBySlug`. All series values are lowercased
at query time per [ADR 0003](./docs/adr/0003-series-case-normalized-in-code.md).

### [src/utils/collections.ts](./src/utils/collections.ts)

The `ARTICLE_COLLECTIONS` tuple. Adding a new collection requires a
change here and in [src/content/config.ts](./src/content/config.ts) -
the unified dynamic route picks it up automatically.

### [src/schemas/content.ts](./src/schemas/content.ts)

Shared zod schemas (`articleFrontmatterSchema`,
`seriesFrontmatterSchema`) used both by `defineCollection` and by
`scripts/validate.ts`. Keep them in lockstep.

### [src/data/citations.schema.ts](./src/data/citations.schema.ts)

Zod schema for `consolidated-citations.json`. The aggregator validates
before writing.

### [src/scripts/focusTrap.ts](./src/scripts/focusTrap.ts)

Minimal focus-trap utility (no dependencies). Used by the consent
dialog; reusable for any modal that needs capture/restore semantics.

### [scripts/aggregate-citations.ts](./scripts/aggregate-citations.ts)

Walks the MDX AST for every `.mdx` under `src/content/`, collects
`<CitedText>` nodes, dedups, and emits the consolidated JSON.

### [scripts/validate.ts](./scripts/validate.ts)

Content validator: `--all` / `--changed` / `--file <path>` /
`--fuzzy-citation-check` / `--no-links` / `--json`.

## Pages

Only listing the ones whose behavior isn't obvious from the filename.

- [src/pages/[collection]/[slug].astro](./src/pages/%5Bcollection%5D/%5Bslug%5D.astro) -
  unified dynamic route, loops over `ARTICLE_COLLECTIONS`.
- [src/pages/search.astro](./src/pages/search.astro) - Pagefind UI.
  Index is built by `pnpm postbuild` → `pagefind --site dist`.
- [src/pages/resources.astro](./src/pages/resources.astro) - global
  citation list.
- [src/pages/series/[slug]/resources.astro](./src/pages/series/%5Bslug%5D/resources.astro)
  - per-series citation list.
- [src/pages/accessibility.astro](./src/pages/accessibility.astro) -
  accessibility statement. Keep claims honest; update when coverage
  changes.
