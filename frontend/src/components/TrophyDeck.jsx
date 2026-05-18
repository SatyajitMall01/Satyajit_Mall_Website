import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const EASE  = [0.32, 0.72, 0, 1];
const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const TELE  = "'Courier New', Courier, monospace";

/* Fan geometry: index 0 = front (bottom-right), 5 = back (top-left).
   Consistent diagonal direction creates the dealt-hand fan look. */
const SLOTS = [
  { x:  55, y:  65, rotate:  12, scale: 1.00, opacity: 1.00 },
  { x:  22, y:  35, rotate:   7, scale: 0.96, opacity: 0.88 },
  { x:  -8, y:   8, rotate:   2, scale: 0.92, opacity: 0.76 },
  { x: -36, y: -18, rotate:  -3, scale: 0.88, opacity: 0.62 },
  { x: -58, y: -42, rotate:  -8, scale: 0.84, opacity: 0.48 },
  { x: -74, y: -62, rotate: -12, scale: 0.80, opacity: 0.34 },
];

const SAMPLE_CASES = [
  { id: 1, caseNo: 'CASE #001', category: 'IDENTITY & GROWTH',     title: '₹40 Cr+ PLG Engine',          insight: 'Deterministic UUIDs eliminated the identity gap across 6 touchpoints.' },
  { id: 2, caseNo: 'CASE #002', category: 'OTT ARCHITECTURE',      title: 'Behavioral OTT Platform',      insight: 'Unified behavioral stack cut drop-off 34% across 6 content verticals.' },
  { id: 3, caseNo: 'CASE #003', category: 'ATTRIBUTION',           title: 'Attribution Recovery Engine',  insight: '43% dark-funnel recovery using probabilistic attribution modelling.' },
  { id: 4, caseNo: 'CASE #004', category: 'AI AUTOMATION',         title: 'Agentic Voice Qualification',  insight: 'LLM-routed agents reduced qualification handle-time by 70%.' },
  { id: 5, caseNo: 'CASE #005', category: 'LLM ORCHESTRATION',     title: 'Transactional AI Pipeline',    insight: 'Stateful LLM chains processed 12K+ daily intents at 94% accuracy.' },
  { id: 6, caseNo: 'CASE #006', category: 'PRODUCT ANALYTICS',     title: 'Cross-Platform Analytics',     insight: 'Single data model unified 5 disconnected analytics stacks into one.' },
];

/* Stable incrementing uid — gives each card a unique AnimatePresence key
   so exit fires on the correct element when it cycles to the back. */
let uid = 0;

/* ── Card face — 320×440 portrait ── */
const CardFace = ({ c }) => (
  <div
    className="w-full h-full flex flex-col justify-between rounded-[14px] border border-white/10 p-7"
    style={{ backgroundColor: '#0a0a0a', boxShadow: '0 28px 64px rgba(0,0,0,0.85)' }}
  >
    {/* Top section */}
    <div>
      <div className="flex items-start justify-between mb-6">
        <span style={{ fontFamily: TELE, fontSize: 9, color: '#dc2626', letterSpacing: '0.32em', textTransform: 'uppercase' }}>
          {c.caseNo}
        </span>
        <span style={{ fontFamily: TELE, fontSize: 8, color: 'rgba(220,38,38,0.55)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          Closed &mdash; Solved
        </span>
      </div>

      <p style={{ fontFamily: TELE, fontSize: 8, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.38em', textTransform: 'uppercase', marginBottom: 14 }}>
        {c.category}
      </p>

      <h3 style={{ fontFamily: SWISS, fontSize: 28, fontWeight: 600, color: '#ffffff', lineHeight: 1.18, letterSpacing: '-0.01em' }}>
        {c.title}
      </h3>
    </div>

    {/* Bottom section — key insight */}
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20 }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
        <span style={{ fontFamily: TELE, fontSize: 8, color: '#dc2626', letterSpacing: '0.34em', textTransform: 'uppercase' }}>
          Key Insight
        </span>
      </div>
      <p style={{ fontFamily: SWISS, fontSize: 12.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>
        &ldquo;{c.insight}&rdquo;
      </p>
    </div>
  </div>
);

/* ── TrophyDeck ── */
const TrophyDeck = ({ cases = SAMPLE_CASES }) => {
  const shouldReduce = useReducedMotion();

  const [deck, setDeck] = useState(() =>
    cases.slice(0, 6).map((data) => ({ uid: uid++, data, isNew: false }))
  );

  /* Every 2 s: front card flicks out, recycled to back with a new uid
     (new uid → AnimatePresence sees it as a fresh mount → exit fires on old uid). */
  useEffect(() => {
    if (shouldReduce) return;
    const id = setInterval(() => {
      setDeck((prev) => {
        const [front, ...rest] = prev;
        return [
          ...rest.map((c) => ({ ...c, isNew: false })),
          { uid: uid++, data: front.data, isNew: true },
        ];
      });
    }, 2000);
    return () => clearInterval(id);
  }, [shouldReduce]);

  return (
    /* flex justify/align-center: absolute children inherit this as their
       CSS static position, so they naturally stack at dead center (x=0,y=0)
       before Framer Motion applies the slot offsets. */
    <div className="relative flex justify-center items-center overflow-hidden" style={{ height: 560 }}>
      <AnimatePresence>
        {deck.map((card, i) => {
          const s = SLOTS[i];
          return (
            <motion.div
              key={card.uid}
              className="absolute"
              style={{ width: 320, height: 440, willChange: 'transform, opacity' }}

              /* New back card: starts at back slot, opacity 0, fades in. */
              initial={card.isNew ? { ...SLOTS[5], opacity: 0, zIndex: 1 } : false}

              animate={{
                x: s.x, y: s.y, rotate: s.rotate, scale: s.scale, opacity: s.opacity,
                zIndex: 6 - i, // front card = zIndex 6, back = 1
              }}

              /* Front card exit: shoots upward from bottom-right position, fades.
                 zIndex 10 keeps it painting above the shifting stack during exit. */
              exit={{
                x: 30, y: -350, rotate: 8, opacity: 0, scale: 0.88, zIndex: 10,
                transition: { duration: 0.65, ease: EASE },
              }}

              transition={{
                /* zIndex snaps instantly — no tween between integer values. */
                zIndex:  { duration: 0 },
                /* New back card: only opacity transitions (position already correct). */
                opacity: card.isNew ? { duration: 0.4, ease: EASE } : { duration: 0.65, ease: EASE },
                /* Stagger ~40 ms: back cards shift first for organic feel. */
                x:       { duration: 0.65, ease: EASE, delay: card.isNew ? 0 : (5 - i) * 0.04 },
                y:       { duration: 0.65, ease: EASE, delay: card.isNew ? 0 : (5 - i) * 0.04 },
                rotate:  { duration: 0.65, ease: EASE, delay: card.isNew ? 0 : (5 - i) * 0.04 },
                scale:   { duration: 0.65, ease: EASE, delay: card.isNew ? 0 : (5 - i) * 0.04 },
              }}
            >
              <CardFace c={card.data} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default TrophyDeck;
