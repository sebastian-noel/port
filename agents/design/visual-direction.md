# Visual direction

## Experimental homepage showcase, November 12

On `exp/homepage-showcase`, issue #39 supersedes the compact homepage card layout
for review only. Use a wide navy project stage, larger video placeholders, stone
blue supporting fields, and scarlet award emphasis. Recall and Greghouse flank a
larger, elevated Permanence panel with symmetric outer gutters. Reveal Recall,
Greghouse, then Permanence. Stack in that order on phones. Keep Varela Round and
use scale and spacing to establish the new hierarchy without another font download.

Featured experiences become spacious rows on a stone-blue field, with a sticky
section heading on desktop and a normal stacked heading on mobile. Retain the
verified BNY, UCF AI research, and Knight Hacks content and their direct links.
Use lighter scarlet for small text on navy and full scarlet for large award accents.
Media placeholders describe the needed clips; do not reuse the existing thumbnails.

Prefer one-time entrance animations, small hover/focus responses, and visible
short silent loops. Pause offscreen media and hidden-tab activity. Include a pause
control, reduced-motion handling, and normal scrolling. These are experimental
implementation choices, not approval to merge into either integration or production.

Status: Sebastian requested this palette for review on a preview before merging.

## Overall character

Friendly, confident, and playful. Give real project images and the tiled photo motif room to define the site. Use a clear reading hierarchy and a few strong compositions rather than filling every gap with decorations. Awards and technical accomplishments supply credibility; large blocks of generic promotional copy do not.

Keep the base canvas flat. The tile grid is made of individual solid-color square surfaces without outlines. Avoid gradient washes, frosted-glass cards, arbitrary semi-transparent layers, ornamental dividers, and capsule tag collections.

## Palette

| Role | Hex | Intended use |
| --- | --- | --- |
| Navy | `#03203d` | Canvas, navigation, name backing, and dark surfaces |
| Stone blue | `#639cc5` | Featured Projects strip, footer, wave tiles, and secondary surfaces |
| Red | `#eb2f33` | Caret, current-page underlines, and action outlines |
| White | `#ffffff` | Text on navy surfaces, including the hero and navigation |

Use dark navy and navy–stone blends beneath white text. Use full-strength stone blue for the Featured Projects strip and footer, with navy surfaces behind the Featured Projects heading and card copy for contrast. Use scarlet underlines for the current navigation page. Use the same navy, white, and red for the social preview image.

## Type and layout

- Use regular-weight Varela Round sitewide, including the typed name in the hero.
- Use one display/body family initially; an optional monospace face belongs only in the typing prompt or arcade score table if it improves legibility.
- Let the name be large and expressive; body paragraphs stay comfortable to read, approximately 45–75 characters per line.
- Use balanced heading wrapping, normal tracking, deliberate line breaks where needed, and avoid single-word trailing lines. Do not apply negative tracking globally.
- Use tabular numerals for timers, WPM, percentages, ranks, and analytics totals.
- Start with simple spacing tokens and modest conventional corner radii. Background tiles remain square. Content photographs may have subtle rounded corners without becoming squircles.
- Separate sections using space, alignment, scale, and occasional solid color fields. Focus outlines and necessary input boundaries are functional exceptions to the dislike of borders.
- Photography: recognizable projects, team moments, the keyboard, and personal interests. Do not invent stage photos or replace project evidence with generated imagery.

## Responsive and accessibility review

Review at 320/375/390 px phones, tablet, wide desktop, landscape, 200% zoom, and enlarged text. Text must remain readable throughout animations. Persistent photos cannot occupy the only safe space for a mobile headline. Test keyboard focus contrast independently from body text and never remove visible focus just to match the borderless aesthetic.

## First-design correction

Use a name-first splash and genuinely tiny flipping background squares. Keep placeholders to a flat color and a letter, separate from the animated background. The home page leads from the splash into a full-width Featured Projects strip. Recall, Permanence, and Greghouse sit in one row on desktop, with more room for Permanence in the center. The cards stack on phones. Each card shows a muted looping demo clip when available, a scarlet name, a short summary, and the project’s awards. Use a demo still while clips are pending and for reduced motion. An approved winner photo replaces the media on hover or keyboard focus. Feature three stone-blue experience cards below the projects, grouping both BNY internships alongside UCF AI research and Knight Hacks mentoring and outreach. Keep the reserved typing-game area below those sections. Omit the home About promotion. Projects use standardized cards; experiences use chronological cards with descriptions, pictures, and resume-style bullets. Remove eyebrows, decorative section numbering, and redundant subtext.
