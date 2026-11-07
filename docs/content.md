# Portfolio content

The foundation uses typed records in `app/_content/entries.ts` and shared collection/detail templates. Add one record to create a card, direct URL, resume entry, and (when published) sitemap entry. No routing or layout edits are needed. Structured text sections cover the initial case studies without an MDX dependency; richer authoring can be added when needed.

## Add a project or experience

1. Copy a record and choose `projects` or `experiences`. Use a unique, stable lowercase hyphenated slug. Preserve old URLs with redirects if a slug changes.
2. Verify the summary, context, awards, dates, and personal contribution against source material. Distinguish team results from personal work. Set `featured` to show the entry on Home.
3. Add meaningful body sections and verified HTTPS links. Omit unknown dates, metrics, roles, and links.
4. Put reviewed web-ready media in `public/media/`. Use descriptive lowercase filenames, remove GPS/device metadata, inspect visible private details, and supply accurate alt text and pixel dimensions. Replace `{ placeholder: true }` with `{ placeholder: false, src: "/media/example.webp", alt: "...", width: 1600, height: 1200 }`. Never import original resource directories or private resume copies.
5. Keep `published: false` while reviewing. The build validates slugs, required metadata, HTTPS links, image metadata, and published content completeness. Real covers must also exist on disk (checked in CI).
6. Preview desktop/mobile, keyboard navigation, full-page reload, metadata, and social image. Set `published: true` only for approved content.

## Preview and launch

`site.indexable` in `app/_lib/site.ts` is deliberately false. The entire foundation has `noindex, nofollow`, its sitemap is empty, and draft records are visible for review. Deployment Protection provides access control; noindex alone does not make a page private. After the explicit launch review, enabling indexing removes draft records from all collections, detail routes, Home, and Resume. The sitemap includes only published details and the approved core pages, using `https://snoel.dev`.

Keep search crawlers able to read indexing directives. The initial robots policy disallows GPTBot; it permits ordinary search crawlers. Do not enable indexing on a placeholder preview or use a preview URL as canonical.

The HTML resume is an honest draft generated from the same records. It does not yet include a PDF. Create a public PDF from reviewed contact-free text, inspect extracted text/links/metadata and the visible pages, then add the download link. Do not copy the private source PDF into `public/`.

The first design, biography, individual contribution statements, approved photographs, exact dates, full resume, and downloadable PDF still require review. Motion and the typing game belong to the next milestone.
