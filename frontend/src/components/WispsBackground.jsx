import React, { useRef, useEffect } from 'react';

/**
 * WispsBackground — dense uniform dust-mote field with cursor attraction.
 *
 * Every particle is the same size. Density is high enough that the cursor
 * pulls visibly accumulated wisps toward it, and those nearby wisps tint
 * blood-red (#dc2626 — site accent) so the interaction reads at a glance.
 *
 * - Fixed canvas, mix-blend-mode: screen, z-index: -1 (behind all content)
 * - prefers-reduced-motion → static single frame
 * - Pauses on tab hide
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

    // Mouse tracking — off-screen sentinel
    const mouse = { x: -9999, y: -9999, active: false };
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; mouse.active = false; };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });

    // Cursor interaction tuning
    const ATTRACT_RADIUS = 350;        // particles pulled toward cursor within this range
    const ATTRACT_STRENGTH = 0.018;    // per-frame velocity nudge toward cursor
    const REPEL_INNER = 22;            // hard core — no pile-up
    const TINT_RADIUS = 260;           // red-tint + brightness halo
    const TINT_BOOST = 3.4;            // alpha multiplier at cursor center
    const PARTICLE_SIZE = 0.9;         // every dot identical

    // Site red accent
    const RED_R = 220, RED_G = 38, RED_B = 38;
    const BASE_R = 225, BASE_G = 232, BASE_B = 245;

    const COUNT = W < 768 ? 1400 : 2800;
    const particles = [];

    // Low-freq density field for clustered initial spawn
    const densityAt = (x, y) => {
      const fx = x * 0.0042;
      const fy = y * 0.0042;
      const a = Math.sin(fx + 0.7) * Math.cos(fy - 0.3);
      const b = Math.sin(fx * 2.1 + 1.2) * Math.cos(fy * 1.9 + 0.4) * 0.5;
      return Math.max(0, (a + b) * 0.5 + 0.5);
    };

    const placeWeighted = (p) => {
      for (let i = 0; i < 8; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        if (Math.random() < densityAt(x, y) * 0.85 + 0.15) {
          p.x = x; p.y = y; return;
        }
      }
      p.x = Math.random() * W;
      p.y = Math.random() * H;
    };

    const spawn = (p, initialAge = false) => {
      placeWeighted(p);
      p.vx = (Math.random() - 0.5) * 0.14;
      p.vy = (Math.random() - 0.5) * 0.14;
      p.maxAge = 420 + Math.random() * 700;
      p.age = initialAge ? Math.random() * p.maxAge : 0;
      p.maxAlpha = 0.05 + Math.random() * 0.10;
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

      const mx = mouse.x;
      const my = mouse.y;
      const attrR2 = ATTRACT_RADIUS * ATTRACT_RADIUS;
      const tintR2 = TINT_RADIUS * TINT_RADIUS;

      for (const p of particles) {
        // Curl-noise drift
        const angle =
          Math.sin(p.x * 0.0018 + t * 1.1) * Math.cos(p.y * 0.0018 - t * 0.8) * Math.PI;
        p.vx += Math.cos(angle) * 0.005;
        p.vy += Math.sin(angle) * 0.005;

        // Cursor attraction — soft pull toward cursor with inner dead-zone
        let nearCursor = 0; // 0..1 strength of tint/brightness
        if (mouse.active) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < attrR2 && distSq > REPEL_INNER * REPEL_INNER) {
            const dist = Math.sqrt(distSq);
            const pull = ATTRACT_STRENGTH * (1 - dist / ATTRACT_RADIUS);
            p.vx += (dx / dist) * pull;
            p.vy += (dy / dist) * pull;
          }

          if (distSq < tintR2) {
            const t01 = 1 - Math.sqrt(distSq) / TINT_RADIUS;
            nearCursor = t01 * t01;
          }
        }

        p.vx *= 0.991;
        p.vy *= 0.991;
        p.x += p.vx;
        p.y += p.vy;
        p.age++;

        if (p.x < -4) p.x = W + 4;
        if (p.x > W + 4) p.x = -4;
        if (p.y < -4) p.y = H + 4;
        if (p.y > H + 4) p.y = -4;

        // Lifecycle alpha
        const life = p.age / p.maxAge;
        let alpha;
        if (life < 0.18) alpha = (life / 0.18) * p.maxAlpha;
        else if (life > 0.82) alpha = ((1 - life) / 0.18) * p.maxAlpha;
        else alpha = p.maxAlpha;
        if (alpha < 0) alpha = 0;

        // Cursor brightness boost
        if (nearCursor > 0) {
          alpha = Math.min(0.9, alpha * (1 + TINT_BOOST * nearCursor));
        }

        // Color lerp: cool off-white → blood red near cursor
        const r = (BASE_R + (RED_R - BASE_R) * nearCursor) | 0;
        const g = (BASE_G + (RED_G - BASE_G) * nearCursor) | 0;
        const b = (BASE_B + (RED_B - BASE_B) * nearCursor) | 0;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, PARTICLE_SIZE, 0, TWO_PI);
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
