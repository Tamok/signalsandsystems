# Next steps

Roadmap after the April 2026 revival. Concrete work items live in
[GitHub Issues](https://github.com/Tamok/signalsandsystems/issues),
grouped by [milestone](https://github.com/Tamok/signalsandsystems/milestones).
This file is a thin pointer: it describes the strategy and links to the
milestone where each piece of work lives. Issues are the source of truth
for status; this file rots if it tries to reproduce them.

## Strategy

The April 2026 revival landed the platform's foundation:
DRY content pipeline, dark mode, citation system, blocking CI for
typecheck + content validation + accessibility, branch + PR + auto
Copilot review workflow. Beyond that, the next year's work falls into
four loose buckets:

- **Reach**: get the content out where readers already are. Feeds and
  a comment layer.
- **Rigor**: every claim in a future article rooted in a verified
  source we can re-check, with the citation system aware of every
  source we considered (not just the cited ones).
- **Hygiene**: small recurring drift caught durably, not by manual
  vigilance. Validate rules, rendered-color smoke tests, ID collision
  prevention.
- **Authoring**: faster, more correct article shipping. Image
  pipeline, alt-text validation, update-history surfacing.

Each maps to a milestone:

- [Distribution & Engagement](https://github.com/Tamok/signalsandsystems/milestone/1)
  for Reach
- [Deep Research Stack v0](https://github.com/Tamok/signalsandsystems/milestone/2)
  for Rigor (heaviest milestone; phase 1 is research itself)
- [Hygiene & Test Infrastructure](https://github.com/Tamok/signalsandsystems/milestone/3)
  for Hygiene
- [Content Pipeline](https://github.com/Tamok/signalsandsystems/milestone/4)
  for Authoring

Items not yet milestoned: co-ownership onboarding (governance),
newsletter template automation (when the buttondown integration
becomes load-bearing), interactive learning paths and webmentions
(speculative until there's clear demand).

## Maintenance cadence

Ongoing:

- Dependency bumps via Renovate or manual review.
- Quarterly link-rot audit using `pnpm validate` on main.
- CHANGELOG hygiene: every user-visible PR adds an entry.
- Roadmap review: revisit this file every 2-3 months and the
  milestones quarterly. Closed milestones move to
  [CHANGELOG.md](./CHANGELOG.md) under a "Milestone closed" entry.

---

Pre-revival planning notes are at the bottom of
[CHANGELOG.md](./CHANGELOG.md) under "Pre-revival". Working notes for
in-flight devlogs live in `src/content/devlog/_resources/` (gitignored).
