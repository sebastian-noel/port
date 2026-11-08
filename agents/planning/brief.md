# Portfolio brief

Source: Sebastian's planning request and follow-up on November 7, 2026. This file records current requirements; implementation proposals live in the linked specifications.

## Purpose

Introduce Sebastian Noel, present his experience and projects with evidence, and give visitors a fun reason to explore. Most projects are hackathon projects. The site should feel personal and deliberately designed, with concise copy and many small interactions.

## Confirmed requirements

| ID | Requirement | Specification |
| --- | --- | --- |
| V1 | Use cornflower blue `#4e87ec` with 3.50:1 contrast against white | [Visual direction](../design/visual-direction.md) |
| V2 | Supporting blues, possible light grays, and white text; coral `#ff8a75` as the selected accent | [Visual direction](../design/visual-direction.md) |
| V3 | Large, centered name types on initial entry; completion triggers an impulse through the site | [Motion](../design/motion-and-interactions.md) |
| V4 | A background grid of individual square tiles in blue/light-blue/gray tones, without outlines; tiles flip as the impulse passes | [Motion](../design/motion-and-interactions.md) |
| V5 | Some persistent grid patches contain grayscale photos that reveal their color on hover; several on home and possibly elsewhere | [Motion](../design/motion-and-interactions.md) |
| V6 | Small background, idle, hover, press, and navigation animations make the site fun | [Motion](../design/motion-and-interactions.md) |
| P1 | Separate home, experiences, projects, and about pages | [Site structure](site-structure.md) |
| P2 | Projects and experiences are easy to add in the future | [Content](../content/content-system.md) |
| P3 | Clicking an item opens a compact case study with further explanation, images, and videos | [Site structure](site-structure.md) |
| P4 | Each expanded project and experience has a direct, shareable URL | [Site structure](site-structure.md) |
| P5 | Each project card has a project image; awarded projects switch to a team-on-stage winning photo on hover when available | [Motion](../design/motion-and-interactions.md) |
| P6 | Exclude class projects. Use Devpost as a source for hackathon work that is unavailable locally. | [Content](../content/content-system.md) |
| P7 | Embed YouTube demos with a thumbnail, short description, and direct link. Allow local video in selected sections. | [Architecture](../engineering/architecture.md) |
| P8 | Feature Permanence, Recall, and GregHouse alongside BNY, Knight Hacks, and Graphics Programming Knights (GPK) on home. Use temporary project media and link placeholders during development. | [Content](../content/content-system.md) |
| P9 | Make Sebastian’s name, portfolio, resume, experiences, projects, public profiles, and selected photos discoverable through web and AI search while keeping private contact details out of public search content. | [Search visibility and privacy](search-visibility.md) |
| N1 | Resume, GitHub, and LinkedIn are easily accessible almost all the time | [Site structure](site-structure.md) |
| N2 | Use a hamburger menu on mobile and consider mobile in every UI/UX decision | [Site structure](site-structure.md) |
| G1 | A typing speed game near the bottom of home, inspired by Monkeytype, with no visitor login | [Typing game](../features/typing-game.md) |
| G2 | Starting a challenge increments the global attempt count once | [Game backend](../engineering/game-backend.md) |
| G3 | Completing a test with at least 100 WPM is a win and triggers a small celebration | [Typing game](../features/typing-game.md) |
| G4 | An unfinished test or a completed score below 100 WPM is a loss | [Game backend](../engineering/game-backend.md) |
| G5 | Live shared attempt, win, and loss numbers and percentages appear beside the game | [Game backend](../engineering/game-backend.md) |
| G6 | An arcade-styled leaderboard shows the top 10 submitted winning speeds; a loss never qualifies, including when the board is empty | [Typing game](../features/typing-game.md) |
| G7 | Ask for exactly two initials only when a result qualifies for the top 10; show initials and WPM | [Typing game](../features/typing-game.md) |
| G8 | Include practical abuse prevention for the game and leaderboard | [Game backend](../engineering/game-backend.md) |
| G9 | Use Sebastian's own keyboard recordings: multiple randomized samples for letters, spacebar, enter, and backspace | [Typing game](../features/typing-game.md) |
| G10 | Make the game comfortable to play on mobile | [Typing game](../features/typing-game.md) |
| G11 | Reset the leaderboard every calendar month | [Game backend](../engineering/game-backend.md) |
| G12 | Standardized passage length, interpreted as exactly 30 words. Use lowercase letters and spaces. | [Typing game](../features/typing-game.md) |
| G13 | Show a live ghost cursor at 100 WPM during the test | [Typing game](../features/typing-game.md) |
| G14 | Count confirmed fraudulent attempts as losses | [Game backend](../engineering/game-backend.md) |
| A1 | Track site/page views and resume, GitHub, and LinkedIn button clicks | [Analytics](../features/analytics-and-admin.md) |
| A2 | Provide an owner-only analytics page, absent from public navigation and inaccessible to regular users | [Analytics](../features/analytics-and-admin.md) |
| T1 | Use Next.js and likely animation libraries | [Architecture](../engineering/architecture.md) |
| T2 | Deploy on Vercel; use the already-owned Cloudflare domain `snoel.dev` | [Architecture](../engineering/architecture.md) |
| T3 | Hosting and all additional services must cost $0 | [Free backend comparison](../research/free-backend-comparison.md) |
| T4 | Use Supabase Free as the backend, including its Postgres database | [Game backend](../engineering/game-backend.md) |
| Q1 | Apply relevant items from the supplied design quality list | [Quality guidelines](../design/quality-guidelines.md) |
| W1 | Keep planning documents organized in `agents/`; consult external project sources read-only | [Agent instructions](../AGENTS.md) |

## Boundaries of this planning round

Produce organized Markdown plans, record design conflicts, research feasible services, and identify the decisions needed before implementation. Discuss and establish the coding workflow separately before implementation. Review layout and responsive behavior in the actual build.

Potential future additions such as a blog, CMS, visitor accounts, contact form, custom cursor, WebGL scene, or theme switcher are not requirements. Add them only if they solve an agreed need.

## Interpretation notes

- Exactly 100 WPM qualifies because Sebastian said “at least 100.” Prefer UI wording such as “Match or beat my 100 WPM” unless that rule changes.
- “No login” applies to game visitors. The analytics owner still requires authentication and authorization.
- A URL hidden from the menu is insufficient protection for analytics.
- Hover effects need a touch and keyboard equivalent; no important content may depend on hover.
- The ban on arbitrary color shades must coexist with the explicitly requested multitone tile grid. Use a small named palette.
- The requested smooth corners and the dislike of squircles can coexist as modest conventional radii.
- A running attempt has no result yet. The proposed counters explicitly track pending attempts rather than showing a premature loss.
- Interpret “30 words per minute” as 30 words per passage because the same update calls for a 100 WPM pacer. Keep the passage-completion format and measure elapsed time. Exact correction behavior and abandonment timeout remain proposals.
- Only the leaderboard was requested to reset monthly. Keep lifetime attempt/win/loss totals unless Sebastian requests otherwise; a monthly stats filter can coexist with them.
- The $0 service budget is firm. The previously purchased domain is already established; no domain purchase or renewal action is part of this plan.
