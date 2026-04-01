import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useSpring, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const TELE  = "'Courier New', Courier, monospace";
const EXPO  = [0.16, 1, 0.3, 1];
const A     = '#8b5cf6';

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
   AUDIO WAVEFORM — animated hero SVG
   ══════════════════════════════════════════ */
const AudioWaveform = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const barCount = 64;

  const bars = useMemo(() =>
    Array.from({ length: barCount }, (_, i) => {
      const center = barCount / 2;
      const distFromCenter = Math.abs(i - center) / center;
      const baseHeight = (1 - distFromCenter * 0.6) * 60 + Math.random() * 20;
      return {
        x: (i / barCount) * 100,
        height: baseHeight,
        delay: i * 0.02,
        animHeight1: baseHeight * (0.3 + Math.random() * 0.7),
        animHeight2: baseHeight * (0.5 + Math.random() * 0.5),
        animHeight3: baseHeight * (0.2 + Math.random() * 0.8),
      };
    }), []);

  return (
    <div ref={ref} style={{ width: '100%', maxWidth: 800, margin: '0 auto' }}>
      <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ width: '100%', height: 120 }}>
        <defs>
          <linearGradient id="wave-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={A} stopOpacity="0.9" />
            <stop offset="100%" stopColor={A} stopOpacity="0.15" />
          </linearGradient>
          <filter id="wave-glow">
            <feGaussianBlur stdDeviation="0.3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {bars.map((bar, i) => {
          const barWidth = 100 / barCount * 0.6;
          const barH = bar.height / 100 * 28;
          return (
            <motion.rect
              key={i}
              x={bar.x}
              y={15 - barH / 2}
              width={barWidth}
              height={barH}
              rx={barWidth / 2}
              fill="url(#wave-grad)"
              filter="url(#wave-glow)"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={inView ? {
                scaleY: [0.3, 1, 0.5, 0.8, 0.3],
                opacity: [0.4, 1, 0.6, 0.9, 0.4],
              } : { scaleY: 0, opacity: 0 }}
              transition={{
                scaleY: {
                  duration: 2.5 + Math.random(),
                  delay: bar.delay,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                },
                opacity: {
                  duration: 2.5 + Math.random(),
                  delay: bar.delay,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                },
              }}
              style={{ transformOrigin: `${bar.x + barWidth / 2}% 50%` }}
            />
          );
        })}

        {/* Center accent line */}
        <motion.line
          x1={0} y1={15} x2={100} y2={15}
          stroke={`${A}25`} strokeWidth={0.1}
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, ease: EXPO }}
        />
      </svg>

      {/* Voice activity label */}
      <motion.div
        className="flex items-center justify-center gap-3 mt-2"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <motion.div
          style={{ width: 8, height: 8, borderRadius: '50%', background: A }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span style={{ fontFamily: TELE, fontSize: 10, color: A, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          Voice Active &middot; Qualifying Lead
        </span>
      </motion.div>
    </div>
  );
};

/* ══════════════════════════════════════════
   PARTICLE FIELD
   ══════════════════════════════════════════ */
const ParticleField = () => {
  const particles = useRef(
    Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 18 + 12,
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
            background: i % 4 === 0 ? A : 'rgba(255,255,255,0.10)',
          }}
          animate={{ y: [0, -22, 0], opacity: [0, 0.45, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════
   CONVERSATION FLOW CARD
   ══════════════════════════════════════════ */
const FlowCard = ({ step, title, body, delay = 0, isLast = false }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const [hovered, setHovered] = useState(false);

  return (
    <div ref={ref} className="relative" style={{ paddingLeft: 48 }}>
      {/* Vertical connector line */}
      {!isLast && (
        <motion.div
          style={{
            position: 'absolute', left: 19, top: 40, bottom: -20,
            width: 2, transformOrigin: 'top',
            background: `linear-gradient(to bottom, ${A}60, ${A}15)`,
          }}
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.8, delay: delay + 0.3, ease: EXPO }}
        />
      )}

      {/* Step node */}
      <motion.div
        style={{
          position: 'absolute', left: 8, top: 8,
          width: 24, height: 24, borderRadius: '50%',
          background: '#050505', border: `2px solid ${A}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2,
        }}
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : { scale: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15, delay }}
      >
        <span style={{ fontFamily: TELE, fontSize: 8, color: A, fontWeight: 700 }}>{step}</span>
        {/* Pulse ring */}
        <motion.div
          style={{
            position: 'absolute', inset: -4,
            borderRadius: '50%', border: `1px solid ${A}`,
          }}
          animate={{ scale: [1, 1.6, 2], opacity: [0.5, 0.2, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: delay * 2 }}
        />
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: EXPO, delay: delay + 0.1 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? 'rgba(139,92,246,0.05)' : 'rgba(255,255,255,0.015)',
          border: `1px solid ${hovered ? A + '40' : 'rgba(255,255,255,0.06)'}`,
          borderRadius: 16,
          padding: '24px 24px',
          marginBottom: 32,
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: hovered ? `0 8px 40px ${A}12, inset 0 1px 0 ${A}15` : 'none',
        }}
      >
        {/* Accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(to right, transparent, ${A}50, transparent)`,
          opacity: hovered ? 1 : 0.3,
          transition: 'opacity 0.4s',
        }} />

        {/* Left accent stripe */}
        <div style={{
          position: 'absolute', top: 12, left: 0, bottom: 12, width: 3,
          background: `linear-gradient(to bottom, ${A}, ${A}30)`,
          borderRadius: 2,
        }} />

        <h3 style={{
          fontFamily: SWISS, fontSize: 19, fontWeight: 700,
          color: '#FFFFFF', lineHeight: 1.2, marginBottom: 10,
        }}>
          {title}
        </h3>
        <p style={{
          fontFamily: SWISS, fontSize: 14, fontWeight: 300,
          color: '#E5E7EB', lineHeight: 1.85,
        }}>
          {body}
        </p>

        {/* Glow orb */}
        <motion.div
          style={{
            position: 'absolute', bottom: -20, right: -20,
            width: 100, height: 100, borderRadius: '50%',
            background: `radial-gradient(circle, ${A}15 0%, transparent 70%)`,
            filter: 'blur(16px)', pointerEvents: 'none',
          }}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1.2 : 0.8 }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
    </div>
  );
};

/* ══════════════════════════════════════════
   GOAL-TREE VISUALIZATION — connected SVG
   ══════════════════════════════════════════ */
const GoalTree = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const [hoveredNode, setHoveredNode] = useState(null);

  const nodes = [
    { x: 250, y: 30, label: 'Inbound Lead', sub: '5,000+ daily' },
    { x: 120, y: 100, label: 'Intent Verify', sub: 'NLU + Tone' },
    { x: 380, y: 100, label: 'Eligibility', sub: 'Criteria match' },
    { x: 120, y: 170, label: 'Financial Ready', sub: 'Budget check' },
    { x: 380, y: 170, label: 'Booking Slot', sub: 'Calendar sync' },
    { x: 250, y: 240, label: 'Sales Handoff', sub: 'Warm transfer' },
  ];

  const edges = [
    [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5],
  ];

  return (
    <div ref={ref} style={{
      background: 'rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 16,
      padding: '24px 16px',
    }}>
      <p style={{
        fontFamily: TELE, fontSize: 9, color: '#9CA3AF',
        letterSpacing: '0.3em', textTransform: 'uppercase',
        textAlign: 'center', marginBottom: 16,
      }}>
        Goal-Tree Qualification Flow
      </p>

      <svg viewBox="0 0 500 280" className="w-full" style={{ maxWidth: 600, margin: '0 auto', display: 'block' }}>
        <defs>
          <filter id="sb-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Grid */}
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`gx${i}`} x1={i * 40} y1={0} x2={i * 40} y2={280} stroke="rgba(255,255,255,0.015)" />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`gy${i}`} x1={0} y1={i * 40} x2={500} y2={i * 40} stroke="rgba(255,255,255,0.015)" />
        ))}

        {/* Edges */}
        {edges.map(([a, b], i) => {
          const from = nodes[a];
          const to = nodes[b];
          const active = hoveredNode === a || hoveredNode === b;
          return (
            <g key={`edge-${i}`}>
              <motion.line
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={active ? A : `${A}25`}
                strokeWidth={active ? 1.5 : 0.8}
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.15, ease: EXPO }}
              />
              {/* Traveling packet */}
              {active && (
                <motion.circle
                  r={2} fill={A}
                  initial={{ cx: from.x, cy: from.y, opacity: 0 }}
                  animate={{
                    cx: [from.x, to.x],
                    cy: [from.y, to.y],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ filter: `drop-shadow(0 0 4px ${A})` }}
                />
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const active = hoveredNode === i;
          return (
            <motion.g
              key={i}
              onMouseEnter={() => setHoveredNode(i)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer' }}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1, type: 'spring', stiffness: 120 }}
            >
              {/* Pulse */}
              {active && (
                <motion.circle
                  cx={node.x} cy={node.y} r={8}
                  fill="none" stroke={A} strokeWidth={0.5}
                  animate={{ r: [8, 22, 32], opacity: [0.6, 0.2, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              )}

              <circle
                cx={node.x} cy={node.y}
                r={active ? 10 : 7}
                fill={active ? `${A}25` : `${A}10`}
                stroke={active ? A : `${A}50`}
                strokeWidth={active ? 2 : 1}
                filter={active ? 'url(#sb-glow)' : undefined}
                style={{ transition: 'all 0.3s' }}
              />
              <circle cx={node.x} cy={node.y} r={3} fill={active ? A : `${A}80`} />

              <text
                x={node.x} y={node.y - 18}
                textAnchor="middle" fill={active ? '#FFFFFF' : '#E5E7EB'}
                style={{ fontFamily: SWISS, fontSize: 9, fontWeight: 600, transition: 'fill 0.3s' }}
              >
                {node.label}
              </text>
              <text
                x={node.x} y={node.y + 22}
                textAnchor="middle" fill={active ? '#D1D5DB' : '#9CA3AF'}
                style={{ fontFamily: TELE, fontSize: 7, transition: 'fill 0.3s' }}
              >
                {node.sub}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
};

/* ══════════════════════════════════════════
   METRIC BLOCK — large bordered
   ══════════════════════════════════════════ */
const MetricBlock = ({ value, suffix, label, sublabel, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: EXPO, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(139,92,246,0.04)' : 'rgba(255,255,255,0.01)',
        border: `2px solid ${hovered ? A + '50' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 18,
        padding: '36px 28px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: hovered ? `0 8px 50px ${A}15, inset 0 1px 0 ${A}15` : 'none',
      }}
    >
      {/* Corner brackets */}
      <div style={{ position: 'absolute', top: 8, left: 8, width: 16, height: 16, borderTop: `2px solid ${A}40`, borderLeft: `2px solid ${A}40` }} />
      <div style={{ position: 'absolute', top: 8, right: 8, width: 16, height: 16, borderTop: `2px solid ${A}40`, borderRight: `2px solid ${A}40` }} />
      <div style={{ position: 'absolute', bottom: 8, left: 8, width: 16, height: 16, borderBottom: `2px solid ${A}40`, borderLeft: `2px solid ${A}40` }} />
      <div style={{ position: 'absolute', bottom: 8, right: 8, width: 16, height: 16, borderBottom: `2px solid ${A}40`, borderRight: `2px solid ${A}40` }} />

      <span style={{
        fontFamily: SWISS, fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800,
        color: '#FFFFFF', letterSpacing: '-0.03em', display: 'block', lineHeight: 1,
      }}>
        <Counter value={value} suffix={suffix} />
      </span>

      <span style={{
        fontFamily: TELE, fontSize: 10, color: A,
        letterSpacing: '0.25em', textTransform: 'uppercase',
        marginTop: 12, display: 'block',
      }}>
        {label}
      </span>

      {sublabel && (
        <p style={{
          fontFamily: SWISS, fontSize: 12, fontWeight: 300,
          color: '#D1D5DB', lineHeight: 1.6, marginTop: 10,
        }}>
          {sublabel}
        </p>
      )}

      {/* Animated progress bar */}
      <motion.div
        style={{
          marginTop: 16, height: 3, borderRadius: 2,
          background: 'rgba(255,255,255,0.04)', overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            height: '100%', borderRadius: 2,
            background: `linear-gradient(to right, ${A}, ${A}60)`,
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: '100%' } : { width: 0 }}
          transition={{ duration: 1.5, ease: EXPO, delay: delay + 0.3 }}
        />
      </motion.div>

      {/* Glow */}
      <motion.div
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 200, height: 200, borderRadius: '50%',
          background: `radial-gradient(circle, ${A}10 0%, transparent 70%)`,
          filter: 'blur(30px)', pointerEvents: 'none',
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
const CaseSuperbot = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const headerY = useTransform(smoothProgress, [0, 0.15], [0, -60]);
  const headerOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);

  const flowSteps = [
    {
      step: '01',
      title: 'Real-Time Memory Retrieval',
      body: 'n8n fetches the lead profile from Miles One UIR including Masterclass video progress, attribution source, historical interactions, and engagement score. The entire profile is hydrated in under 200ms before the call connects.',
    },
    {
      step: '02',
      title: 'Context Injection',
      body: 'Data fed into LLM system prompt: "You are calling Rahul, who just watched 15 min of CPA Tax module..." The bot speaks with full awareness of the lead\'s journey, creating a warm, personalized first impression.',
    },
    {
      step: '03',
      title: 'Goal-Tree Qualification',
      body: 'A structured decision tree: Intent Verification (genuine interest?) then Eligibility Check (qualifications match?) then Financial Readiness (budget confirmed?) then Booking (calendar slot secured). Each gate scored independently.',
    },
    {
      step: '04',
      title: 'Data Feedback Loop',
      body: 'Every call transcribed in real-time. Sentiment analyzed across the full conversation. A 2-sentence AI-generated summary pushed to CRM Lead Queue, pre-scoring the lead for human agents on the sales floor.',
    },
  ];

  return (
    <div className="relative w-full" style={{ background: '#050505' }}>

      {/* Ambient ombre */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `radial-gradient(ellipse 120% 70% at 50% 10%, ${A}12 0%, transparent 50%), radial-gradient(ellipse 80% 100% at 80% 80%, ${A}08 0%, transparent 50%)`
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
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: A, boxShadow: `0 0 10px ${A}` }} />
            <span style={{ fontFamily: TELE, fontSize: 10, color: A, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
              Operation: Superbot AI
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
              Agentic Voice
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
              Qualification
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            style={{
              fontFamily: SWISS, fontSize: 'clamp(15px, 1.8vw, 19px)', fontWeight: 300,
              color: '#D1D5DB', maxWidth: 660, margin: '24px auto 0', lineHeight: 1.6,
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EXPO, delay: 0.5 }}
          >
            Optimizing Sales Velocity through RAG-Driven AI Voice Assistants
          </motion.p>
        </motion.div>

        {/* Audio Waveform */}
        <motion.div
          className="max-w-4xl mx-auto mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EXPO, delay: 0.6 }}
        >
          <AudioWaveform />
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
              The sales floor was overwhelmed — <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>5,000+ leads daily</strong>, but the half-life of a lead is 5-10 minutes. Human agents spent 70% of time on Discovery and only 30% on Closing.
            </p>
            <p style={{ fontFamily: SWISS, fontSize: 17, fontWeight: 300, color: '#E5E7EB', lineHeight: 1.85, marginTop: 20 }}>
              <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Superbot AI</strong> was built as a first-responder: it conducts initial qualification calls, retrieves real-time lead memory via n8n, and determines <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Sales-Readiness</strong> before a human picks up the phone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════ GOAL-TREE VISUALIZATION ════ */}
      <section className="relative z-10" style={{ padding: '20px 24px 60px' }}>
        <div className="max-w-4xl mx-auto">
          <GoalTree />
        </div>
      </section>

      {/* ════ CONVERSATION FLOW ════ */}
      <section className="relative z-10" style={{ padding: '40px 24px 60px' }}>
        <div className="max-w-3xl mx-auto">
          <motion.p
            className="text-center mb-16"
            style={{ fontFamily: TELE, fontSize: 10, color: '#D1D5DB', letterSpacing: '0.35em', textTransform: 'uppercase' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            [ Conversation Flow ]
          </motion.p>

          {flowSteps.map((step, i) => (
            <FlowCard
              key={i}
              step={step.step}
              title={step.title}
              body={step.body}
              delay={i * 0.15}
              isLast={i === flowSteps.length - 1}
            />
          ))}
        </div>
      </section>

      {/* ════ METRICS ════ */}
      <section className="relative z-10" style={{ padding: '60px 24px 100px' }}>
        <div className="max-w-5xl mx-auto">
          <motion.p
            className="text-center mb-16"
            style={{ fontFamily: TELE, fontSize: 10, color: '#D1D5DB', letterSpacing: '0.35em', textTransform: 'uppercase' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            [ Performance Telemetry ]
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricBlock
              value="40" suffix="%"
              label="Analysis Time Reduction"
              sublabel="Superbot handles initial discovery, freeing human agents to focus exclusively on closing qualified leads."
              delay={0}
            />
            <MetricBlock
              value="15" suffix="%"
              label="Qualified Leads Increase"
              sublabel="AI pre-screening ensures only Sales-Ready leads reach the floor, dramatically improving agent hit rates."
              delay={0.12}
            />
            <MetricBlock
              value="5" suffix="%"
              label="Sales Cycle Reduction"
              sublabel="Faster first contact + pre-qualified context = shorter time from lead to enrollment."
              delay={0.24}
            />
            <MetricBlock
              value="800" suffix="ms"
              label="Turn-Around Time"
              sublabel="Sub-800ms voice response latency. Leads experience natural, human-like conversation flow with zero awkward pauses."
              delay={0.36}
            />
          </div>
        </div>
      </section>

      {/* ════ NAV FOOTER ════ */}
      <section className="relative z-10" style={{ padding: '40px 24px 120px', textAlign: 'center' }}>
        <div style={{ width: 40, height: 1, background: `${A}40`, margin: '0 auto 32px' }} />
        <Link
          to="/cases/transactional-llm-orchestration"
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
          Next: Action Agents <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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

export default CaseSuperbot;
