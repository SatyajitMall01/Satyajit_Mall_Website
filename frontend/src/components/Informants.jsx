import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from './ui/separator';

const EXPO_OUT    = [0.16, 1, 0.3, 1];
const SWISS       = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const TELE        = "'Courier New', Courier, monospace";
const WINDOW_SIZE = 5;

/* ── Verified informant database (6 records) ── */
const INFORMANTS = [
  {
    id: 'inf-01', serial: 'S/N 001', ref: 'REF-0091A',
    codename: 'THE ARCHITECT', realName: 'Shivam Chopra',
    role: 'Chief Technology Officer', division: 'MILES EDUCATION',
    image: '/informants/shivam.png',
    quote: "Satyajit bridges the hardest gap in tech: translating business needs into deterministic engineering architecture. When we scaled the Miles One app and the AI pipelines, he didn\u2019t just write specs; he ensured our database structures and n8n workflows actually worked in production.",
  },
  {
    id: 'inf-02', serial: 'S/N 002', ref: 'REF-0134B',
    codename: 'THE STRATEGIST', realName: 'Sharanya Mukhopadhyay',
    role: 'AVP Digital Marketing', division: 'MILES EDUCATION',
    image: '/informants/sharanya.png',
    quote: "He is that rare PM who actually understands Go-To-Market. Satyajit built the underlying CDP and MarTech infrastructure that allowed my team to scale our webinar deployments and drive a massive +20% lift in ROAS. He directly connects product to revenue.",
  },
  {
    id: 'inf-03', serial: 'S/N 003', ref: 'REF-0267C',
    codename: 'THE VETERAN', realName: 'Karan Mandalam',
    role: 'Senior Product Manager', division: 'UPGRAD | ALMABETTER | MILES',
    image: '/informants/karan.png',
    quote: "Having worked alongside him across three different high-growth companies, I can say his ability to drop into a chaotic environment and build 0-to-1 systems is unmatched. Whether it\u2019s enterprise CRM routing or PLG loops, he builds machines that compound in value.",
  },
  {
    id: 'inf-04', serial: 'S/N 004', ref: 'REF-0312D',
    codename: 'THE CO-PILOT', realName: 'Shamantha K',
    role: 'AVP Product', division: 'MILES EDUCATION',
    image: '/informants/shamantha.png',
    quote: "Leading the core product verticals alongside Satyajit has been incredible. He doesn\u2019t just manage product; he engineers the entire underlying ecosystem. From unifying our CRM and LMS platforms to integrating complex AI automation, he builds the scalable systems that power our core user journeys.",
  },
  {
    id: 'inf-05', serial: 'S/N 005', ref: 'REF-0445E',
    codename: 'THE OPERATOR', realName: 'Shalini Basu',
    role: 'Product Lead', division: 'GROWTH & VENTURE',
    image: '/informants/shalini.png',
    quote: "A master of tactical execution. He has an incredible ability to identify operational debt and eliminate it. He doesn\u2019t just launch features; he drops into engineering workflows, re-engineers sprint cycles, and transforms ticketing systems to make the whole company move faster.",
  },
  {
    id: 'inf-06', serial: 'S/N 006', ref: 'REF-0523F',
    codename: 'THE GROWTH ENGINE', realName: 'Varun Pratap Singh',
    role: 'Head of Growth | Ex-Founder', division: 'IMARTICUS | SCALER',
    image: '/informants/varun.png',
    quote: "Having scaled some of the largest ed-tech funnels in the country, I know the difference between a vanity feature and a core growth engine. Satyajit builds the latter. He understands that real product-led growth requires airtight data pipelines, AI automation, and deterministic technical architecture.",
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
    <section className="py-24 px-8 md:px-12 bg-[#141A21]" id="informants">

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
          style={{ fontFamily: TELE, color: '#dc2626' }}
        >
          Peer Telemetry
        </span>

        <div className="overflow-hidden">
          <motion.h2
            className="text-[24px] md:text-[30px] text-[#FFFFFF] tracking-[0.03em]"
            style={{ fontFamily: SWISS }}
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
          style={{ fontFamily: TELE, color: '#D1D5DB' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          Verified Endorsements &mdash; Select to Read
        </motion.p>

        <div className="w-12 h-px mt-4" style={{ backgroundColor: '#dc2626' }} />
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
                      alt={card.codename}
                      className="absolute inset-0 w-full h-full object-cover object-[25%] pointer-events-none select-none"
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
                            color: '#dc2626',
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
                        <XHair size={18} color="rgba(220,38,38,0.25)" />
                      </div>

                      {/* Name — bottom, vertical */}
                      <div className="absolute bottom-8 inset-x-0 flex justify-center">
                        <span
                          style={{
                            fontFamily: SWISS, fontSize: 8.5, fontWeight: 500,
                            color: '#E5E7EB',
                            letterSpacing: '0.32em',
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {card.codename}
                        </span>
                      </div>

                      {/* Corner registration marks */}
                      <div className="absolute top-3 left-3 w-3 h-3 border-t border-l pointer-events-none" style={{ borderColor: 'rgba(220,38,38,0.2)' }} />
                      <div className="absolute top-3 right-3 w-3 h-3 border-t border-r pointer-events-none" style={{ borderColor: 'rgba(220,38,38,0.2)' }} />
                      <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l pointer-events-none" style={{ borderColor: 'rgba(220,38,38,0.2)' }} />
                      <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r pointer-events-none" style={{ borderColor: 'rgba(220,38,38,0.2)' }} />
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
                      <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: 'rgba(220,38,38,0.4)' }} />
                      <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: 'rgba(220,38,38,0.4)' }} />
                      <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: 'rgba(220,38,38,0.4)' }} />
                      <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: 'rgba(220,38,38,0.4)' }} />

                      {/* Identity block — slides down on activation */}
                      <motion.div
                        className="absolute top-7 left-7 right-7"
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                        transition={{ duration: 0.38, delay: isActive ? 0.1 : 0, ease: EXPO_OUT }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <XHair size={10} color="rgba(220,38,38,0.5)" />
                          <span
                            style={{
                              fontFamily: TELE, fontSize: 7.5,
                              color: '#EF4444',
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
                            color: '#FFFFFF',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            lineHeight: 1.2,
                          }}
                        >
                          {card.codename}
                        </p>
                        <p
                          style={{
                            fontFamily: SWISS, fontSize: 11, fontWeight: 500,
                            color: '#D1D5DB',
                            letterSpacing: '0.05em',
                            marginTop: 3,
                          }}
                        >
                          {card.realName}
                        </p>
                        <p
                          style={{
                            fontFamily: TELE, fontSize: 9,
                            color: '#D1D5DB',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            marginTop: 5,
                          }}
                        >
                          {card.role} &middot; {card.division}
                        </p>
                      </motion.div>

                      {/* Testimony block — typewriter reveal */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 p-7"
                        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.3, delay: isActive ? 0.15 : 0 }}
                      >
                        <div style={{ width: 28, height: 1, backgroundColor: '#dc2626', marginBottom: 18 }} />

                        <p style={{ fontSize: 12.5, color: '#E5E7EB', lineHeight: 1.9, letterSpacing: '0.015em' }}>
                          &ldquo;<TypewriterText text={card.quote} active={isActive} />&rdquo;
                        </p>

                        <div
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            marginTop: 18, paddingTop: 14,
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <span style={{ fontFamily: TELE, fontSize: 7, color: '#9CA3AF', letterSpacing: '0.35em', textTransform: 'uppercase' }}>
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
                      style={{ height: 1, backgroundColor: '#dc2626', transformOrigin: 'left' }}
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
                <div className="absolute inset-0" style={{ backgroundColor: '#dc2626' }} />
              )}
              {inWindow && !isHighlight && (
                <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
              )}
            </button>
          );
        })}

        <span
          style={{
            fontFamily: TELE, fontSize: 7,
            color: '#9CA3AF',
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
          style={{ fontFamily: TELE, color: '#9CA3AF' }}
        >
          End of Records &mdash; All records verified
        </p>
      </div>
    </section>
  );
};

export default Informants;
