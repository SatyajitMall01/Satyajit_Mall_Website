import React, { useRef, useEffect } from 'react';

/**
 * WispsBackground — ambient dust-mote field rendered behind all content.
 *
 * Pattern: dense small particles (not bright halos) drifting on a flow field,
 * matching the organic dust/smoke reference. Cursor brightens nearby particles
 * within a soft falloff radius.
 *
 * Honors prefers-reduced-motion: paints one static frame, no RAF loop.
 * Pauses when tab hidden to save battery.
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

    // Mouse tracking — off-screen until first move so initial render has no hotspot
    const mouse = { x: -9999, y: -9999, active: false };
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.active = false;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });

    // Cursor-reactive halo
    const CURSOR_RADIUS = 220;
    const CURSOR_BOOST = 2.2; // up to ~3x base alpha at cursor center

    const COUNT = W < 768 ? 180 : 350;
    const particles = [];

    const spawn = (p, initialAge = false) => {
      p.x = Math.random() * W;
      p.y = Math.random() * H;
      p.vx = (Math.random() - 0.5) * 0.18;
      p.vy = (Math.random() - 0.5) * 0.18 - 0.04;
      p.r = 0.4 + Math.random() * 1.2; // 0.4–1.6 px — minute dust motes
      p.maxAge = 360 + Math.random() * 640;
      p.age = initialAge ? Math.random() * p.maxAge : 0;
      p.maxAlpha = 0.04 + Math.random() * 0.10; // very subtle baseline
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
      t += 0.0022;

      for (const p of particles) {
        // Flow field — cheap sin/cos drives coherent organic drift
        const angle =
          Math.sin(p.x * 0.0026 + t) * Math.cos(p.y * 0.0026 - t) * Math.PI;
        p.vx += Math.cos(angle) * 0.003;
        p.vy += Math.sin(angle) * 0.003;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.age++;

        // Wrap edges
        if (p.x < -4) p.x = W + 4;
        if (p.x > W + 4) p.x = -4;
        if (p.y < -4) p.y = H + 4;
        if (p.y > H + 4) p.y = -4;

        // Lifecycle fade in/out
        const life = p.age / p.maxAge;
        let alpha;
        if (life < 0.18) alpha = (life / 0.18) * p.maxAlpha;
        else if (life > 0.82) alpha = ((1 - life) / 0.18) * p.maxAlpha;
        else alpha = p.maxAlpha;
        if (alpha < 0) alpha = 0;

        // Cursor reactivity — radial falloff boost
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const cr2 = CURSOR_RADIUS * CURSOR_RADIUS;
          if (distSq < cr2) {
            const dist = Math.sqrt(distSq);
            const t01 = 1 - dist / CURSOR_RADIUS; // 1 at center, 0 at edge
            alpha = Math.min(0.85, alpha * (1 + CURSOR_BOOST * t01 * t01));
          }
        }

        // Cool off-white dust mote — small filled arc, no expensive halo
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
