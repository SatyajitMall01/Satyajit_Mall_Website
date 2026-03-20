# Dossier Redesign — Evidence Wall + Declassification Sequence

## Portrait (z-0)
- Full-bleed fixed, dead center
- `grayscale(100%) contrast(130%) brightness(0.4)`, opacity 0.18-0.22
- Radial vignette: `radial-gradient(circle at center, transparent 0%, #0F1419 70%)`
- Interrogation room watermark — never competes with text

## Animation: Declassification Entrance
- All metrics/artifacts enter covered by black `[REDACTED]` blocks
- On `whileInView`: blocks slide right via `scaleX: 1 -> 0` (origin-left), 0.8s, EXPO ease
- Reveals bright `#E5E7EB` massive numbers underneath

## Layout Constraint
- Left/Right flanks: `w-[45%]`, float around central portrait
- Massive typography (`text-[120px]` to `text-[180px]`) bleeds off screen edges
- Maximalist density — overlapping, layered, crowded conspiracy board

## Fold Artifact Map

### Fold 1 — Vitals / Left Flank: "The Passport"
- Heavy double-border frame, passport-photo cutout inset
- SVG fingerprint texture background
- Classification stamps (CONFIDENTIAL, EYES ONLY)
- Giant "S. MALL" bleeding off left edge at ~180px
- Dotted-line data fields (NAME:, CLEARANCE:, STATUS:)
- Blinking StatusLED

### Fold 2 — Arsenal / Right Flank: "The Blueprint"
- `pattern-blueprint` + `pattern-circuit` overlay
- Terminal blocks with animated blinking cursor
- Sparkline mini-charts (recharts) for stack proficiency
- Stark grid lines, node-connection diagrams via CSS
- Tech stack as circuit-board node labels

### Fold 3 — Miles Growth / Left Flank: "The Microfiche"
- Projected light cone effect (gradient from top)
- Slide-drawer casing border (thick top/bottom rails)
- High-contrast white-on-black data blocks
- Film-strip perforations on edges
- Redacted hover-reveal strips for subtext

### Fold 4 — Agentic AI / Right Flank: "The Radar"
- CSS animated sweeping radar line (conic-gradient + rotation)
- Radial progress rings (recharts RadialBarChart)
- Real-time LED status grid (4x4 blinking dots)
- Data stream waterfall text scrolling down
- Pulsing concentric circles behind metrics

### Fold 5 — Internal Ops / Left Flank: "The Teletype"
- Torn-paper top edge via CSS clip-path
- Typewriter character-by-character reveal animation
- Timestamp margin column (left gutter with times)
- Ticker-tape horizontal scroll strip
- Dot-matrix texture overlay

### Fold 6 — Jurisdictions / Split Flanks: "The Surveillance Board"
- Cards pinned at slight angles (rotate -2deg to 3deg)
- Pushpin accent dots at card corners
- String/thread connections via SVG lines
- Faded sepia tint on jurisdiction cards
- Paperclip CSS overlay on card tops
- Coffee stain ring (radial gradient, very subtle)

### Fold 7 — Archives / Center Bottom: "The Sealed Ledger"
- Fold crease lines (horizontal hairlines with shadow)
- Massive diagonal `[ CLASSIFIED ]` watermark at 30deg, opacity 0.06
- Ledger rows with dotted leaders
- Final RED wax-seal stamp `[ END OF FILE ]` with emboss shadow
- Paper texture background (noise overlay, slightly warmer)

## Color System
- Background: `#0F1419`
- Accent: `#B22222` (crimson)
- Text primary: `#E5E7EB`
- Text warm: `#F4ECD8`
- Terminal green: `rgba(61,155,100,0.85)`
- Sepia: `rgba(180,160,120,0.15)`

## Typography Scale
- Bleed metrics: `clamp(100px, 15vw, 180px)`
- Hero metrics: `clamp(48px, 7vw, 80px)`
- Section labels: 8px, 0.4em tracking, uppercase
- Body/subtext: 10-11px Courier New
- All Helvetica Neue for sans, Courier New for mono
