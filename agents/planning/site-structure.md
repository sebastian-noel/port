# Site structure and navigation

Status: the four main pages and directly linkable details are confirmed. Section ordering and exact paths below are proposals.

## Route map

| Route | Purpose | Default rendering |
| --- | --- | --- |
| `/` | Introduction, selected work, experience preview, personal photos, typing challenge | Prerendered content with isolated interactive regions |
| `/projects` | All published projects with an image and a short explanation | Prerendered collection |
| `/projects/[slug]` | A project case study with media and relevant links | Prerendered detail |
| `/experiences` | Roles, research, internships, and student organization experience | Prerendered collection |
| `/experiences/[slug]` | Expanded experience narrative, contributions, outcomes, media | Prerendered detail |
| `/about` | Personal introduction, interests, background, selected photos | Prerendered content |
| `/resume` | Shareable resume landing page and direct PDF action; expanded HTML resume can follow content review | Prerendered content |
| `/resume.pdf` | Downloadable copy of the same reviewed public resume | Static file |
| `/admin` | Owner sign-in/entry | Private flow; no public navigation |
| `/admin/analytics` | Sebastian's analytics | Authenticated, uncached |
| `/privacy` | Brief explanation of analytics, anonymous game sessions, and data retention | Prerendered utility page |

Slugs remain stable. If one changes, preserve the old link with a redirect. Each public detail page gets its own title, description, canonical URL, and social preview. Use the [search visibility plan](search-visibility.md) for metadata and publication rules.

## Home sequence

1. **Splash:** large centered “Sebastian Noel” typed live once per tab session, followed by the radial tile impulse. No subtitle or promotional copy. Navigation stays immediately usable.
2. **Workspace:** reserve a large blank area for the future typing game. A small side column links to selected projects and experiences. Stack it below the reserved space on narrow screens.
3. **Footer:** minimal name and public links.

Do not place an About promotion or About link in home content. About remains in persistent navigation. The game is implemented after design acceptance in a separate PR.

## Collections and case studies

- Projects prioritize the problem, the result, Sebastian's role, and what the thing looks like. Hackathon awards and event names are visible without requiring hover.
- Experiences identify organization, role, dates, context, and contribution. Explain experiential programs accurately rather than implying an employment relationship that has not been confirmed.
- A detail page follows: summary and hero media; problem/context; personal contribution; approach; result/evidence; lessons; selected media and links. Omit empty sections.
- Give each YouTube demo a thumbnail, a short description of what it shows, and a direct link. Keep those available when the player fails or is blocked.
- Keep the initial case study compact enough to scan, with deeper technical explanation only where it teaches something useful.
- Full pages are the proposed first implementation of “expanded view.” Optional desktop modal/sheet presentation may be added later if direct URLs, reload, new-tab opening, history, and accessibility still work.
- On mobile, prefer a full-page detail view for reading. If a sheet is added, provide a close button, focus management, ordinary Back behavior, and swipe dismissal without intercepting browser edge gestures.
- Use a visible “All projects” or “All experiences” link. Do not add code-style breadcrumb paths.
- Use standardized project cards and a single search field. Search matches names and available technology, teammate, and event metadata. Expand verified metadata later; no dense filter bar.
- Experiences sort newest start date first in timeline cards. Show a small description, picture or flat letter placeholder, and resume bullets. Keep unknown dates empty. Clearly label dummy records.

## Persistent navigation

**Desktop proposal:** a compact sticky header with the `snoel.dev` wordmark, the four page links, and resume/GitHub/LinkedIn links. Keep the header in place without covering headings or focus targets.

**Mobile proposal:** a compact sticky row with the `snoel.dev` wordmark, resume, labeled GitHub/LinkedIn icon links, and a hamburger menu. All interactive hit areas should be at least 44 by 44 CSS pixels. At very narrow widths or large text zoom, wrap the social actions into a second compact row rather than shrinking targets. The hamburger opens the main page links and repeats the important external links.

The mobile menu needs an accessible name, expanded state, clear close control, Escape support, focus containment while open, and focus restoration when closed. Its content must remain reachable in landscape and at large text sizes.

Reserve sticky header height in the layout, respect safe areas, and provide a skip-to-content link. External destinations use normal links with useful labels. Analytics must never delay navigation. Resume actions open `/resume.pdf` in a new tab with an accessible label. `/resume` remains a shareable landing page. The supplied resume is used to prepare a contact-free public PDF.

## Mobile-specific behavior

- Cards use one primary tap to open the case study. A separate “Team photo” control, outside the card link, can toggle awarded-project media; no first-tap hover trap.
- Grayscale photo patches can reveal on an explicit tap. If a photo is also a link, use a separate reveal control or show color by default on touch rather than making navigation ambiguous.
- The typing game uses the native keyboard and keeps the current passage lines, elapsed time/progress, and input in the visible viewport. It must not require horizontal scrolling or a custom on-screen keyboard.
- While the software keyboard is open, compact navigation as needed so it does not cover the game. Restore the normal persistent links afterward; they remain available from the menu.
- A compact stats row sits near the mobile game; the full leaderboard follows below. Desktop “beside the game” is intentionally adapted to vertical space on phones.
- Use normal page scrolling. No scroll hijacking, mandatory full-screen intro, or hover-only explanations.
