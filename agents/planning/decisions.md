# Decisions and open questions

## 2026-11-13 showcase integration and navigation polish

Sebastian approved moving the showcase to `dev` after the requested refinements.
The exact `dev` preview still needs his explicit approval before a release to `main`.
Preview links open the homepage root. The centered desktop navigation uses equal
outer columns, while accessible icon-only actions retain their labels. A staggered
wordmark fill, restrained icon scaling, and a layered animated footer heart use CSS
and respect reduced motion. The scroll hint waits for the intro and tile wave to
finish, then disappears after scrolling. The footer resume uses the same arrow as
its neighboring links.

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

Sebastian's follow-up requests prominent treatment for all five wins, a consistent
trophy instead of an emoji, one project arrow by the name, removal of the motion
control and All projects action, hover expansion and video zoom/color, no progress
line, richer source-backed copy, and a shorter section with desktop 16:9 media and
text inside a dark bottom fade. The refinement uses the existing inline SVG icon
system instead of adding an icon dependency. README-backed `featuredSummary`
fields keep expanded homepage copy separate from compact collection summaries.
The layout stacks below 1200px so three landscape panels do not force unreadably
small text; very narrow cards can grow to fit the overlay. CSS transforms avoid
layout shifts, keyboard focus receives the hover treatment, and touch devices show
color by default. Reduced motion, Save-Data, hidden-tab and offscreen playback
safeguards remain. This feedback does not authorize promotion out of the experiment.

The next refinement widens the preview frames, keeps only project names over the
fade, and moves descriptions below. The projects field becomes darker navy to
separate it from the landing screen. Badges move above the frames with "Best Overall"
wording and the supplied resume's exact counts: Permanence 1/212, NVIDIA 1/21,
Hugging Face 1/78, Recall 2/85, and Greghouse 3/86. Permanence's sponsor badges flank
its raised overall badge. Sebastian supplied the event logos and winners collage;
official NVIDIA and Hugging Face SVGs complete the badges. The NVIDIA artboard is
cropped to a padded square while preserving its complete eyemark and wordmark.
Local optimized assets avoid third-party image requests. The footer adds the
requested centered "Made with <3 by Sebastian" credit, using equal outer grid
columns to keep the credit centered despite different copyright/link widths.

The latest feedback aligns all desktop media and card bottoms, with the center
frame growing upward through its larger 16:9 dimensions. Nested CSS subgrids share
rows without JavaScript measurements or fixed description heights. Compact rounded
badges emphasize ranks and use transparent logo backgrounds. Recall and Greghouse
tilt right; hover/focus retains each angle while scaling and pushing outward.
Reduced motion keeps static tilts but disables movement. Hackathon names move off
the homepage, remaining on case studies. The footer replaces the typed heart with
an inline SVG and an accessible "love" label, avoiding a platform-specific glyph.
The supplied HackUSF raster receives a transparent background cutout via built-in
imagegen, exported to a small WebP. The original asset remains untouched. No new
runtime dependencies are needed. This remains an isolated experiment.

Sebastian then requested the logo-left treatment on every badge and an attached
appearance. All badges now overlap the video frame's top edge; the center overall
badge is taller to preserve the arch while every badge stays attached. Small-screen
logos and typography scale to fit the horizontal layout without hiding award text.
Desktop Recall moves to the left edge with a left tilt. Desktop reveal entrances
last 1.2 seconds with 1.25 seconds between starts, triggered farther into the
viewport to give each project a distinct moment. Mobile source order becomes
Permanence, Recall, Greghouse so visual, screen-reader, and keyboard order agree;
desktop reveal order remains Recall, Greghouse, Permanence. CSS keeps desktop
positions and aligned bottoms, without adding runtime dependencies.

The next refinement standardizes every award badge's width and height per viewport.
Larger logos match the visible height of the placement/category text, with small
per-asset optical scale and position offsets. A white alpha-based outline improves
the Knight Hacks IX sigil's contrast; the supplied original remains untouched.
The center badge is raised instead of taller to retain the arch. Desktop heading
spacing lets the project composition occupy the empty space beside and below it.
Permanence gains a third README-backed sentence about its Jetson hardware, rover
action, and live 3D dashboard. Desktop entrances shorten to 950 ms, staggered by
1000 ms; mobile entrances use 750 ms. Decorative, aria-hidden skeletons share the
same grid rows as real content, crossfade during entrance, and disappear immediately
for reduced motion or keyboard focus. No fake network delay, live region, timers,
React loading state, or new dependency is added. Server content remains visible
without JavaScript. These changes stay on the experimental branch for review.

Sebastian requested matching white outlines for HackUSF and NVIDIA. A shared inline
SVG alpha-dilation filter adds those outlines at render time, preserving the
selected artwork and transparency. Skeleton frames and text lines now sweep a
subtle highlight left to right, using transform animation only while pending and
visible. Hidden tabs pause the sweep and reduced motion disables it. The skeleton
fade shortens to 110 ms and completes before content entrance begins, removing
the double exposure seen in the previous crossfade. No new dependency or timers.

Sebastian extended the same thin white outline to Hugging Face and BloomKnights
for consistent badge contrast. Reuse the existing shared rendering filter so no
logo source changes or additional assets are required.

Sebastian requested logo outlines at half their previous weight. Halve the alpha
expansion radius in both the shared badge filter and the Knight Hacks IX sigil's
derived SVG so all five logos retain a consistent, lighter edge.

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

## 2026-11-14 experience and resume refresh

Sebastian requested concise experience descriptions, at most four strong evidence-backed accomplishment bullets, and links/resources, with explicit bullet placeholders for missing facts. Reuse the existing typed content and shared templates rather than introducing a second content system. Keep organization cards together with dated role history for GPK and Knight Hacks so title changes stay visible without duplicating the organization. Preserve existing detail URLs. Use the updated resume and supplied screenshots as evidence, preferring LinkedIn role dates over older resume dates: IST May to July 2026; FSEC Software Engineer Intern May to September 2025; UCF AI January to April 2026. Use the four supplied IST bullets and three FSEC bullets without invented additions. Direct resource URLs were supplied only for the paper; use the updated LinkedIn experience profile for other roles until specific resources are supplied.

Sebastian explicitly selected his updated resume with the new public email and LinkedIn slug. This supersedes the earlier contact-free PDF requirement for that approved address. Publish the exact reviewed PDF because no private contact information needs removal. Centralize LinkedIn actions at `https://www.linkedin.com/in/snoel-dev/`. The public email remains approved; private phone numbers and other private contact details remain excluded. Track in issue #43; implementation and authoring guidance are in `docs/content.md`.

## 2026-11-14 experience layout refinement

Sebastian requested Home, Experiences, Projects, About navigation; wider experience cards; role-first headings; Links & Resources capitalization; removal of the future experience placeholder; and removal of experience case-study pages. This supersedes the earlier requirement for experience detail URLs. Keep project case studies in the explicit `/projects/[slug]` route and use `/experiences#slug` anchors for homepage links, so navigation reaches the complete experience without duplicated pages. Put dates above cards and allow the experience collection to use the available desktop width rather than shrinking type or forcing horizontal scrolling. Full bullets fit on one line at 1600px; smaller screens retain normal wrapping. Apply the role-first hierarchy to homepage experience highlights for consistency. Track in issue #45; update content guidance and site structure together.

## 2026-11-14 experience bullet emphasis

Sebastian requested scarlet text for the parts of experience bullets that were bold in his supplied resume and screenshots, and removal of the UCF experiential-program wording from both BNY experience descriptions. Preserve existing bullet wording and mark only source-bold phrases with `**` in the typed records. Render those spans as semantic strong emphasis with a 65% mix of the existing scarlet and white: the lighter scarlet preserves contrast for small text on the navy cards while retaining the palette. Leave Knight Hacks placeholders plain because no matching bold source text was supplied. Remove the same BNY program wording from the homepage highlight so the site is consistent. Track in issue #47 and document the authoring syntax in `docs/content.md`.

## 2026-11-14 stronger scarlet emphasis

Sebastian requested bolder experience bullet emphasis and a color closer to the original scarlet. Mix the existing scarlet at 75% with white and render the marked phrases at weight 700. Varela Round only ships a regular weight in this project, so enable weight synthesis for these phrases only, preserving the existing typeface and avoiding a new font download. This supersedes the 65% normal-weight treatment from issue #47. Darken the experience card background from a 16% to an 8% sky mix to keep the stronger red readable at approximately 4.6:1 contrast. Verify reading and wrapping on desktop and mobile. Track the refinement in issue #49.


## 2026-11-15 splash arrow and award logo corrections

Issue #56 fixes the splash arrow's hover specificity conflict: its scale selector now overrides the generic diagonal link-arrow transform and also applies on keyboard focus. Knight Hacks IX keeps the supplied colored vector paths with a white stroked vector copy behind them, replacing the rasterized SVG morphology filter for sharper mobile rendering. NVIDIA uses only its original green eye path in a tighter viewBox, since the badge already names NVIDIA beneath the placement. These are bounded corrections to the existing design; the rejected homepage experience redesign remains excluded.


## 2026-11-19 project case studies

Sebastian restricted the catalog to the eight projects in the selected section of ProjectsGuide.md and asked for full case studies without labeling the collection as hackathon projects. Remove Alto, FE AI, and future-project placeholders rather than discovering extra entries from his Devpost profile. Keep stable URLs for the eight retained projects. Use the existing structured sections instead of adding an authoring dependency because the content is plain text and the shared template already supports it.

Use local README/devpost evidence as the primary source and Devpost to verify selected demo URLs, event metadata, and explicit creator attributions. Add My contribution sections for Permanence, Greghouse, and Debt Escape from local attributions, plus Next Step and TideSense from their public Devpost creator notes. Describe other implementation work as team outcomes instead of guessing ownership. Record awards from the current guide, including Next Step's third-place State Farm result and T.K.'s Revenge's community vote. Keep roadmap ideas separate from demonstrated features.

Use verified YouTube thumbnails on project cards and lazy privacy-enhanced embeds with descriptions and direct links on case studies. This supplies real project media without committing originals or adding local video bandwidth. Direct Devpost image retrieval returned HTTP 403, so custom galleries and optimized clips remain pending rather than using unrelated imagery. Render the existing team, role, event, and technology fields in the template because visitors should be able to read the metadata already used in search. Keep publication flags and launch safeguards intact. TideSense's backend has a randomized simulated inference fallback, so the copy explicitly identifies its exploratory status and limits instead of repeating safety claims from the submission.

Use a fresh worktree from origin/dev because the ordinary checkout contains substantial unrelated uncommitted files. Track implementation in issue #60, within the existing site-polish milestone; the game and remaining milestone work stay open.

## 2026-11-19 Projects grid proportions and lift

Sebastian requested two projects per row, a 16:9 rectangular shape, title above the cover, description below, and a smooth lift with a scarlet glow underneath. Interpret 16:9 as the complete desktop card proportion because the request describes the card shape, with the image filling its middle band. At 900px and below use a single column so tablet images retain room between the title and description. At phone widths use natural card height and a 16:9 image, preserving readable descriptions instead of squeezing text into a fixed-height rectangle. Keep the homepage showcase and case-study templates separate from these catalog-only styles.

Use a 420ms eased transform for the lift and scale, and fade a softly blurred scarlet radial gradient beneath it. Animate only transform and opacity, rather than a large changing box shadow or a JavaScript animation loop, for smooth compositing and no extra dependencies. Apply the same feedback on keyboard focus. Limit hover movement to fine pointers to avoid sticky touch states; reduced motion retains the glow cue with no lift or transition. Track in issue #62.


## 2026-11-19 visual Permanence case study and richer project cards

Issue #64 implements Sebastian's requested revision to the existing project design. Natural card height supersedes the exact 16:9 outer ratio so the cover, summary, and award results have room. Retain a 16:9 cover and two desktop columns; a concise results strip replaces reuse of homepage award badges. Use a full-perimeter static scarlet shadow faded with opacity, a scarlet border, and restrained lift/image zoom instead of animated blur or an animation dependency. Focus receives the same perimeter cue; reduced motion removes movement.

Use Michael Rusu's linked case studies as structural inspiration: problem, personal contribution, architecture, constraints, results, and lessons. Keep all project facts grounded in Permanence's README, local submission, viewer contract, and containment code. Add optional rich section fields to the existing content model rather than a parallel hard-coded case-study route, so the accepted structure can later support other entries. Limit this content revision to Permanence. Use native HTML/SVG diagrams because they remain crisp, accessible and responsive without extra client JavaScript. Label diagrams as explanations rather than results. Use supplied rover and dashboard images as WebP derivatives, retain uncropped screenshots, reuse the existing awards photo, and exclude original files. Apply the existing Experiences scarlet bold style for visual consistency. Distinguish model-weight memory from total shared usage, and identify the telemetry screenshot as one observed moment, not a benchmark. Do not invent accuracy metrics or broaden Sebastian's contribution beyond the dashboard.


## 2026-11-19 team-centered Permanence narrative

Issue #66 follows Sebastian's request to emphasize the team's strongest technical
achievements, remove individual contribution callouts, center the text, and keep
a sticky contents rail on the left. Lead with object permanence, the two-stage
pipeline, remembered-target navigation, and the 8 GB constraint before showing the
dashboard. Keep all ownership collective; remove the role field and diagram's
personal highlight. Add a third native illustration for target selection, memory,
and obstacle-aware approach because it explains physical action with the same
visual vocabulary as the shell game. Label it conceptual rather than measured.
Keep the rail in a dedicated desktop grid column to avoid overlapping the story;
on narrower screens use a sticky horizontal row instead of squeezing the content.
Use a typed optional teamProfiles field rather than changing all existing team
arrays. Verify Bill's LinkedIn via his Devpost profile; the other teammate URLs
are explicitly linked by the local README. This revision is limited to Permanence.


## 2026-11-19 Permanence observation and memory refinement

Issue #68 supersedes centered prose and the route illustration. Keep titles centered, but left-align prose inside a page-centered reading column. Balanced desktop gutters accommodate the sticky left rail without shifting the text off center. Collapse the rail to its existing horizontal layout on narrower screens. Use a compact two-column facts strip with a full-width technology row instead of a tall filled panel. Keep teammate links.

Replace the navigation diagram with visible observation, retained memory age, and depth-supported occlusion. Show rays ending at the foreground surface and use dashed outlines only for remembered positions. Explain out-of-view and lost separately in prose because elapsed time alone does not establish occlusion. Verify against the tracker implementation. Remove source/editorial notes from public captions while retaining useful explanations and accurate telemetry context.

Use a small client figure wrapper with IntersectionObserver to trigger short, finite arrow and opacity animations once on entry. Keep diagram content server-rendered and visible without JavaScript. Avoid an animation dependency and continuous movement; reduced motion disables all added animation.

## 2026-11-19 Permanence image viewing and links

Issue #70 places the project resources in the introduction for immediate access and uses the owner's LinkedIn post URL. Describe work directly or as we, while preserving the factual team credits in the metadata and image descriptions. The demo retains its embedded video without surrounding descriptive and duplicate link lines on this visual study. A native modal dialog enlarges each project photograph and its caption, dims and blurs the page, and supports backdrop, close button, and Escape dismissal. Native modal focus management provides keyboard access without adding a dialog dependency. Other project templates retain their existing demo and link behavior.

## 2026-11-20 Permanence motion and mobile reading

Issue #75 covers Sebastian's request for more movement in the Permanence diagrams, the site's exact scarlet accent for highlighted text, a framed demo near the top, and a better mobile contents menu. Keep the desktop sticky rail. On mobile, use an active-section button and vertical expandable list instead of horizontal scrolling. Center the left-aligned reading column with balanced phone gutters. Place the framed demo after the event, team, and technology facts. Diagram cues play briefly when scrolled into view and respect reduced-motion preferences.

The follow-up widens case-study paragraphs to the full content column. Sebastian then asked to keep the text left-aligned, so do not justify it or insert automatic hyphenation. Use a lighter, brighter scarlet (`#ff6269`) for emphasized case-study copy and experience bullets so bold text stands out against the navy canvas. Put Demo first in the contents navigation because its panel appears before the written sections. Keep motion that explains sequence: staggered diagram reveals and directional arrows. Remove radar blinks, ambient bobbing, and ball movement because they decorate the scene without explaining it.

For issue #75's later diagram refinement, remove the blinks from both the shell-game and object-state figures, retain the architecture arrows' finite motion, and enlarge those arrows so the flow reads clearly.

## 2026-11-20 mobile scrolling stability

Issue #74 addresses homepage scrolling stalls. The tile field rebuilt its entire
three-element-per-tile subtree on every window resize, including mobile toolbar
changes during scroll. Size the fixed decorative field with `100lvh` and observe
its dimensions instead of window resize notifications. Cache the last dimensions
to avoid an initial duplicate rebuild. This preserves the existing intro and
real resize coverage rather than removing the effect or disabling mobile media.
The regression simulates toolbar-only resize notifications while scrolling,
asserts node preservation, and checks orientation and desktop height changes.
The mobile-toolbar simulation is not a substitute for a physical phone check.
See design/motion-and-interactions.md for the updated constraint.

## 2026-11-20 mobile featured skeleton removal

Issue #79 implements Sebastian's request to remove Featured Projects skeletons
on mobile only. Use the existing single-column showcase breakpoint below 1200px
rather than device detection, keeping the behavior aligned with the mobile
layout. Hide skeletons there and skip their fade animation and associated delay.
Retain the mobile card reveal and the desktop skeleton sequence.

## 2026-11-21 Recall visual case study

Issue #81 reuses the approved case-study layout for Recall and adds two native diagrams, one for capture and one for retrieval, so the prototype can be understood without playing the demo. Use the checked-in audio firmware and active Python logging path to explain how the latest transcript joins a selected frame. Show the two hardware views together, then place storage and dashboard screenshots beside the corresponding explanation. Use resized, metadata-free WebP copies of the supplied media and keep the original files outside the portfolio.

## GregHouse visual case study

Issue #87 reuses the shared case-study layout for GregHouse. The two diagrams separate sensor telemetry from multiplayer sync so visitors can trace how a real reading reaches the game. Select the device, garden features, and multiplayer animations from the original media and encode them as smaller, silent clips with posters and playback controls. Use the setup and award photos where they document the prototype and result.

Issue #89 changes the inline clips to silent loops without controls so they read as moving figures. Play clips while visible to limit work offscreen, and retain the posters for reduced motion. Put the real diagnostic device and garden together on the cover so the connection is visible before the case study opens. Add the recorded-voice path because it shows that the browser could also send something back to Greg’s device.

## Debt Escape catalog removal

Issue #94 removes Debt Escape from the shared project records at Sebastian’s request. The catalog and generated detail routes now use the same seven-project selection.

## T.K.’s Revenge visual case study

Issue #96 uses the shared visual study layout with the original in-game cover, map and enemy images, and two Project Launch photos. Reuse the diagram cards for the payload sequence and branch the combat diagram to show how each class lands a hit. The photos and diagrams show different parts of the project without duplicating the demo.

## Remaining visual case studies

Issue #98 completes the seven-project catalog. Use the same layout so demo placement, section navigation, and image enlargement work consistently. Reuse the flow diagram cards for each project's two main workflows. Select original interface screenshots to illustrate the interaction, and ground implementation details in the local source.
