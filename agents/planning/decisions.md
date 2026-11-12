# Decisions and open questions

## 2026-11-12 experimental homepage showcase

Sebastian requested a complete redesign of the homepage projects and featured
experiences on an experimental branch, using the latest repository updates.
Issue #39 tracks `exp/homepage-showcase`, based on `dev` at `e23c15c`.

Confirmed for this experiment: Recall left, Permanence emphasized in the center,
Greghouse right, equal outer margins, scroll reveals in the order Recall,
Greghouse, Permanence, scarlet award accents, video placeholders instead of the
current thumbnails, and desktop/mobile performance work. Creative freedom applies
to these sections while retaining the base palette.

The implementation proposes larger media frames with an elevated center feature,
a scarlet first-place banner, and an open experience list instead of compact cards.
Phones follow the reveal order vertically so each project enters naturally while
scrolling. Native observers and transform/opacity animation keep the client small;
server-rendered content stays available without JavaScript. See the experimental
section in `design/visual-direction.md` and the media instructions in
`docs/content.md`. These choices are for review, not approved for integration.

Updated November 7, 2026. **Confirmed** means Sebastian stated the requirement. **Proposed** means a recommendation has been documented but not approved. **Open** means the preference or necessary fact is still missing.

## Confirmed decisions

**November 9, 2026 intro refinement:** Sebastian requested a slightly slower tile wave and a repeatable typing rhythm with varied character delays. After reviewing the preview, he asked to extend the typing to about 1.8 seconds and give the caret three full blinks at half a second visible and half a second hidden. The fourth blink ends in a fade.

**November 8, 2026 motion adjustment:** Sebastian requested a slower homepage tile impulse for review on `dev`. The first timing pass slows the outward wave and lengthens each tile flip.

**November 9, 2026 merge policy:** Codex may merge reviewed non-experimental task PRs into `dev` after CI passes. Sebastian reviews the exact `dev` preview and explicitly approves the release before it moves into `main`. Experimental changes stay isolated unless he explicitly approves them for release, including changes copied or cherry-picked from an experiment.

Class projects are out of scope. Sebastian’s [Devpost profile](https://devpost.com/sebastian-noel) is a source for hackathon projects that are unavailable locally.

| Decision | Source/context |
| --- | --- |
| Portfolio for Sebastian Noel; planning lives under `agents/` | Workspace setup and planning request |
| `port_global` provides optional resources; other projects are read-only sources | Workspace setup and ProjectsGuide.md |
| Cornflower blue `#4e87ec` canvas for the current palette pass | Palette follow-up |
| Supporting blues/light grays and white text; coral `#ff8a75` as the selected accent | Planning request and follow-up |
| Home, Experiences, Projects, About; linkable detail/case-study pages | Planning request |
| Easy addition of projects/experiences and rich media | Planning request |
| Winning team-photo hover on awarded projects when a photo exists | Planning request |
| Typed name, tile-flip impulse, persistent grayscale-to-color photo patches | Planning request |
| Many small interactions with mobile considered throughout | Planning request |
| Persistent resume/GitHub/LinkedIn access and mobile hamburger | Planning request |
| Next.js, Vercel, Cloudflare-owned `snoel.dev` | Planning request |
| No-login home typing challenge; at least 100 WPM wins | Planning request |
| Each accepted start counts; unfinished/below-threshold attempts lose | Planning request |
| Realtime shared counts/percentages and a monthly top-10 initials leaderboard accepting only wins, including when empty | Planning request and follow-up |
| Passages use lowercase letters and spaces without punctuation | Follow-up |
| Show a live 100 WPM ghost cursor and count confirmed fraud as a loss | Plan review follow-up |
| Hosting and every additional service must cost $0 | Follow-up |
| Supabase Free is the selected backend, including its Postgres database | Backend selection follow-up |
| Custom randomized keyboard samples and abuse prevention | Planning request |
| Private owner analytics/dashboard for views and key external-link clicks | Planning request; dashboard direction endorsed in follow-up |
| Discoverable name, work, resume, LinkedIn, GitHub, and selected photos, with private contact details kept out of public search content | Search follow-up |

## Design choices to review first

| Topic | Status | Recommendation/choice needed |
| --- | --- | --- |
| Accent | Confirmed starting direction | Use coral `#ff8a75`; replaces the original amber direction |
| White text contrast | Selected for current review | White large headings on cornflower blue, with dark navy for smaller canvas text |
| Typography | Direction confirmed, family open | Choose a distinctive, readable face during development. Avoid generic type treatments and fonts strongly associated with AI-generated templates. |
| Responsive review | Confirmed | Review and refine on real layouts during development. Skip the separate prototype and case-study draft for this planning round. |
| Overall composition | Proposed | Open, image-led layout with broad blue fields and a few grid/photo clusters; no repeated bordered-card shell |
| Mobile persistent links | Proposed | Compact sticky header with social/resume actions and hamburger, adapting when the keyboard opens |
| Detail presentation | Proposed | Full pages first; optional routed modal/sheet enhancement later |
| Intro replay | Proposed | First home visit per session; immediate settled view on repeat navigation |

## Game rules needing review

| Topic | Status | Recommendation/choice needed |
| --- | --- | --- |
| Benchmark validation | Proposed next step | Retest Sebastian's 100 WPM benchmark on the new passage-completion format |
| Test length | Working interpretation | Exactly 30 words per passage. Sebastian wrote “30 words per minute” while retaining a 100 WPM benchmark. |
| Test format | Interpreted from length request | Finish the passage and calculate WPM from elapsed time; replaces the fixed 30-second proposal |
| Text normalization | Confirmed | Lowercase letters and spaces with no punctuation; preserve sentence-derived wording |
| Start moment | Proposed | Count explicit server-accepted Start; use 3-second countdown, with departure afterward still counted |
| Completion/scoring | Proposed | Require the full normalized passage, correct errors before completion, and calculate five-character WPM from verified elapsed time |
| Minimum accuracy | Proposed | Display accuracy but do not add an extra win condition beyond valid completion and at least 100 WPM |
| Percent denominator | Proposed | Wins/losses among settled attempts; show pending separately. Alternative: all-start percentages including pending |
| Initials format | Proposed | Exactly two A–Z letters, uppercase after normalization |
| Leaderboard eligibility | Confirmed | Only verified wins at least 100 WPM can qualify, even on an empty board |
| Reset cadence | Confirmed | New leaderboard every calendar month |
| Reset timezone | Proposed | Midnight on the first in America/New_York; exact timezone remains open |
| Month assignment | Proposed | Validated completion instant determines the month; late initials remain bound to that month |
| Lifetime statistics | Interpreted scope | Lifetime attempts/wins/losses continue; user requested only leaderboard resets |
| Multiple entries per person | Proposed | Permit multiple valid attempts; no-login identity cannot reliably enforce one person/one score |
| Tie order | Proposed | WPM, accuracy, earlier completion, stable ID |
| Sound default | Proposed | Muted until enabled, with remembered volume/preferences |
| Timing/expiry | Proposed | 3-second countdown, elapsed-time test, 120-second abandonment limit, bounded 15-second result grace, 10-second expiration sweep |
| Data retention | Proposed | Short-lived operation histories, durable compact results; final policy before launch |

These settings are documented so we can reason concretely. They must not be mistaken for user-approved game rules or copied blindly into an irreversible public leaderboard.

## Technical/content choices

Foundation implementation in PR #5: begin with typed records and structured text sections rather than MDX, because the first case studies only require plain text and verified links. Shared routes and templates remain reusable. Bricolage Grotesque, the deep-blue contrast areas, and the first layout are implemented for visual review, not recorded as final design approval. Search indexing stays disabled; no private resume source is copied. Browser tests use Playwright with Chromium alongside existing CI checks.

| Topic | Status | Recommendation/choice needed |
| --- | --- | --- |
| Content authoring | Proposed | Repository metadata plus MDX and shared templates |
| Animation library | Proposed | Motion plus CSS; native view transitions as enhancement |
| Data/realtime | Backend confirmed; implementation proposed | Supabase Free selected; use its included Postgres, Realtime, Cron, and Auth, with sanitized public state only |
| Redis alternative | Evaluated, not selected | Retain the Upstash comparison as decision context; no Redis dependency in the initial stack |
| Analytics | Direction endorsed; implementation proposed | Small first-party collector and private dashboard within free quotas; paid Vercel custom events excluded |
| Admin sign-in | Open | Propose GitHub OAuth through Supabase to avoid an email-delivery service; verify owner identity at setup |
| Monthly budget | Confirmed | $0 for hosting and all additional services; no paid trials/automatic upgrades/PAYG assumptions |
| Homepage projects | Confirmed | Permanence, Recall, GregHouse |
| Homepage experiences | Confirmed | BNY, Knight Hacks involvement, and Graphics Programming Knights (GPK) involvement. Verify precise role wording and dates before publication. |
| Assets and destinations | Partially supplied | The original resume is available in the local source materials. Use temporary project covers, photos, and links during development. Keyboard recordings will come later. |
| Video delivery | Confirmed | Embed YouTube demos and provide a thumbnail, short description, and direct link as a fallback. Local clips are allowed in selected sections. |
| Hosting fallback | Conditional | Launch on Vercel Hobby. Evaluate AWS or Sebastian’s spare Mac mini if Hobby becomes too restrictive and the alternative fits the $0 budget. |
| Canonical domain | Selected for implementation | `https://snoel.dev`; redirect `www` if configured |
| Public resume and search | Selected for implementation | Public PDF with private contact details removed, plus a shareable HTML landing page. Expanded HTML content can follow review. Keep the original for direct sharing. [Search visibility](search-visibility.md) |
| Database delivery and recovery | Selected for implementation | Versioned migrations, explicit production approval, compatibility checks, private exports, and a restore rehearsal. [Release operations](../engineering/release-operations.md) |

## Change log

- **2026-11-07:** Recorded Sebastian's initial brief, researched backend/analytics options, documented the palette contrast conflict and stale Vercel WebSocket guidance, and created the initial roadmap/templates. No implementation decisions beyond the supplied brief have been approved.
- **2026-11-07 follow-up:** Confirmed monthly leaderboard resets, wins-only eligibility including an empty board, 25–40-word lowercase punctuation-free passages, amber as the starting accent, and the $0 services/hosting constraint. Dashboard direction endorsed. Replaced the fixed-duration proposal with interpreted passage completion; documented Supabase/Upstash free-tier tradeoffs and proposed GitHub owner sign-in instead of an email dependency. Backend selection was still open at this point; exact completion rules and reset timezone remain undecided.
- **2026-11-07 backend selection:** Sebastian chose the Supabase route under the $0 budget, confirming Supabase Free. Updated the brief, architecture, backend, analytics, comparison, and roadmap. Recorded [Vercel Hobby limits](../research/vercel-hobby-limits.md), including the new Schedules beta versus legacy Cron Jobs distinction. No service has been provisioned and no application implementation has started.

- **2026-11-07 plan review follow-up:** Confirmed the homepage lineup, temporary project assets, supplied resume, distinctive font direction, responsive review during implementation, YouTube fallback, live pacer, and fraud counted as a loss. Recorded 30 words per passage as the working interpretation. The coding workflow is the next discussion before implementation.

- **2026-11-07 coding workflow:** Sebastian confirmed sole-developer GitHub collaboration, `main` for production, `dev` for integration, and the `exp/` prefix. Codex may approve eligible PRs and merge routine releases. Experiment promotion requires explicit owner approval, including indirect promotion. GitHub Actions CI runs on every branch push. The workflow proposes public-repo protections after a visibility review, along with a private-repo path.

- **2026-11-07 workflow follow-up:** Sebastian made the repository public and required screenshots in PRs with UI, UX, or visual changes. Include a short animation recording when available and within GitHub’s upload limit.

- **2026-11-07 release reliability.** Sebastian prioritizes correctly implemented and tested changes before they go live. Under 15 minutes is the target for a simple change when verification fits. The [coding workflow](coding-workflow.md#production-release-and-recovery) proposes staging the production build, checking it before assigning `snoel.dev`, and verifying the live revision after promotion.

- **2026-11-07 implementation handoff.** Selected required regression checks, a separate database release and recovery process, and operational monitoring for the public site and ranked game. Added [progression](progression.md) for milestones and [search visibility](search-visibility.md) for public discovery. Sebastian included the resume, LinkedIn, and GitHub in the search scope. The public resume will use a contact-free copy so it can be indexed.

- **2026-11-07 scaffold.** Chose the Next.js App Router with TypeScript and plain CSS. The scaffold pins Node.js 24 and uses npm with a committed lockfile. The first GitHub Actions check verifies formatting, lint, types, a production build, and the placeholder homepage. The placeholder opts out of indexing until the public site is ready. Track repository setup in [issue #1](https://github.com/sebastian-noel/port/issues/1).

On subsequent decisions, record the date, what was selected, why it matters, and which specifications changed. Remove contradictory earlier guidance rather than leaving two active versions.

## 2026-11-07 first-design revision

Sebastian rejected the oversized featured-work layout and requested the original typed-name splash and radial blue/gray/white square impulse now. Confirmed coral, `snoel.dev` wordmark, flat letter placeholders, less copy, small home side links, no home About promotion, and blank game space. Resume actions open the supplied contact-free PDF in a new tab. Projects expand to ten verified Devpost entries plus clearly marked future entries, with uniform cards and basic search. Experiences use chronological cards with verified resume dates and bullets. Unknown dates remain absent.

This revision supersedes earlier home composition, accent, and resume-action guidance. Sebastian accepted it as a first draft, with polish still ahead. Add the shared planning docs to draft PR #5. The first public launch is a separate milestone.

## 2026-11-07 baseline and contact

Sebastian approved merging the verified first draft into `main`. Public launch remains a separate milestone. His contact email may be public, including in Git history, and About will have a contact section. Keep his phone number, other private details, and original assets out of the public repository.

## 2026-11-07 palette pass

Sebastian asked to shelve the tile clusters and scroll drift from [issue #7](https://github.com/sebastian-noel/port/issues/7). Use the documented deep blue canvas and white main text for this pass. Review the palette in the existing tile layout. [Issue #9](https://github.com/sebastian-noel/port/issues/9)

## 2026-11-08 contrast adjustment

Sebastian chose a color close to the original cornflower blue with 3.5:1 contrast against white. Use `#4e87ec` for the canvas and reserve white for large text. Use dark navy for smaller text and keep coral as the accent. [Issue #9](https://github.com/sebastian-noel/port/issues/9)

## 2026-11-08 UI review evidence

Sebastian confirmed that UI screenshots should be attached directly in the PR description. Use fewer than five screenshots and choose only the most useful views. One desktop Home screenshot is sufficient for the palette change. [Coding workflow](coding-workflow.md#visual-evidence-in-prs)

## 2026-11-10 palette preview and featured projects

Sebastian kept the navy landing background and requested scarlet current-page underlines, a stone-blue footer, and a stone-blue Featured Projects strip below the splash. Permanence, Recall, and GregHouse share a desktop row and stack on phones. The cards use demo thumbnails and can reveal approved team photos on hover or keyboard focus. Experiences stay in the sidebar. Review this direction in [PR #32](https://github.com/sebastian-noel/port/pull/32).

## 2026-11-10 homepage highlights refinement

Use stone blue as the visible field behind the featured project copy and footer, and as the surface for three homepage experience cards. Use navy text on those surfaces for contrast. Group both BNY internships together and feature UCF AI research and Knight Hacks mentoring and outreach alongside them. Use approved muted demo loops and team-stage photo reveals for the three existing featured projects. Keep stills while media is pending. Review in [PR #32](https://github.com/sebastian-noel/port/pull/32).

## 2026-11-10 About contact link

Sebastian supplied `sebastian@snoel.dev` and requested a direct email link on About,
without a contact form. Use the existing text-link styling in a Contact section so
visitors can see the address and open their email app. The public resume remains
contact-free. Updated the search and privacy specification and content guide.
