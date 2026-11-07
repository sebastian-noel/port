# Sebastian's Portfolio Site

## Local development

Use the Node.js version in [`.node-version`](.node-version).

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). Run `npm run format:check`,
`npm run lint`, `npm run typecheck`, and `npm run build` before opening a PR.

After building, run `npx playwright install chromium` and `npm test` for browser
and content checks. The tests start their own production server on port 3000.
CI installs Chromium and its system dependencies automatically.

See [content authoring](docs/content.md) for adding projects, experiences, and
reviewed media. Draft previews stay non-indexable until the launch review.

Use `dev` for integration and `main` for production releases.
