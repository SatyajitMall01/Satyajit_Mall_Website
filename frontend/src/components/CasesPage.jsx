import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database, GitBranch, Fingerprint, BrainCircuit, Timer, Activity, TrendingUp, Link as LinkIcon, PieChart, Bot, Headphones, Radar, Cpu } from 'lucide-react';

const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const TELE  = "'Courier New', Courier, monospace";
const EXPO_OUT = [0.16, 1, 0.3, 1];

/* ── Cases Data ── */
const CASES_DATA = [
  {
    id: '01', slug: 'the-universal-gtm-identity-registry',
    codename: 'OPERATION: MILES ONE',
    title: 'Identity Genesis & Trust Architecture',
    tagline: 'Deterministic UUID minting at first touch',
    icon: 'Fingerprint',
    metrics: ['₹40 Cr+ Ecosystem', '25% Product-Led Sales'],
    description: 'Disrupted the Trust-Gap through Product-Led Growth. Miles One app mints deterministic UUIDs at first touch, transitioning anonymous prospects into Pre-heated leads via a Dummy LMS sandbox and Multi-Stage Lifecycle Engine.',
    accent: '#6366f1',
    gradient: 'linear-gradient(135deg, #0a0a1a 0%, #12182a 30%, #0f1424 60%, #0a0d1a 100%)',
    baseImage: '/Satyajit Website Assets/Miles One/Miles One.png',
    floaters: [
      { id: 'f1', icon: 'Database', text: 'UUID Genesis', top: '8%', left: '-6%', z: 80, delay: 0.4, anim: 'float' },
      { id: 'f2', icon: 'GitBranch', text: 'Dummy LMS', top: '42%', right: '-8%', z: 110, delay: 0.55, anim: 'spin' },
      { id: 'f3', icon: 'Fingerprint', text: '25% PLG Sales', top: '78%', left: '-3%', z: 140, delay: 0.7, anim: 'pulse' },
    ],
  },
  {
    id: '02', slug: 'behavioral-ott-architecture',
    codename: 'OPERATION: MILES MASTERCLASS',
    title: 'Behavioral Qualification Engine',
    tagline: 'Netflix-of-Education OTT platform',
    icon: 'BrainCircuit',
    metrics: ['30K+ Users', '2K+ Paid Subs', '40% Renewal'],
    description: 'Netflix-of-Education OTT platform solving the Commitment Gap. Subscription-based Commitment Filter with dark-mode bingeable UX, UUID Passport identity bridge, and precision behavioral telemetry driving a 40% renewal rate.',
    accent: '#3b82f6',
    gradient: 'linear-gradient(135deg, #080c1a 0%, #0e1a2e 30%, #0a1424 60%, #070a14 100%)',
    baseImage: '/Satyajit Website Assets/Masterclass/Miles Mastercalss.png',
    floaters: [
      { id: 'f1', icon: 'BrainCircuit', text: 'OTT Engine', top: '8%', right: '-6%', z: 80, delay: 0.4, anim: 'pulse' },
      { id: 'f2', icon: 'Timer', text: 'UUID Passport', top: '44%', left: '-8%', z: 110, delay: 0.55, anim: 'spin' },
      { id: 'f3', icon: 'Activity', text: '40% Renewal', top: '80%', right: '-4%', z: 140, delay: 0.7, anim: 'float' },
    ],
  },
  {
    id: '03', slug: 'the-attribution-recovery-engine',
    codename: 'OPERATION: MILES ENGAGE',
    title: 'The Attribution & Recovery Engine',
    tagline: 'Tokenized attribution + ROAS recovery',
    icon: 'TrendingUp',
    metrics: ['+20% ROAS', '-30% Ops Workload'],
    description: 'Eliminated the "Marketing Mirage" through a Deterministic Tokenized Architecture (tk=) and n8n-driven ROAS/ROCS financial loop. Killed "CSV Purgatory" with U-Shaped Attribution and real-time intent routing.',
    accent: '#10b981',
    gradient: 'linear-gradient(135deg, #0a1a14 0%, #0f2a1f 30%, #0a2018 60%, #080f0d 100%)',
    baseImage: '/Satyajit Website Assets/Miles LMS/Miles LMS.png',
    floaters: [
      { id: 'f1', icon: 'TrendingUp', text: '+20% ROAS',      top: '8%',  right: '-6%', z: 80,  delay: 0.4,  anim: 'float' },
      { id: 'f2', icon: 'Link',       text: 'tk= Token',      top: '44%', left: '-8%',  z: 110, delay: 0.55, anim: 'spin'  },
      { id: 'f3', icon: 'PieChart',   text: 'U-Shape Model',  top: '80%', right: '-4%', z: 140, delay: 0.7,  anim: 'pulse' },
    ],
  },
  {
    id: '04', slug: 'agentic-voice-qualification',
    codename: 'OPERATION: CEREBRO',
    title: 'The Sovereignty of Intelligence',
    tagline: 'On-prem voice AI on GCP / Vertex',
    icon: 'Cpu',
    metrics: ['-45% Middleware Costs', '100% Data Sovereignty'],
    description: 'Internalized the "Brain" and "Voice" onto GCP for Technical Sovereignty. Forensic Identity Handshake with UIR in 800ms, Vertex AI reasoning, vectorized RAG, and ElevenLabs token streaming.',
    accent: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #120a1a 0%, #1a0f2a 30%, #140a20 60%, #0d080f 100%)',
  },
  {
    id: '05', slug: 'transactional-llm-orchestration',
    codename: 'OPERATION: ACTION AGENTS',
    title: 'Transactional LLM Orchestration',
    tagline: 'Goal-oriented agents with circuit breakers',
    icon: 'Bot',
    metrics: ['+25% Self-Service', 'Zero Duplicates'],
    description: 'Goal-oriented agents using Function-Calling patterns and a Redis Circuit Breaker to perform real-world transactions — bookings, CRM updates, reporting.',
    accent: '#ec4899',
    gradient: 'linear-gradient(135deg, #1a0a14 0%, #2a0f1e 30%, #1a0a18 60%, #0f080d 100%)',
  },
  {
    id: '06', slug: 'product-data-unification',
    codename: 'OPERATION: MILES ONE ANALYTICS',
    title: 'Product Data Unification',
    tagline: 'GA4 + Firebase + Appsflyer → BigQuery',
    icon: 'PieChart',
    metrics: ['100% Cross-Platform', '+15% CPA Conversion'],
    description: 'Unified GA4, Firebase, and Appsflyer into BigQuery using the miles_uuid as the identity glue — solving cross-platform attribution blindness.',
    accent: '#06b6d4',
    gradient: 'linear-gradient(135deg, #0a1418 0%, #0f1e2a 30%, #0a1820 60%, #080d0f 100%)',
  },
  {
    id: '07', slug: 'ott-product-forensics',
    codename: 'OPERATION: MASTERCLASS ANALYTICS',
    title: 'OTT Product Forensics',
    tagline: 'Heartbeat telemetry + intent scoring',
    icon: 'Radar',
    metrics: ['+22% Module Completion', '2K+ Paid Enrollments'],
    description: 'Behavioral stream analysis on 10-second heartbeat pings. Built an Intent Score model and contextual nudges that converted viewers into customers.',
    accent: '#f97316',
    gradient: 'linear-gradient(135deg, #1a120a 0%, #2a1a0f 30%, #1a1508 60%, #0f0d08 100%)',
  },
  {
    id: '08', slug: 'csat-engineering',
    codename: 'OPERATION: ALMABETTER RESOLUTION',
    title: 'CSAT Engineering',
    tagline: 'SQL forensics \u2192 auto-resolution agents',
    icon: 'Headphones',
    metrics: ['48hrs \u2192 <5min', '3.2 \u2192 4.7 CSAT'],
    description: 'SQL Forensics on 10,000+ tickets found 75% tied to 3 database inconsistencies. Built automated Resolution Agents that fix issues before students even complain.',
    accent: '#14b8a6',
    gradient: 'linear-gradient(135deg, #0a1a16 0%, #0f2a22 30%, #0a201a 60%, #080f0d 100%)',
  },
];

/* ── XHair ── */
const XHair = ({ size = 14, color = 'currentColor' }) => (
  <span style={{ display: 'inline-block', position: 'relative', width: size, height: size, flexShrink: 0 }}>
    <span style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: color, transform: 'translateY(-50%)' }} />
    <span style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: color, transform: 'translateX(-50%)' }} />
  </span>
);

/* ═══════════════════════════════════════════
   MOBILE CASES VIEW — Omnidirectional Spatial Canvas
   Massive randomized tile-field. Cases repeat across canvas.
   ═══════════════════════════════════════════ */

const TILE_COUNT = 200;

// Aspect ratio pool — mix of square, landscape, portrait (TikTok-grid feel)
const RATIO_POOL = [
  'aspect-square',
  'aspect-square',
  'aspect-square',
  'aspect-[9/16]',
  'aspect-[9/16]',
  'aspect-video',
  'aspect-[4/5]',
  'aspect-[3/4]',
];

// Icon map for tile rendering (string → component)
const ICON_MAP = {
  Database, GitBranch, Fingerprint, BrainCircuit, Timer, Activity,
  TrendingUp, LinkIcon, PieChart, Bot, Headphones, Radar, Cpu,
};

// Per-icon composite animation — icon layer + optional ring/halo layer.
// Animations are context-specific: scan rings on Fingerprint, sweep on Radar,
// neural flicker on Brain, audio pulse on Headphones, etc.
const ICON_FX = {
  // Identity Genesis — biometric scan rings expand outward
  Fingerprint: {
    icon: { animate: { scale: [1, 1.04, 1], opacity: [0.85, 1, 0.85] }, transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } },
    ring: { animate: { scale: [0.5, 1.7], opacity: [0.55, 0] },         transition: { duration: 2.4, repeat: Infinity, ease: 'easeOut' } },
  },
  // Behavioral Qualification — synaptic firing, irregular flicker
  BrainCircuit: {
    icon: { animate: { opacity: [0.65, 1, 0.5, 1, 0.85, 1], scale: [1, 1.02, 1, 1.03, 1] }, transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } },
    ring: null,
  },
  // Attribution Recovery — upward bounce, rising trend
  TrendingUp: {
    icon: { animate: { y: [3, -5, 3], scale: [0.96, 1.04, 0.96] }, transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } },
    ring: null,
  },
  // Voice AI Sovereignty — CPU throb + data pulse halo
  Cpu: {
    icon: { animate: { scale: [1, 1.07, 1] }, transition: { duration: 1.3, repeat: Infinity, ease: 'easeInOut' } },
    ring: { animate: { scale: [0.7, 1.4], opacity: [0.65, 0] }, transition: { duration: 1.3, repeat: Infinity, ease: 'easeOut' } },
  },
  // Action Agents — robot wobble + nod
  Bot: {
    icon: { animate: { rotate: [-5, 5, -5, 0, 0], y: [0, 0, 0, 2, 0] }, transition: { duration: 2.4, repeat: Infinity, times: [0, 0.2, 0.4, 0.65, 1], ease: 'easeInOut' } },
    ring: null,
  },
  // Data Unification — segments rotating slowly
  PieChart: {
    icon: { animate: { rotate: [0, 360] }, transition: { duration: 14, repeat: Infinity, ease: 'linear' } },
    ring: null,
  },
  // Forensics — radar sweep with expanding ping
  Radar: {
    icon: { animate: { rotate: [0, 360] }, transition: { duration: 2.8, repeat: Infinity, ease: 'linear' } },
    ring: { animate: { scale: [0.4, 1.5], opacity: [0.7, 0] }, transition: { duration: 2.8, repeat: Infinity, ease: 'easeOut' } },
  },
  // CSAT — audio pulse beat + outward wave
  Headphones: {
    icon: { animate: { scale: [1, 1.06, 1, 1.04, 1] }, transition: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' } },
    ring: { animate: { scale: [0.65, 1.35], opacity: [0.6, 0] }, transition: { duration: 1.1, repeat: Infinity, ease: 'easeOut' } },
  },
};

// Forensic site palette — red-blood + cool-dark backdrop (matches Informants/Dossier)
const RED        = '#dc2626';
const RED_BRIGHT = '#ef4444';
const RED_DIM    = 'rgba(220,38,38,0.55)';
const CARD_BG    = 'rgba(11,18,34,0.85)';
const CARD_BORDER = 'rgba(55,65,81,0.45)';

const MobileCasesView = () => {
  const viewportRef = useRef(null);

  // Build tile field via bag-shuffle + sliding-window guard.
  // Algorithm: pull from shuffled bag, but skip any case that appeared in
  // the last RECENT_K tiles. Guarantees no repeat within window of K+1.
  // With K = N-2 = 6, every 7 consecutive tiles have 7 distinct cases.
  const tiles = React.useMemo(() => {
    const arr = [];
    const N = CASES_DATA.length;
    const RECENT_K = Math.max(1, N - 2); // = 6 for N=8
    let bag = [];
    const recent = [];

    const refillBag = () => {
      bag = Array.from({ length: N }, (_, k) => k);
      for (let k = bag.length - 1; k > 0; k--) {
        const j = Math.floor(Math.random() * (k + 1));
        [bag[k], bag[j]] = [bag[j], bag[k]];
      }
    };

    for (let i = 0; i < TILE_COUNT; i++) {
      if (bag.length === 0) refillBag();

      // Pick first bag item not in recent[] (search from top)
      let pickIdx = -1;
      for (let b = bag.length - 1; b >= 0; b--) {
        if (!recent.includes(bag[b])) {
          pickIdx = b;
          break;
        }
      }
      // Fallback (impossible when bag.length > RECENT_K, but guard anyway)
      if (pickIdx === -1) pickIdx = bag.length - 1;

      const idx = bag[pickIdx];
      bag.splice(pickIdx, 1);
      recent.push(idx);
      if (recent.length > RECENT_K) recent.shift();

      arr.push({
        key: i,
        caseData: CASES_DATA[idx],
        ratio: RATIO_POOL[Math.floor(Math.random() * RATIO_POOL.length)],
      });
    }
    return arr;
  }, []);

  // Center-drop on mount → user spawns at canvas center, can scroll any direction
  useEffect(() => {
    if (viewportRef.current) {
      const { scrollWidth, scrollHeight, clientWidth, clientHeight } = viewportRef.current;
      viewportRef.current.scrollTo({
        left: (scrollWidth - clientWidth) / 2,
        top: (scrollHeight - clientHeight) / 2,
        behavior: 'instant',
      });
    }
  }, []);

  return (
    <>
      {/* ═══ FIXED HEADER OVERLAY — pinned above spatial canvas ═══ */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-30 pointer-events-none px-4 pt-3 pb-6"
        style={{
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.7) 50%, rgba(5,5,5,0) 100%)',
        }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-1">
            <div style={{ width: 16, height: 1, background: 'rgba(220,38,38,0.55)' }} />
            <span
              style={{
                fontFamily: TELE, fontSize: 8, fontWeight: 600,
                color: 'rgba(220,38,38,0.85)', letterSpacing: '0.35em', textTransform: 'uppercase',
              }}
            >
              Case Archives
            </span>
            <div style={{ width: 16, height: 1, background: 'rgba(220,38,38,0.55)' }} />
          </div>
          <h1
            style={{
              fontFamily: SWISS, fontSize: 22, fontWeight: 700,
              color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1, margin: 0,
            }}
          >
            The Cases
          </h1>
        </div>
      </div>

    <div
      ref={viewportRef}
      id="spatial-viewport"
      className="fixed inset-0 w-screen h-[100dvh] bg-[#050505] overflow-auto touch-pan-x touch-pan-y block md:hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      <div className="w-[400vw] sm:w-[350vw] p-3">
        <div className="columns-8 sm:columns-6 gap-2 w-full">
          {tiles.map(({ key, caseData: c, ratio }) => {
            const Icon = ICON_MAP[c.icon] || Database;
            const fx = ICON_FX[c.icon] || ICON_FX.Fingerprint;
            return (
              <Link
                key={key}
                to={`/cases/${c.slug}`}
                className={`${ratio} block mb-2 break-inside-avoid relative overflow-hidden rounded-md active:scale-[0.96] transition-transform`}
                style={{
                  background: CARD_BG,
                  border: `1px solid ${CARD_BORDER}`,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
                  containerType: 'inline-size',
                }}
              >
                {/* Neo-retro scanline overlay — subtle horizontal lines */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.06]"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, #ffffff 2px, #ffffff 3px)',
                  }}
                />

                {/* Top accent strip (red, thin) */}
                <div
                  className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                  style={{ background: RED_DIM }}
                />

                {/* Crosshair brackets — corners */}
                <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l pointer-events-none" style={{ borderColor: RED_DIM }} />
                <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r pointer-events-none" style={{ borderColor: RED_DIM }} />
                <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l pointer-events-none" style={{ borderColor: RED_DIM }} />
                <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r pointer-events-none" style={{ borderColor: RED_DIM }} />

                {/* Case number — TELE mono, top-center small */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none">
                  <span
                    style={{
                      fontFamily: TELE, fontSize: 7, fontWeight: 700,
                      color: 'rgba(220,38,38,0.85)', letterSpacing: '0.35em', textTransform: 'uppercase',
                    }}
                  >
                    CASE · {c.id}
                  </span>
                </div>

                {/* HERO ICON — composite stack (ring + icon), context-animated */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingBottom: '30%' }}>
                  <div
                    style={{
                      position: 'relative',
                      width: 'clamp(26px, 22cqmin, 56px)',
                      height: 'clamp(26px, 22cqmin, 56px)',
                    }}
                  >
                    {/* Outer ring layer — pulse/sweep/scan */}
                    {fx.ring && (
                      <motion.div
                        animate={fx.ring.animate}
                        transition={fx.ring.transition}
                        style={{
                          position: 'absolute',
                          inset: '-20%',
                          borderRadius: '50%',
                          border: `1px solid ${RED}`,
                          boxShadow: `0 0 8px ${RED}60`,
                        }}
                      />
                    )}
                    {/* Icon layer */}
                    <motion.div
                      animate={fx.icon.animate}
                      transition={fx.icon.transition}
                      style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: RED_BRIGHT,
                        filter: 'drop-shadow(0 0 10px rgba(220,38,38,0.5))',
                      }}
                    >
                      <Icon size="100%" strokeWidth={1.4} />
                    </motion.div>
                  </div>
                </div>

                {/* Bottom content block: title + tagline */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-2.5 pt-6 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to top, rgba(6,8,12,0.98) 0%, rgba(11,18,34,0.6) 75%, transparent 100%)',
                  }}
                >
                  <div className="h-px mb-1.5 w-6" style={{ background: RED }} />
                  <p
                    style={{
                      fontFamily: SWISS, fontSize: 11, fontWeight: 700,
                      color: '#F3F4F6', letterSpacing: '-0.01em', lineHeight: 1.15,
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {c.title}
                  </p>
                  <p
                    style={{
                      fontFamily: TELE, fontSize: 8, fontWeight: 400,
                      color: 'rgba(209, 213, 219, 0.7)',
                      letterSpacing: '0.04em', lineHeight: 1.3,
                      marginTop: 4, marginBottom: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {c.tagline}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
};

/* ═══════════════════════════════════════════
   CASES PAGE — Sticky Stacked Scroll + Snap
   ═══════════════════════════════════════════ */
const CasesPage = () => {
  // Mobile detection
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (isMobile) return <MobileCasesView />;

  return <DesktopCasesView />;
};

const DesktopCasesView = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  /* Image animation states — outgoing cards fade immediately to prevent blending */
  const getImageStyle = (index) => {
    if (index === activeIndex) {
      return { scale: 1, y: 0, opacity: 1, zIndex: 10 };
    }
    if (index === activeIndex - 1) {
      // Just-left card: shrink + fade fast
      return { scale: 0.92, y: -40, opacity: 0, zIndex: 5 };
    }
    if (index < activeIndex) {
      return { scale: 0.85, y: -60, opacity: 0, zIndex: 0 };
    }
    // Below viewport — waiting to enter
    return { scale: 0.88, y: 200, opacity: 0, zIndex: 0 };
  };

  return (
    <div
      className="relative w-full"
      style={{ background: '#050505' }}
    >
      {/* ── Ambient background ombre — fills entire page, shifts with active project ── */}
      {CASES_DATA.map((c, i) => (
        <motion.div
          key={c.id}
          className="fixed inset-0 pointer-events-none z-0"
          animate={{ opacity: i === activeIndex ? 1 : 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 25% 50%, ${c.accent}18 0%, transparent 50%),
              radial-gradient(ellipse 80% 100% at 0% 80%, ${c.accent}12 0%, transparent 50%),
              radial-gradient(ellipse 60% 60% at 50% 0%, ${c.accent}0A 0%, transparent 60%),
              linear-gradient(to bottom, #050505 0%, ${c.accent}06 50%, #050505 100%)
            `,
          }}
        />
      ))}

      {/* ── Compact Page Header ── */}
      <motion.div
        className="relative z-10 text-center"
        style={{ padding: '100px 24px 40px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EXPO_OUT }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div style={{ width: 32, height: 1, background: 'rgba(220,38,38,0.5)' }} />
          <span style={{
            fontFamily: TELE, fontSize: 10, fontWeight: 600,
            color: 'rgba(220,38,38,0.7)', letterSpacing: '0.45em',
            textTransform: 'uppercase',
          }}>
            Case Archives
          </span>
          <div style={{ width: 32, height: 1, background: 'rgba(220,38,38,0.5)' }} />
        </div>

        <h1 style={{
          fontFamily: SWISS, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700,
          color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.05,
        }}>
          The Cases
        </h1>

        <p style={{
          fontFamily: TELE, fontSize: 13, color: '#D1D5DB',
          letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 12,
        }}>
          System builds &mdash; from chaos to architecture
        </p>
      </motion.div>

      {/* ── Split-Screen Grid ── */}
      <div className="relative z-10" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* ── Left: Sticky Image Visualizer with 3D Perspective ── */}
          <div className="hidden md:block">
            <div className="sticky top-0 h-screen flex items-center justify-center p-6">
              <div style={{ perspective: '1200px', position: 'relative', width: '100%', maxWidth: 480, aspectRatio: '3/4' }}>
                {CASES_DATA.map((c, i) => {
                  const s = getImageStyle(i);
                  const isActive = i === activeIndex;
                  const hasImage = !!c.baseImage;
                  const hasFloaters = !!c.floaters;
                  const IconMap = { Database, GitBranch, Fingerprint, BrainCircuit, Timer, Activity, TrendingUp, Link: LinkIcon, PieChart };

                  return (
                    <motion.div
                      key={c.id}
                      animate={{
                        scale: isActive ? 1 : s.scale,
                        y: isActive ? 0 : s.y,
                        opacity: isActive ? 1 : s.opacity,
                        rotateX: isActive && hasImage ? 5 : 0,
                        rotateY: isActive && hasImage ? -8 : 0,
                      }}
                      transition={{
                        type: 'spring', stiffness: 100, damping: 20, mass: 0.9,
                        opacity: { duration: 0.4, ease: 'easeOut' },
                      }}
                      style={{
                        position: 'absolute', inset: 0,
                        zIndex: s.zIndex,
                        borderRadius: hasImage ? 22 : 18,
                        overflow: 'visible',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {hasImage ? (
                        /* ── 3D Image Hero Card ── */
                        <>
                          <div style={{
                            width: '100%', height: '100%',
                            position: 'relative',
                            background: '#050505',
                            border: `1px solid ${isActive ? c.accent + '25' : 'rgba(55,65,81,0.2)'}`,
                            borderRadius: 22,
                            overflow: 'hidden',
                            boxShadow: isActive
                              ? `0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px ${c.accent}15`
                              : '0 10px 30px rgba(0,0,0,0.4)',
                            transition: 'box-shadow 0.6s ease, border-color 0.6s ease',
                          }}>
                            <img
                              src={c.baseImage}
                              alt={c.title}
                              style={{
                                width: '100%', height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                              }}
                            />
                            {/* Bottom vignette */}
                            <div style={{
                              position: 'absolute', inset: 0,
                              background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 100%)',
                              pointerEvents: 'none',
                            }} />
                            {/* Case number */}
                            <span style={{
                              position: 'absolute', bottom: 16, left: 20,
                              fontFamily: TELE, fontSize: 10, fontWeight: 600,
                              color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em',
                            }}>
                              {c.id} / 08
                            </span>
                            {/* Top accent line */}
                            <motion.div
                              animate={{ scaleX: isActive ? 1 : 0 }}
                              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                              style={{
                                position: 'absolute', top: 0, left: 0, right: 0,
                                height: 2, background: c.accent, transformOrigin: 'left',
                              }}
                            />
                            <Link
                              to={`/cases/${c.slug}`}
                              style={{ position: 'absolute', inset: 0, zIndex: 5, cursor: 'pointer' }}
                              aria-label={`View ${c.title} case study`}
                            />
                          </div>

                          {/* ── Floating 3D Chips — pop out from the card surface ── */}
                          {hasFloaters && c.floaters.map(f => {
                            const Icon = IconMap[f.icon] || Database;
                            // Per-icon looping animation
                            const iconAnim = f.anim === 'float'
                              ? { y: [0, -6, 0] }
                              : f.anim === 'spin'
                                ? { rotate: [0, 360] }
                                : { scale: [1, 1.2, 1] }; // pulse
                            const iconTransition = f.anim === 'spin'
                              ? { duration: 8, repeat: Infinity, ease: 'linear' }
                              : { duration: 3, repeat: Infinity, ease: 'easeInOut' };

                            return (
                              <motion.div
                                key={f.id}
                                initial={{ opacity: 0, scale: 0.5, z: 0 }}
                                animate={
                                  isActive
                                    ? { opacity: 1, scale: 1, z: f.z }
                                    : { opacity: 0, scale: 0.5, z: 0 }
                                }
                                transition={{
                                  delay: isActive ? f.delay : 0,
                                  type: 'spring', stiffness: 140, damping: 16,
                                }}
                                style={{
                                  position: 'absolute',
                                  top: f.top, left: f.left, right: f.right,
                                  transformStyle: 'preserve-3d',
                                  pointerEvents: 'none', zIndex: 50,
                                }}
                              >
                                <div style={{
                                  display: 'flex', alignItems: 'center', gap: 10,
                                  padding: '8px 16px 8px 8px',
                                  background: 'rgba(6,6,12,0.85)',
                                  border: `1px solid ${c.accent}35`,
                                  borderRadius: 999,
                                  boxShadow: `0 20px 50px rgba(0,0,0,0.75), 0 0 30px ${c.accent}18`,
                                  backdropFilter: 'blur(16px)',
                                  WebkitBackdropFilter: 'blur(16px)',
                                }}>
                                  {/* Larger icon with its own animation */}
                                  <motion.div
                                    animate={isActive ? iconAnim : {}}
                                    transition={iconTransition}
                                    style={{
                                      width: 36, height: 36, borderRadius: '50%',
                                      background: `linear-gradient(135deg, ${c.accent}, ${c.accent}aa)`,
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      flexShrink: 0,
                                      boxShadow: `0 4px 16px ${c.accent}50`,
                                    }}
                                  >
                                    <Icon size={18} color="#fff" strokeWidth={2} />
                                  </motion.div>
                                  <span style={{
                                    fontFamily: SWISS, fontSize: 12, fontWeight: 600,
                                    color: '#FFFFFF', letterSpacing: '0.02em',
                                    whiteSpace: 'nowrap',
                                  }}>
                                    {f.text}
                                  </span>
                                </div>
                              </motion.div>
                            );
                          })}
                        </>
                      ) : (
                        /* ── Gradient Card — text-based for cases without images ── */
                        <div style={{
                          width: '100%', height: '100%',
                          borderRadius: 18,
                          overflow: 'hidden',
                          background: '#0A0A0A',
                          border: `1px solid ${isActive ? c.accent + '30' : 'rgba(55,65,81,0.3)'}`,
                          boxShadow: isActive
                            ? `0 30px 80px rgba(0,0,0,0.7), 0 0 120px ${c.accent}10`
                            : '0 10px 30px rgba(0,0,0,0.4)',
                        }}>
                          <div style={{
                            width: '100%', height: '100%',
                            background: c.gradient,
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            position: 'relative',
                          }}>
                            {/* Watermark */}
                            <span style={{
                              fontFamily: SWISS, fontSize: 180, fontWeight: 900,
                              color: 'rgba(255,255,255,0.025)', lineHeight: 1,
                              position: 'absolute', top: '50%', left: '50%',
                              transform: 'translate(-50%,-50%)',
                            }}>
                              {c.id}
                            </span>
                            {/* Glow orb */}
                            <div style={{
                              position: 'absolute', top: '30%', left: '50%',
                              transform: 'translate(-50%,-50%)',
                              width: 200, height: 200, borderRadius: '50%',
                              background: `radial-gradient(circle, ${c.accent}12 0%, transparent 70%)`,
                              filter: 'blur(40px)', pointerEvents: 'none',
                            }} />
                            {/* Codename */}
                            <span style={{
                              fontFamily: TELE, fontSize: 11, fontWeight: 600,
                              color: c.accent, letterSpacing: '0.3em',
                              textTransform: 'uppercase', position: 'relative', zIndex: 2,
                            }}>
                              {c.codename}
                            </span>
                            {/* Title */}
                            <span style={{
                              fontFamily: SWISS, fontSize: 24, fontWeight: 700,
                              color: '#FFFFFF', marginTop: 16, textAlign: 'center',
                              position: 'relative', zIndex: 2, padding: '0 32px',
                              lineHeight: 1.2,
                            }}>
                              {c.title}
                            </span>
                            {/* Metrics */}
                            <div style={{
                              display: 'flex', gap: 8, marginTop: 24,
                              position: 'relative', zIndex: 2,
                            }}>
                              {c.metrics.map(m => (
                                <span key={m} style={{
                                  fontFamily: TELE, fontSize: 10,
                                  color: '#E5E7EB', letterSpacing: '0.05em',
                                  border: `1px solid ${c.accent}30`,
                                  padding: '5px 12px', borderRadius: 9999,
                                }}>
                                  {m}
                                </span>
                              ))}
                            </div>
                            {/* Corner brackets */}
                            <div className="absolute top-5 left-5 w-5 h-5 border-t border-l" style={{ borderColor: c.accent + '35' }} />
                            <div className="absolute top-5 right-5 w-5 h-5 border-t border-r" style={{ borderColor: c.accent + '35' }} />
                            <div className="absolute bottom-5 left-5 w-5 h-5 border-b border-l" style={{ borderColor: c.accent + '35' }} />
                            <div className="absolute bottom-5 right-5 w-5 h-5 border-b border-r" style={{ borderColor: c.accent + '35' }} />
                            {/* Serial */}
                            <span style={{
                              position: 'absolute', bottom: 20, left: 0, right: 0,
                              textAlign: 'center', fontFamily: TELE, fontSize: 9,
                              color: '#D1D5DB', letterSpacing: '0.35em', textTransform: 'uppercase',
                            }}>
                              Case File #{c.id}
                            </span>
                            {/* Clickable */}
                            <Link
                              to={`/cases/${c.slug}`}
                              style={{ position: 'absolute', inset: 0, zIndex: 5, cursor: 'pointer' }}
                              aria-label={`View ${c.title} case study`}
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Right: Scrollable Intel ── */}
          <div style={{ display: 'flex', flexDirection: 'column', padding: '96px 0' }}>
            {CASES_DATA.map((c, i) => (
              <motion.div
                key={c.id}
                className="snap-center"
                style={{
                  minHeight: '100vh',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  padding: '0 clamp(0px, 2vw, 48px)',
                }}
                initial={{ opacity: 0.2, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                onViewportEnter={() => setActiveIndex(i)}
                viewport={{ margin: '-40% 0px -40% 0px', amount: 0.1 }}
                transition={{ duration: 0.6, ease: EXPO_OUT }}
              >
                {/* Serial + Codename */}
                <div className="flex items-center gap-2 mb-5">
                  <XHair size={10} color={c.accent + '90'} />
                  <span style={{
                    fontFamily: TELE, fontSize: 11,
                    color: c.accent, letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                  }}>
                    {c.codename}
                  </span>
                </div>

                {/* Title */}
                <h2 style={{
                  fontFamily: SWISS,
                  fontSize: 'clamp(28px, 4vw, 48px)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  margin: '0 0 28px',
                }}>
                  {c.title}
                </h2>

                {/* Metrics pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
                  {c.metrics.map(m => (
                    <span
                      key={m}
                      style={{
                        fontFamily: TELE, fontSize: 12, fontWeight: 500,
                        color: '#F3F4F6', letterSpacing: '0.05em',
                        border: '1px solid rgba(75,85,99,0.5)',
                        background: 'rgba(255,255,255,0.04)',
                        padding: '8px 18px',
                        borderRadius: 9999,
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p style={{
                  fontFamily: SWISS, fontSize: 18, fontWeight: 300,
                  color: '#E5E7EB', lineHeight: 1.85,
                  maxWidth: 520,
                }}>
                  {c.description}
                </p>

                {/* View case CTA + index */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 40 }}>
                  <Link
                    to={`/cases/${c.slug}`}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      fontFamily: TELE, fontSize: 11, fontWeight: 600,
                      color: c.accent, letterSpacing: '0.18em', textTransform: 'uppercase',
                      padding: '10px 22px',
                      border: `1px solid ${c.accent}40`,
                      borderRadius: 6,
                      background: `${c.accent}08`,
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = `${c.accent}18`;
                      e.currentTarget.style.borderColor = `${c.accent}70`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = `${c.accent}08`;
                      e.currentTarget.style.borderColor = `${c.accent}40`;
                    }}
                  >
                    <XHair size={8} color={c.accent} />
                    View Full Case &rarr;
                  </Link>
                  <span style={{
                    fontFamily: TELE, fontSize: 9,
                    color: '#D1D5DB', letterSpacing: '0.25em',
                  }}>
                    {String(i + 1).padStart(2, '0')} / {String(CASES_DATA.length).padStart(2, '0')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div style={{ textAlign: 'center', padding: '80px 24px 120px' }}>
        <p style={{
          fontFamily: TELE, fontSize: 10, fontWeight: 600,
          color: '#D1D5DB', letterSpacing: '0.35em',
          textTransform: 'uppercase', marginBottom: 20,
        }}>
          More cases in progress
        </p>
        <a
          href="/dossier"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontFamily: TELE, fontSize: 11, fontWeight: 600,
            color: '#dc2626', letterSpacing: '0.2em', textTransform: 'uppercase',
            padding: '12px 28px',
            border: '1px solid rgba(220,38,38,0.35)',
            borderRadius: 6,
            background: 'rgba(220,38,38,0.06)',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(220,38,38,0.12)';
            e.currentTarget.style.borderColor = 'rgba(220,38,38,0.6)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(220,38,38,0.06)';
            e.currentTarget.style.borderColor = 'rgba(220,38,38,0.35)';
          }}
        >
          <XHair size={10} color="#dc2626" />
          View Full Dossier
        </a>

        <p style={{
          fontFamily: TELE, fontSize: 8,
          color: '#D1D5DB', letterSpacing: '0.4em',
          textTransform: 'uppercase', marginTop: 32,
        }}>
          End of case archives &mdash; all records verified
        </p>
      </div>
    </div>
  );
};

export default CasesPage;
