import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { profileData } from '../data/mock';

const TELE  = "'Courier New', Courier, monospace";
const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const JULIUS = "'Julius Sans One', sans-serif";

/* ── Bold editorial section title ── */
const NodeTitle = ({ children, color = '#FFFFFF' }) => (
  <p
    style={{
      fontFamily: SWISS,
      fontSize: 10,
      fontWeight: 700,
      color,
      letterSpacing: '0.38em',
      textTransform: 'uppercase',
      marginBottom: 14,
      marginTop: 0,
    }}
  >
    {children}
  </p>
);

/* ── Teletype bullet ── */
const Bullet = ({ children }) => (
  <div style={{ display: 'flex', gap: 9, marginBottom: 10, alignItems: 'flex-start' }}>
    <span style={{ fontFamily: TELE, fontSize: 9, color: 'rgba(178,34,34,0.65)', flexShrink: 0, marginTop: 2 }}>›</span>
    <span style={{ fontFamily: TELE, fontSize: 10.5, color: 'rgba(214,205,184,0.7)', lineHeight: 1.88, letterSpacing: '0.015em' }}>
      {children}
    </span>
  </div>
);

/* ── Terminal data pair ── */
const DataRow = ({ label, value }) => (
  <div style={{ marginBottom: 9 }}>
    <span style={{ fontFamily: SWISS, fontSize: 8, fontWeight: 700, color: 'rgba(178,34,34,0.7)', letterSpacing: '0.28em', textTransform: 'uppercase' }}>
      {label}{' '}
    </span>
    <span style={{ fontFamily: TELE, fontSize: 10, color: 'rgba(214,205,184,0.6)', letterSpacing: '0.04em' }}>
      {value}
    </span>
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

  /* Grand title drifts left */
  const titleX = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

  /* Portrait parallax */
  const portraitY = useTransform(scrollYProgress, [0, 1], ['0%', '9%']);

  /* Node 1 — top-left: slides down from above */
  const n1y = useTransform(scrollYProgress, [0, 0.30], [-100, 0]);
  const n1o = useTransform(scrollYProgress, [0, 0.20], [0, 1]);

  /* Node 2 — mid-left: slides up from below */
  const n2y = useTransform(scrollYProgress, [0.10, 0.50], [200, 0]);
  const n2o = useTransform(scrollYProgress, [0.10, 0.30], [0, 1]);

  /* Node 3 — top-right: slides in from right */
  const n3x = useTransform(scrollYProgress, [0.30, 0.70], [200, 0]);
  const n3o = useTransform(scrollYProgress, [0.30, 0.50], [0, 1]);

  /* Node 4 — lower-right: diagonal from below */
  const n4y = useTransform(scrollYProgress, [0.50, 0.90], [150, 0]);
  const n4o = useTransform(scrollYProgress, [0.50, 0.70], [0, 1]);

  return (
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

        {/* ── Grand background title — drifts left ── */}
        <div
          className="absolute inset-x-0 overflow-hidden pointer-events-none"
          style={{ top: '20%', zIndex: 1 }}
        >
          <motion.div style={{ x: titleX, display: 'flex', justifyContent: 'center' }}>
            <span
              style={{
                fontFamily: SWISS,
                fontSize: 'clamp(68px, 9.5vw, 136px)',
                fontWeight: 900,
                color: '#141B24',
                letterSpacing: '-0.03em',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                lineHeight: 1,
              }}
            >
              PRODUCT ARCHITECT
            </span>
          </motion.div>
        </div>

        {/* ── Portrait wrapper — gradient mask melts edges into bg ── */}
        <motion.div
          className="absolute bottom-0 pointer-events-none select-none"
          style={{
            right: 'clamp(-40px, 4vw, 80px)',
            height: '95vh',
            width: 'auto',
            zIndex: 2,
            y: portraitY,
          }}
        >
          <img
            src={profileData.heroImage}
            alt="Satyajit Mall"
            draggable={false}
            style={{
              height: '100%',
              width: 'auto',
              objectFit: 'contain',
              objectPosition: 'bottom',
              filter: 'grayscale(100%) contrast(128%) brightness(0.6)',
              opacity: 0.72,
              mixBlendMode: 'luminosity',
              display: 'block',
            }}
          />

          {/* Melt: left edge */}
          <div
            className="absolute inset-y-0 left-0 pointer-events-none"
            style={{
              width: '45%',
              background: 'linear-gradient(to right, #0F1419 0%, rgba(15,20,25,0.7) 50%, transparent 100%)',
            }}
          />
          {/* Melt: right edge */}
          <div
            className="absolute inset-y-0 right-0 pointer-events-none"
            style={{
              width: '30%',
              background: 'linear-gradient(to left, #0F1419 0%, transparent 100%)',
            }}
          />
          {/* Melt: top edge */}
          <div
            className="absolute inset-x-0 top-0 pointer-events-none"
            style={{
              height: '35%',
              background: 'linear-gradient(to bottom, #0F1419 0%, rgba(15,20,25,0.5) 55%, transparent 100%)',
            }}
          />
          {/* Melt: bottom edge */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: '18%',
              background: 'linear-gradient(to top, #0F1419 0%, transparent 100%)',
            }}
          />
        </motion.div>

        {/* Ambient compositional vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #0F1419 12%, transparent 42%, transparent 72%, rgba(15,20,25,0.5) 100%)',
            zIndex: 3,
          }}
        />
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: '22%',
            background: 'linear-gradient(to bottom, #0F1419, transparent)',
            zIndex: 3,
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: '14%',
            background: 'linear-gradient(to top, #0F1419, transparent)',
            zIndex: 3,
          }}
        />

        {/* ── Page header ── */}
        <div className="absolute top-7 left-[10%] z-[20]">
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

        {/* ════════════════════════════════════════════════
            NODE 1 — VITALS
            No background, no border. Raw floating text.
            Position: top-[15%] left-[10%]
        ════════════════════════════════════════════════ */}
        <motion.div
          className="absolute"
          style={{
            top: '15%',
            left: '10%',
            maxWidth: 320,
            opacity: n1o, y: n1y,
            zIndex: 10,
          }}
        >
          <NodeTitle color="#B22222">Vitals</NodeTitle>

          {/* Subject + Designation — large Swiss serif */}
          <p
            style={{
              fontFamily: SWISS,
              fontSize: 22,
              fontWeight: 800,
              color: 'rgba(244,236,216,0.90)',
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
              margin: '0 0 4px',
            }}
          >
            Satyajit Mall
          </p>
          <p
            style={{
              fontFamily: SWISS,
              fontSize: 11,
              fontWeight: 600,
              color: 'rgba(214,205,184,0.35)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              margin: '0 0 14px',
            }}
          >
            Product Architect
          </p>

          {/* Rule */}
          <div style={{ width: 28, height: 1, backgroundColor: 'rgba(178,34,34,0.5)', marginBottom: 14 }} />

          <p
            style={{
              fontFamily: TELE, fontSize: 10.5,
              color: 'rgba(214,205,184,0.55)',
              lineHeight: 1.9, letterSpacing: '0.015em',
              margin: 0,
            }}
          >
            MarTech transformation, 0-1 SaaS launches,
            solving fragmented data silos via enterprise
            automation layers.
          </p>
        </motion.div>

        {/* ════════════════════════════════════════════════
            NODE 2 — OPERATIONAL LOG
            Solid dark bg, no border, generous padding.
            Position: top-[55%] left-[8%]
        ════════════════════════════════════════════════ */}
        <motion.div
          className="absolute"
          style={{
            top: '55%',
            left: '8%',
            maxWidth: 340,
            opacity: n2o, y: n2y,
            zIndex: 10,
          }}
        >
          <div
            style={{
              backgroundColor: '#131920',
              padding: '20px 24px',
            }}
          >
            <NodeTitle color="#FFFFFF">Operational Log</NodeTitle>
            <p
              style={{
                fontFamily: SWISS,
                fontSize: 8,
                fontWeight: 700,
                color: 'rgba(178,34,34,0.65)',
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                marginBottom: 14,
                marginTop: 0,
              }}
            >
              Miles Education &mdash; Dec 2023 – Present
            </p>
            <Bullet>Launched Miles One — 40K learners, &#8377;20 Cr revenue.</Bullet>
            <Bullet>Architected Agentic Assistant via n8n Orchestration Layer.</Bullet>
            <Bullet>Built Miles Masterclass — 30,000+ users, 2,000+ paid subs.</Bullet>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════
            NODE 3 — PAST JURISDICTIONS
            No background. Thick left red border.
            Position: top-[25%] right-[15%]
        ════════════════════════════════════════════════ */}
        <motion.div
          className="absolute"
          style={{
            top: '25%',
            right: '15%',
            maxWidth: 300,
            opacity: n3o, x: n3x,
            zIndex: 10,
          }}
        >
          <div
            style={{
              borderLeft: '3px solid #B22222',
              paddingLeft: 20,
            }}
          >
            <NodeTitle color="#FFFFFF">Past Jurisdictions</NodeTitle>
            <p
              style={{
                fontFamily: SWISS,
                fontSize: 8,
                fontWeight: 700,
                color: 'rgba(178,34,34,0.65)',
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                marginBottom: 14,
                marginTop: 0,
              }}
            >
              AlmaBetter &amp; UpGrad &mdash; 2021–2023
            </p>
            <Bullet>
              Redesigned dev workflows, resolving sprint velocity
              misalignments — errors down 80%.
            </Bullet>
            <Bullet>
              Architected MarTech stack &amp; Communication Framework
              via n8n/Zapier ELT layer.
            </Bullet>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════
            NODE 4 — CLEARANCE & SKILLS
            Subtle bordered box, distinct from others.
            Position: top-[65%] right-[10%]
        ════════════════════════════════════════════════ */}
        <motion.div
          className="absolute"
          style={{
            top: '65%',
            right: '10%',
            maxWidth: 280,
            opacity: n4o, y: n4y,
            zIndex: 10,
          }}
        >
          <div
            style={{
              border: '1px solid #222',
              backgroundColor: 'rgba(15,20,25,0.5)',
              padding: '18px 22px',
            }}
          >
            <NodeTitle color="#B22222">Clearance &amp; Arsenal</NodeTitle>
            <DataRow label="Data &amp; BI" value="BigQuery, Metabase, GA4" />
            <DataRow label="Languages"   value="SQL (PostgreSQL)" />
            <DataRow label="Automation"  value="n8n, Zapier, Make" />
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <DataRow label="Certs" value="CSPO · Six Sigma Green Belt" />
            </div>
          </div>
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

      </div>
    </div>
  );
};

export default Dossier;
