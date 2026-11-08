# Supabase and Upstash under a $0 budget

Reviewed November 7, 2026. Sebastian's budget is **$0 for hosting and every additional service**. This is a firm design constraint. Sebastian has selected **Supabase Free**; this comparison preserves the reasoning and the evaluated Upstash alternative.

## What is being compared

Supabase is a hosted platform that includes a Postgres database. “Supabase + Postgres” does not mean paying for or running two separate databases. Its related services include database-change subscriptions, authentication, and database scheduling.

Upstash Redis is a managed Redis-compatible database. Redis is particularly suited to counters, expiring keys, and sorted rankings. Upstash also persists records to disk, so it can serve as the primary database for a small application; it is not inherently disposable cache storage. [Durability](https://upstash.com/docs/redis/features/durability), [sorted sets](https://redis.io/docs/latest/develop/data-types/sorted-sets/).

## Practical comparison for Port

| Concern | Supabase Free | Upstash Redis Free |
| --- | --- | --- |
| Counter/leaderboard fit | Transactions and indexed queries handle this small dataset easily | Counters and sorted sets directly match this workload |
| Browser realtime | Supabase hosts the realtime connection; subscribe to a safe aggregate record | Upstash Realtime provides push updates through Redis Streams/PubSub and an application SSE route |
| Monthly reset | Query/partition by month and ruleset; preserve prior rows | Use month-specific sorted-set keys; preserve/archive prior keys |
| Duplicate prevention | Unique constraints plus transactions | Atomic scripts/transactions and idempotency keys; design multi-key consistency explicitly |
| Private analytics | SQL naturally supports date/page/action reports and changing questions | Simple daily counters are easy; new report dimensions need planned keys/aggregates or more custom processing |
| Owner sign-in | Supabase Auth can share the same backend | Realtime auth middleware checks an existing identity; we still choose/configure an identity/session solution |
| Retention/expiration | Indexed expiration job and SQL aggregation | TTL handles temporary keys, but deleting an attempt key does not itself settle a loss counter; a real finalization design is still needed |
| Data durability | Persistent Postgres | Persistent managed Redis; not a plain in-memory-only cache |
| Main operational drawback | Inactivity pausing, connection/message/storage quotas, more initial schema/RLS work | Command budget shared by game, realtime, analytics, and rate limiting; SSE also consumes hosting resources |

These are architectural judgments for this site's feature set, not claims that one provider is universally faster or more capable.

## Both can provide real push updates

With Supabase, a validated result updates Postgres, which triggers a change notification to connected browsers. The live connection runs on Supabase, not inside a long-running Vercel route. Only a sanitized current-month board and public lifetime totals are exposed.

With Upstash Realtime, the server updates Redis and emits an event; browsers receive it through Server-Sent Events. SSE is enough for one-way leaderboard/stat updates; game writes can still use ordinary HTTP requests. Upstash's library includes reconnect/history handling. Redis alone does not automatically redraw a browser, and polling every few seconds is an alternative, not the definition of realtime. [Quickstart](https://upstash.com/docs/realtime/overall/quickstart), [deployment](https://upstash.com/docs/realtime/features/serverless).

The documented default SSE reconnect interval is 300 seconds. Its endpoint runs on the application host. Vercel Fluid Compute meters active CPU **and** allocated memory over an instance's lifetime, plus invocations; idle network waiting does not make an open SSE endpoint cost-free in resource allowance. Shared concurrency can reduce per-connection overhead, so measure rather than assume one whole function per viewer. [Vercel resource accounting](https://vercel.com/docs/functions/usage-and-pricing).

## Current free allowances relevant to this site

| Service | Published allowance/caveat | Planning action |
| --- | --- | --- |
| Vercel Hobby | $0 for personal/non-commercial use; 100 GB transfer, 1 million function invocations, 4 active CPU hours and 360 GB-hours of provisioned memory in the published allowances | Prerender portfolio pages, keep function work bounded, and inspect actual team usage |
| Supabase Free | 500 MB database, 5 GB uncached egress, 200 peak Realtime connections, 2 million Realtime messages/month; free projects pause after one inactive week | Subscribe near the game only, broadcast aggregate changes rather than keystrokes, bound retained data, handle a paused backend |
| Upstash Redis Free | 500,000 commands/month, 10 GB bandwidth, approximately 250 MB storage, one free database | Budget all commands and use an actual Free database; do not assume a PAYG database includes a free command allowance |
| Turnstile Free | Free plan includes unlimited challenges within its widget/hostname limits | Use for game abuse checks without purchasing a plan |

Sources: [Vercel Hobby](https://vercel.com/docs/plans/hobby), [Supabase pricing](https://supabase.com/pricing), [Upstash pricing](https://upstash.com/pricing/redis), [Turnstile plans](https://developers.cloudflare.com/turnstile/plans/). Limits can change and may be shared across other projects on Sebastian's accounts. Confirm available allocation at setup.

Upstash's page currently says 250 MB in its Free card/FAQ and 256 MB in one comparison row. Plan conservatively around 250 MB and verify the console; the monthly command limit consistently reads 500K. Older indexed references to daily request limits should not override the current plan page.

## Budget mechanics

- **Do not enable paid plans, trials that roll into payment, automatic upgrades, premium add-ons, or PAYG just because a provider advertises a free allowance elsewhere.** Upstash's pricing page explicitly distinguishes its Free plan from paid plans; verify the selected plan rather than using a marketplace default blindly.
- Free capacity is finite. If usage exceeds a quota, accept throttling or a temporarily unavailable dynamic feature instead of upgrading. Keep the prerendered portfolio independent where possible; a hosting-wide quota can still affect the whole deployment.
- Supabase's free inactivity pause is a real drawback for a portfolio with quiet periods. Document owner restoration and catch-up of expired attempts. Do not depend on artificial keepalive traffic or promise that internal cron jobs prevent pausing.
- Upstash also documents inactivity/archival policies; it is not an unconditional always-on guarantee. Its FAQ and terms describe different inactivity windows, so verify current account behavior rather than presenting an exact guaranteed window. No paid tier is assumed as the remedy.
- Vercel Hobby's legacy Cron Jobs run at most daily; the new Schedules beta supports recurring jobs at most every 15 minutes with a 15-minute jitter window and 5,000 runs/month. Neither matches the proposed 10-second expiration sweep, so use Supabase Cron. Monthly boards select month-specific data instead of depending on a precisely timed deletion. See [current hosting limits](vercel-hobby-limits.md).
- Store short input traces only for validation, purge cron execution history, and aggregate analytics on a retention schedule. Check bytes/index growth rather than just row counts.
- Use web-optimized repository images/audio and selected local video clips, with project demos embedded from YouTube. No paid image transformations, video host, SMTP subscription, or provider custom-domain add-on is required by the plan. The public Vercel domain and the backend's default service hostname can coexist.

## How usage accumulates

Supabase counts delivered Realtime messages, so an update sent to many viewers consumes multiple messages. Push changes at start, settlement, leaderboard claim, and month rollover, not for every keystroke. Keep operation checkpoints private and do not subscribe inactive/offscreen visitors indefinitely. [Message accounting](https://supabase.com/docs/guides/platform/manage-your-usage/realtime-messages).

Upstash's Realtime docs list two Redis commands per initial subscription, three on a scheduled reconnection, a heartbeat publish each minute, and two per emitted event (three with a TTL). Those sit alongside actual game, analytics, and limiter commands. Pipelines reduce network round trips, not necessarily counted operations. [Realtime command accounting](https://upstash.com/docs/realtime/overall/pricing).

For comparison, a polling design with one read every 10 seconds uses 18 reads during a three-minute visit. At 10,000 such visits, that alone is 180,000 reads before writes, analytics, and retries. This is an arithmetic illustration, not a traffic forecast. SSE avoids repeated unchanged reads but has its own commands and host-resource usage.

## Selected approach

**Vercel Hobby + Supabase Free** is the selected hosting/backend foundation. Propose Turnstile Free, first-party analytics, and GitHub owner sign-in through Supabase Auth. Avoid an extra Redis dependency initially. The reason is the complete combination of game results, reliable settlement, monthly histories, private reporting, and authentication in one backend. SQL is not required merely to show ten scores.

Upstash was evaluated and not selected. It remains a sound technical alternative, especially for a smaller counter/leaderboard-only scope; changing to it would require revisiting SSE resource usage, expiration scheduling, and owner authentication. Supabase has been selected but has not been provisioned. The detailed implementation proposals remain open for review.

Recheck current limits at implementation, monitor usage, and design an honest unavailable state. $0 is achievable within free-tier capacity; unlimited traffic and guaranteed uptime are not promised.
