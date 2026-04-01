import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const TELE  = "'Courier New', Courier, monospace";
const EXPO  = [0.16, 1, 0.3, 1];
const A     = '#f59e0b';

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
   SPARKLINE SVG — draws on scroll
   ══════════════════════════════════════════ */
const Sparkline = ({ data, width = 120, height = 40, color = A, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  const points = useMemo(() => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    return data.map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height * 0.8) - height * 0.1;
      return `${x},${y}`;
    }).join(' ');
  }, [data, width, height]);

  const pathD = useMemo(() => {
    const pts = points.split(' ').map(p => p.split(',').map(Number));
    if (pts.length < 2) return '';
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cpx1 = prev[0] + (curr[0] - prev[0]) * 0.4;
      const cpx2 = prev[0] + (curr[0] - prev[0]) * 0.6;
      d += ` C ${cpx1} ${prev[1]}, ${cpx2} ${curr[1]}, ${curr[0]} ${curr[1]}`;
    }
    return d;
  }, [points]);

  return (
    <svg ref={ref} width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`spark-grad-${delay}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Fill area */}
      <motion.path
        d={pathD ? `${pathD} L ${width} ${height} L 0 ${height} Z` : ''}
        fill={`url(#spark-grad-${delay})`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: delay + 0.5 }}
      />
      {/* Line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.4, delay, ease: EXPO }}
      />
      {/* End dot */}
      {data.length > 0 && (
        <motion.circle
          cx={width}
          cy={(() => {
            const max = Math.max(...data);
            const min = Math.min(...data);
            const range = max - min || 1;
            return height - ((data[data.length - 1] - min) / range) * (height * 0.8) - height * 0.1;
          })()}
          r={3}
          fill={color}
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.4, delay: delay + 1.2, type: 'spring', stiffness: 300 }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      )}
    </svg>
  );
};

/* ══════════════════════════════════════════
   PARTICLE FIELD
   ══════════════════════════════════════════ */
const ParticleField = () => {
  const particles = useRef(
    Array.from({ length: 50 }, () => ({
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
            background: i % 4 === 0 ? A : 'rgba(255,255,255,0.12)',
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0, 0.5, 0],
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
   ANIMATED SPINE LINE
   ══════════════════════════════════════════ */
const SpineLine = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5%' });

  return (
    <div ref={ref} className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none hidden md:block" style={{ width: 2 }}>
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(to bottom, transparent, ${A}40 10%, ${A}25 90%, transparent)`,
          transformOrigin: 'top',
        }}
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 2, ease: EXPO }}
      />
      {/* Pulsing nodes along the spine */}
      {[10, 30, 50, 70, 90].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: `${pos}%`, width: 8, height: 8, borderRadius: '50%', border: `1px solid ${A}60`, background: '#050505' }}
          animate={{ boxShadow: [`0 0 0px ${A}00`, `0 0 12px ${A}60`, `0 0 0px ${A}00`] }}
          transition={{ duration: 3, delay: i * 0.6, repeat: Infinity }}
        />
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════
   TIMELINE ENTRY — alternating left/right
   ══════════════════════════════════════════ */
const TimelineEntry = ({ side, tag, title, body, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const isLeft = side === 'left';

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0"
      style={{ marginBottom: 80 }}
    >
      {/* Spine connector dot */}
      <motion.div
        className="absolute left-1/2 top-8 -translate-x-1/2 z-10 hidden md:flex items-center justify-center"
        style={{
          width: 20, height: 20, borderRadius: '50%',
          background: '#050505', border: `2px solid ${A}`,
        }}
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : { scale: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }}
      >
        <motion.div
          style={{ width: 6, height: 6, borderRadius: '50%', background: A }}
          animate={{ boxShadow: [`0 0 0px ${A}`, `0 0 14px ${A}`, `0 0 0px ${A}`] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Left content */}
      <div className={`${isLeft ? '' : 'md:order-2'}`} style={{ paddingRight: isLeft ? 48 : 0, paddingLeft: isLeft ? 0 : 48 }}>
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EXPO, delay: 0.15 }}
            style={{ textAlign: 'right' }}
            whileHover={{ y: -3 }}
          >
            <TimelineCard tag={tag} title={title} body={body} index={index} align="right" />
          </motion.div>
        )}
      </div>

      {/* Right content */}
      <div className={`${isLeft ? 'md:order-2' : ''}`} style={{ paddingLeft: isLeft ? 48 : 0, paddingRight: isLeft ? 0 : 48 }}>
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EXPO, delay: 0.15 }}
            whileHover={{ y: -3 }}
          >
            <TimelineCard tag={tag} title={title} body={body} index={index} align="left" />
          </motion.div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   TIMELINE CARD — glassmorphic
   ══════════════════════════════════════════ */
const TimelineCard = ({ tag, title, body, index, align }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(245,158,11,0.04)' : 'rgba(255,255,255,0.015)',
        border: `1px solid ${hovered ? A + '40' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 16,
        padding: '28px 24px',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
        textAlign: align,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: hovered ? `0 8px 40px ${A}12, inset 0 1px 0 ${A}15` : 'none',
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(to right, transparent, ${A}50, transparent)`,
        opacity: hovered ? 1 : 0.3,
        transition: 'opacity 0.4s',
      }} />

      {/* Phase number */}
      <span style={{
        fontFamily: TELE, fontSize: 9, color: A,
        letterSpacing: '0.35em', textTransform: 'uppercase',
        display: 'block', marginBottom: 12,
      }}>
        Node {String(index + 1).padStart(2, '0')} &middot; {tag}
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

      {/* Glow orb on hover */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%', left: align === 'right' ? '80%' : '20%',
          width: 120, height: 120,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${A}15 0%, transparent 70%)`,
          filter: 'blur(20px)',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1.2 : 0.8 }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
};

/* ══════════════════════════════════════════
   METRIC CARD with sparkline
   ══════════════════════════════════════════ */
const MetricCard = ({ value, suffix, label, sparkData, delay = 0 }) => {
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
        background: hovered ? 'rgba(245,158,11,0.04)' : 'rgba(255,255,255,0.015)',
        border: `1px solid ${hovered ? A + '40' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 14,
        padding: '28px 24px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: hovered ? `0 8px 40px ${A}12` : 'none',
      }}
    >
      {/* Top accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(to right, transparent, ${A}40, transparent)`,
      }} />

      <div className="flex items-end justify-between mb-3">
        <div>
          <span style={{
            fontFamily: SWISS, fontSize: 'clamp(30px, 4vw, 42px)', fontWeight: 800,
            color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1,
          }}>
            <Counter value={value} suffix={suffix} />
          </span>
        </div>
        <Sparkline data={sparkData} width={100} height={36} delay={delay + 0.2} />
      </div>

      <span style={{
        fontFamily: TELE, fontSize: 10, color: A,
        letterSpacing: '0.25em', textTransform: 'uppercase',
      }}>
        {label}
      </span>

      {/* Hover glow */}
      <motion.div
        style={{
          position: 'absolute', bottom: -20, right: -20,
          width: 100, height: 100, borderRadius: '50%',
          background: `radial-gradient(circle, ${A}18 0%, transparent 70%)`,
          filter: 'blur(16px)', pointerEvents: 'none',
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   DATA FLOW VISUALIZATION — animated SVG
   ══════════════════════════════════════════ */
const DataFlowViz = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  const nodes = [
    { x: 80, y: 50, label: 'Video.js Player' },
    { x: 280, y: 50, label: 'Redis Buffer' },
    { x: 480, y: 50, label: 'PostgreSQL Ledger' },
    { x: 280, y: 150, label: 'RAG Pipeline' },
    { x: 480, y: 150, label: 'AI Tutor Response' },
  ];

  const edges = [
    [0, 1], [1, 2], [1, 3], [3, 4],
  ];

  return (
    <svg ref={ref} viewBox="0 0 560 200" className="w-full" style={{ maxWidth: 700, margin: '0 auto', display: 'block' }}>
      <defs>
        <filter id="mc-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Grid */}
      {Array.from({ length: 15 }).map((_, i) => (
        <line key={`gx${i}`} x1={i * 40} y1={0} x2={i * 40} y2={200} stroke="rgba(255,255,255,0.015)" />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={`gy${i}`} x1={0} y1={i * 40} x2={560} y2={i * 40} stroke="rgba(255,255,255,0.015)" />
      ))}

      {/* Edges */}
      {edges.map(([a, b], i) => {
        const from = nodes[a];
        const to = nodes[b];
        return (
          <g key={`edge-${i}`}>
            <motion.line
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke={`${A}40`}
              strokeWidth={1}
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1, delay: 0.5 + i * 0.2, ease: EXPO }}
            />
            {/* Traveling data packet */}
            <motion.circle
              r={2.5} fill={A}
              initial={{ cx: from.x, cy: from.y, opacity: 0 }}
              animate={inView ? {
                cx: [from.x, (from.x + to.x) / 2, to.x],
                cy: [from.y, (from.y + to.y) / 2, to.y],
                opacity: [0, 1, 0],
              } : {}}
              transition={{ duration: 2, delay: 1 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ filter: `drop-shadow(0 0 4px ${A})` }}
            />
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.15, type: 'spring', stiffness: 120 }}
        >
          <circle cx={node.x} cy={node.y} r={6} fill={`${A}20`} stroke={A} strokeWidth={1.5} filter="url(#mc-glow)" />
          <circle cx={node.x} cy={node.y} r={2.5} fill={A} />
          <text
            x={node.x} y={node.y - 16}
            textAnchor="middle"
            fill="#E5E7EB"
            style={{ fontFamily: TELE, fontSize: 8, letterSpacing: '0.05em' }}
          >
            {node.label}
          </text>
        </motion.g>
      ))}

      {/* 10s label */}
      <motion.text
        x={180} y={38}
        textAnchor="middle"
        fill={A}
        style={{ fontFamily: TELE, fontSize: 7, letterSpacing: '0.1em' }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: [0, 1, 0.6] } : {}}
        transition={{ duration: 1.5, delay: 1.5 }}
      >
        10s SYNC
      </motion.text>
    </svg>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
const CaseMasterclass = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const headerY = useTransform(smoothProgress, [0, 0.15], [0, -60]);
  const headerOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);

  const timelineEntries = [
    {
      side: 'left',
      tag: '10s Behavioral Sync',
      title: '10-Second Behavioral Telemetry',
      body: 'The local video player (React/Video.js) pings a specialized endpoint every 10 seconds with User_UUID, Video_ID, Current_Timestamp, and Playback_Rate. Data streams into a Redis buffer before persisting to a PostgreSQL Consumption Ledger.',
    },
    {
      side: 'right',
      tag: 'Chapter-Aware RAG',
      title: 'Chapter-Aware RAG Pipeline',
      body: 'All videos transcribed and indexed into Semantic Chapters. When a user asks the AI assistant a question, the system prioritizes the Context Window based on their current 10-second timestamp. Using n8n and LangChain, the most relevant text chunks are retrieved.',
    },
    {
      side: 'left',
      tag: 'Token Optimization',
      title: 'Token Cost Optimization',
      body: 'Common questions at specific timestamps cached using Redis. Basic navigational queries handled client-side. LLM reserved for complex conceptual explanations. Achieved 1.8s median AI response time.',
    },
    {
      side: 'right',
      tag: 'Revenue Bridge',
      title: 'Freemium-to-Premium Bridge',
      body: 'Users completing >70% tagged as "High-Intent" in Miles One Registry. Automatically enrolled in personalized WhatsApp drip campaigns offering limited-time scholarships for the full CPA program.',
    },
  ];

  const metrics = [
    { value: '30000', suffix: '+', label: 'ToFu Users Acquired', sparkData: [2, 8, 12, 18, 22, 26, 30] },
    { value: '2000', suffix: '+', label: 'Paid Subscriptions', sparkData: [1, 3, 5, 8, 12, 16, 20] },
    { value: '15', suffix: '%', label: 'CPA Conversion Lift', sparkData: [3, 5, 7, 9, 11, 13, 15] },
    { value: '1.8', suffix: 's', label: 'Median AI Response', sparkData: [4.2, 3.8, 3.1, 2.6, 2.2, 1.9, 1.8] },
  ];

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
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: A, boxShadow: `0 0 10px ${A}` }} />
            <span style={{ fontFamily: TELE, fontSize: 10, color: A, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
              Operation: Miles Masterclass
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
              Behavioral OTT
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
              Architecture
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
            Engineering High-Intent Funnels through AI-Driven Content Consumption
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

        {/* Data Flow Visualization */}
        <motion.div
          className="max-w-4xl mx-auto mt-16"
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
          <p style={{
            fontFamily: TELE, fontSize: 9, color: '#9CA3AF',
            letterSpacing: '0.3em', textTransform: 'uppercase',
            textAlign: 'center', marginBottom: 20,
          }}>
            Data Telemetry Flow &middot; 10-Second Behavioral Sync
          </p>
          <DataFlowViz />
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
              In a saturated EdTech market, traditional lead magnets suffer from <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>"Engagement Decay"</strong> — users download a PDF but never consume it. To bridge the gap between "passive viewer" and "active student," we bypassed rigid LMS platforms to architect <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Miles Masterclass</strong>: a bespoke, Netflix-style micro-learning OTT engine.
            </p>
            <p style={{ fontFamily: SWISS, fontSize: 17, fontWeight: 300, color: '#E5E7EB', lineHeight: 1.85, marginTop: 20 }}>
              By capturing behavioral video data at <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>10-second intervals</strong> and feeding it into a <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Chapter-Aware RAG pipeline</strong>, we delivered context-aware, real-time AI tutoring that validated learner intent and directly fed the core revenue pipeline.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════ TELEMETRY TIMELINE ════ */}
      <section className="relative z-10" style={{ padding: '60px 24px 40px' }}>
        <div className="max-w-5xl mx-auto">
          <motion.p
            className="text-center mb-20"
            style={{ fontFamily: TELE, fontSize: 10, color: '#D1D5DB', letterSpacing: '0.35em', textTransform: 'uppercase' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            [ The Telemetry Timeline ]
          </motion.p>

          <div className="relative">
            <SpineLine />
            {timelineEntries.map((entry, i) => (
              <TimelineEntry
                key={i}
                side={entry.side}
                tag={entry.tag}
                title={entry.title}
                body={entry.body}
                index={i}
              />
            ))}
          </div>
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
            [ Business Ledger ]
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.map((m, i) => (
              <MetricCard
                key={i}
                value={m.value}
                suffix={m.suffix}
                label={m.label}
                sparkData={m.sparkData}
                delay={i * 0.12}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════ NAV FOOTER ════ */}
      <section className="relative z-10" style={{ padding: '40px 24px 120px', textAlign: 'center' }}>
        <div style={{ width: 40, height: 1, background: `${A}40`, margin: '0 auto 32px' }} />
        <Link
          to="/cases/the-attribution-recovery-engine"
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
          Next: Miles Engage <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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

export default CaseMasterclass;
