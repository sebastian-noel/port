# Port agent instructions

## Project and current stage

Port is Sebastian Noel's personal portfolio at `snoel.dev`. Repository setup, the Next.js scaffold, CI, and the Vercel rehearsal are complete. Sebastian accepted the revised portfolio as a first draft and requested more polish before release. Track the first draft in PR #5. Sebastian approved merging the baseline into `main`. A public launch requires separate approval. Review the [coding workflow](planning/coding-workflow.md) before implementation or GitHub setup.

Read [README.md](README.md), [planning/brief.md](planning/brief.md), and [planning/decisions.md](planning/decisions.md) before continuing. Use the [progression checklist](planning/progression.md) for the next milestone and GitHub Issues for individual work. Record new decisions in the decision log and update the affected specification together.

## Workspace boundaries

- Planning, working notes, and planning templates belong under `agents/`.
- Read supporting resources outside the repository selectively. Copy only assets deliberately selected for the website.
- Read the local `ProjectsGuide.md` before consulting other projects, when it is available. Treat other project folders as read-only.
- Exclude class projects from the portfolio. Use [Sebastian’s Devpost profile](https://devpost.com/sebastian-noel) as the public source for hackathon projects, especially those unavailable locally.
- Embed project demos from YouTube. Selected site sections may use optimized local clips. Launch on Vercel Hobby and revisit AWS or Sebastian’s spare Mac mini if its limits become restrictive, subject to the $0 budget.
- Do not edit another project's code, instructions, assets, dependencies, or Git state.
- Preserve unrelated working-tree changes.

## Requirements and decisions

- A **confirmed requirement** comes directly from Sebastian. A **proposal** is an implementation or design recommendation awaiting discussion. An **open question** has no settled answer. Never silently promote a proposal to a confirmed requirement.
- Next.js, Vercel hosting, the `snoel.dev` domain through Cloudflare, and the exact base color `#6395ee` are confirmed.
- Use coral `#ff8a75` with the confirmed blue base. The home page centers the typed name, followed by a blank typing-game area and compact project/experience links at the side. Do not add an About promotion to home, eyebrows, decorative numbering, or generic subtext. The wordmark is `snoel.dev`.
- Hosting and every additional service must cost $0. Use actual free plans, not paid trials, paid tiers with credits, or pay-as-you-go defaults. Design for quota limits; do not assume uninterrupted unlimited service.
- Use 30-word passage completion as the working interpretation of Sebastian’s latest length instruction. Passages use lowercase letters and spaces. Keep the 100 WPM win threshold and show a live ghost cursor at that pace. Count confirmed fraudulent attempts as losses. The monthly leaderboard accepts only verified wins.
- Supabase Free is the selected backend, including its Postgres database. Do not add Upstash Redis to the initial stack. Owner sign-in method, monthly reset timezone, and detailed scoring/timeout behavior remain proposals.
- Keep all UI decisions usable on mobile, with keyboard access and reduced-motion alternatives. Review responsive behavior and distinctive typography in the actual implementation. A separate visual prototype is outside the current scope.
- Project and experience details must have their own shareable URLs. Content additions should not require rebuilding page layouts.
- Do not invent dates, metrics, ownership claims, testimonials, awards, employment status, or project media. Separate Sebastian's contributions from team outcomes.
- Use current local source documents and project evidence when writing portfolio copy. Prior chat context is a lead to verify, not publication-ready evidence.
- Sebastian approved his contact email for public use and wants it available on About. Keep his phone number and other private contact details out of public artifacts and Git history. Publish a contact-free, indexable resume and follow the [search and privacy plan](planning/search-visibility.md) for public pages, profiles, and media.
- Use plain, concise site copy; avoid em dashes in drafted personal copy unless Sebastian requests them.

## Git and review

- Use `main` for production and `dev` for integrated work. Use task branches for routine changes and `exp/` for experiments.
- Require Sebastian’s explicit approval for the specific experiment before integrating any of its changes into the release path, including cherry-picked or copied changes. Codex may merge routine releases after the documented review and CI checks.
- Keep code readable and use short, single-line comments where they explain important intent.

## Implementation principles for later work

- Use the blue grid, real project photography, restrained typography, and purposeful motion as the visual identity.
- Protect reading and navigation from decorative animation. Preserve instant access to resume, GitHub, and LinkedIn.
- Treat game counters, scoring, leaderboard ranking, and authorization as server-owned decisions. Client-side estimates are not authoritative.
- Store secrets only in appropriate environment configuration, never in Markdown, client bundles, or public content.
- Keep public game data separate from private attempt records and private analytics.
- Verify framework/provider capabilities and plan limits at implementation time; research in this folder is dated, not a permanent guarantee.
- Use relevant acceptance criteria in [planning/roadmap.md](planning/roadmap.md) when implementation begins.

## Instruction discovery

The root `AGENTS.md` directs implementation sessions to this file when the planning directory is available. Track shared planning documents here. Review new material for publication and keep private working notes and original assets outside the public repository.
