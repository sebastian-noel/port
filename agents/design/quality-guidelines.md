# Applying the supplied design guidelines

The list is a taste and usability guide, not a substitute for testing. The portfolio should gain its identity from composition, photographs, typography, and the tile motif. These rules apply to the published UI; planning documents may use identifiers, tables, and technical language for clarity.

## Dos

| Supplied guideline | Decision | Application to Port |
| --- | --- | --- |
| Skeleton loaders instead of spinners | Use selectively | Shape-matched placeholders for live leaderboard and analytics. Prerendered editorial content should not need a loading screen. |
| Optimistic updates | Use selectively | Immediate local response for photo, menu, mute, and other reversible preferences. Show pending status for game submissions; confirm global counters, results, and ranks from the server. |
| Command menu, Cmd+K | Optional later | Search projects/pages and access resume/social links. Support Ctrl+K too; keep ordinary navigation complete. |
| Keyboard shortcut hints | Use selectively | Show concise platform-correct hints near actual supported actions, not decorative shortcut labels everywhere. |
| Undo toasts instead of confirmation pop-ups | Use when reversible | Suitable for future saved preferences or admin edits. An abandoned ranked attempt cannot promise an undo after finalization. |
| Stale-while-revalidate | Use | Keep the last known public snapshot while refreshing and show when it is stale. Never cache private data for public reuse. |
| Prerender frequently opened pages | Use | Prerender all suitable public portfolio pages, including case studies. |
| Blurred image placeholders | Use | Reserve geometry and show a small image placeholder while a photo loads. |
| View transitions | Progressive enhancement | Add polish while preserving accessible navigation and reduced-motion behavior. |
| Swipe-to-dismiss mobile sheets | Conditional | Use if sheets are introduced; retain a close button and avoid conflicts with inner scrolling. |
| Interruptible animations | Use | Hover, menu, and route effects reverse/cancel naturally. |
| Predictive back gestures | Respect browser behavior | Preserve native history and edge swipes; do not imitate a native OS back-preview system. |
| Tap targets larger than icons | Use | Aim for at least 44 by 44 CSS pixels including mobile social links and game controls. |
| Safe area insets | Use | Account for notches and home bars in sticky UI and sheets. |
| One-time code autofill | Conditional | Relevant only if an OTP admin login is selected; public visitors do not log in. |
| Tabular numbers | Use | Game timer, WPM, counters, leaderboard, and analytics. |
| Balanced headlines | Use | Avoid awkward last words and test actual mobile wraps. |
| Smooth continuous corners | Adapt | Modest, consistent conventional radii; avoid the separately disliked squircle aesthetic. Square background tiles remain square. |
| Idempotency keys | Use outside payments | Prevent retries/double taps from creating duplicate attempts, results, leaderboard claims, or analytics events. |
| Safe triangle for submenus | Not currently relevant | No planned nested hover menus. Revisit only if that interaction is introduced. |

## Don'ts

| Supplied guideline | Port interpretation |
| --- | --- |
| Tags and pills | Avoid chip walls for technologies and awards. Use short text rows or integrate details into the case study. |
| Excessive italics | Keep emphasis restrained and readable. |
| Instrument Serif | Do not use it as the site's typeface. |
| Negative kerning | Avoid global tight tracking as a shortcut to style. |
| Overly detailed UI | Keep each section focused; the game can have arcade character without a cockpit of controls. |
| Overusing dividers | Prefer whitespace, alignment, and type hierarchy. |
| Color shades and opacities | Interpret as avoiding arbitrary proliferation. The requested multitone grid uses a small explicit palette; transitions may still fade. |
| Containers with borders | Avoid repeated outlined cards. Keep visible focus indicators and input boundaries when they improve use. |
| Overly detailed diagrams | Include a small explanatory figure only when a case study needs it. |
| Verbose, redundant text | Lead with the project problem, personal work, and result; remove repeated claims. |
| Code breadcrumbs | Avoid fake terminal paths and developer-style navigation trails in the public UI. Use clear “All projects” links. |
| Section numbering | Do not label public sections “01 / About,” etc. Internal planning IDs are fine. |
| Eyebrows | Avoid repetitive small labels above every heading, particularly all-caps labels adding no meaning. |
| Dithering | No decorative dither texture. |
| ASCII images | Use real media and purposeful graphics. |
| Squircles | Use squares or modest standard radii. |
| Excessive monospace | Reserve monospace for the typing area/score table if useful. |
| All-caps subtitles | Use normal sentence/title case. Two-letter leaderboard initials are intentionally uppercase. |
| Gradient backgrounds | Use flat blue fields and solid tiles. |
| Periods in titles | Omit decorative terminal periods in headings; use normal punctuation in prose. |

## Additional review questions

- Is every animation supporting an action, a story, or the site's identity?
- Can a recruiter quickly find the resume and strongest projects without waiting for effects?
- Are real images, contribution details, and outcomes doing more work than decoration?
- Can the whole experience be used on touch, by keyboard, and with reduced motion?
- Does the page still feel intentional with animation turned off?
