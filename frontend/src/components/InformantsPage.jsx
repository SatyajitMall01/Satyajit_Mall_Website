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
   MOBILE INFORMANTS — stacked portrait + quote + swipeable filters
   ═══════════════════════════════════════════ */
const MobileInformantsView = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [activeIndex, setActiveIndex]   = useState(0);
  const [userPaused, setUserPaused]     = useState(false);
  const pauseTimeout = useRef(null);

  // Tuning controls
  const isTuneMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('tune') === '1';
  const readTune = (key, fallback) => {
    if (typeof window === 'undefined') return fallback;
    const v = localStorage.getItem(`informants_tune_${key}`);
    return v ? Number(v) : fallback;
  };
  const [tune, setTune] = useState({
    portraitHeightVh: readTune('portraitHeightVh', 48),
    paddingX: readTune('paddingX', 20),
    textScale: readTune('textScale', 100),
    thumbSize: readTune('thumbSize', 52),
    cardGap: readTune('cardGap', 20),
  });
  const updateTune = (key, value) => {
    setTune(prev => ({ ...prev, [key]: value }));
    if (typeof window !== 'undefined') localStorage.setItem(`informants_tune_${key}`, String(value));
  };

  const filteredData = INFORMANTS_DATA.filter(item => item.tags.includes(activeFilter));
  const active = filteredData[activeIndex] || filteredData[0];

  useEffect(() => { setActiveIndex(0); }, [activeFilter]);

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

  useEffect(() => () => clearTimeout(pauseTimeout.current), []);

  // Flat filter list for horizontal swipe (ALL + all chips with count > 0)
  const filterChips = [
    { label: 'ALL', value: 'ALL' },
    ...JURISDICTIONS.filter(tag => INFORMANTS_DATA.some(i => i.tags.includes(tag))).map(v => ({ label: v, value: v })),
    ...OPERATIONS.filter(tag => INFORMANTS_DATA.some(i => i.tags.includes(tag))).map(v => ({ label: v, value: v })),
  ];

  return (
    <div style={{ background: '#111318', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* ── Subtle ambient ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 600px 400px at 50% 20%, rgba(178,34,34,0.04) 0%, transparent 100%)',
      }} />

      {/* ═══ HEADER ═══ */}
      <div style={{ position: 'relative', zIndex: 2, padding: `48px ${tune.paddingX}px 16px`, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 20, height: 1, background: 'rgba(220,38,38,0.5)' }} />
          <span style={{
            fontFamily: TELE, fontSize: 9, fontWeight: 600,
            color: 'rgba(220,38,38,0.8)', letterSpacing: '0.35em', textTransform: 'uppercase',
          }}>
            Peer Telemetry
          </span>
          <div style={{ width: 20, height: 1, background: 'rgba(220,38,38,0.5)' }} />
        </div>
        <h1 style={{
          fontFamily: SWISS, fontSize: `${28 * tune.textScale / 100}px`, fontWeight: 700,
          color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0,
        }}>
          The Informants
        </h1>
        <p style={{
          fontFamily: TELE, fontSize: 10, color: '#9CA3AF',
          letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 10,
        }}>
          Verified endorsements &middot; filter by jurisdiction
        </p>
      </div>

      {/* ═══ FILTER STRIP — horizontal swipe ═══ */}
      <div
        className="hide-scrollbar"
        style={{
          position: 'relative', zIndex: 2,
          display: 'flex', gap: 8,
          overflowX: 'auto',
          padding: `14px ${tune.paddingX}px 8px`,
          scrollSnapType: 'x proximity',
        }}
      >
        {filterChips.map(chip => {
          const isActive = activeFilter === chip.value;
          return (
            <button
              key={chip.value}
              onClick={() => handleFilterChange(chip.value)}
              style={{
                flexShrink: 0,
                height: 36,
                padding: '0 16px',
                fontFamily: TELE, fontSize: 10, fontWeight: isActive ? 700 : 500,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: isActive ? '#FFFFFF' : '#D1D5DB',
                background: isActive ? 'rgba(220,38,38,0.15)' : 'rgba(55,65,81,0.2)',
                border: isActive ? '1px solid rgba(220,38,38,0.6)' : '1px solid rgba(75,85,99,0.3)',
                borderRadius: 9999,
                cursor: 'pointer',
                transition: 'background 0.2s ease, border-color 0.2s ease',
                scrollSnapAlign: 'start',
              }}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* ═══ HERO PORTRAIT ═══ */}
      <div style={{ position: 'relative', zIndex: 2, padding: `${tune.cardGap}px ${tune.paddingX}px 0` }}>
        <div style={{
          width: '100%', height: `${tune.portraitHeightVh}vh`,
          borderRadius: 14, overflow: 'hidden', position: 'relative',
          border: '1px solid rgba(55,65,81,0.4)',
          background: '#111318',
        }}>
          <AnimatePresence mode="wait">
            {active && (
              <motion.img
                key={active.id}
                src={active.image}
                alt={active.realName}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EXPO_OUT }}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  objectPosition: '50% 22%',
                }}
              />
            )}
          </AnimatePresence>

          {/* Scanline */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.03) 3px,rgba(0,0,0,0.03) 4px)',
          }} />

          {/* Bottom identity overlay */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 55%, transparent 100%)',
            padding: '60px 20px 20px',
          }}>
            <AnimatePresence mode="wait">
              {active && (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: EXPO_OUT }}
                >
                  <p style={{
                    fontFamily: SWISS, fontSize: 10, fontWeight: 700,
                    color: '#EF4444', letterSpacing: '0.22em',
                    textTransform: 'uppercase', margin: '0 0 5px',
                  }}>
                    {active.codename}
                  </p>
                  <p style={{
                    fontFamily: SWISS, fontSize: 18, fontWeight: 600,
                    color: '#FFFFFF', margin: '0 0 3px',
                  }}>
                    {active.realName}
                  </p>
                  <p style={{
                    fontFamily: TELE, fontSize: 9,
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
          <div style={{ position: 'absolute', top: 12, left: 12, width: 14, height: 14, borderTop: '1px solid rgba(220,38,38,0.4)', borderLeft: '1px solid rgba(220,38,38,0.4)' }} />
          <div style={{ position: 'absolute', top: 12, right: 12, width: 14, height: 14, borderTop: '1px solid rgba(220,38,38,0.4)', borderRight: '1px solid rgba(220,38,38,0.4)' }} />
        </div>
      </div>

      {/* ═══ THUMBNAIL SWIPE STRIP ═══ */}
      <div
        className="hide-scrollbar"
        style={{
          position: 'relative', zIndex: 2,
          display: 'flex', gap: 12, alignItems: 'center',
          overflowX: 'auto',
          padding: `${tune.cardGap}px ${tune.paddingX}px 4px`,
          scrollSnapType: 'x proximity',
        }}
      >
        {filteredData.map((inf, i) => {
          const isCurrent = i === activeIndex;
          const size = isCurrent ? tune.thumbSize + 8 : tune.thumbSize;
          return (
            <button
              key={inf.id}
              onClick={() => handleUserSelect(i)}
              className="case-card-tap"
              style={{
                width: size, height: size, flexShrink: 0,
                minHeight: 44, minWidth: 44,
                borderRadius: 9999, overflow: 'hidden',
                border: isCurrent ? '2px solid #dc2626' : '2px solid rgba(55,65,81,0.35)',
                padding: 0, background: 'transparent', cursor: 'pointer',
                boxShadow: isCurrent ? '0 0 16px rgba(220,38,38,0.25)' : 'none',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                scrollSnapAlign: 'center',
              }}
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
      <div style={{
        position: 'relative', zIndex: 2,
        padding: `12px ${tune.paddingX}px 0`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ flex: 1, height: 2, background: 'rgba(55,65,81,0.3)', borderRadius: 1, overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', background: '#dc2626' }}
            animate={{ width: `${((activeIndex + 1) / filteredData.length) * 100}%` }}
            transition={{ duration: 0.35, ease: EXPO_OUT }}
          />
        </div>
        <span style={{ fontFamily: TELE, fontSize: 9, color: '#9CA3AF', letterSpacing: '0.25em' }}>
          {String(activeIndex + 1).padStart(2, '0')}/{String(filteredData.length).padStart(2, '0')}
        </span>
      </div>

      {/* ═══ QUOTE CARD ═══ */}
      <div style={{ position: 'relative', zIndex: 2, padding: `${tune.cardGap}px ${tune.paddingX}px 0` }}>
        <div style={{
          position: 'relative',
          background: 'rgba(15,15,15,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(55,65,81,0.5)',
          borderRadius: 14,
          padding: '28px 22px 24px',
          overflow: 'hidden',
        }}>
          {/* Watermark quote */}
          <div style={{
            position: 'absolute', top: -18, right: -10,
            fontFamily: 'Georgia, serif', fontSize: 160,
            color: 'rgba(255,255,255,0.03)', lineHeight: 0.8,
            pointerEvents: 'none', userSelect: 'none',
          }}>
            &ldquo;
          </div>

          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EXPO_OUT }}
                style={{ position: 'relative', zIndex: 1 }}
              >
                {/* Classification */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                  <XHair size={9} color="rgba(220,38,38,0.6)" />
                  <span style={{
                    fontFamily: TELE, fontSize: 8,
                    color: 'rgba(239,68,68,0.9)', letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                  }}>
                    S/N {active.id} &middot; {active.division}
                  </span>
                </div>

                {/* Quote */}
                <p style={{
                  fontFamily: SWISS, fontSize: `${16 * tune.textScale / 100}px`,
                  fontWeight: 300, color: '#F3F4F6',
                  lineHeight: 1.65, margin: '0 0 22px',
                }}>
                  &ldquo;{active.quote}&rdquo;
                </p>

                {/* Separator */}
                <div style={{ width: 32, height: 1, background: 'rgba(220,38,38,0.4)', marginBottom: 14 }} />

                {/* Identity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 9999, overflow: 'hidden',
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
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{
                      fontFamily: SWISS, fontSize: 15, fontWeight: 700,
                      color: '#FFFFFF', margin: 0, letterSpacing: '0.02em',
                    }}>
                      {active.realName}
                    </p>
                    <p style={{
                      fontFamily: TELE, fontSize: 10,
                      color: '#dc2626', margin: '3px 0 0',
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {active.role} &middot; {active.division}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Auto-rotation progress */}
          {!userPaused && filteredData.length > 1 && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
              background: 'rgba(55,65,81,0.2)',
            }}>
              <motion.div
                key={`timer-${active?.id}`}
                style={{ height: '100%', background: 'rgba(220,38,38,0.5)', transformOrigin: 'left' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 6, ease: 'linear' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ═══ BOTTOM CTA ═══ */}
      <div style={{ position: 'relative', zIndex: 2, padding: `${tune.cardGap + 12}px ${tune.paddingX}px 80px`, textAlign: 'center' }}>
        <p style={{
          fontFamily: TELE, fontSize: 9, fontWeight: 600,
          color: '#9CA3AF', letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 14px',
        }}>
          Require this architecture?
        </p>
        <a
          href="mailto:satyajitmall10@gmail.com"
          className="case-card-tap"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontFamily: TELE, fontSize: 11, fontWeight: 600,
            color: '#dc2626', letterSpacing: '0.18em', textTransform: 'uppercase',
            height: 48, padding: '0 28px',
            border: '1px solid rgba(220,38,38,0.4)', borderRadius: 6,
            background: 'rgba(220,38,38,0.08)', textDecoration: 'none',
            width: '100%', maxWidth: 320,
          }}
        >
          <XHair size={10} color="#dc2626" />
          Initiate Contact
        </a>
        <p style={{
          fontFamily: TELE, fontSize: 8,
          color: '#6B7280', letterSpacing: '0.35em',
          textTransform: 'uppercase', marginTop: 24,
        }}>
          End of verified records
        </p>
      </div>

      {/* ═══ TUNING PANEL ═══ */}
      {isTuneMode && <InformantsTuningPanel tune={tune} onChange={updateTune} />}
    </div>
  );
};

/* ═══════════════════════════════════════════
   TUNING PANEL — informants mobile sliders
   ═══════════════════════════════════════════ */
const InformantsTuningPanel = ({ tune, onChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const sliders = [
    { key: 'portraitHeightVh', label: 'Portrait Height', min: 35, max: 70, step: 1, unit: 'vh' },
    { key: 'paddingX', label: 'Horizontal Padding', min: 8, max: 40, step: 2, unit: 'px' },
    { key: 'textScale', label: 'Text Scale', min: 80, max: 140, step: 2, unit: '%' },
    { key: 'thumbSize', label: 'Thumb Size', min: 40, max: 80, step: 2, unit: 'px' },
    { key: 'cardGap', label: 'Card Gap', min: 8, max: 48, step: 2, unit: 'px' },
  ];
  return (
    <div style={{
      position: 'fixed', bottom: 16, left: 16, right: 16,
      zIndex: 9999,
      background: 'rgba(5,5,10,0.96)',
      border: '1px solid rgba(220,38,38,0.45)',
      borderRadius: 12,
      padding: collapsed ? '10px 14px' : '14px 16px 18px',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(220,38,38,0.15)',
      maxWidth: 460, margin: '0 auto',
      fontFamily: TELE, fontSize: 10, color: '#E5E7EB',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: collapsed ? 0 : 12,
      }}>
        <span style={{
          fontFamily: TELE, fontSize: 9, fontWeight: 700,
          color: '#dc2626', letterSpacing: '0.35em', textTransform: 'uppercase',
        }}>
          ▸ Informants Tuning
        </span>
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
            color: '#D1D5DB', fontFamily: TELE, fontSize: 9,
            padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
            letterSpacing: '0.15em',
          }}
        >
          {collapsed ? 'EXPAND' : 'HIDE'}
        </button>
      </div>
      {!collapsed && sliders.map(s => (
        <div key={s.key} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <label style={{ color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 9 }}>
              {s.label}
            </label>
            <span style={{ color: '#dc2626', fontWeight: 600 }}>
              {tune[s.key]}{s.unit}
            </span>
          </div>
          <input
            type="range"
            min={s.min} max={s.max} step={s.step}
            value={tune[s.key]}
            onChange={e => onChange(s.key, Number(e.target.value))}
            style={{ width: '100%', accentColor: '#dc2626' }}
          />
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════
   INFORMANTS PAGE — Viewport-branched (mobile/desktop)
   ═══════════════════════════════════════════ */
const InformantsPage = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  if (isMobile) return <MobileInformantsView />;
  return <DesktopInformantsView />;
};

const DesktopInformantsView = () => {
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
