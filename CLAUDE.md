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

## Installed Skills (rebuild on new account)

Skills are committed to the repo under `.agents/skills/` — nothing to reinstall from disk. The `skills-lock.json` records provenance:

```bash
# Reinstall Remotion best-practices (if you ever nuke .agents/)
npx skills add remotion-dev/skills --yes
```

**Currently installed:**
- `remotion-best-practices` — Remotion video-creation conventions (source: `remotion-dev/skills` on GitHub)

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

## Common Pitfalls

1. **Stale artifact references** — after updating a case study, always update `mock.js` (homepage cards) AND `CasesPage.jsx` CASES_DATA (cases page) in the same commit. The cascade update rule in memory enforces this.
2. **Image paths** — assets live in `public/Satyajit Website Assets/<subfolder>/` (with spaces in the path). URL-encode or leave as-is depending on the consumer.
3. **Build warnings** — Vite warns about chunks > 500 kB. Ignore unless the user asks to optimize.
4. **Playwright browser conflicts** — if user's Chrome is running, Playwright can't launch. Kill Chrome first with `osascript -e 'tell application "Google Chrome" to quit'`.
