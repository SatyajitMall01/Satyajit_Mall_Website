# Global SWISS Typography Sweep — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace every `fontFamily` inline style across the entire site with the SWISS sans-serif stack (`'Helvetica Neue', Helvetica, Arial, sans-serif`).

**Architecture:** Each task handles one file. For files already defining `SWISS`/`TELE` constants, use `replace_all` to swap `TELE` → `SWISS` in usage and delete the dead TELE constant. For files using inline strings, add `const SWISS` near the top and `replace_all` each old string with `SWISS`.

**Tech Stack:** React, inline styles (no CSS files touched)

---

## Task 1: ActionAgent.jsx

**Files:**
- Modify: `frontend/src/components/ActionAgent.jsx`

**Step 1: Read the file and verify line 6 is `const TELE`**

Open `frontend/src/components/ActionAgent.jsx`.

**Step 2: Add SWISS constant and replace TELE**

Add `const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";` directly after the `const TELE` line.

Then use `replace_all` to change every `fontFamily: TELE` → `fontFamily: SWISS`.

Then delete the now-unused `const TELE` line.

**Step 3: Verify**

Search the file — no `TELE` should remain. Count of `fontFamily: SWISS` should be 13.

**Step 4: Commit**

```bash
git add frontend/src/components/ActionAgent.jsx
git commit -m "feat: typography — switch ActionAgent to SWISS"
```

---

## Task 2: ColdOpen.jsx

**Files:**
- Modify: `frontend/src/components/ColdOpen.jsx`

**Step 1: Read the file**

Open `frontend/src/components/ColdOpen.jsx`. Identify the first line after imports to insert the constant.

**Step 2: Add SWISS constant**

Near the top of the file (after imports, before the component function), add:

```js
const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
```

**Step 3: Replace all font strings**

Use `replace_all` twice:
1. `fontFamily: "'Special Elite', cursive"` → `fontFamily: SWISS`
2. `fontFamily: "'Julius Sans One', sans-serif"` → `fontFamily: SWISS`

**Step 4: Verify**

No `Special Elite` or `Julius Sans One` should remain. Total `fontFamily: SWISS` = 7.

**Step 5: Commit**

```bash
git add frontend/src/components/ColdOpen.jsx
git commit -m "feat: typography — switch ColdOpen to SWISS"
```

---

## Task 3: HallOfTrophies.jsx

**Files:**
- Modify: `frontend/src/components/HallOfTrophies.jsx`

**Step 1: Read the file**

Open `frontend/src/components/HallOfTrophies.jsx`.

**Step 2: Add SWISS constant**

After imports, add:

```js
const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
```

**Step 3: Replace all font strings**

Use `replace_all` twice:
1. `fontFamily: "'Special Elite', cursive"` → `fontFamily: SWISS`
2. `fontFamily: "'Julius Sans One', sans-serif"` → `fontFamily: SWISS`

**Step 4: Verify**

No `Special Elite` or `Julius Sans One` remains. Total `fontFamily: SWISS` = 13.

**Step 5: Commit**

```bash
git add frontend/src/components/HallOfTrophies.jsx
git commit -m "feat: typography — switch HallOfTrophies to SWISS"
```

---

## Task 4: LedgerEdge.jsx

**Files:**
- Modify: `frontend/src/components/LedgerEdge.jsx`

**Step 1: Read the file**

Open `frontend/src/components/LedgerEdge.jsx`.

**Step 2: Add SWISS constant**

After imports, add:

```js
const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
```

**Step 3: Replace all font strings**

Use `replace_all` twice:
1. `fontFamily: "'Special Elite', cursive"` → `fontFamily: SWISS`
2. `fontFamily: "'Julius Sans One', sans-serif"` → `fontFamily: SWISS`

**Step 4: Verify**

No `Special Elite` or `Julius Sans One` remains. Total `fontFamily: SWISS` = 8.

**Step 5: Commit**

```bash
git add frontend/src/components/LedgerEdge.jsx
git commit -m "feat: typography — switch LedgerEdge to SWISS"
```

---

## Task 5: Informants.jsx

**Files:**
- Modify: `frontend/src/components/Informants.jsx`

**Context:** `SWISS` is already defined at line 6, `TELE` at line 7. Some of the 13 `fontFamily` occurrences use `TELE`, others use `SWISS`. Only TELE usages need to change.

**Step 1: Read the file**

Open `frontend/src/components/Informants.jsx`.

**Step 2: Replace all TELE usages**

Use `replace_all` to change every `fontFamily: TELE` → `fontFamily: SWISS`.

**Step 3: Delete the TELE constant**

Remove the line `const TELE = "'Courier New', Courier, monospace";` (line ~7).

**Step 4: Verify**

No `TELE` remains anywhere in the file.

**Step 5: Commit**

```bash
git add frontend/src/components/Informants.jsx
git commit -m "feat: typography — switch Informants to SWISS"
```

---

## Task 6: Dossier.jsx

**Files:**
- Modify: `frontend/src/components/Dossier.jsx`

**Context:** `TELE` defined at line 10, `SWISS` at line 11. 61 fontFamily occurrences total — some already use SWISS, others use TELE. Only TELE usages change.

**Step 1: Read the file (at least lines 1–50 to confirm constants)**

Open `frontend/src/components/Dossier.jsx`.

**Step 2: Replace all TELE usages**

Use `replace_all` to change every `fontFamily: TELE` → `fontFamily: SWISS`.

**Step 3: Delete the TELE constant**

Remove the line `const TELE = "'Courier New', Courier, monospace";` (line ~10).

**Step 4: Verify**

No `TELE` remains anywhere in the file.

**Step 5: Commit**

```bash
git add frontend/src/components/Dossier.jsx
git commit -m "feat: typography — switch Dossier to SWISS"
```

---

## Final Verification Checklist

- [ ] Zero occurrences of `TELE` across the entire `frontend/src/components/` directory
- [ ] Zero occurrences of `Special Elite` across the entire `frontend/src/components/` directory
- [ ] Zero occurrences of `Julius Sans One` across the entire `frontend/src/components/` directory
- [ ] All 6 files committed individually
- [ ] Dev server starts without errors (`cd frontend && npm start`)
