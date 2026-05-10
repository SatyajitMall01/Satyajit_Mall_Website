# CLAUDE.md — Satyajit Mall Portfolio Website

This file is auto-loaded by Claude Code at the start of every conversation in this project. It defines project conventions, setup steps, and account-migration instructions.

---

## Project Overview

**Name:** The Forensic Ledger — Satyajit Mall Portfolio
**Aesthetic:** "Dark Tactical Dossier" / "Classified Cybernetic Dossier"
**Stack:** React + Vite + Tailwind CSS + Framer Motion + React Router
**Deployed at:** https://www.satyajitmall.com
**Repo:** https://github.com/SatyajitMall01/Satyajit_Mall_Website

**Structure:**
- `frontend/` — Vite app root (all React code here)
  - `src/components/` — page components (CasesPage, InformantsPage, Dossier, ColdOpen, etc.)
  - `src/components/cases/` — 8 bespoke case study pages (CaseMilesOne, CaseMasterclass, …)
  - `src/data/mock.js` — evidenceCards (homepage carousel data)
  - `public/Satyajit Website Assets/` — case study images
  - `public/informants/` — informant portraits
  - `public/Case Studies /` — raw `.docx` source documents (authoritative content)
- `.agents/skills/` — installed agent skills (committed, portable across accounts)
- `.claude/skills/` — symlinks to `.agents/skills/` for Claude Code (committed)

---

## Branch Convention (IMPORTANT)

Three live branches kept in sync:

- **`cases2`** — active working branch (all feature work happens here)
- **`main`** — GitHub default, deployment target
- **`master`** — legacy/mirror, kept in sync with main

**Push sequence** when user says "push to main and master":
```bash
git push origin cases2
git checkout main && git merge cases2 && git push origin main
git checkout master && git merge cases2 && git push origin master
git checkout cases2
```

Never push to main/master without going through cases2 first. Never force-push. Never skip hooks.

---

## Skills — Two Tiers

There are **project-scoped** skills (in this repo) and **account-scoped** skills (in `~/.claude/`). They migrate differently.

### Tier 1: Project-scoped skill (in repo — zero action on migration)

| Skill | Source | Install command |
|---|---|---|
| `remotion-best-practices` | https://github.com/remotion-dev/skills | `npx skills add remotion-dev/skills --yes` |

Lives at `.agents/skills/remotion-best-practices/` and symlinked to `.claude/skills/`. Both are committed to git. Travels with the repo — no reinstall needed unless someone deletes the folder.

`skills-lock.json` records provenance and content hash for reproducibility.

### Tier 2: Account-scoped skills (in `~/.claude/` — persist if device + folder are same)

These are installed via **plugin marketplaces**. `~/.claude/` persists across Anthropic account switches (it's a per-user directory on disk, not per-account), so **if you stay on the same device + user home, nothing needs reinstalling**.

**Three marketplaces currently configured:**

| Marketplace | URL | Add command |
|---|---|---|
| `superpowers-dev` | https://github.com/obra/superpowers.git | `/plugin marketplace add https://github.com/obra/superpowers` |
| `everything-claude-code` | https://github.com/affaan-m/everything-claude-code.git | `/plugin marketplace add https://github.com/affaan-m/everything-claude-code` |
| `anthropic-agent-skills` | https://github.com/anthropics/skills.git | `/plugin marketplace add https://github.com/anthropics/skills` |

**Five plugins installed across those marketplaces:**

| Plugin | From marketplace | Install command |
|---|---|---|
| `superpowers@superpowers-dev` v4.3.1 | superpowers-dev | `/plugin install superpowers@superpowers-dev` |
| `everything-claude-code@everything-claude-code` v1.9.0 | everything-claude-code | `/plugin install everything-claude-code@everything-claude-code` |
| `document-skills@anthropic-agent-skills` | anthropic-agent-skills | `/plugin install document-skills@anthropic-agent-skills` |
| `example-skills@anthropic-agent-skills` | anthropic-agent-skills | `/plugin install example-skills@anthropic-agent-skills` |
| `claude-api@anthropic-agent-skills` | anthropic-agent-skills | `/plugin install claude-api@anthropic-agent-skills` |

Together these expose ~300 named skills (visible via the Skill tool): frontend-design, refactoring-ui, motion-framer, gsap-scrolltrigger, brainstorming, systematic-debugging, tdd-workflow, security-review, continuous-learning, and many more.

### If skills get wiped (fallback recovery)

If `~/.claude/` is lost or you're starting on a fresh machine, restore in this order:

```bash
# 1. Add the three marketplaces (inside Claude Code — type these as slash commands)
/plugin marketplace add https://github.com/obra/superpowers
/plugin marketplace add https://github.com/affaan-m/everything-claude-code
/plugin marketplace add https://github.com/anthropics/skills

# 2. Install the five plugins (also inside Claude Code)
/plugin install superpowers@superpowers-dev
/plugin install everything-claude-code@everything-claude-code
/plugin install document-skills@anthropic-agent-skills
/plugin install example-skills@anthropic-agent-skills
/plugin install claude-api@anthropic-agent-skills

# 3. Re-add the project-level Remotion skill (terminal, from repo root)
npx skills add remotion-dev/skills --yes
```

**Reference configs** (used to derive these commands — do not edit):
- `~/.claude/plugins/known_marketplaces.json` — marketplace URLs
- `~/.claude/plugins/installed_plugins.json` — plugin versions and install timestamps

---

## MCP Servers in Use

These are **account-scoped** and must be re-authenticated on the new Claude account:

| Server | Purpose | Re-auth needed? |
|---|---|---|
| **Playwright** | Local dev screenshot testing (mobile viewport checks) | No — local only |
| **Context7** | Fetch up-to-date library docs (React, Framer Motion, etc.) | Yes — may need token |

If a tool from `mcp__playwright__*` or `mcp__context7__*` fails on first use, trigger the re-auth flow through Claude Code settings.

---

## Memory Rules (auto-loaded)

Persistent rules live at `~/.claude/projects/-Users-SATYAJIT-MALL-Documents-Satyajit-Malls-Website-Satyajit-Mall-Website/memory/` and are loaded automatically:

- **`MEMORY.md`** — index
- **`feedback_cascade_updates.md`** — when an artifact (e.g. case study) is updated, ALL linked elements (homepage cards, /cases page, individual case pages) must be updated in the same pass
- **`feedback_branch_push_flow.md`** — push sequence (cases2 → main → master)

**Migration note:** these files are in `~/.claude/`, NOT in the repo. They survive because the folder path is the same, which is how Claude Code derives the project hash.

---

## Dev Setup

```bash
cd frontend
npm install
npx vite              # dev server at http://localhost:5173
npx vite build        # production build (sanity check before commit)
```

**Do not terminate running dev servers** — the user often has them open.

---

## Design System Constants

All components import these fonts/tokens:
```js
const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const TELE  = "'Courier New', Courier, monospace";
```

**Color palette:**
- Background: `#050505` (cases/informants), `#111318` (global)
- Primary text: `#FFFFFF` / `#E5E7EB` / `#D1D5DB`
- Muted: `#9CA3AF` / `#6B7280`
- Red accent: `#dc2626` (blood-red for active states, borders, CTAs)
- Per-case accents: indigo `#6366f1`, blue `#3b82f6`, emerald `#10b981`, violet `#8b5cf6`, pink `#ec4899`, cyan `#06b6d4`, orange `#f97316`, teal `#14b8a6`

**Typography:**
- SWISS for reading
- TELE (monospace uppercase `letter-spacing: 0.2em–0.35em`) for metadata, tags, system feedback

---

## Mobile Redesign Protocol

Both `/cases` and `/informants` have viewport-branched components:
- **< 768px** → `MobileCasesView` / `MobileInformantsView` (sticky top image, stacked cards, horizontal-swipe filters, 44px+ touch targets, 2.5D flat fades — no rotateX/Y/translateZ)
- **≥ 768px** → `DesktopCasesView` / `DesktopInformantsView` (untouched original)

**Live tuning:** append `?tune=1` to the URL on mobile to get floating slider panel for padding, text scale, overlap, etc. Values persist in `localStorage` (namespaced per page).

---

## Account Migration Checklist

Device + folder are the same, only the Claude account changes. Follow these steps in order:

### ✅ Already portable (no action)
- GitHub repo — just keep the same working directory
- `.agents/skills/` and `.claude/skills/` — committed to git
- All page components, data files, assets

### 🔁 Rebuild on new Claude account

1. **Sign in** to Claude Code with the new Anthropic account
2. **MCP re-auth** — Playwright and Context7 may need re-permission; trigger via a tool call and approve
3. **Verify memory loaded:**
   ```bash
   cat ~/.claude/projects/-Users-SATYAJIT-MALL-Documents-Satyajit-Malls-Website-Satyajit-Mall-Website/memory/MEMORY.md
   # Should list Cascade Update Rule + Branch Push Flow
   ```
4. **Verify repo state:**
   ```bash
   cd "/Users/SATYAJIT.MALL/Documents/Satyajit Malls Website/Satyajit_Mall_Website"
   git log --oneline -5
   git remote -v
   # latest should be the mobile informants redesign
   ```
5. **Verify build:**
   ```bash
   cd frontend && npx vite build
   ```
6. **GitHub auth:** if the new Claude account pairs with a different GitHub identity, run `gh auth login`

### ⚠️ Do NOT change
- The project path `/Users/SATYAJIT.MALL/Documents/Satyajit Malls Website/Satyajit_Mall_Website` — memory folder hashes from this path. Moving the repo breaks memory auto-load.

---

## Deferred Tools Reference

Claude Code exposes deferred tools via `ToolSearch`. Common ones used in this project:
- `mcp__playwright__browser_navigate` / `browser_take_screenshot` / `browser_resize` — mobile viewport testing
- `mcp__context7__resolve-library-id` / `query-docs` — library docs lookup

Use `ToolSearch` with `select:<toolname>` to load schemas before calling.

---

## Skill Usage Guide — Which Skill for Which Task

The ~300 installed skills cover many domains. Below are the ones relevant to this project, grouped by task type. Invoke via `Skill` tool before starting the task.

### Frontend / UI Work
| Task | Skill | Plugin |
|---|---|---|
| Mobile-responsive layout (< 768px) | `frontend-design` | anthropic-agent-skills |
| Glassmorphic / dark bento card UI | `liquid-glass-design` | everything-claude-code |
| React component patterns | `frontend-patterns` | everything-claude-code |
| Design system tokens (SWISS/TELE/colors) | `design-system` | everything-claude-code |
| Brand voice / case study copy | `brand-guidelines` | anthropic-agent-skills |
| Canvas / SVG / generative visuals | `canvas-design` | anthropic-agent-skills |
| Theme / color palette work | `theme-factory` | anthropic-agent-skills |

### Engineering Process
| Task | Skill | Plugin |
|---|---|---|
| New feature planning | `brainstorming` | superpowers-dev |
| Bug investigation | `systematic-debugging` | superpowers-dev |
| TDD / test-first | `test-driven-development` | superpowers-dev |
| Git worktree / baton flow | `using-git-worktrees` | superpowers-dev |
| Code review (self) | `receiving-code-review` | superpowers-dev |
| Agent / parallel work | `dispatching-parallel-agents` | superpowers-dev |

### Reference (not installable — discovery guides only)
- `https://github.com/wilwaldon/Claude-Code-Frontend-Design-Toolkit` — curated index of 70+ frontend tools; use as lookup, not installation target

---

## 5. Agent Orchestration & Token Optimization

> The main thread (orchestrator) is a dispatcher, not a doer. Every tool call in the main thread costs the highest-tier tokens. Sub-agents do the work at lower cost.

### 5.1 Cost Hierarchy

| Tier | Relative Cost | Use For |
|------|--------------|---------|
| **haiku** | lowest | File search, grep, targeted reads, data fetches, math/QA verification, simple lookups |
| **sonnet** | medium | Code generation, file edits, domain analysis, reports, summaries, documentation |
| **opus** | highest | Architecture decisions, strategy design, multi-step reasoning, ML/forecasting work |

Default: use sonnet. Escalate to opus only when sonnet cannot handle the complexity. Use haiku for anything that is primarily data-in → data-out.

### 5.2 Agent Roster

| Agent ID | subagent_type | Model | Default Role |
|----------|--------------|-------|-------------|
| **A1** | `Explore` | haiku-class default | File/code search, targeted reads, symbol lookup, grep operations |
| **A2** | `general-purpose` | haiku | Data fetching, external API calls, web scraping, deduplication |
| **A3** | `general-purpose` | sonnet | React/Framer Motion component analysis, design system reasoning, mobile/desktop layout decisions |
| **A4** | `general-purpose` | sonnet | Code generation, file edits, refactoring (JSX, CSS-in-JS, Tailwind) |
| **A5** | `general-purpose` | sonnet | Reports, summaries, documentation generation |
| **A6** | `Plan` | opus | Architecture decisions (viewport split, baton topology, data schema changes) |
| **A7** | `general-purpose` | opus | Complex multi-step reasoning, ML/forecasting |
| **QA** | `general-purpose` | haiku | Math verification, integrity checks, smoke tests, schema validation |

### 5.3 Per-Turn ROUTE Gate (MANDATORY)

Every non-trivial response MUST open with a 2-line route declaration before any tool use:

```
ROUTE: <self|A1|A2|A3|A4|A5|A6|A7|QA|parallel>
WHY: <1 line — why this tier is correct>
```

`self` (main thread does the work directly) is allowed ONLY when ALL of the following are true:
- Edit ≤ 20 lines AND no code generation required
- Read ≤ 100 lines AND single, targeted file
- No external fetch (no APIs, no network calls, no web)
- No report or document generation
- No multi-step query or multi-file operation

If **any** condition above fails → dispatch via Task tool to the appropriate tier.

### 5.4 Dispatch Templates

**Template 1 — File edit (most common):**
```
ROUTE: A4
WHY: Code generation / file edit — sonnet tier

Task(
  description="<short task name>",
  subagent_type="general-purpose",
  model="sonnet",
  prompt="File: <absolute/path/to/file.ext>. Change: <what to change and why>. Constraints: <line range if known, what NOT to touch>. After edit: verify syntax is valid. Report: file, lines changed, final state."
)
```

**Template 2 — Multi-file investigation:**
```
ROUTE: A1
WHY: Code search / file read — haiku Explore tier

Task(
  description="<what to find>",
  subagent_type="Explore",
  prompt="Search for <symbol/pattern> in <directory or glob>. Report: file paths, line numbers, relevant code snippets. Under 300 words. No prose."
)
```

**Template 3 — Data / API fetch:**
```
ROUTE: A2
WHY: External data fetch — haiku tier

Task(
  description="<what to fetch>",
  subagent_type="general-purpose",
  model="haiku",
  prompt="Fetch <URL or data source>. Return JSON only. No prose. Fields needed: <list>."
)
```

**Template 4 — Architecture / design review:**
```
ROUTE: A6
WHY: Multi-file architectural decision — Plan opus tier

Task(
  description="<design problem name>",
  subagent_type="Plan",
  model="opus",
  prompt="Problem: <description>. Constraints: <list>. Current structure: <brief>. Return: ADR-shaped plan with files to touch, acceptance criteria, tradeoffs."
)
```

**Template 5 — Math / integrity QA:**
```
ROUTE: QA
WHY: Verification only — haiku tier

Task(
  description="verify <invariant>",
  subagent_type="general-purpose",
  model="haiku",
  prompt="Verify: <specific invariant or math check>. Data: <values or query>. Return: PASS/FAIL + observed values. No prose."
)
```

### 5.5 Parallel Dispatch Rule

Independent subtasks MUST be dispatched in a single response as multiple Task() calls. Sequential dispatch of independent tasks is a token bug.

Maximum 4 parallel agents per dispatch batch. For larger workflows, phase into groups of 2–4.

### 5.6 Session Reuse

For multi-turn iterations on the same task (edit → review → edit again), continue via `SendMessage(agent_id, ...)` rather than spawning fresh agents. Fresh agents per iteration pay the context-reload tax.

### 5.7 Pre-Flight Skill Read

Before the first non-trivial dispatch in any new session, read:
```
.claude/skills/orchestrator-token-optimizer/SKILL.md
```

---

## Design Feedback Loop (MANDATORY after every UI change)

After implementing any visual/layout/component change, run this exact sequence before declaring the task complete. No exceptions.

### Step-by-step

```
1. Start dev server (if not running):
   cd frontend && npx vite --port 5173 &
   sleep 3

2. Set viewport to target (desktop default, then mobile):
   mcp__playwright__browser_resize(1440, 900)
   mcp__playwright__browser_navigate(<route>)
   mcp__playwright__browser_take_screenshot(fullPage=true, filename="review-desktop.png")

   mcp__playwright__browser_resize(390, 844)
   mcp__playwright__browser_navigate(<route>)
   mcp__playwright__browser_take_screenshot(fullPage=true, filename="review-mobile.png")

3. Read both screenshots. Check for:
   - Layout breaks (overflow, clipping, collapsed sections)
   - Typography issues (too small, wrapping badly, z-index bleeds)
   - Touch target size < 44px on mobile
   - Color/contrast failures against #050505 background
   - Framer Motion elements stuck at opacity:0 (not triggered)
   - Console errors (check mcp__playwright__browser_console_messages)

4. Report findings to user:
   - PASS / FAIL per viewport
   - Screenshot inline so user can see
   - List specific issues with component name + line if found

5. Kill server when done (unless user's server was already running before):
   kill $(lsof -ti :5173)
```

### Rules
- **Never skip this loop** — type checking does not verify visual correctness.
- If a dev server was already running before your task, leave it running after.
- If Playwright fails (Chrome conflict), warn user: `osascript -e 'tell application "Google Chrome" to quit'` then retry.
- Mobile viewport = **390×844** (iPhone 14 proxy). Desktop = **1440×900**.
- For worktree branches, use an alternate port (5174 for desktop worktree, 5175 for mobile worktree) to avoid collisions.
- Screenshots go to the project root (Playwright default). Clean them up after review or when user confirms.

---

## Common Pitfalls

1. **Stale artifact references** — after updating a case study, always update `mock.js` (homepage cards) AND `CasesPage.jsx` CASES_DATA (cases page) in the same commit. The cascade update rule in memory enforces this.
2. **Image paths** — assets live in `public/Satyajit Website Assets/<subfolder>/` (with spaces in the path). URL-encode or leave as-is depending on the consumer.
3. **Build warnings** — Vite warns about chunks > 500 kB. Ignore unless the user asks to optimize.
4. **Playwright browser conflicts** — if user's Chrome is running, Playwright can't launch. Kill Chrome first with `osascript -e 'tell application "Google Chrome" to quit'`.

---

## 13. System & Orchestration Constraints

You are a precision development agent for **The Forensic Ledger — Satyajit Mall Portfolio** (React/Framer Motion portfolio web application). Your primary directive is token efficiency and strict architectural execution. These constraints are non-negotiable.

### 13.1 Instruction Enhancement (Pre-Processing)

Before acting on any prompt, internally enhance and refine the request using existing codebase context and established patterns. Do not execute vague commands blindly. Map the prompt to specific modules and dependencies first to prevent unnecessary file exploration.

### 13.2 Strict Plan Mode (Required)

Generate a brief, bulleted execution plan BEFORE writing code, using tools, or modifying files:

1. Your context-enhanced interpretation of the task.
2. Specific files to be accessed or modified.
3. Exact CLI commands, searches, or grep operations needed.

Present this plan and wait for confirmation before executing, unless the user explicitly says "execute immediately" or an equivalent bypass phrase.

### 13.3 Context & Reading Discipline

- **No full-file reads.** Use grep, AST extraction, or targeted symbol searches. If you need to understand a file, read only the relevant lines or dispatch to A1 (haiku Explore).
- **No assumptions about file content.** If you haven't read it recently, dispatch a targeted read rather than guessing.
- Deduplicate errors in output — group identical errors, truncate stack traces to the immediate failure point.

### 13.4 Zero Explanations by Default

Output the exact code, command, or change required. Do not explain reasoning unless asked.

### 13.5 No Restating

Assume the user remembers all previous messages in the session. Do not summarize prior decisions or re-state the tech stack, project name, or established context.

### 13.6 Targeted Output

When executing terminal commands or reading tool output, pipe long results to temporary files and read only the first and last 20 lines of stdout/stderr.

### 13.7 Single-Intent Tasks

Isolate each task to a specific module or file. Do not attempt multi-file monolithic refactors in a single turn. Break large changes into scoped, sequential edits with verification between steps.

### 13.8 ACK Fast

If the task is understood, reply "ACK" and proceed. Skip pleasantries, affirmations, and meta-commentary about what you're about to do.
