# Next steps

Roadmap after the April 2026 revival. Ship what moves the platform
forward, leave dead branches pruned. Groupings are loose — if a Medium
item is cheap and a Short item is expensive, reorder without guilt.

## Post-revival follow-ups (next few sessions)

1. **Flip a11y gate from advisory to blocking.**
   - Remove `continue-on-error: true` from
     [.github/workflows/a11y.yml](./.github/workflows/a11y.yml).
   - Add `a11y` to `needs:` of `build` in
     [.github/workflows/deploy.yml](./.github/workflows/deploy.yml).
   - Add `Accessibility audit / a11y` to required status checks per
     [docs/maintainer-setup.md](./docs/maintainer-setup.md).
   - Blocker: fix findings from the first few advisory runs.

2. ~~**Dark mode contrast re-audit.**~~ Done 2026-04-18 — local
   two-theme audit via `pnpm a11y` (pa11y × {light, dark} × 9 URLs)
   surfaced the dark-mode-invisible text on home, article, and
   accessibility pages (`text-gray-800/900` without `dark:` variants).
   Fixed via `scripts/add-dark-variants.mjs` codemod across 29 files.
   Also fixed CI Chrome sandbox failure (`.pa11yci.json` passes
   `--no-sandbox`) and search input missing aria-label.

   Known remaining findings, carried as follow-ups:
   - ~~Shiki code-block inline styles fail contrast in one or both themes~~ resolved via `needsFurtherReview` filtering; actual Shiki CSS-var tokens are not WCAG failures (confirmed by Devlog #11 audit). Also discovered: the `.astro-code` activation selector was stale for Astro 5 (now `.shiki`); fixed in `global.css` so token colors actually apply in light mode.
   - ~~WiringSchematic SVG inline `<style>` / `<text>` element fills~~ fixed 2026-04-23: styles moved to global.css, `color:` mirrors `fill:` on all SVG text classes.
   - Citation list `list` / `nested-interactive` rule failures need
     a drawer-toggle refactor (move `role="button"` off `<li>`).
   - Article cards stay `bg-white` in dark mode by design; the
     in-card `text-gray-600` is fine on white but flagged as a
     false positive in the dark audit.
   - Chart gradient IDs (`#gradient-0`, `#gradient-1`) duplicate when
     multiple charts render on one page. Needs per-instance unique IDs.

   Post-revival follow-up landed 2026-04-18: `pnpm a11y` is now the
   CI audit runner (pa11y-ci couldn't override Chromium
   `prefers-color-scheme` to force a light baseline; our script
   seeds theme via localStorage + `evaluateOnNewDocument` so both
   themes are actually covered). SeriesNav prev/next and the
   Subscribe popup gained missing `dark:bg-*`/`dark:border-*`
   variants in the same pass.

3. ~~**ScatterChart TypeScript warnings.**~~ Done 2026-04-18 — tooltip
   callbacks were dead code (stripped by JSON.stringify), removed.

4. ~~**Tailwind `@theme` migration (per ADR 0001).**~~ Done 2026-04-18 —
   `@plugin "@tailwindcss/typography";` in global.css, typography
   customizations migrated, `tailwind.config.mjs` deleted. See ADR 0001
   update.

## Short-term (next 2–3 sessions)

1. **RSS + Atom feeds.**
   - Site-wide feed and per-series feeds under
     `/series/<slug>/feed.xml`. Autodiscovery links in
     [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro).

2. **Comment system.**
   - Giscus is the lowest-friction option (GitHub Discussions backed,
     no server). Evaluate before committing.

3. **Shiki theme switching for dark mode.**
   - Currently a single Shiki theme with a CSS-overlay `.dark`
     background. Investigate a CSS-variable-based Shiki setup so the
     syntax colors themselves adapt.

4. **Alt-text audit for article images.**
   - Coverage is inconsistent per the accessibility page's known-gaps
     list. Walk `src/content/**/*.mdx` and flag `<img>` / `![]()`
     without meaningful alt text.

## Medium-term (1–2 months)

1. **Image optimization pipeline.**
   - Astro's `astro:assets` integration for automatic responsive
     `srcset`. Currently every cover image is hand-authored SVG — keep
     those, but photos in articles should be pipelined.

2. **Per-article update history.**
   - Surface the `updatedDate` frontmatter field in article chrome and
     expose diffs via GitHub's blame for the MDX file.

3. **Co-ownership onboarding.**
   - Identify co-owner, update [.github/CODEOWNERS](./.github/CODEOWNERS),
     bump branch-protection required approvals to 1.

4. **Newsletter template automation.**
   - [buttondown-templates/](../buttondown-templates/) lives at the repo
     root. Consider a CLI in [scripts/](./scripts/) that generates a
     newsletter issue from a published article's MDX + frontmatter.

## Long-term (3+ months)

- **Interactive learning paths** for series-style content — reader
  progress tracking, optional quizzes at chapter boundaries. Requires
  identity (likely via GitHub OAuth).
- **Webmentions / IndieWeb integration** — accept webmentions on
  articles, surface them inline or in a footer section.
- **Internationalization** — Astro's i18n routing with per-locale
  content collections. Gated on whether any content actually needs
  translation.

## Maintenance cadence

Ongoing:

- Dependency bumps via Renovate or manual review.
- Quarterly link-rot audit using `pnpm validate` on main.
- CHANGELOG hygiene: every user-visible PR adds an entry.
- Roadmap review: revisit this file every 2–3 months; move completed
  items to [CHANGELOG.md](./CHANGELOG.md).

---

Legacy notes preserved from pre-revival planning are at the bottom of
[CHANGELOG.md](./CHANGELOG.md) under "Pre-revival". Old draft content
for Devlog #3 that previously lived in this file has been moved into
that article's working notes (`src/content/devlog/_resources/`, which
is gitignored).
