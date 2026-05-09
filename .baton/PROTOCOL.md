# Baton Protocol — Three-Chat Topology (Master + Mobile + Desktop)

Three Claude Code chats coordinate via shared baton:

| Chat | Worktree | Branch | Role |
|---|---|---|---|
| **master** | `Satyajit_Mall_Website` | `cases2` | Orchestrator. Assigns tasks. Final review. Override authority. |
| **mobile** | `Satyajit_Mall_Website-mobile` | `cases2-mobile` | Executor. Mobile-only changes. |
| **desktop** | `Satyajit_Mall_Website-desktop` | `cases2-desktop` | Executor. Desktop-only changes. |

Workers feed into `cases2` via gated merge. Master controls the integration branch and pushes to `main` + `master` (the GitHub branches).

---

## Two-Tier Baton

| Tier | File | Purpose |
|---|---|---|
| **Live** | `~/.satyajit-baton.md` | Append-only event log. All three chats write/read. Format: `ISO8601  [actor]  EVENT  message` |
| **Durable** | `.baton/STATUS.md` | Milestone snapshot. Committed and merged through `cases2`. |

---

## Event Vocabulary

| Event | Who emits | Meaning |
|---|---|---|
| `ASSIGN`  | master  | Master delegates a task to a worker |
| `CLAIM`   | worker  | Worker accepts/declares intent before editing |
| `BLOCKED` | worker  | Worker hits a dependency / awaits master ruling |
| `READY`   | worker  | Worker finished, ready for merge gate |
| `GATE`    | worker  | Merge gate started (build + conflict check) |
| `PASS`    | worker  | One gate passed |
| `FAIL`    | worker  | Gate failed (reason follows) |
| `MERGED`  | worker  | Successfully merged into cases2 + pushed to main + master |
| `SYNC`    | worker  | Rebased onto new cases2 after peer merge |
| `REVIEW`  | master  | Master inspecting peer code |
| `APPROVE` | master  | Master green-lights work |
| `REJECT`  | master  | Master blocks merge with reason |
| `OVERRIDE`| master  | Master takes manual control (e.g. force resolution) |

---

## Standard Flow

1. **Master ASSIGNs.** `baton-assign.sh mobile "Refactor InformantsPage filter chips for mobile"`
2. **Worker CLAIMs.** `baton-claim.sh mobile "Filter chip mobile refactor"` — peeks peer events.
3. **Worker edits + commits** on their branch (`cases2-mobile` / `cases2-desktop`).
4. **Worker signals READY.** `baton-claim.sh mobile "READY: filter chip refactor complete @<sha>"` (or use `baton-ready.sh`).
5. **Worker runs gate.** `baton-verify-merge.sh` — vite build + conflict-check vs latest cases2.
6. **If gate passes**, script merges into cases2 + pushes cases2/main/master, logs `MERGED`.
7. **Other worker SYNCs.** `baton-sync.sh` — rebases their branch onto new cases2.
8. **Master observes.** `baton-status.sh` — sees full timeline + last 10 events.

---

## Master Powers

Master can:

- **Assign tasks** via `baton-assign.sh`
- **Inspect any branch** without checking out: `git log origin/cases2-mobile --oneline`
- **Reject a worker's READY** by editing live baton + committing block to `STATUS.md`
- **Take over a stuck worker's branch** with `git fetch && git checkout origin/cases2-mobile -b cases2` (irreversible — log `OVERRIDE`)
- **Push directly to main/master** if a worker's gate fails persistently — emergency only

Master should NOT:
- Edit code in worker worktrees directly (use the worker chat)
- Merge without the worker's `READY` event
- Force-push

---

## Worker Boundaries

| Worker | Owns | Must NOT touch |
|---|---|---|
| mobile  | `MobileCasesView`, `MobileInformantsView`, mobile tuning panels, `< 768px` styling, `?tune=1` logic | Desktop hover/3D, `>= 768px` layouts |
| desktop | `DesktopCasesView`, `DesktopInformantsView`, hover, Framer 3D, `>= 768px` | Mobile components, tuning panels |

**Shared (claim or assign first):** `CASES_DATA`, `INFORMANTS_DATA`, `mock.js`, design tokens (SWISS/TELE/colors), `App.js`, `index.css`.

If a worker touches shared files, master should ASSIGN explicitly to avoid races.

---

## Self-Merge Gate (worker)

Either worker may merge their branch through `cases2 → main → master` AFTER passing both:

1. `cd frontend && npx vite build` exits 0
2. Test merge into latest `cases2` has no conflicts

Script: `.baton/scripts/baton-verify-merge.sh`. Logs to live baton. Aborts on any failure.

---

## Conflict Resolution

If `baton-verify-merge.sh` aborts on conflict:

1. Live baton logs `FAIL conflict in <path>`.
2. Worker stops and rebases on cases2: `git fetch origin && git rebase origin/cases2`.
3. Resolves conflicts locally, retries gate.
4. If conflicts span shared concerns, **master** decides:
   - REJECTs one side via baton + STATUS.md note
   - Or rewrites both to a reconciled version

**Never force-push.** Never delete `cases2-mobile` / `cases2-desktop` without user approval.

---

## Scripts (in `.baton/scripts/`)

| Script | Caller | Purpose |
|---|---|---|
| `baton-assign.sh <worker> <task>` | master | Log ASSIGN event |
| `baton-claim.sh <actor> <task>` | any | Log CLAIM event + show peer's last 5 events |
| `baton-ready.sh <task>` | worker | Log READY event (signals master + peer) |
| `baton-verify-merge.sh` | worker | Gated merge to cases2 + push main/master |
| `baton-sync.sh` | worker | Rebase current branch onto latest cases2 |
| `baton-status.sh` | any | Print current branch, last 10 events, peer status |
