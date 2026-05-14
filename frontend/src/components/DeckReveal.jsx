import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/* Cubic-bezier from spec — smooth, slightly springy */
const EASE = [0.32, 0.72, 0, 1];
const DEPTH = 6; // visible cards in stack

/* Per-depth visual slot: depth 0 = front, DEPTH-1 = back.
   Alternating direction (% 2) gives the natural fanned-deck look. */
const slot = (d) => ({
  x:       (d % 2 === 0 ? 1 : -1) * d * 6,
  y:       d * -8,
  rotate:  (d % 2 === 0 ? 1 : -1) * d * 1.5,
  scale:   1 - d * 0.022,
  opacity: d === 0 ? 1 : Math.max(0.65, 1 - d * 0.09),
  zIndex:  DEPTH - d,
});

/* Global counter — gives each card a unique key across cycles so
   AnimatePresence can distinguish exits from positional shifts. */
let seq = 0;

const PLACEHOLDERS = Array.from({ length: 6 }, (_, i) =>
  `https://picsum.photos/seed/deck${i + 10}/300/400`
);

/**
 * DeckReveal
 * Auto-cycling portrait card stack. Every 1.2s the front card exits
 * (slides down + fades + twists) and is recycled to the back of the deck.
 * All other cards shift forward one depth position.
 *
 * Props:
 *   images  string[]  URLs for card faces (default: 6 Picsum placeholders)
 */
const DeckReveal = ({ images = PLACEHOLDERS }) => {
  const shouldReduce = useReducedMotion();

  /* Each deck entry: { uid, src, isNew }
     uid drives AnimatePresence key — changes only when a card cycles. */
  const [deck, setDeck] = useState(() =>
    images.slice(0, DEPTH).map((src) => ({ uid: seq++, src, isNew: false }))
  );

  useEffect(() => {
    if (shouldReduce) return; // honour prefers-reduced-motion
    const id = setInterval(() => {
      setDeck((prev) => {
        const [front, ...rest] = prev;
        return [
          ...rest.map((c) => ({ ...c, isNew: false })),
          { uid: seq++, src: front.src, isNew: true }, // front recycled to back
        ];
      });
    }, 1200);
    return () => clearInterval(id);
  }, [shouldReduce]);

  return (
    /* Stage: flex-center so absolute children get the flex static position
       at container center — no manual left/top arithmetic needed. */
    <div
      className="relative flex items-center justify-center"
      style={{ height: 400 }}
      aria-hidden="true"
    >
      <AnimatePresence>
        {deck.map((card, i) => {
          const t     = slot(i);
          const backT = slot(DEPTH - 1);

          return (
            <motion.div
              key={card.uid}
              className="absolute rounded-2xl overflow-hidden select-none"
              style={{
                width: 220,
                height: 293, // 3:4 portrait ratio
                willChange: 'transform, opacity',
                /* Shadow depth: front cards cast deeper shadows */
                boxShadow: `0 ${6 + (DEPTH - i) * 5}px ${14 + (DEPTH - i) * 10}px rgba(0,0,0,0.32)`,
              }}
              /* New card enters at back: starts offset + transparent,
                 then animates into its back-of-deck slot. */
              initial={card.isNew
                ? { ...backT, opacity: 0, y: backT.y - 20 }
                : false /* existing cards skip initial on first render */
              }
              animate={{
                x: t.x, y: t.y, rotate: t.rotate,
                scale: t.scale, opacity: t.opacity, zIndex: t.zIndex,
              }}
              /* Front card exit: slides down, fades, twists away.
                 Inline transition overrides the animate transition below. */
              exit={{
                y: t.y + 95,
                opacity: 0,
                rotate: t.rotate + 14,
                scale: 0.86,
                transition: { duration: 0.55, ease: EASE },
              }}
              /* Stagger: back cards shift first → motion feels organic, not mechanical */
              transition={{
                duration: 0.6,
                ease: EASE,
                delay: (DEPTH - 1 - i) * 0.04,
              }}
            >
              <img
                src={card.src}
                alt=""
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default DeckReveal;
