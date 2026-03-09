import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Terminal, Archive, FileText, Lock } from 'lucide-react';
import { profileData } from '../data/mock';

const TELE   = "'Courier New', Courier, monospace";
const SWISS  = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const JULIUS = "'Julius Sans One', sans-serif";
const EXPO   = [0.16, 1, 0.3, 1];

const FOLD_VP = { once: true, margin: '-80px' };
const FOLD_IN = { opacity: 0, y: 60 };
const FOLD_AN = { opacity: 1, y: 0 };
const FOLD_TR = { duration: 0.9, ease: EXPO };

/* ── Blinking block cursor ── */
const BlinkCursor = () => {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn(v => !v), 530);
    return () => clearInterval(id);
  }, []);
  return <span style={{ opacity: on ? 1 : 0, fontFamily: TELE }}>█</span>;
};

/* ── Section eyebrow label with icon ── */
const FoldMeta = ({ icon: Icon, fold, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
    <Icon size={12} strokeWidth={1.5} color="rgba(178,34,34,0.65)" />
    <span
      style={{
        fontFamily: TELE, fontSize: 7.5,
        color: 'rgba(178,34,34,0.65)',
        letterSpacing: '0.45em',
        textTransform: 'uppercase',
      }}
    >
      {fold} &middot; {title}
    </span>
  </div>
);

/* ── Section heading ── */
const SectionHead = ({ children }) => (
  <h2
    style={{
      fontFamily: JULIUS, fontSize: 26,
      color: 'rgba(244,236,216,0.9)',
      letterSpacing: '0.04em',
      margin: '0 0 6px',
    }}
  >
    {children}
  </h2>
);

/* ── Horizontal rule ── */
const Rule = ({ width = 40 }) => (
  <div style={{ width, height: 1, backgroundColor: '#B22222', margin: '14px 0 28px' }} />
);

/* ══════════════════════════════════════════
   FOLD 1 — THE VITALS
   "The Redacted Identity Card"
   50/50 split: portrait | ID card
══════════════════════════════════════════ */
const Fold1 = () => (
  <section
    className="relative bg-[#0F1419]"
    style={{ minHeight: '100vh', display: 'flex' }}
  >
    {/* LEFT — Portrait with crosshair corners */}
    <div
      className="hidden md:block"
      style={{ width: '50%', position: 'relative', overflow: 'hidden' }}
    >
      <img
        src={profileData.heroImage}
        alt="Satyajit Mall"
        draggable={false}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'top center',
          filter: 'grayscale(100%) contrast(130%) brightness(0.55)',
          userSelect: 'none',
        }}
      />
      {/* Gradient bleed — right edge */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, transparent 60%, #0F1419 100%)',
          zIndex: 2,
        }}
      />
      {/* Bottom fade */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '25%',
          background: 'linear-gradient(to top, #0F1419, transparent)',
          zIndex: 2,
        }}
      />
      {/* Crosshair corners */}
      {[
        { top: 18, left: 18 },
        { top: 18, right: 18 },
        { bottom: 18, left: 18 },
        { bottom: 18, right: 18 },
      ].map((pos, i) => (
        <div key={i} style={{ position: 'absolute', zIndex: 3, ...pos }}>
          <Crosshair size={16} strokeWidth={1} color="rgba(178,34,34,0.55)" />
        </div>
      ))}
      {/* Film grain */}
      <div
        style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '180px 180px',
          opacity: 0.05,
        }}
      />
    </div>

    {/* RIGHT — Identity Card */}
    <div
      className="w-full md:w-1/2 flex items-center justify-center"
      style={{ padding: 'clamp(32px, 5vw, 72px)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EXPO, delay: 0.2 }}
        style={{ width: '100%', maxWidth: 480, position: 'relative' }}
      >
        {/* CLASSIFIED stamp */}
        <div
          style={{
            position: 'absolute', top: -10, right: -4,
            transform: 'rotate(-13deg)',
            border: '2.5px solid rgba(178,34,34,0.62)',
            padding: '3px 14px',
            fontFamily: SWISS, fontSize: 14, fontWeight: 900,
            color: 'rgba(178,34,34,0.62)',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            zIndex: 2,
            userSelect: 'none',
          }}
        >
          CLASSIFIED
        </div>

        {/* Card body */}
        <div
          style={{
            border: '2px solid rgba(107,114,128,0.35)',
            padding: '36px 40px',
            backgroundColor: 'rgba(15,20,25,0.6)',
          }}
        >
          {/* Case tag */}
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              backgroundColor: 'rgba(178,34,34,0.1)',
              border: '1px solid rgba(178,34,34,0.25)',
              padding: '4px 12px',
              marginBottom: 28,
            }}
          >
            <FileText size={10} strokeWidth={1.5} color="rgba(178,34,34,0.65)" />
            <span
              style={{
                fontFamily: TELE, fontSize: 7.5,
                color: 'rgba(178,34,34,0.65)',
                letterSpacing: '0.4em', textTransform: 'uppercase',
              }}
            >
              Case File #001 &mdash; Active
            </span>
          </div>

          {/* Name */}
          <h1
            style={{
              fontFamily: JULIUS, fontSize: 32,
              color: 'rgba(244,236,216,0.95)',
              letterSpacing: '0.04em',
              margin: '0 0 6px',
            }}
          >
            Satyajit Mall
          </h1>

          {/* Classification tag */}
          <p
            style={{
              fontFamily: SWISS, fontSize: 9,
              fontWeight: 700,
              color: '#B22222',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              margin: '0 0 20px',
            }}
          >
            Product Manager &nbsp;//&nbsp; Product Architect
          </p>

          {/* Separator */}
          <div style={{ height: 1, backgroundColor: 'rgba(107,114,128,0.2)', marginBottom: 24 }} />

          {/* Summary */}
          <p
            style={{
              fontFamily: TELE, fontSize: 11.5,
              color: 'rgba(214,205,184,0.68)',
              lineHeight: 1.95, letterSpacing: '0.018em',
              margin: '0 0 24px',
            }}
          >
            &ldquo;I bridge the gap between business objectives and the
            engineering layer. While mastering the deepest technical nuances,
            I understand the underlying architecture better than most. I don&rsquo;t
            just write PRDs; I design the deterministic systems that prevent
            data fragmentation and drive product-led growth. Identity precedes
            activity. You cannot automate a mess.&rdquo;
          </p>

          {/* Barcode strip */}
          <div
            style={{
              height: 22, marginBottom: 16,
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 3px, rgba(255,255,255,0.08) 3px, rgba(255,255,255,0.08) 5px, transparent 5px, transparent 8px, rgba(255,255,255,0.14) 8px, rgba(255,255,255,0.14) 10px, transparent 10px, transparent 13px)',
            }}
          />

          {/* Footer metadata */}
          <div
            style={{
              display: 'flex', justifyContent: 'space-between',
              paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <span style={{ fontFamily: TELE, fontSize: 7, color: 'rgba(214,205,184,0.18)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              Experience: 4.5+ Yrs
            </span>
            <span style={{ fontFamily: TELE, fontSize: 7, color: 'rgba(214,205,184,0.18)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              REF: 0001-A
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ══════════════════════════════════════════
   FOLD 2 — CLEARANCE & ARSENAL
   "The Mainframe Terminal Output"
   Dark CRT terminal with scanlines
══════════════════════════════════════════ */
const TERM_CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.2 } },
};
const TERM_LINE = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const TERMINAL_LINES = [
  { text: '> INITIALIZING SECURE CONNECTION...', color: 'rgba(61,122,88,0.55)' },
  { text: '> QUERY: OPERATIVE CAPABILITIES...', color: 'rgba(61,122,88,0.65)' },
  { text: '> MATCH FOUND: Agentic AI & Real-Time MVP Development (Cursor, Claude)', color: 'rgba(61,122,88,0.9)' },
  { text: '> MATCH FOUND: CDP-to-App Data Mergers & MarTech Architecture', color: 'rgba(61,122,88,0.9)' },
  { text: '> MATCH FOUND: Data Forensics & BI (BigQuery, PostgreSQL, dbt)', color: 'rgba(61,122,88,0.9)' },
  { text: '> STATUS: High-Velocity Agile Delivery Engine (CSPO & Six Sigma Green Belt)', color: 'rgba(61,122,88,0.9)' },
];

const Fold2 = () => (
  <section
    className="bg-[#0F1419]"
    style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: 'clamp(48px, 8vw, 96px) clamp(24px, 6vw, 72px)',
      borderTop: '1px solid #111820',
    }}
  >
    <motion.div
      initial={FOLD_IN} whileInView={FOLD_AN}
      viewport={FOLD_VP} transition={FOLD_TR}
      style={{ marginBottom: 32 }}
    >
      <FoldMeta icon={Terminal} fold="Fold II of V" title="Clearance & Arsenal" />
      <SectionHead>Core Capabilities</SectionHead>
      <Rule />
    </motion.div>

    {/* Terminal box */}
    <motion.div
      variants={TERM_CONTAINER}
      initial="hidden"
      whileInView="visible"
      viewport={FOLD_VP}
      style={{
        backgroundColor: '#0A0D10',
        border: '1px solid rgba(107,114,128,0.3)',
        padding: '0',
        position: 'relative',
        maxWidth: 820,
        overflow: 'hidden',
      }}
    >
      {/* Scanline overlay */}
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)',
          pointerEvents: 'none', zIndex: 1,
        }}
      />

      {/* Terminal title bar */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 20px',
          borderBottom: '1px solid rgba(107,114,128,0.18)',
          backgroundColor: '#080B0E',
        }}
      >
        <div style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#B22222' }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#333' }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#2A2A2A' }} />
        <span
          style={{
            fontFamily: TELE, fontSize: 8.5,
            color: 'rgba(214,205,184,0.2)',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            marginLeft: 10,
          }}
        >
          OPERATIVE_SYSTEM v4.5 &nbsp;//&nbsp; SECURE TERMINAL
        </span>
      </div>

      {/* Lines */}
      <div style={{ padding: '24px 28px', position: 'relative', zIndex: 2 }}>
        {TERMINAL_LINES.map((line, i) => (
          <motion.p
            key={i}
            variants={TERM_LINE}
            style={{
              fontFamily: TELE, fontSize: 12.5,
              color: line.color,
              lineHeight: 2.1, margin: 0,
              letterSpacing: '0.01em',
            }}
          >
            {line.text}
          </motion.p>
        ))}
        {/* Cursor line */}
        <motion.p
          variants={TERM_LINE}
          style={{
            fontFamily: TELE, fontSize: 12.5,
            color: 'rgba(61,122,88,0.75)',
            lineHeight: 2.1, margin: '4px 0 0',
          }}
        >
          &gt;&nbsp;<BlinkCursor />
        </motion.p>
      </div>
    </motion.div>
  </section>
);

/* ══════════════════════════════════════════
   FOLD 3 — OPERATIONAL LOG
   "The Microfiche Viewer" — interactive tabs
══════════════════════════════════════════ */
const MICROFICHE_TABS = [
  {
    label: 'SUBJECT A',
    title: 'Miles One — Super App',
    ref: 'REF-REEL: M-ONE-2023',
    content:
      'Architected the Universal Identity Registry (UIR). Enforced SSO tracking to onboard 40,000+ learners, driving ₹20 Cr+ in app-revenue via behavior-triggered engagement.',
  },
  {
    label: 'SUBJECT B',
    title: 'Miles Masterclass — AI-OTT',
    ref: 'REF-REEL: M-CLASS-2024',
    content:
      'Engineered a Chapter-Aware RAG pipeline for a high-intent OTT ecosystem. Scaled to 30,000+ users and boosted core lead conversion by 15%.',
  },
  {
    label: 'SUBJECT C',
    title: 'Miles Engage — Attribution',
    ref: 'REF-REEL: M-ENG-2024',
    content:
      'Built a proprietary Linear + Time-Decay attribution engine. Recovered 4,000+ "Ghost Leads" and lifted overall ROAS by 20%.',
  },
];

const Fold3 = () => {
  const [active, setActive] = useState(0);

  return (
    <section
      className="bg-[#0F1419]"
      style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'clamp(48px, 8vw, 96px) clamp(24px, 6vw, 72px)',
        borderTop: '1px solid #111820',
      }}
    >
      <motion.div
        initial={FOLD_IN} whileInView={FOLD_AN}
        viewport={FOLD_VP} transition={FOLD_TR}
        style={{ marginBottom: 32 }}
      >
        <FoldMeta icon={Archive} fold="Fold III of V" title="Operational Log" />
        <SectionHead>Miles Education &mdash; Dec 2023 – Present</SectionHead>
        <Rule />
      </motion.div>

      <motion.div
        initial={FOLD_IN} whileInView={FOLD_AN}
        viewport={FOLD_VP} transition={{ ...FOLD_TR, delay: 0.15 }}
        style={{ maxWidth: 780 }}
      >
        {/* Microfiche header strip */}
        <div
          style={{
            backgroundColor: '#0A0D10',
            border: '1px solid rgba(107,114,128,0.2)',
            borderBottom: 'none',
            padding: '8px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <span style={{ fontFamily: TELE, fontSize: 7.5, color: 'rgba(214,205,184,0.2)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            MICROFICHE ARCHIVE &mdash; OPERATIVE: SATYAJIT MALL
          </span>
          <span style={{ fontFamily: TELE, fontSize: 7.5, color: 'rgba(214,205,184,0.18)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {MICROFICHE_TABS[active].ref}
          </span>
        </div>

        {/* Tab buttons */}
        <div style={{ display: 'flex' }}>
          {MICROFICHE_TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                flex: 1,
                fontFamily: TELE, fontSize: 8.5,
                letterSpacing: '0.28em', textTransform: 'uppercase',
                padding: '10px 16px',
                backgroundColor: active === i ? '#131920' : '#0A0D10',
                border: '1px solid',
                borderColor: active === i ? 'rgba(178,34,34,0.5)' : 'rgba(107,114,128,0.18)',
                borderBottom: active === i ? '1px solid #131920' : '1px solid rgba(107,114,128,0.18)',
                borderTop: active === i ? '2px solid #B22222' : '2px solid transparent',
                color: active === i ? 'rgba(244,236,216,0.9)' : 'rgba(214,205,184,0.25)',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div
          style={{
            backgroundColor: '#131920',
            border: '1px solid rgba(107,114,128,0.18)',
            borderTop: 'none',
            padding: '32px 36px',
            minHeight: 260,
            position: 'relative',
          }}
        >
          {/* Scanlines */}
          <div
            style={{
              position: 'absolute', inset: 0,
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0,0,0,0.04) 4px, rgba(0,0,0,0.04) 5px)',
              pointerEvents: 'none',
            }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'linear' }}
            >
              {/* Reel title */}
              <p
                style={{
                  fontFamily: SWISS, fontSize: 9,
                  fontWeight: 700,
                  color: '#B22222',
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  margin: '0 0 18px',
                }}
              >
                {MICROFICHE_TABS[active].title}
              </p>

              {/* Content */}
              <p
                style={{
                  fontFamily: TELE, fontSize: 12.5,
                  color: 'rgba(214,205,184,0.75)',
                  lineHeight: 2.0, letterSpacing: '0.018em',
                  margin: 0,
                }}
              >
                {MICROFICHE_TABS[active].content}
              </p>

              {/* Reel footer */}
              <div
                style={{
                  marginTop: 28, paddingTop: 14,
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', justifyContent: 'space-between',
                }}
              >
                <span style={{ fontFamily: TELE, fontSize: 7, color: 'rgba(214,205,184,0.12)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                  {MICROFICHE_TABS[active].ref}
                </span>
                <span style={{ fontFamily: TELE, fontSize: 7, color: 'rgba(61,122,88,0.4)', letterSpacing: '0.22em', textTransform: 'uppercase', border: '1px solid rgba(61,122,88,0.2)', padding: '1px 6px' }}>
                  VERIFIED
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};

/* ══════════════════════════════════════════
   FOLD 4 — PAST JURISDICTIONS
   "The Surveillance Wireframes"
   Two-column grid, paper with staple border
══════════════════════════════════════════ */
const JURISDICTIONS = [
  {
    id: 'almabetter',
    jurisdiction: 'AlmaBetter',
    designation: 'Product Lead — Growth & Strategy',
    period: 'Nov 2022 – Oct 2023',
    content:
      'Productized support ticketing via an ELT layer. Correlated student churn to "Resolution Velocity," pushing CSAT from 7.0 to 9.1. Orchestrated Events GTM driving 20% QoQ growth.',
  },
  {
    id: 'upgrad',
    jurisdiction: 'UpGrad',
    designation: 'Sr. Associate — Program & Content',
    period: 'Jan 2021 – Oct 2022',
    content:
      'Deployed behavioral forensics to identify a critical "120-minute decay curve" in learner engagement, hard-coding interventions to drive a 20% improvement in course completion.',
  },
];

const Fold4 = () => (
  <section
    className="bg-[#0F1419]"
    style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: 'clamp(48px, 8vw, 96px) clamp(24px, 6vw, 72px)',
      borderTop: '1px solid #111820',
    }}
  >
    <motion.div
      initial={FOLD_IN} whileInView={FOLD_AN}
      viewport={FOLD_VP} transition={FOLD_TR}
      style={{ marginBottom: 48 }}
    >
      <FoldMeta icon={FileText} fold="Fold IV of V" title="Past Jurisdictions" />
      <SectionHead>AlmaBetter &amp; UpGrad</SectionHead>
      <Rule />
    </motion.div>

    <div
      className="grid grid-cols-1 md:grid-cols-2"
      style={{ gap: 'clamp(24px, 4vw, 48px)', maxWidth: 1000 }}
    >
      {JURISDICTIONS.map((j, idx) => (
        <motion.div
          key={j.id}
          initial={FOLD_IN} whileInView={FOLD_AN}
          viewport={FOLD_VP}
          transition={{ ...FOLD_TR, delay: idx * 0.12 }}
          style={{
            borderTop: '4px solid rgba(209,213,219,0.7)',
            paddingTop: 24,
            position: 'relative',
          }}
        >
          {/* Paper document stack shadow */}
          <div
            style={{
              position: 'absolute', top: 4, left: 4, right: -4, bottom: -4,
              border: '1px solid rgba(255,255,255,0.04)',
              backgroundColor: 'rgba(15,20,25,0.4)',
              zIndex: -1,
            }}
          />

          <span
            style={{
              fontFamily: SWISS, fontSize: 8,
              fontWeight: 700,
              color: '#B22222',
              letterSpacing: '0.38em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: 10,
            }}
          >
            Jurisdiction: {j.jurisdiction}
          </span>

          <h3
            style={{
              fontFamily: SWISS, fontSize: 13,
              fontWeight: 700,
              color: 'rgba(244,236,216,0.88)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              margin: '0 0 8px',
            }}
          >
            {j.designation}
          </h3>

          <p
            style={{
              fontFamily: TELE, fontSize: 8.5,
              color: 'rgba(214,205,184,0.28)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              margin: '0 0 20px',
            }}
          >
            {j.period}
          </p>

          <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />

          <p
            style={{
              fontFamily: TELE, fontSize: 11.5,
              color: 'rgba(214,205,184,0.68)',
              lineHeight: 1.95, letterSpacing: '0.018em',
              margin: 0,
            }}
          >
            &ldquo;{j.content}&rdquo;
          </p>
        </motion.div>
      ))}
    </div>
  </section>
);

/* ══════════════════════════════════════════
   FOLD 5 — ACADEMIC ARCHIVES
   "The Indexed Ledger"
   Typewritten dotted ledger + SEALED footer
══════════════════════════════════════════ */
const LEDGER_ENTRIES = [
  { degree: 'PGDM — Marketing',        institution: 'Pune Institute of Business Management',   year: '2019–2021' },
  { degree: 'B.Tech',                   institution: 'Dr. Sudhir Chandra Sur Degree Engineering', year: '2015–2019' },
];

const CERTS = [
  { name: 'Certified Scrum Product Owner',  id: 'CSPO' },
  { name: 'Six Sigma Green Belt',            id: 'SSGB' },
];

const LedgerRow = ({ left, right, sub, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={FOLD_VP}
    transition={{ duration: 0.6, ease: EXPO, delay }}
    style={{ marginBottom: 22 }}
  >
    <div
      style={{
        display: 'flex', alignItems: 'flex-end', gap: 6,
        borderBottom: '1px dotted rgba(107,114,128,0.35)',
        paddingBottom: 6,
      }}
    >
      <span
        style={{
          fontFamily: TELE, fontSize: 12,
          color: 'rgba(244,236,216,0.82)',
          letterSpacing: '0.04em',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}
      >
        {left}
      </span>
      <span style={{ flex: 1 }} />
      <span
        style={{
          fontFamily: TELE, fontSize: 11,
          color: 'rgba(214,205,184,0.45)',
          letterSpacing: '0.04em',
          textAlign: 'right',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}
      >
        {right}
      </span>
    </div>
    {sub && (
      <p
        style={{
          fontFamily: TELE, fontSize: 8.5,
          color: 'rgba(214,205,184,0.25)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          margin: '5px 0 0',
        }}
      >
        {sub}
      </p>
    )}
  </motion.div>
);

const Fold5 = () => (
  <section
    className="bg-[#0F1419] relative"
    style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: 'clamp(48px, 8vw, 96px) clamp(24px, 6vw, 72px)',
      borderTop: '1px solid #111820',
      paddingBottom: 'clamp(96px, 14vw, 160px)',
    }}
  >
    <motion.div
      initial={FOLD_IN} whileInView={FOLD_AN}
      viewport={FOLD_VP} transition={FOLD_TR}
      style={{ marginBottom: 40 }}
    >
      <FoldMeta icon={Lock} fold="Fold V of V" title="Academic Archives" />
      <SectionHead>The Indexed Ledger</SectionHead>
      <Rule />
    </motion.div>

    <div style={{ maxWidth: 640 }}>
      {/* Ledger header */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={FOLD_VP}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 28 }}
      >
        <p
          style={{
            fontFamily: SWISS, fontSize: 8, fontWeight: 700,
            color: 'rgba(178,34,34,0.55)',
            letterSpacing: '0.4em', textTransform: 'uppercase',
            borderBottom: '2px solid rgba(178,34,34,0.3)',
            paddingBottom: 10, marginBottom: 20,
            display: 'flex', justifyContent: 'space-between',
          }}
        >
          <span>Academic Record</span>
          <span>Institution &nbsp;//&nbsp; Year</span>
        </p>
      </motion.div>

      {/* Degree entries */}
      {LEDGER_ENTRIES.map((e, i) => (
        <LedgerRow
          key={i}
          left={e.degree}
          right={e.year}
          sub={e.institution}
          delay={i * 0.1}
        />
      ))}

      {/* Certifications sub-section */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={FOLD_VP}
        transition={{ duration: 0.5, delay: 0.25 }}
        style={{
          fontFamily: SWISS, fontSize: 8, fontWeight: 700,
          color: 'rgba(178,34,34,0.55)',
          letterSpacing: '0.4em', textTransform: 'uppercase',
          borderBottom: '2px solid rgba(178,34,34,0.3)',
          paddingBottom: 10, marginBottom: 20, marginTop: 32,
          display: 'flex', justifyContent: 'space-between',
        }}
      >
        <span>Certifications</span>
        <span>Issuer &nbsp;//&nbsp; ID</span>
      </motion.p>

      {CERTS.map((c, i) => (
        <LedgerRow
          key={i}
          left={c.name}
          right={c.id}
          delay={0.3 + i * 0.1}
        />
      ))}
    </div>

    {/* ── SEALED // END OF FILE — bottom center ── */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={FOLD_VP}
      transition={{ duration: 0.7, ease: EXPO, delay: 0.5 }}
      style={{
        position: 'absolute',
        bottom: 40, left: '50%',
        transform: 'translateX(-50%) rotate(-1.5deg)',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
    >
      <span
        style={{
          fontFamily: SWISS,
          fontSize: 'clamp(18px, 2.8vw, 30px)',
          fontWeight: 900,
          color: '#B22222',
          letterSpacing: '0.1em',
        }}
      >
        [ SEALED &nbsp;//&nbsp; END OF FILE ]
      </span>
    </motion.div>
  </section>
);

/* ══════════════════════════════════════════
   Root Export
══════════════════════════════════════════ */
const Dossier = () => (
  <div className="bg-[#0F1419]">
    <Fold1 />
    <Fold2 />
    <Fold3 />
    <Fold4 />
    <Fold5 />
  </div>
);

export default Dossier;
