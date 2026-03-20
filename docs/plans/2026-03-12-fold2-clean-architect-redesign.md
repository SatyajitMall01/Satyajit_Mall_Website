# Fold 2 Clean Architecture Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the "terminal/spy hacker" Fold 2 with a "Premium Dark Mode SaaS / Technical Architect" aesthetic — clean glassmorphic card, Core Competencies list, and updated impact metric descriptions.

**Architecture:** All changes are contained in the `Fold2` component in `frontend/src/components/Dossier.jsx` (lines 319–454). No new files needed. Recharts imports are left untouched (used by other folds — deferred).

**Tech Stack:** React, Framer Motion (`motion`, `useInView`), Tailwind CSS, inline styles

---

## Background: What is Fold 2?

Fold 2 is the second full-height viewport section in `/dossier`. It uses an absolute spatial canvas — portrait photo sits in the centre of the screen (rendered by a parent component), and Fold 2 overlays 4–5 absolutely-positioned info "artifacts" in the corners. Left/right edge gradients ensure corner content is readable against the portrait.

---

## Task 1: Replace Artifact 1 — Tech Stack Matrix (Top Left)

**Files:**
- Modify: `frontend/src/components/Dossier.jsx:331-356`

**What to replace:**
The current "Mainframe Terminal" block — a dark box with green monospace `> CORE:` / `> AUTO:` / `> METH:` lines, scanline overlay, and a blinking `> STATUS: AUTHORIZED` cursor.

**Step 1: Locate the block**

Open `frontend/src/components/Dossier.jsx`. Find the comment `{/* ── Artifact 1: Mainframe Terminal (Top Left) ── */}` at line ~331.

**Step 2: Replace the inner `<div>` content**

Replace everything from `<motion.div variants={slideLeft}` (Artifact 1) through its closing `</motion.div>` with:

```jsx
{/* ── Artifact 1: Tech Stack Matrix (Top Left) ── */}
<motion.div
  variants={slideLeft}
  className="absolute z-10 hidden md:block"
  style={{ top: '15%', left: '8%', maxWidth: 400 }}
>
  <div style={{
    backgroundColor: 'rgba(10,10,10,0.8)',
    border: '1px solid rgba(55,65,81,1)',
    padding: '24px',
    borderRadius: 8,
    backdropFilter: 'blur(12px)',
  }}>
    <p style={{
      fontFamily: SWISS, fontSize: 10, fontWeight: 700,
      color: '#dc2626', letterSpacing: '0.2em',
      textTransform: 'uppercase', marginBottom: 16, margin: '0 0 16px',
    }}>Technical Stack</p>

    {[
      { label: 'Data Platforms', tools: ['BigQuery', 'PostgreSQL', 'GA4', 'Looker'] },
      { label: 'Automation & CDP', tools: ['n8n', 'Zapier', 'Netcore', 'Clevertap'] },
      { label: 'Product Delivery', tools: ['Agile Scrum', 'MVP Architecting', 'CSPO'] },
    ].map(group => (
      <div key={group.label} style={{ marginBottom: 14 }}>
        <p style={{
          fontFamily: SWISS, fontSize: 9, fontWeight: 600,
          color: 'rgba(107,114,128,0.8)', letterSpacing: '0.15em',
          textTransform: 'uppercase', margin: '0 0 6px',
        }}>{group.label}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {group.tools.map(tool => (
            <span key={tool} style={{
              fontFamily: SWISS, fontSize: 11, fontWeight: 500,
              color: 'rgba(229,231,235,0.85)',
              backgroundColor: 'rgba(31,41,55,0.8)',
              border: '1px solid rgba(55,65,81,0.8)',
              padding: '3px 8px', borderRadius: 4,
            }}>{tool}</span>
          ))}
        </div>
      </div>
    ))}
  </div>
</motion.div>
```

**Step 3: Verify in browser**

Start dev server (`cd frontend && npm start`). Navigate to `/dossier`. Confirm top-left shows a clean dark card with grouped badge rows, no green text, no cursor.

**Step 4: Commit**

```bash
git add frontend/src/components/Dossier.jsx
git commit -m "feat: fold2 — replace terminal with clean tech stack matrix"
```

---

## Task 2: Replace Artifact 2 — Core Competencies (Top Right)

**Files:**
- Modify: `frontend/src/components/Dossier.jsx:358-376`

**What to replace:**
The `flex-col gap-6` Recharts sparklines block (pipeline throughput / automation coverage area charts).

**Step 1: Locate the block**

Find `{/* ── Artifact 2: Telemetry Sparklines (Top Right) ── */}` at line ~358.

**Step 2: Replace with Core Competencies list**

```jsx
{/* ── Artifact 2: Core Competencies (Top Right) ── */}
<motion.div
  variants={slideRight}
  className="absolute z-10 hidden md:block"
  style={{ top: '15%', right: '8%', maxWidth: 420 }}
>
  <p style={{
    fontFamily: SWISS, fontSize: 10, fontWeight: 700,
    color: '#dc2626', letterSpacing: '0.2em',
    textTransform: 'uppercase', margin: '0 0 16px',
  }}>Core Competencies</p>

  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    {[
      {
        title: 'Unifying Fragmented Data',
        body: 'Architecting deterministic data pipelines that bridge apps, CRM, and analytics.',
      },
      {
        title: 'Automating Operations',
        body: 'Deploying enterprise workflows that eliminate manual operational silos and slash support costs.',
      },
      {
        title: 'Driving Product-Led Growth',
        body: 'Building self-serve, AI-driven product loops that directly multiply top-line revenue.',
      },
    ].map(item => (
      <div key={item.title} style={{
        borderLeft: '2px solid #dc2626',
        paddingLeft: 12,
      }}>
        <p style={{
          fontFamily: SWISS, fontSize: 12, fontWeight: 600,
          color: 'rgba(229,231,235,0.95)', margin: '0 0 4px',
        }}>{item.title}</p>
        <p style={{
          fontFamily: SWISS, fontSize: 12, fontWeight: 400,
          color: 'rgba(156,163,175,0.85)', lineHeight: 1.6, margin: 0,
        }}>{item.body}</p>
      </div>
    ))}
  </div>
</motion.div>
```

**Step 3: Verify in browser**

Top-right should show 3 left-bordered competency items in clean sans-serif. No charts.

**Step 4: Commit**

```bash
git add frontend/src/components/Dossier.jsx
git commit -m "feat: fold2 — replace sparklines with core competencies list"
```

---

## Task 3: Remove Artifact 3 — Vertical Tech Spine (Far Right Edge)

**Files:**
- Modify: `frontend/src/components/Dossier.jsx:378-392`

**What to remove:**
The `writingMode: 'vertical-rl'` rotated text spine at `right: '2%'`.

**Step 1: Delete the entire block**

Find `{/* ── Artifact 3: Vertical Tech Spine (Far Right Edge) ── */}` and delete the `<motion.div>` through its closing `</motion.div>`.

**Step 2: Verify**

Right edge should be clean — no rotated text.

**Step 3: Commit**

```bash
git add frontend/src/components/Dossier.jsx
git commit -m "feat: fold2 — remove vertical text spine"
```

---

## Task 4: Update Artifact 4 — Intel Badge −40% (Bottom Left)

**Files:**
- Modify: `frontend/src/components/Dossier.jsx:394-421`

**What to change:**
- Switch paragraph font from `TELE` (monospace) to `SWISS` (sans-serif)
- Replace the `// TIME-TO-MARKET` header row (which uses `//` + TELE font) with a clean SWISS uppercase label
- Expand the description to Gemini's full copy
- Remove the `Declassify` wrapper (keep bare `<span>`) OR keep it — it's fine either way since it just adds a counter animation. **Keep `Declassify`** as it's a nice touch on the number.

**Step 1: Update the bottom-left Intel Badge**

```jsx
{/* ── Artifact 4: Intel Badge −40% (Bottom Left) ── */}
<motion.div
  variants={slideLeft}
  className="absolute z-10 hidden md:block"
  style={{ bottom: '12%', left: '8%', maxWidth: 380 }}
>
  <div style={{
    display: 'flex', flexDirection: 'column',
    borderLeft: '4px solid #dc2626',
    paddingLeft: 20,
  }}>
    <Declassify>
      <span style={{
        fontFamily: SWISS, fontWeight: 900,
        fontSize: 'clamp(56px, 7vw, 88px)',
        color: '#F3F4F6', lineHeight: 0.8,
        display: 'block', letterSpacing: '-0.03em',
      }}>−40%</span>
    </Declassify>
    <p style={{
      fontFamily: SWISS, fontSize: 10, fontWeight: 600,
      color: 'rgba(156,163,175,0.7)', letterSpacing: '0.2em',
      textTransform: 'uppercase', margin: '12px 0',
    }}>Time-to-Market Reduction</p>
    <p style={{
      fontFamily: SWISS, fontSize: 12, fontWeight: 400,
      color: 'rgba(156,163,175,0.75)', lineHeight: 1.65,
      margin: 0, maxWidth: 320,
    }}>
      Governed CDP implementation and event taxonomy across the full product ecosystem,
      eliminating engineering bottlenecks for real-time personalization.
    </p>
  </div>
</motion.div>
```

**Step 2: Verify**

Bottom-left: big `−40%`, clean label, clean paragraph in sans-serif (not Courier).

**Step 3: Commit**

```bash
git add frontend/src/components/Dossier.jsx
git commit -m "feat: fold2 — update −40% badge to sans-serif, expand description"
```

---

## Task 5: Update Artifact 5 — Intel Badge +20% (Bottom Right)

**Files:**
- Modify: `frontend/src/components/Dossier.jsx:423-450`

**Step 1: Update the bottom-right Intel Badge**

```jsx
{/* ── Artifact 5: Intel Badge +20% (Bottom Right) ── */}
<motion.div
  variants={slideRight}
  className="absolute z-10 hidden md:block"
  style={{ bottom: '12%', right: '8%', maxWidth: 380 }}
>
  <div style={{
    display: 'flex', flexDirection: 'column',
    borderLeft: '4px solid #dc2626',
    paddingLeft: 20,
  }}>
    <Declassify delay={0.15}>
      <span style={{
        fontFamily: SWISS, fontWeight: 900,
        fontSize: 'clamp(56px, 7vw, 88px)',
        color: '#F3F4F6', lineHeight: 0.8,
        display: 'block', letterSpacing: '-0.03em',
      }}>+20%</span>
    </Declassify>
    <p style={{
      fontFamily: SWISS, fontSize: 10, fontWeight: 600,
      color: 'rgba(156,163,175,0.7)', letterSpacing: '0.2em',
      textTransform: 'uppercase', margin: '12px 0',
    }}>Overall ROAS Lift</p>
    <p style={{
      fontFamily: SWISS, fontSize: 12, fontWeight: 400,
      color: 'rgba(156,163,175,0.75)', lineHeight: 1.65,
      margin: 0, maxWidth: 320,
    }}>
      Architected a proprietary end-to-end attribution platform powered by compounded
      automation models to recover leads and scale revenue.
    </p>
  </div>
</motion.div>
```

**Step 2: Verify**

Bottom-right: big `+20%`, clean label, sans-serif paragraph.

**Step 3: Commit**

```bash
git add frontend/src/components/Dossier.jsx
git commit -m "feat: fold2 — update +20% badge to sans-serif, expand description"
```

---

## Final Verification Checklist

- [ ] No green monospace terminal text visible
- [ ] No blinking cursor or `> STATUS:` labels
- [ ] No Recharts sparklines (area charts gone from Fold 2)
- [ ] No vertical rotated text on right edge
- [ ] Top-left: glassmorphic card with 3 grouped badge rows
- [ ] Top-right: 3 competencies with red left-border, sans-serif body
- [ ] Bottom-left: `−40%` + sans-serif label + sans-serif paragraph
- [ ] Bottom-right: `+20%` + sans-serif label + sans-serif paragraph
- [ ] All 4 artifacts animate in (slideLeft for left, slideRight for right) with stagger
- [ ] Page still loads without errors (no missing imports)
