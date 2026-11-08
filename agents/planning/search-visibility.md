# Search visibility and publication privacy

Make `snoel.dev` the authoritative public source for Sebastian Noel’s name, work, resume, and selected photos. Help people find the relevant Port page and Sebastian’s public LinkedIn and GitHub profiles when searching by name or for a specific project or experience.

## Indexable pages and images

- Use `https://snoel.dev` as the canonical origin and redirect `www` if configured. Give Home, About, Projects, Experiences, Resume, and each published detail page an explicit title, description, heading, canonical URL, and social image. Use descriptive URLs and ordinary HTML links. Render the name, role descriptions, contributions, and verified outcomes in the initial HTML so they are readable even without the intro animation or JavaScript.
- Generate `sitemap.xml` from the published, canonical pages, including `/resume`. The page links to the indexable `/resume.pdf` download. Leave out drafts, previews, and private or internal routes. Keep protected previews behind authentication and require server-side authorization for the owner dashboard and its APIs.
- Add `ProfilePage` structured data to About with Sebastian as its `Person` entity. Use a stable identifier such as `https://snoel.dev/about#sebastian-noel`, plus his public name, selected portrait, and verified `sameAs` profile links. Match the markup to the visible page. Link the verified GitHub, LinkedIn, and Devpost profiles from About and link the relevant profiles from the resume. On profiles Sebastian controls, verify what an anonymous visitor can see and add `snoel.dev` as the website link. [Google profile page markup](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- Publish a reviewed portrait on About and relevant project, experience, and event photos on their own pages. Use standard HTML images with crawlable `src` URLs, descriptive filenames, accurate alt text, and captions when helpful. Give decorative grid versions empty alt text where appropriate and make the selected images available elsewhere as ordinary content images. Export web-ready copies without GPS or unnecessary device metadata and review the visible frame for private details. [Google Images best practices](https://developers.google.com/search/docs/appearance/google-images)

## Web-enabled AI search

Write clear, factual summaries that connect Sebastian to the work, role, dates, and outcomes. Give readers and search tools primary evidence such as a verified project repo, demo, or event page. Keep public content accessible to Googlebot, Bingbot, and OpenAI’s `OAI-SearchBot` across `robots.txt` and any Cloudflare bot settings. Disallow OpenAI’s `GPTBot` as the initial training-crawler policy. Google’s AI search features use the normal Search indexing and snippet requirements. Use the same public pages as the source of truth for AI search. Indexing, rankings, image placement, and AI citations depend on each service. [Google AI search guidance](https://developers.google.com/search/docs/appearance/ai-features) · [OpenAI crawler controls](https://developers.openai.com/api/docs/bots) · [Bing AI Performance](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c)

## Keep personal details out of search

| Material | Publication rule |
| --- | --- |
| Name, public roles and projects, verified profiles, approved photos | Publish on the relevant public pages and include in search metadata where useful. |
| Approved contact email | Publish in the About contact section. Its presence in Git commit metadata is acceptable. |
| Phone number and other private details | Keep out of public page text, PDFs, metadata, JSON-LD, client payloads, screenshots, and public Git history. Keep the contact version for direct sharing. |
| Public resume | Publish readable, indexable HTML at `/resume` and a downloadable, indexable PDF at `/resume.pdf`. Derive both from the same reviewed public facts. Include verified social links, with private contact information removed. |

Generate the public PDF from contact-free source text. Review the PDF’s extracted text, links, and document metadata, then check the visible pages before committing or deploying it. Keep the original contact copy and other private source material out of the public repo, including Git history and public CI artifacts. Check public LinkedIn and GitHub profile fields and commit metadata for private contact details. When replacing a previously published contact copy, remove it at the source. Copies hosted by others can still appear in search.

## Launch and follow-up

- [ ] Check `robots.txt`, `sitemap.xml`, canonical tags, titles, image responses, and the About page’s structured data on the protected candidate, then on the live domain. Verify both public resume formats load and are eligible for indexing on `snoel.dev`. Check generated pages and assets for accidental disclosure.
- [ ] Verify `snoel.dev` in Google Search Console and Bing Webmaster Tools. Submit the sitemap to both and inspect the homepage, About, Resume, and representative project and experience pages. Check that key photos are available from indexable pages. [Google sitemap submission](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) · [Bing Webmaster Tools](https://www.bing.com/webmasters/)
- [ ] After crawl processing, check results for `Sebastian Noel`, `Sebastian Noel resume`, `Sebastian Noel LinkedIn`, `Sebastian Noel GitHub`, and representative work such as Permanence. Review Google Images and try a web-enabled AI query with citations. Check Search Console for indexing exclusions and file issues for errors Port can fix.
- [ ] If private information appears in a result from Port, replace or remove the affected source, then use Search Console’s Removals tool for urgent suppression. Check that the underlying change persists after recrawling. For a third-party copy, contact the publisher about its source. [Google removal guidance](https://developers.google.com/search/docs/crawling-indexing/remove-information)
