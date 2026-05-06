# Maintainer setup

One-time GitHub configuration the repo owner sets up in the UI. These are the
settings that can't live in a file on `main`.

## Branch protection for `main`

Settings → Branches → Add branch ruleset → target `main`:

- **Require a pull request before merging**
  - Required approvals: 1 (once co-ownership exists; keep at 0 while solo)
  - Dismiss stale reviews on new commits: on
  - **Require review from Code Owners**: on (matches [CODEOWNERS](../.github/CODEOWNERS))
- **Require status checks to pass before merging**, required checks:
  - `Typecheck / astro-check` (from [typecheck.yml](../.github/workflows/typecheck.yml))
  - `Validate content / validate` (from [validate.yml](../.github/workflows/validate.yml))
  - `Accessibility audit / a11y` (from [a11y.yml](../.github/workflows/a11y.yml)) - blocking as of 2026-05-06
- **Require branches to be up to date before merging**: on
- **Require linear history**: on (keeps `git log --oneline` clean)
- **Do not allow bypassing the above settings**: on
- **Restrict deletions**: on
- **Require signed commits**: owner's call

## Auto-request Copilot review on every PR

Two pieces have to be in place:

1. **GitHub Copilot code review enabled for the repo**. Settings → Code & automation
   → Copilot → enable "Copilot code review". Available on repos covered by a
   Copilot Pro/Business/Enterprise license.
2. **The auto-request workflow at
   [.github/workflows/auto-request-review.yml](../.github/workflows/auto-request-review.yml)**
   fires on every `pull_request: opened|reopened|ready_for_review` and adds
   `copilot-pull-request-reviewer[bot]` as a reviewer. The workflow is
   idempotent; re-requesting on an existing review is a no-op.

When both are on, Copilot leaves comments within ~30 seconds of PR open.

## Working on branches (no direct pushes to main)

The day-to-day flow:

```sh
git checkout -b <type>/<short-slug>     # e.g. fix/code-block-contrast
# work, commit
git push -u origin <type>/<short-slug>
gh pr create --title "..." --body "..."
# wait for typecheck + validate + a11y + Copilot review
gh pr merge --squash --delete-branch    # after green + addressed comments
```

Branch name conventions match the commit-style prefixes already in use
([CONTRIBUTING.md](../CONTRIBUTING.md)): `feat/`, `fix/`, `chore/`, `docs/`,
`refactor/`. One concern per branch keeps reviews scoped.

## CODEOWNERS

[CODEOWNERS](../.github/CODEOWNERS) is the source of required-reviewer assignment.
When a co-owner joins, add their handle there in the same line:

```
* @Tamok @co-owner-handle
```

After that change lands, branch protection will automatically require a review
from a code owner on every PR.

## Secrets

The deploy workflow uses `GITHUB_TOKEN` only (injected automatically). No
secrets need to be provisioned. If you add external services later (analytics,
newsletter API etc.), document them here.

## GitHub Pages

Settings → Pages → Source: **GitHub Actions** (not "Deploy from a branch").
[deploy.yml](../.github/workflows/deploy.yml) handles upload + deploy.
