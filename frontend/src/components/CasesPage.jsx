import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const TELE  = "'Courier New', Courier, monospace";
const EXPO_OUT = [0.16, 1, 0.3, 1];

/* ── Cases Data ── */
const CASES_DATA = [
  {
    id: '01', slug: 'the-universal-gtm-identity-registry',
    codename: 'OPERATION: MILES ONE',
    title: 'The Universal GTM Identity Registry',
    metrics: ['₹20 Cr+ Revenue', '40K+ Unified Learners'],
    description: 'Engineered a Universal Identity Registry at the SSO entry-gate, consolidating fragmented funnels into a single deterministic pipeline — eliminating duplicate acquisition costs.',
    accent: '#6366f1',
    gradient: 'linear-gradient(135deg, #0a0a1a 0%, #12182a 30%, #0f1424 60%, #0a0d1a 100%)',
    baseImage: '/Satyajit Website Assets/Miles One/Miles One.png',
    floatingElements: [
      { id: 'f1', text: 'PostgreSQL Backbone', top: '12%', left: '-8%', delay: 1.5 },
      { id: 'f2', text: 'n8n Workflow', top: '65%', right: '-10%', delay: 1.7 },
      { id: 'f3', text: 'Global UUID', top: '78%', left: '3%', delay: 1.9 },
    ],
  },
  {
    id: '02', slug: 'behavioral-ott-architecture',
    codename: 'OPERATION: MILES MASTERCLASS',
    title: 'Behavioral OTT Architecture',
    metrics: ['30K+ ToFu Users', '2K+ Paid Subs'],
    description: 'Netflix-style micro-learning OTT engine with 10-second behavioral sync, Chapter-Aware RAG pipeline, and sub-2s AI tutoring latency.',
    accent: '#f59e0b',
    gradient: 'linear-gradient(135deg, #1a150a 0%, #2a1f0e 30%, #1a1508 60%, #0f0d08 100%)',
  },
  {
    id: '03', slug: 'the-attribution-recovery-engine',
    codename: 'OPERATION: MILES ENGAGE',
    title: 'The Attribution Recovery Engine',
    metrics: ['+20% ROAS', '4K+ Ghost Leads Recovered'],
    description: 'Resolved the "Meta Mirage" — $12K/mo misattributed spend — through a 2-second buffer, recursive retry loops, and a Linear + Time-Decay attribution model.',
    accent: '#10b981',
    gradient: 'linear-gradient(135deg, #0a1a14 0%, #0f2a1f 30%, #0a2018 60%, #080f0d 100%)',
  },
  {
    id: '04', slug: 'agentic-voice-qualification',
    codename: 'OPERATION: SUPERBOT AI',
    title: 'Agentic Voice Qualification',
    metrics: ['-40% Analysis Time', '+15% Qualified Leads'],
    description: 'RAG-driven AI voice assistant that conducts initial qualification calls, retrieves real-time lead memory, and determines Sales-Readiness before a human picks up.',
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

  /* Image animation states */
  const getImageStyle = (index) => {
    if (index === activeIndex) {
      return { scale: 1, y: 0, opacity: 1, zIndex: 10 };
    }
    if (index < activeIndex) {
      const diff = activeIndex - index;
      return {
        scale: 1 - diff * 0.05,
        y: -(diff * 30),
        opacity: 1 - diff * 0.2,
        zIndex: 10 - diff,
      };
    }
    return { scale: 0.88, y: 300, opacity: 0, zIndex: 0 };
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
              <div style={{ perspective: '1000px', width: '100%', maxWidth: 480, aspectRatio: '3/4', position: 'relative' }}>
                {CASES_DATA.map((c, i) => {
                  const s = getImageStyle(i);
                  const isActive = i === activeIndex;
                  const has3D = !!c.floatingElements;

                  return (
                    <motion.div
                      key={c.id}
                      animate={
                        isActive && has3D
                          ? {
                              scale: 1,
                              y: 0,
                              opacity: 1,
                              rotateX: [0, 0, 5],
                              rotateY: [0, 0, -10],
                            }
                          : isActive
                            ? { scale: 1, y: 0, opacity: 1, rotateX: 0, rotateY: 0 }
                            : { scale: s.scale, y: s.y, opacity: s.opacity, rotateX: 0, rotateY: 0 }
                      }
                      transition={
                        isActive && has3D
                          ? { duration: 2.5, times: [0, 0.6, 1], ease: 'easeInOut' }
                          : { type: 'spring', stiffness: 80, damping: 20, mass: 1 }
                      }
                      style={{
                        position: 'absolute', inset: 0,
                        zIndex: s.zIndex,
                        borderRadius: 18,
                        overflow: 'visible',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {/* Dynamic Ambient Glow — blurred image behind card */}
                      {c.baseImage && (
                        <div style={{
                          position: 'absolute', inset: 0,
                          transform: 'scale(1.05)',
                          zIndex: -1,
                          borderRadius: 24,
                          overflow: 'hidden',
                          opacity: isActive ? 0.4 : 0,
                          transition: 'opacity 0.8s ease',
                          filter: 'blur(48px)',
                          pointerEvents: 'none',
                        }}>
                          <img
                            src={c.baseImage}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      )}

                      {/* Card body */}
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
                          background: c.baseImage ? 'transparent' : c.gradient,
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center',
                          position: 'relative',
                        }}>
                          {/* Background image — full visibility, no overlay */}
                          {c.baseImage && (
                            <img
                              src={c.baseImage}
                              alt={c.title}
                              style={{
                                position: 'absolute', inset: 0,
                                width: '100%', height: '100%',
                                objectFit: 'cover',
                                pointerEvents: 'none',
                              }}
                            />
                          )}

                          {/* Large case number watermark */}
                          <span style={{
                            fontFamily: SWISS, fontSize: 180, fontWeight: 900,
                            color: 'rgba(255,255,255,0.025)', lineHeight: 1,
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%,-50%)',
                          }}>
                            {c.id}
                          </span>

                          {/* Accent glow orb */}
                          <div style={{
                            position: 'absolute', top: '30%', left: '50%',
                            transform: 'translate(-50%,-50%)',
                            width: 200, height: 200, borderRadius: '50%',
                            background: `radial-gradient(circle, ${c.accent}12 0%, transparent 70%)`,
                            filter: 'blur(40px)',
                            pointerEvents: 'none',
                          }} />

                          {/* Codename + title */}
                          <span style={{
                            fontFamily: TELE, fontSize: 11, fontWeight: 600,
                            color: c.accent, letterSpacing: '0.3em',
                            textTransform: 'uppercase', position: 'relative', zIndex: 2,
                          }}>
                            {c.codename}
                          </span>
                          <span style={{
                            fontFamily: SWISS, fontSize: 24, fontWeight: 700,
                            color: '#FFFFFF', marginTop: 16, textAlign: 'center',
                            position: 'relative', zIndex: 2, padding: '0 32px',
                            lineHeight: 1.2,
                          }}>
                            {c.title}
                          </span>

                          {/* Metrics on card */}
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

                          {/* Bottom serial */}
                          <span style={{
                            position: 'absolute', bottom: 20, left: 0, right: 0,
                            textAlign: 'center',
                            fontFamily: TELE, fontSize: 9,
                            color: '#D1D5DB', letterSpacing: '0.35em',
                            textTransform: 'uppercase',
                          }}>
                            Case File #{c.id}
                          </span>

                          {/* Clickable overlay */}
                          <Link
                            to={`/cases/${c.slug}`}
                            style={{
                              position: 'absolute', inset: 0, zIndex: 5,
                              cursor: 'pointer',
                            }}
                            aria-label={`View ${c.title} case study`}
                          />
                        </div>
                      </div>

                      {/* ── Floating Nodes — Z-Space Pop (only for cards with floatingElements) ── */}
                      {has3D && c.floatingElements.map(el => (
                        <motion.div
                          key={el.id}
                          initial={{ opacity: 0, scale: 0.5, z: 0 }}
                          animate={
                            isActive
                              ? { opacity: 1, scale: 1, z: 150 }
                              : { opacity: 0, scale: 0.5, z: 0 }
                          }
                          transition={{
                            delay: isActive ? el.delay : 0,
                            type: 'spring', stiffness: 200, damping: 15,
                          }}
                          style={{
                            position: 'absolute',
                            top: el.top,
                            left: el.left,
                            right: el.right,
                            transformStyle: 'preserve-3d',
                            pointerEvents: 'none',
                            zIndex: 50,
                          }}
                        >
                          <div style={{
                            padding: '10px 18px',
                            background: 'rgba(8,8,8,0.95)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: 8,
                            boxShadow: `0 30px 60px rgba(0,0,0,0.9), 0 8px 24px rgba(0,0,0,0.6), 0 0 32px ${c.accent}20`,
                            fontFamily: TELE,
                            fontSize: 11,
                            color: '#E5E7EB',
                            letterSpacing: '0.08em',
                            whiteSpace: 'nowrap',
                          }}>
                            <span style={{ color: c.accent, marginRight: 6 }}>&#9670;</span>
                            {el.text}
                          </div>
                        </motion.div>
                      ))}
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
