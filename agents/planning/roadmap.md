# Build roadmap and acceptance criteria

Use the [progression checklist](progression.md) to track milestone completion. This roadmap describes the build work and acceptance criteria for the complete site.

## Phase 1: planning handoff

Set up the [GitHub workflow](coding-workflow.md), then scaffold Next.js, establish the required CI check, and rehearse protected Vercel delivery with sample content. The homepage lineup and media direction are recorded in the content plan. Start development with temporary project covers, photos, and links. The source resume is available in `port_global`, and keyboard recordings will follow.

## Phase 2: responsive layout in the build

- Review the actual homepage, navigation, project cards, and typing area at phone and desktop sizes during implementation.
- Choose a distinctive, readable typeface. Review it with the cornflower background, darker text surfaces, and warm amber.
- Refine layout, spacing, and interactions with Sebastian during development.

## Phase 3: portfolio foundation

- Set up Next.js/TypeScript, chosen styling/motion dependencies, and lockfile.
- Implement shared navigation and the four primary routes.
- Implement validated project/experience content and detail routes.
- Use temporary project media and links as needed. Add accessible descriptions, responsive images, the public resume and social links, metadata, sitemap, canonical URLs, and proper not-found handling. Give YouTube demos a thumbnail, description, and direct link. [Search visibility](search-visibility.md)

Exit: adding a draft project record requires no layout code changes; direct case-study URLs work on reload; content remains useful with animation disabled.

## Phase 4: motion and responsive polish

- Integrate the hero impulse and persistent photo clusters.
- Add reversible hover/press/menu transitions and restrained page transitions.
- Review safe areas, touch targets, focus states, image loading, and text wrapping.
- Profile on mobile before increasing tile density or ambient animation.

Exit: no mandatory animation wait, no layout shifts from imagery/intro, no hover-only information, and reduced-motion preference respected.

## Phase 5: local typing experience

- Implement the chosen fixed rules and shared scoring specification with representative fixtures.
- Build native mobile input, countdown, elapsed-time/progress display, a 100 WPM ghost cursor, results, sound settings, and sample playback for 30-word passages.
- Build the local visual leaderboard/stats states using explicitly labeled development fixtures, never fake public records.
- Exercise audio/input fallbacks and viewport changes before backend integration.

Exit: the game is playable on native phone keyboards and desktop; scoring examples and threshold boundaries are correct; audio cannot block typing.

## Phase 6: ranked backend and shared live data

- Configure selected services on actual Free plans once implementation/service setup is authorized; preserve the $0 budget.
- Apply private/public data boundaries, migrations, constraints, and indexes.
- Implement idempotent starts, bounded input batches, completion/elapsed-time validation, expiration, winning-only month-bound claims, rollover, and snapshot revisions.
- Add durable limits, Turnstile checks where configured, observability, retention, and moderation/audit capability.
- Verify live changes across independent browser sessions and reconnect scenarios.
- Add the required database CI suite, rehearse a compatible migration and restore, and verify the ranked-start pause. [Database release operations](../engineering/release-operations.md)

Exit: consistency, abuse-prevention, privacy, and concurrency tests below pass. A service outage has an honest degraded state. Public scores are not launched until these checks are complete.

## Phase 7: owner analytics

- Implement narrow event ingestion and normalized page/click events.
- Build private aggregates and the owner dashboard.
- Configure verified owner identity and protect every data access path.
- Validate counts through realistic navigation and link clicks; exclude previews/admin/test traffic.

Exit: only the approved owner can read analytics, including via direct API requests, and no private response is publicly cached.

## Phase 8: launch readiness and deployment

- Replace temporary project media and links with reviewed assets and destinations. Verify copy, metadata, social previews, demo fallbacks, and resume version.
- Run the acceptance matrix, accessibility review, production build checks, and mobile performance checks.
- Review free provider limits, usage monitoring, bounded retention/exports, privacy text, inactivity restoration, and quota-exhaustion behavior. Do not enable paid features.
- Connect the domain using current Vercel-provided DNS values and verify redirects/HTTPS when deployment is authorized.
- Confirm previews use isolated data. Verify the [staged release and recovery flow](coding-workflow.md#production-release-and-recovery), including read-only smoke checks before promotion and on `snoel.dev`.
- Complete the [search launch checks](search-visibility.md#launch-and-follow-up), including the contact-free resume, indexable pages and photos, and sitemap submission after promotion.

Exit: all requested features are present and validated, or any explicit user-approved scope changes are recorded. DNS/publishing are separate execution steps, not completed by this plan.

## Acceptance matrix for implementation

| Area | Checks that matter |
| --- | --- |
| Navigation | Four main routes, working sticky resume/social links, mobile hamburger, skip link, keyboard focus, Escape, menu focus restoration |
| Direct links | Detail reload/new tab, Back/Forward, canonical URL, metadata, unknown slug handling, redirects for renamed slugs |
| Content | New project/experience generates correct card/detail automatically; missing optional media does not break rendering; duplicate slug/missing cover rejected |
| Search and publication privacy | Canonical pages and both public resume formats are indexable, sitemap omits private and draft routes, selected images have crawlable sources, and public HTML/PDF/media contain no private contact details |
| Responsive design | Small phones through desktop, large text/zoom, safe areas, landscape, no horizontal page overflow, stable image geometry |
| Motion | Interrupt intro/menu/page transition, rapid hover reversal, hidden-tab/offscreen pause, reduced-motion mode, no trapped interaction |
| Photo reveals | Mouse, keyboard focus, touch toggle, missing winning photo, meaningful alt text/caption, no first-tap navigation trap |
| Scoring | exactly 30 normalized words; lowercase/punctuation normalization; exactly 100, just below, above; incomplete passage rejection; correction/backspace; no double credit; variable elapsed time; timeout; rule-version isolation |
| Ghost cursor | Countdown alignment, shared scoring units, ahead/on/behind pace, wrapping, reduced motion, and visible player input |
| Fraud correction | Win becomes loss exactly once, total starts stay fixed, claims are invalidated, and current or archived board is recalculated |
| Demo media | Thumbnail, description, and direct link remain usable when the YouTube embed fails or is blocked |
| Mobile input/audio | iOS Safari and Android Chrome; input focus after Start gesture; composition; correction/backspace; known paste; keyboard viewport; denied audio; mute/volume |
| Attempt consistency | Double Start; lost Start response/retry; duplicate batches; out-of-order/replayed batches; repeated finish; tampered prompt/score/time; shared-session tabs |
| Abandonment | Close tab/browser; navigate away; lost network; background timer; expired attempt; sweep retry; finish racing expiration; no double finalization |
| Realtime | Two independent clients; dropped connection; initial fetch/subscription race; duplicate/old revision; reconnect/refetch; fallback polling/stale label |
| Leaderboard | Empty/partial/full monthly top ten; below-100 rejected even when empty; exact ties; concurrent last-slot claims; expired/forged claim; duplicate initials/claims; displacement |
| Month rollover | First-of-month/timezone/DST boundaries; clients left open over midnight; test spans midnight; late old-month initials; delayed maintenance; duplicate rollover; unchanged lifetime counters |
| Abuse controls | Request/payload caps; session/network limits; shared-network tolerance; invalid/single-use Turnstile; direct database mutation rejection; no raw data subscription |
| Analytics | Initial load/client navigation/Back; no prefetch/rerender duplicates; duplicate event delivery; normalized paths; all three link types and placements; blocked tracking leaves links functional |
| Owner privacy | Logged out, wrong signed-in user, expired/revoked session as supported, direct admin APIs, forged cookie, public cache isolation, owner allowlist changes |
| Resilience and budget | Database/Realtime/limiter/audio failures, retry bounds, counters rebuild/reconciliation, expired-job monitoring, inactivity pause/restoration, free-quota exhaustion, no automatic upgrades, safe rollback |

Use unit fixtures for pure scoring, database/integration tests for transitions and authorization, and browser/manual tests for real interactions. Avoid a large pile of tests that only repeat presentational markup. Native phone testing remains necessary even if desktop browser emulation passes.

## Optional later enhancements

Command menu with shortcut hints, richer project filtering as content grows, routed desktop detail overlays, enhanced mobile sheets, additional media placement, or a separately labeled local practice mode. These are deliberate follow-ups rather than prerequisites for a clear portfolio.
