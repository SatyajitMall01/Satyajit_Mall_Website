import React, { useState, useRef } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { profileData } from '../data/mock';

/* ── Design Tokens ── */
const TELE  = "'Courier New', Courier, monospace";
const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const EXPO  = [0.16, 1, 0.3, 1];
const VP    = { once: true, margin: '-60px' };


const slideLeft = {
  hidden:  { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } },
};
const slideRight = {
  hidden:  { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } },
};

const S15 = { hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } };

/* ── Injected keyframes ── */
const DossierStyles = () => (
  <style>{`
    @keyframes radarSweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes tickerScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    @keyframes dataFall { from { transform: translateY(-100%); } to { transform: translateY(100%); } }
    @keyframes pulse6 { 0%,100% { opacity:1; } 50% { opacity:.35; } }
    @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
    @keyframes logoScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    .dossier-cursor { cursor: none !important; }
    .dossier-cursor * { cursor: none !important; }
    .dossier-cursor a, .dossier-cursor button { cursor: none !important; }
  `}</style>
);

/* ════════════════════════════════════
   CENTRAL SPINE — scroll-tracking vertical axis
════════════════════════════════════ */
const CentralSpine = () => {
  const { scrollYProgress } = useScroll();
  const dotY = useTransform(scrollYProgress, [0, 1], ['0vh', '100vh']);
  return (
    <div className="fixed left-1/2 top-0 h-screen -translate-x-1/2 z-[3] pointer-events-none">
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(127,29,29,0.2)' }} />
      <motion.div
        style={{
          position: 'absolute', left: '50%', transform: 'translate(-50%,-50%)',
          top: dotY,
          width: 6, height: 6, borderRadius: '50%',
          backgroundColor: '#dc2626',
          boxShadow: '0 0 10px rgba(220,38,38,0.9), 0 0 24px rgba(220,38,38,0.4)',
        }}
      />
    </div>
  );
};

/* ════════════════════════════════════
   TELEMETRY METRIC — animated SVG sparkline
════════════════════════════════════ */
const TelemetryMetric = ({ points = [0.3, 0.5, 0.4, 0.7, 0.6, 0.8, 0.75, 0.95], label = '' }) => {
  const W = 100, H = 28;
  const pts = points.map((v, i) => [
    (i / (points.length - 1)) * W,
    (1 - v) * H,
  ]);
  const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
      <svg width={W} height={H} style={{ overflow: 'visible', flexShrink: 0 }}>
        <motion.path
          d={d}
          fill="none"
          stroke="#dc2626"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.2 }}
          style={{ filter: 'drop-shadow(0 0 4px rgba(220,38,38,0.6))' }}
        />
        {/* End dot */}
        <motion.circle
          cx={pts[pts.length - 1][0]}
          cy={pts[pts.length - 1][1]}
          r={2.5}
          fill="#dc2626"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.3, delay: 1.5 }}
          style={{ filter: 'drop-shadow(0 0 4px rgba(220,38,38,0.8))' }}
        />
      </svg>
      {label && (
        <span style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 8, color: 'rgba(107,114,128,0.5)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          {label}
        </span>
      )}
    </div>
  );
};


/* ════════════════════════════════════
   HEX GRID — tactical tool arsenal
════════════════════════════════════ */
const HexCell = ({ label, groupIndex, activeGroup, onHover, onLeave }) => {
  const isActive = activeGroup === groupIndex;
  const isDimmed = activeGroup !== null && activeGroup !== groupIndex;
  return (
    <div
      onMouseEnter={() => onHover(groupIndex)}
      onMouseLeave={onLeave}
      style={{
        width: 76, height: 76,
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        backgroundColor: isActive
          ? 'rgba(220,38,38,0.18)'
          : 'rgba(17,24,39,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'default',
        opacity: isDimmed ? 0.25 : 1,
        transition: 'all 0.25s ease',
        boxShadow: isActive ? '0 0 20px rgba(220,38,38,0.35)' : 'none',
        outline: isActive ? '1px solid rgba(220,38,38,0.4)' : '1px solid rgba(55,65,81,0.6)',
        outlineOffset: -1,
      }}
    >
      <span style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: 9, fontWeight: 600,
        color: isActive ? '#f87171' : 'rgba(209,213,219,0.75)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        textAlign: 'center',
        padding: '0 8px',
        lineHeight: 1.3,
        transition: 'color 0.25s ease',
      }}>
        {label}
      </span>
    </div>
  );
};

const HexGrid = ({ categories }) => {
  const [activeGroup, setActiveGroup] = useState(null);
  return (
    <div>
      {categories.map((cat, gi) => (
        <div key={cat.subhead} style={{ marginBottom: 24 }}>
          <span style={{
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: 9, color: activeGroup === gi ? '#dc2626' : 'rgba(107,114,128,0.5)',
            letterSpacing: '0.25em', textTransform: 'uppercase',
            display: 'block', marginBottom: 10,
            transition: 'color 0.25s ease',
          }}>
            {cat.subhead}
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {cat.tools.map(tool => (
              <HexCell
                key={tool}
                label={tool}
                groupIndex={gi}
                activeGroup={activeGroup}
                onHover={setActiveGroup}
                onLeave={() => setActiveGroup(null)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ════════════════════════════════════
   ACTION CONSOLE — terminal CTA at end of dossier
════════════════════════════════════ */
/* ── Contact Modal — renders via portal over everything ── */
const ContactModal = ({ onClose }) => {
  const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
  const TELE  = "'Courier New', Courier, monospace";
  const [hovEmail, setHovEmail] = useState(false);
  const [hovLI, setHovLI]       = useState(false);

  // Close on Escape key
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        backgroundColor: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480,
          backgroundColor: 'rgba(6,8,12,0.98)',
          border: '1px solid rgba(220,38,38,0.35)',
          borderRadius: 6,
          padding: '36px 32px 28px',
          boxShadow: '0 0 60px rgba(220,38,38,0.15), 0 32px 64px rgba(0,0,0,0.8)',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 28, height: 28,
            background: 'transparent',
            border: '1px solid rgba(75,85,99,0.5)',
            borderRadius: 3,
            color: 'rgba(156,163,175,0.7)',
            cursor: 'pointer', outline: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: TELE, fontSize: 14, lineHeight: 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(75,85,99,0.5)'; e.currentTarget.style.color = 'rgba(156,163,175,0.7)'; }}
        >
          ×
        </button>

        {/* Header */}
        <p style={{ fontFamily: TELE, fontSize: 9, color: 'rgba(220,38,38,0.7)', letterSpacing: '0.35em', textTransform: 'uppercase', margin: '0 0 6px' }}>
          [ SECURE CHANNEL OPEN ]
        </p>
        <p style={{ fontFamily: SWISS, fontSize: 18, fontWeight: 700, color: '#f3f4f6', margin: '0 0 6px', letterSpacing: '0.02em' }}>
          Get in touch
        </p>
        <p style={{ fontFamily: SWISS, fontSize: 14, color: 'rgba(156,163,175,0.8)', margin: '0 0 28px', lineHeight: 1.5 }}>
          Choose how you'd like to connect.
        </p>

        <div style={{ height: 1, backgroundColor: 'rgba(55,65,81,0.4)', marginBottom: 24 }} />

        {/* Email option */}
        <a
          href="mailto:satyajitmall01@gmail.com"
          onMouseEnter={() => setHovEmail(true)}
          onMouseLeave={() => setHovEmail(false)}
          style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '16px 20px', marginBottom: 12,
            backgroundColor: hovEmail ? 'rgba(220,38,38,0.08)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${hovEmail ? 'rgba(220,38,38,0.5)' : 'rgba(55,65,81,0.5)'}`,
            borderRadius: 4,
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
          }}
        >
          {/* Gmail icon */}
          <div style={{
            width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
            backgroundColor: hovEmail ? 'rgba(220,38,38,0.15)' : 'rgba(55,65,81,0.3)',
            border: `1px solid ${hovEmail ? 'rgba(220,38,38,0.4)' : 'rgba(55,65,81,0.4)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={hovEmail ? '#f87171' : 'rgba(156,163,175,0.7)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="22,6 12,13 2,6" stroke={hovEmail ? '#f87171' : 'rgba(156,163,175,0.7)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: SWISS, fontSize: 13, fontWeight: 600, color: hovEmail ? '#f3f4f6' : 'rgba(209,213,219,0.9)', margin: 0, letterSpacing: '0.02em', transition: 'color 0.2s ease' }}>
              Send an Email
            </p>
            <p style={{ fontFamily: TELE, fontSize: 10, color: hovEmail ? 'rgba(220,38,38,0.8)' : 'rgba(107,114,128,0.7)', margin: '3px 0 0', letterSpacing: '0.05em', transition: 'color 0.2s ease' }}>
              satyajitmall01@gmail.com
            </p>
          </div>
          <span style={{ marginLeft: 'auto', fontFamily: TELE, fontSize: 12, color: hovEmail ? '#ef4444' : 'rgba(75,85,99,0.5)', transition: 'color 0.2s ease' }}>→</span>
        </a>

        {/* LinkedIn option */}
        <a
          href="https://www.linkedin.com/in/satyajit-mall/"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovLI(true)}
          onMouseLeave={() => setHovLI(false)}
          style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '16px 20px',
            backgroundColor: hovLI ? 'rgba(10,102,194,0.1)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${hovLI ? 'rgba(10,102,194,0.5)' : 'rgba(55,65,81,0.5)'}`,
            borderRadius: 4,
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
          }}
        >
          {/* LinkedIn icon */}
          <div style={{
            width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
            backgroundColor: hovLI ? 'rgba(10,102,194,0.2)' : 'rgba(55,65,81,0.3)',
            border: `1px solid ${hovLI ? 'rgba(10,102,194,0.5)' : 'rgba(55,65,81,0.4)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={hovLI ? '#60a5fa' : 'rgba(156,163,175,0.7)'}>
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: SWISS, fontSize: 13, fontWeight: 600, color: hovLI ? '#f3f4f6' : 'rgba(209,213,219,0.9)', margin: 0, letterSpacing: '0.02em', transition: 'color 0.2s ease' }}>
              Connect on LinkedIn
            </p>
            <p style={{ fontFamily: TELE, fontSize: 10, color: hovLI ? 'rgba(96,165,250,0.8)' : 'rgba(107,114,128,0.7)', margin: '3px 0 0', letterSpacing: '0.05em', transition: 'color 0.2s ease' }}>
              linkedin.com/in/satyajit-mall
            </p>
          </div>
          <span style={{ marginLeft: 'auto', fontFamily: TELE, fontSize: 12, color: hovLI ? '#60a5fa' : 'rgba(75,85,99,0.5)', transition: 'color 0.2s ease' }}>→</span>
        </a>

        <p style={{ fontFamily: TELE, fontSize: 8, color: 'rgba(75,85,99,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center', marginTop: 20 }}>
          ESC TO CLOSE // RESPONSE WITHIN 24H
        </p>
      </motion.div>
    </motion.div>
  );
};

const ActionConsole = () => {
  const [hov1, setHov1]           = useState(false);
  const [hov2, setHov2]           = useState(false);
  const [contactOpen, setContact] = useState(false);
  const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
  const TELE  = "'Courier New', Courier, monospace";

  return (
    <>
      {/* Contact modal — rendered via AnimatePresence for smooth in/out */}
      <AnimatePresence>
        {contactOpen && <ContactModal onClose={() => setContact(false)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
        style={{
          width: '100%', maxWidth: 720,
          margin: '48px auto 0',
          padding: '0 24px',
        }}
      >
        {/* Header */}
        <p style={{
          fontFamily: TELE, fontSize: 9,
          color: 'rgba(107,114,128,0.5)', letterSpacing: '0.4em',
          textTransform: 'uppercase', textAlign: 'center',
          marginBottom: 24,
        }}>
          [ COMMAND TERMINAL — CHOOSE YOUR PROTOCOL ]
        </p>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: 'rgba(55,65,81,0.4)', marginBottom: 32 }} />

        {/* CTA row */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>

          {/* CTA 1 — Extract Data */}
          <a
            href="/Satyajit_Mall_Resume_Master.pdf"
            download="Satyajit_Mall_Resume_Master.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHov1(true)}
            onMouseLeave={() => setHov1(false)}
            style={{
              flex: 1, minWidth: 240, maxWidth: 320,
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              padding: '24px 28px',
              backgroundColor: hov1 ? 'rgba(127,29,29,0.2)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${hov1 ? 'rgba(220,38,38,0.65)' : 'rgba(75,85,99,0.5)'}`,
              borderRadius: 4,
              textDecoration: 'none',
              transition: 'all 0.25s ease',
              boxShadow: hov1 ? '0 0 30px rgba(220,38,38,0.12)' : 'none',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontFamily: TELE, fontSize: 9, color: 'rgba(107,114,128,0.6)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 10, display: 'block' }}>
              PROTOCOL — ALPHA
            </span>
            <span style={{ fontFamily: SWISS, fontSize: 15, fontWeight: 700, color: hov1 ? '#f3f4f6' : 'rgba(229,231,235,0.95)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, display: 'block', transition: 'color 0.2s ease' }}>
              Download CV
            </span>
            <span style={{ fontFamily: TELE, fontSize: 10, color: hov1 ? '#ef4444' : 'rgba(107,114,128,0.6)', letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'color 0.2s ease' }}>
              Extract Raw Data →
            </span>
          </a>

          {/* Vertical divider */}
          <div style={{ width: 1, backgroundColor: 'rgba(55,65,81,0.35)', alignSelf: 'stretch', flexShrink: 0 }} />

          {/* CTA 2 — Secure Channel (opens modal) */}
          <button
            onClick={() => setContact(true)}
            onMouseEnter={() => setHov2(true)}
            onMouseLeave={() => setHov2(false)}
            style={{
              flex: 1, minWidth: 240, maxWidth: 320,
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              padding: '24px 28px',
              backgroundColor: hov2 ? '#7f1d1d' : '#991b1b',
              border: '1px solid rgba(220,38,38,0.45)',
              borderRadius: 4,
              textAlign: 'left',
              transition: 'all 0.25s ease',
              boxShadow: hov2
                ? '0 0 40px rgba(220,38,38,0.4), 0 8px 32px rgba(220,38,38,0.3)'
                : '0 0 24px rgba(220,38,38,0.2), 0 4px 16px rgba(220,38,38,0.15)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <span style={{ fontFamily: TELE, fontSize: 9, color: 'rgba(252,165,165,0.7)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 10, display: 'block' }}>
              PROTOCOL — BRAVO
            </span>
            <span style={{ fontFamily: SWISS, fontSize: 15, fontWeight: 700, color: '#ffffff', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>
              Get in Touch
            </span>
            <span style={{ fontFamily: TELE, fontSize: 10, color: 'rgba(252,165,165,0.8)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Email · LinkedIn →
            </span>
          </button>
        </div>

        {/* Footer line */}
        <div style={{ height: 1, backgroundColor: 'rgba(55,65,81,0.3)', marginTop: 32, marginBottom: 16 }} />
        <p style={{ fontFamily: TELE, fontSize: 8, color: 'rgba(75,85,99,0.4)', letterSpacing: '0.25em', textTransform: 'uppercase', textAlign: 'center' }}>
          ALL COMMUNICATIONS ENCRYPTED // RESPONSE WITHIN 24H
        </p>
      </motion.div>
    </>
  );
};

/* ════════════════════════════════════
   CROSSHAIR CURSOR — follows mouse, red + on dossier
════════════════════════════════════ */
const CrosshairCursor = () => {
  const [pos, setPos] = React.useState({ x: -100, y: -100 });
  const [clicking, setClicking] = React.useState(false);

  React.useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
    };
  }, []);

  const size = clicking ? 12 : 16;
  const opacity = clicking ? 1 : 0.75;

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%, -50%)',
        transition: 'width 0.08s ease, height 0.08s ease, opacity 0.08s ease',
      }}
    >
      {/* Horizontal bar */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: size * 2, height: 1,
        backgroundColor: `rgba(220,38,38,${opacity})`,
      }} />
      {/* Vertical bar */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1, height: size * 2,
        backgroundColor: `rgba(220,38,38,${opacity})`,
      }} />
      {/* Centre dot */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 3, height: 3, borderRadius: '50%',
        backgroundColor: `rgba(220,38,38,${opacity})`,
      }} />
    </div>
  );
};

/* ════════════════════════════════════
   ASK HOOK — always-visible inline tag that fires a contextual question
   into the AI chat. Ghost state → active state on hover.
════════════════════════════════════ */
const AskHook = ({ question }) => {
  const [hov, setHov] = useState(false);
  const fire = (e) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('ask-about-this', { detail: { question } }));
  };
  return (
    <button
      onClick={fire}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        marginTop: 12,
        fontFamily: TELE,
        fontSize: 10,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        padding: '6px 14px',
        border: `1px solid ${hov ? '#ef4444' : 'rgba(220,38,38,0.55)'}`,
        color: hov ? '#ffffff' : '#ef4444',
        backgroundColor: hov ? '#7f1d1d' : 'rgba(127,29,29,0.22)',
        boxShadow: hov
          ? '0 0 20px rgba(220,38,38,0.35), inset 0 0 12px rgba(220,38,38,0.08)'
          : '0 0 8px rgba(220,38,38,0.1)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        outline: 'none',
        whiteSpace: 'nowrap',
        width: 'fit-content',
        borderRadius: 2,
      }}
    >
      {/* Pulsing live dot */}
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        backgroundColor: hov ? '#fca5a5' : '#ef4444',
        flexShrink: 0,
        boxShadow: hov ? '0 0 8px #ef4444' : '0 0 5px rgba(239,68,68,0.8)',
        animation: 'pulse6 1.8s ease-in-out infinite',
        display: 'inline-block',
      }} />
      {hov ? 'Ask about this →' : 'Ask AI'}
    </button>
  );
};

/* ════════════════════════════════════
   FIXED CENTERED PORTRAIT — always visible, content scrolls around it
   Uses CSS mask to seamlessly fade edges into bg
════════════════════════════════════ */
const FixedPortrait = () => (
  <div className="fixed inset-0 z-[1] flex items-center justify-center pointer-events-none overflow-hidden">
    <img
      src={profileData.heroImage}
      alt=""
      draggable={false}
      loading="eager"
      style={{
        width: 'clamp(500px, 60vw, 900px)',
        height: 'auto',
        marginTop: '12vh',
        opacity: 0.32,
        filter: 'grayscale(100%) contrast(130%) brightness(0.45)',
        maskImage: 'radial-gradient(ellipse 50% 58% at 50% 42%, black 25%, transparent 72%)',
        WebkitMaskImage: 'radial-gradient(ellipse 50% 58% at 50% 42%, black 25%, transparent 72%)',
        userSelect: 'none',
        objectPosition: 'center top',
      }}
    />
  </div>
);

/* ════════════════════════════════════
   DECLASSIFY — black block slides away to reveal content
════════════════════════════════════ */
const Declassify = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <div ref={ref} style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
      {children}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={inView ? { scaleX: 0 } : { scaleX: 1 }}
        transition={{ duration: 0.8, ease: EXPO, delay }}
        style={{
          position: 'absolute', inset: 0,
          backgroundColor: '#0F1419',
          transformOrigin: 'right', zIndex: 2,
        }}
      />
    </div>
  );
};

/* ════════════════════════════════════
   SHARED MICRO-COMPONENTS
════════════════════════════════════ */


const Redacted = ({ children }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <span tabIndex={0} role="button" aria-label="Reveal redacted text"
      onMouseEnter={() => setRevealed(true)} onMouseLeave={() => setRevealed(false)}
      onFocus={() => setRevealed(true)} onBlur={() => setRevealed(false)}
      onClick={() => setRevealed(v => !v)}
      style={{
        backgroundColor: revealed ? 'transparent' : '#111',
        color: revealed ? '#F4ECD8' : '#111',
        padding: '1px 5px', cursor: 'pointer', transition: 'all 0.3s ease',
        borderBottom: revealed ? 'none' : '1px dashed rgba(178,34,34,0.3)',
      }}
    >{children}</span>
  );
};


/* ════════════════════════════════════════════════════
   FOLD 1 — THE EVIDENCE WALL
   5 artifacts scattered around the portrait using absolute positioning.
   Left elements converge from x:-50, right from x:+50.
════════════════════════════════════════════════════ */
const Fold1 = () => (
  <section className="relative min-h-screen w-full overflow-hidden z-[2]">
    {/* Edge gradients — text readable, center breathes */}
    <div className="absolute inset-y-0 left-0 w-1/3 z-0 pointer-events-none"
      style={{ background: 'linear-gradient(to right, #050505, transparent)' }} />
    <div className="absolute inset-y-0 right-0 w-1/3 z-0 pointer-events-none"
      style={{ background: 'linear-gradient(to left, #050505, transparent)' }} />

    <motion.div
      className="relative w-full h-screen"
      variants={S15}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >

      {/* ── Artifact 1: Master Nameplate (outlined, no fill, above hero) ── */}
      <motion.div
        variants={slideLeft}
        className="absolute z-10 left-0 right-0 text-center"
        style={{ top: '4%' }}
      >
        <h1 style={{
          fontFamily: SWISS,
          fontWeight: 900,
          fontSize: 'clamp(44px, 6.5vw, 100px)',
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(243,244,246,0.7)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          margin: 0,
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}>
          SATYAJIT MALL
        </h1>
      </motion.div>

      {/* ── Artifact 2: Classification Line (centered middle of fold) ── */}
      <motion.div
        variants={slideLeft}
        className="absolute z-10 left-0 right-0 text-center"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        <span style={{
          fontFamily: SWISS,
          fontSize: 15,
          fontWeight: 600,
          color: 'rgba(127,29,29,0.9)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          userSelect: 'none',
        }}>
          TECHNICAL PRODUCT MANAGER // DATA PLATFORMS // AI INTEGRATION
        </span>
      </motion.div>

      {/* ── Artifact 3: Telemetry HUD (Top Right) ── */}
      <motion.div
        variants={slideRight}
        className="absolute z-10 hidden md:block"
        style={{ top: '18%', right: '8%', maxWidth: 250 }}
      >
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.2)',
          backdropFilter: 'blur(6px)',
          padding: 16,
          textAlign: 'right',
          borderTop: '1px solid rgba(107,114,128,0.4)',
          borderRight: '1px solid rgba(107,114,128,0.4)',
          position: 'relative',
        }}>
          {/* Corner bracket accents */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderTop: '2px solid rgba(229,231,235,0.3)', borderRight: '2px solid rgba(229,231,235,0.3)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 16, height: 16, borderBottom: '2px solid rgba(229,231,235,0.3)', borderLeft: '2px solid rgba(229,231,235,0.3)' }} />

          <p style={{ fontFamily: SWISS, fontSize: 12, color: '#9CA3AF', lineHeight: 2, margin: 0, textAlign: 'right' }}>
            Location: Bengaluru, IND
          </p>
          <p style={{ fontFamily: SWISS, fontSize: 12, color: '#9CA3AF', lineHeight: 2, margin: 0, textAlign: 'right' }}>
            Domain: B2C · Internal SaaS · OTT
          </p>
          <p style={{ fontFamily: SWISS, fontSize: 12, color: '#9CA3AF', lineHeight: 2, margin: 0, textAlign: 'right' }}>
            Status: Active{' '}
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e', animation: 'pulse6 2s infinite', verticalAlign: 'middle' }} />
          </p>
        </div>
      </motion.div>

      {/* ── Artifact 4: Verified Dossier Slip (Bottom Left) ── */}
      <motion.div
        variants={slideLeft}
        className="absolute z-10"
        style={{ bottom: '10%', left: '8%', width: 'clamp(300px, 30vw, 420px)' }}
      >
        <div
          style={{
            backgroundColor: 'rgba(5,5,5,0.96)',
            borderBottom: '2px solid #991B1B',
            padding: '24px 22px',
            position: 'relative',
            backdropFilter: 'blur(6px)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.borderBottomColor = '#dc2626';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(220,38,38,0.12)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderBottomColor = '#991B1B';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Corner brackets ┌ ┐ └ ┘ */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: 14, height: 14, borderTop: '2px solid rgba(229,231,235,0.2)', borderLeft: '2px solid rgba(229,231,235,0.2)' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: 14, height: 14, borderTop: '2px solid rgba(229,231,235,0.2)', borderRight: '2px solid rgba(229,231,235,0.2)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 14, height: 14, borderBottom: '2px solid rgba(229,231,235,0.2)', borderLeft: '2px solid rgba(229,231,235,0.2)' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderBottom: '2px solid rgba(229,231,235,0.2)', borderRight: '2px solid rgba(229,231,235,0.2)' }} />

          <p style={{
            fontFamily: SWISS, fontSize: 15, fontWeight: 400, color: 'rgba(209,213,219,0.9)',
            lineHeight: 1.75, margin: 0,
          }}>
            Product Manager with 5+ years of experience driving product-led growth through
            strategic system architecture and enterprise automation. Specializing in resolving
            fragmented data, architecting 0-to-1 launches, and deploying intelligent self-service
            solutions that scale.
          </p>
          <AskHook question="You have 5+ years as a PM specializing in data platforms and AI — how do you split your time between strategy, technical architecture, and stakeholder management day-to-day?" />
        </div>
      </motion.div>

      {/* ── Artifact 5: Dual Intel Badges (Bottom Right) ── */}
      <motion.div
        variants={slideRight}
        className="absolute z-10 hidden md:flex"
        style={{ bottom: '10%', right: '8%', gap: 32 }}
      >
        {[
          { metric: '5+',     label: 'YEARS EXPERIENCE', delay: 0,    q: "You have 5+ years as a PM — what has been the most pivotal product decision you have made, and what did it teach you?" },
          { metric: '>₹20 Cr', label: 'REVENUE IMPACT',    delay: 0.15, q: "Which specific product or initiative contributed most to the ₹20 Crore revenue impact, and how did you measure it?" },
        ].map(badge => (
          <div key={badge.label} style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
            borderLeft: '3px solid #B22222',
            paddingLeft: 14,
          }}>
            <Declassify delay={badge.delay}>
              <span style={{
                fontFamily: SWISS, fontWeight: 800,
                fontSize: 'clamp(44px, 5.5vw, 68px)',
                color: '#F3F4F6',
                lineHeight: 0.8,
                display: 'block',
              }}>{badge.metric}</span>
            </Declassify>
            <span style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 600,
              color: 'rgba(156,163,175,0.7)', letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginTop: 6, display: 'block',
            }}>{badge.label}<AskHook question={badge.q} /></span>
          </div>
        ))}
      </motion.div>

    </motion.div>
    <LogoCarousel />
  </section>
);


/* ════════════════════════════════════════════════════
   FOLD 2 — ARSENAL & INFRASTRUCTURE (Clean Spatial Canvas)
   Premium dark-mode SaaS / Technical Architect aesthetic
════════════════════════════════════════════════════ */
const f2Left    = { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.25, 1, 0.5, 1] } } };
const f2Right   = { hidden: { opacity: 0, x:  30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.25, 1, 0.5, 1] } } };
const f2Stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } } };

const Fold2 = () => (
  <section className="min-h-screen relative z-[2] w-full overflow-hidden">
    {/* Edge gradients */}
    <div className="absolute inset-y-0 left-0 w-1/3 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(15,20,25,0.9) 0%, transparent 100%)' }} />
    <div className="absolute inset-y-0 right-0 w-1/3 pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(15,20,25,0.9) 0%, transparent 100%)' }} />

    <motion.div
      className="relative w-full min-h-screen flex flex-col justify-between py-20 px-[8%]"
      variants={f2Stagger} initial="hidden" whileInView="visible" viewport={VP}
    >

      {/* ── Top row ── */}
      <div className="hidden md:flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>

        {/* ── Artifact 1: Technical Stack Matrix (Top Left) ── */}
        <motion.div variants={f2Left} style={{ maxWidth: 400 }}>
          <div style={{
            backgroundColor: 'rgba(8,8,10,0.93)',
            border: '1px solid rgba(55,65,81,0.9)',
            padding: '24px', borderRadius: 8,
            backdropFilter: 'blur(12px)',
          }}>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 700,
              color: '#dc2626', letterSpacing: '0.25em',
              textTransform: 'uppercase', margin: '0 0 18px',
            }}>Technical Stack</p>

            {[
              { label: 'Data Platforms',   tools: ['BigQuery', 'PostgreSQL', 'GA4', 'Looker'] },
              { label: 'Automation & CDP', tools: ['n8n', 'Zapier', 'Netcore', 'Clevertap'] },
              { label: 'Product Delivery', tools: ['Agile Scrum', 'MVP Architecting', 'CSPO'] },
            ].map((group, gi) => (
              <div key={group.label} style={{ marginBottom: gi < 2 ? 16 : 0 }}>
                <p style={{
                  fontFamily: SWISS, fontSize: 9, fontWeight: 600,
                  color: 'rgba(107,114,128,0.7)', letterSpacing: '0.18em',
                  textTransform: 'uppercase', margin: '0 0 7px',
                }}>{group.label}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {group.tools.map(tool => (
                    <span key={tool} style={{
                      fontFamily: SWISS, fontSize: 11, fontWeight: 500,
                      color: 'rgba(229,231,235,0.88)',
                      backgroundColor: 'rgba(31,41,55,0.75)',
                      border: '1px solid rgba(55,65,81,0.7)',
                      padding: '3px 10px', borderRadius: 4,
                    }}>{tool}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Artifact 2: Core Competencies (Top Right) ── */}
        <motion.div variants={f2Right} style={{ maxWidth: 420 }}>
          <p style={{
            fontFamily: SWISS, fontSize: 10, fontWeight: 700,
            color: '#dc2626', letterSpacing: '0.25em',
            textTransform: 'uppercase', margin: '0 0 18px',
          }}>Core Competencies</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              { title: 'Unifying Fragmented Data',   body: 'Architecting deterministic data pipelines that bridge apps, CRM, and analytics.' },
              { title: 'Automating Operations',       body: 'Deploying enterprise workflows that eliminate manual operational silos and slash support costs.' },
              { title: 'Driving Product-Led Growth', body: 'Building self-serve, AI-driven product loops that directly multiply top-line revenue.' },
            ].map(item => (
              <div key={item.title} style={{ borderLeft: '2px solid #dc2626', paddingLeft: 14 }}>
                <p style={{
                  fontFamily: SWISS, fontSize: 15, fontWeight: 600,
                  color: 'rgba(229,231,235,0.95)', margin: '0 0 5px', lineHeight: 1.3,
                }}>{item.title}</p>
                <p style={{
                  fontFamily: SWISS, fontSize: 12, fontWeight: 400,
                  color: 'rgba(229,231,235,0.95)', lineHeight: 1.65, margin: 0,
                }}>{item.body}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ── Bottom row ── */}
      <div className="hidden md:flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>

        {/* ── Artifact 3: Impact Metric −40% (Bottom Left) ── */}
        <motion.div variants={f2Left} style={{ maxWidth: 380 }}>
          <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '4px solid #dc2626', paddingLeft: 20 }}>
            <Declassify>
              <span style={{
                fontFamily: SWISS, fontWeight: 900,
                fontSize: 'clamp(60px, 5.5vw, 88px)',
                color: '#F3F4F6', lineHeight: 0.8,
                display: 'block', letterSpacing: '-0.03em',
              }}>−40%</span>
            </Declassify>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 600,
              color: 'rgba(156,163,175,0.7)', letterSpacing: '0.2em',
              textTransform: 'uppercase', margin: '12px 0',
            }}>Time-to-Market Reduction</p>
            <AskHook question="The −40% time-to-market reduction came from the CDP and event taxonomy — what was the engineering bottleneck before, and what was the first product that shipped faster as a result?" />
            <TelemetryMetric points={[0.9, 0.82, 0.75, 0.68, 0.58, 0.52, 0.45, 0.38, 0.32, 0.6]} label="time-to-market index" />
            <p style={{
              fontFamily: SWISS, fontSize: 15, fontWeight: 400,
              color: 'rgba(209,213,219,0.92)', lineHeight: 1.65, margin: 0,
            }}>
              Governed CDP implementation and event taxonomy across the full product ecosystem,
              eliminating engineering bottlenecks for real-time personalization.
            </p>
          </div>
        </motion.div>

        {/* ── Artifact 4: Impact Metric +20% (Bottom Right) ── */}
        <motion.div variants={f2Right} style={{ maxWidth: 380 }}>
          <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '4px solid #dc2626', paddingLeft: 20 }}>
            <Declassify delay={0.15}>
              <span style={{
                fontFamily: SWISS, fontWeight: 900,
                fontSize: 'clamp(60px, 5.5vw, 88px)',
                color: '#F3F4F6', lineHeight: 0.8,
                display: 'block', letterSpacing: '-0.03em',
              }}>+20%</span>
            </Declassify>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 600,
              color: 'rgba(156,163,175,0.7)', letterSpacing: '0.2em',
              textTransform: 'uppercase', margin: '12px 0',
            }}>Overall ROAS Lift</p>
            <AskHook question="The +20% ROAS lift came from a proprietary attribution platform — how did the automation model recover leads, and how did you measure ROAS improvement at the channel level?" />
            <TelemetryMetric points={[0.4, 0.45, 0.5, 0.55, 0.58, 0.62, 0.68, 0.74, 0.82, 0.92]} label="roas trajectory" />
            <p style={{
              fontFamily: SWISS, fontSize: 15, fontWeight: 400,
              color: 'rgba(209,213,219,0.92)', lineHeight: 1.65, margin: 0,
            }}>
              Architected a proprietary end-to-end attribution platform powered by compounded
              automation models to recover leads and scale revenue.
            </p>
          </div>
        </motion.div>

      </div>

    </motion.div>
  </section>
);


/* ════════════════════════════════════════════════════
   FOLD 3 — MILES EDUCATION (Absolute Spatial Canvas)
   4 product wins scattered across four corners
════════════════════════════════════════════════════ */
const f3Left    = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.25, 1, 0.5, 1] } } };
const f3Right   = { hidden: { opacity: 0, x:  40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.25, 1, 0.5, 1] } } };
const f3Stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } } };

const Fold3 = () => (
  <section className="min-h-screen relative z-[2] w-full overflow-hidden">
    {/* Edge gradients */}
    <div className="absolute inset-y-0 left-0 w-1/3 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(15,20,25,0.9) 0%, transparent 100%)' }} />
    <div className="absolute inset-y-0 right-0 w-1/3 pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(15,20,25,0.9) 0%, transparent 100%)' }} />

    <motion.div
      className="relative w-full min-h-screen flex flex-col justify-between py-20 px-[8%]"
      variants={f3Stagger} initial="hidden" whileInView="visible" viewport={VP}
    >

      {/* ── Top row ── */}
      <div className="hidden md:flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>

        {/* ── Artifact 1: Core App Launch (Top Left) ── */}
        <motion.div variants={f3Left} style={{ maxWidth: 400 }}>
          <div style={{ borderTop: '2px solid rgba(220,38,38,0.5)', paddingTop: 16 }}>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 700,
              color: '#dc2626', letterSpacing: '0.25em',
              textTransform: 'uppercase', margin: '0 0 16px',
            }}>Miles Education // Dec 2023 – Present</p>
            <Declassify>
              <span style={{
                fontFamily: SWISS, fontWeight: 900,
                fontSize: 'clamp(60px, 5.5vw, 88px)',
                color: '#F3F4F6', lineHeight: 0.8,
                display: 'block', letterSpacing: '-0.03em',
              }}>40,000+</span>
            </Declassify>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 600,
              color: 'rgba(156,163,175,0.7)', letterSpacing: '0.2em',
              textTransform: 'uppercase', margin: '10px 0',
            }}>Learners Onboarded</p>
            <AskHook question="The Miles One app onboarded 40,000+ learners — what was the product architecture behind that onboarding funnel and how did you balance lead gen with learner activation?" />
            <p style={{
              fontFamily: SWISS, fontSize: 15, fontWeight: 400,
              color: 'rgba(229,231,235,0.95)', lineHeight: 1.65, margin: 0,
            }}>
              <Redacted>Spearheaded the 0-1 launch of the Miles One app.</Redacted>{' '}
              Architected a dual-purpose MVP for lead generation and nurturing that generated {'>'}{'\u20B9'}20 Cr in revenue.
            </p>
          </div>
        </motion.div>

        {/* ── Artifact 2: ML Pipeline Card (Top Right) ── */}
        <motion.div variants={f3Right} style={{ maxWidth: 350 }}>
          <div style={{
            backgroundColor: 'rgba(8,8,10,0.93)',
            border: '1px solid rgba(55,65,81,0.9)',
            padding: '24px', borderRadius: 8,
            backdropFilter: 'blur(12px)',
          }}>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 600,
              color: 'rgba(107,114,128,0.7)', letterSpacing: '0.25em',
              textTransform: 'uppercase', margin: '0 0 8px',
            }}>Predictive ML Pipeline</p>
            <Declassify>
              <span style={{
                fontFamily: SWISS, fontWeight: 900,
                fontSize: 'clamp(36px, 4vw, 56px)',
                color: '#F3F4F6', lineHeight: 0.85,
                display: 'block', letterSpacing: '-0.02em',
              }}>+15%</span>
            </Declassify>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 600,
              color: '#dc2626', letterSpacing: '0.15em',
              textTransform: 'uppercase', margin: '8px 0 14px',
            }}>Day 7 Activation Lift</p>
            <AskHook question="The predictive churn model drove a +15% Day 7 activation lift — how did you unify GA4 and Firebase in BigQuery, and what signals did the model use for hyper-targeted LTV optimization?" />
            <p style={{
              fontFamily: SWISS, fontSize: 15, fontWeight: 400,
              color: 'rgba(229,231,235,0.95)', lineHeight: 1.65, margin: 0,
            }}>
              Unified GA4 and Firebase data into BigQuery. Deployed predictive churn models to drive hyper-targeted LTV optimization.
            </p>
          </div>
        </motion.div>

      </div>

      {/* ── Bottom row ── */}
      <div className="hidden md:flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>

        {/* ── Artifact 3: OTT Ecosystem (Bottom Left) ── */}
        <motion.div variants={f3Left} style={{ maxWidth: 380 }}>
          <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '4px solid #dc2626', paddingLeft: 20 }}>
            <Declassify>
              <span style={{
                fontFamily: SWISS, fontWeight: 900,
                fontSize: 'clamp(60px, 5.5vw, 88px)',
                color: '#F3F4F6', lineHeight: 0.8,
                display: 'block', letterSpacing: '-0.03em',
              }}>30,000+</span>
            </Declassify>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 600,
              color: 'rgba(156,163,175,0.7)', letterSpacing: '0.2em',
              textTransform: 'uppercase', margin: '12px 0',
            }}>OTT Subscribers</p>
            <AskHook question="The Masterclass OTT product hit 30,000+ subscribers — what was the subscription model, how did you differentiate it from free content, and how did you get to 2,000+ B2B paid subs?" />
            <p style={{
              fontFamily: SWISS, fontSize: 15, fontWeight: 400,
              color: 'rgba(209,213,219,0.92)', lineHeight: 1.65, margin: 0,
            }}>
              Led the 0-1 development of Masterclass, a bite-sized, subscription-based OTT product securing 2,000+ B2B paid subscriptions.
            </p>
          </div>
        </motion.div>

        {/* ── Artifact 4: Efficiency Matrix (Bottom Right) ── */}
        <motion.div variants={f3Right} style={{ maxWidth: 350 }}>
          <div style={{ display: 'flex', gap: 32, marginBottom: 16 }}>
            {[
              { v: '−10%', l: 'Early Churn' },
              { v: '+15%', l: 'Lead Conversion' },
            ].map((m, i) => (
              <div key={m.l}>
                <Declassify delay={i * 0.1}>
                  <span style={{
                    fontFamily: SWISS, fontWeight: 900,
                    fontSize: 'clamp(36px, 4vw, 52px)',
                    color: '#F3F4F6', lineHeight: 0.85,
                    display: 'block', letterSpacing: '-0.02em',
                  }}>{m.v}</span>
                </Declassify>
                <span style={{
                  fontFamily: SWISS, fontSize: 10, fontWeight: 600,
                  color: 'rgba(107,114,128,0.65)', letterSpacing: '0.18em',
                  textTransform: 'uppercase', marginTop: 6, display: 'block',
                }}>{m.l}</span>
              </div>
            ))}
          </div>
          <p style={{
            fontFamily: SWISS, fontSize: 15, fontWeight: 400,
            color: 'rgba(209,213,219,0.92)', lineHeight: 1.65, margin: 0,
          }}>
            Translated 100+ qualitative interviews into actionable, segment-based onboarding flows and high-converting B2B GTM strategies.
          </p>
          <AskHook question="Translating 100+ qualitative interviews into segmented onboarding flows is a major research-to-product cycle — how did you structure those interviews, and how did the −10% churn and +15% conversion outcomes validate your findings?" />
        </motion.div>

      </div>

    </motion.div>
  </section>
);


/* ════════════════════════════════════════════════════
   FOLD 4 — AGENTIC AI & RAG SYSTEMS (Absolute Spatial Canvas)
   4 architecture nodes framing the portrait
════════════════════════════════════════════════════ */
const f4Left    = { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } } };
const f4Right   = { hidden: { opacity: 0, x:  30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } } };
const f4Stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } } };

const Fold4 = () => (
  <section className="min-h-screen relative z-[2] w-full overflow-hidden">
    {/* Edge gradients */}
    <div className="absolute inset-y-0 left-0 w-1/3 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(15,20,25,0.9) 0%, transparent 100%)' }} />
    <div className="absolute inset-y-0 right-0 w-1/3 pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(15,20,25,0.9) 0%, transparent 100%)' }} />

    <motion.div
      className="relative w-full min-h-screen flex flex-col justify-between py-20 px-[8%]"
      variants={f4Stagger} initial="hidden" whileInView="visible" viewport={VP}
    >

      {/* ── Top row ── */}
      <div className="hidden md:flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>

        {/* ── Artifact 1: AI Architecture Node (Top Left) ── */}
        <motion.div variants={f4Left} style={{ maxWidth: 420 }}>
          <div style={{
            backgroundColor: 'rgba(10,10,10,0.9)',
            borderTop: '2px solid #dc2626',
            border: '1px solid rgba(55,65,81,0.9)',
            borderTopWidth: 2, borderTopColor: '#dc2626',
            padding: '24px', borderRadius: 8,
            backdropFilter: 'blur(12px)',
          }}>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 600,
              color: 'rgba(107,114,128,0.7)', letterSpacing: '0.25em',
              textTransform: 'uppercase', margin: '0 0 14px',
            }}>MILES ONE AI ASSISTANT</p>
            <p style={{
              fontFamily: SWISS, fontSize: 15, fontWeight: 400,
              color: 'rgba(229,231,235,0.95)', lineHeight: 1.7, margin: '0 0 18px',
            }}>
              Built the Miles One conversational AI assistant — an intelligent chatbot that handles student queries, books webinars, and retrieves course materials automatically. Connects to the LMS and booking systems to fulfil requests without human intervention.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['n8n', 'REST APIs', 'RAG'].map(tag => (
                <span key={tag} style={{
                  fontFamily: TELE, fontSize: 10,
                  color: 'rgba(220,38,38,0.85)',
                  backgroundColor: 'rgba(127,29,29,0.2)',
                  border: '1px solid rgba(220,38,38,0.2)',
                  padding: '3px 10px', borderRadius: 4,
                  letterSpacing: '0.05em',
                }}>{tag}</span>
              ))}
            </div>
            <AskHook question="The Miles One agentic assistant used function-calling and n8n orchestration for transactional fulfillment — how did you design the goal-oriented framework and what was the hardest edge case to handle in the LMS retrieval?" />
          </div>
        </motion.div>

        {/* ── Artifact 2: SuperBot Voice Node (Top Right) ── */}
        <motion.div variants={f4Right} style={{ maxWidth: 400 }}>
          <div style={{ borderLeft: '3px solid #dc2626', paddingLeft: 18 }}>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 700,
              color: '#dc2626', letterSpacing: '0.2em',
              textTransform: 'uppercase', margin: '0 0 14px',
            }}>SuperBot AI // High-Velocity Voice</p>

            <div style={{ display: 'flex', gap: 32, marginBottom: 16 }}>
              {[{ v: '+15%', l: 'Qualified Leads' }, { v: '−5%', l: 'Sales Cycle' }].map((m, i) => (
                <div key={m.l}>
                  <Declassify delay={i * 0.1}>
                    <span style={{
                      fontFamily: SWISS, fontWeight: 900,
                      fontSize: 'clamp(28px, 3.5vw, 44px)',
                      color: '#F3F4F6', lineHeight: 0.85,
                      display: 'block', letterSpacing: '-0.02em',
                    }}>{m.v}</span>
                  </Declassify>
                  <span style={{
                    fontFamily: SWISS, fontSize: 10, fontWeight: 600,
                    color: 'rgba(107,114,128,0.65)', letterSpacing: '0.18em',
                    textTransform: 'uppercase', marginTop: 6, display: 'block',
                  }}>{m.l}</span>
                </div>
              ))}
            </div>

            <p style={{
              fontFamily: SWISS, fontSize: 15, fontWeight: 400,
              color: 'rgba(229,231,235,0.95)', lineHeight: 1.65, margin: 0,
            }}>
              Architected a RAG-based AI Voice Assistant for real-time lead qualification. Powered by n8n data ingestion and PostgreSQL for instant memory retrieval, slashing sales analysis time.
            </p>
            <AskHook question="The SuperBot RAG voice assistant used n8n + PostgreSQL for memory — how did you design the retrieval layer, what was the latency profile in production, and how did it drive the +15% qualified lead increase?" />
          </div>
        </motion.div>

      </div>

      {/* ── Bottom row ── */}
      <div className="hidden md:flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>

        {/* ── Artifact 3: Massive Impact Metric (Bottom Left) ── */}
        <motion.div variants={f4Left} style={{ maxWidth: 380 }}>
          <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '4px solid #dc2626', paddingLeft: 20 }}>
            <Declassify>
              <span style={{
                fontFamily: SWISS, fontWeight: 900,
                fontSize: 'clamp(64px, 6vw, 96px)',
                color: '#F3F4F6', lineHeight: 0.8,
                display: 'block', letterSpacing: '-0.03em',
              }}>+25%</span>
            </Declassify>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 600,
              color: 'rgba(156,163,175,0.7)', letterSpacing: '0.2em',
              textTransform: 'uppercase', margin: '12px 0',
            }}>Automated Self-Service Lift</p>
            <AskHook question="The agentic framework drove a 25% self-service lift — what was the RAG pipeline design and how did you handle context retrieval and memory for transactional resolutions?" />
            <TelemetryMetric points={[0.5, 0.52, 0.55, 0.6, 0.65, 0.7, 0.72, 0.78, 0.85, 0.95]} label="self-service adoption" />
            <p style={{
              fontFamily: SWISS, fontSize: 15, fontWeight: 400,
              color: 'rgba(209,213,219,0.92)', lineHeight: 1.65, margin: 0,
            }}>
              Students resolve queries, rebook sessions, and access content without ever needing to speak to support — driving massive adoption of zero-touch automated service.
            </p>
          </div>
        </motion.div>

        {/* ── Artifact 4: Agentic Reporting & ELT (Bottom Right) ── */}
        <motion.div variants={f4Right} style={{ maxWidth: 380 }}>
          <p style={{
            fontFamily: SWISS, fontSize: 10, fontWeight: 600,
            color: 'rgba(107,114,128,0.65)', letterSpacing: '0.2em',
            textTransform: 'uppercase', margin: '0 0 10px',
          }}>AI REPORTING PLATFORM</p>
          <p style={{
            fontFamily: SWISS, fontSize: 15, fontWeight: 400,
            color: 'rgba(209,213,219,0.92)', lineHeight: 1.65, margin: '0 0 14px',
          }}>
            Built a custom reporting platform that lets leadership ask questions in plain English and get instant answers from our data warehouse — eliminating manual BI reporting.
          </p>
          <div style={{ borderLeft: '2px solid rgba(107,114,128,0.35)', paddingLeft: 14 }}>
            <p style={{
              fontFamily: SWISS, fontSize: 15, fontWeight: 400,
              color: 'rgba(229,231,235,0.9)', lineHeight: 1.65, margin: 0,
            }}>
              Provided leadership with a direct chat interface for real-time, substantive analysis, eliminating manual reporting latency.
            </p>
          </div>
          <AskHook question="The agentic reporting platform eliminated manual BI latency — what was the data warehouse schema, how did the RAG layer translate natural language to SQL, and what was the leadership adoption curve like?" />
        </motion.div>

      </div>

    </motion.div>
  </section>
);


/* ════════════════════════════════════════════════════
   FOLD 5 — INTERNAL SAAS & ECOSYSTEM ARCHITECTURE (Absolute Spatial Canvas)
   MarTech, CRM, and microservice wins across four corners
════════════════════════════════════════════════════ */
const f5Left    = { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } } };
const f5Right   = { hidden: { opacity: 0, x:  30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } } };
const f5Stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } } };

const Fold5 = () => (
  <section className="relative min-h-screen w-full overflow-hidden" style={{ zIndex: 2 }}>

    {/* Heavy edge gradients — text contrast against portrait */}
    <div className="absolute inset-y-0 left-0 w-1/3 pointer-events-none z-[3]"
      style={{ background: 'linear-gradient(to right, rgba(15,20,25,0.92) 0%, transparent 100%)' }} />
    <div className="absolute inset-y-0 right-0 w-1/3 pointer-events-none z-[3]"
      style={{ background: 'linear-gradient(to left, rgba(15,20,25,0.92) 0%, transparent 100%)' }} />

    <motion.div
      className="relative w-full min-h-screen flex flex-col justify-between py-20 px-[8%]"
      variants={f5Stagger}
      initial="hidden"
      whileInView="visible"
      viewport={VP}
    >

      {/* ── Top row ── */}
      <div className="hidden md:flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>

        {/* ── Artifact 1: MarTech & CDP Architecture (Top Left) ── */}
        <motion.div variants={f5Left} style={{ maxWidth: 420 }}>
          <div style={{
            backgroundColor: 'rgba(8,8,10,0.94)',
            border: '1px solid rgba(55,65,81,0.9)',
            padding: '24px',
            borderRadius: 8,
            backdropFilter: 'blur(12px)',
            backgroundImage: [
              'repeating-linear-gradient(0deg,  rgba(107,114,128,0.03) 0px, transparent 1px, transparent 28px)',
              'repeating-linear-gradient(90deg, rgba(107,114,128,0.03) 0px, transparent 1px, transparent 28px)',
            ].join(', '),
          }}>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 700,
              color: '#dc2626', letterSpacing: '0.25em',
              textTransform: 'uppercase', margin: '0 0 12px',
            }}>
              MARTECH &amp; CDP ARCHITECTURE
            </p>
            <p style={{
              fontFamily: SWISS, fontSize: 15, lineHeight: 1.7,
              color: 'rgba(229,231,235,0.95)', margin: '0 0 18px',
            }}>
              Governed the Customer Data Platform (CDP) implementation and event taxonomy across the full product ecosystem (Apps, Websites, CRM, LMS).
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'ETL / Orchestration', value: 'n8n & Zapier' },
                { label: 'Comms Routing',        value: 'Netcore · Clevertap · Wati' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontFamily: TELE, fontSize: 10, color: 'rgba(107,114,128,0.65)', whiteSpace: 'nowrap' }}>
                    {row.label}:
                  </span>
                  <span style={{ fontFamily: TELE, fontSize: 10, color: 'rgba(229,231,235,0.75)', letterSpacing: '0.04em' }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            <AskHook question="You governed the CDP implementation across apps, websites, CRM, and LMS simultaneously — how did you design the event taxonomy, and what was the most complex data routing problem you solved with n8n?" />
          </div>
        </motion.div>

        {/* ── Artifact 2: CRM Routing Protocol (Top Right) ── */}
        <motion.div variants={f5Right} style={{ maxWidth: 400 }}>
          <div style={{ borderLeft: '2px solid #dc2626', paddingLeft: 16 }}>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 600,
              color: 'rgba(107,114,128,0.65)', letterSpacing: '0.2em',
              textTransform: 'uppercase', margin: '0 0 8px',
            }}>
              MILES FORCE // INTERNAL CRM
            </p>
            <p style={{
              fontFamily: SWISS, fontSize: 15, fontWeight: 700,
              color: '#F3F4F6', letterSpacing: '0.02em',
              textTransform: 'uppercase', margin: '0 0 10px',
            }}>
              LEAD ROUTING &amp; SOURCE DETECTION
            </p>
            <p style={{
              fontFamily: SWISS, fontSize: 15,
              color: 'rgba(229,231,235,0.95)', lineHeight: 1.65, margin: 0,
            }}>
              Led the development of the Miles Force CRM module. Optimized the critical lead management flow from Enquiry to Sales Rep Allocation. Implemented a dynamic Sales Queue Module designed for day-level lead distribution to maximize sales efficiency.
            </p>
            <AskHook question="The Miles Force CRM module optimized the lead flow from Enquiry to SPOC Allocation — what were the failure modes in the original flow, and how did the dynamic Sales Queue Module change day-level distribution?" />
          </div>
        </motion.div>

      </div>

      {/* ── Bottom row ── */}
      <div className="hidden md:flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>

        {/* ── Artifact 3: Microservice Impact 1 — +30% (Bottom Left) ── */}
        <motion.div variants={f5Left} style={{ maxWidth: 380 }}>
          <div style={{ borderLeft: '4px solid #dc2626', paddingLeft: 20 }}>
            <Declassify>
              <span style={{
                fontFamily: SWISS, fontWeight: 900,
                fontSize: 'clamp(64px, 6vw, 96px)',
                color: '#F3F4F6', lineHeight: 0.8,
                letterSpacing: '-0.03em', display: 'block',
              }}>
                +30%
              </span>
            </Declassify>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 600,
              color: 'rgba(156,163,175,0.7)', letterSpacing: '0.2em',
              textTransform: 'uppercase', margin: '12px 0',
            }}>
              POST-COURSE ENGAGEMENT
            </p>
            <AskHook question="The multi-platform calendar booking microservice produced a 30% post-course engagement lift — how did you design the service and what channels did it connect to drive community acquisition?" />
            <p style={{
              fontFamily: SWISS, fontSize: 15,
              color: 'rgba(229,231,235,0.95)', lineHeight: 1.65, margin: 0,
            }}>
              Productized a multi-platform calendar booking microservice for Community Engagement, achieving a 12% lift in community-led acquisition.
            </p>
          </div>
        </motion.div>

        {/* ── Artifact 4: Microservice Impact 2 — +40% (Bottom Right) ── */}
        <motion.div variants={f5Right} style={{ maxWidth: 380 }}>
          <div style={{ borderLeft: '4px solid #dc2626', paddingLeft: 20 }}>
            <Declassify delay={0.1}>
              <span style={{
                fontFamily: SWISS, fontWeight: 900,
                fontSize: 'clamp(64px, 6vw, 96px)',
                color: '#F3F4F6', lineHeight: 0.8,
                letterSpacing: '-0.03em', display: 'block',
              }}>
                +40%
              </span>
            </Declassify>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 600,
              color: 'rgba(156,163,175,0.7)', letterSpacing: '0.2em',
              textTransform: 'uppercase', margin: '12px 0',
            }}>
              SCALED WEBINAR FREQUENCY
            </p>
            <AskHook question="The Zoom-integrated SaaS content microservice scaled webinar frequency by 40% — how did the web page builder work, how did it integrate with the CRM, and what drove the 20% base conversion improvement?" />
            <p style={{
              fontFamily: SWISS, fontSize: 15,
              color: 'rgba(229,231,235,0.95)', lineHeight: 1.65, margin: 0,
            }}>
              Developed an Internal SaaS Content Microservice integrated with Zoom and our CRM. This custom web page builder scaled deployments and drove a 20% increase in base conversion.
            </p>
          </div>
        </motion.div>

      </div>

    </motion.div>
  </section>
);


/* ════════════════════════════════════════════════════
   FOLD 6 — TACTICAL OPERATIONS BOARD (AlmaBetter)
   After-action report aesthetic — absolute spatial canvas
════════════════════════════════════════════════════ */
const f6Left    = { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } } };
const f6Right   = { hidden: { opacity: 0, x:  30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } } };
const f6Stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } } };
const VP6       = { once: true, margin: '-150px' };

const Fold6 = () => (
  <section className="relative min-h-screen w-full overflow-hidden" style={{ zIndex: 2 }}>

    {/* Heavy edge gradients */}
    <div className="absolute inset-y-0 left-0 w-1/3 pointer-events-none z-[3]"
      style={{ background: 'linear-gradient(to right, rgba(15,20,25,0.92) 0%, transparent 100%)' }} />
    <div className="absolute inset-y-0 right-0 w-1/3 pointer-events-none z-[3]"
      style={{ background: 'linear-gradient(to left, rgba(15,20,25,0.92) 0%, transparent 100%)' }} />

    <motion.div
      className="relative w-full min-h-screen flex flex-col justify-between py-20 px-[8%]"
      variants={f6Stagger}
      initial="hidden"
      whileInView="visible"
      viewport={VP6}
    >

      {/* ── Top row ── */}
      <div className="hidden md:flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>

        {/* ── Artifact 1: Jurisdiction Tab (Top Left) ── */}
        <motion.div variants={f6Left} style={{ maxWidth: 400 }}>
          <div style={{
            borderBottom: '1px solid rgba(107,114,128,0.4)',
            borderLeft: '1px solid rgba(107,114,128,0.4)',
            paddingLeft: 16,
            paddingBottom: 16,
          }}>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 700,
              color: '#dc2626', letterSpacing: '0.3em',
              textTransform: 'uppercase', margin: '0 0 8px',
            }}>
              PAST JURISDICTION // ALMABETTER
            </p>
            <p style={{
              fontFamily: TELE, fontSize: 12,
              color: 'rgba(209,213,219,0.92)', margin: '0 0 8px',
            }}>
              ASSOCIATE PROGRAM MANAGER // PRODUCT GROWTH
            </p>
            <span style={{
              fontFamily: TELE, fontSize: 11,
              color: 'rgba(107,114,128,0.65)', display: 'block',
            }}>
              [ NOV 2022 – OCT 2023 ]
            </span>
          </div>
        </motion.div>

        {/* ── Artifact 2: Engineering Ops Node (Top Right) ── */}
        <motion.div variants={f6Right} style={{ maxWidth: 380 }}>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', top: 0, right: 0,
              fontFamily: SWISS, fontSize: 18, fontWeight: 300,
              color: 'rgba(220,38,38,0.5)', lineHeight: 1,
            }}>+</span>

            <Declassify>
              <span style={{
                fontFamily: SWISS, fontWeight: 900,
                fontSize: 'clamp(48px, 5vw, 72px)',
                color: '#F3F4F6', lineHeight: 1,
                letterSpacing: '-0.03em', display: 'block',
              }}>
                -80%
              </span>
            </Declassify>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 600,
              color: 'rgba(107,114,128,0.65)', letterSpacing: '0.2em',
              textTransform: 'uppercase', margin: '8px 0 12px',
            }}>
              DEV ERROR REDUCTION
            </p>
            <AskHook question="An 80% drop in dev errors is a massive outcome — what was broken in the AlmaBetter JIRA and Basecamp setup, and what specific workflow changes did you make to fix velocity and content readiness?" />
            <p style={{
              fontFamily: SWISS, fontSize: 15,
              color: 'rgba(229,231,235,0.95)', lineHeight: 1.65, margin: 0,
            }}>
              Redesigned engineering workflows and sprint cycles using JIRA and Basecamp. Resolved velocity misalignments and accelerated content readiness by two full weeks.
            </p>
          </div>
        </motion.div>

      </div>

      {/* ── Bottom row ── */}
      <div className="hidden md:flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>

        {/* ── Artifact 3: Resolution Matrix (Bottom Left) ── */}
        <motion.div variants={f6Left} style={{ maxWidth: 380 }}>
          <div style={{ borderLeft: '4px solid #dc2626', paddingLeft: 20 }}>
            <Declassify>
              <span style={{
                fontFamily: SWISS, fontWeight: 900,
                fontSize: 'clamp(64px, 6vw, 96px)',
                color: '#F3F4F6', lineHeight: 0.8,
                letterSpacing: '-0.03em', display: 'block',
              }}>
                9.1
              </span>
            </Declassify>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 600,
              color: 'rgba(239,68,68,0.8)', letterSpacing: '0.2em',
              textTransform: 'uppercase', margin: '12px 0 4px',
            }}>
              PEAK CSAT SCORE
            </p>
            <AskHook question="AlmaBetter's CSAT moved from 7.0 to a peak of 9.1 — how did you design the productized ticketing system, what did the n8n ELT layer actually do, and where did you cut the 35% resolution time?" />
            <TelemetryMetric points={[0.55, 0.58, 0.6, 0.63, 0.68, 0.72, 0.76, 0.82, 0.88, 0.95]} label="csat trajectory" />
            <span style={{
              fontFamily: TELE, fontSize: 11,
              color: 'rgba(107,114,128,0.65)', display: 'block', marginBottom: 12,
            }}>
              [ UP FROM 7.0 ]
            </span>
            <p style={{
              fontFamily: SWISS, fontSize: 15,
              color: 'rgba(229,231,235,0.95)', lineHeight: 1.65, margin: 0,
            }}>
              Architected and shipped a productized ticketing system. Utilized an n8n ELT layer to cut resolution time by 35% and completely transform the customer support experience.
            </p>
          </div>
        </motion.div>

        {/* ── Artifact 4: GTM & Acquisition Board (Bottom Right) ── */}
        <motion.div variants={f6Right} style={{ maxWidth: 420 }}>
          <div style={{
            backgroundColor: 'rgba(8,8,10,0.94)',
            border: '1px solid rgba(55,65,81,0.9)',
            padding: '24px',
            backdropFilter: 'blur(12px)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              {[
                { metric: '+20%', label: 'QoQ Revenue' },
                { metric: '+40%', label: 'Qualified Leads' },
              ].map(item => (
                <div key={item.label}>
                  <Declassify>
                    <span style={{
                      fontFamily: SWISS, fontWeight: 700,
                      fontSize: 'clamp(28px, 3vw, 36px)',
                      color: '#FFFFFF', lineHeight: 1,
                      display: 'block', letterSpacing: '-0.02em',
                    }}>
                      {item.metric}
                    </span>
                  </Declassify>
                  <p style={{
                    fontFamily: SWISS, fontSize: 10, fontWeight: 600,
                    color: 'rgba(107,114,128,0.65)', letterSpacing: '0.2em',
                    textTransform: 'uppercase', margin: '6px 0 0',
                  }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ height: 1, backgroundColor: 'rgba(55,65,81,0.6)', marginBottom: 16 }} />
            <p style={{
              fontFamily: SWISS, fontSize: 15,
              color: 'rgba(229,231,235,0.95)', lineHeight: 1.65, margin: 0,
            }}>
              Orchestrated the Go-to-Market strategy for the Events Vertical. Optimized acquisition spend across WhatsApp and MarTech channels, increasing online enrollments by 60% and shortening the sales cycle by 10%.
            </p>
            <AskHook question="The Events GTM strategy increased online enrollments by 60% and shortened the sales cycle by 10% — how did you allocate spend across WhatsApp and MarTech channels, and what was the key acquisition insight that drove the QoQ lift?" />
          </div>
        </motion.div>

      </div>

    </motion.div>
  </section>
);


/* ════════════════════════════════════════════════════
   FOLD 7 — UPGRAD (Behavioral Data & Content Strategy)
   Absolute spatial canvas — four corners
════════════════════════════════════════════════════ */
const f7Left    = { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } } };
const f7Right   = { hidden: { opacity: 0, x:  30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } } };
const f7Stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } } };
const VP7       = { once: true, margin: '-150px' };

const Fold7 = () => (
  <section className="relative min-h-screen w-full overflow-hidden" style={{ zIndex: 2 }}>

    {/* Heavy edge gradients */}
    <div className="absolute inset-y-0 left-0 w-1/3 pointer-events-none z-[3]"
      style={{ background: 'linear-gradient(to right, rgba(15,20,25,0.92) 0%, transparent 100%)' }} />
    <div className="absolute inset-y-0 right-0 w-1/3 pointer-events-none z-[3]"
      style={{ background: 'linear-gradient(to left, rgba(15,20,25,0.92) 0%, transparent 100%)' }} />

    <motion.div
      className="relative w-full min-h-screen flex flex-col justify-between py-20 px-[8%]"
      variants={f7Stagger}
      initial="hidden"
      whileInView="visible"
      viewport={VP7}
    >

      {/* ── Top row ── */}
      <div className="hidden md:flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>

        {/* ── Artifact 1: Jurisdiction Tab (Top Left) ── */}
        <motion.div variants={f7Left} style={{ maxWidth: 400 }}>
          <div style={{
            borderBottom: '1px solid rgba(107,114,128,0.4)',
            borderLeft:   '1px solid rgba(107,114,128,0.4)',
            paddingLeft: 16, paddingBottom: 16,
          }}>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 700,
              color: '#dc2626', letterSpacing: '0.3em',
              textTransform: 'uppercase', margin: '0 0 8px',
            }}>
              PAST JURISDICTION // UPGRAD
            </p>
            <p style={{
              fontFamily: TELE, fontSize: 12,
              color: 'rgba(209,213,219,0.92)', margin: '0 0 8px',
            }}>
              SR. ASSOCIATE // PROGRAM &amp; CONTENT STRATEGY
            </p>
            <span style={{
              fontFamily: TELE, fontSize: 11,
              color: 'rgba(107,114,128,0.65)', display: 'block',
            }}>
              [ JAN 2021 – OCT 2022 ]
            </span>
          </div>
        </motion.div>

        {/* ── Artifact 2: Behavioral Analysis Node (Top Right) ── */}
        <motion.div variants={f7Right} style={{ maxWidth: 400 }}>
          <div style={{
            backgroundColor: 'rgba(10,10,10,0.80)',
            border: '1px solid rgba(55,65,81,0.9)',
            padding: '24px', backdropFilter: 'blur(12px)',
          }}>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 600,
              color: 'rgba(107,114,128,0.65)', letterSpacing: '0.25em',
              textTransform: 'uppercase', margin: '0 0 12px',
            }}>
              BEHAVIORAL DATA ANALYSIS
            </p>
            <p style={{
              fontFamily: SWISS, fontSize: 15,
              color: 'rgba(229,231,235,0.95)', lineHeight: 1.65, margin: 0,
            }}>
              Addressed critical learner engagement drop-offs by analyzing deep behavioral data. Identified structural friction points and introduced new learning strategies that directly improved learner success metrics by 12%.
            </p>
            <AskHook question="You identified structural friction points in UpGrad's learner journey through behavioral data — what metrics did you analyze, what was the most surprising friction point you found, and what product intervention had the biggest impact?" />
          </div>
        </motion.div>

      </div>

      {/* ── Bottom row ── */}
      <div className="hidden md:flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>

        {/* ── Artifact 3: Impact Metric (Bottom Left) ── */}
        <motion.div variants={f7Left} style={{ maxWidth: 380 }}>
          <div style={{ borderLeft: '4px solid #dc2626', paddingLeft: 20 }}>
            <Declassify>
              <span style={{
                fontFamily: SWISS, fontWeight: 900,
                fontSize: 'clamp(64px, 6vw, 96px)',
                color: '#F3F4F6', lineHeight: 0.8,
                letterSpacing: '-0.03em', display: 'block',
              }}>
                +20%
              </span>
            </Declassify>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 600,
              color: 'rgba(156,163,175,0.7)', letterSpacing: '0.2em',
              textTransform: 'uppercase', margin: '12px 0',
            }}>
              COURSE COMPLETION LIFT
            </p>
            <AskHook question="You identified a 120-minute decay curve at UpGrad that no one had seen — how did you find it in the behavioral data, and what product interventions did you ship to convert that insight into a 20% completion lift?" />
            <p style={{
              fontFamily: SWISS, fontSize: 15,
              color: 'rgba(229,231,235,0.95)', lineHeight: 1.65, margin: 0,
            }}>
              Translated user behavioral insights into actionable product interventions, successfully increasing overall course completion rates across cohort groups.
            </p>
          </div>
        </motion.div>

        {/* ── Artifact 4: Program Strategy (Bottom Right) ── */}
        <motion.div variants={f7Right} style={{ maxWidth: 380 }}>
          <div>
            <p style={{
              fontFamily: SWISS, fontSize: 10, fontWeight: 600,
              color: 'rgba(239,68,68,0.8)', letterSpacing: '0.2em',
              textTransform: 'uppercase', margin: '0 0 12px',
            }}>
              PROGRAM ROADMAP // GTM
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Defined and executed content roadmaps for 5 distinct post-graduate programs.',
                'Conducted deep market analysis to identify curriculum gaps.',
                'Led the design and 0-1 launch of new PG & BBA-MBA programs addressing unmet learner needs.',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{
                    fontFamily: TELE, fontSize: 10,
                    color: 'rgba(239,68,68,0.5)', flexShrink: 0, marginTop: 2,
                  }}>{'>'}</span>
                  <p style={{
                    fontFamily: SWISS, fontSize: 15,
                    color: 'rgba(229,231,235,0.95)', lineHeight: 1.65, margin: 0,
                  }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
            <AskHook question="You ran content roadmaps for 5 distinct post-graduate programs at UpGrad — how did you prioritize curriculum gaps across programs, and what was your process for moving from market analysis to a shipped PG program?" />
          </div>
        </motion.div>

      </div>

    </motion.div>
  </section>
);


/* ════════════════════════════════════════════════════
   FOLD 8 — TECH STACK & VISUAL TELEMETRY
   Proficiency bars (left) + hard tool arsenal (right)
════════════════════════════════════════════════════ */
const f8Left    = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } } };
const f8Right   = { hidden: { opacity: 0, x:  40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } } };
const f8Stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.18, delayChildren: 0.05 } } };
const VP8       = { once: true, margin: '-120px' };

const PROFICIENCY_BARS = [
  { label: 'DATA PLATFORM ARCHITECTURE',      pct: 95, q: "Give me a concrete example of a data platform architecture decision you made — what was the problem, what stack did you choose, and what was the downstream product impact?" },
  { label: 'ENTERPRISE AUTOMATION (ETL/ELT)', pct: 90, q: "Walk me through the most complex ETL or ELT pipeline you have built — what was being moved, where did n8n fit in, and how did it change how the product team operated?" },
  { label: 'AI / ML INTEGRATION (RAG)',       pct: 85, q: "Describe a production RAG implementation you shipped — what was the retrieval strategy, how did you handle hallucination risk, and what metric moved as a result?" },
  { label: 'PRODUCT-LED GROWTH (PLG)',        pct: 90, q: "What is the most effective PLG growth loop you have designed and shipped — how did you identify the activation moment and what did the loop look like end-to-end?" },
  { label: '0–1 MVP DEPLOYMENT',              pct: 95, q: "Walk me through the 0-to-1 product you are most proud of — from the first principles conversation through to live deployment and first real users." },
];

const ARSENAL_CATEGORIES = [
  {
    subhead: '[ DATA LAYER ]',
    tools: ['BigQuery', 'PostgreSQL', 'GA4', 'Looker', 'Firebase'],
  },
  {
    subhead: '[ AUTOMATION & CDP ]',
    tools: ['n8n', 'Zapier', 'Netcore', 'Clevertap', 'Wati', 'Mixpanel'],
  },
  {
    subhead: '[ STRATEGY & DELIVERY ]',
    tools: ['Agile Scrum', 'Goal-Oriented RAG', 'Amplitude', 'JIRA'],
  },
];

const FoldTechStack = () => (
  <section className="relative min-h-screen w-full overflow-hidden" style={{ zIndex: 2 }}>

    {/* Heavy edge gradients */}
    <div className="absolute inset-y-0 left-0 w-1/3 pointer-events-none z-[3]"
      style={{ background: 'linear-gradient(to right, rgba(15,20,25,0.92) 0%, transparent 100%)' }} />
    <div className="absolute inset-y-0 right-0 w-1/3 pointer-events-none z-[3]"
      style={{ background: 'linear-gradient(to left, rgba(15,20,25,0.92) 0%, transparent 100%)' }} />

    <motion.div
      className="relative min-h-screen w-full"
      variants={f8Stagger}
      initial="hidden"
      whileInView="visible"
      viewport={VP8}
    >

      {/* ── Artifact 1: Proficiency Telemetry (Left) ── */}
      <motion.div
        variants={f8Left}
        className="absolute z-10 hidden md:block"
        style={{ top: '20%', left: '8%', width: 400 }}
      >
        <div style={{
          backgroundColor: 'rgba(8,8,10,0.94)',
          border: '1px solid rgba(55,65,81,0.9)',
          padding: '32px',
          backdropFilter: 'blur(12px)',
        }}>
          <p style={{
            fontFamily: TELE, fontSize: 10, fontWeight: 600,
            color: '#dc2626', letterSpacing: '0.25em',
            textTransform: 'uppercase', margin: '0 0 32px',
          }}>
            SYSTEM UTILIZATION // MACRO SKILLS
          </p>

          {PROFICIENCY_BARS.map((bar, i) => (
            <div key={bar.label} style={{ marginBottom: i < PROFICIENCY_BARS.length - 1 ? 24 : 0 }}>
              <p style={{
                fontFamily: SWISS, fontSize: 10, fontWeight: 600,
                color: 'rgba(209,213,219,0.8)', letterSpacing: '0.12em',
                textTransform: 'uppercase', margin: '0 0 8px',
              }}>
                {bar.label}
              </p>
              <AskHook question={bar.q} />
              {/* Track */}
              <div style={{
                height: 6, width: '100%',
                backgroundColor: 'rgba(55,65,81,0.5)',
                overflow: 'hidden',
              }}>
                {/* Fill — animates 0% → target width */}
                <motion.div
                  initial={{ width: '0%' }}
                  whileInView={{ width: `${bar.pct}%` }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 + i * 0.12 }}
                  style={{ height: '100%', backgroundColor: '#dc2626' }}
                />
              </div>
              <p style={{
                fontFamily: TELE, fontSize: 9,
                color: 'rgba(107,114,128,0.5)', letterSpacing: '0.1em',
                margin: '4px 0 0', textAlign: 'right',
              }}>
                {bar.pct}%
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Artifact 2: Hard Arsenal Grid (Right) ── */}
      <motion.div
        variants={f8Right}
        className="absolute z-10 hidden md:block"
        style={{ top: '20%', right: '8%', maxWidth: 450 }}
      >
        <p style={{
          fontFamily: TELE, fontSize: 10, fontWeight: 600,
          color: 'rgba(107,114,128,0.65)', letterSpacing: '0.2em',
          textTransform: 'uppercase', margin: '0 0 32px',
        }}>
          THE ARSENAL // CORE STACK
        </p>

        <HexGrid categories={ARSENAL_CATEGORIES} />
      </motion.div>

    </motion.div>
  </section>
);


/* ════════════════════════════════════════════════════
   FOLD 8 — WIRETAP TERMINAL (Interactive Intercepts)
   Dual-pane surveillance terminal — click to decrypt
════════════════════════════════════════════════════ */
const INTERCEPTS = [
  {
    codename: 'THE ARCHITECT',
    role: 'PRINCIPAL ENGINEER',
    quote: "Satyajit builds deterministic architecture. He doesn't just pass PRDs — he ensures the engineering layer actually scales. The way he pre-empted failure points in our RAG pipeline saved us two sprints.",
  },
  {
    codename: 'THE STRATEGIST',
    role: 'VP PRODUCT',
    quote: "His GTM thinking is rare. He connects product decisions directly to revenue outcomes with a precision most PMs never reach. The Events vertical went from zero to a repeatable acquisition machine under his ownership.",
  },
  {
    codename: 'THE ANALYST',
    role: 'DATA SCIENCE LEAD',
    quote: "The most data-fluent PM I've worked with. Satyajit turns behavioral signals into product interventions that actually move metrics. He identified a 120-minute engagement decay curve that nobody else had seen.",
  },
  {
    codename: 'THE OPERATOR',
    role: 'ENGINEERING MANAGER',
    quote: "He ran the entire CRM module migration with zero velocity loss. The kind of execution that makes you wonder how he managed it alone. The Sales Queue module was spec'd, built, and deployed in under three weeks.",
  },
  {
    codename: 'THE COMMISSIONER',
    role: 'DIRECTOR OF PRODUCT',
    quote: "Product leadership material. Satyajit thinks in systems, not features. Every initiative he touched had compounding returns. He's the kind of operator you build a roadmap around.",
  },
  {
    codename: 'THE WITNESS',
    role: 'SENIOR PM',
    quote: "Working alongside him on the AI pipeline showed me what first-principles product thinking looks like in practice. He doesn't copy patterns — he interrogates the problem until the right architecture surfaces.",
  },
];

const Fold8 = () => {
  const [activeIntercept, setActiveIntercept] = useState(0);
  const active = INTERCEPTS[activeIntercept];

  return (
    <section
      className="relative w-full flex flex-col justify-center items-center overflow-hidden py-24 px-6"
      style={{ zIndex: 2, minHeight: '80vh' }}
    >
      {/* Edge gradients */}
      <div className="absolute inset-y-0 left-0 w-1/4 pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(to right, rgba(15,20,25,0.95) 0%, transparent 100%)' }} />
      <div className="absolute inset-y-0 right-0 w-1/4 pointer-events-none z-[1]"
        style={{ background: 'linear-gradient(to left, rgba(15,20,25,0.95) 0%, transparent 100%)' }} />

      {/* Section header */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        style={{
          fontFamily: TELE, fontSize: 10,
          color: 'rgba(107,114,128,0.55)', letterSpacing: '0.4em',
          textTransform: 'uppercase', marginBottom: 28,
        }}
      >
        [ VERIFIED FIELD INFORMANTS ]
      </motion.p>

      {/* ── Dual-pane terminal ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
        className="w-full max-w-5xl flex flex-col md:flex-row gap-0 relative z-20"
        style={{
          border: '1px solid rgba(255,255,255,0.1)',
          backgroundColor: 'rgba(10,10,10,0.4)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 8,
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}
      >
        {/* ── Left pane: Frequencies ── */}
        <div
          className="relative z-10 flex flex-col"
          style={{
            width: '100%', maxWidth: 260, flexShrink: 0,
            borderRight: '1px solid rgba(255,255,255,0.07)',
            padding: '28px 20px',
          }}
        >
          <span style={{
            fontFamily: TELE, fontSize: 9,
            color: '#dc2626', letterSpacing: '0.3em',
            textTransform: 'uppercase', display: 'block', marginBottom: 20,
          }}>
            [ AVAILABLE INTERCEPTS ]
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {INTERCEPTS.map((inf, i) => {
              const isActive = activeIntercept === i;
              return (
                <button
                  key={inf.codename}
                  onClick={() => setActiveIntercept(i)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 14px',
                    backgroundColor: isActive ? 'rgba(239,68,68,0.08)' : 'transparent',
                    backgroundImage: isActive ? 'linear-gradient(to right, rgba(239,68,68,0.06), transparent)' : 'none',
                    color: isActive ? '#ffffff' : 'rgba(156,163,175,0.8)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: 'none',
                    borderLeft: `2px solid ${isActive ? '#ef4444' : 'rgba(55,65,81,0.5)'}`,
                    outline: 'none',
                    width: '100%',
                    borderRadius: '0 4px 4px 0',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.borderLeftColor = 'rgba(156,163,175,0.5)';
                      e.currentTarget.style.color = 'rgba(229,231,235,0.9)';
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.borderLeftColor = 'rgba(55,65,81,0.5)';
                      e.currentTarget.style.color = 'rgba(156,163,175,0.8)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span style={{
                    display: 'block', marginBottom: 3,
                    fontFamily: SWISS, fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                  }}>{inf.codename}</span>
                  <span style={{
                    fontFamily: TELE, fontSize: 9,
                    color: isActive ? 'rgba(239,68,68,0.7)' : 'rgba(107,114,128,0.6)',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>
                    {inf.role}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right pane: Decrypted Transcript ── */}
        <div
          className="relative z-10 flex flex-col justify-center overflow-hidden"
          style={{ flex: 1, padding: '32px 36px', minHeight: 320 }}
        >
          {/* Giant decorative quotation mark */}
          <span style={{
            position: 'absolute', top: -8, left: 24,
            fontFamily: 'Georgia, serif', fontSize: 160, lineHeight: 1,
            color: 'rgba(255,255,255,0.04)',
            pointerEvents: 'none', userSelect: 'none',
            zIndex: 0,
          }}>&ldquo;</span>

          {/* Status bar */}
          <div className="relative z-10" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                backgroundColor: '#4ade80',
                animation: 'pulse6 1.4s ease-in-out infinite',
                boxShadow: '0 0 8px rgba(74,222,128,0.7)',
              }} />
              <span style={{
                fontFamily: TELE, fontSize: 9,
                color: '#4ade80', letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}>
                STATUS: DECRYPTED
              </span>
            </div>
            <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <span style={{
              fontFamily: TELE, fontSize: 9,
              color: 'rgba(156,163,175,0.6)', letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              {active.codename}
            </span>
          </div>

          {/* Animated quote — sans-serif, large, readable */}
          <motion.p
            key={activeIntercept}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="relative z-10"
            style={{
              fontFamily: SWISS, fontSize: 'clamp(16px, 1.6vw, 22px)',
              fontWeight: 300, letterSpacing: '0.01em',
              color: '#f3f4f6', lineHeight: 1.75,
              margin: 0,
            }}
          >
            &ldquo;{active.quote}&rdquo;
          </motion.p>

          {/* Sign-off */}
          <motion.span
            key={`role-${activeIntercept}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="relative z-10"
            style={{
              fontFamily: TELE, fontSize: 10,
              color: '#ef4444', letterSpacing: '0.2em',
              display: 'block', marginTop: 24,
              textTransform: 'uppercase',
            }}
          >
            {'> [ VERIFIED : '}{active.role}{' ]'}
          </motion.span>
          <div className="relative z-10">
            <AskHook question={`A ${active.role.toLowerCase()} described specific work you did — ask Satyajit directly about the capability or project referenced in this intercept.`} />
          </div>
        </div>
      </motion.div>
    </section>
  );
};


/* ════════════════════════════════════════════════════
   FOLD 9 — ACADEMIC ARCHIVES & THE SEAL
   Credentials ledger + END OF FILE stamp
════════════════════════════════════════════════════ */
const Fold9 = () => (
  <section
    className="relative min-h-screen w-full flex flex-col items-center justify-end pb-32"
    style={{ zIndex: 10 }}
  >
    {/* Bottom shadow — frames the portrait */}
    <div
      className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
      style={{ background: 'linear-gradient(to top, rgba(15,20,25,0.82) 0%, rgba(15,20,25,0.45) 50%, transparent 100%)' }}
    />

    {/* ── Academic Ledger ── */}
    <motion.div
      className="relative z-10 flex flex-col items-center gap-6 max-w-2xl text-center mb-16 px-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.5, ease: 'linear' }}
    >
      {[
        {
          degree: 'PGDM MARKETING',
          institution: 'Pune Institute of Business Management',
          detail: 'CGPA: 8.21 · Major: Marketing · Minors: Retail Marketing, Market Research',
        },
        {
          degree: 'B.TECH AUTOMOTIVE ENG.',
          institution: 'Dr. Sudhir Chandra Sur Degree Engineering College, MAKAUT',
          detail: 'CGPA: 7.8',
        },
      ].map(edu => (
        <div key={edu.degree}>
          <p style={{
            fontFamily: TELE, fontSize: 15,
            color: 'rgba(156,163,175,0.85)', lineHeight: 1.7, margin: 0,
          }}>
            <span style={{ color: 'rgba(229,231,235,0.75)', fontWeight: 600 }}>{edu.degree}</span>
            {' — '}{edu.institution}
          </p>
          <p style={{
            fontFamily: TELE, fontSize: 11,
            color: 'rgba(107,114,128,0.6)', margin: '4px 0 0',
          }}>
            {edu.detail}
          </p>
        </div>
      ))}

      {/* Red rule */}
      <div style={{ width: 48, height: 1, backgroundColor: 'rgba(220,38,38,0.35)' }} />

      {/* Cert badges */}
      <div className="flex flex-wrap justify-center gap-4">
        {[
          'CERTIFIED SCRUM PRODUCT OWNER',
          'SIX SIGMA GREEN BELT',
          'GOOGLE ANALYTICS',
          'ADVANCED EXCEL & SEO',
        ].map(badge => (
          <span
            key={badge}
            style={{
              fontFamily: TELE, fontSize: 10,
              color: 'rgba(209,213,219,0.7)', letterSpacing: '0.15em',
              border: '1px solid rgba(55,65,81,0.7)',
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: '4px 12px',
              backdropFilter: 'blur(4px)',
              display: 'inline-block',
            }}
          >
            [ {badge} ]
          </span>
        ))}
      </div>
      <AskHook question="PGDM Marketing from PIBM with an 8.21 CGPA plus a B.Tech in Automotive Engineering — how does an engineering-to-marketing-to-product-manager trajectory actually happen, and what from each phase still shows up in your PM work?" />
    </motion.div>

    {/* ── END OF FILE stamp — spring stamp-in ── */}
    <motion.div
      className="relative z-10 pointer-events-none select-none"
      initial={{ scale: 1.4, opacity: 0, rotate: -6 }}
      whileInView={{ scale: 1, opacity: 1, rotate: -6 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.3 }}
    >
      <p style={{
        fontFamily: SWISS, fontWeight: 900,
        fontSize: 'clamp(52px, 9vw, 150px)',
        color: 'rgba(185,28,28,0.8)',
        textTransform: 'uppercase',
        letterSpacing: '-0.03em',
        lineHeight: 1,
        margin: 0,
        padding: '16px 0',
        borderTop: '8px solid rgba(185,28,28,0.8)',
        borderBottom: '8px solid rgba(185,28,28,0.8)',
        mixBlendMode: 'overlay',
        userSelect: 'none',
      }}>
        [ END OF FILE ]
      </p>
    </motion.div>

      {/* ── Action Console ── */}
      <div className="relative z-[20] w-full">
        <ActionConsole />
      </div>
    </section>
);


/* ════════════════════════════════════
   LOGO CAROUSEL — fixed bottom, infinite scroll left→right
════════════════════════════════════ */
const COMPANY_LOGOS = [
  { src: '/logos/images (1).jpeg',                              alt: 'Miles Education' },
  { src: '/logos/09505304e71f839cbb5159308eef1f0f90d16e.jpg',   alt: 'AlmaBetter' },
  { src: '/logos/upGrad-acquires.jpg',                          alt: 'UpGrad' },
];

const LogoCarousel = () => (
  <div style={{
    position: 'absolute', bottom: 24, left: 0, right: 0, zIndex: 10,
    overflow: 'hidden', pointerEvents: 'none',
  }}>
    <div style={{
      display: 'flex', alignItems: 'center',
      width: 'max-content',
      animation: 'logoScroll 14s linear infinite',
    }}>
      {/* Two sets for seamless loop */}
      {[0, 1].map(setIdx =>
        COMPANY_LOGOS.map((logo, i) => (
          <img
            key={`${setIdx}-${i}`}
            src={logo.src}
            alt={logo.alt}
            draggable={false}
            style={{
              height: 40,
              width: 'auto',
              opacity: 0.75,
              userSelect: 'none',
              flexShrink: 0,
              marginRight: 'calc((100vw - 120px) / 3)',
            }}
          />
        ))
      )}
    </div>
  </div>
);


/* ════════════════════════════════════
   ROOT EXPORT
════════════════════════════════════ */
const Dossier = () => (
  <div className="relative bg-[#0F1419] dossier-cursor">
    <CrosshairCursor />
    <CentralSpine />
    <DossierStyles />
    <FixedPortrait />
    <div className="relative z-[2]">
      <Fold1 />
      <Fold2 />
      <Fold3 />
      <Fold4 />
      <Fold5 />
      <Fold6 />
      <Fold7 />
      <FoldTechStack />
      <Fold8 />
      <Fold9 />
    </div>
  </div>
);

export default Dossier;
