import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { profileData } from '../data/mock';
import {
  RadialBarChart, RadialBar,
  ResponsiveContainer,
} from 'recharts';

/* ── Design Tokens ── */
const TELE  = "'Courier New', Courier, monospace";
const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const EXPO  = [0.16, 1, 0.3, 1];
const VP    = { once: true, margin: '-60px' };

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EXPO } },
};

const slideLeft = {
  hidden:  { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } },
};
const slideRight = {
  hidden:  { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } },
};

const S15 = { hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } };
const S12 = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
const S10 = { hidden: {}, visible: { transition: { staggerChildren: 0.10, delayChildren: 0.1 } } };
const S08 = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } } };

/* ── Injected keyframes ── */
const DossierStyles = () => (
  <style>{`
    @keyframes radarSweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes tickerScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    @keyframes dataFall { from { transform: translateY(-100%); } to { transform: translateY(100%); } }
    @keyframes pulse6 { 0%,100% { opacity:1; } 50% { opacity:.35; } }
    @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
    @keyframes logoScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  `}</style>
);

/* ════════════════════════════════════
   FIXED CENTERED PORTRAIT — always visible, content scrolls around it
   Uses CSS mask to seamlessly fade edges into bg
════════════════════════════════════ */
const FixedPortrait = () => (
  <div className="fixed inset-0 z-[1] flex items-center justify-center pointer-events-none overflow-hidden">
    <img
      src={profileData.heroImage}
      alt=""
      draggable={false}
      loading="eager"
      style={{
        width: 'clamp(500px, 60vw, 900px)',
        height: 'auto',
        marginTop: '12vh',
        opacity: 0.55,
        filter: 'grayscale(100%) contrast(120%) brightness(0.5)',
        maskImage: 'radial-gradient(ellipse 55% 60% at 50% 42%, black 30%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse 55% 60% at 50% 42%, black 30%, transparent 75%)',
        userSelect: 'none',
        objectPosition: 'center top',
      }}
    />
  </div>
);

/* ════════════════════════════════════
   DECLASSIFY — black block slides away to reveal content
════════════════════════════════════ */
const Declassify = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <div ref={ref} style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
      {children}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={inView ? { scaleX: 0 } : { scaleX: 1 }}
        transition={{ duration: 0.8, ease: EXPO, delay }}
        style={{
          position: 'absolute', inset: 0,
          backgroundColor: '#0F1419',
          transformOrigin: 'right', zIndex: 2,
        }}
      />
    </div>
  );
};

/* ════════════════════════════════════
   SHARED MICRO-COMPONENTS
════════════════════════════════════ */

const BlinkCursor = () => (
  <span style={{ animation: 'blink 1.06s step-end infinite', fontFamily: TELE, color: 'rgba(61,155,100,0.75)' }}>█</span>
);

const Redacted = ({ children }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <span tabIndex={0} role="button" aria-label="Reveal redacted text"
      onMouseEnter={() => setRevealed(true)} onMouseLeave={() => setRevealed(false)}
      onFocus={() => setRevealed(true)} onBlur={() => setRevealed(false)}
      onClick={() => setRevealed(v => !v)}
      style={{
        backgroundColor: revealed ? 'transparent' : '#111',
        color: revealed ? '#F4ECD8' : '#111',
        padding: '1px 5px', cursor: 'pointer', transition: 'all 0.3s ease',
        borderBottom: revealed ? 'none' : '1px dashed rgba(178,34,34,0.3)',
      }}
    >{children}</span>
  );
};

const FoldNum = ({ n, label }) => (
  <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
    <span style={{ fontFamily: SWISS, fontWeight: 900, fontSize: 13, color: '#B22222' }}>{n}</span>
    <div style={{ width: 28, height: 1, backgroundColor: '#B22222' }} />
    <span style={{ fontFamily: TELE, fontSize: 10, letterSpacing: '0.35em', color: 'rgba(178,34,34,0.55)', textTransform: 'uppercase' }}>{label}</span>
  </motion.div>
);

/* ── Layout helpers ──
   Flank = content column on left or right of the fixed center portrait
   On mobile: full width. On desktop: ~42% width on the designated side.
*/
const LeftFlank = ({ children, className = '' }) => (
  <div className={`w-full md:w-[42%] md:pr-4 ${className}`}>{children}</div>
);
const RightFlank = ({ children, className = '' }) => (
  <div className={`w-full md:w-[42%] md:ml-auto md:pl-4 ${className}`}>{children}</div>
);

/* ════════════════════════════════════════════════════
   FOLD 1 — THE EVIDENCE WALL
   5 artifacts scattered around the portrait using absolute positioning.
   Left elements converge from x:-50, right from x:+50.
════════════════════════════════════════════════════ */
const Fold1 = () => (
  <section className="relative min-h-screen w-full overflow-hidden z-[2]">
    {/* Edge gradients — text readable, center breathes */}
    <div className="absolute inset-y-0 left-0 w-1/3 z-0 pointer-events-none"
      style={{ background: 'linear-gradient(to right, #050505, transparent)' }} />
    <div className="absolute inset-y-0 right-0 w-1/3 z-0 pointer-events-none"
      style={{ background: 'linear-gradient(to left, #050505, transparent)' }} />

    <motion.div
      className="relative w-full h-screen"
      variants={S15}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >

      {/* ── Artifact 1: Master Nameplate (outlined, no fill, above hero) ── */}
      <motion.div
        variants={slideLeft}
        className="absolute z-10 left-0 right-0 text-center"
        style={{ top: '4%' }}
      >
        <h1 style={{
          fontFamily: SWISS,
          fontWeight: 900,
          fontSize: 'clamp(44px, 6.5vw, 100px)',
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(243,244,246,0.7)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          margin: 0,
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}>
          SATYAJIT MALL
        </h1>
      </motion.div>

      {/* ── Artifact 2: Classification Line (centered middle of fold) ── */}
      <motion.div
        variants={slideLeft}
        className="absolute z-10 left-0 right-0 text-center"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        <span style={{
          fontFamily: TELE,
          fontSize: 14,
          fontWeight: 600,
          color: 'rgba(127,29,29,0.85)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          userSelect: 'none',
        }}>
          TECHNICAL PRODUCT MANAGER // DATA PLATFORMS // AI INTEGRATION
        </span>
      </motion.div>

      {/* ── Artifact 3: Telemetry HUD (Top Right) ── */}
      <motion.div
        variants={slideRight}
        className="absolute z-10 hidden md:block"
        style={{ top: '18%', right: '8%', maxWidth: 250 }}
      >
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.2)',
          backdropFilter: 'blur(6px)',
          padding: 16,
          textAlign: 'right',
          borderTop: '1px solid rgba(107,114,128,0.4)',
          borderRight: '1px solid rgba(107,114,128,0.4)',
          position: 'relative',
        }}>
          {/* Corner bracket accents */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderTop: '2px solid rgba(229,231,235,0.3)', borderRight: '2px solid rgba(229,231,235,0.3)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 16, height: 16, borderBottom: '2px solid rgba(229,231,235,0.3)', borderLeft: '2px solid rgba(229,231,235,0.3)' }} />

          <p style={{ fontFamily: TELE, fontSize: 12, color: '#9CA3AF', lineHeight: 2, margin: 0, textAlign: 'right' }}>
            {'>'} Location: Bengaluru, IND
          </p>
          <p style={{ fontFamily: TELE, fontSize: 12, color: '#9CA3AF', lineHeight: 2, margin: 0, textAlign: 'right' }}>
            {'>'} Domain: B2C, Internal SaaS, OTT
          </p>
          <p style={{ fontFamily: TELE, fontSize: 12, color: '#9CA3AF', lineHeight: 2, margin: 0, textAlign: 'right' }}>
            {'>'} Status: Active{' '}
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e', animation: 'pulse6 2s infinite', verticalAlign: 'middle' }} />
          </p>
        </div>
      </motion.div>

      {/* ── Artifact 4: Verified Dossier Slip (Bottom Left) ── */}
      <motion.div
        variants={slideLeft}
        className="absolute z-10"
        style={{ bottom: '10%', left: '8%', width: 'clamp(300px, 30vw, 420px)' }}
      >
        <div style={{
          backgroundColor: 'rgba(5,5,5,0.9)',
          borderBottom: '2px solid #991B1B',
          padding: '24px 22px',
          position: 'relative',
          backdropFilter: 'blur(6px)',
        }}>
          {/* Corner brackets ┌ ┐ └ ┘ */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: 14, height: 14, borderTop: '2px solid rgba(229,231,235,0.2)', borderLeft: '2px solid rgba(229,231,235,0.2)' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: 14, height: 14, borderTop: '2px solid rgba(229,231,235,0.2)', borderRight: '2px solid rgba(229,231,235,0.2)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 14, height: 14, borderBottom: '2px solid rgba(229,231,235,0.2)', borderLeft: '2px solid rgba(229,231,235,0.2)' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderBottom: '2px solid rgba(229,231,235,0.2)', borderRight: '2px solid rgba(229,231,235,0.2)' }} />

          <p style={{
            fontFamily: TELE, fontSize: 13, color: '#D1D5DB',
            lineHeight: 1.75, margin: 0,
          }}>
            Product Manager with 5+ years of experience driving product-led growth through
            strategic system architecture and enterprise automation. Specializing in resolving
            fragmented data, architecting 0-to-1 launches, and deploying intelligent self-service
            solutions that scale.
          </p>
        </div>
      </motion.div>

      {/* ── Artifact 5: Dual Intel Badges (Bottom Right) ── */}
      <motion.div
        variants={slideRight}
        className="absolute z-10 hidden md:flex"
        style={{ bottom: '10%', right: '8%', gap: 32 }}
      >
        {[
          { metric: '5+', label: 'YEARS EXPERIENCE', delay: 0 },
          { metric: '>₹20 Cr', label: 'REVENUE IMPACT', delay: 0.15 },
        ].map(badge => (
          <div key={badge.label} style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
            borderLeft: '3px solid #B22222',
            paddingLeft: 14,
          }}>
            <Declassify delay={badge.delay}>
              <span style={{
                fontFamily: SWISS, fontWeight: 800,
                fontSize: 'clamp(44px, 5.5vw, 68px)',
                color: '#F3F4F6',
                lineHeight: 0.8,
                display: 'block',
              }}>{badge.metric}</span>
            </Declassify>
            <span style={{
              fontFamily: TELE, fontSize: 10, fontWeight: 600,
              color: '#6B7280', letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginTop: 6, display: 'block',
            }}>{badge.label}</span>
          </div>
        ))}
      </motion.div>

    </motion.div>
    <LogoCarousel />
  </section>
);


/* ════════════════════════════════════════════════════
   FOLD 2 — ARSENAL & INFRASTRUCTURE (Clean Spatial Canvas)
   Premium dark-mode SaaS / Technical Architect aesthetic
════════════════════════════════════════════════════ */
const f2Left    = { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.25, 1, 0.5, 1] } } };
const f2Right   = { hidden: { opacity: 0, x:  30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.25, 1, 0.5, 1] } } };
const f2Stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } } };

const Fold2 = () => (
  <section className="min-h-screen relative z-[2] w-full overflow-hidden">
    {/* Edge gradients */}
    <div className="absolute inset-y-0 left-0 w-1/3 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(15,20,25,0.9) 0%, transparent 100%)' }} />
    <div className="absolute inset-y-0 right-0 w-1/3 pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(15,20,25,0.9) 0%, transparent 100%)' }} />

    <motion.div className="relative min-h-screen w-full" variants={f2Stagger} initial="hidden" whileInView="visible" viewport={VP}>

      {/* ── Artifact 1: Technical Stack Matrix (Top Left) ── */}
      <motion.div
        variants={f2Left}
        className="absolute z-10 hidden md:block"
        style={{ top: '15%', left: '8%', maxWidth: 400 }}
      >
        <div style={{
          backgroundColor: 'rgba(10,10,10,0.8)',
          border: '1px solid rgba(55,65,81,0.9)',
          padding: '24px', borderRadius: 8,
          backdropFilter: 'blur(12px)',
        }}>
          <p style={{
            fontFamily: SWISS, fontSize: 10, fontWeight: 700,
            color: '#dc2626', letterSpacing: '0.25em',
            textTransform: 'uppercase', margin: '0 0 18px',
          }}>Technical Stack</p>

          {[
            { label: 'Data Platforms',   tools: ['BigQuery', 'PostgreSQL', 'GA4', 'Looker'] },
            { label: 'Automation & CDP', tools: ['n8n', 'Zapier', 'Netcore', 'Clevertap'] },
            { label: 'Product Delivery', tools: ['Agile Scrum', 'MVP Architecting', 'CSPO'] },
          ].map((group, gi) => (
            <div key={group.label} style={{ marginBottom: gi < 2 ? 16 : 0 }}>
              <p style={{
                fontFamily: SWISS, fontSize: 9, fontWeight: 600,
                color: 'rgba(107,114,128,0.7)', letterSpacing: '0.18em',
                textTransform: 'uppercase', margin: '0 0 7px',
              }}>{group.label}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {group.tools.map(tool => (
                  <span key={tool} style={{
                    fontFamily: SWISS, fontSize: 11, fontWeight: 500,
                    color: 'rgba(229,231,235,0.88)',
                    backgroundColor: 'rgba(31,41,55,0.75)',
                    border: '1px solid rgba(55,65,81,0.7)',
                    padding: '3px 10px', borderRadius: 4,
                  }}>{tool}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Artifact 2: Core Competencies (Top Right) ── */}
      <motion.div
        variants={f2Right}
        className="absolute z-10 hidden md:block"
        style={{ top: '15%', right: '8%', maxWidth: 420 }}
      >
        <p style={{
          fontFamily: SWISS, fontSize: 10, fontWeight: 700,
          color: '#dc2626', letterSpacing: '0.25em',
          textTransform: 'uppercase', margin: '0 0 18px',
        }}>Core Competencies</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {[
            { title: 'Unifying Fragmented Data',   body: 'Architecting deterministic data pipelines that bridge apps, CRM, and analytics.' },
            { title: 'Automating Operations',       body: 'Deploying enterprise workflows that eliminate manual operational silos and slash support costs.' },
            { title: 'Driving Product-Led Growth', body: 'Building self-serve, AI-driven product loops that directly multiply top-line revenue.' },
          ].map(item => (
            <div key={item.title} style={{ borderLeft: '2px solid #dc2626', paddingLeft: 14 }}>
              <p style={{
                fontFamily: SWISS, fontSize: 13, fontWeight: 600,
                color: 'rgba(229,231,235,0.95)', margin: '0 0 5px', lineHeight: 1.3,
              }}>{item.title}</p>
              <p style={{
                fontFamily: SWISS, fontSize: 12, fontWeight: 400,
                color: 'rgba(156,163,175,0.8)', lineHeight: 1.65, margin: 0,
              }}>{item.body}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Artifact 3: Impact Metric −40% (Bottom Left) ── */}
      <motion.div
        variants={f2Left}
        className="absolute z-10 hidden md:block"
        style={{ bottom: '12%', left: '8%', maxWidth: 380 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '4px solid #dc2626', paddingLeft: 20 }}>
          <Declassify>
            <span style={{
              fontFamily: SWISS, fontWeight: 900,
              fontSize: 'clamp(60px, 5.5vw, 88px)',
              color: '#F3F4F6', lineHeight: 0.8,
              display: 'block', letterSpacing: '-0.03em',
            }}>−40%</span>
          </Declassify>
          <p style={{
            fontFamily: SWISS, fontSize: 10, fontWeight: 600,
            color: 'rgba(156,163,175,0.7)', letterSpacing: '0.2em',
            textTransform: 'uppercase', margin: '12px 0',
          }}>Time-to-Market Reduction</p>
          <p style={{
            fontFamily: SWISS, fontSize: 13, fontWeight: 400,
            color: 'rgba(156,163,175,0.72)', lineHeight: 1.65, margin: 0,
          }}>
            Governed CDP implementation and event taxonomy across the full product ecosystem,
            eliminating engineering bottlenecks for real-time personalization.
          </p>
        </div>
      </motion.div>

      {/* ── Artifact 4: Impact Metric +20% (Bottom Right) ── */}
      <motion.div
        variants={f2Right}
        className="absolute z-10 hidden md:block"
        style={{ bottom: '12%', right: '8%', maxWidth: 380 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '4px solid #dc2626', paddingLeft: 20 }}>
          <Declassify delay={0.15}>
            <span style={{
              fontFamily: SWISS, fontWeight: 900,
              fontSize: 'clamp(60px, 5.5vw, 88px)',
              color: '#F3F4F6', lineHeight: 0.8,
              display: 'block', letterSpacing: '-0.03em',
            }}>+20%</span>
          </Declassify>
          <p style={{
            fontFamily: SWISS, fontSize: 10, fontWeight: 600,
            color: 'rgba(156,163,175,0.7)', letterSpacing: '0.2em',
            textTransform: 'uppercase', margin: '12px 0',
          }}>Overall ROAS Lift</p>
          <p style={{
            fontFamily: SWISS, fontSize: 13, fontWeight: 400,
            color: 'rgba(156,163,175,0.72)', lineHeight: 1.65, margin: 0,
          }}>
            Architected a proprietary end-to-end attribution platform powered by compounded
            automation models to recover leads and scale revenue.
          </p>
        </div>
      </motion.div>

    </motion.div>
  </section>
);


/* ════════════════════════════════════════════════════
   FOLD 3 — MICROFICHE (Miles Education — Left Flank)
   Film perforations, corner brackets, light cone
════════════════════════════════════════════════════ */
const Fold3 = () => (
  <section className="min-h-screen relative z-[2] flex items-center">
    {/* Light cone */}
    <div className="absolute inset-0 pointer-events-none" style={{
      background: 'radial-gradient(ellipse 35% 45% at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 100%)',
    }} />
    {/* Film rails */}
    <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: 3, backgroundColor: 'rgba(107,114,128,0.15)' }} />
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 3, backgroundColor: 'rgba(107,114,128,0.15)' }} />

    <motion.div className="w-full px-6 md:px-10 lg:px-16 py-16" variants={S10} initial="hidden" whileInView="visible" viewport={VP}>
      <LeftFlank>
        <FoldNum n="03" label="Miles Education · Dec 2023 – Present" />

        {/* 40K metric — corner brackets */}
        <motion.div variants={fadeUp} style={{ position: 'relative', padding: '16px 20px', marginBottom: 20 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 14, height: 14, borderTop: '2px solid rgba(229,231,235,0.25)', borderLeft: '2px solid rgba(229,231,235,0.25)' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderBottom: '2px solid rgba(229,231,235,0.25)', borderRight: '2px solid rgba(229,231,235,0.25)' }} />
          <Declassify>
            <span style={{ fontFamily: SWISS, fontWeight: 900, fontSize: 'clamp(40px, 6vw, 64px)', color: '#E5E7EB', lineHeight: 1, display: 'block' }}>40,000+</span>
          </Declassify>
          <span style={{ fontFamily: TELE, fontSize: 10, color: 'rgba(229,231,235,0.35)', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: 6, display: 'block' }}>Learners Onboarded</span>
          <p style={{ fontFamily: TELE, fontSize: 12, color: 'rgba(229,231,235,0.5)', lineHeight: 1.8, margin: '8px 0 0' }}>
            <Redacted>Spearheaded the 0-1 launch of the Miles One mobile app.</Redacted>{' '}
            Architected a dual-purpose MVP for lead generation that generated ₹20 Cr in revenue.
          </p>
        </motion.div>

        {/* OTT metric — corner brackets */}
        <motion.div variants={fadeUp} style={{ position: 'relative', padding: '16px 20px', marginBottom: 20 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 14, height: 14, borderTop: '2px solid rgba(229,231,235,0.25)', borderLeft: '2px solid rgba(229,231,235,0.25)' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderBottom: '2px solid rgba(229,231,235,0.25)', borderRight: '2px solid rgba(229,231,235,0.25)' }} />
          <Declassify delay={0.1}>
            <span style={{ fontFamily: SWISS, fontWeight: 900, fontSize: 'clamp(36px, 5vw, 52px)', color: '#E5E7EB', lineHeight: 1, display: 'block' }}>30,000+</span>
          </Declassify>
          <span style={{ fontFamily: TELE, fontSize: 10, color: 'rgba(229,231,235,0.35)', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: 6, display: 'block' }}>OTT Subscribers</span>
          <p style={{ fontFamily: TELE, fontSize: 12, color: 'rgba(229,231,235,0.5)', lineHeight: 1.8, margin: '8px 0 0' }}>
            <Redacted>Led the 0-1 development of Miles Masterclass, a subscription-based OTT product.</Redacted>{' '}
            B2B GTM secured 2,000+ paid subscriptions.
          </p>
        </motion.div>

        {/* Smaller metrics row */}
        <motion.div variants={fadeUp} className="flex gap-8 mt-2">
          {[{ v: '−10%', l: 'Early Churn' }, { v: '+15%', l: 'Lead Conversion' }, { v: '+15%', l: 'Day 7 Activation' }].map((m, i) => (
            <div key={m.l}>
              <Declassify delay={i * 0.1}>
                <span style={{ fontFamily: SWISS, fontWeight: 900, fontSize: 'clamp(24px, 3vw, 36px)', color: '#E5E7EB', lineHeight: 1, display: 'block' }}>{m.v}</span>
              </Declassify>
              <span style={{ fontFamily: TELE, fontSize: 9, color: 'rgba(229,231,235,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 4, display: 'block' }}>{m.l}</span>
            </div>
          ))}
        </motion.div>
      </LeftFlank>
    </motion.div>
  </section>
);


/* ════════════════════════════════════════════════════
   FOLD 4 — RADAR (AI & Agentic — Right Flank)
   Radar sweep, radial chart, LED grid, data waterfall
════════════════════════════════════════════════════ */
const LED_PATTERN = [1,0,1,0, 1,1,0,1, 0,0,1,0];
const WATERFALL_WORDS = ['RAG_QUERY','API_INVOKE','FUNCTION_CALL','LLM_RESPONSE','MEMORY_RETRIEVE','VECTOR_SEARCH','EMBED_CHUNK','AGENT_DISPATCH','TOOL_EXEC','CONTEXT_MERGE'];

const Fold4 = () => (
  <section className="min-h-screen relative z-[2] flex items-center">
    <motion.div className="w-full px-6 md:px-10 lg:px-16 py-16" variants={S12} initial="hidden" whileInView="visible" viewport={VP}>
      <RightFlank>
        <FoldNum n="04" label="AI & Agentic Systems" />

        {/* Radar + LEDs + waterfall row */}
        <motion.div variants={fadeUp} className="flex items-start gap-5 mb-6 flex-wrap">
          {/* Radar */}
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            border: '1px solid rgba(107,114,128,0.15)',
            position: 'relative', overflow: 'hidden', flexShrink: 0,
          }}>
            {[90, 60, 30].map((s, i) => (
              <div key={s} style={{ position: 'absolute', top: '50%', left: '50%', width: s, height: s, transform: 'translate(-50%, -50%)', borderRadius: '50%', border: `1px solid rgba(107,114,128,${0.08 - i * 0.02})` }} />
            ))}
            <div style={{ position: 'absolute', inset: 0, background: 'conic-gradient(from 0deg, transparent 0deg, rgba(34,197,94,0.18) 0deg, transparent 60deg)', animation: 'radarSweep 4s linear infinite' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 4, height: 4, borderRadius: '50%', backgroundColor: '#22c55e', transform: 'translate(-50%, -50%)', boxShadow: '0 0 6px #22c55e' }} />
          </div>

          {/* LED grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5, alignSelf: 'center' }}>
            {LED_PATTERN.map((on, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: on ? '#22c55e' : '#14532d', animation: on ? 'pulse6 2s infinite' : 'none', animationDelay: `${i * 0.3}s` }} />
            ))}
          </div>

          {/* Data waterfall */}
          <div style={{ width: 68, height: 110, overflow: 'hidden', position: 'relative', border: '1px solid rgba(107,114,128,0.08)', flexShrink: 0 }}>
            <div style={{ animation: 'dataFall 8s linear infinite', position: 'absolute', top: 0, left: 4 }}>
              {WATERFALL_WORDS.map((w, i) => (
                <p key={i} style={{ fontFamily: TELE, fontSize: 7, color: 'rgba(61,155,100,0.35)', margin: 0, lineHeight: 2.2, whiteSpace: 'nowrap' }}>{w}</p>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Radial chart + main metric */}
        <motion.div variants={fadeUp} className="flex items-center gap-6 mb-8">
          <div style={{ width: 100, height: 100, flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={[{ value: 25, fill: '#B22222' }]} startAngle={90} endAngle={-270} barSize={7}>
                <RadialBar background={{ fill: 'rgba(107,114,128,0.08)' }} dataKey="value" cornerRadius={4} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <Declassify>
              <span style={{ fontFamily: SWISS, fontWeight: 900, fontSize: 'clamp(36px, 5vw, 56px)', color: '#E5E7EB', lineHeight: 1, display: 'block' }}>+25%</span>
            </Declassify>
            <span style={{ fontFamily: TELE, fontSize: 10, color: 'rgba(229,231,235,0.35)', letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: 4, display: 'block' }}>Automated Self-Service</span>
            <p style={{ fontFamily: TELE, fontSize: 12, color: 'rgba(229,231,235,0.5)', lineHeight: 1.7, margin: '6px 0 0', maxWidth: 300 }}>
              Architected the Miles One Agentic Assistant — Goal-Oriented Agent Framework on n8n.
            </p>
          </div>
        </motion.div>

        {/* Secondary metrics */}
        <motion.div variants={fadeUp} className="flex gap-8">
          {[
            { v: '−5%', l: 'Sales Cycle', d: 'Built SuperBot AI Voice Assistant, +15% qualified leads.' },
            { v: '100%', l: 'Real-Time Insights', d: 'RAG-based AI analysis with PostgreSQL data warehouse.' },
          ].map((m, i) => (
            <div key={m.l}>
              <Declassify delay={i * 0.12}>
                <span style={{ fontFamily: SWISS, fontWeight: 900, fontSize: 'clamp(28px, 3.5vw, 42px)', color: '#E5E7EB', lineHeight: 1, display: 'block' }}>{m.v}</span>
              </Declassify>
              <span style={{ fontFamily: TELE, fontSize: 9, color: 'rgba(229,231,235,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 4, display: 'block' }}>{m.l}</span>
              <p style={{ fontFamily: TELE, fontSize: 11, color: 'rgba(229,231,235,0.45)', lineHeight: 1.7, margin: '4px 0 0', maxWidth: 200 }}>{m.d}</p>
            </div>
          ))}
        </motion.div>
      </RightFlank>
    </motion.div>
  </section>
);


/* ════════════════════════════════════════════════════
   FOLD 5 — TELETYPE (Operations — Left Flank)
   Torn paper, ticker tape, dot-matrix, timestamped entries
════════════════════════════════════════════════════ */
const TICKER_TEXT = '▸ COMMUNITY +30% ▸ WEBINAR +40% ▸ LMS DEPLOY ▸ CRM SPOC ▸ OPS −30% ▸ CALENDAR SYNC ▸ ZOOM INTEGRATION ▸ ';

const Fold5 = () => (
  <section className="min-h-screen relative z-[2] flex items-center">
    {/* Dot-matrix */}
    <div className="absolute inset-0 pointer-events-none" style={{
      backgroundImage: 'radial-gradient(circle, rgba(107,114,128,0.05) 1px, transparent 1px)', backgroundSize: '4px 4px',
    }} />

    <motion.div className="w-full px-6 md:px-10 lg:px-16 py-16" variants={S08} initial="hidden" whileInView="visible" viewport={VP}>
      <LeftFlank>
        <FoldNum n="05" label="Internal Operations" />

        {/* Ticker tape */}
        <motion.div variants={fadeUp} style={{
          height: 24, overflow: 'hidden', marginBottom: 12,
          backgroundColor: 'rgba(7,10,13,0.85)',
          borderBottom: '1px solid rgba(107,114,128,0.1)', borderTop: '1px solid rgba(107,114,128,0.1)',
        }}>
          <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'tickerScroll 20s linear infinite' }}>
            <span style={{ fontFamily: TELE, fontSize: 9, color: 'rgba(178,34,34,0.45)', letterSpacing: '0.12em', lineHeight: '24px' }}>{TICKER_TEXT}{TICKER_TEXT}</span>
          </div>
        </motion.div>

        {/* Torn paper container */}
        <motion.div variants={fadeUp} style={{
          clipPath: 'polygon(0 5px, 2% 2px, 4% 6px, 6% 1px, 8% 5px, 10% 3px, 12% 7px, 14% 1px, 16% 4px, 18% 2px, 20% 6px, 22% 1px, 24% 5px, 26% 3px, 28% 6px, 30% 1px, 32% 4px, 34% 2px, 36% 6px, 38% 3px, 40% 7px, 42% 1px, 44% 5px, 46% 2px, 48% 6px, 50% 3px, 52% 7px, 54% 1px, 56% 4px, 58% 2px, 60% 6px, 62% 3px, 64% 7px, 66% 1px, 68% 5px, 70% 2px, 72% 6px, 74% 1px, 76% 4px, 78% 2px, 80% 6px, 82% 3px, 84% 7px, 86% 1px, 88% 5px, 90% 2px, 92% 6px, 94% 1px, 96% 4px, 98% 2px, 100% 5px, 100% 100%, 0 100%)',
          backgroundColor: 'rgba(7,10,13,0.85)', backdropFilter: 'blur(6px)',
          padding: '16px 16px 12px',
        }}>
          {[
            { t: '23:14', id: 'T-001', title: 'Community', text: 'Productized calendar booking microservice. +12% acquisition, +30% engagement.' },
            { t: '23:19', id: 'T-002', title: 'Webinar SaaS', text: 'Internal Webinar + Content Microservice, Zoom + CRM integration. +40% frequency.' },
            { t: '23:35', id: 'T-003', title: 'LMS Deploy', text: '0-1 LMS for 40K users. Learner data taxonomy via CDP for personalized notifs.' },
            { t: '23:48', id: 'T-004', title: 'CRM Build', text: 'Led Internal CRM. Enquiry → SPOC Allocation with Source Detection + Sales Queue.' },
            { t: '23:59', id: 'T-005', title: 'Ops Automation', text: 'Automated syncs across marketing, CRM, analytics. +25% cross-functional visibility.' },
          ].map(e => (
            <div key={e.id} style={{ padding: '6px 0', borderBottom: '1px solid rgba(107,114,128,0.06)', display: 'flex', gap: 10 }}>
              <div style={{ flexShrink: 0, width: 40 }}>
                <span style={{ fontFamily: TELE, fontSize: 9, color: 'rgba(178,34,34,0.5)', display: 'block', letterSpacing: '0.12em' }}>[{e.t}]</span>
                <span style={{ fontFamily: TELE, fontSize: 8, color: 'rgba(214,205,184,0.15)', display: 'block' }}>{e.id}</span>
              </div>
              <div>
                <p style={{ fontFamily: SWISS, fontSize: 10, fontWeight: 700, color: 'rgba(244,236,216,0.65)', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 2px' }}>{e.title}</p>
                <p style={{ fontFamily: TELE, fontSize: 11, color: 'rgba(229,231,235,0.5)', lineHeight: 1.7, margin: 0 }}>{e.text}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Big metrics */}
        <motion.div variants={fadeUp} className="flex gap-10 mt-6">
          {[{ v: '+15%', l: 'Learner Engagement' }, { v: '−30%', l: 'Ops Workload' }].map((m, i) => (
            <div key={m.l}>
              <Declassify delay={i * 0.12}>
                <span style={{ fontFamily: SWISS, fontWeight: 900, fontSize: 'clamp(36px, 5vw, 56px)', color: '#E5E7EB', lineHeight: 1, display: 'block' }}>{m.v}</span>
              </Declassify>
              <span style={{ fontFamily: TELE, fontSize: 10, color: 'rgba(229,231,235,0.35)', letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: 4, display: 'block' }}>{m.l}</span>
            </div>
          ))}
        </motion.div>
      </LeftFlank>
    </motion.div>
  </section>
);


/* ════════════════════════════════════════════════════
   FOLD 6 — SURVEILLANCE BOARD (Prior Roles — Right Flank)
   Cards at angles, pushpins, string connections
════════════════════════════════════════════════════ */
const CARDS = [
  { metric: '9.1', label: 'Peak CSAT', co: 'AlmaBetter', sub: 'Productized ticketing system via n8n ELT, −35% resolution time.', clip: true },
  { metric: '+20%', label: 'QoQ Revenue', co: 'Miles Events', sub: '+60% enrollments, +40% attendance via Events GTM.', clip: false },
  { metric: '+40%', label: 'Qualified Leads', co: 'Miles Marketing', sub: '−20% WhatsApp cost, −15% comms cost, −10% sales cycle.', clip: true },
  { metric: '-80%', label: 'Dev Errors', co: 'AlmaBetter', sub: 'JIRA + Basecamp redesign, sprint velocity normalized.', terminal: true },
  { metric: '+20%', label: 'Course Completion', co: 'UpGrad', sub: "Identified '120-min decay curve', +12% learner success.", clip: false },
];
const ROTS = [-2.5, 1.8, -1.2, 2.8, -1.8];
const PINS = ['#B22222', '#D4A574', '#B22222', '#4A6741', '#D4A574'];

const Fold6 = () => (
  <section className="min-h-screen relative z-[2] flex items-center">
    {/* Coffee stain */}
    <div className="absolute inset-0 pointer-events-none" style={{
      background: 'radial-gradient(circle 55px at 72% 28%, transparent 48%, rgba(120,80,40,0.03) 50%, rgba(120,80,40,0.012) 70%, transparent 72%)',
    }} />

    <motion.div className="w-full px-6 md:px-10 lg:px-16 py-16" variants={S10} initial="hidden" whileInView="visible" viewport={VP}>
      <RightFlank className="md:w-[50%]">
        <FoldNum n="06" label="Prior Jurisdictions" />

        <div className="flex flex-wrap gap-5">
          {CARDS.map((card, i) => (
            <motion.div key={i} variants={fadeUp} style={{ width: 'clamp(180px, 45%, 230px)', flexShrink: 0 }}>
              <div style={{
                transform: `rotate(${ROTS[i]}deg)`,
                border: '1px solid rgba(180,160,120,0.18)',
                backgroundColor: 'rgba(10,13,16,0.82)',
                backdropFilter: 'blur(4px)',
                padding: '22px 16px 16px', position: 'relative',
              }}>
                <div style={{ position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)', width: 9, height: 9, borderRadius: '50%', backgroundColor: PINS[i], boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }} />
                {card.clip && <div style={{ position: 'absolute', top: 8, right: 8, width: 18, height: 5, borderRadius: 3, backgroundColor: 'rgba(107,114,128,0.25)', transform: 'rotate(22deg)' }} />}
                <span style={{ fontFamily: TELE, fontSize: 9, color: 'rgba(180,160,120,0.45)', letterSpacing: '0.15em', display: 'block', marginBottom: 6 }}>{card.co}</span>

                {card.terminal ? (
                  <div style={{ backgroundColor: '#070A0D', padding: '8px 10px', border: '1px solid rgba(107,114,128,0.12)' }}>
                    {['> DEV_ERRORS ↓ 80%', '> JIRA + Basecamp redesign'].map((l, j) => (
                      <p key={j} style={{ fontFamily: TELE, fontSize: 10, color: 'rgba(61,155,100,0.75)', lineHeight: 1.8, margin: 0 }}>{l}</p>
                    ))}
                    <p style={{ fontFamily: TELE, fontSize: 10, color: 'rgba(34,197,94,0.85)', lineHeight: 1.8, margin: 0 }}>{'> Sprint velocity normalized'}</p>
                  </div>
                ) : (
                  <Declassify delay={i * 0.06}>
                    <span style={{ fontFamily: SWISS, fontWeight: 900, fontSize: 'clamp(24px, 3vw, 36px)', color: '#E5E7EB', lineHeight: 0.95, display: 'block' }}>{card.metric}</span>
                    <div className="flex items-center gap-2 mt-1 mb-1">
                      <span style={{ fontFamily: SWISS, fontWeight: 800, fontSize: 9, color: '#B22222' }}>//</span>
                      <span style={{ fontFamily: SWISS, fontSize: 8, fontWeight: 600, color: 'rgba(180,160,120,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{card.label}</span>
                    </div>
                    <p style={{ fontFamily: TELE, fontSize: 10, color: 'rgba(214,205,184,0.5)', lineHeight: 1.7, margin: 0 }}>{card.sub}</p>
                  </Declassify>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </RightFlank>
    </motion.div>
  </section>
);


/* ════════════════════════════════════════════════════
   FOLD 7 — SEALED LEDGER (Education — Left Flank)
   Crease lines, CLASSIFIED watermark, dotted leaders, wax seal
════════════════════════════════════════════════════ */
const Fold7 = () => (
  <section className="min-h-screen relative z-[2] flex items-center" style={{ backgroundColor: 'rgba(17,21,15,0.5)' }}>
    {/* Crease lines */}
    <div className="absolute left-0 right-0 pointer-events-none" style={{ top: '30%', height: 1, backgroundColor: 'rgba(107,114,128,0.1)', boxShadow: '0 1px 2px rgba(0,0,0,0.3)' }} />
    <div className="absolute left-0 right-0 pointer-events-none" style={{ top: '65%', height: 1, backgroundColor: 'rgba(107,114,128,0.1)', boxShadow: '0 1px 2px rgba(0,0,0,0.3)' }} />
    {/* CLASSIFIED watermark */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <span style={{ fontFamily: SWISS, fontWeight: 900, fontSize: 'clamp(70px, 11vw, 130px)', color: '#B22222', opacity: 0.04, transform: 'rotate(-25deg)', whiteSpace: 'nowrap', userSelect: 'none', letterSpacing: '0.08em' }}>
        [ CLASSIFIED ]
      </span>
    </div>

    <motion.div className="w-full px-6 md:px-10 lg:px-16 py-16" variants={S12} initial="hidden" whileInView="visible" viewport={VP}>
      <LeftFlank>
        <FoldNum n="07" label="Credentials & Clearance" />

        {/* Ledger rows */}
        {[
          { l: 'PGDM Marketing — CGPA: 8.21', r: '2019–2021', s: 'Pune Institute of Business Management · Marketing · Minors: Retail, Market Research' },
          { l: 'B.Tech Automotive — CGPA: 7.8', r: '2015–2019', s: 'Dr. Sudhir Chandra Sur Degree Engineering College, MAKAUT' },
        ].map(row => (
          <motion.div key={row.r} variants={fadeUp} className="mb-5">
            <div className="flex items-end gap-3" style={{ borderBottom: '1px dotted rgba(107,114,128,0.3)', paddingBottom: 5 }}>
              <span style={{ fontFamily: TELE, fontSize: 13, color: 'rgba(244,236,216,0.82)', whiteSpace: 'nowrap' }}>{row.l}</span>
              <span className="flex-1" />
              <span style={{ fontFamily: TELE, fontSize: 12, color: 'rgba(214,205,184,0.4)' }}>{row.r}</span>
            </div>
            <p style={{ fontFamily: TELE, fontSize: 11, color: 'rgba(214,205,184,0.25)', letterSpacing: '0.08em', margin: '4px 0 0' }}>{row.s}</p>
          </motion.div>
        ))}

        {/* Cert stamps */}
        <motion.div variants={fadeUp} className="flex flex-col gap-3 mt-4 mb-6">
          {['Certified Scrum Product Owner (CSPO)', 'Six Sigma Green Belt', 'Google Analytics · Advanced Excel · SEO'].map((c, i) => (
            <Declassify key={c} delay={i * 0.1}>
              <span style={{ display: 'inline-block', fontFamily: TELE, fontSize: 11, color: 'rgba(178,34,34,0.75)', letterSpacing: '0.15em', textTransform: 'uppercase', border: '1px solid rgba(178,34,34,0.3)', padding: '5px 12px' }}>
                [ {c} ]
              </span>
            </Declassify>
          ))}
        </motion.div>

        {/* Skills terminal */}
        <motion.div variants={fadeUp} style={{
          backgroundColor: 'rgba(7,10,13,0.85)', border: '1px solid rgba(107,114,128,0.15)',
          padding: '12px 16px', backdropFilter: 'blur(6px)',
        }}>
          {['> TOOLS: Jira | Asana | Figma | Miro | Notion',
            '> DATA: SQL | BigQuery | Looker | Mixpanel | Amplitude',
            '> AI/ML: LangChain | RAG | n8n | OpenAI | Vector DBs',
            '> PRODUCT: A/B Testing | User Research | Roadmapping',
          ].map((l, i) => (
            <p key={i} style={{ fontFamily: TELE, fontSize: 11, color: 'rgba(61,155,100,0.75)', lineHeight: 2, margin: 0 }}>{l}</p>
          ))}
          <p style={{ fontFamily: TELE, fontSize: 11, color: 'rgba(34,197,94,0.85)', lineHeight: 2, margin: 0 }}>
            {'> CLEARANCE: FULL STACK AUTHORIZED'} <BlinkCursor />
          </p>
        </motion.div>

        {/* Wax seal */}
        <motion.div variants={fadeUp} className="mt-8">
          <div style={{
            width: 85, height: 85, borderRadius: '50%',
            border: '4px solid #B22222',
            background: 'radial-gradient(circle at 40% 35%, rgba(200,50,50,0.3), rgba(140,20,20,0.8))',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: SWISS, fontSize: 7, fontWeight: 900, color: 'rgba(229,231,235,0.6)', letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.4 }}>
              END<br />OF<br />FILE
            </span>
          </div>
        </motion.div>
      </LeftFlank>
    </motion.div>
  </section>
);


/* ════════════════════════════════════
   LOGO CAROUSEL — fixed bottom, infinite scroll left→right
════════════════════════════════════ */
const COMPANY_LOGOS = [
  { src: '/logos/images (1).jpeg',                              alt: 'Miles Education' },
  { src: '/logos/09505304e71f839cbb5159308eef1f0f90d16e.jpg',   alt: 'AlmaBetter' },
  { src: '/logos/upGrad-acquires.jpg',                          alt: 'UpGrad' },
];

const LogoCarousel = () => (
  <div style={{
    position: 'absolute', bottom: 24, left: 0, right: 0, zIndex: 10,
    overflow: 'hidden', pointerEvents: 'none',
  }}>
    <div style={{
      display: 'flex', alignItems: 'center',
      width: 'max-content',
      animation: 'logoScroll 14s linear infinite',
    }}>
      {/* Two sets for seamless loop */}
      {[0, 1].map(setIdx =>
        COMPANY_LOGOS.map((logo, i) => (
          <img
            key={`${setIdx}-${i}`}
            src={logo.src}
            alt={logo.alt}
            draggable={false}
            style={{
              height: 40,
              width: 'auto',
              opacity: 0.75,
              userSelect: 'none',
              flexShrink: 0,
              marginRight: 'calc((100vw - 120px) / 3)',
            }}
          />
        ))
      )}
    </div>
  </div>
);


/* ════════════════════════════════════
   ROOT EXPORT
════════════════════════════════════ */
const Dossier = () => (
  <div className="relative bg-[#0F1419]">
    <DossierStyles />
    <FixedPortrait />
    <div className="relative z-[2]">
      <Fold1 />
      <Fold2 />
      <Fold3 />
      <Fold4 />
      <Fold5 />
      <Fold6 />
      <Fold7 />
    </div>
  </div>
);

export default Dossier;
