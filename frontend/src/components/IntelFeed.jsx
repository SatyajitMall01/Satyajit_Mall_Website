import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const TELE = "'Courier New', Courier, monospace";

const LINKEDIN_POSTS = [
  { id: 'post1', embedId: 'urn:li:share:7456259425004195840', iframeHeight: 200 },
  { id: 'post2', embedId: 'urn:li:share:7455896880158359552', iframeHeight: 200 },
  { id: 'post3', embedId: 'urn:li:share:7455534626384564224', iframeHeight: 200 },
  { id: 'post4', embedId: 'urn:li:share:7455333103973085184', iframeHeight: 200 },
  { id: 'post5', embedId: 'urn:li:share:7454975642607042562', iframeHeight: 200 },
];

const LinkedInBadge = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#0077B5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
    <span style={{ fontFamily: TELE, fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
      LINKEDIN
    </span>
  </div>
);

/* Wallet-peel transforms.
   N = total+1 segments: first segment is intro (cards static, no animation).
   Card i active during [(i+1)/N, (i+2)/N]. Intro phase [(0, 1/N)] keeps all cards still. */
const IntelCard = ({ post, index, scrollYProgress, total }) => {
  const N = total + 1;   // one extra intro segment
  const isLast = index === total - 1;
  const numPts = index + 3; // keypoints: 0, 1/N … (index+2)/N

  // Y: intro phase holds still, then each card-exit shifts depth, then active at 0, exits at -800
  const yInputs  = Array.from({ length: numPts }, (_, k) => k === 0 ? 0 : k / N);
  const yOutputs = Array.from({ length: numPts }, (_, k) => {
    if (k === 0)           return Math.min(index, 2) * 40;          // initial stack depth
    if (k <= index)        return Math.min(index - k + 1, 2) * 40;  // each card above exits
    if (k === index + 1)   return 0;                                  // active: front
    return isLast ? 0 : -800;                                         // exit UP
  });

  // Scale: 0.85 in stack → 1 when becoming active
  const scaleInputs  = index === 0 ? [0, 1] : [index / N, (index + 1) / N];
  const scaleOutputs = index === 0 ? [1, 1] : [0.85, 1];

  // Opacity: fade on exit (last card stays)
  const start = (index + 1) / N;
  const end   = (index + 2) / N;
  const opacityInputs  = isLast ? [0, 1] : [0, start, start + (end - start) * 0.82, end];
  const opacityOutputs = isLast ? [1, 1] : [1, 1, 1, 0];

  const y       = useTransform(scrollYProgress, yInputs,       yOutputs);
  const scale   = useTransform(scrollYProgress, scaleInputs,   scaleOutputs);
  const opacity = useTransform(scrollYProgress, opacityInputs, opacityOutputs);

  const embedUrl = `https://www.linkedin.com/embed/feed/update/${post.embedId}?collapsed=1`;

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        translateX: '-50%',
        width: 'min(760px, 92vw)',
        y,
        scale,
        opacity,
        zIndex: total - index,
        transformOrigin: 'top center',
        willChange: 'transform, opacity',
      }}
    >
      <div
        style={{
          background: '#0A0A0A',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03) inset',
          position: 'relative',
        }}
      >
        {/* Card header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span
            style={{
              fontFamily: TELE,
              fontSize: '9px',
              letterSpacing: '0.3em',
              color: 'rgba(220,38,38,0.7)',
              textTransform: 'uppercase',
            }}
          >
            DISPATCH {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <LinkedInBadge />
        </div>

        {/* LinkedIn iframe */}
        <div style={{ lineHeight: 0 }}>
          <iframe
            src={embedUrl}
            height={post.iframeHeight}
            width="100%"
            frameBorder="0"
            allowFullScreen
            title={`LinkedIn post ${index + 1}`}
            style={{ display: 'block', border: 'none' }}
          />
        </div>

        {/* Card footer */}
        <div
          style={{
            padding: '10px 18px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '1px',
              background: 'rgba(220,38,38,0.5)',
            }}
          />
          <a
            href={`https://www.linkedin.com/feed/update/${post.embedId}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: TELE,
              fontSize: '8px',
              letterSpacing: '0.25em',
              color: 'rgba(220,38,38,0.6)',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(220,38,38,0.6)'; }}
          >
            OPEN FULL POST →
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const IntelFeed = () => {
  const sectionRef = useRef(null);
  const total = LINKEDIN_POSTS.length;

  /* Section IS the scroll track — no dead zone before first card */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#141A21',
        position: 'relative',
        height: `${(total + 1) * 80}vh`,
      }}
    >
      {/* Ambient bridge — blends transition from previous section */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '256px',
          background: 'linear-gradient(to bottom, rgba(127,29,29,0.10), transparent)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Sticky stage — header + cards locked together, zero dead zone */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: '7vh',
          overflow: 'hidden',
          gap: '28px',
        }}
      >
        {/* Header inside sticky */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 50, marginBottom: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '24px', height: '1px', background: '#dc2626' }} />
            <span style={{ fontFamily: TELE, fontSize: '9px', letterSpacing: '0.35em', color: 'rgba(220,38,38,0.8)', textTransform: 'uppercase' }}>
              OPEN-SOURCE INTELLIGENCE
            </span>
            <div style={{ width: '24px', height: '1px', background: '#dc2626' }} />
          </div>
          <h2 style={{ fontFamily: SWISS, fontSize: 'clamp(20px, 2.5vw, 34px)', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Intel Feed
          </h2>
          <p style={{ fontFamily: TELE, fontSize: '8px', letterSpacing: '0.2em', color: 'rgba(156,163,175,0.35)', textTransform: 'uppercase' }}>
            SCROLL TO ADVANCE
          </p>
        </div>

        {/* Card stack */}
        <div style={{ position: 'relative', width: 'min(760px, 92vw)', height: '420px' }}>
          {LINKEDIN_POSTS.map((post, i) => (
            <IntelCard
              key={post.id}
              post={post}
              index={i}
              scrollYProgress={scrollYProgress}
              total={total}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntelFeed;
