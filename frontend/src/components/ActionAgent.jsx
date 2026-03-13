import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'https://satyajits-digital-twin-694737663583.asia-south1.run.app';
const EXPO_OUT = [0.16, 1, 0.3, 1];
const SWISS    = "'Helvetica Neue', Helvetica, Arial, sans-serif";

/* ── Blinking block cursor ── */
const BlinkingCursor = () => {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn(v => !v), 530);
    return () => clearInterval(id);
  }, []);
  return <span style={{ opacity: on ? 1 : 0, transition: 'none' }}>&#9646;</span>;
};

/* ── Header square button ── */
const HeaderBtn = ({ onClick, title, children, red }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      width: 20, height: 20,
      background: 'transparent',
      border: `1px solid ${red ? 'rgba(178,34,34,0.45)' : 'rgba(255,255,255,0.09)'}`,
      color: red ? 'rgba(178,34,34,0.75)' : 'rgba(214,205,184,0.35)',
      fontFamily: SWISS, fontSize: 12,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', lineHeight: 1, flexShrink: 0,
      transition: 'border-color 0.15s, color 0.15s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = red ? 'rgba(178,34,34,0.9)' : 'rgba(255,255,255,0.3)';
      e.currentTarget.style.color       = red ? '#B22222' : 'rgba(214,205,184,0.9)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = red ? 'rgba(178,34,34,0.45)' : 'rgba(255,255,255,0.09)';
      e.currentTarget.style.color       = red ? 'rgba(178,34,34,0.75)' : 'rgba(214,205,184,0.35)';
    }}
  >
    {children}
  </button>
);

/* ── Main Component ── */
const ActionAgent = () => {
  const [sessionId, setSessionId]         = useState(null);
  const [isOpen, setIsOpen]               = useState(false);
  const [isExpanded, setIsExpanded]       = useState(false);
  const [messages, setMessages]           = useState([]);
  const [input, setInput]                 = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  /* Session UUID — one per browser, persisted to localStorage */
  useEffect(() => {
    let id = localStorage.getItem('satyajit_twin_session');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('satyajit_twin_session', id);
    }
    setSessionId(id);
  }, []);

  /* Open when "Initiate Investigation" CTA is clicked anywhere on the page */
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('open-action-agent', handler);
    return () => window.removeEventListener('open-action-agent', handler);
  }, []);

  /* Auto-scroll on every new message or transmitting change */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTransmitting]);

  /* Focus input when window opens */
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 400);
  }, [isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !sessionId || isTransmitting) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsTransmitting(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, session_id: sessionId }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          role: 'agent',
          text: data.answer,
          sources: data.sources || [],
          chunks: data.chunks_used ?? 0,
        },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'agent',
          text: `TRANSMISSION FAILED \u2014 ${err.message ?? 'Connection to secure channel interrupted.'}`,
          sources: [],
          chunks: 0,
          error: true,
        },
      ]);
    } finally {
      setIsTransmitting(false);
    }
  };

  const closeWindow = () => { setIsOpen(false); setIsExpanded(false); };

  /* Dynamic window geometry */
  const windowStyle = isExpanded
    ? { position: 'fixed', top: 0, right: 0, width: 400, height: '100vh', bottom: 'auto' }
    : { position: 'fixed', bottom: 96, right: 24, width: 384, height: 500, top: 'auto' };

  return (
    <>
      {/* ── Toggle button — radar transmitter ── */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50 }}>
        <button
          onClick={() => setIsOpen(v => !v)}
          title={isOpen ? 'Close Comms' : 'Open Secure Comms'}
          style={{
            width: 52, height: 52,
            backgroundColor: isOpen ? '#8B1A1A' : '#B22222',
            border: '1px solid rgba(178,34,34,0.55)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', position: 'relative',
            boxShadow: '0 0 24px rgba(178,34,34,0.45), 0 0 60px rgba(178,34,34,0.15)',
            transition: 'background-color 0.25s ease, box-shadow 0.25s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 32px rgba(178,34,34,0.7), 0 0 80px rgba(178,34,34,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 24px rgba(178,34,34,0.45), 0 0 60px rgba(178,34,34,0.15)'; }}
        >
          {/* Radar pulse ring — only when closed */}
          {!isOpen && (
            <span
              className="animate-ping"
              style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%',
                backgroundColor: '#B22222',
                opacity: 0.25,
              }}
            />
          )}
          {/* Icon */}
          <svg
            width="22" height="22" viewBox="0 0 24 24"
            fill="none" stroke="rgba(244,236,216,0.9)" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
          >
            {isOpen ? (
              /* X — close */
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              /* Radio tower — transmit */
              <>
                <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                <circle cx="12" cy="12" r="2" />
                <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="action-agent-window"
            layout
            initial={{ opacity: 0, y: 50, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.92 }}
            transition={{ duration: 0.4, ease: EXPO_OUT }}
            style={{
              ...windowStyle,
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#080C14',
              border: '1px solid #1A2030',
              boxShadow: '0 24px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(178,34,34,0.06), inset 0 0 120px rgba(178,34,34,0.015)',
            }}
          >
            {/* ── Header ── */}
            <div
              style={{
                flexShrink: 0,
                padding: '9px 12px',
                borderBottom: '1px solid #1A2030',
                backgroundColor: '#060910',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  className="animate-pulse"
                  style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#B22222', display: 'inline-block', flexShrink: 0 }}
                />
                <span
                  style={{
                    fontFamily: SWISS, fontSize: 8.5,
                    color: 'rgba(214,205,184,0.4)',
                    letterSpacing: '0.32em', textTransform: 'uppercase',
                  }}
                >
                  SECURE COMMS LINK
                </span>
                <span
                  style={{
                    fontFamily: SWISS, fontSize: 7.5,
                    color: 'rgba(178,34,34,0.4)',
                    letterSpacing: '0.2em',
                    marginLeft: 4,
                  }}
                >
                  // DIGITAL TWIN ACTIVE
                </span>
              </div>

              {/* Three control buttons */}
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <HeaderBtn onClick={() => setIsOpen(false)} title="Minimize">&#8722;</HeaderBtn>
                <HeaderBtn onClick={() => setIsExpanded(v => !v)} title={isExpanded ? 'Contract' : 'Expand'}>
                  {isExpanded ? '\u229f' : '\u229e'}
                </HeaderBtn>
                <HeaderBtn onClick={closeWindow} title="Close" red>&#215;</HeaderBtn>
              </div>
            </div>

            {/* ── Scanline texture strip under header ── */}
            <div
              style={{
                height: 2, flexShrink: 0,
                background: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(178,34,34,0.06) 3px, rgba(178,34,34,0.06) 4px)',
              }}
            />

            {/* ── Messages scroll area ── */}
            <div
              style={{
                flex: 1, overflowY: 'auto', overflowX: 'hidden',
                padding: '14px 14px 10px',
                display: 'flex', flexDirection: 'column', gap: 18,
                /* Custom scrollbar */
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(178,34,34,0.2) transparent',
              }}
            >
              {/* Boot sequence — shown until first message */}
              {messages.length === 0 && (
                <div style={{ fontFamily: SWISS, fontSize: 10, lineHeight: 2.1, color: 'rgba(61,122,88,0.65)', letterSpacing: '0.03em' }}>
                  <span style={{ color: 'rgba(178,34,34,0.55)' }}>SYS &gt;</span>
                  {' '}CONN ESTABLISHED &mdash; SESSION {sessionId?.slice(0, 8).toUpperCase() ?? '--------'}
                  <br />
                  <span style={{ color: 'rgba(178,34,34,0.55)' }}>SYS &gt;</span>
                  {' '}DIGITAL TWIN LOADED &mdash; RAG CONTEXT ARMED
                  <br />
                  <span style={{ color: 'rgba(214,205,184,0.18)' }}>
                    // Interrogation channel is live.
                    <br />
                    // Ask about Satyajit&rsquo;s product decisions, architecture, or case files.
                  </span>
                </div>
              )}

              {/* Message list */}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  {msg.role === 'agent' ? (
                    /* Agent reply */
                    <div style={{ maxWidth: '94%' }}>
                      <p
                        style={{
                          fontFamily: SWISS, fontSize: 11,
                          color: msg.error ? 'rgba(178,34,34,0.7)' : 'rgba(61,122,88,0.92)',
                          lineHeight: 1.9, letterSpacing: '0.015em', margin: 0,
                        }}
                      >
                        <span style={{ color: 'rgba(178,34,34,0.65)', marginRight: 7 }}>&gt;</span>
                        {msg.text}
                      </p>

                      {/* Sources + chunk metadata */}
                      {!msg.error && (msg.chunks > 0 || msg.sources?.length > 0) && (
                        <div
                          style={{
                            marginTop: 10,
                            paddingTop: 8,
                            borderTop: '1px solid rgba(255,255,255,0.04)',
                          }}
                        >
                          {msg.chunks > 0 && (
                            <p
                              style={{
                                fontFamily: SWISS, fontSize: 7.5, margin: '0 0 4px',
                                color: 'rgba(214,205,184,0.14)', letterSpacing: '0.28em', textTransform: 'uppercase',
                              }}
                            >
                              // {msg.chunks} CHUNK{msg.chunks !== 1 ? 'S' : ''} REFERENCED
                            </p>
                          )}
                          {msg.sources?.map((src, si) => (
                            <p
                              key={si}
                              style={{
                                fontFamily: SWISS, fontSize: 7.5, margin: '2px 0 0',
                                color: 'rgba(178,34,34,0.28)', letterSpacing: '0.12em',
                              }}
                            >
                              SRC_{String(si + 1).padStart(2, '0')}: {src}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* User message */
                    <p
                      style={{
                        fontFamily: SWISS, fontSize: 11,
                        color: 'rgba(214,205,184,0.5)',
                        lineHeight: 1.75, letterSpacing: '0.02em',
                        margin: 0, textAlign: 'right', maxWidth: '90%',
                      }}
                    >
                      <span style={{ color: 'rgba(214,205,184,0.2)', marginRight: 6 }}>USR:</span>
                      {msg.text}
                    </p>
                  )}
                </div>
              ))}

              {/* Transmitting indicator */}
              {isTransmitting && (
                <div
                  style={{
                    fontFamily: SWISS, fontSize: 11,
                    color: 'rgba(61,122,88,0.55)',
                    letterSpacing: '0.04em', lineHeight: 1.8,
                  }}
                >
                  <span style={{ color: 'rgba(178,34,34,0.65)', marginRight: 7 }}>&gt;</span>
                  DECRYPTING TRANSMISSION...{' '}
                  <BlinkingCursor />
                </div>
              )}

              {/* Auto-scroll anchor */}
              <div ref={bottomRef} style={{ height: 1 }} />
            </div>

            {/* ── Input form ── */}
            <form
              onSubmit={sendMessage}
              style={{
                flexShrink: 0,
                borderTop: '1px solid #1A2030',
                padding: '10px 12px',
                display: 'flex', gap: 8, alignItems: 'center',
                backgroundColor: '#060910',
              }}
            >
              <span
                style={{
                  fontFamily: SWISS, fontSize: 11,
                  color: 'rgba(178,34,34,0.55)', flexShrink: 0,
                }}
              >
                &gt;_
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="STATE YOUR QUERY..."
                disabled={isTransmitting || !sessionId}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontFamily: SWISS,
                  fontSize: 10.5,
                  color: 'rgba(214,205,184,0.82)',
                  letterSpacing: '0.04em',
                  caretColor: '#B22222',
                }}
              />
              <button
                type="submit"
                disabled={isTransmitting || !input.trim() || !sessionId}
                style={{
                  flexShrink: 0,
                  fontFamily: SWISS,
                  fontSize: 7.5,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: (isTransmitting || !input.trim())
                    ? 'rgba(178,34,34,0.25)'
                    : 'rgba(178,34,34,0.85)',
                  background: 'transparent',
                  border: '1px solid',
                  borderColor: (isTransmitting || !input.trim())
                    ? 'rgba(178,34,34,0.15)'
                    : 'rgba(178,34,34,0.45)',
                  padding: '4px 10px',
                  cursor: (isTransmitting || !input.trim()) ? 'not-allowed' : 'pointer',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
              >
                SEND
              </button>
            </form>

            {/* Session footer */}
            <div
              style={{
                flexShrink: 0,
                padding: '4px 12px 5px',
                backgroundColor: '#060910',
                borderTop: '1px solid rgba(255,255,255,0.025)',
              }}
            >
              <span
                style={{
                  fontFamily: SWISS, fontSize: 6.5,
                  color: 'rgba(214,205,184,0.07)',
                  letterSpacing: '0.28em', textTransform: 'uppercase',
                }}
              >
                SESSION &mdash; {sessionId ?? 'INITIALISING...'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ActionAgent;
