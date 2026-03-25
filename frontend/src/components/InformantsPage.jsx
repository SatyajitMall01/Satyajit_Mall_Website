import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const TELE  = "'Courier New', Courier, monospace";
const EXPO_OUT = [0.16, 1, 0.3, 1];

/* ── Verified informant database ── */
const INFORMANTS_DATA = [
  {
    id: '01', codename: 'THE ARCHITECT', realName: 'Shivam Chopra',
    role: 'Chief Technology Officer', division: 'MILES EDUCATION',
    image: '/informants/shivam.png', tags: ['ALL', 'MILES EDU', 'AI PIPELINE'],
    quote: "Satyajit bridges the hardest gap in tech: translating business needs into deterministic engineering architecture. When we scaled the Miles One app and the AI pipelines, he didn\u2019t just write specs; he ensured our database structures and n8n workflows actually worked in production.",
  },
  {
    id: '02', codename: 'THE STRATEGIST', realName: 'Sharanya Mukhopadhyay',
    role: 'AVP Digital Marketing', division: 'MILES EDUCATION',
    image: '/informants/sharanya.png', tags: ['ALL', 'MILES EDU', 'MARTECH'],
    quote: "He is that rare PM who actually understands Go-To-Market. Satyajit built the underlying CDP and MarTech infrastructure that allowed my team to scale our webinar deployments and drive a massive +20% lift in ROAS. He directly connects product to revenue.",
  },
  {
    id: '03', codename: 'THE VETERAN', realName: 'Karan Mandalam',
    role: 'Senior Product Manager', division: 'UPGRAD | ALMABETTER',
    image: '/informants/karan.png', tags: ['ALL', 'UPGRAD', 'ALMABETTER', 'CRM'],
    quote: "Having worked alongside him across three different high-growth companies, I can say his ability to drop into a chaotic environment and build 0-to-1 systems is unmatched. Whether it\u2019s enterprise CRM routing or PLG loops, he builds machines that compound in value.",
  },
  {
    id: '04', codename: 'THE CO-PILOT', realName: 'Shamantha K',
    role: 'AVP Product', division: 'MILES EDUCATION',
    image: '/informants/shamantha.png', tags: ['ALL', 'MILES EDU', 'AI PIPELINE'],
    quote: "Leading the core product verticals alongside Satyajit has been incredible. He doesn\u2019t just manage product; he engineers the entire underlying ecosystem. From unifying our CRM and LMS platforms to integrating complex AI automation, he builds the scalable systems that power our core user journeys.",
  },
  {
    id: '05', codename: 'THE OPERATOR', realName: 'Shalini Basu',
    role: 'Product Lead', division: 'GROWTH & VENTURE',
    image: '/informants/shalini.png', tags: ['ALL', 'ALMABETTER', 'OPS'],
    quote: "A master of tactical execution. He has an incredible ability to identify operational debt and eliminate it. He doesn\u2019t just launch features; he drops into engineering workflows, re-engineers sprint cycles, and transforms ticketing systems to make the whole company move faster.",
  },
  {
    id: '06', codename: 'THE GROWTH ENGINE', realName: 'Varun Pratap Singh',
    role: 'Head of Growth', division: 'IMARTICUS | SCALER',
    image: '/informants/varun.png', tags: ['ALL', 'SCALER', 'PLG'],
    quote: "Having scaled some of the largest ed-tech funnels in the country, I know the difference between a vanity feature and a core growth engine. Satyajit builds the latter. He understands that real product-led growth requires airtight data pipelines, AI automation, and deterministic technical architecture.",
  },
];

/* ── Dual-tier filter categories ── */
const JURISDICTIONS = ['MILES EDU', 'ALMABETTER', 'UPGRAD', 'SCALER', 'IMARTICUS'];
const OPERATIONS    = ['AI PIPELINE', 'CRM', 'MARTECH', 'OPS', 'PLG', '0-1 LAUNCH'];

/* ── Registration crosshair ── */
const XHair = ({ size = 14, color = 'currentColor' }) => (
  <span style={{ display: 'inline-block', position: 'relative', width: size, height: size, flexShrink: 0 }}>
    <span style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: color, transform: 'translateY(-50%)' }} />
    <span style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: color, transform: 'translateX(-50%)' }} />
  </span>
);

/* ═══════════════════════════════════════════
   INFORMANTS PAGE — Split-Pane Vertical Carousel
   ═══════════════════════════════════════════ */
const InformantsPage = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [activeIndex, setActiveIndex]   = useState(0);
  const [userPaused, setUserPaused]     = useState(false);
  const pauseTimeout = useRef(null);

  const filteredData = INFORMANTS_DATA.filter(item => item.tags.includes(activeFilter));
  const active = filteredData[activeIndex] || filteredData[0];

  /* Reset index when filter changes */
  useEffect(() => {
    setActiveIndex(0);
  }, [activeFilter]);

  /* Auto-rotation: 6s cycle, pauses on user interaction */
  useEffect(() => {
    if (userPaused || filteredData.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % filteredData.length);
    }, 6000);
    return () => clearInterval(id);
  }, [userPaused, filteredData.length]);

  const handleUserSelect = useCallback((index) => {
    setActiveIndex(index);
    setUserPaused(true);
    clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => setUserPaused(false), 15000);
  }, []);

  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
    setUserPaused(true);
    clearTimeout(pauseTimeout.current);
    pauseTimeout.current = setTimeout(() => setUserPaused(false), 15000);
  }, []);

  useEffect(() => {
    return () => clearTimeout(pauseTimeout.current);
  }, []);

  return (
    <div className="min-h-screen bg-[#111318] relative overflow-hidden">

      {/* ── Ambient background noise ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 900px 500px at 70% 30%, rgba(178,34,34,0.03) 0%, transparent 100%)' }}
      />

      {/* ── Page content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">

        {/* ── Header ── */}
        <motion.div
          className="text-center mb-12"
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
              Peer Telemetry
            </span>
            <div style={{ width: 32, height: 1, background: 'rgba(220,38,38,0.5)' }} />
          </div>

          <h1 style={{
            fontFamily: SWISS, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700,
            color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.1,
          }}>
            The Informants
          </h1>

          <p style={{
            fontFamily: TELE, fontSize: 13, color: '#D1D5DB',
            letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 16,
          }}>
            Verified endorsements from the field &mdash; filtered by jurisdiction
          </p>
        </motion.div>

        {/* ── Intel Chip Bar ── */}
        <motion.div
          className="flex items-center justify-center gap-2 flex-wrap mt-4 mb-14"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EXPO_OUT, delay: 0.15 }}
        >
          {/* ALL chip */}
          {(() => {
            const isActive = activeFilter === 'ALL';
            return (
              <button
                onClick={() => handleFilterChange('ALL')}
                style={{
                  fontFamily: TELE, fontSize: 10, fontWeight: 600,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: isActive ? '#FFFFFF' : '#E5E7EB',
                  background: isActive ? 'rgba(220,38,38,0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(220,38,38,0.5)' : '1px solid rgba(75,85,99,0.4)',
                  borderRadius: 9999,
                  padding: '7px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = 'rgba(220,38,38,0.4)'; e.currentTarget.style.color = '#FFFFFF'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = 'rgba(75,85,99,0.4)'; e.currentTarget.style.color = '#E5E7EB'; } }}
              >
                All
              </button>
            );
          })()}

          {/* Divider */}
          <span style={{ color: 'rgba(75,85,99,0.4)', fontSize: 16, margin: '0 4px', userSelect: 'none' }}>|</span>

          {/* Jurisdiction chips */}
          {JURISDICTIONS.map(tag => {
            const isActive = activeFilter === tag;
            const count = INFORMANTS_DATA.filter(i => i.tags.includes(tag)).length;
            if (count === 0) return null;
            return (
              <button
                key={tag}
                onClick={() => handleFilterChange(tag)}
                style={{
                  fontFamily: TELE, fontSize: 9, fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: isActive ? '#FFFFFF' : '#E5E7EB',
                  background: isActive ? 'rgba(220,38,38,0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(220,38,38,0.5)' : '1px solid rgba(75,85,99,0.25)',
                  borderRadius: 9999,
                  padding: '6px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = 'rgba(220,38,38,0.35)'; e.currentTarget.style.color = '#FFFFFF'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = 'rgba(75,85,99,0.25)'; e.currentTarget.style.color = '#E5E7EB'; } }}
              >
                {tag}
              </button>
            );
          })}

          {/* Divider */}
          <span style={{ color: 'rgba(75,85,99,0.4)', fontSize: 16, margin: '0 4px', userSelect: 'none' }}>|</span>

          {/* Operation chips */}
          {OPERATIONS.map(tag => {
            const isActive = activeFilter === tag;
            const count = INFORMANTS_DATA.filter(i => i.tags.includes(tag)).length;
            if (count === 0) return null;
            return (
              <button
                key={tag}
                onClick={() => handleFilterChange(tag)}
                style={{
                  fontFamily: TELE, fontSize: 9, fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: isActive ? '#FFFFFF' : '#D1D5DB',
                  background: isActive ? 'rgba(220,38,38,0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(220,38,38,0.5)' : '1px solid transparent',
                  borderRadius: 9999,
                  padding: '6px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.borderColor = 'rgba(75,85,99,0.3)'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = '#D1D5DB'; e.currentTarget.style.borderColor = 'transparent'; } }}
              >
                {tag}
              </button>
            );
          })}
        </motion.div>

        {/* ── Main Split Pane ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >

          {/* ── Left: Hero Portrait + Circular Nav ── */}
          <div
            className="md:col-span-4"
            onMouseEnter={() => { setUserPaused(true); clearTimeout(pauseTimeout.current); }}
            onMouseLeave={() => { clearTimeout(pauseTimeout.current); pauseTimeout.current = setTimeout(() => setUserPaused(false), 8000); }}
          >
            {/* Large active portrait */}
            <div style={{
              width: '100%', height: 420, borderRadius: 14, overflow: 'hidden',
              position: 'relative',
              border: '1px solid rgba(55,65,81,0.4)',
              background: '#111318',
            }}>
              <AnimatePresence mode="wait">
                {active && (
                  <motion.img
                    key={active.id}
                    src={active.image}
                    alt={active.realName}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: EXPO_OUT }}
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      objectPosition: '50% 20%',
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Scanline overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.03) 3px,rgba(0,0,0,0.03) 4px)',
                }}
              />

              {/* Bottom gradient + identity */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 55%, transparent 100%)',
                padding: '60px 22px 22px',
              }}>
                <AnimatePresence mode="wait">
                  {active && (
                    <motion.div
                      key={active.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.35, ease: EXPO_OUT }}
                    >
                      <p style={{
                        fontFamily: SWISS, fontSize: 11, fontWeight: 700,
                        color: '#EF4444', letterSpacing: '0.18em',
                        textTransform: 'uppercase', margin: '0 0 6px',
                      }}>
                        {active.codename}
                      </p>
                      <p style={{
                        fontFamily: SWISS, fontSize: 18, fontWeight: 600,
                        color: '#FFFFFF', margin: '0 0 4px', letterSpacing: '0.02em',
                      }}>
                        {active.realName}
                      </p>
                      <p style={{
                        fontFamily: TELE, fontSize: 10,
                        color: '#D1D5DB', letterSpacing: '0.15em',
                        textTransform: 'uppercase', margin: 0,
                      }}>
                        {active.role} &middot; {active.division}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Corner brackets */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t border-l pointer-events-none" style={{ borderColor: 'rgba(220,38,38,0.3)' }} />
              <div className="absolute top-3 right-3 w-4 h-4 border-t border-r pointer-events-none" style={{ borderColor: 'rgba(220,38,38,0.3)' }} />
            </div>

            {/* Circular thumbnail navigation */}
            <div style={{
              display: 'flex', gap: 10, marginTop: 18, justifyContent: 'center', alignItems: 'center',
            }}>
              {filteredData.map((inf, i) => {
                const isCurrent = i === activeIndex;
                return (
                  <button
                    key={inf.id}
                    onClick={() => handleUserSelect(i)}
                    style={{
                      width: isCurrent ? 56 : 48, height: isCurrent ? 56 : 48,
                      borderRadius: 9999, overflow: 'hidden', flexShrink: 0,
                      border: isCurrent ? '2px solid #dc2626' : '2px solid rgba(55,65,81,0.35)',
                      cursor: 'pointer',
                      transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                      boxShadow: isCurrent ? '0 0 16px rgba(220,38,38,0.2)' : 'none',
                      padding: 0, background: 'transparent',
                    }}
                    onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.borderColor = 'rgba(220,38,38,0.4)'; }}
                    onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.borderColor = 'rgba(55,65,81,0.35)'; }}
                  >
                    <img
                      src={inf.image}
                      alt={inf.codename}
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        objectPosition: '50% 25%',
                        filter: isCurrent
                          ? 'grayscale(0%) brightness(1) contrast(1.05)'
                          : 'grayscale(100%) brightness(0.55) contrast(1.2)',
                        transition: 'filter 0.4s ease',
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Progress line */}
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(55,65,81,0.3)', borderRadius: 1, overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', background: '#dc2626', borderRadius: 1 }}
                  animate={{ width: `${((activeIndex + 1) / filteredData.length) * 100}%` }}
                  transition={{ duration: 0.4, ease: EXPO_OUT }}
                />
              </div>
              <span style={{ fontFamily: TELE, fontSize: 8, color: '#9CA3AF', letterSpacing: '0.3em' }}>
                {String(activeIndex + 1).padStart(2, '0')}/{String(filteredData.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* ── Right: The Decrypted File (Quote Card) ── */}
          <div className="md:col-span-8">
            <div style={{
              position: 'relative',
              background: 'rgba(15,15,15,0.92)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(55,65,81,0.5)',
              borderRadius: 14,
              padding: 'clamp(32px, 5vw, 64px)',
              minHeight: 420,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>

              {/* Watermark quotation mark */}
              <div style={{
                position: 'absolute', top: -30, right: -20,
                fontFamily: 'Georgia, serif', fontSize: 'clamp(200px, 22vw, 320px)',
                color: 'rgba(255,255,255,0.025)', lineHeight: 0.8,
                pointerEvents: 'none', userSelect: 'none',
              }}>
                &ldquo;
              </div>

              {/* Corner viewfinder brackets */}
              <div className="absolute top-4 left-4 w-5 h-5 border-t border-l pointer-events-none" style={{ borderColor: 'rgba(220,38,38,0.25)' }} />
              <div className="absolute top-4 right-4 w-5 h-5 border-t border-r pointer-events-none" style={{ borderColor: 'rgba(220,38,38,0.25)' }} />
              <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l pointer-events-none" style={{ borderColor: 'rgba(220,38,38,0.25)' }} />
              <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r pointer-events-none" style={{ borderColor: 'rgba(220,38,38,0.25)' }} />

              <AnimatePresence mode="wait">
                {active && (
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45, ease: EXPO_OUT }}
                    style={{ position: 'relative', zIndex: 10 }}
                  >
                    {/* Classification tag */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28,
                    }}>
                      <XHair size={10} color="rgba(220,38,38,0.5)" />
                      <span style={{
                        fontFamily: TELE, fontSize: 8.5,
                        color: 'rgba(239,68,68,0.8)', letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                      }}>
                        S/N {active.id} &middot; {active.division}
                      </span>
                    </div>

                    {/* The Quote */}
                    <p style={{
                      fontFamily: SWISS, fontSize: 'clamp(18px, 2.2vw, 28px)',
                      fontWeight: 300, color: '#F3F4F6',
                      lineHeight: 1.75, letterSpacing: '0.005em',
                      margin: '0 0 36px',
                    }}>
                      &ldquo;{active.quote}&rdquo;
                    </p>

                    {/* Separator */}
                    <div style={{ width: 40, height: 1, background: 'rgba(220,38,38,0.35)', marginBottom: 20 }} />

                    {/* Identity block */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      {/* Portrait */}
                      <div style={{
                        width: 48, height: 48, borderRadius: 9999, overflow: 'hidden',
                        border: '1px solid rgba(55,65,81,0.6)', flexShrink: 0,
                      }}>
                        <img
                          src={active.image}
                          alt={active.realName}
                          style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            objectPosition: '50% 25%',
                            filter: 'grayscale(20%) contrast(1.1)',
                          }}
                        />
                      </div>
                      <div>
                        <p style={{
                          fontFamily: SWISS, fontSize: 18, fontWeight: 700,
                          color: '#FFFFFF', margin: 0,
                          letterSpacing: '0.04em',
                        }}>
                          {active.realName}
                        </p>
                        <p style={{
                          fontFamily: TELE, fontSize: 13,
                          color: '#dc2626', margin: '4px 0 0',
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                        }}>
                          {active.role} &middot; {active.division}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Auto-rotation indicator */}
              {!userPaused && filteredData.length > 1 && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
                  background: 'rgba(55,65,81,0.2)',
                }}>
                  <motion.div
                    key={`timer-${active?.id}`}
                    style={{ height: '100%', background: 'rgba(220,38,38,0.4)', transformOrigin: 'left' }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 6, ease: 'linear' }}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Bottom CTA Terminal ── */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: EXPO_OUT }}
        >
          <div style={{
            display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
            padding: '32px 48px',
            background: 'rgba(5,5,5,0.6)',
            border: '1px solid rgba(55,65,81,0.3)',
            borderRadius: 12,
            backdropFilter: 'blur(12px)',
          }}>
            <p style={{
              fontFamily: TELE, fontSize: 10, fontWeight: 600,
              color: '#D1D5DB', letterSpacing: '0.35em',
              textTransform: 'uppercase', margin: '0 0 18px',
            }}>
              Require This Architecture?
            </p>

            <a
              href="mailto:satyajitmall10@gmail.com"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                fontFamily: TELE, fontSize: 11, fontWeight: 600,
                color: '#dc2626', letterSpacing: '0.2em', textTransform: 'uppercase',
                padding: '12px 28px',
                border: '1px solid rgba(220,38,38,0.35)',
                borderRadius: 6,
                background: 'rgba(220,38,38,0.06)',
                textDecoration: 'none',
                cursor: 'pointer',
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
              Initiate Contact
            </a>
          </div>

          {/* Page classification footer */}
          <p style={{
            fontFamily: TELE, fontSize: 7.5,
            color: '#D1D5DB', letterSpacing: '0.4em',
            textTransform: 'uppercase', marginTop: 32,
          }}>
            End of verified records
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default InformantsPage;
