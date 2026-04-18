# ADR 0003 — Series case is normalized in code, not in content

- **Status:** Accepted
- **Date:** 2026-04-17
- **Context:** Early ISOMON articles shipped with `series: "ISOMON"` in
  frontmatter (uppercase); later articles and the corresponding series
  JSON use `isomon` (lowercase). A build-time rewrite of existing
  frontmatter was considered during the M2 pipeline consolidation.

## Decision

Normalize `series` values **at query time** in
[src/utils/content.ts](../../src/utils/content.ts) by calling
`.toLowerCase()` when mapping article entries. Leave existing MDX
frontmatter untouched.

## Rationale

- Published URLs and external links reference content slugs, not series
  values. Rewriting frontmatter would require an audit of downstream
  consumers (series landing pages, citation aggregation, series nav)
  that already expect lowercase — inviting regressions for zero reader
  benefit.
- Git history for existing articles stays intact. Rename-swap commits
  in the TFP collection (M1) are already one "bisect hop" deep;
  layering a content-wide rewrite on top would make future bisects
  harder to read.
- Author ergonomics: future articles can use whatever case the author
  types. The normalizer at the query seam makes the whole pipeline
  case-insensitive from here out, so this isn't a trap that grows over
  time.
- `defineCollection` schemas don't have an opinion on case; zod can
  `.transform()` at parse time, but doing it in the query layer keeps
  the normalization in one place that's easy to grep for.

## Consequences

- **Pro:** No destructive edits to historical content.
- **Pro:** New articles are case-agnostic — frontmatter typos become
  harmless.
- **Con:** Anyone reading a raw `.mdx` file sees the un-normalized
  value. If they don't know about the seam, they might assume case
  matters.
- **Con:** Any new helper that queries the `series` field directly
  (bypassing [src/utils/content.ts](../../src/utils/content.ts)) must
  remember to normalize too.

## Mitigation for the second downside

Flagged in [CONTRIBUTING.md](../../CONTRIBUTING.md) under "Code
workflow": cross-collection queries must go through
[src/utils/content.ts](../../src/utils/content.ts), not `getCollection`
directly. The unified dynamic route enforces this by construction — it
never handles raw frontmatter.

## Revisit

Revisit if we ever add a case-sensitive integration (an external CMS,
a migration script) where the divergence would create ambiguity. In
that scenario, run a one-time migration and remove the runtime
normalizer.
