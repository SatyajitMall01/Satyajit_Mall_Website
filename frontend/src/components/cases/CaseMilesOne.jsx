import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { Database, ShieldCheck, Filter, Zap, ArrowRight, Terminal, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const TELE  = "'Courier New', Courier, monospace";
const EXPO  = [0.16, 1, 0.3, 1];
const A     = '#dc2626';

/* ══════════════════════════════════════════
   ANIMATED TYPING EFFECT
   ══════════════════════════════════════════ */
const TypeWriter = ({ text, delay = 0, speed = 25 }) => {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      const id = setInterval(() => {
        setN(prev => { if (prev >= text.length) { clearInterval(id); return prev; } return prev + 1; });
      }, speed);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(t);
  }, [inView, text, delay, speed]);

  return (
    <span ref={ref}>
      {text.slice(0, n)}
      {n < text.length && inView && <span style={{ opacity: 0.5 }}>&#9646;</span>}
    </span>
  );
};

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
    let start = 0;
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
   PARTICLE FIELD (Hero background)
   ══════════════════════════════════════════ */
const ParticleField = () => {
  const particles = useRef(
    Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size, height: p.size,
            left: `${p.x}%`, top: `${p.y}%`,
            background: i % 5 === 0 ? A : 'rgba(255,255,255,0.15)',
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════
   INTERACTIVE NODE NETWORK (Hero SVG)
   ══════════════════════════════════════════ */
const NODES = [
  { id: 'GTM',     x: 100, y: 90,  label: 'GTM Entry Gates',       sub: 'Webinars · Events · D2C', icon: '◆' },
  { id: 'SSO',     x: 400, y: 50,  label: 'SSO Entry Layer',       sub: 'IdP · Context Tokens', icon: '◈' },
  { id: 'PG',      x: 700, y: 90,  label: 'PostgreSQL Registry',   sub: 'UUID · Phone · Fingerprint', icon: '⬡' },
  { id: 'DEDUPE',  x: 220, y: 250, label: 'Source-Level Dedupe',   sub: 'Clean before CRM', icon: '◇' },
  { id: 'VALIDATE',x: 580, y: 250, label: 'Sync Validation',       sub: 'Identity ≻ Activity', icon: '⊡' },
  { id: 'CRM',     x: 400, y: 380, label: 'CRM / Sales Floor',     sub: 'Pre-attached histories', icon: '◎' },
];
const EDGES = [
  ['GTM','SSO'], ['SSO','PG'], ['GTM','DEDUPE'], ['PG','VALIDATE'],
  ['DEDUPE','VALIDATE'], ['VALIDATE','CRM'], ['SSO','DEDUPE'], ['SSO','VALIDATE'],
];

const AnimatedPulse = ({ cx, cy, color, delay = 0 }) => (
  <motion.circle
    cx={cx} cy={cy} r={0}
    fill="none" stroke={color} strokeWidth={0.5}
    animate={{ r: [0, 40, 60], opacity: [0.6, 0.2, 0] }}
    transition={{ duration: 3, delay, repeat: Infinity, ease: 'easeOut' }}
  />
);

const DataPacket = ({ x1, y1, x2, y2, delay = 0, color }) => {
  const dx = x2 - x1, dy = y2 - y1;
  return (
    <motion.circle
      r={2} fill={color}
      initial={{ cx: x1, cy: y1, opacity: 0 }}
      animate={{ cx: [x1, x1 + dx * 0.5, x2], cy: [y1, y1 + dy * 0.5, y2], opacity: [0, 1, 0] }}
      transition={{ duration: 2.5, delay, repeat: Infinity, ease: 'easeInOut' }}
      style={{ filter: `drop-shadow(0 0 4px ${color})` }}
    />
  );
};

const NodeNetwork = () => {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  return (
    <svg viewBox="0 0 800 440" className="w-full" style={{ maxWidth: 960, margin: '0 auto' }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={A} stopOpacity="0.2" />
          <stop offset="100%" stopColor={A} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Grid pattern */}
      {Array.from({ length: 20 }).map((_, i) => (
        <line key={`g${i}`} x1={i * 40} y1={0} x2={i * 40} y2={440} stroke="rgba(255,255,255,0.015)" />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 40} x2={800} y2={i * 40} stroke="rgba(255,255,255,0.015)" />
      ))}

      {/* Edges with animated data packets */}
      {EDGES.map(([a, b], i) => {
        const from = NODES.find(n => n.id === a);
        const to = NODES.find(n => n.id === b);
        const active = hovered === a || hovered === b || selected === a || selected === b;
        return (
          <g key={i}>
            <motion.line
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke={active ? A : 'rgba(255,255,255,0.05)'}
              strokeWidth={active ? 1.5 : 0.6}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: EXPO }}
            />
            {active && (
              <DataPacket x1={from.x} y1={from.y} x2={to.x} y2={to.y} delay={i * 0.4} color={A} />
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {NODES.map((node, i) => {
        const active = hovered === node.id || selected === node.id;
        return (
          <motion.g
            key={node.id}
            onMouseEnter={() => setHovered(node.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setSelected(s => s === node.id ? null : node.id)}
            style={{ cursor: 'pointer' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.15, type: 'spring', stiffness: 100 }}
          >
            {/* Pulse rings */}
            {active && <AnimatedPulse cx={node.x} cy={node.y} color={A} delay={0} />}
            {active && <AnimatedPulse cx={node.x} cy={node.y} color={A} delay={1} />}

            {/* Glow background */}
            <motion.circle
              cx={node.x} cy={node.y} r={active ? 50 : 30}
              fill="url(#nodeGlow)"
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Outer hex-ring */}
            <motion.circle
              cx={node.x} cy={node.y}
              r={active ? 10 : 7}
              fill={active ? `${A}20` : 'rgba(255,255,255,0.02)'}
              stroke={active ? A : 'rgba(255,255,255,0.12)'}
              strokeWidth={active ? 2 : 1}
              animate={{ r: active ? 10 : 7 }}
              transition={{ type: 'spring', stiffness: 200 }}
            />

            {/* Center dot */}
            <motion.circle
              cx={node.x} cy={node.y} r={3}
              fill={active ? A : 'rgba(255,255,255,0.3)'}
              animate={{ fill: active ? A : 'rgba(255,255,255,0.3)' }}
              filter={active ? 'url(#glow)' : undefined}
            />

            {/* Label */}
            <motion.text
              x={node.x} y={node.y - 22}
              textAnchor="middle"
              fill={active ? '#FFFFFF' : '#D1D5DB'}
              style={{ fontFamily: SWISS, fontSize: 11, fontWeight: 600, transition: 'fill 0.3s' }}
            >
              {node.label}
            </motion.text>

            {/* Sub-label */}
            <text
              x={node.x} y={node.y + 26}
              textAnchor="middle"
              fill={active ? '#E5E7EB' : '#9CA3AF'}
              style={{ fontFamily: TELE, fontSize: 8, letterSpacing: '0.08em', transition: 'fill 0.3s' }}
            >
              {node.sub}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
};

/* ══════════════════════════════════════════
   PROTOCOL CARD (Execution phases)
   ══════════════════════════════════════════ */
const ICONS_MAP = { Database, ShieldCheck, Filter, Zap };

const ProtocolCard = ({ phase, icon, title, body, delay = 0 }) => {
  const [expanded, setExpanded] = useState(false);
  const IconComp = ICONS_MAP[icon] || Database;

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
      {/* Accent top border */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${A}40, transparent)` }} />

      {/* Phase tag */}
      <div className="flex items-center justify-between mb-4">
        <span style={{ fontFamily: TELE, fontSize: 9, color: A, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          Phase {phase}
        </span>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={14} color="#9CA3AF" />
        </motion.div>
      </div>

      {/* Icon + Title */}
      <div className="flex items-center gap-3 mb-3">
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `${A}10`, border: `1px solid ${A}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconComp size={20} color={A} strokeWidth={1.5} />
        </div>
        <h3 style={{ fontFamily: SWISS, fontSize: 17, fontWeight: 700, color: '#FFFFFF' }}>{title}</h3>
      </div>

      {/* Preview / Expanded body */}
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
   METRIC WITH ANIMATED PROGRESS BAR
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
      {/* Animated bar */}
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

/* ══════════════════════════════════════════
   LIVE TERMINAL EMULATOR
   ══════════════════════════════════════════ */
const TerminalLines = [
  { prefix: '>', text: 'miles_one.init() — minting identity genesis block...', color: A },
  { prefix: '$', text: 'UUID minted: uuid_4a8f2c — device fingerprint locked', color: '#10b981' },
  { prefix: '→', text: 'Phase 1: Hook — user entered Dummy LMS sandbox', color: '#f59e0b' },
  { prefix: '✓', text: 'AI-in-Accounting module: 50% completion detected', color: '#10b981' },
  { prefix: '→', text: 'Phase 2: Nudge — "Book a Mentorship" webhook fired to CRM', color: '#f59e0b' },
  { prefix: '✓', text: 'Pre-heated lead routed to sales floor in 12ms', color: '#10b981' },
];

const LiveTerminal = () => {
  const [visibleLines, setVisibleLines] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30%' });

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= TerminalLines.length) { clearInterval(id); return prev; }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <div ref={ref} style={{
      background: 'rgba(0,0,0,0.5)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
        <span style={{ fontFamily: TELE, fontSize: 9, color: '#9CA3AF', letterSpacing: '0.1em', marginLeft: 8 }}>
          miles_one_registry.sh
        </span>
      </div>
      {/* Lines */}
      <div style={{ padding: '16px 20px', minHeight: 200 }}>
        {TerminalLines.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: 8, display: 'flex', gap: 8 }}
          >
            <span style={{ fontFamily: TELE, fontSize: 12, color: line.color, flexShrink: 0 }}>{line.prefix}</span>
            <span style={{ fontFamily: TELE, fontSize: 12, color: line.color === '#E5E7EB' ? '#E5E7EB' : line.color, opacity: 0.9 }}>{line.text}</span>
          </motion.div>
        ))}
        {visibleLines < TerminalLines.length && inView && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{ fontFamily: TELE, fontSize: 12, color: A }}
          >
            ▌
          </motion.span>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
const CaseMilesOne = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const headerY = useTransform(smoothProgress, [0, 0.15], [0, -60]);
  const headerOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);

  return (
    <div className="relative w-full" style={{ background: '#050505' }}>

      {/* Ambient ombre */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `radial-gradient(ellipse 120% 70% at 50% 10%, ${A}12 0%, transparent 50%), radial-gradient(ellipse 80% 100% at 0% 80%, ${A}08 0%, transparent 50%)`
      }} />

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50"
        style={{ height: 2, background: A, scaleX: smoothProgress, transformOrigin: '0%' }}
      />

      {/* ════ HERO ════ */}
      <section className="relative z-10" style={{ padding: '100px 24px 40px' }}>
        <ParticleField />

        <motion.div className="max-w-6xl mx-auto text-center" style={{ y: headerY, opacity: headerOpacity }}>
          {/* Badge */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EXPO }}
          >
            <Terminal size={14} color={A} />
            <span style={{ fontFamily: TELE, fontSize: 10, color: A, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
              Case 01 &middot; Miles Education
            </span>
          </motion.div>

          {/* Title with stagger */}
          <div className="overflow-hidden">
            <motion.h1
              style={{ fontFamily: SWISS, fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.04em', lineHeight: 1.0 }}
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, ease: EXPO, delay: 0.2 }}
            >
              The Universal GTM
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              style={{ fontFamily: SWISS, fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.04em', lineHeight: 1.0 }}
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, ease: EXPO, delay: 0.35 }}
            >
              Identity Registry
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            style={{ fontFamily: SWISS, fontSize: 'clamp(15px, 1.8vw, 19px)', fontWeight: 300, color: '#D1D5DB', maxWidth: 640, margin: '24px auto 0', lineHeight: 1.6 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EXPO, delay: 0.5 }}
          >
            Disrupting the Trust-Gap through Product-Led Growth and Deterministic Identity. ₹40 Cr+ ecosystem. 25% sales from product.
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

        {/* Interactive Node Network */}
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
            Interactive Architecture &middot; Hover nodes to trace data flow
          </p>
          <NodeNetwork />
        </motion.div>
      </section>

      {/* ════ STRATEGIC INTENT ════ */}
      <section className="relative z-10" style={{ padding: '80px 24px' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Label */}
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
          {/* Content */}
          <motion.div
            className="md:col-span-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EXPO }}
          >
            <p style={{ fontFamily: SWISS, fontSize: 17, fontWeight: 300, color: '#E5E7EB', lineHeight: 1.85 }}>
              Miles Education faced a systemic <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Time-to-Value Trust Deficit</strong>. Potential learners entering through traditional digital ads were forced into a manual sales 'Black Hole' — a period of high-friction where they waited for human contact to experience the product's actual value. This latency resulted in high early-stage abandonment and fragmented user data.
            </p>
            <p style={{ fontFamily: SWISS, fontSize: 17, fontWeight: 300, color: '#E5E7EB', lineHeight: 1.85, marginTop: 20 }}>
              The solution: the 0-1 launch of the <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Miles One mobile app</strong> — a Trust-Validation engine designed to provide immediate, tangible value through a 'Dummy LMS' experience. By architecting a Multi-Stage Lifecycle Engine, the app transitioned users from anonymous prospects to high-intent 'Pre-heated' leads through deterministic state changes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════ LIVE TERMINAL ════ */}
      <section className="relative z-10" style={{ padding: '40px 24px 80px' }}>
        <div className="max-w-3xl mx-auto">
          <LiveTerminal />
        </div>
      </section>

      {/* ════ EXECUTION PROTOCOLS ════ */}
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
            <ProtocolCard phase="01" icon="Database" title="Deterministic Identity Minting"
              body="The CRM was barred from being the primary creator of users. The exact millisecond an anonymous device interacted with Miles One, our backend minted an immutable UUID — the master key traveling downstream to the CRM, the production LMS, and marketing automation. This physically prevented Duplicate Lead Noise."
              delay={0} />
            <ProtocolCard phase="02" icon="ShieldCheck" title="The Hook — Pre-sale Sandbox"
              body="Access to high-value Masterclass content and AI-in-Accounting micro-lessons. This Dummy LMS provided immediate value and established institutional authority, letting users experience the pedagogy before a single word was spoken by a sales representative."
              delay={0.1} />
            <ProtocolCard phase="03" icon="Filter" title="The Nudge — Conversion Bridge"
              body="Strategic high-intent friction points — specifically the 'Book a Mentorship' feature — fired deterministic webhooks into the CRM, notifying sales that a Pre-heated lead was ready for closure. Sales reps could see the exact journey the user took before the first call."
              delay={0.2} />
            <ProtocolCard phase="04" icon="Zap" title="The Transition — Seamless Swap"
              body="Upon payment, the app listened for a Success webhook from the payment gateway. It seamlessly swapped the Dummy content for the full, high-production certification environment — without requiring the user to download a new app or re-authenticate."
              delay={0.3} />
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
            <MetricBar value="₹40 Cr+" label="Ecosystem Revenue" percent={92} delay={0}
              sublabel="Managed a product ecosystem supporting over ₹40 Cr+ in annual revenue, with 25% of all sales attributed directly to the Miles One app." />
            <MetricBar value="45%" label="Downstream Influence" percent={85} delay={0.15}
              sublabel="Contributed as a major downstream push for 45% of all converted leads company-wide through behavioral webhooks and pre-heated lead routing." />
            <MetricBar value="−10%" label="Day 0-7 Churn" percent={65} delay={0.3}
              sublabel="Reduced early-stage churn by 10% via an instant-value onboarding flow that eliminated the Time-to-Value Trust Deficit." />
            <MetricBar value="25%" label="Product-Led Sales" percent={72} delay={0.45}
              sublabel="One quarter of all sales attributed directly to the app. Sales reps received leads with pre-attached identity histories, enabling data-backed counseling." />
          </div>
        </div>
      </section>

      {/* ════ NAV FOOTER ════ */}
      <section className="relative z-10" style={{ padding: '40px 24px 120px', textAlign: 'center' }}>
        <div style={{ width: 40, height: 1, background: `${A}40`, margin: '0 auto 32px' }} />
        <Link
          to="/cases/behavioral-ott-architecture"
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
          Next: Miles Masterclass <ArrowRight size={14} />
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

export default CaseMilesOne;
