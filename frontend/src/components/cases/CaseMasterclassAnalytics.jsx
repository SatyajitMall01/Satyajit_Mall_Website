import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, BarChart3, Brain, TrendingDown, MessageCircle } from 'lucide-react';

const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const TELE  = "'Courier New', Courier, monospace";
const EXPO  = [0.16, 1, 0.3, 1];
const A     = '#f97316';

/* ══════════════════════════════════════════
   ANIMATED COUNTER
   ══════════════════════════════════════════ */
const Counter = ({ value, prefix = '', suffix = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  const [count, setCount] = useState(0);
  const numericPart = parseFloat(value.replace(/[^0-9.]/g, ''));

  useEffect(() => {
    if (!inView || isNaN(numericPart)) return;
    const duration = 1800;
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

  return <span ref={ref}>{prefix}{isNaN(numericPart) ? value : count}{suffix}</span>;
};

/* ══════════════════════════════════════════
   ANIMATED HEATMAP GRID
   ══════════════════════════════════════════ */
const HeatmapGrid = () => {
  const ROWS = 8;
  const COLS = 16;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  // Pre-generate cell data with a pattern: engagement drops off mid-right
  const cells = useMemo(() =>
    Array.from({ length: ROWS * COLS }, (_, idx) => {
      const row = Math.floor(idx / COLS);
      const col = idx % COLS;
      // Simulate viewing pattern: high start, decay in middle, slight recovery
      const baseHeat = col < 6
        ? 0.7 + Math.random() * 0.3
        : col < 10
          ? 0.2 + Math.random() * 0.3
          : 0.1 + Math.random() * 0.2;
      // Add row variation
      const heat = Math.max(0, Math.min(1, baseHeat - (row > 4 ? 0.15 : 0)));
      return { row, col, heat, delay: (row * COLS + col) * 0.008 };
    })
  , []);

  const getHeatColor = (heat) => {
    if (heat > 0.7) return `${A}`;
    if (heat > 0.5) return `${A}AA`;
    if (heat > 0.3) return `${A}55`;
    return `${A}22`;
  };

  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 3, maxWidth: 800, margin: '0 auto' }}>
      {cells.map((cell, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: cell.delay, ease: EXPO }}
          whileHover={{ scale: 1.4, zIndex: 10 }}
          style={{
            aspectRatio: '1',
            borderRadius: 3,
            background: getHeatColor(cell.heat),
            cursor: 'pointer',
            position: 'relative',
            transition: 'box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = `0 0 12px ${A}60`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      ))}
      {/* Row labels — modules */}
      <div style={{
        gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', marginTop: 8,
        fontFamily: TELE, fontSize: 8, color: '#9CA3AF', letterSpacing: '0.05em',
      }}>
        <span>Module 1</span>
        <span>Module 4</span>
        <span style={{ color: '#ef4444' }}>Module 7 (Drop-off)</span>
        <span>Module 10</span>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   INTENT SCORE FORMULA VISUALIZATION
   ══════════════════════════════════════════ */
const IntentScoreFormula = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  const [hoveredFactor, setHoveredFactor] = useState(null);

  const factors = [
    { label: 'Completion', weight: 0.4, color: '#22c55e', desc: 'Percentage of module content consumed' },
    { label: 'Consistency', weight: 0.3, color: '#3b82f6', desc: 'Streak of consecutive daily sessions' },
    { label: 'Interaction', weight: 0.3, color: A, desc: 'Quiz attempts, notes, bookmarks, shares' },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: EXPO }}
      style={{
        background: 'rgba(255,255,255,0.015)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 18,
        padding: '40px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${A}40, transparent)` }} />

      <span style={{ fontFamily: TELE, fontSize: 9, color: A, letterSpacing: '0.3em', textTransform: 'uppercase', display: 'block', marginBottom: 24 }}>
        Intent Score Formula
      </span>

      {/* Formula display */}
      <div style={{
        fontFamily: TELE, fontSize: 'clamp(14px, 2.5vw, 20px)', color: '#FFFFFF',
        textAlign: 'center', padding: '20px 0', letterSpacing: '0.05em',
      }}>
        <span style={{ color: '#9CA3AF' }}>INTENT_SCORE = </span>
        {factors.map((f, i) => (
          <span key={f.label}>
            <motion.span
              style={{
                color: hoveredFactor === i ? f.color : '#E5E7EB',
                cursor: 'pointer',
                transition: 'color 0.2s',
                textDecoration: hoveredFactor === i ? 'underline' : 'none',
                textDecorationColor: f.color,
              }}
              onMouseEnter={() => setHoveredFactor(i)}
              onMouseLeave={() => setHoveredFactor(null)}
              whileHover={{ scale: 1.05 }}
            >
              {f.label}({f.weight})
            </motion.span>
            {i < factors.length - 1 && <span style={{ color: '#9CA3AF' }}> + </span>}
          </span>
        ))}
      </div>

      {/* Factor bars */}
      <div style={{ display: 'flex', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
        {factors.map((f, i) => (
          <motion.div
            key={f.label}
            style={{
              flex: '1 1 200px',
              padding: '20px',
              borderRadius: 12,
              background: hoveredFactor === i ? `${f.color}12` : 'rgba(255,255,255,0.02)',
              border: `1px solid ${hoveredFactor === i ? f.color + '40' : 'rgba(255,255,255,0.04)'}`,
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={() => setHoveredFactor(i)}
            onMouseLeave={() => setHoveredFactor(null)}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontFamily: SWISS, fontSize: 14, fontWeight: 600, color: f.color }}>{f.label}</span>
              <span style={{ fontFamily: TELE, fontSize: 20, fontWeight: 800, color: '#FFFFFF' }}>{f.weight}</span>
            </div>

            {/* Weight bar */}
            <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', borderRadius: 2, background: f.color }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${f.weight * 100}%` } : { width: 0 }}
                transition={{ duration: 1, ease: EXPO, delay: 0.3 + i * 0.15 }}
              />
            </div>

            <p style={{ fontFamily: SWISS, fontSize: 12, fontWeight: 300, color: '#D1D5DB', marginTop: 12, lineHeight: 1.5 }}>
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   OUTCOME CARDS
   ══════════════════════════════════════════ */
const OutcomeCard = ({ icon: IconComp, title, body, accent, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, ease: EXPO, delay }}
    whileHover={{ y: -6 }}
    style={{
      background: 'rgba(255,255,255,0.015)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 14,
      padding: '28px 24px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'border-color 0.3s, box-shadow 0.3s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = `${accent}40`;
      e.currentTarget.style.boxShadow = `0 8px 40px ${accent}10, inset 0 1px 0 ${accent}15`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${accent}40, transparent)` }} />
    <div style={{
      width: 40, height: 40, borderRadius: 10,
      background: `${accent}10`, border: `1px solid ${accent}25`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    }}>
      <IconComp size={20} color={accent} strokeWidth={1.5} />
    </div>
    <h3 style={{ fontFamily: SWISS, fontSize: 17, fontWeight: 700, color: '#FFFFFF', marginBottom: 10 }}>{title}</h3>
    <p style={{ fontFamily: SWISS, fontSize: 14, fontWeight: 300, color: '#E5E7EB', lineHeight: 1.8 }}>{body}</p>
  </motion.div>
);

/* ══════════════════════════════════════════
   METRIC BAR
   ══════════════════════════════════════════ */
const MetricBar = ({ value, label, sublabel, percent = 75, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: EXPO, delay }}
      style={{ borderLeft: `3px solid ${A}`, paddingLeft: 24 }}
    >
      <span style={{
        fontFamily: SWISS, fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800,
        color: '#FFFFFF', letterSpacing: '-0.03em', display: 'block', lineHeight: 1,
      }}>
        {value}
      </span>
      <span style={{
        fontFamily: TELE, fontSize: 10, color: A,
        letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: 8, display: 'block',
      }}>
        {label}
      </span>
      <div style={{ marginTop: 12, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <motion.div
          style={{ height: '100%', borderRadius: 2, background: `linear-gradient(to right, ${A}, ${A}80)` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${percent}%` } : { width: 0 }}
          transition={{ duration: 1.2, ease: EXPO, delay: delay + 0.3 }}
        />
      </div>
      <p style={{ fontFamily: SWISS, fontSize: 12, fontWeight: 300, color: '#D1D5DB', lineHeight: 1.6, marginTop: 10 }}>
        {sublabel}
      </p>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
const CaseMasterclassAnalytics = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const headerY = useTransform(smoothProgress, [0, 0.15], [0, -60]);
  const headerOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);

  return (
    <div className="relative w-full" style={{ background: '#050505' }}>

      {/* Ambient ombre */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `radial-gradient(ellipse 100% 60% at 30% 20%, ${A}10 0%, transparent 50%), radial-gradient(ellipse 80% 100% at 80% 80%, ${A}08 0%, transparent 50%)`
      }} />

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50"
        style={{ height: 2, background: A, scaleX: smoothProgress, transformOrigin: '0%' }}
      />

      {/* ════ HERO ════ */}
      <section className="relative z-10" style={{ padding: '100px 24px 40px' }}>

        <motion.div className="max-w-6xl mx-auto text-center" style={{ y: headerY, opacity: headerOpacity }}>
          {/* Badge */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EXPO }}
          >
            <BarChart3 size={14} color={A} />
            <span style={{ fontFamily: TELE, fontSize: 10, color: A, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
              Operation: Masterclass Analytics
            </span>
          </motion.div>

          {/* Title */}
          <div className="overflow-hidden">
            <motion.h1
              style={{ fontFamily: SWISS, fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.04em', lineHeight: 1.0 }}
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, ease: EXPO, delay: 0.2 }}
            >
              OTT Product
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              style={{ fontFamily: SWISS, fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.04em', lineHeight: 1.0 }}
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, ease: EXPO, delay: 0.35 }}
            >
              Forensics
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            style={{ fontFamily: SWISS, fontSize: 'clamp(15px, 1.8vw, 19px)', fontWeight: 300, color: '#D1D5DB', maxWidth: 700, margin: '24px auto 0', lineHeight: 1.6 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EXPO, delay: 0.5 }}
          >
            Optimizing the Content-to-Commerce Funnel through Behavioral Stream Analysis
          </motion.p>

          {/* Scroll hint */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ChevronDown size={20} color="#9CA3AF" style={{ margin: '0 auto' }} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Heatmap Visualization */}
        <motion.div
          className="max-w-5xl mx-auto mt-12"
          style={{
            background: 'rgba(5,5,5,0.7)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: 18,
            padding: '32px 24px',
            backdropFilter: 'blur(16px)',
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EXPO, delay: 0.3 }}
        >
          <p style={{ fontFamily: TELE, fontSize: 9, color: '#9CA3AF', letterSpacing: '0.3em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 20 }}>
            Video Engagement Heatmap &middot; Hover cells to inspect engagement density
          </p>
          <HeatmapGrid />
        </motion.div>
      </section>

      {/* ════ STRATEGIC INTENT ════ */}
      <section className="relative z-10" style={{ padding: '80px 24px' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
            >
              <span style={{ fontFamily: TELE, fontSize: 10, color: A, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                Strategic Intent
              </span>
              <div style={{ width: 40, height: 2, background: A, marginTop: 12 }} />
            </motion.div>
          </div>
          <motion.div
            className="md:col-span-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EXPO }}
          >
            <p style={{ fontFamily: SWISS, fontSize: 17, fontWeight: 300, color: '#E5E7EB', lineHeight: 1.85 }}>
              Users consumed Masterclass content but weren't converting to paid programs. By integrating <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>10-second heartbeat pings</strong> into BigQuery and mapping them against Miles One identity, we identified specific <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>'Drop-off Catalysts'</strong> and implemented behavior-triggered interventions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════ INTENT SCORE FORMULA ════ */}
      <section className="relative z-10" style={{ padding: '40px 24px 80px' }}>
        <div className="max-w-4xl mx-auto">
          <IntentScoreFormula />
        </div>
      </section>

      {/* ════ KEY DISCOVERIES — Outcome Cards ════ */}
      <section className="relative z-10" style={{ padding: '60px 24px 80px' }}>
        <div className="max-w-5xl mx-auto">
          <motion.p
            className="text-center mb-14"
            style={{ fontFamily: TELE, fontSize: 10, color: '#D1D5DB', letterSpacing: '0.35em', textTransform: 'uppercase' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            [ Key Discoveries & Interventions ]
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OutcomeCard
              icon={BarChart3}
              title="Heatmap Query Architecture"
              body="10-second heartbeat pings streamed into BigQuery, partitioned by user and session. Velocity tracking reveals playback speed anomalies (2x = skimming). Re-watch analysis detects high-value 'anchor moments' where users replay segments."
              accent={A}
              delay={0}
            />
            <OutcomeCard
              icon={TrendingDown}
              title="Mid-Module Decay Discovery"
              body="40% drop-off at the 'Regulatory Frameworks' module — the hardest, most abstract content in the curriculum. Without behavioral telemetry, this churn was invisible. The heatmap made it undeniable."
              accent="#ef4444"
              delay={0.1}
            />
            <OutcomeCard
              icon={Brain}
              title="Intent Score Engine"
              body="Composite score combining Completion (0.4 weight), Consistency (0.3), and Interaction (0.3). Users scoring above the threshold receive targeted conversion offers. Below-threshold users receive re-engagement nudges."
              accent="#3b82f6"
              delay={0.2}
            />
            <OutcomeCard
              icon={MessageCircle}
              title="Contextual Nudges"
              body="A 60-second pause on any module triggers a context-aware AI popup: 'Struggling with Regulatory Frameworks? Here's a 3-minute summary.' These interventions reduced mid-module abandonment by recovering users at the moment of friction."
              accent="#22c55e"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ════ BUSINESS LEDGER ════ */}
      <section className="relative z-10" style={{ padding: '60px 24px 100px' }}>
        <div className="max-w-5xl mx-auto">
          <motion.p
            className="text-center mb-16"
            style={{ fontFamily: TELE, fontSize: 10, color: '#D1D5DB', letterSpacing: '0.35em', textTransform: 'uppercase' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            [ Business Ledger ]
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
            <MetricBar
              value="+22%"
              label="Module Completion"
              percent={85}
              delay={0}
              sublabel="Contextual nudges and re-engagement interventions recovered users at the exact moment of friction, driving completion rates up across the curriculum."
            />
            <MetricBar
              value="2,000+"
              label="Paid Enrollments"
              percent={90}
              delay={0.15}
              sublabel="High-intent users identified by the scoring engine were routed to targeted conversion offers, generating 2,000+ paid program enrollments."
            />
            <MetricBar
              value="-12%"
              label="Blended CPA"
              percent={70}
              delay={0.3}
              sublabel="Better attribution eliminated wasted ad spend on already-engaged users, reducing the overall cost per acquisition across channels."
            />
            <MetricBar
              value="-30%"
              label="Sales Explain Time"
              percent={78}
              delay={0.45}
              sublabel="Sales teams received behavioral context before calls — which modules the prospect completed, where they paused, what they replayed — eliminating cold-start discovery."
            />
          </div>
        </div>
      </section>

      {/* ════ NAV FOOTER ════ */}
      <section className="relative z-10" style={{ padding: '40px 24px 120px', textAlign: 'center' }}>
        <div style={{ width: 40, height: 1, background: `${A}40`, margin: '0 auto 32px' }} />
        <Link
          to="/cases/csat-engineering"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            fontFamily: TELE, fontSize: 12, fontWeight: 600,
            color: A, letterSpacing: '0.2em', textTransform: 'uppercase',
            padding: '14px 32px', border: `1px solid ${A}35`, borderRadius: 8,
            background: `${A}08`, textDecoration: 'none', transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${A}15`; e.currentTarget.style.borderColor = `${A}60`; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${A}08`; e.currentTarget.style.borderColor = `${A}35`; }}
        >
          Next: AlmaBetter Resolution <ArrowRight size={14} />
        </Link>
        <div style={{ marginTop: 20 }}>
          <Link to="/cases" style={{ fontFamily: TELE, fontSize: 10, color: '#D1D5DB', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none' }}>
            &larr; All Cases
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CaseMasterclassAnalytics;
