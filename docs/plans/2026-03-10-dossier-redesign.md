# Dossier Redesign — Evidence Wall + Declassification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Completely rewrite Dossier.jsx so every fold has unique visual DNA (passport, blueprint, microfiche, radar, teletype, surveillance board, sealed ledger), all metrics enter via a declassification animation (black blocks sliding away), and the portrait is a ghosted interrogation-room watermark.

**Architecture:** Single-file rewrite of `frontend/src/components/Dossier.jsx`. The component uses Framer Motion for scroll-triggered declassification animations, recharts for radial progress rings and sparklines, and pure CSS for textures (fingerprint SVG, circuit nodes, torn paper, fold creases). Portrait is fixed z-0 at opacity ~0.18 with crushed grayscale. Content floats on left/right flanks (w-[45%]) around the ghosted center.

**Tech Stack:** React, Framer Motion, recharts (RadialBarChart, AreaChart), Tailwind CSS, inline SVG for textures.

---

### Task 1: Rewrite Fixed Background — Ghosted Interrogation Portrait

**Files:**
- Modify: `frontend/src/components/Dossier.jsx:24-46`

**Step 1: Replace FixedBackground**

The portrait must be a barely-visible watermark. Crush brightness, max grayscale, drop opacity to 0.18. Radial vignette with 70% radius fade to `#0F1419`.

---

### Task 2: Build Declassification Animation Wrapper

**Files:**
- Modify: `frontend/src/components/Dossier.jsx` (add new component)

**Step 1: Create `Declassify` wrapper component**

A motion wrapper that overlays a black `[REDACTED]` block on its children. On `whileInView`, the block animates `scaleX: 1 -> 0` from origin-left over 0.8s with EXPO ease. The bright content underneath is revealed.

Used to wrap every major metric/artifact in every fold.

---

### Task 3: Rewrite Fold 1 — The Passport (Left Flank)

**Files:**
- Modify: `frontend/src/components/Dossier.jsx`

**Step 1: Build passport artifact**

- SVG fingerprint texture as background pattern (subtle, opacity 0.04)
- Heavy double-border frame with inset shadow
- Giant "S. MALL" at `clamp(120px, 16vw, 200px)` bleeding off left edge (negative margin-left)
- Classification stamps: "CONFIDENTIAL", "EYES ONLY" — rotated, red bordered
- Dotted-line data fields (NAME: _______, CLEARANCE: _______, STATUS: _______)
- Blinking StatusLED for "DOSSIER: OPEN"
- StampTag for role classification
- All major text enters via `Declassify` wrapper

---

### Task 4: Rewrite Fold 2 — The Blueprint Terminal (Right Flank)

**Files:**
- Modify: `frontend/src/components/Dossier.jsx`

**Step 1: Build blueprint artifact**

- CSS grid pattern overlay (repeating linear-gradient at 24px intervals, very subtle)
- Circuit-node connection points (small circles at grid intersections via pseudo-elements)
- Terminal block with animated BlinkCursor
- Sparkline mini-charts using recharts AreaChart (tiny, 120x40px, no axes, just the line) for "Data Pipeline Throughput" and "Automation Coverage"
- Tech stack items positioned as circuit-board labels with connecting lines
- Giant "-40%" metric bleeding off right edge
- All metrics wrapped in `Declassify`

---

### Task 5: Rewrite Fold 3 — The Microfiche Slide (Left Flank)

**Files:**
- Modify: `frontend/src/components/Dossier.jsx`

**Step 1: Build microfiche artifact**

- Projected light cone: radial gradient from top-center, narrow beam, subtle warm white
- Slide-drawer casing: thick top and bottom border rails (4px solid dark gray)
- Film-strip perforations on left edge (repeating small squares via CSS)
- High-contrast data blocks: pure white text on near-black cards
- Redacted hover-reveal strips: subtext starts as black bars, hover reveals text (use existing `.redacted-word` CSS class pattern)
- Giant "40,000+" metric with declassification entrance
- Slide-mount frame with corner brackets

---

### Task 6: Rewrite Fold 4 — The Live Radar (Right Flank)

**Files:**
- Modify: `frontend/src/components/Dossier.jsx`

**Step 1: Build radar artifact**

- CSS animated radar sweep: conic-gradient with one bright wedge, rotating 360deg over 4s infinite
- Concentric circle rings behind metrics (3 rings, thin borders, low opacity)
- Radial progress ring using recharts RadialBarChart (for "+25% Self-Service" metric)
- LED status grid: 4x3 grid of small dots, some blinking green, some dim
- Data stream waterfall: column of small monospace text slowly scrolling upward (CSS animation)
- Giant metric bleeds off right edge
- All wrapped in `Declassify`

---

### Task 7: Rewrite Fold 5 — The Teletype Feed (Left Flank)

**Files:**
- Modify: `frontend/src/components/Dossier.jsx`

**Step 1: Build teletype artifact**

- Torn-paper top edge: CSS clip-path with jagged polygon
- Timestamp margin column: left gutter with faint time codes
- Typewriter character-by-character reveal: Framer Motion animating each character with stagger
- Ticker-tape horizontal scroll strip at top (CSS marquee animation with operation data)
- Dot-matrix texture overlay (repeating radial-gradient tiny dots)
- TeletypeItem entries with their existing timestamp/ID/content structure
- Giant "-30%" metric with declassification

---

### Task 8: Rewrite Fold 6 — The Surveillance Board (Split Flanks)

**Files:**
- Modify: `frontend/src/components/Dossier.jsx`

**Step 1: Build surveillance board artifact**

- Full-width section (breaks the left/right pattern — both flanks used)
- Cards pinned at slight random angles (rotate -2deg to 3deg)
- Pushpin accent: small colored circle at top of each card
- String connections: thin SVG lines between related cards
- Faded sepia tint on AlmaBetter/UpGrad cards (`sepia(0.3)` filter)
- Paperclip CSS: small gray rotated rectangle at top-right of select cards
- Coffee stain: subtle radial gradient ring, very low opacity (0.04), positioned randomly
- Each jurisdiction as a distinct "evidence photo" card

---

### Task 9: Rewrite Fold 7 — The Sealed Ledger (Center Bottom)

**Files:**
- Modify: `frontend/src/components/Dossier.jsx`

**Step 1: Build sealed ledger artifact**

- Fold crease lines: 2-3 horizontal hairlines with subtle drop shadow
- Massive diagonal "[ CLASSIFIED ]" watermark at ~30deg, `#B22222` at opacity 0.05, font-size ~120px
- Ledger rows with dotted leaders (existing LedgerRow pattern, refined)
- Paper texture: slightly warmer background (tinted toward sepia)
- Final RED wax seal: circular element with embossed border, radial gradient for 3D wax effect, "END OF FILE" text inside
- Stamp badges for CSPO and skills

---

### Task 10: Wire Root Component & Verify

**Files:**
- Modify: `frontend/src/components/Dossier.jsx` (bottom of file)

**Step 1: Update root Dossier component**

Wire all 7 new folds into the root `<Dossier>` export. Ensure z-layering is correct (portrait z-0, content z-10). Run dev server and verify rendering.

**Step 2: Commit**

```bash
git add frontend/src/components/Dossier.jsx
git commit -m "feat: complete dossier redesign — 7 unique artifact folds with declassification animation"
```
