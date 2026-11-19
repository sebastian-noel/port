# Content system and asset inventory

Status: easy additions are required. A local validated content collection with MDX bodies is the proposed implementation; a CMS is not needed initially.

Foundation implementation (PR #5): typed records and structured text sections in `app/_content/entries.ts` supply shared cards, details, and compact Home links. This avoids an MDX dependency for the initial compact cases. Validation runs during the build. A future MDX addition remains optional; public authoring instructions are in `docs/content.md`. First records remain drafts with placeholder covers while claims and media are reviewed.

## Authoring model

Each project or experience gets one content directory with structured metadata and a case-study body. Shared templates build the cards, collection pages, and detail pages from that data. These future content directories belong in the application, not inside `agents/`; only planning worksheets live here now.

Proposed eventual paths: `content/projects/[slug]/`, `content/experiences/[slug]/`, and web-ready media under `public/media/` or a selected media host. Choose the exact metadata format during setup. Next.js supports MDX; frontmatter parsing/validation must be configured explicitly rather than assumed to happen automatically. Only trusted repository-authored MDX is compiled. [Next.js MDX](https://nextjs.org/docs/app/guides/mdx).

## Project record

| Field | Purpose |
| --- | --- |
| `slug`, `title`, `summary`, `published` | Stable address, readable card copy, publication state |
| `kind`, `date`, `featuredOrder` | Internal classification, ordering, home selection; classification need not become a pill |
| `role`, `team`, `contributions` | Explain Sebastian's ownership and credit teammates |
| `event`, `awards` | Hackathon name/year and exact award wording where applicable |
| `cover` | Required web image, alt text, dimensions, focal point, placeholder |
| `winningPhoto` | Optional real stage photo, caption, alt text, and independent focal point |
| `gallery` | Images/videos with dimensions, captions, posters, descriptions, and captions/transcript where needed |
| `links` | Optional live demo, GitHub, Devpost, article/video; render only verified working entries |
| `technologies` | Structured information rendered as a short text list when useful |
| `body` | Context, contribution, approach, results, lessons |
| `sources`, `claimStatus` | Internal provenance and unresolved facts, excluded from public output |

`winningPhoto` does not itself imply an award. Require verified award data before enabling the winning-photo card swap. Awarded projects without a photo still show the award text.

## Experience record

Reuse the same media/body conventions. Add `organization`, `roleTitle`, `startDate`, optional `endDate`, verified `current`, `experienceType`, optional `location`, and concise `outcomes`. Describe research, leadership, employment, and experiential courses accurately. Never infer “present” just because an end date is missing.

## Adding an item later

1. Copy the appropriate [project](templates/project.md) or [experience](templates/experience.md) worksheet and gather evidence.
2. Verify dates, links, awards, outcome metrics, and personal versus team contributions.
3. Create the content record with a stable slug and write the compact case study.
4. Select only relevant media from `port_global` or the source project. Export web-ready copies, review the visible frame for private information, and preserve originals outside the app. Follow the [search and privacy rules](../planning/search-visibility.md) for public images.
5. Record alt text, captions, crops, and video posters; add subtitles where dialogue or narration matters.
6. Run content validation for duplicate slugs, missing covers, broken local assets, invalid dates, and missing required metadata.
7. Preview mobile/desktop cards, detail, social preview, and hover/touch alternatives. Publish the record through the normal repository deployment.

No changes to routing, collection markup, or card components should be needed for a routine new record.

## Sources currently available

Exclude class projects from the portfolio. Use only the eight projects listed under the selected section of the local ProjectsGuide.md. The Devpost profile is a supporting source, not permission to expand the catalog. Present the collection as Projects without a hackathon-project label.

The local project guide and supplied resume inform the source inventory. Review project repositories and media before publication.

| Candidate/source | What the guide establishes | Still needed |
| --- | --- | --- |
| `permanence` | Robotics/object permanence; first overall, NVIDIA, and Hugging Face awards | Exact event/date, Sebastian's role, demo, stage photo, verified metrics |
| `recall` | AI memory glasses; second overall | Event/date, contribution details, build/demo media and stage photo |
| `greghouse` | Physical plant monitoring/diagnosis and virtual garden; third overall | Event/date, technical contribution, media, verified metrics |
| `gpk_global` | Student organization site and Discord bot; Sebastian is dev lead | Read its AGENTS.md before source review; role dates, outcomes, public-safe media |
| `sebastian-noel` | GitHub profile README repository | Current public profile facts and links |
| Devpost profile | Public hackathon project listings | Review individual submissions and verify contributions, awards, and media before publication |

Prior context suggests BNY experiential infrastructure work and UCF AI research are experience candidates. Their current details, dates, official role wording, and public descriptions still require source review and Sebastian's confirmation. Do not publish details from memory alone.

Confirmed homepage projects are Permanence, Recall, and GregHouse. Confirmed homepage experiences are BNY, Knight Hacks involvement, and Graphics Programming Knights (GPK) involvement. Use clearly temporary covers, photo placeholders, and link placeholders during development. Leave an unavailable link inactive rather than pointing to an unrelated destination. Replace temporary media and links with verified assets before publication. About-page interests remain to be reviewed. The home splash deliberately has no hero subtitle.

## Asset checklist

- The original resume stays outside the public repo. Use verified public facts to publish `/resume` and generate `/resume.pdf` without private contact details. Check extracted PDF text, links, metadata, and the verified GitHub and LinkedIn destinations before publishing.
- Each selected project's cover image, optional winning stage photo, useful build/process images, and a YouTube demo URL, thumbnail, and short description. Keep the direct link and description usable if the embed fails.
- Personal photo selection for tile patches, with sufficient resolution and crop flexibility.
- Experience images/logos only where permission and relevance are clear; avoid confidential internal screens.
- Keyboard recordings will arrive later. Group samples into `letter`, `space`, `enter`, and `backspace`, with multiple variations per group. Suggested starting point: 4–8 clean short samples per group.
- Original video/audio assets can be large; choose optimized delivery copies for the site. Do not commit raw media collections wholesale.

Track original path, intended page, caption, alt text, crop, and publication suitability when selecting an asset. Strip unnecessary location/device metadata from published photographs.

## Verified first-design revision

Eight selected projects are included as drafts: Permanence, Recall, Greghouse, T.K.'s Revenge, Debt Escape, TideSense, Next Step, and DishDash. Alto, FE AI, and future-project placeholders are excluded by Sebastian's November 19, 2026 request. Each has at least five sourced case-study sections, searchable technology/team/event metadata, and a verified YouTube demo. Roles are shown only where local documents or public Devpost creator notes explicitly identify Sebastian's work. Published status stays false until the existing content/media review and launch gate are complete.

The supplied resume was read for BNY, UCF AI, and GPK dates and bullets. BNY retains UCF experiential-program context. Knight Hacks dates remain unknown and omitted. Null end dates explicitly mean Present; author verified dates rather than inferring them.

The November 14, 2026 public PDF is the updated file explicitly selected by Sebastian, including his approved public email and new LinkedIn slug. Text extraction and rendering were inspected before copying it. Resume actions open that PDF in a new tab. Private source resumes and other private contact details remain excluded.


Permanence refinement (#68): prose is left aligned within a page-centered column, with centered section titles, sticky desktop contents, and compact event/team/technology facts. The third diagram explains observation, last-seen freshness, and depth-supported occlusion instead of routing. Public captions explain the system without author-facing sourcing notes. Diagram motion plays briefly once on entry and respects reduced-motion settings.

Permanence (#70) places Devpost, GitHub, and the owner's LinkedIn post in its introduction. Case-study photographs, including the hero, open in captioned modal views with backdrop, close-button, and Escape dismissal. Its embedded demo stands alone under the heading.
