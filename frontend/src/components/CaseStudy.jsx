import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Database, GitMerge, Activity, Users, Layers, Zap, BarChart3, Target, Search, Settings, Cpu, TrendingUp, ShieldCheck, Filter, BrainCircuit, Network, Gauge } from 'lucide-react';

const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const TELE  = "'Courier New', Courier, monospace";
const EXPO_OUT = [0.16, 1, 0.3, 1];

/* ── Icon resolver ── */
const ICONS = { Database, GitMerge, Activity, Users, Layers, Zap, BarChart3, Target, Search, Settings, Cpu, TrendingUp, ShieldCheck, Filter, BrainCircuit, Network, Gauge };
const Icon = ({ name, size = 32, color = '#dc2626' }) => {
  const Comp = ICONS[name] || Database;
  return <Comp size={size} color={color} strokeWidth={1.5} />;
};

/* ── Full case study database ── */
const ALL_CASES = {
  'the-universal-gtm-identity-registry': {
    id: '01',
    codename: 'OPERATION: MILES ONE',
    title: 'The Universal GTM Identity Registry',
    subtitle: 'Engineering a Unified Entry-Gate Architecture for High-Velocity Lead Acquisition',
    accent: '#dc2626',
    gradient: 'linear-gradient(135deg, #1a0a0a 0%, #2a1218 30%, #1a0f14 60%, #0d0a0f 100%)',
    heroCollage: [
      { label: 'PostgreSQL Identity Schema', offset: 0 },
      { label: 'SSO Auth Flow Architecture', offset: 1 },
      { label: 'Lead Telemetry Dashboard', offset: 2 },
    ],
    strategicIntent: "Miles Education faced 'Identity Fragmentation.' Leads entering through webinars, whitepapers, and events created redundant, disconnected records. This 'Data Noise' resulted in duplicate acquisition costs and broken context. Miles One was engineered as the Universal Identity Registry (UIR)\u2014a sophisticated traffic controller sitting at the SSO entry-gate, ensuring a deterministic identity is established at the very first touchpoint, effectively separating 'Identity Logic' from 'Business Logic' to prevent CRM bottlenecking.",
    protocols: [
      { icon: 'Database', title: 'PostgreSQL Backbone', desc: 'Engineered a sub-millisecond registry indexing phones, device fingerprints, and OAuth IDs to generate persistent Global UUIDs.' },
      { icon: 'ShieldCheck', title: 'SSO Entry-Gate Layer', desc: 'Implemented a custom Identity Provider (IdP) passing Context Tokens across domains for frictionless omnichannel onboarding.' },
      { icon: 'Filter', title: 'Source-Level Dedupe', desc: 'Shifted data deduplication upstream from the CRM to the entry gate, ensuring only enriched, deterministic data hits Sales.' },
      { icon: 'Zap', title: 'Synchronous Validation', desc: "Enforced an 'Identity Precedes Activity' mandate, validating users in real-time before submission to eliminate lead leakage." },
    ],
    outcomes: [
      { title: '\u20B920 Cr+ Incremental Revenue', desc: 'Automatically routed re-entering students to high-ticket alumni cross-sell tracks, increasing upsell conversion by >40%.' },
      { title: '40,000+ Unified Learners', desc: 'Consolidated highly fragmented D2C, Event, and Content funnels into a single, deterministic identity pipeline.' },
      { title: '-10% Early Funnel Churn', desc: 'Eliminated user friction between webinar signups and LMS trial access by deploying a unified SSO handshake.' },
      { title: '-25% Discovery Call Time', desc: 'Equipped sales floors with pre-attached identity histories, accelerating Speed to Lead and bypassing cold discovery.' },
    ],
    next: { slug: 'behavioral-ott-architecture', label: 'OPERATION: MILES MASTERCLASS' },
  },
  'behavioral-ott-architecture': {
    id: '04',
    codename: 'OPERATION: MILES MASTERCLASS',
    title: 'Behavioral OTT Architecture',
    subtitle: 'Engineering High-Intent Funnels through AI-Driven Content Consumption',
    accent: '#f59e0b',
    gradient: 'linear-gradient(135deg, #1a150a 0%, #2a1f0e 30%, #1a1508 60%, #0f0d08 100%)',
    heroCollage: [
      { label: 'Player State Machine', offset: 0 },
      { label: 'Chapter-Aware RAG Pipeline', offset: 1 },
      { label: 'Redis Buffer Architecture', offset: 2 },
    ],
    strategicIntent: "In a saturated EdTech market, traditional lead magnets suffer from \u2018Engagement Decay\u2019\u2014users download a PDF but never consume it. To bridge the gap between \u2018passive viewer\u2019 and \u2018active student,\u2019 we bypassed rigid traditional LMS platforms to architect Miles Masterclass: a bespoke, Netflix-style micro-learning OTT engine. By capturing behavioral video data at 10-second intervals and feeding it into a Chapter-Aware RAG pipeline, we didn\u2019t just deliver content; we delivered context-aware, real-time AI tutoring that validated learner intent and directly fed the core revenue pipeline.",
    protocols: [
      { icon: 'Activity', title: '10s Behavioral Sync', desc: 'Engineered a high-frequency heartbeat system syncing local video state to a Redis buffer and PostgreSQL ledger every 10 seconds.' },
      { icon: 'BrainCircuit', title: 'Chapter-Aware RAG', desc: "Vectorized video transcriptions into semantic chapters, allowing the LLM to \u2018see\u2019 exactly what the user is watching in real-time." },
      { icon: 'Network', title: 'LangChain Orchestration', desc: "Utilized n8n and LangChain to dynamically adjust the AI context window based on the user\u2019s precise 10-second timestamp." },
      { icon: 'Gauge', title: 'Sub-2s AI Latency', desc: 'Optimized token costs via Redis caching for high-frequency queries, achieving a 1.8s median AI response time for live tutoring.' },
    ],
    outcomes: [
      { title: '30,000+ ToFu Users', desc: 'Successfully bypassed high-friction lead forms, capturing granular consumption data to validate actual learner intent.' },
      { title: '2,000+ Paid Subscriptions', desc: "Transitioned casual \u2018Free Video Viewers\u2019 into paying program subscribers within a 45-day attribution window." },
      { title: '+15% Core CPA Conversion', desc: "Lifted primary enterprise conversions by feeding highly-qualified, \u2018pre-educated\u2019 leads from the OTT ecosystem directly to Sales." },
      { title: 'Automated Intent Triggers', desc: 'Users hitting >70% completion automatically triggered hyper-personalized, backend-driven WhatsApp scholarship campaigns.' },
    ],
    next: { slug: 'the-attribution-recovery-engine', label: 'OPERATION: ALMABETTER' },
  },
  'the-attribution-recovery-engine': {
    id: '02',
    codename: 'OPERATION: ALMABETTER',
    title: 'Operational Debt Eradication',
    accent: '#3b82f6',
    gradient: 'linear-gradient(135deg, #0a0f1a 0%, #0f1a2e 30%, #0a1525 60%, #080b12 100%)',
    heroCollage: [
      { label: 'Sprint Architecture', offset: 0 },
      { label: 'Ticketing ELT Pipeline', offset: 1 },
      { label: 'CSAT Telemetry Board', offset: 2 },
    ],
    protocols: [
      { icon: 'Settings', title: 'Sprint Redesign', desc: 'Audited and restructured engineering sprint cycles to eliminate blockers.' },
      { icon: 'Layers', title: 'ELT Pipeline', desc: 'Deployed an n8n ELT layer powering a productized ticketing system.' },
      { icon: 'BarChart3', title: 'CSAT Monitoring', desc: 'Built real-time CSAT telemetry dashboards for leadership visibility.' },
      { icon: 'Zap', title: 'Content Acceleration', desc: 'Accelerated content readiness pipeline by two full weeks through automation.' },
    ],
    outcomes: [
      { title: '-80% Dev Errors', desc: 'Systematic sprint restructuring and automated QA gates eliminated the majority of production-breaking errors.' },
      { title: '9.1 Peak CSAT', desc: 'Productized ticketing with ELT-backed resolution tracking drove customer satisfaction to its highest recorded level.' },
      { title: '2-Week Content Acceleration', desc: 'Automated the content pipeline from brief to publish, compressing a month-long cycle into two weeks.' },
    ],
    next: { slug: 'behavioral-plg-architecture', label: 'OPERATION: UPGRAD' },
  },
  'behavioral-plg-architecture': {
    id: '03',
    codename: 'OPERATION: UPGRAD',
    title: 'Behavioral PLG Architecture',
    accent: '#10b981',
    gradient: 'linear-gradient(135deg, #0a1a14 0%, #0f2a1f 30%, #0a2018 60%, #080f0d 100%)',
    heroCollage: [
      { label: 'Drop-off Funnel Analysis', offset: 0 },
      { label: 'Cohort Behavior Matrix', offset: 1 },
      { label: 'Intervention Heatmap', offset: 2 },
    ],
    protocols: [
      { icon: 'Search', title: 'Behavioral Telemetry', desc: 'Analyzed deep drop-off data to identify structural friction in learner journeys.' },
      { icon: 'Cpu', title: 'Intervention Design', desc: 'Translated psychological insights into targeted digital nudges and content gates.' },
      { icon: 'TrendingUp', title: 'Cohort Tracking', desc: 'Built real-time cohort dashboards measuring completion rates against control groups.' },
      { icon: 'Target', title: 'GTM Launch Ops', desc: 'Orchestrated 5 Go-To-Market launches with synchronized product and marketing execution.' },
    ],
    outcomes: [
      { title: '+20% Completion Lift', desc: 'Structural product interventions based on behavioral data drove measurable improvements in course completion rates.' },
      { title: '5 GTM Launches', desc: 'Each launch hit revenue targets through tight coordination between product builds, content readiness, and marketing campaigns.' },
      { title: 'Behavioral Intelligence Layer', desc: 'Created a reusable analytics framework that maps learner psychology to product decisions — still in use today.' },
    ],
    next: { slug: 'the-universal-gtm-identity-registry', label: 'OPERATION: MILES ONE' },
  },
};

/* ── XHair ── */
const XHair = ({ size = 14, color = 'currentColor' }) => (
  <span style={{ display: 'inline-block', position: 'relative', width: size, height: size, flexShrink: 0 }}>
    <span style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: color, transform: 'translateY(-50%)' }} />
    <span style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: color, transform: 'translateX(-50%)' }} />
  </span>
);

/* ── Parallax Hero Panel ── */
const HeroPanel = ({ item, index, accent, gradient }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [index * -20, index * 40]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0, left: `${index * 33}%`,
        width: '40%', height: '100%',
        y,
        zIndex: 3 - index,
      }}
    >
      <div style={{
        width: '100%', height: '100%',
        background: gradient,
        border: `1px solid ${accent}20`,
        borderRadius: 12,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        opacity: 0.85,
        mixBlendMode: 'screen',
      }}>
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: `linear-gradient(${accent}15 1px, transparent 1px), linear-gradient(90deg, ${accent}15 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
        {/* Label */}
        <span style={{
          fontFamily: TELE, fontSize: 10, fontWeight: 600,
          color: accent, letterSpacing: '0.2em',
          textTransform: 'uppercase', position: 'relative', zIndex: 2,
        }}>
          {item.label}
        </span>
        {/* Fake terminal lines */}
        <div style={{ marginTop: 16, position: 'relative', zIndex: 2, padding: '0 24px', width: '100%' }}>
          {[...Array(5)].map((_, j) => (
            <div key={j} style={{
              height: 2, borderRadius: 1, marginBottom: 8,
              background: `${accent}${j === 0 ? '30' : '15'}`,
              width: `${60 + Math.sin(j * 2) * 30}%`,
            }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   CASE STUDY PAGE — /cases/:slug
   ═══════════════════════════════════════════ */
const CaseStudy = () => {
  const { slug } = useParams();
  const data = ALL_CASES[slug];

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#050505' }}>
        <p style={{ fontFamily: TELE, color: '#D1D5DB', fontSize: 14, letterSpacing: '0.2em' }}>
          CASE FILE NOT FOUND
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ background: '#050505' }}>

      {/* ── Ambient ombre ── */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `
          radial-gradient(ellipse 120% 80% at 50% 20%, ${data.accent}14 0%, transparent 50%),
          radial-gradient(ellipse 80% 100% at 0% 80%, ${data.accent}0C 0%, transparent 50%)
        `,
      }} />

      {/* ════════════════════════════════════
         SECTION 1: THE BLUEPRINT COLLAGE
         ════════════════════════════════════ */}
      <section className="relative z-10" style={{ padding: '120px 24px 80px' }}>
        <div className="max-w-6xl mx-auto text-center">
          {/* Codename */}
          <motion.div
            className="flex items-center justify-center gap-2 mb-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EXPO_OUT }}
          >
            <XHair size={10} color={data.accent + '80'} />
            <span style={{
              fontFamily: TELE, fontSize: 11, color: data.accent,
              letterSpacing: '0.3em', textTransform: 'uppercase',
            }}>
              {data.codename}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            style={{
              fontFamily: SWISS, fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700,
              color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.05,
              marginBottom: 0,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EXPO_OUT, delay: 0.1 }}
          >
            {data.title}
          </motion.h1>

          {/* Subtitle */}
          {data.subtitle && (
            <motion.p
              style={{
                fontFamily: SWISS, fontSize: 'clamp(16px, 2vw, 20px)', fontWeight: 300,
                color: '#D1D5DB', lineHeight: 1.5, maxWidth: 720,
                margin: '24px auto 60px',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EXPO_OUT, delay: 0.2 }}
            >
              {data.subtitle}
            </motion.p>
          )}

          {/* Hero collage container */}
          <motion.div
            className="relative w-full max-w-5xl mx-auto overflow-hidden"
            style={{
              height: '50vh', minHeight: 360, borderRadius: 16,
              background: '#0A0A0A',
              border: `1px solid ${data.accent}18`,
              boxShadow: `0 0 80px ${data.accent}08`,
            }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EXPO_OUT, delay: 0.2 }}
          >
            {data.heroCollage.map((item, i) => (
              <HeroPanel key={i} item={item} index={i} accent={data.accent} gradient={data.gradient} />
            ))}

            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t border-l z-10" style={{ borderColor: data.accent + '30' }} />
            <div className="absolute top-4 right-4 w-6 h-6 border-t border-r z-10" style={{ borderColor: data.accent + '30' }} />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l z-10" style={{ borderColor: data.accent + '30' }} />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r z-10" style={{ borderColor: data.accent + '30' }} />
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════
         SECTION 1.5: STRATEGIC INTENT
         ════════════════════════════════════ */}
      {data.strategicIntent && (
        <section className="relative z-10" style={{ padding: '0 24px' }}>
          <motion.article
            style={{
              maxWidth: 820, margin: '0 auto',
              padding: '80px 0',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EXPO_OUT }}
          >
            <p style={{
              fontFamily: TELE, fontSize: 10, color: '#D1D5DB',
              letterSpacing: '0.35em', textTransform: 'uppercase',
              marginBottom: 24,
            }}>
              [ Strategic Intent ]
            </p>
            <div style={{
              borderLeft: `2px solid ${data.accent}60`,
              paddingLeft: 32,
            }}>
              <p style={{
                fontFamily: SWISS, fontSize: 18, fontWeight: 300,
                color: '#E5E7EB', lineHeight: 1.85,
              }}>
                {data.strategicIntent}
              </p>
            </div>
          </motion.article>
        </section>
      )}

      {/* ════════════════════════════════════
         SECTION 2: EXECUTION PROTOCOLS
         ════════════════════════════════════ */}
      <section className="relative z-10" style={{ padding: '80px 24px' }}>
        <div className="max-w-5xl mx-auto">
          <motion.p
            className="text-center mb-14"
            style={{
              fontFamily: TELE, fontSize: 10, color: '#D1D5DB',
              letterSpacing: '0.35em', textTransform: 'uppercase',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            [ System Execution Protocols ]
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.protocols.map((p, i) => (
              <motion.div
                key={p.title}
                className="flex flex-col items-center text-center"
                style={{
                  padding: '28px 20px',
                  background: 'rgba(255,255,255,0.015)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: 12,
                  transition: 'all 0.3s ease',
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: EXPO_OUT, delay: i * 0.1 }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = data.accent + '40';
                  e.currentTarget.style.boxShadow = `0 0 24px ${data.accent}12`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Icon name={p.icon} size={32} color={data.accent} />
                <p style={{
                  fontFamily: SWISS, fontSize: 15, fontWeight: 700,
                  color: '#FFFFFF', marginTop: 16,
                }}>
                  {p.title}
                </p>
                <p style={{
                  fontFamily: SWISS, fontSize: 13, fontWeight: 400,
                  color: '#D1D5DB', marginTop: 8, lineHeight: 1.6,
                }}>
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
         SECTION 3: OUTCOMES & IMPACT
         ════════════════════════════════════ */}
      <section className="relative z-10" style={{ padding: '80px 24px 100px' }}>
        <div className="max-w-6xl mx-auto">
          <motion.p
            className="text-center mb-16"
            style={{
              fontFamily: TELE, fontSize: 10, color: '#D1D5DB',
              letterSpacing: '0.35em', textTransform: 'uppercase',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            [ Mission Outcomes &amp; Impact ]
          </motion.p>

          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Left: Core artifact */}
            <motion.div
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: EXPO_OUT }}
            >
              <div style={{
                width: '100%', aspectRatio: '4/3', borderRadius: 16,
                background: data.gradient,
                border: `1px solid ${data.accent}20`,
                boxShadow: `0 0 60px ${data.accent}10`,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Grid overlay */}
                <div style={{
                  position: 'absolute', inset: 0, opacity: 0.06,
                  backgroundImage: `linear-gradient(${data.accent}20 1px, transparent 1px), linear-gradient(90deg, ${data.accent}20 1px, transparent 1px)`,
                  backgroundSize: '32px 32px',
                }} />

                {/* Large watermark */}
                <span style={{
                  fontFamily: SWISS, fontSize: 160, fontWeight: 900,
                  color: 'rgba(255,255,255,0.02)', lineHeight: 1,
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                }}>
                  {data.id}
                </span>

                <span style={{
                  fontFamily: TELE, fontSize: 10, color: data.accent,
                  letterSpacing: '0.25em', textTransform: 'uppercase',
                  position: 'relative', zIndex: 2,
                }}>
                  Core Architecture
                </span>
                <span style={{
                  fontFamily: SWISS, fontSize: 28, fontWeight: 700,
                  color: '#FFFFFF', marginTop: 12, textAlign: 'center',
                  position: 'relative', zIndex: 2, padding: '0 32px',
                }}>
                  {data.title}
                </span>

                {/* Corner brackets */}
                <div className="absolute top-5 left-5 w-5 h-5 border-t border-l" style={{ borderColor: data.accent + '30' }} />
                <div className="absolute top-5 right-5 w-5 h-5 border-t border-r" style={{ borderColor: data.accent + '30' }} />
                <div className="absolute bottom-5 left-5 w-5 h-5 border-b border-l" style={{ borderColor: data.accent + '30' }} />
                <div className="absolute bottom-5 right-5 w-5 h-5 border-b border-r" style={{ borderColor: data.accent + '30' }} />
              </div>
            </motion.div>

            {/* Right: Outcomes */}
            <div className="w-full lg:w-1/2 flex flex-col gap-10">
              {data.outcomes.map((o, i) => (
                <motion.div
                  key={o.title}
                  style={{ borderLeft: `2px solid ${data.accent}`, paddingLeft: 24 }}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, ease: EXPO_OUT, delay: i * 0.12 }}
                >
                  <h3 style={{
                    fontFamily: SWISS, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 700,
                    color: '#FFFFFF', marginBottom: 12,
                    letterSpacing: '-0.02em',
                  }}>
                    {o.title}
                  </h3>
                  <p style={{
                    fontFamily: SWISS, fontSize: 16, fontWeight: 400,
                    color: '#E5E7EB', lineHeight: 1.75,
                  }}>
                    {o.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
         NAVIGATION FOOTER
         ════════════════════════════════════ */}
      <section className="relative z-10" style={{ padding: '60px 24px 120px' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div style={{ width: 40, height: 1, background: data.accent + '40', margin: '0 auto 32px' }} />

          <Link
            to={`/cases/${data.next.slug}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              fontFamily: TELE, fontSize: 12, fontWeight: 600,
              color: data.accent, letterSpacing: '0.2em', textTransform: 'uppercase',
              padding: '14px 32px',
              border: `1px solid ${data.accent}35`,
              borderRadius: 8,
              background: `${data.accent}08`,
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${data.accent}15`;
              e.currentTarget.style.borderColor = `${data.accent}60`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = `${data.accent}08`;
              e.currentTarget.style.borderColor = `${data.accent}35`;
            }}
          >
            <XHair size={10} color={data.accent} />
            Proceed to next file : {data.next.label}
            <span style={{ marginLeft: 4 }}>&rarr;</span>
          </Link>

          <div style={{ marginTop: 24 }}>
            <Link
              to="/cases"
              style={{
                fontFamily: TELE, fontSize: 10,
                color: '#D1D5DB', letterSpacing: '0.2em', textTransform: 'uppercase',
                textDecoration: 'none', transition: 'color 0.3s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'}
              onMouseLeave={e => e.currentTarget.style.color = '#D1D5DB'}
            >
              &larr; Back to all cases
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudy;
