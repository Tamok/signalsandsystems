# Research & citation workflow

How research flows from an external source into a published article, and
from an article into the site-wide `/resources` pages. This is the
authoritative description — changes to `<CitedText>`, the aggregator, or
the resources pages must update this file.

## The pieces

| Piece | Path | Role |
| --- | --- | --- |
| `<CitedText>` component | [src/components/ui/CitedText.astro](../src/components/ui/CitedText.astro) | Inline citation marker inside article prose |
| Aggregator | [scripts/aggregate-citations.ts](../scripts/aggregate-citations.ts) | Parses every `.mdx` in `src/content/`, collects every `<CitedText>` node, dedupes, writes the consolidated JSON |
| Schema | [src/data/citations.schema.ts](../src/data/citations.schema.ts) | zod schema the aggregator validates against before writing |
| Consolidated JSON | [src/data/consolidated-citations.json](../src/data/consolidated-citations.json) | Single source of truth read by resources pages — **committed, regenerate when citations change** |
| Global resources page | [src/pages/resources.astro](../src/pages/resources.astro) | Site-wide deduped citation list |
| Series resources pages | [src/pages/series/[slug]/resources.astro](../src/pages/series/%5Bslug%5D/resources.astro) | Per-series citation list |
| Private research notes | `src/content/<collection>/_resources/` | **Gitignored.** Local-only PDFs, raw notes, working files |

## `<CitedText>` prop contract

```mdx
<CitedText
  type="statistic"
  author="Sparrow, B., et al."
  year="2011"
  title="Google effects on memory"
  source="NIH"
  url="https://pubmed.ncbi.nlm.nih.gov/21764755/"
>
  The visible quoted or paraphrased text
</CitedText>
```

All props are optional string literals. The aggregator only captures
string-valued attributes — `{expression}`-valued props are intentionally
skipped so it never picks up values that only exist at runtime.

| Prop | Purpose |
| --- | --- |
| `type` | One of `statistic`, `quote`, `fact`, `projection`, `book`. Drives visual styling. Defaults to `fact`. |
| `author` | Authors, in the form you want displayed — "Lastname, F." or "Org Name". |
| `year` | Publication year as a string, not a number. |
| `title` | Work title. Used together with `url` as the dedup key — same `title`+`url` = same citation across articles. |
| `source` | Publisher / venue / outlet name. |
| `url` | Canonical link. Presence of a `url` makes the citation clickable. |
| `publication` | Journal or book the work appeared in, if different from `source`. |
| `citationId` | Rarely needed. Override the auto-generated DOM id. |

The children of `<CitedText>` (the visible text) are **not** stored in the
consolidated JSON — they're rendered inline in the article and nowhere
else. If you need the quote preserved in the citation record, duplicate it
into a `quote` prop.

## Adding a citation

1. Write the prose in the `.mdx` file, wrapping the relevant phrase in
   `<CitedText …>`. Import `CitedText` at the top of the file if it isn't
   already imported — there is no global MDX component registry.
2. Regenerate the consolidated JSON:
   ```sh
   pnpm tsx scripts/aggregate-citations.ts
   ```
3. Commit **both** the edited article and the updated
   `src/data/consolidated-citations.json` in the same commit. The JSON is
   the cached source of truth for `/resources`; divergence is a bug.

The aggregator is deterministic — running it twice with no content changes
produces byte-identical output (modulo the `lastUpdated` timestamp).

## Deduplication rules

Two `<CitedText>` nodes are collapsed into a single record when they
agree on:

- `title` + `url` (preferred), OR
- `title` + `author` (when no `url` is present)

When two records collide but disagree on an individual field, the
aggregator keeps the longer string (assumes more complete). `tags` are
unioned across all occurrences. If two citations look identical but end
up as separate records, check for whitespace differences, unicode
lookalikes in the title, or a missing/extra `url`.

## What the aggregator skips

- Files under any path segment starting with `_` — i.e.
  `_ARTICLE_TEMPLATE.mdx` and `_resources/` research notes.
- Drafts (`draft: true` in frontmatter).
- The `series` collection (those are JSON data files, not articles).
- Files outside `.mdx` / `.md` extensions. Citation tags inside fenced
  code blocks or template literals are correctly ignored because the
  aggregator walks the MDX AST, not raw text.

## Private research notes: `_resources/` convention

Each content collection may contain a `_resources/` subdirectory for
PDFs, raw downloads, annotated notes, and other working files. The
convention is:

- `src/content/<collection>/_resources/` is gitignored across every
  collection (see [.gitignore](../.gitignore)).
- The aggregator ignores any path segment starting with `_`, so notes
  inside `_resources/` are never walked as article content.
- Nothing in `_resources/` is shipped in `dist/`.

Treat these directories as your private workbench. When you're ready to
cite a source from there, add a `<CitedText>` tag in the relevant article
with the source's bibliographic details — don't reference the local file
path.

## `/resources` rendering

- `/resources` — global, deduplicated list across every series. Backed
  by [GlobalCitationList.astro](../src/components/ui/GlobalCitationList.astro).
- `/series/<slug>/resources` — only citations used in that series.
  Backed by [SeriesCitationList.astro](../src/components/ui/SeriesCitationList.astro).

Both pages read the same `consolidated-citations.json` at build time —
there is no client-side fetch or runtime query. A citation only appears
on a resources page if the aggregator has been re-run after the citation
was added.

## Troubleshooting

- **My new citation isn't on `/resources`.** Re-run the aggregator and
  recommit the JSON.
- **Two identical-looking citations show up as separate entries.** They
  differ in at least one of `title`, `url`, or `author`. Inspect both
  `<CitedText>` nodes and align the fields.
- **Aggregator fails with "Failed to parse MDX".** You have a syntax
  error somewhere in the named file — usually a stray `<`/`>` that looks
  like a JSX tag but isn't. Either escape it (`&lt;`), wrap it in a code
  block, or reword.
- **Aggregator fails with a zod error at the write step.** Schema drift.
  Either the schema needs updating for a new `<CitedText>` prop or the
  aggregator produced a malformed record — read the zod path in the
  error message to locate it.
