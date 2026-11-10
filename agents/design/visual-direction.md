# Visual direction

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
| White | `#ffffff` | All site text, including navigation, cards, and controls |

Use dark navy and navy–stone blends beneath white text. Use full-strength stone blue for the Featured Projects strip and footer, with dark backings for white text. Use scarlet underlines for the current navigation page. Use the same navy, white, and red for the social preview image.

## Type and layout

- Choose a distinctive, readable primary family during implementation using the actual hero and body copy. Avoid generic type treatments, fonts strongly associated with AI-generated templates, Instrument Serif, and excessive italic styling.
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

Use a name-first splash and genuinely tiny flipping background squares. Keep placeholders to a flat color and a letter, separate from the animated background. The home page leads from the splash into a full-width Featured Projects strip. Permanence, Recall, and GregHouse sit in one row on desktop and stack on phones. Each card shows a demo still, name, and summary. An approved winner photo replaces the still on hover or keyboard focus when available. Experiences remain in the sidebar beside the reserved typing-game area. Omit the home About promotion. Projects use standardized cards; experiences use chronological cards with descriptions, pictures, and resume-style bullets. Remove eyebrows, decorative section numbering, and redundant subtext.
