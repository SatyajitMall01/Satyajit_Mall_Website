import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, Cpu, GitBranch, RefreshCw, Shield } from 'lucide-react';

const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const TELE  = "'Courier New', Courier, monospace";
const EXPO  = [0.16, 1, 0.3, 1];
const A     = '#ec4899';

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
   CIRCUIT BOARD BACKGROUND
   ══════════════════════════════════════════ */
const CircuitBoardBg = () => {
  const traces = useRef(
    Array.from({ length: 30 }, () => ({
      x1: Math.random() * 100,
      y1: Math.random() * 100,
      len: Math.random() * 15 + 5,
      vertical: Math.random() > 0.5,
      delay: Math.random() * 8,
      duration: Math.random() * 6 + 4,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full" preserveAspectRatio="none">
        {traces.map((t, i) => (
          <motion.line
            key={i}
            x1={`${t.x1}%`}
            y1={`${t.y1}%`}
            x2={t.vertical ? `${t.x1}%` : `${t.x1 + t.len}%`}
            y2={t.vertical ? `${t.y1 + t.len}%` : `${t.y1}%`}
            stroke={i % 4 === 0 ? `${A}15` : 'rgba(255,255,255,0.03)'}
            strokeWidth={0.5}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.6, 0.6, 0] }}
            transition={{ duration: t.duration, delay: t.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </svg>
    </div>
  );
};

/* ══════════════════════════════════════════
   CIRCUIT FLOW DIAGRAM — Horizontal Pipeline
   ══════════════════════════════════════════ */
const PIPELINE_NODES = [
  { id: 'LLM',    label: 'LLM',          sub: 'GPT-4 Function Call', x: 80 },
  { id: 'PARSER', label: 'JSON Parser',   sub: 'Structured Output',  x: 240 },
  { id: 'N8N',    label: 'n8n',           sub: 'Webhook Executor',   x: 400 },
  { id: 'REDIS',  label: 'Redis',         sub: 'Circuit Breaker',    x: 560 },
  { id: 'CRM',    label: 'CRM',           sub: 'HubSpot / Sheets',  x: 720 },
];

const DataPacket = ({ x1, y, x2, delay = 0 }) => (
  <motion.circle
    r={3}
    fill={A}
    initial={{ cx: x1, cy: y, opacity: 0 }}
    animate={{
      cx: [x1, x1 + (x2 - x1) * 0.3, x1 + (x2 - x1) * 0.7, x2],
      cy: [y, y - 8, y + 8, y],
      opacity: [0, 1, 1, 0],
    }}
    transition={{ duration: 2.2, delay, repeat: Infinity, ease: 'easeInOut' }}
    style={{ filter: `drop-shadow(0 0 6px ${A})` }}
  />
);

const CircuitFlowDiagram = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <svg viewBox="0 0 800 200" className="w-full" style={{ maxWidth: 960, margin: '0 auto' }}>
      <defs>
        <filter id="pinkGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="nodeHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={A} stopOpacity="0.25" />
          <stop offset="100%" stopColor={A} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Grid lines */}
      {Array.from({ length: 21 }).map((_, i) => (
        <line key={`vg${i}`} x1={i * 40} y1={0} x2={i * 40} y2={200} stroke="rgba(255,255,255,0.015)" />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={`hg${i}`} x1={0} y1={i * 40} x2={800} y2={i * 40} stroke="rgba(255,255,255,0.015)" />
      ))}

      {/* Edges */}
      {PIPELINE_NODES.slice(0, -1).map((node, i) => {
        const next = PIPELINE_NODES[i + 1];
        const active = hovered === node.id || hovered === next.id;
        return (
          <g key={`edge-${i}`}>
            <motion.line
              x1={node.x + 40} y1={100} x2={next.x - 40} y2={100}
              stroke={active ? A : 'rgba(255,255,255,0.08)'}
              strokeWidth={active ? 2 : 1}
              strokeDasharray={active ? 'none' : '4 4'}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 + i * 0.2, ease: EXPO }}
            />
            {/* Data packets on every edge */}
            <DataPacket x1={node.x + 40} y={100} x2={next.x - 40} delay={i * 0.6} />
            <DataPacket x1={node.x + 40} y={100} x2={next.x - 40} delay={i * 0.6 + 1.1} />
          </g>
        );
      })}

      {/* Nodes */}
      {PIPELINE_NODES.map((node, i) => {
        const active = hovered === node.id;
        return (
          <motion.g
            key={node.id}
            onMouseEnter={() => setHovered(node.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'pointer' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.15, type: 'spring', stiffness: 100 }}
          >
            {/* Halo */}
            {active && (
              <motion.circle cx={node.x} cy={100} r={50} fill="url(#nodeHalo)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />
            )}

            {/* Hex border */}
            <motion.rect
              x={node.x - 34} y={72} width={68} height={56} rx={12}
              fill={active ? `${A}12` : 'rgba(255,255,255,0.02)'}
              stroke={active ? A : 'rgba(255,255,255,0.1)'}
              strokeWidth={active ? 2 : 1}
              filter={active ? 'url(#pinkGlow)' : undefined}
              animate={{ y: active ? 68 : 72 }}
              transition={{ type: 'spring', stiffness: 200 }}
            />

            {/* Label */}
            <motion.text
              x={node.x} y={95}
              textAnchor="middle"
              fill={active ? '#FFFFFF' : '#E5E7EB'}
              style={{ fontFamily: SWISS, fontSize: 13, fontWeight: 700 }}
            >
              {node.label}
            </motion.text>

            {/* Sub */}
            <text
              x={node.x} y={117}
              textAnchor="middle"
              fill={active ? '#D1D5DB' : '#9CA3AF'}
              style={{ fontFamily: TELE, fontSize: 8, letterSpacing: '0.06em' }}
            >
              {node.sub}
            </text>

            {/* Pulse rings */}
            {active && (
              <>
                <motion.circle cx={node.x} cy={100} r={0} fill="none" stroke={A} strokeWidth={0.5}
                  animate={{ r: [0, 40, 55], opacity: [0.5, 0.15, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }} />
                <motion.circle cx={node.x} cy={100} r={0} fill="none" stroke={A} strokeWidth={0.5}
                  animate={{ r: [0, 40, 55], opacity: [0.5, 0.15, 0] }}
                  transition={{ duration: 2.5, delay: 0.8, repeat: Infinity, ease: 'easeOut' }} />
              </>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
};

/* ══════════════════════════════════════════
   EXPANDABLE PROTOCOL CARD
   ══════════════════════════════════════════ */
const ICONS_MAP = { Cpu, GitBranch, RefreshCw, Shield };

const ProtocolCard = ({ phase, icon, title, body, delay = 0 }) => {
  const [expanded, setExpanded] = useState(false);
  const IconComp = ICONS_MAP[icon] || Cpu;

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
          Protocol {phase}
        </span>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={14} color="#9CA3AF" />
        </motion.div>
      </div>

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
const CaseActionAgents = () => {
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
        <CircuitBoardBg />

        <motion.div className="max-w-6xl mx-auto text-center" style={{ y: headerY, opacity: headerOpacity }}>
          {/* Badge */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EXPO }}
          >
            <Cpu size={14} color={A} />
            <span style={{ fontFamily: TELE, fontSize: 10, color: A, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
              Operation: Action Agents
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
              Transactional LLM
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              style={{ fontFamily: SWISS, fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.04em', lineHeight: 1.0 }}
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, ease: EXPO, delay: 0.35 }}
            >
              Orchestration
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            style={{ fontFamily: SWISS, fontSize: 'clamp(15px, 1.8vw, 19px)', fontWeight: 300, color: '#D1D5DB', maxWidth: 640, margin: '24px auto 0', lineHeight: 1.6 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EXPO, delay: 0.5 }}
          >
            Bridging Conversational AI and Real-World Task Execution
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

        {/* Circuit Flow Diagram */}
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
            Interactive Pipeline &middot; Hover nodes to inspect data flow
          </p>
          <CircuitFlowDiagram />
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
              While bots could answer questions and qualify leads, they couldn't perform actual transactions — <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>booking webinars, updating CRM records</strong> — without human intervention. The Action Agents Framework moved from <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>'Passive Chatbots'</strong> to <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>'Goal-Oriented Agents'</strong> using Function-Calling patterns and a Redis-based Circuit Breaker for transactional integrity.
            </p>
          </motion.div>
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
            <ProtocolCard
              phase="01" icon="Cpu"
              title="Function-Calling & Tool-Use"
              body="The LLM generates structured JSON payloads that map directly to API endpoints. Rather than parsing free-text intent, the model outputs deterministic function signatures — tool name, parameters, and expected return schema. This eliminates ambiguity and enables direct execution without brittle regex parsing."
              delay={0}
            />
            <ProtocolCard
              phase="02" icon="Shield"
              title="Redis Operational Memory"
              body="Every transactional intent receives an idempotency key stored in Redis with a configurable TTL. If the same booking request fires twice within the window, the second is silently deduplicated. This Circuit Breaker pattern prevents double-triggers — zero duplicate bookings since deployment."
              delay={0.1}
            />
            <ProtocolCard
              phase="03" icon="GitBranch"
              title="n8n as Nervous System"
              body="n8n serves as the orchestration backbone: webhook receives the structured intent → validates payload schema → executes against CRM/Calendar APIs → returns confirmation to the LLM for user-facing response. Each workflow is versioned, observable, and independently deployable."
              delay={0.2}
            />
            <ProtocolCard
              phase="04" icon="RefreshCw"
              title="Self-Healing Loop"
              body="When an API call fails — timeout, rate-limit, malformed response — the error payload is returned to the LLM context window. The model diagnoses the failure, adjusts parameters, and retries with a corrected call. Users see a graceful 'working on it' message instead of a dead-end error."
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
              value="+25%"
              label="Self-Service Rate"
              percent={88}
              delay={0}
              sublabel="Users now complete webinar bookings, rescheduling, and CRM updates entirely through the conversational agent — no human handoff required."
            />
            <MetricBar
              value="0"
              label="Duplicate Bookings"
              percent={100}
              delay={0.15}
              sublabel="Redis idempotency keys eliminated every instance of double-triggered transactions. Zero duplicates since launch."
            />
            <MetricBar
              value="24/7"
              label="Availability"
              percent={95}
              delay={0.3}
              sublabel="The agent handles transactional requests around the clock — nights, weekends, holidays — without staffing constraints."
            />
            <MetricBar
              value="-15%"
              label="Admin Scheduling Load"
              percent={72}
              delay={0.45}
              sublabel="With routine scheduling automated, the operations team reallocated 15% of admin bandwidth to high-touch student engagement."
            />
          </div>
        </div>
      </section>

      {/* ════ NAV FOOTER ════ */}
      <section className="relative z-10" style={{ padding: '40px 24px 120px', textAlign: 'center' }}>
        <div style={{ width: 40, height: 1, background: `${A}40`, margin: '0 auto 32px' }} />
        <Link
          to="/cases/product-data-unification"
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
          Next: Miles One Analytics <ArrowRight size={14} />
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

export default CaseActionAgents;
