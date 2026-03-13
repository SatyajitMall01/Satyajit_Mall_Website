# Global SWISS Typography Sweep — Design

## Goal
Replace every `fontFamily` inline style across the entire site with `'Helvetica Neue', Helvetica, Arial, sans-serif` (SWISS). No other styling changes.

## Approach
Option A — Direct replacement. Surgical swap of font values only. No new shared files, no new imports.

## Scope

| File | Current fonts | Action |
|---|---|---|
| `frontend/src/components/Dossier.jsx` | TELE (`'Courier New', Courier, monospace`) in Folds 1, 3, 4, 5 | Replace TELE usages with SWISS (constant already defined) |
| `frontend/src/components/Informants.jsx` | TELE for labels, serials, role text | Replace TELE usages with SWISS (constant already defined) |
| `frontend/src/components/ActionAgent.jsx` | TELE for all chat/boot text | Add `const SWISS` at top, replace all TELE refs |
| `frontend/src/components/ColdOpen.jsx` | `'Special Elite', cursive` + `'Julius Sans One', sans-serif` | Add `const SWISS` at top, replace all fontFamily values |
| `frontend/src/components/HallOfTrophies.jsx` | `'Special Elite', cursive` + `'Julius Sans One', sans-serif` | Add `const SWISS` at top, replace all fontFamily values |
| `frontend/src/components/LedgerEdge.jsx` | `'Special Elite', cursive` + `'Julius Sans One', sans-serif` | Add `const SWISS` at top, replace all fontFamily values |

## Rules
- Only `fontFamily` values change — sizes, weights, colors, letter-spacing, line-heights are untouched
- `const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif"` is the canonical value
- Files that already define SWISS just switch their TELE usage to SWISS
- Files without SWISS get the constant added near the top of the file

## Non-Goals
- Do not change font sizes, weights, colors, or any other CSS properties
- Do not touch `frontend/src/components/ui/` (shadcn components)
- Do not change `index.css` or global stylesheets
