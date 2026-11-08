# GitHub issue and PR templates

Copy these into GitHub as needed. During setup, place the agreed templates under `.github/` so they appear automatically.

## Issue

**Title** describes the outcome, for example “Show the 100 WPM ghost cursor.”

```markdown
## Goal

What should change and who benefits?

## Acceptance criteria

- [ ] Observable behavior
- [ ] Relevant error state or responsive behavior

## Context

Relevant plan, screenshot, or linked issue. Call out any owner decision.
```

## Pull request

```markdown
Refs #<issue>

## Change

What changes for the visitor or maintainer, and why?

## Verification

- Acceptance criteria verified and checks run with results
- Tested revision and preview link when available

## Visual evidence

- Required for UI, UX, or visual changes. Embed screenshots of the affected screens and states here. Include desktop and mobile when both are affected.
- For animation changes, attach a short recording if available and within GitHub’s upload limit. Keep the screenshots either way.
- For changes with no UI, UX, or visual impact, mark this section N/A.

## Release notes

Migration versions, configuration, backup reference, recovery steps, or owner approval when relevant. For changes to public content, note publication and search checks as applicable.
```

For a release PR, summarize the included changes in a short list, include the tested `dev` revision, and use `Closes #<issue>` for issues shipping to `main`. Link any owner or experiment approval. After the release run, record the merged SHA, the deployment link, and the staged and live smoke check results.
