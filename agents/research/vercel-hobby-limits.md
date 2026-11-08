# Vercel Hobby limits for Port

Checked against official documentation on November 7, 2026. Supabase Free is now the selected backend. This is planning research; no hosting or backend service has been provisioned. Recheck allowances before launch.

## Assessment

Vercel Hobby appears suitable for the proposed personal portfolio within its free allowances. The likely pressure points are photo/video delivery, image optimization, and abusive traffic to public endpoints. The animations and immediate typing feedback execute in the browser; Supabase hosts the live data connections. These choices keep Vercel requests short, but do not remove either provider's quotas.

## Relevant limits and design implications

Unless specified otherwise, resource allowances below are monthly. Team-level allowances may also be consumed by Sebastian's other projects; check actual available usage at setup.

| Area | Current Hobby allowance/restriction | Implication for Port |
| --- | --- | --- |
| Public delivery | 100 GB Fast Data Transfer; 1 million CDN requests [1] | Optimize photos, lazy-load keyboard samples and award images, and load videos on demand. Requests count assets as well as pages; this is not a visitor allowance. |
| Origin delivery | 10 GB Fast Origin Transfer [1] | A separate allowance for origin traffic; do not confuse it with browser delivery or Supabase's own egress allowance. Prerender public content and avoid unnecessary dynamic responses. |
| Server computation | 1 million function invocations, 4 active CPU hours, 360 GB-hours provisioned memory [2] | Game writes, input checkpoints, analytics ingestion, and admin requests consume resources. Do not send a request per keystroke or keep a function running throughout a test. |
| Individual functions | Up to 300 seconds with Fluid Compute; 4.5 MB request/response payload limit [3] | Keep game payloads bounded. Do not route large video uploads/downloads through these endpoints; the payload limit is not a limit on every static website asset. |
| Image optimization | 5,000 transformations; 300,000 cache-read units and 100,000 cache-write units [4] | Different generated variants and stale-cache processing consume transformations. Cache units measure 8 KB, not photos or page views. Limit variants and retain optimized static fallbacks. |
| Vercel analytics | 50,000 events and one month of history; provider custom events require Pro/Enterprise [1, 5] | Use the proposed first-party Supabase collector for resume/GitHub/LinkedIn clicks and private reporting. This paid feature restriction does not prohibit our own click-tracking code. |
| Schedules beta | Minimum recurring interval 15 minutes, 15-minute jitter window, 5,000 runs and 500 dynamic creations per period [6] | Unsuitable for the proposed 10-second expired-attempt sweep. Keep expiration in Supabase Cron. |
| Legacy Cron Jobs | Each job at most daily, timing within its scheduled hour [7] | This older restriction is not the current limit for every Vercel scheduling product. Neither scheduling option provides our desired sweep cadence. |
| Deployment/debugging | 100 deployments/day, one concurrent deployment, 45-minute build limit, one-hour runtime-log retention [8] | Ample for ordinary portfolio iteration; diagnose failures promptly and keep durable game outcomes in Postgres rather than relying on console logs. |
| Repository integration | Private organization repositories cannot deploy to Hobby; private-repository deployment checks also validate commit authorship [9] | Prefer Sebastian's personal GitHub repository and connected owner account. Verify ownership/visibility and deployment permissions at setup. |

The [Hobby plan][1] allows custom domains, and the [plan overview][10] includes automatic HTTPS. The existing `snoel.dev` domain does not require a paid Vercel tier. Existing domain renewal costs are separate from hosting and outside this planning action.

## Budget and reliability

Hobby caps usage instead of offering the Pro plan's paid overages. Vercel says most exhausted allowances require waiting until 30 days have passed; individual features have exceptions. Exhaustion may interrupt a feature or the site. Keep the selected plan free and accept an unavailable state rather than automatically upgrading. [1]

Image optimization has a specific failure mode: existing cached optimized images continue working, while new optimization requests can fail with HTTP 402 after the allowance is exhausted. Use compressed source assets, a restrained set of sizes, and a deliberate fallback; disabling runtime optimization should not mean sending full-resolution originals to phones. [4]

Illustrative bandwidth arithmetic: at 2 MB transferred per visit, 100 GB is roughly 50,000 visits. A 20 MB video downloaded 5,000 times also consumes roughly 100 GB by itself. These are decimal-unit examples, not capacity forecasts; other assets, caching, repeat visits, and separate limits affect actual headroom. Project demos will stream from YouTube embeds. Apply this estimate to any clips served by Vercel and measure their actual size before publishing.

Vercel meters active CPU separately from allocated memory. Waiting on a database does not consume active CPU, but memory remains accounted for while requests are in flight; concurrent requests can share an instance. Browser animation time is not server CPU time. Supabase Realtime avoids maintaining our subscribers inside long-running Vercel functions. [2]

## Scheduling and monthly boards

Schedules entered public beta on November 5, 2026, so older once-daily summaries need qualification. Its Hobby timing and quotas still do not suit frequent abandoned-attempt settlement. [6, 11]

Supabase Cron supports sub-minute database jobs. Use a bounded, idempotent sweep with retained-log limits and outage catch-up, as proposed in the [backend plan](../engineering/game-backend.md). [12] Monthly leaderboard selection uses the current period, with old results retained separately; it must not depend on deleting rows at an exact midnight cron invocation. The reset timezone remains proposed.

## Personal use and implementation checks

Hobby is limited to personal, non-commercial use. Our assessment assumes the site remains a resume/project showcase. Adding sales, advertising paid services, or advertising revenue would require revisiting hosting under Vercel's policy and the $0 budget. [13]

Before launch, inspect team usage; verify the free plans and repository integration; measure actual media weight and API activity; test image/backend-unavailable states; and monitor Vercel and Supabase separately. Free hosting does not promise unlimited traffic or uninterrupted availability. The site's privacy and scoring controls remain application responsibilities.

## Official sources

[1]: https://vercel.com/docs/plans/hobby
[2]: https://vercel.com/docs/functions/usage-and-pricing
[3]: https://vercel.com/docs/functions/limitations
[4]: https://vercel.com/docs/image-optimization/limits-and-pricing
[5]: https://vercel.com/docs/analytics/custom-events
[6]: https://vercel.com/docs/schedules/limits
[7]: https://vercel.com/docs/schedules/cron-jobs/usage-and-pricing
[8]: https://vercel.com/docs/limits
[9]: https://vercel.com/docs/git
[10]: https://vercel.com/docs/plans
[11]: https://vercel.com/changelog/vercel-schedules-is-now-in-public-beta
[12]: https://supabase.com/docs/guides/cron
[13]: https://vercel.com/docs/limits/fair-use-guidelines

1. [Hobby plan][1]
2. [Function resource accounting][2]
3. [Function limitations][3]
4. [Image optimization allowances and failure behavior][4]
5. [Custom analytics events][5]
6. [Schedules beta limits][6]
7. [Legacy Cron Jobs limits][7]
8. [General deployment and logging limits][8]
9. [Git integration restrictions][9]
10. [Plan overview and HTTPS][10]
11. [Schedules launch announcement][11]
12. [Supabase Cron][12]
13. [Personal/commercial-use policy][13]
