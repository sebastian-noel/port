# Database releases and operations

Port serves the public portfolio from Vercel and uses Supabase for ranked typing and private analytics. Keep public pages readable during a database outage. Set up these controls alongside the backend before enabling production writes.

## Database changes

1. Commit versioned SQL migrations in `supabase/migrations/`. Use synthetic fixtures with the local Supabase stack. CI must test a clean rebuild and the relevant database behavior. For a production migration, also rehearse applying the change from the previous schema with representative existing rows. Check row-level security, grants, functions, and scheduled jobs where affected. [Supabase migration workflow](https://supabase.com/docs/guides/deployment/database-migrations) · [Database tests](https://supabase.com/docs/guides/local-development/cli/testing-and-linting)
2. In the release PR, record the migration versions, target project, expected impact, test results, backup location reference, and recovery steps. Obtain Sebastian’s approval for the exact migration. Apply it from the reviewed `main` revision in an explicit production maintenance step, separate from ordinary Vercel deployment. The operator verifies the production project ref and pending migration list before applying. Keep production database credentials out of application CI, PRs, and previews.
3. Add compatible schema changes before deploying code that uses them. Verify that both the live app and the candidate work with the updated schema. If a candidate reaches staging before its approved migration is applied, keep it off the public domain and rerun its checks after maintenance. Ship removals or incompatible changes in a later reviewed release once the old code is retired and the rollback target is compatible. Schedule a separate maintenance window if a change cannot preserve compatibility.
4. If a migration fails, stop the release, check what committed, and reconcile before retrying. Prefer a reviewed corrective migration when data can be preserved. Before restoring an export, pause affected writes and assess what would happen to writes accepted since the snapshot. A Vercel rollback restores the prior app deployment. Database recovery is a separate step. [App release and recovery](../planning/coding-workflow.md#production-release-and-recovery)

## Private exports and recovery

- Start with a weekly encrypted export and an additional export immediately before production migrations or bulk corrections. Retain four weekly snapshots and keep the pre-change snapshot through release verification and the next verified export. Store copies in owner-controlled storage separate from the database and the public repo. Record only safe references, date, schema revision, and restore verification in release notes.
- Rehearse a restore into a disposable database before launch and after material changes to the export format or schema. Check expected tables, policies, counts, leaderboard and analytics consistency, and scheduled job configuration. Keep a private copy of any provider setup needed for recovery, such as Auth and Cron configuration. Check what the export actually includes. [Supabase database backups](https://supabase.com/docs/guides/platform/backups)

## Monitoring and degraded operation

| Signal | How to check | What to do |
| --- | --- | --- |
| Bad release | Required CI, staged smoke checks, then live revision and route checks | Leave the prior deployment in place if staging fails. Use the app recovery procedure if the live release regresses. |
| Public site or route failure | Daily read-only GitHub Actions check of the homepage and one stable case study after launch. Verify that failures notify Sebastian. | Check domain, deployment, and provider status. Review the last successful run during weekly checks because GitHub can disable scheduled workflows in inactive public repositories. |
| Stalled attempt expiration | Record the last successful Supabase sweep in one private status row. Show a warning in the owner dashboard when it is over one minute old during normal operation. Use Supabase Cron history for diagnosis. | Pause new ranked starts if settlement cannot keep up. Repair or resume the sweep, catch up expired attempts, and reconcile totals before reopening. |
| Free-tier pressure | Review Vercel and Supabase usage weekly at launch and after traffic spikes. Investigate any relevant meter at roughly 80% of its allowance. | Keep services on Free. Reduce traffic or pause the affected dynamic feature as needed while preserving portfolio access. |

Use a server-controlled setting in Supabase to pause new ranked attempts. Check it inside the start transaction and fail closed when the database or setting is unavailable. Keep already accepted attempts eligible to finish or settle when the backend can process them. Use a clear unavailable state and keep portfolio routes independent. Rehearse pause, recovery, and reopening in isolation. Record the production toggle and recovery steps in `/docs` once implemented. [GitHub scheduled workflow behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)
