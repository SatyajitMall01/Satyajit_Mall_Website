import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, Database, Link2, Search, Zap } from 'lucide-react';

const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const TELE  = "'Courier New', Courier, monospace";
const EXPO  = [0.16, 1, 0.3, 1];
const A     = '#06b6d4';

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
   DATA LAKE PARTICLES
   ══════════════════════════════════════════ */
const DataLakeParticles = () => {
  const dots = useRef(
    Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 4,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: d.size, height: d.size,
            left: `${d.x}%`, top: `${d.y}%`,
            background: i % 6 === 0 ? A : 'rgba(255,255,255,0.12)',
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, (Math.random() - 0.5) * 10, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════
   FUNNEL VISUALIZATION — GA4 → Firebase → Appsflyer → BigQuery → CRM
   ══════════════════════════════════════════ */
const FUNNEL_NODES = [
  { id: 'GA4',       label: 'GA4',        sub: 'Web Analytics',    x: 100, y: 60 },
  { id: 'FIREBASE',  label: 'Firebase',    sub: 'Mobile Events',   x: 100, y: 160 },
  { id: 'APPSFLYER', label: 'Appsflyer',   sub: 'Attribution',     x: 100, y: 260 },
  { id: 'BQ',        label: 'BigQuery',    sub: 'Data Lake',       x: 420, y: 160 },
  { id: 'CRM',       label: 'CRM',         sub: 'Sales Pipeline',  x: 700, y: 160 },
];

const FUNNEL_EDGES = [
  ['GA4', 'BQ'], ['FIREBASE', 'BQ'], ['APPSFLYER', 'BQ'], ['BQ', 'CRM'],
];

const FunnelPacket = ({ x1, y1, x2, y2, delay = 0 }) => (
  <motion.circle
    r={2.5}
    fill={A}
    initial={{ cx: x1, cy: y1, opacity: 0 }}
    animate={{
      cx: [x1, (x1 + x2) / 2, x2],
      cy: [y1, (y1 + y2) / 2 - 10, y2],
      opacity: [0, 1, 0],
    }}
    transition={{ duration: 2.5, delay, repeat: Infinity, ease: 'easeInOut' }}
    style={{ filter: `drop-shadow(0 0 6px ${A})` }}
  />
);

const FunnelDiagram = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <svg viewBox="0 0 800 320" className="w-full" style={{ maxWidth: 960, margin: '0 auto' }}>
      <defs>
        <filter id="cyanGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="cyanHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={A} stopOpacity="0.2" />
          <stop offset="100%" stopColor={A} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="funnelArrow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={A} stopOpacity="0.6" />
          <stop offset="100%" stopColor={A} stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Background grid */}
      {Array.from({ length: 21 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={320} stroke="rgba(255,255,255,0.015)" />
      ))}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 40} x2={800} y2={i * 40} stroke="rgba(255,255,255,0.015)" />
      ))}

      {/* Funnel converge shape */}
      <motion.path
        d="M 170 40 L 350 130 L 350 190 L 170 280 Z"
        fill={`${A}04`}
        stroke={`${A}12`}
        strokeWidth={1}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      {/* BigQuery lake shape */}
      <motion.ellipse
        cx={420} cy={160} rx={80} ry={60}
        fill={`${A}06`}
        stroke={`${A}18`}
        strokeWidth={1}
        strokeDasharray="4 4"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8 }}
      />

      {/* Edges */}
      {FUNNEL_EDGES.map(([a, b], i) => {
        const from = FUNNEL_NODES.find(n => n.id === a);
        const to = FUNNEL_NODES.find(n => n.id === b);
        const active = hovered === a || hovered === b;
        return (
          <g key={`edge-${i}`}>
            <motion.line
              x1={from.x + 50} y1={from.y} x2={to.x - 50} y2={to.y}
              stroke={active ? A : 'rgba(255,255,255,0.06)'}
              strokeWidth={active ? 2 : 1}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 + i * 0.2, ease: EXPO }}
            />
            <FunnelPacket x1={from.x + 50} y1={from.y} x2={to.x - 50} y2={to.y} delay={i * 0.5} />
            <FunnelPacket x1={from.x + 50} y1={from.y} x2={to.x - 50} y2={to.y} delay={i * 0.5 + 1.3} />
          </g>
        );
      })}

      {/* miles_uuid label in center */}
      <motion.text
        x={420} y={290}
        textAnchor="middle"
        fill={A}
        style={{ fontFamily: TELE, fontSize: 10, letterSpacing: '0.15em' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.7 }}
        viewport={{ once: true }}
        transition={{ delay: 1.2 }}
      >
        miles_uuid — the universal glue
      </motion.text>

      {/* Nodes */}
      {FUNNEL_NODES.map((node, i) => {
        const active = hovered === node.id;
        const isBQ = node.id === 'BQ';
        return (
          <motion.g
            key={node.id}
            onMouseEnter={() => setHovered(node.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'pointer' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.15, type: 'spring', stiffness: 100 }}
          >
            {active && (
              <motion.circle cx={node.x} cy={node.y} r={45} fill="url(#cyanHalo)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />
            )}

            <motion.rect
              x={node.x - (isBQ ? 42 : 34)} y={node.y - 28} width={isBQ ? 84 : 68} height={56} rx={isBQ ? 16 : 12}
              fill={active ? `${A}12` : 'rgba(255,255,255,0.02)'}
              stroke={active ? A : 'rgba(255,255,255,0.08)'}
              strokeWidth={active ? 2 : 1}
              filter={active ? 'url(#cyanGlow)' : undefined}
            />

            <text
              x={node.x} y={node.y - 5}
              textAnchor="middle"
              fill={active ? '#FFFFFF' : '#E5E7EB'}
              style={{ fontFamily: SWISS, fontSize: isBQ ? 15 : 12, fontWeight: 700 }}
            >
              {node.label}
            </text>
            <text
              x={node.x} y={node.y + 14}
              textAnchor="middle"
              fill={active ? '#D1D5DB' : '#9CA3AF'}
              style={{ fontFamily: TELE, fontSize: 8, letterSpacing: '0.06em' }}
            >
              {node.sub}
            </text>

            {active && (
              <>
                <motion.circle cx={node.x} cy={node.y} r={0} fill="none" stroke={A} strokeWidth={0.5}
                  animate={{ r: [0, 35, 50], opacity: [0.6, 0.15, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }} />
              </>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
};

/* ══════════════════════════════════════════
   SPLIT VIEW — Problem / Solution
   ══════════════════════════════════════════ */
const SplitPanel = ({ side, title, tagColor, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.7, ease: EXPO, delay }}
    style={{
      background: 'rgba(255,255,255,0.015)',
      border: `1px solid ${tagColor}20`,
      borderRadius: 14,
      padding: '32px 28px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'border-color 0.3s, box-shadow 0.3s',
    }}
    whileHover={{
      boxShadow: `0 8px 40px ${tagColor}12, inset 0 1px 0 ${tagColor}18`,
      borderColor: `${tagColor}40`,
    }}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${tagColor}50, transparent)` }} />
    <span style={{ fontFamily: TELE, fontSize: 9, color: tagColor, letterSpacing: '0.3em', textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>
      {title}
    </span>
    {children}
  </motion.div>
);

/* ══════════════════════════════════════════
   SECTION CARD (Expandable)
   ══════════════════════════════════════════ */
const SectionCard = ({ phase, title, body, delay = 0 }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: EXPO, delay }}
      whileHover={{ y: -4 }}
      onClick={() => setExpanded(!expanded)}
      style={{
        background: 'rgba(255,255,255,0.015)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 14,
        padding: '28px 24px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${A}40`;
        e.currentTarget.style.boxShadow = `0 8px 40px ${A}10, inset 0 1px 0 ${A}15`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${A}40, transparent)` }} />

      <div className="flex items-center justify-between mb-4">
        <span style={{ fontFamily: TELE, fontSize: 9, color: A, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          {phase}
        </span>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={14} color="#9CA3AF" />
        </motion.div>
      </div>

      <h3 style={{ fontFamily: SWISS, fontSize: 17, fontWeight: 700, color: '#FFFFFF', marginBottom: 12 }}>{title}</h3>

      <AnimatePresence>
        <motion.p
          style={{ fontFamily: SWISS, fontSize: 14, fontWeight: 300, color: '#E5E7EB', lineHeight: 1.8 }}
          animate={{ height: expanded ? 'auto' : 52, opacity: 1 }}
          transition={{ duration: 0.4, ease: EXPO }}
          className="overflow-hidden"
        >
          {body}
        </motion.p>
      </AnimatePresence>

      {!expanded && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, background: 'linear-gradient(transparent, #050505)' }} />
      )}
    </motion.div>
  );
};

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
const CaseAnalytics = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const headerY = useTransform(smoothProgress, [0, 0.15], [0, -60]);
  const headerOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);

  return (
    <div className="relative w-full" style={{ background: '#050505' }}>

      {/* Ambient ombre */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `radial-gradient(ellipse 120% 70% at 50% 10%, ${A}12 0%, transparent 50%), radial-gradient(ellipse 80% 100% at 100% 80%, ${A}08 0%, transparent 50%)`
      }} />

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50"
        style={{ height: 2, background: A, scaleX: smoothProgress, transformOrigin: '0%' }}
      />

      {/* ════ HERO ════ */}
      <section className="relative z-10" style={{ padding: '100px 24px 40px' }}>
        <DataLakeParticles />

        <motion.div className="max-w-6xl mx-auto text-center" style={{ y: headerY, opacity: headerOpacity }}>
          {/* Badge */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EXPO }}
          >
            <Database size={14} color={A} />
            <span style={{ fontFamily: TELE, fontSize: 10, color: A, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
              Operation: Miles One Analytics
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
              Product Data
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              style={{ fontFamily: SWISS, fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.04em', lineHeight: 1.0 }}
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, ease: EXPO, delay: 0.35 }}
            >
              Unification
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            style={{ fontFamily: SWISS, fontSize: 'clamp(15px, 1.8vw, 19px)', fontWeight: 300, color: '#D1D5DB', maxWidth: 700, margin: '24px auto 0', lineHeight: 1.6 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EXPO, delay: 0.5 }}
          >
            Solving Cross-Platform Attribution Blindness through BigQuery, Firebase, and Appsflyer
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

        {/* Funnel Diagram */}
        <motion.div
          className="max-w-5xl mx-auto mt-12"
          style={{
            background: 'rgba(5,5,5,0.7)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: 18,
            padding: '32px 16px',
            backdropFilter: 'blur(16px)',
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EXPO, delay: 0.3 }}
        >
          <p style={{ fontFamily: TELE, fontSize: 9, color: '#9CA3AF', letterSpacing: '0.3em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 16 }}>
            Data Lake Architecture &middot; Hover to trace attribution flow
          </p>
          <FunnelDiagram />
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
              User journeys fragmented across web (<strong style={{ color: '#FFFFFF', fontWeight: 600 }}>GA4</strong>), mobile (<strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Firebase</strong>), and paid (<strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Appsflyer</strong>). Teams couldn't track a single user from desktop ad click to mobile module completion. The <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>miles_uuid</strong> was injected into every event payload, enabling a simple SQL JOIN to see the full path: Ad Click &rarr; Install &rarr; Login &rarr; Engagement.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════ SPLIT VIEW: PROBLEM / SOLUTION ════ */}
      <section className="relative z-10" style={{ padding: '40px 24px 80px' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <SplitPanel side="left" title="The Problem: Analytics Silo" tagColor="#ef4444" delay={0}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                'GA4 sees web clicks but loses users at app install',
                'Firebase tracks in-app behavior, blind to acquisition source',
                'Appsflyer records install attribution, can\'t see engagement',
                'CRM has lead status, disconnected from product telemetry',
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <span style={{ fontFamily: TELE, fontSize: 11, color: '#ef4444', flexShrink: 0, marginTop: 2 }}>&#x2717;</span>
                  <span style={{ fontFamily: SWISS, fontSize: 14, fontWeight: 300, color: '#E5E7EB', lineHeight: 1.6 }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </SplitPanel>

          <SplitPanel side="right" title="The Solution: Unified Pipeline" tagColor={A} delay={0.2}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                'miles_uuid injected into every GA4, Firebase, and Appsflyer event',
                'BigQuery as single source of truth — all streams converge',
                'Simple SQL JOIN reconstructs full user journey end-to-end',
                'CRM enriched with product behavior before sales call',
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <span style={{ fontFamily: TELE, fontSize: 11, color: A, flexShrink: 0, marginTop: 2 }}>&#x2713;</span>
                  <span style={{ fontFamily: SWISS, fontSize: 14, fontWeight: 300, color: '#E5E7EB', lineHeight: 1.6 }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </SplitPanel>
        </div>
      </section>

      {/* ════ KEY SECTIONS ════ */}
      <section className="relative z-10" style={{ padding: '60px 24px 80px' }}>
        <div className="max-w-5xl mx-auto">
          <motion.p
            className="text-center mb-14"
            style={{ fontFamily: TELE, fontSize: 10, color: '#D1D5DB', letterSpacing: '0.35em', textTransform: 'uppercase' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            [ Execution Protocols ]
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard
              phase="Architecture"
              title="BigQuery Data Lake"
              body="All three analytics platforms — GA4, Firebase, and Appsflyer — stream raw events into BigQuery via scheduled exports and real-time streaming inserts. BigQuery serves as the canonical data lake, with partitioned tables optimized for time-range queries across millions of daily events."
              delay={0}
            />
            <SectionCard
              phase="Identity"
              title='The "Glue" Identifier: miles_uuid'
              body="A deterministic UUID generated at first identity resolution (SSO login, form submission, or device fingerprint match). This miles_uuid is injected into the custom_dimensions of GA4, the user_properties of Firebase, and the customer_user_id of Appsflyer — creating a single join key across all three platforms."
              delay={0.1}
            />
            <SectionCard
              phase="Forensics"
              title='The "Leaking Bucket" Analysis'
              body="By joining web acquisition events (GA4) against app login events (Firebase) using miles_uuid, we discovered that 35% of web leads never logged into the app. The drop-off happened between 'app install' and 'first login' — a credential-friction gap that was invisible without cross-platform identity."
              delay={0.2}
            />
            <SectionCard
              phase="Solution"
              title="Smart Deep-Linking"
              body="Implemented deferred deep links that carry the miles_uuid through the install flow. When a user clicks a web CTA, the deep link preserves their identity and intent — landing them directly on the relevant module in the app, already authenticated, bypassing the login wall entirely."
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
              value="100%"
              label="Cross-Platform Unification"
              percent={100}
              delay={0}
              sublabel="Every user event across GA4, Firebase, and Appsflyer is now stitchable via miles_uuid. Zero blind spots in the attribution chain."
            />
            <MetricBar
              value="+15%"
              label="CPA Conversion"
              percent={78}
              delay={0.15}
              sublabel="Deep-linking and identity persistence eliminated the install-to-login chasm, converting previously lost leads into active app users."
            />
            <MetricBar
              value="-25%"
              label="Login Abandonment"
              percent={82}
              delay={0.3}
              sublabel="Smart deep links bypassed the credential-friction wall, carrying users directly into authenticated app sessions post-install."
            />
            <MetricBar
              value="+18%"
              label="Lead-to-App-Active"
              percent={75}
              delay={0.45}
              sublabel="The unified pipeline enabled behavior-triggered nudges that activated dormant leads who had installed but never engaged."
            />
          </div>
        </div>
      </section>

      {/* ════ NAV FOOTER ════ */}
      <section className="relative z-10" style={{ padding: '40px 24px 120px', textAlign: 'center' }}>
        <div style={{ width: 40, height: 1, background: `${A}40`, margin: '0 auto 32px' }} />
        <Link
          to="/cases/ott-product-forensics"
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
          Next: Masterclass Analytics <ArrowRight size={14} />
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

export default CaseAnalytics;
