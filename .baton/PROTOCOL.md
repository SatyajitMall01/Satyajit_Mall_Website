# Baton Protocol — Mobile/Desktop Parallel Track

Two Claude Code chats work in parallel on isolated git worktrees:

- **Mobile track** → `../Satyajit_Mall_Website-mobile` on branch `cases2-mobile`
- **Desktop track** → `../Satyajit_Mall_Website-desktop` on branch `cases2-desktop`

Both feed into integration branch `cases2`, which then flows to `main` + `master` per the standard push protocol (see CLAUDE.md).

---

## Two-Tier Baton

| Tier | File | Purpose | Sync mechanism |
|---|---|---|---|
| **Live** | `~/.satyajit-baton.md` | Real-time append-only event log. Heartbeat every action. | Direct file read/write. Both chats poll on demand. |
| **Durable** | `.baton/STATUS.md` (in repo) | Snapshot of milestones, current owner, blocking tasks. | Committed to `cases2-mobile` or `cases2-desktop` and merged via `cases2`. |

The live file is for "what's happening right now" — the durable file is for "what was decided / accomplished."

---

## Claiming Work

Before starting any task that touches shared concerns (e.g. data files, shared components, design tokens):

```bash
.baton/scripts/baton-claim.sh "<actor>" "<task description>"
```

This appends to `~/.satyajit-baton.md`:

```
2026-05-09T18:23:01Z  [mobile]   CLAIM   Refactor InformantsPage filter chip mobile layout
```

Other chat reads the file before starting overlapping work. If conflict, defer or ask user.

---

## Self-Merge Gate (build + test pass)

Either chat may merge their branch into `cases2` AFTER passing the gate:

```bash
.baton/scripts/baton-verify-merge.sh
```

This script:

1. Runs `cd frontend && npx vite build` — must exit 0
2. Fetches latest `cases2` and runs `git merge --no-commit --no-ff cases2` to detect conflicts — must succeed
3. Aborts the test merge (`git merge --abort`)
4. If both gates pass: real merge into `cases2`, push `cases2`, then `main`, then `master`
5. Logs `SUCCESS` or `FAIL <reason>` to live baton

If conflict or build fails, script exits non-zero — chat must fix on its own branch and retry.

---

## Reading the Other Side's Work

To pull peer's branch into your worktree (read-only inspection, NOT merge):

```bash
git fetch origin
git log origin/cases2-mobile --oneline   # if you're desktop track
git diff cases2-desktop..origin/cases2-mobile -- frontend/src/components/CasesPage.jsx
```

To merge peer's branch through `cases2` (recommended path), wait for them to run their merge gate. Then `git pull origin cases2` into your branch and rebase or merge as needed.

---

## Conflict Resolution

If two chats edit the same file in conflicting ways and the merge gate detects it:

1. Script aborts. Live baton logs `FAIL conflict in <path>`.
2. Both chats stop. User decides which side wins or asks for a reconciliation pass.
3. After human decision, the losing side rebases on `cases2` and resolves locally before retrying gate.

**Never force-push.** Never delete `cases2-mobile` / `cases2-desktop` without user approval.

---

## Roles

- **Mobile track** owns: anything inside `MobileCasesView`, `MobileInformantsView`, mobile tuning panels, `< 768px` styling, `?tune=1` query param logic.
- **Desktop track** owns: anything inside `DesktopCasesView`, `DesktopInformantsView`, hover effects, 3D Framer Motion, `>= 768px` layouts.
- **Shared (coordinate via baton CLAIM first)**: `CASES_DATA` array, `INFORMANTS_DATA` array, `mock.js`, design tokens (SWISS/TELE/colors), routes in `App.js`, `index.css` global rules.
