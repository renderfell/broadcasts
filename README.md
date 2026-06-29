# Broadcasts

Watch multiple broadcasts in a customizable grid.

## Development

```bash
npm install
npm run dev
```

- `npm run build` — production build
- `npm run lint`
- `npm run format`
- `npm run release` — run semantic-release locally (dry-run recommended: `npx semantic-release --dry-run`)

## Conventional Commits

This project uses **Conventional Commits** (enforced via commitlint + husky).

- `feat:` → minor release
- `fix:` → patch release
- `feat!:` or `BREAKING CHANGE:` → major release
- `chore:`, `docs:`, `refactor:`, `test:`, etc. → no version bump (unless they contain breaking)

**PR titles must follow this format** for clean releases.

## Release Process (Automated)

Releases are fully automated with **semantic-release**:

1. Open a PR to `main` (from a feature branch).
2. **Squash merge** is the only allowed merge method (enforced at repository level). The squash commit message = PR title (keeps history clean).
3. On push to `main`:
   - GitHub Actions runs semantic-release.
   - If commits since last release warrant a new version → bumps `package.json`, creates a Git tag + GitHub Release.
   - **Only if a new release is published**, the workflow then builds and deploys to GitHub Pages (via `gh-pages`).

Workflow file: `.github/workflows/release.yml`

### Manual / Local Testing

```bash
# See what semantic-release would do (without publishing)
npx semantic-release --dry-run
```

You need a `GITHUB_TOKEN` with proper scopes for full runs.

## GitHub Pages

The site is deployed to: https://renderfell.github.io/broadcasts/

Deploy happens **conditionally** only on successful semantic releases.

## Project Scripts

| Script  | Description                      |
| ------- | -------------------------------- |
| dev     | Start dev server                 |
| build   | Vite production build            |
| lint    | ESLint                           |
| format  | Prettier                         |
| release | Run semantic-release             |
| deploy  | Manual deploy (build + gh-pages) |

## Requirements

- Node >= 22
- npm >= 10

## Notes

- Pre-push hook runs `npm run build` (ensures build is green before pushing).
- Husky + lint-staged for pre-commit quality.
- Squash merges + conventional PR titles ensure semantic-release works reliably without polluting git history.
