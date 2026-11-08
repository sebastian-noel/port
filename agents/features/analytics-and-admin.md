# Analytics and private owner dashboard

Confirmed: Sebastian wants total/site page views, views of individual pages, resume/GitHub/LinkedIn clicks, and a page only he can access. He has endorsed the dashboard direction, selected Supabase Free, and set a firm $0 hosting/services budget. The authentication method and detailed collector implementation below remain proposals.

## Recommendation and alternatives

Build a small first-party event collector and private dashboard using the Postgres database included in the selected Supabase backend. The requested metrics are narrow enough to support directly. This also avoids depending on an undocumented analytics-provider API to display data inside `snoel.dev`.

| Approach | Fit | Tradeoff |
| --- | --- | --- |
| First-party events in Supabase, recommended | Direct control of the desired metrics and private on-site dashboard | We implement ingestion, deduplication, retention, and simple queries |
| Vercel Web Analytics | Optional free page-view overview in the provider dashboard | Paid custom events are excluded by the $0 budget; no assumption of free data access for an on-site dashboard |
| Dedicated external analytics product | Consider if richer funnels, attribution, or reporting become requirements | Another service, integration, pricing, and privacy configuration |

Vercel's current docs place custom events on Pro and Enterprise, so they are excluded from the $0 design. Collect the requested clicks with the site's own narrow endpoint. Its provider dashboard can be an optional free supplementary overview, not the requested private page itself. [Custom events](https://vercel.com/docs/analytics/custom-events). An Upstash alternative could store daily counters keyed by page/event/placement; it would require more predefined reporting structure and a separate auth integration. See [comparison](../research/free-backend-comparison.md).

## Metric definitions

| Metric | Definition |
| --- | --- |
| Page views | Accepted view events for rendered public routes, including repeat visits |
| Views by page | Page views grouped by normalized path/slug |
| Resume clicks | User activations of an instrumented resume link; not proof that the PDF was read |
| GitHub clicks | Activations of instrumented GitHub links, with destination kind and placement |
| LinkedIn clicks | Activations of instrumented LinkedIn links, with placement |
| Optional project/demo clicks | Activations of a known published project's external links |
| Game starts/wins/losses | Read the authoritative game records, never infer these from analytics beacons |

Label views as views, not unique people. True unique visitors are not required initially. If anonymous session estimates are added, label them accurately and document the identification method. Link clicks measure intent, not activity on the external destination.

## Proposed event contract

- `page_view`: normalized public path and optional published content slug.
- `resume_click`: placement (`header`, `mobile_menu`, `hero`, `footer`, or other allowlisted placement) and resume version.
- `github_click`: placement and a known destination key, such as profile or a project slug.
- `linkedin_click`: placement.
- Optional later: `project_external_click`, `video_play`, and `typing_section_view`, only if they answer an actual question.

Each event has a random event ID for retry deduplication, schema version, server receipt time, and deployment environment. Validate the event name, path, placement, field sizes, and destination against known values. Strip query strings/fragments and avoid arbitrary full URLs or free text. Do not collect game keypresses, admin credentials, email addresses, or user-entered initials as analytics properties.

Emit one view after a public route is displayed, including client-side navigation and browser Back/Forward. Do not count link prefetching, React rerenders, duplicate development effects, or API requests as page views. Exclude preview/development deployments, admin routes, and known test traffic. Ignore hash-only navigation unless a later explicit metric requires it.

Use a small nonblocking collector with `sendBeacon`/keepalive where appropriate. Do not cancel or delay normal external-link navigation to wait for tracking. Deduplicate retransmission of the same event ID at the database. Do not globally deduplicate legitimate repeated visits to the same page.

Tracking is best effort: blockers, disabled JavaScript, bots, and network loss affect measurements. Events from the public browser are not audit-grade evidence. Use rate limits and basic bot filtering without fingerprinting people or promising perfect counts.

## Data and dashboard

Proposed tables: private `analytics_events` for short-lived validated events and private daily aggregates for long-term reports. Target up to 30 days of raw events and 13 months of aggregates while enforcing a storage budget below free limits; shorten raw retention if needed. Preserve totals when pruning. Aggregate jobs must be idempotent and retain a watermark/processed state so retries cannot inflate totals. No paid analytics package is needed for these specified metrics.

The dashboard should offer 7-day, 30-day, and custom date windows; total page views; a trend chart; pages ranked by views; resume/GitHub/LinkedIn click counts and placement breakdown; and optional authoritative game totals. Start with a clear table and a simple chart rather than a dense monitoring console. Use a documented reporting timezone, proposed America/New_York, while storing timestamps in UTC. Include zero-count days.

No requirement for realtime private analytics. Proposed refresh: on load and on an explicit refresh action; minute-level refresh may be added later. Live game totals can use the existing separate snapshot. Keep operational abuse review separate from visitor analytics.

## Owner access

Updated proposal: GitHub sign-in through Supabase Auth, restricted to Sebastian's verified owner identity. This avoids adding an SMTP provider for email magic links. Supabase's default email service is restricted and intended for testing/best-effort delivery; email remains an alternative only after a suitable $0 delivery path is verified. The identity/provider choice is not yet approved. [GitHub sign-in](https://supabase.com/docs/guides/auth/social-sign-in/auth-github), [SMTP limitations](https://supabase.com/docs/guides/auth/auth-smtp).

- Do not show admin links in public navigation or the command menu. Exclude admin/auth routes from sitemap and indexing, while remembering these measures do not authorize anyone.
- Enforce verified authentication and an explicit server-side owner user-ID allowlist before rendering admin data or executing any admin endpoint/query/action. “Any signed-in user” is insufficient.
- Use the provider's supported server-side token validation, not an unverified session object or a cookie flag. A client-side route redirect alone is insufficient.
- Bootstrap only the approved owner identity through a controlled setup, verify its stable provider/user IDs, and restrict registration where supported. Other authenticated accounts never receive owner privileges. For any later email alternative, disable public signup and use `shouldCreateUser: false`. Restrict callback destinations to approved URLs; do not assume an email-only signup switch implements OAuth authorization.
- Apply RLS/grants to private analytics and admin data. Secret database credentials are server-only. If a server uses credentials that bypass RLS, its owner-authorization check remains mandatory before every query.
- Use the auth library's supported cookie/session flow; refresh and revoke appropriately, avoid logging tokens, and set appropriate transport/same-site protections. Never embed credentials or auth tokens in public HTML or static files.
- Mark admin HTML and API responses private/no-store. Do not prerender or publicly cache authenticated content or session-changing responses.
- Rate-limit sign-in and callbacks; use generic unauthorized responses without disclosing the owner's email. Recheck identity for future destructive moderation actions.

[Supabase server-side auth](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs), [passwordless email](https://supabase.com/docs/guides/auth/auth-email-passwordless), and [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) support the underlying mechanisms. The owner allowlist is an application requirement we must implement and test.

## Privacy and checks

Keep a short public privacy explanation describing site interaction counts, the anonymous game session, optional sound preference storage, and retention. Prefer minimal data collection and respect applicable visitor choices; finalize disclosures from the actual implementation. Do not assume an analytics product automatically resolves every privacy requirement.

Acceptance includes a logged-out user, a separately authenticated non-owner, direct calls to admin APIs, expired sessions, and cache-leak checks. Page counts and click totals must be tested through normal links, client routing, duplicate delivery, and blocked analytics without breaking navigation.
