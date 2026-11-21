# Port project instructions

Port is Sebastian Noel’s portfolio. Work through GitHub Issues and use pull requests into `dev` for routine changes. `main` is the production branch. Share the exact `dev` preview and wait for Sebastian’s explicit approval before merging a release into `main`.

If the planning directory is available, read [agents/AGENTS.md](agents/AGENTS.md) and start from the first unchecked milestone in [progression.md](agents/planning/progression.md). Keep private contact information, original assets, and secrets out of the public repository.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
