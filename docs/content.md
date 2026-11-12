# Content and media

Edit `app/_content/entries.ts` to add a project or experience. Collection cards and detail routes are generated from the same records.

- Give each record a stable slug, title, summary, cover, sections, and HTTPS source links.
- Projects support `technologies`, `team`, and `event` for the search field. Search currently matches plain substrings across these fields and the title. Metadata is incomplete; verify it before expansion.
- Experiences support `role`, `startDate` and `endDate` as YYYY-MM, and resume-style `bullets`. A null end date means Present. Records sort by start date descending; undated records follow. Never invent a date.
- `placeholder: true` identifies a future entry. It is visibly labeled, has no collection-card link, and cannot be published.
- A placeholder cover renders a letter on a flat color. Replace it with an optimized image in `public/media/`, with dimensions and meaningful alt text.
- `published: true` requires real media and body content. All current records are drafts. Drafts appear in protected previews and are excluded once production indexing is enabled.
- Review individual contributions, dates, metrics, photo permission, and content before publication.

The ten project summaries come from Sebastian's public Devpost pages. Experience dates and bullets come from his supplied resume, including UCF's experiential context for BNY. Unknown dates remain absent.

## Contact

The About page links directly to Sebastian's approved public email,
`sebastian@snoel.dev`, using a `mailto:` link. Edit `app/about/page.tsx` to update
the address. The public resume remains contact-free.

## Resume

`public/resume.pdf` is the contact-free public version of the supplied resume. Private contact text was removed from the page drawing operations, not covered visually. It retains the education, experience, projects, and skills sections, plus public profile links as text. Header and footer resume actions open this PDF in a new tab. `/resume` remains a shareable landing page.

Do not commit the original resume, private contact information, original assets, or secrets. Review text extraction and rendering whenever replacing the public PDF.

## Motion and home layout

The name types on each home visit, then triggers a radial tile flip. The complete accessible heading is present from server rendering. The background uses a viewport-sized, bounded tile field and Web Animations. Reduced motion displays the complete name and suppresses decorative animation. Hidden tabs cancel the active wave.

The experimental homepage has a wide project showcase, with Recall on the left,
Permanence larger in the center, and Greghouse on the right. Desktop reveals run
in the order Recall, Greghouse, Permanence. Below 900px, the projects stack in that
same reading order. Three experience rows follow, with separate links for both
BNY internships. The typing-game space is still reserved.

Each featured project's `demoBrief` describes the clip to supply. These labeled
placeholders replace the old YouTube thumbnails on Home. Collection and detail
pages retain their existing media. To add an approved loop:

1. Export a short, silent WebM or MP4 into `public/media/`. Start with 6 to 10
   seconds, 720px resolution, and a target of 1 to 2 MB per clip. Remove the audio
   track, crop intentionally, and check that the important action remains visible
   in both the desktop portrait frame and the phone landscape frame.
2. Set the record's `demoClip` to its `/media/` path. Set `demoPoster` to an approved
   optimized WebP or AVIF still for a meaningful static fallback. Without a poster,
   the text placeholder remains the fallback. The build checks that files exist.
3. Verify playback in the actual browser, including mobile, reduced motion, pause,
   background tabs, and an unavailable clip. Project summaries and detail links
   must remain understandable without video.

The small client motion component uses IntersectionObserver and Web Animations,
with no animation dependency or per-frame React updates. Clip sources attach only
when visible; playback pauses offscreen, in hidden tabs, and with the sticky Pause
motion control. Reduced motion and a browser's Save-Data preference prevent
autoplay. Placeholder progress accents pause offscreen. Content remains readable
and linked without JavaScript. The reveal is one-time per page mount, and keyboard
focus immediately reveals the focused project or experience.

This design is isolated on `exp/homepage-showcase` for review in issue #39. It is
not approved for `dev` or `main`. No game logic or backend is implemented yet.

## Release

PR #5 holds the accepted first draft. Design polish is still pending, and a production release from `main` requires explicit approval. Protected previews remain noindex and have an empty sitemap. Real media, complete content, game features, and launch checks follow approval in separate scoped PRs.
