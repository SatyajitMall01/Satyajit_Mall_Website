import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { profileData } from '../data/mock';

const TELE  = "'Courier New', Courier, monospace";
const JULIUS = "'Julius Sans One', sans-serif";

/* ── Shared node header ── */
const NodeLabel = ({ children }) => (
  <p
    style={{
      fontFamily: TELE, fontSize: 7.5,
      color: '#B22222',
      letterSpacing: '0.42em', textTransform: 'uppercase',
      marginBottom: 10, marginTop: 0,
    }}
  >
    {children}
  </p>
);

/* ── Bullet row ── */
const Bullet = ({ children }) => (
  <div style={{ display: 'flex', gap: 8, marginBottom: 9, alignItems: 'flex-start' }}>
    <span style={{ fontFamily: TELE, fontSize: 9, color: 'rgba(178,34,34,0.6)', flexShrink: 0, marginTop: 3 }}>›</span>
    <span style={{ fontFamily: TELE, fontSize: 10.5, color: 'rgba(214,205,184,0.68)', lineHeight: 1.85, letterSpacing: '0.015em' }}>
      {children}
    </span>
  </div>
);

/* ── Terminal data row ── */
const DataRow = ({ label, value }) => (
  <div style={{ marginBottom: 8 }}>
    <span style={{ fontFamily: TELE, fontSize: 8, color: 'rgba(178,34,34,0.55)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
      {label}&nbsp;
    </span>
    <span style={{ fontFamily: TELE, fontSize: 10, color: 'rgba(214,205,184,0.62)', letterSpacing: '0.04em' }}>
      {value}
    </span>
  </div>
);

/* ── HUD node shell — glassmorphism, 1960s colour palette ── */
const Node = ({ children, style }) => (
  <div
    style={{
      backgroundColor: 'rgba(15,20,25,0.52)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderTop: '1px solid rgba(178,34,34,0.35)',
      padding: '20px 24px',
      maxWidth: 360,
      ...style,
    }}
  >
    {children}
  </div>
);

/* ══════════════════════════════════════════
   Dossier Page
══════════════════════════════════════════ */
const Dossier = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /* ── Grand background title: drifts left on scroll ── */
  const titleX = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

  /* ── Portrait subtle parallax ── */
  const portraitY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);

  /* ── Node 1 — VITALS (Top Left) ──
     Slides down from top */
  const n1y = useTransform(scrollYProgress, [0, 0.30], [-100, 0]);
  const n1o = useTransform(scrollYProgress, [0, 0.20],  [0, 1]);

  /* ── Node 2 — OPERATIONAL LOG (Bottom Left) ──
     Slides up from bottom */
  const n2y = useTransform(scrollYProgress, [0.10, 0.50], [200, 0]);
  const n2o = useTransform(scrollYProgress, [0.10, 0.30], [0, 1]);

  /* ── Node 3 — PAST JURISDICTIONS (Top Right) ──
     Slides in from right */
  const n3x = useTransform(scrollYProgress, [0.30, 0.70], [200, 0]);
  const n3o = useTransform(scrollYProgress, [0.30, 0.50], [0, 1]);

  /* ── Node 4 — CLEARANCE & SKILLS (Bottom Right) ──
     Slides in diagonally from bottom-right */
  const n4y = useTransform(scrollYProgress, [0.50, 0.90], [150, 0]);
  const n4o = useTransform(scrollYProgress, [0.50, 0.70], [0, 1]);

  return (
    /* 250vh scroll canvas */
    <div ref={containerRef} className="relative bg-[#0F1419]" style={{ height: '250vh' }}>

      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Film grain */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'repeat',
            backgroundSize: '180px 180px',
            opacity: 0.04,
            zIndex: 0,
          }}
        />

        {/* ── Grand title — drifts left behind portrait ── */}
        <div
          className="absolute inset-x-0 overflow-hidden pointer-events-none"
          style={{ top: '22%', zIndex: 1 }}
        >
          <motion.div
            style={{ x: titleX, display: 'flex', justifyContent: 'center' }}
          >
            <span
              style={{
                fontFamily: JULIUS,
                fontSize: 'clamp(72px, 10vw, 140px)',
                fontWeight: 700,
                color: '#151C24',
                letterSpacing: '-0.04em',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                lineHeight: 1,
              }}
            >
              PRODUCT ARCHITECT
            </span>
          </motion.div>
        </div>

        {/* ── Central portrait — darkroom print ── */}
        <motion.img
          src={profileData.heroImage}
          alt="Satyajit Mall"
          className="absolute bottom-0 pointer-events-none select-none"
          draggable={false}
          style={{
            right: 'clamp(0px, 8vw, 128px)',
            height: '95vh',
            width: 'auto',
            objectFit: 'contain',
            objectPosition: 'bottom',
            filter: 'grayscale(100%) contrast(130%) brightness(0.58)',
            opacity: 0.62,
            mixBlendMode: 'luminosity',
            y: portraitY,
            zIndex: 2,
          }}
        />

        {/* Ambient vignettes — frame the composition */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(15,20,25,0.7) 100%)',
            zIndex: 3,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(15,20,25,0.6) 0%, transparent 18%, transparent 78%, rgba(15,20,25,0.85) 100%)',
            zIndex: 3,
          }}
        />

        {/* ── Page header — top-left identifier ── */}
        <div className="absolute top-7 left-12 z-[20]">
          <span
            style={{
              fontFamily: TELE, fontSize: 7.5,
              color: 'rgba(178,34,34,0.55)',
              letterSpacing: '0.5em', textTransform: 'uppercase',
              display: 'block', marginBottom: 5,
            }}
          >
            Classified &middot; Case File #002
          </span>
          <h1
            style={{
              fontFamily: JULIUS, fontSize: 22,
              color: 'rgba(244,236,216,0.85)',
              letterSpacing: '0.05em', margin: 0,
            }}
          >
            The Dossier
          </h1>
          <div style={{ width: 36, height: 1, backgroundColor: '#B22222', marginTop: 8 }} />
        </div>

        {/* ── Scroll cue ── */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[20] flex flex-col items-center gap-2"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]) }}
        >
          <span
            style={{
              fontFamily: TELE, fontSize: 6.5,
              color: 'rgba(214,205,184,0.18)',
              letterSpacing: '0.4em', textTransform: 'uppercase',
            }}
          >
            Scroll to Assemble
          </span>
          <div style={{ width: 1, height: 20, background: 'linear-gradient(to bottom, rgba(178,34,34,0.45), transparent)' }} />
        </motion.div>

        {/* ════════════════════════════════
            HUD Data Nodes — z-[10] each
        ════════════════════════════════ */}

        {/* NODE 1 — VITALS (Top Left) */}
        <motion.div
          className="absolute"
          style={{
            top: 80, left: 48,
            opacity: n1o, y: n1y,
            zIndex: 10,
          }}
        >
          <Node>
            <NodeLabel>Node 01 &middot; Vitals</NodeLabel>
            <div style={{ marginBottom: 12 }}>
              <DataRow label="Subject:" value="Satyajit Mall" />
              <DataRow label="Designation:" value="Product Architect" />
            </div>
            <div
              style={{
                paddingTop: 12,
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p
                style={{
                  fontFamily: TELE, fontSize: 10.5,
                  color: 'rgba(214,205,184,0.62)',
                  lineHeight: 1.9, letterSpacing: '0.015em',
                  margin: 0,
                }}
              >
                Core Expertise: MarTech transformation, 0-1 SaaS launches, solving
                fragmented data silos via enterprise automation layers.
              </p>
            </div>
          </Node>
        </motion.div>

        {/* NODE 2 — OPERATIONAL LOG (Bottom Left) */}
        <motion.div
          className="absolute"
          style={{
            bottom: 48, left: 48,
            opacity: n2o, y: n2y,
            zIndex: 10,
          }}
        >
          <Node>
            <NodeLabel>Node 02 &middot; Operational Log</NodeLabel>
            <p
              style={{
                fontFamily: TELE, fontSize: 8.5,
                color: 'rgba(178,34,34,0.6)',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                marginBottom: 12, marginTop: 0,
              }}
            >
              Miles Education &mdash; Dec 2023 &ndash; Present
            </p>
            <Bullet>Launched Miles One mobile app — 40K learners, &#8377;20 Cr revenue.</Bullet>
            <Bullet>Architected Miles One Agentic Assistant (n8n Orchestration Layer).</Bullet>
            <Bullet>Built Miles Masterclass — 30,000+ users, 2,000+ paid subscriptions.</Bullet>
          </Node>
        </motion.div>

        {/* NODE 3 — PAST JURISDICTIONS (Top Right) */}
        <motion.div
          className="absolute"
          style={{
            top: 128, right: 48,
            opacity: n3o, x: n3x,
            zIndex: 10,
          }}
        >
          <Node>
            <NodeLabel>Node 03 &middot; Past Jurisdictions</NodeLabel>
            <p
              style={{
                fontFamily: TELE, fontSize: 8.5,
                color: 'rgba(178,34,34,0.6)',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                marginBottom: 12, marginTop: 0,
              }}
            >
              AlmaBetter &amp; UpGrad &mdash; 2021 &ndash; 2023
            </p>
            <Bullet>
              Redesigned dev workflows resolving sprint velocity misalignments,
              reducing errors by 80%.
            </Bullet>
            <Bullet>
              Architected MarTech stack &amp; Communication Framework via
              n8n/Zapier ELT layer.
            </Bullet>
          </Node>
        </motion.div>

        {/* NODE 4 — CLEARANCE & SKILLS (Bottom Right) */}
        <motion.div
          className="absolute"
          style={{
            bottom: 96, right: 48,
            opacity: n4o, y: n4y,
            zIndex: 10,
          }}
        >
          <Node>
            <NodeLabel>Node 04 &middot; Clearance &amp; Arsenal</NodeLabel>
            <DataRow label="Data &amp; BI:" value="BigQuery, Metabase, GA4" />
            <DataRow label="Languages:"   value="SQL (PostgreSQL)" />
            <DataRow label="Automation:"  value="n8n, Zapier, Make" />
            <div
              style={{
                marginTop: 10, paddingTop: 10,
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <DataRow label="Certs:" value="CSPO · Six Sigma Green Belt" />
            </div>
          </Node>
        </motion.div>

        {/* Vertical scroll rail */}
        <div
          className="absolute right-5 top-1/2 -translate-y-1/2 z-[20]"
          style={{ width: 1, height: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }}
        >
          <motion.div
            style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: useTransform(scrollYProgress, [0, 1], ['0%', '100%']),
              backgroundColor: '#B22222',
            }}
          />
        </div>

      </div>{/* end sticky */}
    </div>/* end canvas */
  );
};

export default Dossier;
