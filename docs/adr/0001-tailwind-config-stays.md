# ADR 0001 — Keep `tailwind.config.mjs`, defer the `@theme` migration

- **Status:** Accepted
- **Date:** 2026-04-17
- **Context:** M7 of the revival plan flagged [tailwind.config.mjs](../../tailwind.config.mjs)
  as a migration candidate. Tailwind v4 encourages CSS-first theming via `@theme`
  blocks in [src/styles/global.css](../../src/styles/global.css).

## Decision

Keep [tailwind.config.mjs](../../tailwind.config.mjs) as the source of typography
and theme customizations for now. Defer migrating its contents into `@theme`
until M8 (dark mode), where we'll be touching the color palette anyway and can
do the conversion in one coherent pass.

## Rationale

- The config file carries real customizations (`@tailwindcss/typography` prose
  tuning, font-family declarations). Porting them is aesthetic, not load-bearing.
- Tailwind v4 supports both approaches side-by-side. The `@tailwindcss/vite`
  plugin in [astro.config.mjs](../../astro.config.mjs) honors
  `tailwind.config.mjs` without friction.
- M8 will introduce dark-mode tokens. Doing the migration at that time keeps
  the palette and the typography changes in one commit rather than bifurcating
  the theme across two files for an interim milestone.

## Consequences

- **Pro:** Less churn during the revival; one diff to review instead of two.
- **Pro:** M8 gets a blank slate in `@theme` rather than a half-migrated one.
- **Con:** Readers new to Tailwind v4 may expect CSS-first theming by default.
  The config file's presence is documented in
  [CONTRIBUTING.md](../../CONTRIBUTING.md) (added in M9).

## Revisit

Revisit once M8 lands. If the `@theme` migration doesn't happen alongside dark
mode, log a follow-up issue rather than letting this decision rot.
