import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, AlertTriangle, CreditCard, KeyRound, Clock, Zap, CheckCircle2, MessageSquare } from 'lucide-react';

const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const TELE  = "'Courier New', Courier, monospace";
const EXPO  = [0.16, 1, 0.3, 1];
const A     = '#14b8a6';

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
      setCount(Math.round(eased * numericPart * 10) / 10);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, numericPart]);

  return <span ref={ref}>{prefix}{isNaN(numericPart) ? value : count}{suffix}</span>;
};

/* ══════════════════════════════════════════
   BEFORE / AFTER HERO COMPARISON
   ══════════════════════════════════════════ */
const BeforeAfterHero = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <div ref={ref} style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BEFORE */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: EXPO, delay: 0.2 }}
          style={{
            background: 'rgba(239,68,68,0.04)',
            border: '1px solid rgba(239,68,68,0.15)',
            borderRadius: 16,
            padding: '36px 28px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, transparent, rgba(239,68,68,0.5), transparent)' }} />
          <span style={{ fontFamily: TELE, fontSize: 9, color: '#ef4444', letterSpacing: '0.3em', textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>
            Before
          </span>
          <motion.span
            style={{
              fontFamily: SWISS, fontSize: 'clamp(48px, 8vw, 72px)', fontWeight: 900,
              color: '#ef4444', letterSpacing: '-0.03em', display: 'block', lineHeight: 1,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5, type: 'spring', stiffness: 100 }}
          >
            48hrs
          </motion.span>
          <span style={{ fontFamily: TELE, fontSize: 11, color: '#D1D5DB', letterSpacing: '0.15em', marginTop: 8, display: 'block' }}>
            Average Resolution Time
          </span>
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Manual ticket routing', 'Blind escalation chains', 'No root-cause data'].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 justify-center"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <span style={{ fontFamily: TELE, fontSize: 10, color: '#ef4444' }}>&#x2717;</span>
                <span style={{ fontFamily: SWISS, fontSize: 12, color: '#E5E7EB' }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AFTER */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: EXPO, delay: 0.4 }}
          style={{
            background: `${A}06`,
            border: `1px solid ${A}20`,
            borderRadius: 16,
            padding: '36px 28px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${A}60, transparent)` }} />
          <span style={{ fontFamily: TELE, fontSize: 9, color: A, letterSpacing: '0.3em', textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>
            After
          </span>
          <motion.span
            style={{
              fontFamily: SWISS, fontSize: 'clamp(48px, 8vw, 72px)', fontWeight: 900,
              color: A, letterSpacing: '-0.03em', display: 'block', lineHeight: 1,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.7, type: 'spring', stiffness: 100 }}
          >
            &lt;5min
          </motion.span>
          <span style={{ fontFamily: TELE, fontSize: 11, color: '#D1D5DB', letterSpacing: '0.15em', marginTop: 8, display: 'block' }}>
            Automated Resolution
          </span>
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['SQL forensic auto-diagnosis', 'Autonomous resolution agents', 'Proactive intervention'].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 justify-center"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.9 + i * 0.1 }}
              >
                <span style={{ fontFamily: TELE, fontSize: 10, color: A }}>&#x2713;</span>
                <span style={{ fontFamily: SWISS, fontSize: 12, color: '#E5E7EB' }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Animated arrow between */}
      <motion.div
        style={{ textAlign: 'center', marginTop: -8, position: 'relative', zIndex: 5 }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1 }}
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 48, height: 48, borderRadius: '50%',
            background: `${A}15`, border: `2px solid ${A}40`,
          }}
        >
          <Zap size={20} color={A} />
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ══════════════════════════════════════════
   FRICTION MAP — 3 Diagnostic Cards
   ══════════════════════════════════════════ */
const FRICTION_ITEMS = [
  {
    id: 'ghost',
    icon: CreditCard,
    codename: 'Payment Ghost',
    title: 'Razorpay Success, is_paid=false',
    body: 'Razorpay webhook confirmed payment success, but the local database flag is_paid remained false due to a race condition in the callback handler. Students paid but couldn\'t access content — generating 40% of all support tickets.',
    color: '#ef4444',
  },
  {
    id: 'credential',
    icon: KeyRound,
    codename: 'Credential Lag',
    title: 'SSO Identity Not Synced',
    body: 'Single Sign-On identity tokens were issued at the IdP layer but the local user table wasn\'t updated synchronously. Students could authenticate but saw stale profile data — wrong name, wrong cohort, wrong course access.',
    color: '#f59e0b',
  },
  {
    id: 'certlock',
    icon: Clock,
    codename: 'Cert-Lock',
    title: '1-Second Rounding Error',
    body: 'Course completion calculated time_spent using FLOOR() instead of ROUND(). Students who spent 59.5 seconds on the final module were marked incomplete — locked out of their completion certificate despite finishing all content.',
    color: '#8b5cf6',
  },
];

const FrictionCard = ({ item, delay = 0 }) => {
  const [expanded, setExpanded] = useState(false);
  const IconComp = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: EXPO, delay }}
      whileHover={{ y: -6 }}
      onClick={() => setExpanded(!expanded)}
      style={{
        background: 'rgba(255,255,255,0.015)',
        border: `1px solid ${item.color}15`,
        borderRadius: 14,
        padding: '28px 24px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${item.color}40`;
        e.currentTarget.style.boxShadow = `0 8px 40px ${item.color}12, inset 0 1px 0 ${item.color}18`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = `${item.color}15`;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${item.color}50, transparent)` }} />

      <div className="flex items-center justify-between mb-3">
        <span style={{ fontFamily: TELE, fontSize: 9, color: item.color, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          {item.codename}
        </span>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={14} color="#9CA3AF" />
        </motion.div>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `${item.color}10`, border: `1px solid ${item.color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconComp size={20} color={item.color} strokeWidth={1.5} />
        </div>
        <h3 style={{ fontFamily: SWISS, fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>{item.title}</h3>
      </div>

      <AnimatePresence>
        <motion.p
          style={{ fontFamily: SWISS, fontSize: 14, fontWeight: 300, color: '#E5E7EB', lineHeight: 1.8 }}
          animate={{ height: expanded ? 'auto' : 46, opacity: 1 }}
          transition={{ duration: 0.4, ease: EXPO }}
          className="overflow-hidden"
        >
          {item.body}
        </motion.p>
      </AnimatePresence>

      {!expanded && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, background: 'linear-gradient(transparent, #050505)' }} />
      )}
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   AUTO-RESOLUTION FLOW — Animated Pipeline
   ══════════════════════════════════════════ */
const FLOW_STEPS = [
  { label: 'Student Query', sub: 'WhatsApp / Portal', icon: '?' },
  { label: 'n8n Forensic', sub: 'SQL Diagnosis', icon: '>' },
  { label: 'Razorpay API', sub: 'Cross-Reference', icon: '~' },
  { label: 'SQL Update', sub: 'Autonomous Fix', icon: '+' },
  { label: 'Instant Reply', sub: 'Resolution Sent', icon: '!' },
];

const AutoResolutionFlow = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    let step = 0;
    const id = setInterval(() => {
      setActiveStep(step);
      step++;
      if (step >= FLOW_STEPS.length) {
        clearInterval(id);
        // Loop: reset after pause
        setTimeout(() => {
          setActiveStep(-1);
          setTimeout(() => {
            let s2 = 0;
            const id2 = setInterval(() => {
              setActiveStep(s2);
              s2++;
              if (s2 >= FLOW_STEPS.length) clearInterval(id2);
            }, 600);
          }, 800);
        }, 2000);
      }
    }, 600);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <div ref={ref} style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Desktop: horizontal flow */}
      <div className="hidden md:flex items-center justify-between" style={{ gap: 4 }}>
        {FLOW_STEPS.map((step, i) => {
          const active = i <= activeStep;
          const current = i === activeStep;
          return (
            <React.Fragment key={i}>
              <motion.div
                animate={{
                  scale: current ? 1.08 : 1,
                  borderColor: active ? A : 'rgba(255,255,255,0.08)',
                }}
                transition={{ type: 'spring', stiffness: 200 }}
                style={{
                  flex: '0 0 auto',
                  width: 140,
                  padding: '20px 12px',
                  borderRadius: 14,
                  background: active ? `${A}08` : 'rgba(255,255,255,0.015)',
                  border: `1.5px solid ${active ? A + '40' : 'rgba(255,255,255,0.08)'}`,
                  textAlign: 'center',
                  position: 'relative',
                  boxShadow: current ? `0 0 24px ${A}15` : 'none',
                  transition: 'background 0.3s, box-shadow 0.3s',
                }}
              >
                {active && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${A}60, transparent)` }} />
                )}
                <span style={{
                  fontFamily: TELE, fontSize: 20, color: active ? A : '#9CA3AF',
                  display: 'block', marginBottom: 8,
                  filter: current ? `drop-shadow(0 0 8px ${A})` : 'none',
                }}>
                  {step.icon}
                </span>
                <span style={{ fontFamily: SWISS, fontSize: 12, fontWeight: 600, color: active ? '#FFFFFF' : '#D1D5DB', display: 'block' }}>
                  {step.label}
                </span>
                <span style={{ fontFamily: TELE, fontSize: 8, color: active ? A : '#9CA3AF', letterSpacing: '0.08em', display: 'block', marginTop: 4 }}>
                  {step.sub}
                </span>
              </motion.div>

              {i < FLOW_STEPS.length - 1 && (
                <motion.div
                  animate={{ opacity: i < activeStep ? 1 : 0.2 }}
                  style={{ flex: '1 1 auto', height: 2, background: i < activeStep ? A : 'rgba(255,255,255,0.06)', borderRadius: 1, position: 'relative', overflow: 'hidden' }}
                >
                  {i < activeStep && (
                    <motion.div
                      style={{ position: 'absolute', top: -2, width: 6, height: 6, borderRadius: '50%', background: A, filter: `drop-shadow(0 0 4px ${A})` }}
                      animate={{ left: ['0%', '100%'] }}
                      transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile: vertical flow */}
      <div className="flex flex-col gap-3 md:hidden">
        {FLOW_STEPS.map((step, i) => {
          const active = i <= activeStep;
          return (
            <motion.div
              key={i}
              animate={{ borderColor: active ? A : 'rgba(255,255,255,0.08)' }}
              style={{
                padding: '16px 20px',
                borderRadius: 12,
                background: active ? `${A}08` : 'rgba(255,255,255,0.015)',
                border: `1.5px solid rgba(255,255,255,0.08)`,
                display: 'flex', alignItems: 'center', gap: 16,
              }}
            >
              <span style={{ fontFamily: TELE, fontSize: 18, color: active ? A : '#9CA3AF', flexShrink: 0 }}>{step.icon}</span>
              <div>
                <span style={{ fontFamily: SWISS, fontSize: 13, fontWeight: 600, color: active ? '#FFFFFF' : '#D1D5DB', display: 'block' }}>{step.label}</span>
                <span style={{ fontFamily: TELE, fontSize: 9, color: active ? A : '#9CA3AF' }}>{step.sub}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   PROACTIVE INTERVENTION CARD
   ══════════════════════════════════════════ */
const ProactiveCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.7, ease: EXPO }}
    whileHover={{ y: -4 }}
    style={{
      maxWidth: 680,
      margin: '0 auto',
      background: `${A}04`,
      border: `1px solid ${A}18`,
      borderRadius: 18,
      padding: '36px 32px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'border-color 0.3s, box-shadow 0.3s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = `${A}40`;
      e.currentTarget.style.boxShadow = `0 8px 40px ${A}12`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = `${A}18`;
      e.currentTarget.style.boxShadow = 'none';
    }}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${A}60, transparent)` }} />

    <div className="flex items-center gap-3 mb-5">
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${A}12`, border: `1px solid ${A}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <MessageSquare size={22} color={A} strokeWidth={1.5} />
      </div>
      <div>
        <span style={{ fontFamily: TELE, fontSize: 9, color: A, letterSpacing: '0.3em', textTransform: 'uppercase', display: 'block' }}>
          Proactive Layer
        </span>
        <h3 style={{ fontFamily: SWISS, fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>Preemptive Intervention</h3>
      </div>
    </div>

    <p style={{ fontFamily: SWISS, fontSize: 15, fontWeight: 300, color: '#E5E7EB', lineHeight: 1.85 }}>
      Payment failed twice? The system doesn't wait for the student to file a ticket. An <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>auto-triggered WhatsApp message</strong> sends a troubleshooting deep-link + a <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>5% "Frustration Discount"</strong> code. This converts a negative experience into a recovery moment — before the student even contacts support.
    </p>

    {/* Mini flow */}
    <div className="flex items-center gap-3 mt-6 flex-wrap">
      {['Payment Fails x2', 'Auto-Detect', 'WhatsApp Sent', '5% Discount', 'Recovery'].map((step, i) => (
        <React.Fragment key={i}>
          <motion.span
            style={{
              fontFamily: TELE, fontSize: 9, color: i === 4 ? A : '#D1D5DB',
              padding: '6px 12px', borderRadius: 6,
              background: i === 4 ? `${A}12` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${i === 4 ? A + '30' : 'rgba(255,255,255,0.06)'}`,
              letterSpacing: '0.05em', whiteSpace: 'nowrap',
            }}
            whileHover={{ scale: 1.05 }}
          >
            {step}
          </motion.span>
          {i < 4 && <span style={{ color: '#9CA3AF', fontSize: 10 }}>&rarr;</span>}
        </React.Fragment>
      ))}
    </div>
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
const CaseResolution = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const headerY = useTransform(smoothProgress, [0, 0.15], [0, -60]);
  const headerOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);

  return (
    <div className="relative w-full" style={{ background: '#050505' }}>

      {/* Ambient ombre */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `radial-gradient(ellipse 100% 60% at 50% 20%, ${A}10 0%, transparent 50%), radial-gradient(ellipse 80% 100% at 100% 70%, ${A}08 0%, transparent 50%)`
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
            <AlertTriangle size={14} color={A} />
            <span style={{ fontFamily: TELE, fontSize: 10, color: A, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
              Operation: AlmaBetter Resolution
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
              CSAT
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              style={{ fontFamily: SWISS, fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.04em', lineHeight: 1.0 }}
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, ease: EXPO, delay: 0.35 }}
            >
              Engineering
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            style={{ fontFamily: SWISS, fontSize: 'clamp(15px, 1.8vw, 19px)', fontWeight: 300, color: '#D1D5DB', maxWidth: 700, margin: '24px auto 0', lineHeight: 1.6 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EXPO, delay: 0.5 }}
          >
            Eliminating Support Friction through SQL Forensics and Automated Resolution Loops
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

        {/* Before/After Comparison */}
        <motion.div
          className="max-w-5xl mx-auto mt-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EXPO, delay: 0.3 }}
        >
          <BeforeAfterHero />
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
              Student enrollment surged but support couldn't keep up. <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>48+ hour wait</strong> for simple fixes. CSAT plummeted. We treated every support ticket as a bug report — performed <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>SQL Forensics</strong> on 10,000+ tickets, found <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>75% tied to just 3 database inconsistencies</strong>, and built automated Resolution Agents.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════ FRICTION MAP ════ */}
      <section className="relative z-10" style={{ padding: '60px 24px 80px' }}>
        <div className="max-w-5xl mx-auto">
          <motion.p
            className="text-center mb-14"
            style={{ fontFamily: TELE, fontSize: 10, color: '#D1D5DB', letterSpacing: '0.35em', textTransform: 'uppercase' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            [ Friction Map &mdash; The 3 Root Causes ]
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FRICTION_ITEMS.map((item, i) => (
              <FrictionCard key={item.id} item={item} delay={i * 0.12} />
            ))}
          </div>
        </div>
      </section>

      {/* ════ AUTO-RESOLUTION FLOW ════ */}
      <section className="relative z-10" style={{ padding: '60px 24px 80px' }}>
        <div className="max-w-5xl mx-auto">
          <motion.p
            className="text-center mb-14"
            style={{ fontFamily: TELE, fontSize: 10, color: '#D1D5DB', letterSpacing: '0.35em', textTransform: 'uppercase' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            [ Auto-Resolution Pipeline ]
          </motion.p>
          <AutoResolutionFlow />
        </div>
      </section>

      {/* ════ PROACTIVE INTERVENTION ════ */}
      <section className="relative z-10" style={{ padding: '40px 24px 80px' }}>
        <ProactiveCard />
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
              value="48h → <5m"
              label="Resolution Time"
              percent={96}
              delay={0}
              sublabel="From 48-hour manual triage to sub-5-minute automated diagnosis and fix. The three root causes are now resolved without human intervention."
            />
            <MetricBar
              value="3.2 → 4.7"
              label="CSAT Score"
              percent={88}
              delay={0.15}
              sublabel="Customer satisfaction surged from 3.2 to 4.7 out of 5.0 — driven by instant resolution and proactive frustration recovery."
            />
            <MetricBar
              value="-60%"
              label="Ticket Volume"
              percent={82}
              delay={0.3}
              sublabel="Automated resolution agents eliminated the majority of repetitive tickets. The remaining 40% are genuine edge cases requiring human judgment."
            />
            <MetricBar
              value="-70%"
              label="Cost per Ticket"
              percent={90}
              delay={0.45}
              sublabel="With 60% fewer tickets and instant resolution for the automated ones, the average cost per support interaction dropped by 70%."
            />
          </div>
        </div>
      </section>

      {/* ════ NAV FOOTER ════ */}
      <section className="relative z-10" style={{ padding: '40px 24px 120px', textAlign: 'center' }}>
        <div style={{ width: 40, height: 1, background: `${A}40`, margin: '0 auto 32px' }} />
        <Link
          to="/cases/the-universal-gtm-identity-registry"
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
          Next: Miles One <ArrowRight size={14} />
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

export default CaseResolution;
