# Release rehearsal

The `Release rehearsal` job runs on `dev` pushes after `Verify` passes. It stages a build on `port-rehearsal`, checks the revision, key pages, and résumé PDF, then promotes that build. It checks the rehearsal domain again after promotion.

## Rehearsal setup

1. Open the [rehearsal Production environment](https://vercel.com/sebastian-noel/port-rehearsal/settings/environments/production). Under **Branch Tracking**, set the branch to `dev` and turn off **Auto-assign Custom Production Domains**.
2. In [GitHub environment settings](https://github.com/sebastian-noel/port/settings/environments), create `rehearsal`. Under **Deployment branches and tags**, choose **Selected branches and tags** and add a **Branch** rule for `dev`.
3. Add these **environment secrets** to `rehearsal`.

   | Name                              | Where to get it                                                                                                                                                                              |
   | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `VERCEL_TOKEN`                    | [Vercel account tokens](https://vercel.com/account/tokens). Select the team that owns `port-rehearsal` and use an expiration appropriate for the rehearsal.                                  |
   | `VERCEL_AUTOMATION_BYPASS_SECRET` | [Rehearsal Deployment Protection](https://vercel.com/sebastian-noel/port-rehearsal/settings/deployment-protection). Generate a **Protection Bypass for Automation** secret for this project. |

After setup, merging a reviewed PR into `dev` runs the rehearsal. Check **Release rehearsal** in GitHub Actions for the staging, smoke, and promotion result. If staging or the initial smoke checks fail, fix the failure and rerun on the current `dev` revision. If a post-promotion check fails, inspect the rehearsal deployment and restore the previous build if needed.

## Production setup

1. In [Vercel's Production environment for `port`](https://vercel.com/sebastian-noel/port/settings/environments/production), confirm that **Branch Tracking** is `main` and **Auto-assign Custom Production Domains** is off.
2. In [GitHub Environments](https://github.com/sebastian-noel/port/settings/environments), create `production` and restrict its deployment branches to the `main` branch.
3. Add `VERCEL_TOKEN` as an environment secret. Create it in [Vercel Account Tokens](https://vercel.com/account/tokens) with the scope for the team that owns `port`.
4. Add `VERCEL_AUTOMATION_BYPASS_SECRET` as an environment secret. Generate it in the [production project's Deployment Protection settings](https://vercel.com/sebastian-noel/port/settings/deployment-protection).

Review the exact `dev` preview and record Sebastian's approval before merging a release into `main`. After `Verify` succeeds on the merged commit, the production job finds the staged Git build for that SHA, checks the home page, project case study, experiences page, and résumé PDF, then promotes that exact build. It confirms the domain assignment and checks the public routes again.

If the staged build or checks fail, the current build keeps serving `snoel.dev`. Check **Release production** in the failed Actions run, resolve the issue, and rerun the job for the current `main` commit. If the Vercel token expires or loses access to the team, replace `VERCEL_TOKEN` in the `production` environment before retrying.
