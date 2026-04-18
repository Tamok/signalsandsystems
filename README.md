# Signals & Systems

[![Typecheck](https://github.com/Tamok/signalsandsystems/actions/workflows/typecheck.yml/badge.svg)](./.github/workflows/typecheck.yml)
[![Validate content](https://github.com/Tamok/signalsandsystems/actions/workflows/validate.yml/badge.svg)](./.github/workflows/validate.yml)
[![Deploy](https://github.com/Tamok/signalsandsystems/actions/workflows/deploy.yml/badge.svg)](./.github/workflows/deploy.yml)
[![Accessibility (advisory)](https://github.com/Tamok/signalsandsystems/actions/workflows/a11y.yml/badge.svg)](./.github/workflows/a11y.yml)

A personal, self-hosted publishing platform for long-form articles with
interactive MDX components. Astro 5 + MDX + Tailwind v4, deployed to GitHub
Pages. Zero hydration by default, partial hydration where it's earned.

## Quick start

```sh
pnpm install
pnpm dev          # localhost:4321
pnpm build        # production build to ./dist/ (runs Pagefind via postbuild)
pnpm preview      # serve the build locally
pnpm astro check  # type-check Astro + TS
pnpm validate     # full content validation (frontmatter, MDX compile, links)
pnpm validate:changed  # only files that differ from origin/main (CI-speed)
pnpm tsx scripts/aggregate-citations.ts  # rebuild consolidated-citations.json
```

Requires Node 20 and pnpm 10. There is no separate test runner — "tests"
means `astro check` + `pnpm validate` + manual dev-server verification.

## Where things live

- [CONTRIBUTING.md](./CONTRIBUTING.md) — editorial workflow and PR checklist.
- [COMPONENTS.md](./COMPONENTS.md) — component index.
- [CHANGELOG.md](./CHANGELOG.md) — timestamped feature log.
- [NEXT-STEPS.md](./NEXT-STEPS.md) — roadmap.
- [docs/](./docs/) — topic docs. See especially:
  - [docs/research-workflow.md](./docs/research-workflow.md) — citation pipeline.
  - [docs/maintainer-setup.md](./docs/maintainer-setup.md) — one-time GitHub config.
  - [docs/adr/](./docs/adr/) — architectural decision records.

## Architecture in one paragraph

Content lives in typed Astro collections (`devlog`, `isomon`, `geo`, `tfp`
for articles, `series` for series metadata). A single dynamic route at
[src/pages/[collection]/[slug].astro](./src/pages/%5Bcollection%5D/%5Bslug%5D.astro)
handles every article, iterating an `ARTICLE_COLLECTIONS` tuple defined in
[src/utils/collections.ts](./src/utils/collections.ts). Cross-collection
queries go through [src/utils/content.ts](./src/utils/content.ts). Inline
citations are authored as `<CitedText>` MDX components and aggregated at
build time into [src/data/consolidated-citations.json](./src/data/consolidated-citations.json).
Layouts form a three-layer stack: `BaseLayout` (head, nav, footer) →
`ArticleLayout` (chrome, author bio, series nav) → MDX content.

## Author

**Jonathan Engeln (JELL)** — writing at the intersection of AI, higher
education, and ethical technology.

- GitHub: [github.com/Tamok](https://github.com/Tamok)
- LinkedIn: [linkedin.com/in/jonathan-engeln](https://www.linkedin.com/in/jonathan-engeln/)
