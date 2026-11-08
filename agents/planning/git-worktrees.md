# Git worktrees

A worktree is another checkout attached to the same Git repository. Each checkout has its own files, index, and current branch. Commits, branches, and remotes are shared. You can keep the ordinary checkout open in VS Code while Codex works on a separate task, or review a redesign without stashing an unfinished feature. Git normally allows a branch to be checked out in only one worktree at a time. [Git worktree reference](https://git-scm.com/docs/git-worktree)

Use a normal branch for one active task. Add a worktree when keeping two tasks open saves context switching. Start separate Codex sessions in their respective directories and give each one its issue, file scope, and base branch. Keep changes to shared files such as the lockfile or database migrations sequential unless you can coordinate integration.

## Example after `origin/dev` exists

Run these from the primary checkout on your workstation. The example directories are siblings under `port_global`. Choose a location permitted by your environment when running in a sandbox.

```sh
git fetch origin
git worktree add -b feat/12-ghost-cursor ../port-wt-12 origin/dev
git worktree add -b exp/hero-grid ../port-wt-hero origin/dev
git worktree list
```

Open `../port-wt-12` and `../port-wt-hero` separately. Use distinct dev server ports and install dependencies in each checkout. Local untracked files such as `.env.local`, build output, and assets are separate. Set up local or preview configuration per checkout. Only committed planning files appear in a new worktree, so land the workflow and planning docs before depending on them across checkouts.

When the work is merged or intentionally set aside, stop its server and check its status. Remove a clean worktree from the primary checkout with `git worktree remove ../port-wt-12`. Remove the branch separately when you no longer need it. Keep unmerged experiments on their branches until you decide what to do with them. The same approval requirement applies whether the experiment was developed in a worktree or the primary checkout.
