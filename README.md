# Port

Sebastian Noel's portfolio, built with Next.js, React, and TypeScript.

## Development

Use the Node version in `.node-version`, then run:

```sh
npm ci
npm run dev
```

Run formatting, lint, type checking, and a production build before review:

```sh
npm run format:check
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm test
```

Playwright starts the production server. CI also audits production dependencies and saves browser evidence for seven days.

## Current review

PR #5 contains the first portfolio draft. The home page contains a typed-name splash, a subtle tile field, a blank typing-game area, and compact work links. Projects use a searchable catalog; experiences use chronological cards. Resume links open the supplied, contact-free PDF in a new tab.

All content remains draft and all previews remain noindex until the first launch is approved. No ranked game, analytics, or production deployment is enabled. See [content and media](docs/content.md) for authoring conventions.

Sebastian accepted the revised design as a first draft, with polish still ahead. See the [project plans](agents/README.md) and [progression checklist](agents/planning/progression.md). Routine changes use GitHub Issues and PRs into `dev`. Codex may merge reviewed non-experimental PRs into `dev` after CI passes. Sebastian reviews the `dev` preview and explicitly approves each release before it moves into `main`. Experimental changes require separate approval.
