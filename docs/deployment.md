# Release rehearsal

The `Release rehearsal` job runs on `dev` pushes after `Verify` passes. It stages a build on `port-rehearsal`, checks the revision, key pages, and résumé PDF, then promotes that build. It checks the rehearsal domain again after promotion.

## One-time setup

1. Open the [rehearsal Production environment](https://vercel.com/sebastian-noel/port-rehearsal/settings/environments/production). Under **Branch Tracking**, set the branch to `dev` and turn off **Auto-assign Custom Production Domains**.
2. In [GitHub environment settings](https://github.com/sebastian-noel/port/settings/environments), create `rehearsal`. Under **Deployment branches and tags**, choose **Selected branches and tags** and add a **Branch** rule for `dev`.
3. Add these **environment secrets** to `rehearsal`.

   | Name | Where to get it |
   | --- | --- |
   | `VERCEL_TOKEN` | [Vercel account tokens](https://vercel.com/account/tokens). Select the team that owns `port-rehearsal` and use an expiration appropriate for the rehearsal. |
   | `VERCEL_AUTOMATION_BYPASS_SECRET` | [Rehearsal Deployment Protection](https://vercel.com/sebastian-noel/port-rehearsal/settings/deployment-protection). Generate a **Protection Bypass for Automation** secret for this project. |

After setup, merging a reviewed PR into `dev` runs the rehearsal. Check **Release rehearsal** in GitHub Actions for the staging, smoke, and promotion result. If staging or the initial smoke checks fail, fix the failure and rerun on the current `dev` revision. If a post-promotion check fails, inspect the rehearsal deployment and restore the previous build if needed.

`snoel.dev` has a separate release path. Keep its automatic domain assignment off while the rehearsal is being validated.
