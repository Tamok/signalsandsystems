# ADR 0002 — `sastro/` stays as a subdirectory of the repo

- **Status:** Accepted
- **Date:** 2026-04-17
- **Context:** The git repository root is `signals-and-systems/`. The
  Astro project itself lives in [sastro/](../../). During the revival
  planning we weighed flattening `sastro/` to the repo root (one fewer
  `cd`, cleaner tooling paths) versus keeping it nested.

## Decision

Keep [sastro/](../../) as a subdirectory. The repo root is reserved for
top-level artifacts: `CLAUDE.md`, plan files, the `.git` boundary itself,
and potentially future sibling projects (newsletter tooling,
article-drafting scripts, etc.).

## Rationale

- The existing deploy workflow at
  [.github/workflows/deploy.yml](../../.github/workflows/deploy.yml)
  already points at `sastro/`. Flattening would require coordinated
  updates to every `working-directory:` key and breaks historical
  references in commits and docs.
- `persona.json`, `buttondown-templates/`, and scratch drafting tooling
  are author-facing assets that don't belong inside the Astro project
  itself. Keeping `sastro/` nested gives them an obvious home without
  polluting Astro's source tree.
- The pnpm store and lockfile scope remain clean. Moving the Astro
  project to root would imply either committing tooling configs for the
  siblings at root too, or having them live in inconsistent locations.
- Contributors working exclusively on the site cd once and stay there.
  The one-line guidance in [README.md](../../README.md) ("run all
  `pnpm` commands from `sastro/`") is cheap to communicate.

## Consequences

- **Pro:** Room to add sibling projects (newsletter, draft tooling,
  article-writing scripts) at the repo root without restructuring.
- **Pro:** CI workflows keep a stable `working-directory: sastro`
  contract.
- **Con:** Contributors have to remember to `cd sastro` after cloning.
  Mitigated by documenting the convention prominently in
  [CONTRIBUTING.md](../../CONTRIBUTING.md) and [README.md](../../README.md).
- **Con:** `pnpm` commands from the repo root won't work. This is
  surfaced quickly by pnpm's own error output.

## Revisit

Revisit if a second Astro project is ever added (unlikely), or if the
sibling tooling shrinks to the point where flattening is a net
simplification.
