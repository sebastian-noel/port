# Coding workflow

Sebastian is the sole developer and uses Codex for implementation and review. GitHub Issues track work, pull requests capture changes, and GitHub Actions runs checks on every branch push. Aim for under 15 minutes for a simple change when review and verification fit. Keep the change pending if a check needs more time or fails. The branch and approval rules below reflect Sebastian’s instructions. Merge methods, release gates for sensitive changes, and deployment details are recommendations to adopt during setup.

## First draft review

Sebastian accepted the revised portfolio as a first draft and requested more polish. Review the baseline in draft PR #5. An explicit production release approval is required before merging into `main`, promoting a deployment, or deploying to production. This takes precedence over general routine-merge permission below.

## Branches and merge permissions

| Branch | Starts from | How changes move forward |
| --- | --- | --- |
| `main` | Existing production branch | Keep as the default branch. Routine releases arrive through a `dev` → `main` PR. A merge here starts the production pipeline once release automation is configured. |
| `dev` | `main` | Integration branch for work ready to consider for release. Land small PRs from task branches here. Codex may merge ordinary release PRs after review and passing checks. |
| `feat/<issue>-<name>`, `fix/<issue>-<name>`, `chore/<issue>-<name>`, `docs/<issue>-<name>` | Latest `dev` | One issue or cohesive change per branch. Squash merge the PR into `dev`, then clean up the branch. |
| `exp/<name>` | Latest `dev` or a deliberately chosen baseline | Use for redesigns or optional features. Keep experimental work isolated until Sebastian explicitly approves the specific change for promotion. |
| `hotfix/<issue>-<name>` | Latest `main` | Exceptional path for a production incident. Review through a PR into `main`, then merge `main` back into `dev` before the next release. Apply the same risk and approval rules. |

Use PRs for both long-lived branches. Use a merge commit for `dev` → `main` so Git retains the shared history across successive releases. Keep `dev` after each release. If production has a hotfix or revert absent from `dev`, bring it into `dev` and recheck the release diff.

The experiment gate applies to the **change itself**, including copied or cherry-picked code. To promote an experiment, show Sebastian the relevant diff and preview, record his explicit approval against that scope in the issue or PR, and land only the approved change into `dev` through a normal PR. Approve materially changed scope again. The release PR checks all included changes for this approval. A branch-name rule alone cannot enforce provenance.

## From issue to release

1. Open an issue for a meaningful change. Give it a desired outcome and observable acceptance criteria. Use a small label set such as `feature`, `bug`, `experiment`, and `needs-owner`. Use assignee and open/closed state before adding a project board.
2. Give Codex the issue number, base branch, and relevant plan links. Have it read the project instructions, inspect existing code, and work in one task branch or linked worktree. Establish a root `AGENTS.md` pointer to the planning index as part of the later setup.
3. Open a draft PR into `dev` when feedback would help. Explain the behavior change, record actual checks and their results, and include the required screenshots for UI, UX, and visual changes. Use `Refs #42` in PRs to `dev`.
4. Review the diff against its target, preferably from a fresh Codex review context. The local CLI supports `codex review --base origin/dev` and `codex review --base origin/main`. Check acceptance criteria, unintended changes, and any special review gate. Fix blockers and recheck the current diff when it changes.
5. Merge the task PR after checks pass. When `dev` contains a coherent release, open or update one `dev` → `main` PR. Review the complete diff so unready work cannot ride along. Confirm `dev` includes the current production changes, verify CI and relevant preview results for the revision being merged, and include `Closes #42` for issues shipping in this release. GitHub applies closing keywords on PRs targeting the default branch. If deployment later fails, track it on the release PR or reopen the issue as appropriate. [GitHub issue linking](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue)
6. After merge, follow the production pipeline below. Report the release PR, deployment revision, and verification result. Mark the release live only after confirming the revision and smoke checks on `snoel.dev`.

Use direct names, small functions, and short, single-line comments at important points where the reason is easy to miss. Examples include why attempt settlement must be atomic or why a preview bypasses production analytics. Prefer readable code for ordinary operations. Keep dependency and formatting churn out of unrelated PRs.

## Visual evidence in PRs

Include screenshots directly in the PR description for every UI, UX, or visual change before marking the PR ready for review or merging. Capture the actual changed interface and relevant states. Include desktop and mobile views when both are affected, and before-and-after screenshots when the comparison helps. Apply this to task, experiment promotion, and release PRs. Release PRs can reuse verified screenshots from the included changes when they still match the release.

For animation changes, also attach a short screen recording when available and within GitHub’s upload limit. When a recording is unavailable, screenshots of useful states are enough. Preview links can supplement the screenshots. Use sample data when capturing private or admin views.

## Documentation PRs

Use the repository’s `/docs` directory for documentation about the implemented site, such as local setup, content authoring, and maintenance. Keep planning, proposals, and agent guidance in `agents/`.

- Include documentation updates in the same PR when a code change affects behavior, setup, or maintenance instructions.
- For a standalone documentation update, open a PR from `docs/<issue>-<name>` into `dev`. Use the standard PR template and explain what the reader can now do or understand. Small typo fixes can share an existing issue or link directly to the affected page.
- Verify changed links, paths, and command examples as applicable. Docs-only PRs follow the same CI and merge process. If documentation describes an experiment, keep it on the `exp/` branch until Sebastian approves promotion.

## Human review and agent approval

Codex may review PRs and submit a GitHub approval when the acting identity is eligible. GitHub blocks PR authors from approving their own PRs. A fresh Codex session provides a fresh review, but the same GitHub identity is still the author. For a solo repository, require PRs and passing CI where available and use a zero required-approval count. Record review findings in the PR and avoid granting an automation token write access solely to manufacture an approval. [GitHub review rules](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/approving-a-pull-request-with-required-reviews)

| Decision | Who makes it |
| --- | --- |
| Routine scoped code and content changes with passing checks | Codex can implement, review, and merge through the PR process. |
| Promotion of any experiment | Sebastian explicitly approves the specific change. This is required even if the change reaches production indirectly. |
| First public launch, major design or public copy decisions, auth/privacy or sensitive data changes, production migrations, billing and deployment configuration | Bring Sebastian a reviewable diff or preview and obtain approval before merging or applying the sensitive change. Record approval on the PR or issue. |

For routine work, post one compact update per meaningful milestone with the issue/PR link, visible change, verification, and current status. Ask for input at a concrete decision point. A suitable release update is “PR #18 merged and deployed. The project cards now reveal the team photo on hover or tap. CI passed and I checked the mobile toggle.”

## CI and deployment

**Public repository setup:** Sebastian has made the repository public. Use GitHub Free branch protections and environment restrictions with standard hosted runners. Review files and media for publication before adding them, especially resume copies, environment files, and planning notes. [Branch protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) · [Deployment environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments) · [Actions billing](https://docs.github.com/en/actions/concepts/billing-and-usage)

- **Every branch push:** Run Actions CI on a standard Linux runner. Use the pinned runtime and locked dependency install, then formatting check, lint, type check, available tests, and production build as those scripts become available. Cancel superseded CI runs on the same ref. Keep checks free of production secrets and services.
- Require a PR, a current base, and a stable CI check on the proposed merge into `dev` or `main`. Apply protections to administrators and block force-pushes and deletion on both long-lived branches. Have the required check report failure if any required job fails or is skipped. Keep fork PR checks read-only and free of deployment credentials. [GitHub required checks](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks)
- Verify the affected behavior in a local or hosted preview before merging into `main`. Use the relevant checks in the [acceptance matrix](roadmap.md#acceptance-matrix-for-implementation). Deploy `exp/` only when a preview is useful. Use fixtures or a separate backend for previews so game and analytics tests leave production data untouched.
- On a push to `main`, require successful CI for the merged SHA before a separate deployment job can start. Keep Vercel credentials in a GitHub `production` environment restricted to `main`. Serialize deployments and confirm that the candidate is still the latest `main` revision before promotion. Disable duplicate Git-driven production deployments when Actions owns the production path. [Vercel Actions guide](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel) · [Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration)
- Apply production migrations through the separate [database release procedure](../engineering/release-operations.md#database-changes). Verify the required schema before promoting a migration-dependent candidate.

### Required checks by milestone

| When | What blocks the merge or release |
| --- | --- |
| Scaffold and portfolio | Run formatting, lint, types, build, and available tests in branch CI as the scripts are added. Require the same checks for protected-branch PRs and the merged `main` SHA. Add content validation and a small browser smoke suite for navigation, a direct case-study URL, and the resume as those routes become available. |
| Ranked typing | Add a required integration suite against local Supabase on protected-branch PRs and the merged `main` SHA. Rebuild from migrations. Cover the 100 WPM boundary, retries without double-counting, concurrent settlement, month rollover, rejected direct writes, and the ranked-start pause. Use synthetic data. |
| Private analytics | Extend the required checks to verify anonymous and signed-in non-owner denial on the dashboard, direct endpoints, and database access paths. Check cache isolation, event deduplication, and that tracking failures leave links usable. |
| UI and first launch | Review affected states in a preview and attach evidence to the PR. Check actual iOS Safari and Android Chrome native input for typing or audio changes. Review public copy, photos, both resume formats, and indexability before first launch. [Acceptance matrix](roadmap.md#acceptance-matrix-for-implementation) · [Search checks](search-visibility.md#launch-and-follow-up) |

Keep the required job present on every protected-branch PR. Use standard runners and synthetic data, and keep production secrets scoped to trusted deployment or maintenance operations. Include workflow and permission changes in owner review. Require the suite to pass once its feature exists.

### Production release and recovery

1. Stage the merged SHA with `vercel deploy --prod --skip-domain`. Protect its deployment URL with Vercel Authentication. Use the automation bypass header from a production environment secret for CI requests. [Staging a production build](https://vercel.com/docs/cli/deploying-from-cli#deploying-a-staged-production-build) · [Deployment protection](https://vercel.com/docs/deployment-protection) · [Automation bypass](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation)
2. Smoke-test that deployment URL for expected content on key routes and relevant public assets. Check anonymous access to protected routes once those routes exist. Verify game and analytics writes in the isolated preview. Keep staging and production smoke checks read-only and exclude their traffic from analytics.
3. Promote the same staged deployment with `vercel promote` only after the checks pass. A failed stage or smoke check leaves the current deployment serving `snoel.dev`. After promotion, check the live domain for the expected revision and repeat the core smoke checks. [Vercel promote](https://vercel.com/docs/cli/promote)
4. If the live check finds a regression introduced by the release, verify that the previous deployment is compatible with current configuration and data, then restore it with Vercel Instant Rollback and recheck the live domain. Follow with a revert or fix PR so Git and production converge. On Hobby, Instant Rollback can restore the immediately previous deployment. [Vercel Instant Rollback](https://vercel.com/docs/instant-rollback)

**Fallback if the repository returns to private:** If the account lacks private branch protections or protected environments, enforce the same review and CI checks before merges through the documented process. Keep GitHub Actions for CI and use Vercel’s Git integration for automatic production delivery from `main`. This avoids putting a production deployment token in repository-wide Actions secrets. Git-driven deployment starts independently of the post-merge Actions run unless an available Vercel deployment check is configured. Verify that capability before relying on it, and gate merges on green PR checks either way. Monitor private Actions usage within the included allowance and keep paid overages disabled. [GitHub environment availability](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments) · [Vercel Git deploys](https://vercel.com/docs/git/vercel-for-github) · [Vercel deployment checks](https://vercel.com/docs/deployment-checks)

During setup, exercise the release path with sample content before routing public traffic to it. Verify that failing CI blocks deployment, a failing staged smoke check leaves the domain assignment unchanged, and an `exp/` push cannot deploy to production. Rehearse a successful promotion, a second `dev` release under branch protections, and recovery before first launch.
