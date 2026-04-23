import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database, GitBranch, Fingerprint, BrainCircuit, Timer, Activity } from 'lucide-react';

const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const TELE  = "'Courier New', Courier, monospace";
const EXPO_OUT = [0.16, 1, 0.3, 1];

/* ── Cases Data ── */
const CASES_DATA = [
  {
    id: '01', slug: 'the-universal-gtm-identity-registry',
    codename: 'OPERATION: MILES ONE',
    title: 'Identity Genesis & Trust Architecture',
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
    metrics: ['+20% ROAS', '-30% Ops Workload'],
    description: 'Eliminated the "Marketing Mirage" through a Deterministic Tokenized Architecture (tk=) and n8n-driven ROAS/ROCS financial loop. Killed "CSV Purgatory" with U-Shaped Attribution and real-time intent routing.',
    accent: '#10b981',
    gradient: 'linear-gradient(135deg, #0a1a14 0%, #0f2a1f 30%, #0a2018 60%, #080f0d 100%)',
  },
  {
    id: '04', slug: 'agentic-voice-qualification',
    codename: 'OPERATION: CEREBRO',
    title: 'The Sovereignty of Intelligence',
    metrics: ['-45% Middleware Costs', '100% Data Sovereignty'],
    description: 'Internalized the "Brain" and "Voice" onto GCP for Technical Sovereignty. Forensic Identity Handshake with UIR in 800ms, Vertex AI reasoning, vectorized RAG, and ElevenLabs token streaming.',
    accent: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #120a1a 0%, #1a0f2a 30%, #140a20 60%, #0d080f 100%)',
  },
  {
    id: '05', slug: 'transactional-llm-orchestration',
    codename: 'OPERATION: ACTION AGENTS',
    title: 'Transactional LLM Orchestration',
    metrics: ['+25% Self-Service', 'Zero Duplicates'],
    description: 'Goal-oriented agents using Function-Calling patterns and a Redis Circuit Breaker to perform real-world transactions — bookings, CRM updates, reporting.',
    accent: '#ec4899',
    gradient: 'linear-gradient(135deg, #1a0a14 0%, #2a0f1e 30%, #1a0a18 60%, #0f080d 100%)',
  },
  {
    id: '06', slug: 'product-data-unification',
    codename: 'OPERATION: MILES ONE ANALYTICS',
    title: 'Product Data Unification',
    metrics: ['100% Cross-Platform', '+15% CPA Conversion'],
    description: 'Unified GA4, Firebase, and Appsflyer into BigQuery using the miles_uuid as the identity glue — solving cross-platform attribution blindness.',
    accent: '#06b6d4',
    gradient: 'linear-gradient(135deg, #0a1418 0%, #0f1e2a 30%, #0a1820 60%, #080d0f 100%)',
  },
  {
    id: '07', slug: 'ott-product-forensics',
    codename: 'OPERATION: MASTERCLASS ANALYTICS',
    title: 'OTT Product Forensics',
    metrics: ['+22% Module Completion', '2K+ Paid Enrollments'],
    description: 'Behavioral stream analysis on 10-second heartbeat pings. Built an Intent Score model and contextual nudges that converted viewers into customers.',
    accent: '#f97316',
    gradient: 'linear-gradient(135deg, #1a120a 0%, #2a1a0f 30%, #1a1508 60%, #0f0d08 100%)',
  },
  {
    id: '08', slug: 'csat-engineering',
    codename: 'OPERATION: ALMABETTER RESOLUTION',
    title: 'CSAT Engineering',
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
   CASES PAGE — Sticky Stacked Scroll + Snap
   ═══════════════════════════════════════════ */
const CasesPage = () => {
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
                  const IconMap = { Database, GitBranch, Fingerprint, BrainCircuit, Timer, Activity };

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
