# Technical architecture and hosting

## Confirmed foundation

- Framework: Next.js.
- Launch hosting: Vercel Hobby. If Hobby limits become restrictive, evaluate AWS or Sebastian’s spare Mac mini against actual usage and the $0 budget.
- Backend: Supabase Free, including its Postgres database.
- Domain: `snoel.dev`, already purchased through Cloudflare.
- Budget: $0 for hosting and every additional service; no paid trials, plans, or automatic upgrades.
- Mobile use is part of every feature, not a later layout conversion.

## Selected foundation and proposed implementation

The backend provider is confirmed. Library choices, authentication method, and implementation details below remain proposals.

| Concern | Proposal | Why |
| --- | --- | --- |
| Language/router | TypeScript and Next.js App Router | Typed content and clear server/client boundaries |
| Styling | CSS variables and CSS Modules initially | Explicit design tokens and custom composition with few dependencies; Tailwind remains an option |
| Animation | CSS for small states; Motion for coordinated effects | One main animation system with reduced-motion support |
| Content | Validated local metadata plus trusted MDX | Add case studies without changing page layouts |
| Durable dynamic data | Postgres included in Supabase Free | Transactions for attempts, monthly winning scores, aggregates, and private analytics |
| Live data | Supabase Realtime on sanitized game state | Managed shared updates and reconnection without a custom socket service |
| Owner authentication | Supabase Auth, proposed GitHub sign-in | Reuse the provider with explicit owner authorization and no email-delivery dependency |
| Expiration/aggregation | Supabase Cron | Settle abandoned attempts and roll up analytics without browser dependence |
| Request protection | Host controls, atomic SQL limits, Cloudflare Turnstile | Protect public endpoints; tune limits against legitimate mobile use |
| Image delivery | Next.js Image and web-ready assets | Reserved sizes, responsive delivery, placeholders |
| Video/audio | YouTube embeds for demos, optimized local clips where selected, and compressed keyboard audio | Load demo players on demand, provide a thumbnail, description, and direct YouTube link if playback is unavailable, and measure bandwidth for local clips |

Pin compatible stable versions during setup and commit the lockfile. Do not invent version requirements from this plan. A package manager, icon set, exact font, and validation library can be chosen after checking the actual development environment and assets.

## Rendering and dependency boundaries

Prerender public portfolio content and case studies. Use server-rendered navigation and semantic links. Keep motion, image reveal controls, mobile menu, and the game in small client components. The page should still introduce Sebastian and expose project/social links when decorative JavaScript fails.

Load the game bundle, Realtime client, and keyboard audio near the game viewport or on interaction. Keep admin authentication and dashboard modules out of public client bundles where possible. Disable static/public caching for owner data and per-session attempt endpoints. Public game snapshots can be cached briefly only with explicit freshness/revision handling.

Use shared validated configuration for social links and the current resume so header/footer/mobile versions do not drift. Content validation should fail an invalid production build before publishing a broken project page.

The selected Supabase backend stores authoritative state in its included Postgres database. Do not add a Redis score cache without a measured need and a revised plan. Upstash was evaluated and not selected; retain the [free backend comparison](../research/free-backend-comparison.md) as context for the realtime, analytics, authentication, and cost tradeoffs.

## Realtime hosting caveat

Current Vercel documentation announces general WebSocket support as of October 20, 2026. Some older limits/search results still say it is unsupported; do not repeat that outdated blanket claim. Current documentation also describes function-duration and reconnection considerations, and a Next.js-specific experimental upgrade API. Our proposed managed Realtime choice is about reducing implementation/operational work, not a claim that Vercel cannot use WebSockets. Recheck supported APIs before any alternate implementation. [Vercel announcement](https://vercel.com/changelog/websocket-support-is-now-generally-available), [implementation guide](https://vercel.com/kb/guide/do-vercel-serverless-functions-support-websocket-connections).

## Performance goals

- Public text/navigation and the hero's reserved layout arrive before decorative effects.
- Proposed launch targets: LCP at most 2.5 seconds, INP at most 200 ms, and CLS at most 0.1 in representative checks; evaluate field data later. These are targets, not measurements of an existing site.
- Reserve image/video dimensions, lazy-load below-fold media, and use short posters/previews rather than autoplaying full videos.
- Keep media encodes and audio lazy-loaded; do not load every award photo or full sample library at startup.
- Restrict the animated grid to a profiled number of visible tiles. Pause offscreen/hidden-tab animation and active-game distractions.
- Prefer a small number of font files/weights and subset only as appropriate for the actual content.
- Exercise low-end/mobile conditions; desktop smoothness alone is insufficient.

## Domain and environments

When deployment is authorized, use Vercel Hobby and separate preview/production configuration. Use local development services or an available isolated free project for testing; do not assume paid database branching or unlimited free projects. Previews must not add production attempts or analytics. Confirm the available free allocation across existing accounts before setup.

Add `snoel.dev` to the Vercel project and use the exact DNS records Vercel provides in Cloudflare. Preserve unrelated DNS records, especially mail records. Use `https://snoel.dev` as canonical and redirect `www.snoel.dev` if configured. [Search visibility](../planning/search-visibility.md)

Choose Cloudflare DNS/proxy behavior using current provider guidance when setting up the domain. Registrar ownership alone does not mean Cloudflare proxies the website, and Turnstile use does not require assuming that it does. Verify HTTPS, canonical redirects, callback URLs, and that private routes cannot be served from a public cache. [Vercel domain setup](https://vercel.com/docs/domains/working-with-domains/add-a-domain).

Configuration categories to plan: public site URL and public provider key; server database secret; owner user ID; Turnstile public site key/server secret; analytics deployment flag; and private signing/hash secrets where needed. Actual values go in approved environment settings, not these documents.

## Operating cost and resilience

The approved budget is exactly $0. Use Vercel Hobby, Supabase Free, and free-compatible ancillary services. Do not introduce paid plans or usage-based billing without a new user instruction changing the budget. Current allowances and failure modes are recorded in [free backend comparison](../research/free-backend-comparison.md) and [Vercel Hobby limits](../research/vercel-hobby-limits.md).

Estimate database storage, Realtime fan-out/connections, asset bandwidth, host function CPU/memory, cron history, and analytics writes. Passage tests have variable duration: checkpoint requests scale with elapsed time, not an assumed 30-second test. Subscription/heartbeat/polling overhead also counts even when visitors do not play.

Monitor free usage and add bounded requests, retention, and an emergency switch for new ranked starts. Prefer temporary dynamic-feature unavailability to spending money; keep the static portfolio independent where possible, while acknowledging a Vercel-wide quota could affect it too. Supabase Free may pause after inactivity, so document restoration and overdue-attempt catch-up. Do not add synthetic keepalives as a substitute for handling service availability.

Follow the [database release, export, and recovery plan](release-operations.md). Retain compact monthly top-ten archives and lifetime accounting without unbounded raw logs. A single aggregate row can become a write bottleneck at larger scale. Measure before adding infrastructure.

The remaining implementation sequence and verification obligations are in [roadmap](../planning/roadmap.md).
