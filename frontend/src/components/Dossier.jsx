import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { profileData } from '../data/mock';

const TELE  = "'Courier New', Courier, monospace";
const JULIUS = "'Julius Sans One', sans-serif";
const SERIF  = "'Special Elite', cursive";

/* ── Classification corner marks ── */
const CornerMarks = () => (
  <>
    <span className="absolute top-2 left-2 w-4 h-4 border-t border-l pointer-events-none" style={{ borderColor: 'rgba(178,34,34,0.55)' }} />
    <span className="absolute top-2 right-2 w-4 h-4 border-t border-r pointer-events-none" style={{ borderColor: 'rgba(178,34,34,0.55)' }} />
    <span className="absolute bottom-2 left-2 w-4 h-4 border-b border-l pointer-events-none" style={{ borderColor: 'rgba(178,34,34,0.55)' }} />
    <span className="absolute bottom-2 right-2 w-4 h-4 border-b border-r pointer-events-none" style={{ borderColor: 'rgba(178,34,34,0.55)' }} />
  </>
);

/* ── Red file-stamp label ── */
const Stamp = ({ children }) => (
  <span
    style={{
      fontFamily: TELE, fontSize: 7.5,
      color: 'rgba(178,34,34,0.7)',
      letterSpacing: '0.48em',
      textTransform: 'uppercase',
      display: 'block',
      marginBottom: 10,
    }}
  >
    {children}
  </span>
);

/* ── Section heading ── */
const SectionHead = ({ children }) => (
  <h2
    style={{
      fontFamily: JULIUS, fontSize: 18,
      color: 'rgba(244,236,216,0.92)',
      letterSpacing: '0.04em',
      lineHeight: 1.25,
      marginBottom: 18,
      marginTop: 0,
    }}
  >
    {children}
  </h2>
);

/* ── Divider rule ── */
const Rule = () => (
  <div style={{ width: 32, height: 1, backgroundColor: '#B22222', marginBottom: 18 }} />
);

/* ── Body copy ── */
const Body = ({ children, muted }) => (
  <p
    style={{
      fontFamily: TELE, fontSize: 11,
      color: muted ? 'rgba(214,205,184,0.5)' : 'rgba(214,205,184,0.75)',
      lineHeight: 1.95, letterSpacing: '0.018em',
      margin: 0,
    }}
  >
    {children}
  </p>
);

/* ── Bullet item ── */
const Bullet = ({ children }) => (
  <div style={{ display: 'flex', gap: 10, marginBottom: 13, alignItems: 'flex-start' }}>
    <span
      style={{
        fontFamily: TELE, fontSize: 10,
        color: 'rgba(178,34,34,0.65)',
        flexShrink: 0, marginTop: 3,
        letterSpacing: 0,
      }}
    >
      ›
    </span>
    <p
      style={{
        fontFamily: TELE, fontSize: 11,
        color: 'rgba(214,205,184,0.72)',
        lineHeight: 1.9, letterSpacing: '0.018em',
        margin: 0,
      }}
    >
      {children}
    </p>
  </div>
);

/* ── Terminal readout row (ARSENAL) ── */
const TermRow = ({ label, value }) => (
  <div style={{ display: 'flex', gap: 12, marginBottom: 11, alignItems: 'flex-start' }}>
    <span
      style={{
        fontFamily: TELE, fontSize: 9,
        color: 'rgba(178,34,34,0.65)',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        minWidth: 200, flexShrink: 0,
        lineHeight: 1.7,
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontFamily: TELE, fontSize: 10,
        color: 'rgba(214,205,184,0.58)',
        letterSpacing: '0.06em',
        lineHeight: 1.75,
      }}
    >
      {value}
    </span>
  </div>
);

/* ── Fold progress indicator dot ── */
const FoldDot = ({ scrollYProgress, start, end, label }) => {
  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.04, end - 0.04, end],
    [0.22, 1, 1, 0.22],
  );
  const barWidth = useTransform(
    scrollYProgress,
    [start, start + 0.04, end - 0.04, end],
    ['6px', '28px', '28px', '6px'],
  );
  return (
    <motion.div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity }}
    >
      <motion.div
        style={{
          height: 1,
          width: barWidth,
          backgroundColor: '#B22222',
          transition: 'width 0.3s ease',
        }}
      />
      <span
        style={{
          fontFamily: TELE, fontSize: 6.5,
          color: 'rgba(214,205,184,0.45)',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
    </motion.div>
  );
};

/* ── Panel shell ── */
const Panel = ({ children }) => (
  <div
    className="relative"
    style={{
      backgroundColor: 'rgba(15,20,25,0.96)',
      border: '1px solid #3A3A3A',
      padding: '28px 32px',
      boxShadow: '8px 8px 0px #000',
      maxWidth: 620,
    }}
  >
    <CornerMarks />
    {children}
  </div>
);

/* ══════════════════════════════════════════
   Main Page
══════════════════════════════════════════ */
const Dossier = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /* Portrait parallax + fade */
  const portraitY       = useTransform(scrollYProgress, [0, 1],     ['0%', '14%']);
  const portraitOpacity = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0.2, 0.38, 0.38, 0.18]);

  /* Vertical scroll rail fill */
  const railHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  /* ── Per-fold opacity + y — overlapping at boundaries for paper-shuffle feel ── */
  // FOLD 1 — VITALS  (0.00 → 0.25)
  const f1o = useTransform(scrollYProgress, [0.00, 0.05, 0.21, 0.27], [0, 1, 1, 0]);
  const f1y = useTransform(scrollYProgress, [0.00, 0.05, 0.21, 0.27], [55, 0, 0, -55]);

  // FOLD 2 — MILES   (0.25 → 0.50)
  const f2o = useTransform(scrollYProgress, [0.21, 0.27, 0.46, 0.52], [0, 1, 1, 0]);
  const f2y = useTransform(scrollYProgress, [0.21, 0.27, 0.46, 0.52], [55, 0, 0, -55]);

  // FOLD 3 — PRIOR   (0.50 → 0.75)
  const f3o = useTransform(scrollYProgress, [0.46, 0.52, 0.71, 0.77], [0, 1, 1, 0]);
  const f3y = useTransform(scrollYProgress, [0.46, 0.52, 0.71, 0.77], [55, 0, 0, -55]);

  // FOLD 4 — ARSENAL (0.75 → 1.00)
  const f4o = useTransform(scrollYProgress, [0.71, 0.77, 0.95, 1.00], [0, 1, 1, 0]);
  const f4y = useTransform(scrollYProgress, [0.71, 0.77, 0.95, 1.00], [55, 0, 0, -55]);

  return (
    /* 400vh scroll canvas */
    <div ref={containerRef} className="relative bg-[#0F1419]" style={{ height: '400vh' }}>

      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Film grain */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'repeat',
            backgroundSize: '180px 180px',
            opacity: 0.045,
          }}
        />

        {/* Background portrait — darkroom print */}
        <motion.img
          src={profileData.heroImage}
          alt="Satyajit Mall"
          className="absolute right-0 bottom-0 h-[90vh] w-auto object-contain object-bottom pointer-events-none select-none"
          draggable={false}
          style={{
            filter: 'grayscale(100%) contrast(125%) brightness(0.52)',
            opacity: portraitOpacity,
            mixBlendMode: 'luminosity',
            y: portraitY,
            zIndex: 2,
          }}
        />

        {/* L→R content gradient — keeps portrait from bleeding into text */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #0F1419 38%, rgba(15,20,25,0.88) 55%, rgba(15,20,25,0.3) 72%, transparent 90%)',
            zIndex: 3,
          }}
        />

        {/* Top + bottom fade */}
        <div className="absolute inset-x-0 top-0 h-20 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #0F1419, transparent)', zIndex: 4 }} />
        <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none" style={{ background: 'linear-gradient(to top, #0F1419, transparent)', zIndex: 4 }} />

        {/* ── Page header ── */}
        <div
          className="absolute top-0 left-0 right-0 z-[10] flex items-start justify-between"
          style={{ padding: '28px 32px 0' }}
        >
          <div>
            <span
              style={{
                fontFamily: TELE, fontSize: 8,
                color: 'rgba(178,34,34,0.55)',
                letterSpacing: '0.5em', textTransform: 'uppercase',
                display: 'block', marginBottom: 6,
              }}
            >
              Classified &middot; Case File #002
            </span>
            <h1
              style={{
                fontFamily: JULIUS, fontSize: 24,
                color: 'rgba(244,236,216,0.88)',
                letterSpacing: '0.05em', margin: 0,
              }}
            >
              The Dossier
            </h1>
            <div style={{ width: 40, height: 1, backgroundColor: '#B22222', marginTop: 9 }} />
          </div>

          {/* Fold progress strip */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginTop: 4 }}>
            <FoldDot scrollYProgress={scrollYProgress} start={0.00} end={0.27} label="Vitals"     />
            <FoldDot scrollYProgress={scrollYProgress} start={0.21} end={0.52} label="Miles"      />
            <FoldDot scrollYProgress={scrollYProgress} start={0.46} end={0.77} label="Prior"      />
            <FoldDot scrollYProgress={scrollYProgress} start={0.71} end={1.00} label="Arsenal"    />
          </div>
        </div>

        {/* Vertical scroll rail */}
        <div
          className="absolute right-6 top-1/2 -translate-y-1/2 z-[10]"
          style={{ width: 1, height: '55%', backgroundColor: 'rgba(255,255,255,0.04)' }}
        >
          <motion.div
            style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: railHeight,
              backgroundColor: '#B22222',
            }}
          />
        </div>

        {/* ── Panels zone — flex-centered in the sticky viewport ── */}
        <div
          className="absolute inset-0 z-[8] flex items-center"
          style={{ padding: '80px 32px 60px' }}
        >
          <div className="relative w-full" style={{ maxWidth: 640 }}>

            {/* ══ FOLD 1 — THE VITALS ══ */}
            <div
              className="absolute inset-x-0"
              style={{ top: 0, bottom: 0, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}
            >
              <motion.div style={{ opacity: f1o, y: f1y, width: '100%', pointerEvents: 'auto' }}>
                <Panel>
                  <Stamp>Subject Summary · Fold I of IV</Stamp>
                  <SectionHead>THE VITALS</SectionHead>
                  <Rule />
                  <Body>
                    A Growth Focused Product Manager with 4.5+ years of experience specializing in driving
                    product-led growth through strategic system architecture and AI-powered automation.
                    My core expertise is MarTech transformation and solving the problem of fragmented data
                    and operational silos by designing and implementing unified data strategies and
                    enterprise automation layers&hellip;
                  </Body>
                  <div
                    style={{
                      marginTop: 20, paddingTop: 14,
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex', gap: 24,
                    }}
                  >
                    <div>
                      <span style={{ fontFamily: TELE, fontSize: 7, color: 'rgba(178,34,34,0.5)', letterSpacing: '0.35em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Experience</span>
                      <span style={{ fontFamily: JULIUS, fontSize: 16, color: 'rgba(244,236,216,0.8)' }}>4.5+ Yrs</span>
                    </div>
                    <div style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />
                    <div>
                      <span style={{ fontFamily: TELE, fontSize: 7, color: 'rgba(178,34,34,0.5)', letterSpacing: '0.35em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Specialisation</span>
                      <span style={{ fontFamily: TELE, fontSize: 10, color: 'rgba(214,205,184,0.65)', letterSpacing: '0.06em' }}>MarTech · AI Automation · Data Architecture</span>
                    </div>
                  </div>
                </Panel>
              </motion.div>
            </div>

            {/* ══ FOLD 2 — OPERATION: MILES EDUCATION ══ */}
            <div
              className="absolute inset-x-0"
              style={{ top: 0, bottom: 0, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}
            >
              <motion.div style={{ opacity: f2o, y: f2y, width: '100%', pointerEvents: 'auto' }}>
                <Panel>
                  <Stamp>Primary Operation · Fold II of IV</Stamp>
                  <SectionHead>MILES EDUCATION &mdash; PRODUCT MANAGER</SectionHead>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <span style={{ fontFamily: TELE, fontSize: 8.5, color: 'rgba(214,205,184,0.3)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                      Dec 2023 &mdash; Present
                    </span>
                    <span style={{ fontFamily: TELE, fontSize: 7, color: '#3D7A58', letterSpacing: '0.2em', textTransform: 'uppercase', border: '1px solid rgba(61,122,88,0.35)', padding: '1px 7px' }}>
                      ACTIVE
                    </span>
                  </div>
                  <Rule />
                  <Bullet>
                    Spearheaded the 0-1 launch of the Miles Cine mobile app&hellip; achieved the onboarding
                    of 40K learners and generated &#8377;20 Cr in revenue while reducing early churn by 10%
                    via a segment-based onboarding flow.
                  </Bullet>
                  <Bullet>
                    Architected and productized the Miles One Agentic Assistant, establishing a Goal
                    Oriented Agent Framework managed via an n8n Orchestration Layer.
                  </Bullet>
                  <Bullet>
                    Strategically identified and captured an untapped market by leading the 0-1 development
                    of the Miles Masterclass&hellip; successfully onboarded 30,000+ users and secured
                    2,000+ paid subscriptions.
                  </Bullet>
                </Panel>
              </motion.div>
            </div>

            {/* ══ FOLD 3 — PAST JURISDICTIONS ══ */}
            <div
              className="absolute inset-x-0"
              style={{ top: 0, bottom: 0, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}
            >
              <motion.div style={{ opacity: f3o, y: f3y, width: '100%', pointerEvents: 'auto' }}>
                <Panel>
                  <Stamp>Prior Jurisdictions · Fold III of IV</Stamp>
                  <SectionHead>ALMABETTER &amp; UPGRAD</SectionHead>
                  <div style={{ marginBottom: 18 }}>
                    <span style={{ fontFamily: TELE, fontSize: 8.5, color: 'rgba(214,205,184,0.3)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                      2021 &mdash; 2023 &middot; Closed
                    </span>
                  </div>
                  <Rule />

                  {/* AlmaBetter sub-section */}
                  <div style={{ marginBottom: 18 }}>
                    <span
                      style={{
                        fontFamily: TELE, fontSize: 8, color: 'rgba(178,34,34,0.55)',
                        letterSpacing: '0.3em', textTransform: 'uppercase',
                        display: 'block', marginBottom: 10,
                      }}
                    >
                      AlmaBetter &mdash; Associate Program Manager
                    </span>
                    <Bullet>
                      Redesigned dev workflows using JIRA and Basecamp to resolve sprint velocity
                      misalignments, reducing errors by 80%&hellip;
                    </Bullet>
                    <Bullet>
                      Architected the Communication Framework and MarTech stack by standardizing the event
                      tracking and data taxonomy across all platforms (Web, CRM, LMS).
                    </Bullet>
                  </div>

                  {/* UpGrad sub-section */}
                  <div style={{ paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span
                      style={{
                        fontFamily: TELE, fontSize: 8, color: 'rgba(178,34,34,0.55)',
                        letterSpacing: '0.3em', textTransform: 'uppercase',
                        display: 'block', marginBottom: 10,
                      }}
                    >
                      UpGrad &mdash; Sr. Associate
                    </span>
                    <Bullet>
                      Addressed learner engagement challenges via behavioral data analysis, introducing new
                      learning strategies that improved course completion rates by 20%&hellip;
                    </Bullet>
                  </div>
                </Panel>
              </motion.div>
            </div>

            {/* ══ FOLD 4 — THE ARSENAL ══ */}
            <div
              className="absolute inset-x-0"
              style={{ top: 0, bottom: 0, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}
            >
              <motion.div style={{ opacity: f4o, y: f4y, width: '100%', pointerEvents: 'auto' }}>
                <Panel>
                  <Stamp>Operational Arsenal · Fold IV of IV</Stamp>
                  <SectionHead>CLEARANCE LEVEL &amp; SKILLS</SectionHead>
                  <Rule />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0 }}>
                    <TermRow
                      label="DATA &amp; BI //"
                      value="BigQuery, Metabase, Google Looker Studio, GA4 &amp; Firebase"
                    />
                    <TermRow
                      label="CORE LANGUAGES //"
                      value="SQL (PostgreSQL)"
                    />
                    <TermRow
                      label="WORKFLOW &amp; AUTOMATION //"
                      value="n8n, Zapier, Make"
                    />
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <TermRow
                        label="CERTIFICATIONS //"
                        value="Certified Scrum Product Owner (CSPO), Six Sigma Green Belt"
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 14, paddingTop: 12,
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontFamily: TELE, fontSize: 7, color: 'rgba(214,205,184,0.1)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                      End of file
                    </span>
                    <span
                      style={{
                        fontFamily: TELE, fontSize: 7,
                        color: '#3D7A58',
                        letterSpacing: '0.22em', textTransform: 'uppercase',
                        border: '1px solid rgba(61,122,88,0.35)',
                        padding: '2px 8px',
                      }}
                    >
                      VERIFIED &amp; SEALED
                    </span>
                  </div>
                </Panel>
              </motion.div>
            </div>

          </div>{/* end panels zone */}
        </div>

        {/* Scroll hint — fades out as soon as user begins scrolling */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[10] flex flex-col items-center gap-2"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.06], [1, 0]) }}
        >
          <span
            style={{
              fontFamily: TELE, fontSize: 6.5,
              color: 'rgba(214,205,184,0.18)',
              letterSpacing: '0.42em', textTransform: 'uppercase',
            }}
          >
            Scroll to Decrypt
          </span>
          <div style={{ width: 1, height: 22, background: 'linear-gradient(to bottom, rgba(178,34,34,0.45), transparent)' }} />
        </motion.div>

      </div>{/* end sticky */}
    </div>/* end scroll canvas */
  );
};

export default Dossier;
