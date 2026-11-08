# Research notes and sources

Reviewed November 7, 2026. Official documentation supports provider capabilities; architectural recommendations elsewhere in this plan are our proposed application of those capabilities. Recheck exact packages, limits, pricing, and APIs when implementation starts.

Follow-up research adds the firm $0 constraint and a direct comparison of actual Free plans. Sebastian selected Supabase Free. Read [free-backend-comparison.md](free-backend-comparison.md) for the rationale, realtime delivery, and inactivity caveats, and [vercel-hobby-limits.md](vercel-hobby-limits.md) for hosting constraints. Supabase contains Postgres; Upstash Redis was evaluated as a durable alternative with its own realtime library.

## Findings

| Topic | Verified finding | Planning consequence |
| --- | --- | --- |
| Realtime | Supabase offers Broadcast and Postgres Changes; recommends Broadcast for scalability/security | Propose simple Postgres Changes only for intentionally public aggregate data; reassess at higher traffic |
| Abandonment | Supabase Cron can run database jobs on sub-minute schedules | Expire attempts server-side rather than relying on page unload |
| Redis | Upstash provides durable storage, sorted-set support, atomic operations, a limiter, and an SSE-based Realtime library | Valid alternative primary backend; compare shared command budget, host streaming costs, analytics, and owner auth |
| Analytics | Vercel custom events currently require Pro/Enterprise | First-party collection is a candidate for the requested custom private dashboard |
| Authentication | Supabase supports server-verified sessions and GitHub OAuth; default SMTP is restricted/best effort | Propose GitHub owner sign-in for the $0 plan, verify stable identity, and enforce owner authorization |
| Data security | RLS restricts row access; privileged secrets can bypass it and must stay server-side | Public snapshot only; private attempts/analytics and explicit server authorization |
| Bot checks | Turnstile tokens require server validation, are single-use, and expire after five minutes | Handle verification and retries before accepting a counted start |
| Motion | Motion supplies reduced-motion configuration/hooks | Build reduced-motion behavior into the planned effects |
| Input | `beforeinput` alone does not cover every browser edit, and some events are not cancelable | Use input/composition fallback and test native mobile keyboards |
| Audio | Web Audio guidance includes autoplay/user-gesture and user-control considerations | Enable sounds through a gesture and offer mute/volume |
| Contrast | WCAG AA text targets are 4.5:1 normally and 3:1 for large text | White over `#6395ee` at calculated 2.97:1 needs a different text surface/treatment |

## Source links

- [Next.js MDX](https://nextjs.org/docs/app/guides/mdx): local content support and integration details.
- [Next.js Image](https://nextjs.org/docs/app/api-reference/components/image): optimized images, dimensions, and placeholder controls.
- [Motion accessibility](https://motion.dev/docs/react-accessibility): reduced motion.
- [Supabase realtime choices](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes): Broadcast versus Postgres Changes.
- [Supabase Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes): database subscriptions, access policies, and scaling considerations.
- [Supabase Cron](https://supabase.com/docs/guides/cron): scheduling and monitoring database jobs.
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security): access control and privileged-key handling.
- [Supabase server-side auth](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs): validated identity and caching concerns.
- [Supabase passwordless email](https://supabase.com/docs/guides/auth/auth-email-passwordless): magic links, OTP, and account-creation behavior.
- [Upstash rate limiter](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview): serverless-compatible limiting.
- [Upstash pricing](https://upstash.com/pricing/redis): actual Free plan versus PAYG and shared command/storage/bandwidth limits.
- [Upstash durability](https://upstash.com/docs/redis/features/durability): persistence and suitability as a database.
- [Redis sorted sets](https://redis.io/docs/latest/develop/data-types/sorted-sets/): ranking operations.
- [Upstash atomic operations](https://upstash.com/docs/redis/features/key-locking): transactions and Lua execution.
- [Upstash Realtime quickstart](https://upstash.com/docs/realtime/overall/quickstart): Redis Streams and application SSE route.
- [Upstash Realtime deployment](https://upstash.com/docs/realtime/features/serverless): connection duration/reconnection on Vercel.
- [Upstash Realtime command usage](https://upstash.com/docs/realtime/overall/pricing): event, connection, heartbeat, and history costs.
- [Upstash inactivity FAQ](https://upstash.com/docs/redis/help/faq): archival; contains older daily-limit wording, so use current pricing for command quotas.
- [Upstash terms](https://upstash.com/trust/terms): inactive-resource provisions differ from the FAQ; exact continued availability should be verified, not guaranteed.
- [Supabase pricing](https://supabase.com/pricing): Free allowances and inactivity pausing.
- [Supabase Realtime message accounting](https://supabase.com/docs/guides/platform/manage-your-usage/realtime-messages): delivered-message usage.
- [Supabase GitHub auth](https://supabase.com/docs/guides/auth/social-sign-in/auth-github): owner sign-in option without SMTP.
- [Supabase SMTP](https://supabase.com/docs/guides/auth/auth-smtp): default email restrictions.
- [Vercel Hobby](https://vercel.com/docs/plans/hobby): free personal hosting and resource caps.
- [Vercel Fluid Compute accounting](https://vercel.com/docs/functions/usage-and-pricing): memory lifetime still counts while waiting on I/O, alongside active CPU and invocations.
- [Vercel legacy Cron Jobs](https://vercel.com/docs/schedules/cron-jobs/usage-and-pricing): Hobby daily frequency/coarse precision, unsuitable for prompt abandoned-attempt settlement.
- [Vercel Schedules limits](https://vercel.com/docs/schedules/limits): new beta allows Hobby recurring jobs every 15 minutes at most, with a 15-minute jitter window and 5,000 runs/month; still unsuitable for the proposed expiration sweep.
- [Turnstile Free](https://developers.cloudflare.com/turnstile/plans/): free challenge functionality.
- [Turnstile validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/): server checks, lifetime, and replay handling.
- [Vercel custom events](https://vercel.com/docs/analytics/custom-events): supported event tracking and plan availability.
- [Vercel Web Analytics](https://vercel.com/docs/analytics): provider dashboard and page-view definitions.
- [Vercel domain setup](https://vercel.com/docs/domains/working-with-domains/add-a-domain): domain verification and provider-supplied DNS records.
- [WCAG contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): text contrast requirements.
- [MDN beforeinput](https://developer.mozilla.org/en-US/docs/Web/API/Element/beforeinput_event): input coverage limits.
- [MDN Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices): audio loading/playback and user controls.

## Conflicting/stale search results

Older indexed Vercel limits pages say Functions cannot act as WebSocket servers. The current [October 20, 2026 announcement](https://vercel.com/changelog/websocket-support-is-now-generally-available) says support is generally available, and the [current implementation guide](https://vercel.com/kb/guide/do-vercel-serverless-functions-support-websocket-connections) documents it. Use the newer official material; check current Next.js integration maturity if implementing sockets directly. No recommendation here depends on the stale prohibition.

Vercel introduced [Schedules in public beta on November 5, 2026](https://vercel.com/changelog/vercel-schedules-is-now-in-public-beta). The once-daily Hobby restriction applies to legacy Cron Jobs, not all Vercel scheduling. The new limits are recorded above and in the hosting note. Use current dedicated image-optimization documentation rather than old search snippets describing a 1,000-source-image allowance.

## Reference-site limitation

The user supplied [Monkeytype](https://monkeytype.com/) as inspiration. Opening its main page through text retrieval returned a JavaScript-required fallback, so no visual browser inspection was completed in this planning round. Do not claim that exact spacing, mobile behavior, sounds, scoring, or source code was audited or copied. The proposed game behavior is specified independently in [typing-game.md](../features/typing-game.md).

## Local verification

The local `ProjectsGuide.md` was read and establishes the read-only project-source workflow and candidate projects. Detailed repositories and future media still need review. Palette ratios were independently calculated from the specified hex values using standard sRGB linearization and relative luminance; they are not estimates based on a screenshot.
