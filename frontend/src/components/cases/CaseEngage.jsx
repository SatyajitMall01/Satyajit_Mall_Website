import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useInView, AnimatePresence } from 'framer-motion';
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
  const inView = useInView(ref, { once: true, margin: '-15%' });
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

  return <span ref={ref}>{isNaN(numericPart) ? value : count}{suffix}</span>;
};

/* ══════════════════════════════════════════
   PARTICLE FIELD
   ══════════════════════════════════════════ */
const ParticleField = () => {
  const particles = useRef(
    Array.from({ length: 45 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 22 + 14,
      delay: Math.random() * 6,
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
            background: i % 5 === 0 ? A : 'rgba(255,255,255,0.10)',
          }}
          animate={{ y: [0, -20, 0], opacity: [0, 0.4, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════
   SCROLLING TERMINAL — buffer/retry logic
   ══════════════════════════════════════════ */
const TERMINAL_LINES = [
  { prefix: '>', text: 'engage.buffer.init() — 2000ms attribution hold...', color: A },
  { prefix: '$', text: 'CHECKING: document.cookie for _fbp, _fbc, gclid...', color: '#f59e0b' },
  { prefix: '!', text: 'WARN: CID not found — initiating retry loop (1/3)', color: '#ef4444' },
  { prefix: '$', text: 'navigator.fingerprint.hash() → fp_9a3f2d...', color: '#f59e0b' },
  { prefix: '→', text: 'CROSS-REF: Miles One Registry — IP + Fingerprint match', color: '#E5E7EB' },
  { prefix: '✓', text: 'RECOVERED: source=Meta_CPA_Campaign_Q4, adset_id=120392', color: A },
  { prefix: '→', text: 'PATCHING: CRM record LEAD_44821 — source updated', color: '#E5E7EB' },
  { prefix: '✓', text: 'LINEAR + TIME_DECAY model applied — 4 touchpoints scored', color: A },
  { prefix: '$', text: 'anti_ghost.trigger() — retroactive session scrape...', color: '#f59e0b' },
  { prefix: '✓', text: 'ATTRIBUTION COMPLETE — CRM-Ad alignment: 100%', color: A },
];

const ScrollTerminal = () => {
  const [visibleLines, setVisibleLines] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= TERMINAL_LINES.length) { clearInterval(id); return prev; }
        return prev + 1;
      });
    }, 500);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <div ref={ref} style={{
      background: 'rgba(0,0,0,0.6)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12,
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)',
        flexShrink: 0,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
        <span style={{ fontFamily: TELE, fontSize: 9, color: '#9CA3AF', letterSpacing: '0.1em', marginLeft: 8 }}>
          attribution_engine.sh
        </span>
      </div>
      {/* Lines */}
      <div style={{ padding: '14px 16px', overflowY: 'auto', flex: 1 }}>
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: 6, display: 'flex', gap: 8 }}
          >
            <span style={{ fontFamily: TELE, fontSize: 11, color: line.color, flexShrink: 0 }}>{line.prefix}</span>
            <span style={{ fontFamily: TELE, fontSize: 11, color: line.color === '#E5E7EB' ? '#E5E7EB' : line.color, opacity: 0.9 }}>{line.text}</span>
          </motion.div>
        ))}
        {visibleLines < TERMINAL_LINES.length && inView && (
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

/* ══════════════════════════════════════════
   ATTRIBUTION MODEL VISUALIZATION SVG
   ══════════════════════════════════════════ */
const AttributionViz = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const [hoveredNode, setHoveredNode] = useState(null);

  const touchpoints = [
    { x: 60, y: 140, label: 'Meta Ad Click', weight: 0.15 },
    { x: 160, y: 80, label: 'Webinar View', weight: 0.20 },
    { x: 260, y: 120, label: 'Email Open', weight: 0.25 },
    { x: 360, y: 60, label: 'Retarget Click', weight: 0.40 },
  ];

  const purchaseX = 440;
  const purchaseY = 100;

  return (
    <div ref={ref} style={{
      background: 'rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12,
      padding: '20px 16px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <span style={{
        fontFamily: TELE, fontSize: 9, color: '#9CA3AF',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        marginBottom: 12, display: 'block', textAlign: 'center',
      }}>
        Linear + Time-Decay Model
      </span>
      <svg viewBox="0 0 500 180" className="w-full" style={{ flex: 1, minHeight: 140 }}>
        <defs>
          <filter id="eng-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="eng-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={A} stopOpacity="0.1" />
            <stop offset="100%" stopColor={A} stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Background gradient bar showing time-decay */}
        <motion.rect
          x={40} y={155} width={420} height={4} rx={2}
          fill="url(#eng-fade)"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, ease: EXPO }}
          style={{ transformOrigin: '40px 157px' }}
        />
        <text x={40} y={175} fill="#9CA3AF" style={{ fontFamily: TELE, fontSize: 7 }}>TIME</text>
        <text x={430} y={175} fill={A} style={{ fontFamily: TELE, fontSize: 7 }}>PURCHASE</text>

        {/* Edges from touchpoints to purchase */}
        {touchpoints.map((tp, i) => (
          <motion.line
            key={`edge-${i}`}
            x1={tp.x} y1={tp.y} x2={purchaseX} y2={purchaseY}
            stroke={hoveredNode === i ? A : `${A}30`}
            strokeWidth={hoveredNode === i ? 2 : 1}
            strokeDasharray={hoveredNode === i ? 'none' : '3 3'}
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1, delay: 0.3 + i * 0.2, ease: EXPO }}
          />
        ))}

        {/* Touchpoint nodes */}
        {touchpoints.map((tp, i) => {
          const isHovered = hoveredNode === i;
          const radius = 4 + tp.weight * 14;
          return (
            <motion.g
              key={i}
              onMouseEnter={() => setHoveredNode(i)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer' }}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15, type: 'spring', stiffness: 120 }}
            >
              {/* Pulse ring */}
              {isHovered && (
                <motion.circle
                  cx={tp.x} cy={tp.y} r={radius}
                  fill="none" stroke={A} strokeWidth={0.5}
                  animate={{ r: [radius, radius + 15, radius + 25], opacity: [0.6, 0.2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <circle
                cx={tp.x} cy={tp.y} r={radius}
                fill={isHovered ? `${A}30` : `${A}15`}
                stroke={isHovered ? A : `${A}50`}
                strokeWidth={isHovered ? 2 : 1}
                filter={isHovered ? 'url(#eng-glow)' : undefined}
              />
              <text
                x={tp.x} y={tp.y - radius - 8}
                textAnchor="middle" fill={isHovered ? '#FFFFFF' : '#E5E7EB'}
                style={{ fontFamily: TELE, fontSize: 7, transition: 'fill 0.3s' }}
              >
                {tp.label}
              </text>
              <text
                x={tp.x} y={tp.y + 4}
                textAnchor="middle" fill={isHovered ? '#FFFFFF' : A}
                style={{ fontFamily: SWISS, fontSize: 9, fontWeight: 700 }}
              >
                {Math.round(tp.weight * 100)}%
              </text>
            </motion.g>
          );
        })}

        {/* Purchase node */}
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 1, type: 'spring', stiffness: 200 }}
        >
          <motion.circle
            cx={purchaseX} cy={purchaseY} r={16}
            fill={`${A}20`} stroke={A} strokeWidth={2}
            animate={{ boxShadow: [`0 0 0px ${A}`, `0 0 20px ${A}`, `0 0 0px ${A}`] }}
          />
          <motion.circle
            cx={purchaseX} cy={purchaseY} r={0}
            fill="none" stroke={A} strokeWidth={0.5}
            animate={{ r: [16, 30, 40], opacity: [0.5, 0.15, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <text x={purchaseX} y={purchaseY + 4} textAnchor="middle" fill="#FFFFFF" style={{ fontFamily: TELE, fontSize: 7, fontWeight: 700 }}>
            CONV
          </text>
        </motion.g>
      </svg>
    </div>
  );
};

/* ══════════════════════════════════════════
   BENTO CARD — glassmorphic
   ══════════════════════════════════════════ */
const BentoCard = ({ tag, title, body, delay = 0, span = 1, children }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: EXPO, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridColumn: span > 1 ? `span ${span}` : undefined,
        background: hovered ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.015)',
        border: `1px solid ${hovered ? A + '40' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 16,
        padding: children ? 0 : '28px 24px',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: hovered ? `0 8px 40px ${A}12, inset 0 1px 0 ${A}15` : 'none',
      }}
    >
      {/* Accent top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 2,
        background: `linear-gradient(to right, transparent, ${A}50, transparent)`,
        opacity: hovered ? 1 : 0.3,
        transition: 'opacity 0.4s',
      }} />

      {children ? children : (
        <>
          <span style={{
            fontFamily: TELE, fontSize: 9, color: A,
            letterSpacing: '0.35em', textTransform: 'uppercase',
            display: 'block', marginBottom: 12,
          }}>
            {tag}
          </span>
          <h3 style={{
            fontFamily: SWISS, fontSize: 19, fontWeight: 700,
            color: '#FFFFFF', lineHeight: 1.2, marginBottom: 12,
          }}>
            {title}
          </h3>
          <p style={{
            fontFamily: SWISS, fontSize: 14, fontWeight: 300,
            color: '#E5E7EB', lineHeight: 1.85,
          }}>
            {body}
          </p>
        </>
      )}

      {/* Glow orb */}
      <motion.div
        style={{
          position: 'absolute', bottom: -30, right: -30,
          width: 120, height: 120, borderRadius: '50%',
          background: `radial-gradient(circle, ${A}15 0%, transparent 70%)`,
          filter: 'blur(20px)', pointerEvents: 'none', zIndex: 0,
        }}
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1.2 : 0.8 }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   METRIC PILL
   ══════════════════════════════════════════ */
const MetricPill = ({ value, suffix, label, delay = 0 }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: EXPO, delay }}
      whileHover={{ scale: 1.03 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? A + '50' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 12,
        padding: '20px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: hovered ? `0 4px 30px ${A}15` : 'none',
      }}
    >
      <span style={{
        fontFamily: SWISS, fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 800,
        color: '#FFFFFF', letterSpacing: '-0.03em', display: 'block', lineHeight: 1,
      }}>
        <Counter value={value} suffix={suffix} />
      </span>
      <span style={{
        fontFamily: TELE, fontSize: 9, color: A,
        letterSpacing: '0.25em', textTransform: 'uppercase',
        marginTop: 8, display: 'block',
      }}>
        {label}
      </span>

      {/* Animated progress line */}
      <motion.div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(to right, ${A}80, ${A}20)`,
          transformOrigin: 'left',
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: EXPO, delay: delay + 0.3 }}
      />
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   NETWORK GRAPH — attribution paths
   ══════════════════════════════════════════ */
const NetworkBackground = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const nodes = useRef(
    Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
    }))
  ).current;

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.3 }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {nodes.map((n, i) => {
          const next = nodes[(i + 1) % nodes.length];
          return (
            <motion.line
              key={i}
              x1={n.x} y1={n.y} x2={next.x} y2={next.y}
              stroke={`${A}20`} strokeWidth={0.1}
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 2, delay: i * 0.1 }}
            />
          );
        })}
        {nodes.map((n, i) => (
          <motion.circle
            key={`n-${i}`}
            cx={n.x} cy={n.y} r={n.size * 0.15}
            fill={i % 3 === 0 ? A : 'rgba(255,255,255,0.2)'}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: [0, 0.6, 0.3] } : {}}
            transition={{ duration: 3, delay: i * 0.15, repeat: Infinity, repeatType: 'reverse' }}
          />
        ))}
      </svg>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
const CaseEngage = () => {
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
        <ParticleField />
        <NetworkBackground />

        <motion.div className="max-w-6xl mx-auto text-center" style={{ y: headerY, opacity: headerOpacity }}>
          {/* Badge */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EXPO }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: A, boxShadow: `0 0 10px ${A}` }} />
            <span style={{ fontFamily: TELE, fontSize: 10, color: A, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
              Operation: Miles Engage
            </span>
          </motion.div>

          {/* Title */}
          <div className="overflow-hidden">
            <motion.h1
              style={{
                fontFamily: SWISS, fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700,
                color: '#FFFFFF', letterSpacing: '-0.04em', lineHeight: 1.0,
              }}
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, ease: EXPO, delay: 0.2 }}
            >
              The Attribution
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              style={{
                fontFamily: SWISS, fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700,
                color: '#FFFFFF', letterSpacing: '-0.04em', lineHeight: 1.0,
              }}
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, ease: EXPO, delay: 0.35 }}
            >
              Recovery Engine
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            style={{
              fontFamily: SWISS, fontSize: 'clamp(15px, 1.8vw, 19px)', fontWeight: 300,
              color: '#D1D5DB', maxWidth: 700, margin: '24px auto 0', lineHeight: 1.6,
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EXPO, delay: 0.5 }}
          >
            Resolving the "Meta Mirage" through Deterministic Lead Tagging and n8n Orchestration
          </motion.p>

          {/* Scroll hint */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <svg width="20" height="20" viewBox="0 0 20 20" style={{ margin: '0 auto' }}>
                <motion.path d="M4 8 L10 14 L16 8" stroke="#9CA3AF" fill="none" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </motion.div>
          </motion.div>
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
              Miles Education encountered a systemic failure where <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>~$12,000/month in Meta ad spend</strong> was misattributed. Due to race conditions on slow mobile networks, high-intent leads were tagged as "Organic" in the CRM.
            </p>
            <p style={{ fontFamily: SWISS, fontSize: 17, fontWeight: 300, color: '#E5E7EB', lineHeight: 1.85, marginTop: 20 }}>
              The solution: a proprietary <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Attribution Recovery Engine</strong> with a 2-second buffer, recursive retry loops, and a custom <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Linear + Time-Decay attribution model</strong>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════ METRICS PILLS ════ */}
      <section className="relative z-10" style={{ padding: '0 24px 60px' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricPill value="20" suffix="%" label="ROAS Lift" delay={0} />
          <MetricPill value="4000" suffix="+" label="Ghost Leads Recovered" delay={0.1} />
          <MetricPill value="12" suffix="K" label="/mo Spend Corrected" delay={0.2} />
          <MetricPill value="100" suffix="%" label="CRM-Ad Alignment" delay={0.3} />
        </div>
      </section>

      {/* ════ BENTO GRID ════ */}
      <section className="relative z-10" style={{ padding: '40px 24px 80px' }}>
        <div className="max-w-6xl mx-auto">
          <motion.p
            className="text-center mb-14"
            style={{ fontFamily: TELE, fontSize: 10, color: '#D1D5DB', letterSpacing: '0.35em', textTransform: 'uppercase' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            [ The Command Console ]
          </motion.p>

          {/* Row 1: Terminal (large) + Buffer card */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-5">
            <div className="md:col-span-3" style={{ minHeight: 360 }}>
              <BentoCard delay={0} span={1}>
                <ScrollTerminal />
              </BentoCard>
            </div>
            <div className="md:col-span-2">
              <BentoCard
                tag="Protocol 01"
                title="The 2-Second Buffer"
                body="Form-backend holds lead data 2000ms while client-side aggressively checks for tracking cookies and Click IDs. Patches the record before final CRM transmission. This tiny delay recovers attribution for leads on slow mobile networks where cookies load after form submit."
                delay={0.1}
              />
            </div>
          </div>

          {/* Row 2: Retry + Attribution Viz */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-5">
            <div className="md:col-span-2">
              <BentoCard
                tag="Protocol 02"
                title="Recursive Retry Loop"
                body="n8n cross-references User IP and Fingerprint against Miles One Registry for existing attribution history. If a match is found, the historical source is grafted onto the new lead. Up to 3 retry cycles before falling back to session scraping."
                delay={0.15}
              />
            </div>
            <div className="md:col-span-3" style={{ minHeight: 300 }}>
              <BentoCard delay={0.2} span={1}>
                <div style={{ padding: '0' }}>
                  <AttributionViz />
                </div>
              </BentoCard>
            </div>
          </div>

          {/* Row 3: two equal cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <BentoCard
              tag="Protocol 03"
              title="Linear + Time-Decay Model"
              body="Every touchpoint gets equal credit (linear) weighted by proximity to purchase (time-decay). Prevents channel cannibalization by ensuring the last click doesn't steal all attribution from awareness-stage touches."
              delay={0.25}
            />
            <BentoCard
              tag="Protocol 04"
              title="Anti-Ghost Trigger"
              body="If a lead arrives in CRM without source, an n8n sub-workflow scrapes historical web sessions in PostgreSQL to retroactively assign attribution. Ghost leads are automatically flagged, enriched, and re-routed to the correct campaign bucket."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ════ NAV FOOTER ════ */}
      <section className="relative z-10" style={{ padding: '40px 24px 120px', textAlign: 'center' }}>
        <div style={{ width: 40, height: 1, background: `${A}40`, margin: '0 auto 32px' }} />
        <Link
          to="/cases/agentic-voice-qualification"
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
          Next: Superbot AI <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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

export default CaseEngage;
