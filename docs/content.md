# Content and media

Edit `app/_content/entries.ts` to add a project or experience. Collection cards and detail routes are generated from the same records.

- Give each record a stable slug, title, summary, cover, sections, and HTTPS source links.
- Projects support `technologies`, `team`, and `event` for the search field. Search currently matches plain substrings across these fields and the title. Metadata is incomplete; verify it before expansion.
- Experiences support `role`, `startDate` and `endDate` as YYYY-MM, and up to four resume-style `bullets`. Optional `roles` preserve separate role titles and dates within one organization. Collection cards and detail pages share descriptions, role history, bullets, and a Links & resources section. A null end date means Present. Records sort by start date descending; undated records follow. Never invent a date.
- `placeholder: true` identifies a future entry. It is visibly labeled, has no collection-card link, and cannot be published.
- A placeholder cover renders a letter on a flat color. Replace it with an optimized image in `public/media/`, with dimensions and meaningful alt text.
- `published: true` requires real media and body content. All current records are drafts. Drafts appear in protected previews and are excluded once production indexing is enabled.
- Review individual contributions, dates, metrics, photo permission, and content before publication.

The ten project summaries come from Sebastian's public Devpost pages. Experience dates and bullets come from his supplied resume, including UCF's experiential context for BNY. The November 2026 refresh also uses owner-supplied LinkedIn and previous-resume screenshots. LinkedIn supplies role dates where older resume versions conflict; IST is May to July 2026 and FSEC is a Software Engineer Internship from May to September 2025. Keep missing accomplishments explicit, such as `(bullet 2)`, rather than inventing metrics. Resource links point to the supplied paper or LinkedIn experience until direct project resources are supplied. Unknown dates remain absent.

## Contact

The About page links directly to Sebastian's approved public email,
`sebastian@snoel.dev`, using a `mailto:` link. Edit `app/about/page.tsx` to update
the address. The public resume includes this same approved public email.

## Resume

`public/resume.pdf` is the exact updated resume Sebastian selected on November 14, 2026. It includes his approved public email and the updated `linkedin.com/in/snoel-dev` profile. The supplied file was checked for private contact details before copying. Header and footer resume actions open this PDF in a new tab. `/resume` remains a shareable landing page.

Only commit the deliberately selected public resume. Do not commit private source resumes, private contact information, original assets, or secrets. Review text extraction and rendering whenever replacing the public PDF.

## Motion and home layout

The name types on each home visit, then triggers a radial tile flip. The complete accessible heading is present from server rendering. The background uses a viewport-sized, bounded tile field and Web Animations. Reduced motion displays the complete name and suppresses decorative animation. Hidden tabs cancel the active wave.

The experimental homepage has a wide project showcase, with Recall on the left,
Permanence larger in the center, and Greghouse on the right. Desktop reveals run
in the order Recall, Greghouse, Permanence. Below 1200px, the projects stack as
Permanence, Recall, Greghouse, matching source and keyboard order. Three experience rows follow, with separate links for both
BNY internships. The typing-game space is still reserved.

The project section uses a darker navy (`#020f20`) than the landing screen and
wider 16:9 media frames. Only the project name overlays the bottom fade; the longer
`featuredSummary` sits below the media. That copy comes from the local READMEs.
The desktop heading overlaps the otherwise empty space above the left panel,
bringing the project composition closer to the heading. Permanence's three-sentence
homepage description also explains its Jetson hardware, rover action, and live 3D
dashboard. Collection and detail pages retain their concise summaries and existing media.

`featuredAwards` holds each placement, category, submitted-project count, and logo.
Badges overlap the top edge of every video frame; hackathon names stay on the case-study pages.
Shared CSS grid rows align every desktop media frame and card bottom while the
wider Permanence frame grows upward. Equal-sized rounded badges use larger transparent logos on the left,
scaled to the text block with optical alignment offsets. HackUSF, NVIDIA, Hugging Face, and BloomKnights use
the same white alpha-dilation outline as the Knight Hacks IX sigil. On desktop, Recall's badge sits
on the left and tilts left; Greghouse's sits on the right and tilts right. Hover/focus enlarges
badges and moves them outward without changing their resting angles; reduced
motion preserves the static angles and disables the movement.
Permanence's badges form an arch through a raised center badge: NVIDIA left, Best Overall in the middle,
and Hugging Face right. Counts come from Sebastian's supplied resume: 1/212 overall,
1/21 NVIDIA, 1/78 Hugging Face, 2/85 Recall, and 3/86 Greghouse. See
[asset sources](media-assets.md) for the event logos, company SVGs, and selected
Permanence winners collage.

Each project's `demoBrief` describes the clip to supply. Recall and Greghouse still
show labeled placeholders; Permanence uses its approved collage as a static poster.
To add an approved loop:

1. Export a short, silent WebM or MP4 into `public/media/`. Start with 6 to 10
   seconds, 720px resolution, and a target of 1 to 2 MB per clip. Remove the audio
   track and use a 16:9 landscape crop. Keep the important action above the bottom
   title overlay, and check the crop on both desktop and phones.
2. Set the record's `demoClip` to its `/media/` path. Set `demoPoster` to an approved
   optimized WebP or AVIF still with `demoPosterAlt` for a meaningful static fallback.
   Posters render as responsive, lazy-loaded images even without a clip. Without a
   poster, the text placeholder remains the fallback. The build checks that files exist.
3. Verify playback in the actual browser, including mobile, reduced motion,
   background tabs, and an unavailable clip. Project summaries and detail links
   must remain understandable without video.

The small client motion component uses IntersectionObserver and Web Animations,
with no animation dependency or per-frame React updates. Clip sources attach only
when visible; playback pauses offscreen and in hidden tabs. Reduced motion and a
browser's Save-Data preference prevent autoplay. There is no motion button or
simulated video progress line. Hover or keyboard focus lifts and enlarges the
project, zooms the media slightly, and restores its color. Touch devices show color
without requiring hover. Reduced motion disables the lift and zoom. Content remains readable
and linked without JavaScript. Desktop reveals begin after the stage enters farther into the viewport, with
0.95-second entrances spaced 1 second apart. Decorative skeleton frames and text
lines occupy the same grid rows while cards wait, with a left-to-right shimmer while visible. Skeletons fade out in 110 ms before
the card starts appearing, avoiding double exposure. They do not indicate a network request or add screen-reader announcements.
Mobile project entrances last 0.75 seconds. Without JavaScript or with reduced
motion, the real content appears immediately. The reveal is one-time per page mount, and keyboard
focus immediately reveals the focused project or experience.

Sebastian approved this showcase for `dev` after the requested final refinements.
Production remains subject to review of the exact `dev` preview. No game logic or
backend is implemented yet.

The shared footer centers "Made with [heart] by Sebastian" between the copyright and
profile links on desktop. The three groups stack and remain centered on phones.

## Release

PR #5 holds the accepted first draft. Design polish is still pending, and a production release from `main` requires explicit approval. Protected previews remain noindex and have an empty sitemap. Real media, complete content, game features, and launch checks follow approval in separate scoped PRs.
