import React, { useRef, useEffect } from 'react';

/**
 * WispsBackground — dense dust-mote field rendered behind all content.
 *
 * High particle density (~1800 desktop) on a strong curl-noise flow field
 * produces the organic tendril/cluster aesthetic from the reference. Initial
 * positions use density-weighted rejection sampling so wisps form natural
 * clouds with empty gaps rather than uniform speckle.
 *
 * Cursor brightens nearby particles within a soft falloff. Pointer-events:none
 * on canvas so cursor still hits content beneath.
 *
 * Honors prefers-reduced-motion. Pauses when tab is hidden.
 */
const WispsBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let raf = null;
    let running = true;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = window.innerWidth;
    let H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setSize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    setSize();

    // Mouse tracking — off-screen until first move
    const mouse = { x: -9999, y: -9999, active: false };
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; mouse.active = false; };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });

    const CURSOR_RADIUS = 240;
    const CURSOR_BOOST = 3.2;

    const COUNT = W < 768 ? 900 : 1800;
    const particles = [];

    // Low-freq density field — creates organic cloud regions
    const densityAt = (x, y) => {
      const fx = x * 0.0045;
      const fy = y * 0.0045;
      const a = Math.sin(fx + 0.7) * Math.cos(fy - 0.3);
      const b = Math.sin(fx * 2.1 + 1.2) * Math.cos(fy * 1.9 + 0.4) * 0.5;
      return Math.max(0, (a + b) * 0.5 + 0.5);
    };

    const spawn = (p, initialAge = false) => {
      // Density-weighted rejection sampling for clustered positions
      let placed = false;
      for (let attempts = 0; attempts < 8 && !placed; attempts++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        if (Math.random() < densityAt(x, y) * 0.85 + 0.15) {
          p.x = x;
          p.y = y;
          placed = true;
        }
      }
      if (!placed) {
        p.x = Math.random() * W;
        p.y = Math.random() * H;
      }
      p.vx = (Math.random() - 0.5) * 0.16;
      p.vy = (Math.random() - 0.5) * 0.16;
      p.r = 0.3 + Math.random() * 0.9;
      p.maxAge = 400 + Math.random() * 720;
      p.age = initialAge ? Math.random() * p.maxAge : 0;
      p.maxAlpha = 0.06 + Math.random() * 0.13;
    };

    for (let i = 0; i < COUNT; i++) {
      const p = {};
      spawn(p, true);
      particles.push(p);
    }

    let t = 0;
    const TWO_PI = Math.PI * 2;

    const frame = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      t += 0.0024;

      const mx = mouse.x;
      const my = mouse.y;
      const cr2 = CURSOR_RADIUS * CURSOR_RADIUS;

      for (const p of particles) {
        // Curl-noise drift — larger flow features for tendril coherence
        const angle =
          Math.sin(p.x * 0.0018 + t * 1.1) * Math.cos(p.y * 0.0018 - t * 0.8) * Math.PI;
        p.vx += Math.cos(angle) * 0.006;
        p.vy += Math.sin(angle) * 0.006;
        p.vx *= 0.992; // less damping → longer coherent streams
        p.vy *= 0.992;
        p.x += p.vx;
        p.y += p.vy;
        p.age++;

        if (p.x < -4) p.x = W + 4;
        if (p.x > W + 4) p.x = -4;
        if (p.y < -4) p.y = H + 4;
        if (p.y > H + 4) p.y = -4;

        const life = p.age / p.maxAge;
        let alpha;
        if (life < 0.18) alpha = (life / 0.18) * p.maxAlpha;
        else if (life > 0.82) alpha = ((1 - life) / 0.18) * p.maxAlpha;
        else alpha = p.maxAlpha;
        if (alpha < 0) alpha = 0;

        if (mouse.active) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const distSq = dx * dx + dy * dy;
          if (distSq < cr2) {
            const t01 = 1 - Math.sqrt(distSq) / CURSOR_RADIUS;
            alpha = Math.min(0.85, alpha * (1 + CURSOR_BOOST * t01 * t01));
          }
        }

        ctx.fillStyle = `rgba(225, 232, 245, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, TWO_PI);
        ctx.fill();

        if (p.age >= p.maxAge) spawn(p);
      }

      if (!reducedMotion) raf = requestAnimationFrame(frame);
    };

    frame();

    const onResize = () => setSize();
    window.addEventListener('resize', onResize);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        if (raf) cancelAnimationFrame(raf);
      } else if (!reducedMotion) {
        running = true;
        frame();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        mixBlendMode: 'screen',
      }}
    />
  );
};

export default WispsBackground;
