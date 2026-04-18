# Maintainer setup

One-time setup a repo owner needs to do on GitHub — the bits that can't live
in a file on `main`.

## Branch protection for `main`

Settings → Branches → Add branch ruleset → target `main`:

- **Require a pull request before merging**
  - Required approvals: 1 (once co-ownership exists; keep at 0 while solo)
  - Dismiss stale reviews on new commits: on
- **Require status checks to pass before merging** — required checks:
  - `Typecheck / astro-check` (from [typecheck.yml](../.github/workflows/typecheck.yml))
  - `Validate content / validate` (from [validate.yml](../.github/workflows/validate.yml))
  - Do **not** add the `Accessibility audit (advisory) / a11y` job yet. Flip
    it to required after the post-M9 follow-up PR removes
    `continue-on-error: true` from [a11y.yml](../.github/workflows/a11y.yml).
- **Require branches to be up to date before merging**: on
- **Require linear history**: on (optional; keeps `git log --oneline` clean)
- **Do not allow bypassing the above settings**: on
- **Restrict deletions**: on
- **Require signed commits**: owner's call

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

## Advisory → blocking a11y gate

After the post-M9 a11y cleanup:

1. In [a11y.yml](../.github/workflows/a11y.yml), remove `continue-on-error: true`.
2. In [deploy.yml](../.github/workflows/deploy.yml), add `a11y` to `needs:` for
   `build`.
3. Add `Accessibility audit / a11y` to the required status checks in branch
   protection.
