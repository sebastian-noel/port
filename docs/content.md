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

## Resume

`public/resume.pdf` is the contact-free public version of the supplied resume. Private contact text was removed from the page drawing operations, not covered visually. It retains the education, experience, projects, and skills sections, plus public profile links as text. Header and footer resume actions open this PDF in a new tab. `/resume` remains a shareable landing page.

Do not commit the original resume, private contact information, original assets, or secrets. Review text extraction and rendering whenever replacing the public PDF.

## Motion and home layout

The name types once per tab session, then triggers a radial tile flip. The complete accessible heading is present from server rendering. The background uses a viewport-sized, bounded tile field and Web Animations; idle motion flips only three tiles at a time. Reduced motion displays the complete name and suppresses decorative animation. The header pause button cancels background motion, and hidden tabs stop active animation.

The homepage features three projects and three experience highlights above the space reserved for the typing game. Add an approved, optimized WebM or MP4 under `public/media/` and set the project’s `demoClip` to its `/media/` path for a muted loop. Add the approved team photo as `winnerPhoto` using the same fields as a real cover. Until the clips arrive, project cards display their demo thumbnails. No game logic or backend is implemented yet.

## Release

PR #5 holds the accepted first draft. Design polish is still pending, and a production release from `main` requires explicit approval. Protected previews remain noindex and have an empty sitemap. Real media, complete content, game features, and launch checks follow approval in separate scoped PRs.
