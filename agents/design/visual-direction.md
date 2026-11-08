# Visual direction

Status: cornflower blue `#6395ee`, supporting blues/light grays, white text, and photo tiles are confirmed. Sebastian selected coral `#ff8a75` in the first-design correction, replacing amber. Supporting blue tokens and contrast treatments below are proposals.

## Overall character

Friendly, confident, and playful. Give real project images and the tiled photo motif room to define the site. Use a clear reading hierarchy and a few strong compositions rather than filling every gap with decorations. Awards and technical accomplishments supply credibility; large blocks of generic promotional copy do not.

Keep the base canvas flat. The tile grid is made of individual solid-color square surfaces without outlines. Avoid gradient washes, frosted-glass cards, arbitrary semi-transparent layers, ornamental dividers, and capsule tag collections.

## Palette proposal

| Role | Hex | Intended use |
| --- | --- | --- |
| Cornflower base, confirmed | `#6395ee` | Main background and signature color |
| Deep blue | `#244c86` | Readable white-text surfaces, navigation, selected large compositions |
| Medium blue | `#305da4` | Alternate white-text support or a grid tile tone |
| Pale blue | `#b9d3f7` | Sparse background/photo grid tiles |
| Light gray | `#edf2f7` | Occasional quiet surfaces and tile variation |
| White | `#ffffff` | Text on deep/medium blue surfaces |
| Ink | `#142b4a` | Text on the base canvas, light gray, and bright accent buttons |
| Coral, confirmed | `#ff8a75` | Primary actions and selected game/highlight moments |

Use a few named tokens consistently; do not generate dozens of one-off opacity variants. These are possible supporting colors, not an approved final palette.

## White text contrast conflict

Calculated using the WCAG relative-luminance formula on the actual hex values:

| Foreground | Background | Contrast |
| --- | --- | --- |
| White `#ffffff` | Base `#6395ee` | 2.97:1 |
| White `#ffffff` | Deep blue `#244c86` | 8.56:1 |
| White `#ffffff` | Medium blue `#305da4` | 6.51:1 |
| Ink `#142b4a` | Base `#6395ee` | 4.79:1 |
| Ink `#142b4a` | Light gray `#edf2f7` | 12.65:1 |

WCAG AA uses at least 4.5:1 for normal text and 3:1 for large text. White on the exact base misses even 3:1; rounding 2.97 up is not a pass. A brand-name exemption does not solve readability for the rest of the site. [Contrast reference](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

**Current treatment:** preserve cornflower blue as the dominant canvas and use ink on it. The splash has a large centered name without a dark hero panel. Keep a stable blue surface immediately behind text during the tile impulse. Deep blue supports selected flat placeholder covers; pale surfaces support card text.

This adjustment needs Sebastian's visual review; it is not a silent replacement of the requested palette.

## Accent

Coral `#ff8a75` is the sole warm accent. Ink `#142b4a` on coral has approximately 6.20:1 contrast. Use it sparingly for the caret, resume action, current navigation indicator, and timeline marks. Text, icons, and visible focus must remain readable without relying on accent contrast alone.

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

Use a name-first splash and genuinely tiny flipping background squares. Keep placeholders to a flat color and a letter, separate from the animated background. Home work links are small side content, with a blank area reserved for the typing game. Omit the home About promotion. Projects use standardized cards; experiences use chronological cards with descriptions, pictures, and resume-style bullets. Remove eyebrows, decorative section numbering, and redundant subtext.
