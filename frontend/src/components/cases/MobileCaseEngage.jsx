import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const TELE  = "'Courier New', Courier, monospace";
const EXPO  = [0.16, 1, 0.3, 1];
const A     = '#10b981';

/* ══════════════════════════════════════════
   ANIMATED COUNTER
   ══════════════════════════════════════════ */
const Counter = ({ value, suffix = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const [count, setCount] = useState(0);
  const numericPart = parseFloat(value.replace(/[^0-9.]/g, ''));

  useEffect(() => {
    if (!inView || isNaN(numericPart)) return;
    const duration = 1600;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * numericPart));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, numericPart]);

  return <span ref={ref}>{isNaN(numericPart) ? value : count}{suffix}</span>;
};

/* ══════════════════════════════════════════
   SCROLL TERMINAL
   ══════════════════════════════════════════ */
const TERMINAL_LINES = [
  { prefix: '>', text: 'me.campaign.mint() — generating tk=aa1afa3f...', color: A },
  { prefix: '$', text: 'DEPLOYING: scraper across Miles web ecosystem...', color: '#f59e0b' },
  { prefix: '→', text: 'tk= token persisted in operational memory — cross-domain hop survived', color: '#E5E7EB' },
  { prefix: '✓', text: 'NATIVE BRIDGE: n8n mapping FB Form_ID → ME Campaign_ID', color: A },
  { prefix: '$', text: 'API INGEST: fetching daily spend from Google, Meta, LinkedIn...', color: '#f59e0b' },
  { prefix: '→', text: 'TAGGING: cost data → ME Campaign_ID — ROAS calc ready', color: '#E5E7EB' },
  { prefix: '✓', text: 'ROCS ENGINE: Netcore CDP connected — WhatsApp + Email spend mapped', color: A },
  { prefix: '$', text: 'BigQuery: U-Shaped Attribution Model applied — 3 phases scored', color: '#f59e0b' },
  { prefix: '✓', text: 'DISCOVERY: ₹5 WhatsApp blast (20% assist) closing ₹500 Google leads (40% Genesis)', color: A },
  { prefix: '✓', text: 'CSV PURGATORY ELIMINATED — real-time financial dashboard live', color: A },
];

const ScrollTerminal = () => {
  const [visibleLines, setVisibleLines] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= TERMINAL_LINES.length) { clearInterval(id); return prev; }
        return prev + 1;
      });
    }, 480);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <div ref={ref} style={{
      background: 'rgba(0,0,0,0.7)',
      borderRadius: 12,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 260,
    }}>
      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.02)', flexShrink: 0,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: A }} />
        <span style={{ fontFamily: TELE, fontSize: 9, color: '#9CA3AF', letterSpacing: '0.1em', marginLeft: 6 }}>
          me_tokenized_engine.sh
        </span>
      </div>
      {/* Lines */}
      <div style={{ padding: '12px 14px', flex: 1, overflowY: 'auto' }}>
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            style={{ marginBottom: 7, display: 'flex', gap: 8, alignItems: 'flex-start' }}
          >
            <span style={{ fontFamily: TELE, fontSize: 11, color: line.color, flexShrink: 0, lineHeight: 1.5 }}>{line.prefix}</span>
            <span style={{ fontFamily: TELE, fontSize: 11, color: line.color, opacity: 0.9, lineHeight: 1.5 }}>{line.text}</span>
          </motion.div>
        ))}
        {visibleLines < TERMINAL_LINES.length && inView && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{ fontFamily: TELE, fontSize: 12, color: A }}
          >▌</motion.span>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   MOBILE ATTRIBUTION VIZ — bar chart rows
   ══════════════════════════════════════════ */
// 3-phase U-shape per docx: Genesis (40%) → Assisted Touches (20%) → Commitment (40%)
const TOUCHPOINTS = [
  { label: 'Genesis',          role: 'First Touch',  weight: 0.40, note: 'First tk captured' },
  { label: 'Assisted Touches', role: 'Mid-Funnel',   weight: 0.20, note: 'Netcore WA / Email' },
  { label: 'Commitment',       role: 'Closer',       weight: 0.40, note: 'Booking / Subscribe' },
];

const ROLE_COLOR = { 'First Touch': '#10b981', 'Mid-Funnel': '#f59e0b', Closer: '#6366f1' };

const MobileAttributionViz = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <div ref={ref} style={{
      background: 'rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 16,
      padding: '20px 16px 24px',
    }}>
      <span style={{ fontFamily: TELE, fontSize: 9, color: '#9CA3AF', letterSpacing: '0.25em', textTransform: 'uppercase', display: 'block', textAlign: 'center', marginBottom: 4 }}>
        U-Shaped (Position-Based)
      </span>
      <span style={{ fontFamily: TELE, fontSize: 9, color: A, letterSpacing: '0.25em', textTransform: 'uppercase', display: 'block', textAlign: 'center', marginBottom: 20 }}>
        Attribution Model
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {TOUCHPOINTS.map((tp, i) => {
          const color = ROLE_COLOR[tp.role];
          return (
            <motion.div
              key={tp.label}
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.12, ease: EXPO }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: SWISS, fontSize: 14, fontWeight: 500, color: '#E5E7EB' }}>{tp.label}</span>
                  <span style={{
                    fontFamily: TELE, fontSize: 8, color, letterSpacing: '0.2em', textTransform: 'uppercase',
                    background: `${color}18`, border: `1px solid ${color}40`, borderRadius: 4, padding: '2px 6px',
                  }}>{tp.role}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{ fontFamily: TELE, fontSize: 9, color: '#6B7280' }}>{tp.note}</span>
                  <span style={{ fontFamily: SWISS, fontSize: 16, fontWeight: 700, color: '#FFFFFF', minWidth: 42, textAlign: 'right' }}>
                    {Math.round(tp.weight * 100)}%
                  </span>
                </div>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', borderRadius: 3, background: `linear-gradient(to right, ${color}70, ${color})` }}
                  initial={{ width: '0%' }}
                  animate={inView ? { width: `${tp.weight * 100}%` } : {}}
                  transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: EXPO }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Conversion row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.9, duration: 0.5 }}
        style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${A}60)` }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: `${A}15`, border: `1px solid ${A}50`, borderRadius: 8, padding: '10px 14px', minHeight: 44 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: A, boxShadow: `0 0 6px ${A}` }} />
          <span style={{ fontFamily: TELE, fontSize: 9, color: A, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Conversion</span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.1, duration: 0.5 }}
        style={{ fontFamily: SWISS, fontSize: 12, fontWeight: 300, color: '#9CA3AF', lineHeight: 1.6, marginTop: 14, textAlign: 'center' }}
      >
        ₹5 WhatsApp assist closing ₹500 Google leads — budget reallocated dynamically
      </motion.p>
    </div>
  );
};

/* ══════════════════════════════════════════
   MOBILE METRIC PILL
   ══════════════════════════════════════════ */
const MetricPill = ({ value, suffix, label, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-30px' }}
    transition={{ duration: 0.5, ease: EXPO, delay }}
    style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12, padding: '18px 16px', textAlign: 'center',
      position: 'relative', overflow: 'hidden',
    }}
  >
    <span style={{ fontFamily: SWISS, fontSize: 32, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em', display: 'block', lineHeight: 1 }}>
      <Counter value={value} suffix={suffix} />
    </span>
    <span style={{ fontFamily: TELE, fontSize: 8, color: A, letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: 8, display: 'block' }}>
      {label}
    </span>
    <motion.div
      style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${A}80, ${A}20)`, transformOrigin: 'left' }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, ease: EXPO, delay: delay + 0.25 }}
    />
  </motion.div>
);

/* ══════════════════════════════════════════
   MOBILE BENTO CARD
   ══════════════════════════════════════════ */
const BentoCard = ({ tag, title, body, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.6, ease: EXPO, delay }}
    style={{
      background: 'rgba(255,255,255,0.015)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16,
      padding: '22px 18px',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${A}45, transparent)` }} />
    <span style={{ fontFamily: TELE, fontSize: 9, color: A, letterSpacing: '0.32em', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
      {tag}
    </span>
    <h3 style={{ fontFamily: SWISS, fontSize: 18, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2, marginBottom: 10 }}>
      {title}
    </h3>
    <p style={{ fontFamily: SWISS, fontSize: 14, fontWeight: 300, color: '#D1D5DB', lineHeight: 1.75 }}>
      {body}
    </p>
  </motion.div>
);

/* ═══════════════════════════════════════════
   MOBILE CASE ENGAGE — main component
   ═══════════════════════════════════════════ */
const MobileCaseEngage = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  return (
    <div className="relative w-full" style={{ background: '#050505', overflowX: 'hidden' }}>

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50"
        style={{ height: 2, background: A, scaleX: smoothProgress, transformOrigin: '0%' }}
      />

      {/* ════ HERO — sticky gradient ════ */}
      <section
        className="relative z-10"
        style={{ padding: '88px 20px 36px', background: `linear-gradient(180deg, ${A}18 0%, ${A}06 55%, #050505 100%)` }}
      >
        <motion.div
          className="flex items-center gap-2"
          style={{ marginBottom: 18 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EXPO }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: A, boxShadow: `0 0 8px ${A}`, flexShrink: 0 }} />
          <span style={{ fontFamily: TELE, fontSize: 9, color: A, letterSpacing: '0.35em', textTransform: 'uppercase' }}>
            Operation: Miles Engage
          </span>
        </motion.div>

        <motion.h1
          style={{ fontFamily: SWISS, fontSize: 'clamp(32px, 9vw, 48px)', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 16 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EXPO, delay: 0.12 }}
        >
          The Attribution<br />Recovery Engine
        </motion.h1>

        <motion.p
          style={{ fontFamily: SWISS, fontSize: 15, fontWeight: 300, color: '#D1D5DB', lineHeight: 1.65, maxWidth: 340 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EXPO, delay: 0.26 }}
        >
          Eliminating the "Marketing Mirage" through Tokenized Tracking and ROAS/ROCS Engineering
        </motion.p>

        <motion.div
          style={{ width: 48, height: 2, background: A, marginTop: 24, transformOrigin: 'left' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: EXPO, delay: 0.45 }}
        />
      </section>

      {/* ════ METRIC PILLS — 2×2 ════ */}
      <section className="relative z-10" style={{ padding: '0 20px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <MetricPill value="20" suffix="%" label="ROAS Lift"           delay={0} />
          <MetricPill value="30" suffix="%" label="Ops Workload Cut"    delay={0.08} />
          <MetricPill value="15" suffix="%" label="Comms Waste Slashed" delay={0.14} />
          <MetricPill value="Ghost" suffix="" label="Lead Recovery" delay={0.2} />
        </div>
      </section>

      {/* ════ STRATEGIC INTENT ════ */}
      <section className="relative z-10" style={{ padding: '0 20px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: EXPO }}
          style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '22px 18px' }}
        >
          <span style={{ fontFamily: TELE, fontSize: 9, color: A, letterSpacing: '0.28em', textTransform: 'uppercase', display: 'block', marginBottom: 14 }}>
            Strategic Intent
          </span>
          <p style={{ fontFamily: SWISS, fontSize: 15, fontWeight: 300, color: '#E5E7EB', lineHeight: 1.75, marginBottom: 14 }}>
            Miles Education faced a critical <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>"Marketing Mirage"</strong> — native platform dashboards reported high performance that never materialized as CRM revenue. Fragmented tracking and "Last-Click" bias led to inefficient capital allocation.
          </p>
          <p style={{ fontFamily: SWISS, fontSize: 15, fontWeight: 300, color: '#E5E7EB', lineHeight: 1.75 }}>
            The solution: <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Miles Engage (ME)</strong> — a proprietary Attribution & Recovery Engine using a <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Deterministic Tokenized Architecture (tk=)</strong> with real-time ROAS and ROCS visibility.
          </p>
        </motion.div>
      </section>

      {/* ════ TERMINAL ════ */}
      <section className="relative z-10" style={{ padding: '0 20px 20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: EXPO }}
          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}
        >
          <div style={{ padding: '14px 16px 0' }}>
            <span style={{ fontFamily: TELE, fontSize: 9, color: A, letterSpacing: '0.28em', textTransform: 'uppercase' }}>
              Protocol 00 — Live Feed
            </span>
          </div>
          <ScrollTerminal />
        </motion.div>
      </section>

      {/* ════ BENTO STACK — Protocol 01–04 ════ */}
      <section className="relative z-10" style={{ padding: '8px 20px 24px' }}>
        <motion.p
          style={{ fontFamily: TELE, fontSize: 9, color: '#9CA3AF', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 18 }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        >[ Command Console ]</motion.p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <BentoCard
            tag="Protocol 01" title="The tk= Token" delay={0}
            body="Deprecated fragile UTMs in favor of a Tokenized URL system. Every campaign mints a unique tk parameter (e.g., tk=aa1afa3f). A custom scraper persists the token across domain hops, ensuring attribution survives the final form submit. Native Facebook/LinkedIn forms are bridged via n8n."
          />
          <BentoCard
            tag="Protocol 02" title="ROAS/ROCS Financial Loop" delay={0.06}
            body="Custom scripts fetch daily spend via API from Google, Meta, and LinkedIn. Connecting Netcore CDP enables ROCS — return on every rupee spent on WhatsApp and email communication."
          />
          <BentoCard
            tag="Protocol 03" title="U-Shaped Attribution" delay={0.1}
            body="Deployed in BigQuery, this Position-Based model proved a ₹5 WhatsApp blast (20% assist) was closing ₹500 Google leads (40% Genesis), enabling dynamic budget reallocation across the Omni-Channel Flywheel."
          />
          <BentoCard
            tag="Protocol 04" title="Intent-Based Routing" delay={0.14}
            body="ME evaluated Intent Velocity via tk token. Round-Robin SQL pushed high-intent leads to Sales Officers' dialers instantly — replacing manual 'Data Postmen' with a real-time High-Frequency Trading Desk."
          />
        </div>
      </section>

      {/* ════ ATTRIBUTION VIZ — bar chart ════ */}
      <section className="relative z-10" style={{ padding: '0 20px 28px' }}>
        <MobileAttributionViz />
      </section>

      {/* ════ NAV FOOTER ════ */}
      <section className="relative z-10" style={{ padding: '8px 20px 100px', textAlign: 'center' }}>
        <div style={{ width: 40, height: 1, background: `${A}40`, margin: '0 auto 28px' }} />
        <Link
          to="/cases/agentic-voice-qualification"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontFamily: TELE, fontSize: 11, fontWeight: 600, color: A,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            padding: '0 28px', minHeight: 52,
            border: `1px solid ${A}35`, borderRadius: 10,
            background: `${A}08`, textDecoration: 'none',
          }}
        >
          Next: Cerebro
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
        <Link
          to="/cases"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 44, marginTop: 16,
            fontFamily: TELE, fontSize: 10, color: '#D1D5DB',
            letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none',
          }}
        >
          &larr; All Cases
        </Link>
      </section>
    </div>
  );
};

export default MobileCaseEngage;
