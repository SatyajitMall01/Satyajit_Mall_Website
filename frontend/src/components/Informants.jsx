import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Separator } from './ui/separator';

const EXPO_OUT = [0.16, 1, 0.3, 1];
const SWISS    = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const TELE     = "'Courier New', Courier, monospace";

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
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className="py-24 px-8 md:px-12 bg-[#0F1419]" id="informants">

      {/* Section header */}
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

      {/* Accordion entrance wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: EXPO_OUT, delay: 0.2 }}
      >
        {/* 5-card hover accordion */}
        <div className="flex w-full h-[520px] gap-[2px] overflow-hidden">
          {INFORMANTS.map((inf, i) => {
            const isActive = i === activeIdx;

            return (
              <motion.div
                key={inf.id}
                className="relative flex-shrink-0 overflow-hidden"
                style={{ backgroundColor: '#0C1018' }}
                initial={false}
                animate={{ width: isActive ? '60%' : '10%' }}
                transition={{ duration: 0.72, ease: EXPO_OUT }}
                onMouseEnter={() => setActiveIdx(i)}
              >
                {/* Portrait — high-contrast surveillance photo */}
                <img
                  src={inf.image}
                  alt={inf.label}
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
                    Always mounted; fades out when active */}
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
                      {inf.serial}
                    </span>
                  </div>

                  {/* Center crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <XHair size={18} color="rgba(214,205,184,0.1)" />
                  </div>

                  {/* Name — bottom, vertical, always fully visible */}
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
                      {inf.label}
                    </span>
                  </div>

                  {/* Corner registration marks */}
                  <div className="absolute top-3 left-3 w-3 h-3 border-t border-l pointer-events-none" style={{ borderColor: 'rgba(214,205,184,0.1)' }} />
                  <div className="absolute top-3 right-3 w-3 h-3 border-t border-r pointer-events-none" style={{ borderColor: 'rgba(214,205,184,0.1)' }} />
                  <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l pointer-events-none" style={{ borderColor: 'rgba(214,205,184,0.1)' }} />
                  <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r pointer-events-none" style={{ borderColor: 'rgba(214,205,184,0.1)' }} />
                </motion.div>

                {/* ── ACTIVE: classified acetate decryption ──
                    Dark blue-charcoal tint over photo */}
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

                  {/* Identity block — top left */}
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
                        {inf.serial} &nbsp;&middot;&nbsp; {inf.ref}
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
                      {inf.label}
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
                      {inf.role}
                    </p>
                  </motion.div>

                  {/* Testimony block — bottom */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-7"
                    animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.3, delay: isActive ? 0.15 : 0 }}
                  >
                    <div style={{ width: 28, height: 1, backgroundColor: '#C4622D', marginBottom: 18 }} />

                    <p style={{ fontSize: 12.5, color: 'rgba(214,205,184,0.82)', lineHeight: 1.9, letterSpacing: '0.015em' }}>
                      &ldquo;<TypewriterText text={inf.transcript} active={isActive} />&rdquo;
                    </p>

                    <div
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        marginTop: 18, paddingTop: 14,
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <span style={{ fontFamily: TELE, fontSize: 7, color: 'rgba(214,205,184,0.18)', letterSpacing: '0.35em', textTransform: 'uppercase' }}>
                        {inf.ref}
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

                {/* Active bottom rule */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 z-[6]"
                  animate={{ opacity: isActive ? 1 : 0, scaleX: isActive ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: EXPO_OUT }}
                  style={{ height: 1, backgroundColor: '#C4622D', transformOrigin: 'left' }}
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Tab progress indicators */}
      <div className="flex items-center gap-3 mt-5">
        {INFORMANTS.map((inf, i) => {
          const isActive = i === activeIdx;
          return (
            <button
              key={inf.id}
              onMouseEnter={() => setActiveIdx(i)}
              className="relative h-px overflow-hidden"
              style={{
                width: isActive ? '44px' : '18px',
                backgroundColor: '#1E2330',
                transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
                border: 'none', padding: 0,
              }}
            >
              {isActive && <div className="absolute inset-0" style={{ backgroundColor: '#C4622D' }} />}
            </button>
          );
        })}
        <span style={{ fontFamily: TELE, fontSize: 7, color: 'rgba(214,205,184,0.15)', letterSpacing: '0.4em', textTransform: 'uppercase', marginLeft: 8 }}>
          {String(activeIdx + 1).padStart(2, '0')} / {String(INFORMANTS.length).padStart(2, '0')}
        </span>
      </div>

      {/* Section footer */}
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
