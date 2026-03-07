import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from './ui/separator';

const EXPO_OUT    = [0.16, 1, 0.3, 1];
const SWISS       = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const TELE        = "'Courier New', Courier, monospace";
const WINDOW_SIZE = 5;

/* ── Full informant database (10 records) ── */
const INFORMANTS = [
  {
    id: 'inf-01', serial: 'S/N 001', ref: 'REF-0091A',
    label: 'THE COMMISSIONER', role: 'Miles Leadership · Executive Witness',
    image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=800&q=80',
    transcript: "Satyajit didn\u2019t just fix the churn; he re-architected the entire identity registry. The \u20B920 Cr. revenue isn\u2019t a fluke \u2014 it\u2019s a forensic result.",
  },
  {
    id: 'inf-02', serial: 'S/N 002', ref: 'REF-0134B',
    label: 'THE DETECTIVE', role: 'Engineering Lead · Technical Witness',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    transcript: "He builds the plumbing before he asks for a dev sprint. n8n, SQL, zero dependencies \u2014 the system was running before we knew the problem.",
  },
  {
    id: 'inf-03', serial: 'S/N 003', ref: 'REF-0267C',
    label: 'THE WITNESS', role: 'EdTech Learner · Field Testimony',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
    transcript: "The Masterclass wasn\u2019t a course. It was an experience that knew exactly when I was struggling and met me there.",
  },
  {
    id: 'inf-04', serial: 'S/N 004', ref: 'REF-0312D',
    label: 'THE ANALYST', role: 'Data Science · Research Division',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
    transcript: "He doesn\u2019t analyze data \u2014 he interrogates it. Every query is a cross-examination. The model confessed on schedule.",
  },
  {
    id: 'inf-05', serial: 'S/N 005', ref: 'REF-0445E',
    label: 'THE STRATEGIST', role: 'Product Strategy · Field Command',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80',
    transcript: "He ships three quarters of the roadmap and then hands you the fourth. Every sprint felt like intelligence already acted upon.",
  },
  {
    id: 'inf-06', serial: 'S/N 006', ref: 'REF-0523F',
    label: 'THE LIAISON', role: 'Business Development · Field Agent',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80',
    transcript: "He translated a \u20B92 Cr. pipeline problem into a three-line SQL fix. I\u2019ve never seen a PM read a schema like that.",
  },
  {
    id: 'inf-07', serial: 'S/N 007', ref: 'REF-0611G',
    label: 'THE OPERATIVE', role: 'Growth Marketing · Field Division',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
    transcript: "The funnel wasn\u2019t broken \u2014 it was haunted. He exorcised four ghost events in one audit. ROAS recovered by Monday.",
  },
  {
    id: 'inf-08', serial: 'S/N 008', ref: 'REF-0734H',
    label: 'THE ARCHIVIST', role: 'Data Engineering · Cold Case Division',
    image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=800&q=80',
    transcript: "He left the data warehouse cleaner than he found it. I\u2019m still running queries he wrote in the first week.",
  },
  {
    id: 'inf-09', serial: 'S/N 009', ref: 'REF-0891I',
    label: 'THE HANDLER', role: 'Customer Success · Field Intelligence',
    image: 'https://images.unsplash.com/photo-1548449112-96a38a643324?w=800&q=80',
    transcript: "He predicted churn three sprints before the model did. The AI caught up to his intuition eventually.",
  },
  {
    id: 'inf-10', serial: 'S/N 010', ref: 'REF-0968J',
    label: 'THE UNDERCOVER', role: 'UX Research · Deep Cover',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80',
    transcript: "He sat in on 40 support calls before writing a single line of the spec. The product shipped with zero design debt.",
  },
];

/* ── Teletype character-reveal ── */
const TypewriterText = ({ text, active }) => {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return;
    setN(0);
    let i = 0;
    let iid;
    const tid = setTimeout(() => {
      iid = setInterval(() => {
        i++;
        setN(i);
        if (i >= text.length) clearInterval(iid);
      }, 18);
    }, 320);
    return () => { clearTimeout(tid); clearInterval(iid); };
  }, [active, text]);

  return (
    <span style={{ fontFamily: TELE }}>
      {text.slice(0, n)}
      {n < text.length && active
        ? <span style={{ opacity: 0.6, marginLeft: 1 }}>&#9646;</span>
        : null}
    </span>
  );
};

/* ── Registration crosshair ── */
const XHair = ({ size = 16, color = 'currentColor' }) => (
  <span style={{ display: 'inline-block', position: 'relative', width: size, height: size, flexShrink: 0 }}>
    <span style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: color, transform: 'translateY(-50%)' }} />
    <span style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: color, transform: 'translateX(-50%)' }} />
  </span>
);

/* ── Main Section ── */
const Informants = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [hoveredId, setHoveredId]   = useState(null);

  /* Derive exactly 5 cards from the infinite ring */
  const visibleCards = Array.from({ length: WINDOW_SIZE }, (_, i) =>
    INFORMANTS[(startIndex + i) % INFORMANTS.length]
  );
  const centerCard = visibleCards[2]; /* default active: middle slot */

  const advance = (delta) =>
    setStartIndex(s => (s + delta + INFORMANTS.length) % INFORMANTS.length);

  /* Auto-scroll conveyor — freezes completely while a card is hovered */
  useEffect(() => {
    if (hoveredId !== null) return;
    const id = setInterval(() => {
      setStartIndex(s => (s + 1) % INFORMANTS.length);
    }, 4000);
    return () => clearInterval(id);
  }, [hoveredId]);

  return (
    <section className="py-24 px-8 md:px-12 bg-[#0F1419]" id="informants">

      {/* ── Section header ── */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: EXPO_OUT }}
      >
        <span
          className="block mb-3 text-[9px] tracking-[0.5em] uppercase"
          style={{ fontFamily: TELE, color: 'rgba(196,98,45,0.55)' }}
        >
          Exhibit B &middot; Witness Registry
        </span>

        <div className="overflow-hidden">
          <motion.h2
            className="text-[24px] md:text-[30px] text-[#F4ECD8] tracking-[0.03em]"
            style={{ fontFamily: "'Julius Sans One', sans-serif" }}
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.0, ease: EXPO_OUT, delay: 0.1 }}
          >
            The Informants
          </motion.h2>
        </div>

        <motion.p
          className="mt-2.5 text-[9px] tracking-[0.3em] uppercase"
          style={{ fontFamily: TELE, color: 'rgba(214,205,184,0.25)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          Classified Interrogation Records &mdash; Hover to Decrypt
        </motion.p>

        <div className="w-12 h-px mt-4" style={{ backgroundColor: '#C4622D' }} />
      </motion.div>

      {/* ── Accordion: entrance wrapper ── */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: EXPO_OUT, delay: 0.2 }}
      >
        {/* Drag-to-swipe shell — elastic snap with 50 px threshold */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) advance(1);
            else if (info.offset.x > 50) advance(-1);
          }}
          style={{ cursor: 'grab' }}
          whileTap={{ cursor: 'grabbing' }}
        >
          {/* 5-card flex accordion */}
          <div
            className="flex w-full h-[520px] gap-[2px] overflow-hidden"
            style={{ userSelect: 'none' }}
          >
            <AnimatePresence mode="popLayout">
              {visibleCards.map((card) => {
                const isActive =
                  hoveredId === card.id ||
                  (hoveredId === null && card.id === centerCard.id);

                return (
                  <motion.div
                    key={card.id}
                    /* layout="position": FLIP-slides remaining cards;
                       animate handles width — no conflict */
                    layout="position"
                    className="relative flex-shrink-0 overflow-hidden"
                    style={{ backgroundColor: '#0C1018' }}
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0, width: isActive ? '60%' : '10%' }}
                    exit={{ opacity: 0, x: -80 }}
                    transition={{ duration: 0.7, ease: EXPO_OUT }}
                    onMouseEnter={() => setHoveredId(card.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Portrait — high-contrast surveillance photo */}
                    <img
                      src={card.image}
                      alt={card.label}
                      className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none select-none"
                      style={{ filter: 'grayscale(100%) contrast(145%) brightness(0.68)' }}
                      draggable={false}
                    />

                    {/* Scanline overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none z-[1]"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)',
                      }}
                    />

                    {/* Bottom vignette */}
                    <div
                      className="absolute inset-0 z-[1] pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(to top,rgba(12,16,24,0.97) 0%,rgba(12,16,24,0.22) 42%,transparent 68%)',
                      }}
                    />

                    {/* ── INACTIVE: dossier spine tab ──
                        Always mounted; crossfades out when active */}
                    <motion.div
                      className="absolute inset-0 z-[4]"
                      animate={{ opacity: isActive ? 0 : 1 }}
                      transition={{ duration: 0.25, ease: 'linear' }}
                      style={{
                        pointerEvents: isActive ? 'none' : 'auto',
                        backgroundColor: 'rgba(10,13,20,0.50)',
                      }}
                    >
                      {/* Serial — top, vertical */}
                      <div className="absolute top-5 inset-x-0 flex justify-center">
                        <span
                          style={{
                            fontFamily: TELE, fontSize: 6.5,
                            color: 'rgba(196,98,45,0.5)',
                            letterSpacing: '0.18em',
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                            textTransform: 'uppercase',
                          }}
                        >
                          {card.serial}
                        </span>
                      </div>

                      {/* Center crosshair */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <XHair size={18} color="rgba(214,205,184,0.1)" />
                      </div>

                      {/* Name — bottom, vertical */}
                      <div className="absolute bottom-8 inset-x-0 flex justify-center">
                        <span
                          style={{
                            fontFamily: SWISS, fontSize: 8.5, fontWeight: 500,
                            color: 'rgba(214,205,184,0.45)',
                            letterSpacing: '0.32em',
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {card.label}
                        </span>
                      </div>

                      {/* Corner registration marks */}
                      <div className="absolute top-3 left-3 w-3 h-3 border-t border-l pointer-events-none" style={{ borderColor: 'rgba(214,205,184,0.1)' }} />
                      <div className="absolute top-3 right-3 w-3 h-3 border-t border-r pointer-events-none" style={{ borderColor: 'rgba(214,205,184,0.1)' }} />
                      <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l pointer-events-none" style={{ borderColor: 'rgba(214,205,184,0.1)' }} />
                      <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r pointer-events-none" style={{ borderColor: 'rgba(214,205,184,0.1)' }} />
                    </motion.div>

                    {/* ── ACTIVE: classified acetate decryption ──
                        Dark blue-charcoal tint; crossfades in when active */}
                    <motion.div
                      className="absolute inset-0 z-[5]"
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: 'linear' }}
                      style={{
                        pointerEvents: isActive ? 'auto' : 'none',
                        backgroundColor: 'rgba(11,18,34,0.80)',
                      }}
                    >
                      {/* Viewfinder brackets */}
                      <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: 'rgba(196,98,45,0.7)' }} />
                      <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: 'rgba(196,98,45,0.7)' }} />
                      <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: 'rgba(196,98,45,0.7)' }} />
                      <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: 'rgba(196,98,45,0.7)' }} />

                      {/* Identity block — slides down on activation */}
                      <motion.div
                        className="absolute top-7 left-7 right-7"
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                        transition={{ duration: 0.38, delay: isActive ? 0.1 : 0, ease: EXPO_OUT }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <XHair size={10} color="rgba(196,98,45,0.7)" />
                          <span
                            style={{
                              fontFamily: TELE, fontSize: 7.5,
                              color: 'rgba(196,98,45,0.8)',
                              letterSpacing: '0.28em',
                              textTransform: 'uppercase',
                            }}
                          >
                            {card.serial} &nbsp;&middot;&nbsp; {card.ref}
                          </span>
                        </div>
                        <p
                          style={{
                            fontFamily: SWISS, fontSize: 14, fontWeight: 600,
                            color: 'rgba(214,205,184,0.92)',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            lineHeight: 1.2,
                          }}
                        >
                          {card.label}
                        </p>
                        <p
                          style={{
                            fontFamily: TELE, fontSize: 9,
                            color: 'rgba(214,205,184,0.35)',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            marginTop: 5,
                          }}
                        >
                          {card.role}
                        </p>
                      </motion.div>

                      {/* Testimony block — typewriter reveal */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 p-7"
                        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.3, delay: isActive ? 0.15 : 0 }}
                      >
                        <div style={{ width: 28, height: 1, backgroundColor: '#C4622D', marginBottom: 18 }} />

                        <p style={{ fontSize: 12.5, color: 'rgba(214,205,184,0.82)', lineHeight: 1.9, letterSpacing: '0.015em' }}>
                          &ldquo;<TypewriterText text={card.transcript} active={isActive} />&rdquo;
                        </p>

                        <div
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            marginTop: 18, paddingTop: 14,
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <span style={{ fontFamily: TELE, fontSize: 7, color: 'rgba(214,205,184,0.18)', letterSpacing: '0.35em', textTransform: 'uppercase' }}>
                            {card.ref}
                          </span>
                          <span
                            style={{
                              fontFamily: TELE, fontSize: 7,
                              color: '#3D7A58',
                              letterSpacing: '0.25em', textTransform: 'uppercase',
                              border: '1px solid rgba(61,122,88,0.35)',
                              padding: '2px 8px',
                            }}
                          >
                            VERIFIED
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Active bottom rule: scaleX 0 → 1 */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 z-[6]"
                      animate={{ opacity: isActive ? 1 : 0, scaleX: isActive ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: EXPO_OUT }}
                      style={{ height: 1, backgroundColor: '#C4622D', transformOrigin: 'left' }}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Progress rail ──
          All 10 records shown as dots; window slot highlighted; active slot burnt orange */}
      <div className="flex items-center gap-2.5 mt-5">
        {INFORMANTS.map((inf, i) => {
          const inWindow    = visibleCards.some(c => c.id === inf.id);
          const isHovered   = hoveredId === inf.id;
          const isCenter    = inf.id === centerCard.id && hoveredId === null;
          const isHighlight = isHovered || isCenter;

          return (
            <button
              key={inf.id}
              onClick={() => setStartIndex(i)}
              className="relative h-px overflow-hidden"
              style={{
                width: isHighlight ? '44px' : inWindow ? '20px' : '10px',
                backgroundColor: inWindow ? '#1E2330' : '#0E1420',
                transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1), background-color 0.3s ease',
                border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0,
              }}
            >
              {isHighlight && (
                <div className="absolute inset-0" style={{ backgroundColor: '#C4622D' }} />
              )}
              {inWindow && !isHighlight && (
                <div className="absolute inset-0" style={{ backgroundColor: 'rgba(214,205,184,0.15)' }} />
              )}
            </button>
          );
        })}

        <span
          style={{
            fontFamily: TELE, fontSize: 7,
            color: 'rgba(214,205,184,0.15)',
            letterSpacing: '0.4em', textTransform: 'uppercase',
            marginLeft: 10,
          }}
        >
          {String(startIndex + 1).padStart(2, '0')} / {String(INFORMANTS.length).padStart(2, '0')}
        </span>
      </div>

      {/* ── Section footer ── */}
      <div className="mt-16 max-w-5xl">
        <Separator className="bg-[#1E2330]" />
        <p
          className="mt-4 text-[7.5px] tracking-[0.4em] uppercase"
          style={{ fontFamily: TELE, color: 'rgba(214,205,184,0.08)' }}
        >
          End of Exhibits &mdash; All testimony verified &amp; sealed
        </p>
      </div>
    </section>
  );
};

export default Informants;
