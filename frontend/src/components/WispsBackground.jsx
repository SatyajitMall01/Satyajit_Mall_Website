import React, { useRef, useEffect } from 'react';

/**
 * WispsBackground — ambient drifting particles rendered behind all content.
 * Pure-vanilla Canvas2D. ~120 particles desktop / 60 mobile. Flow-field drift,
 * soft radial wisps, mix-blend-mode: screen so whites add light over the
 * slate-ombre body gradient without altering its hue.
 *
 * Honors prefers-reduced-motion: renders one static frame, no animation loop.
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

    const COUNT = W < 768 ? 80 : 180;
    const particles = [];

    const spawn = (p, initialAge = false) => {
      p.x = Math.random() * W;
      p.y = Math.random() * H;
      p.vx = (Math.random() - 0.5) * 0.3;
      p.vy = (Math.random() - 0.5) * 0.3 - 0.08;
      p.r = Math.random() * 3.5 + 1.2;
      p.maxAge = 280 + Math.random() * 520;
      p.age = initialAge ? Math.random() * p.maxAge : 0;
      p.maxAlpha = 0.18 + Math.random() * 0.28;
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
      t += 0.0025;

      for (const p of particles) {
        // Flow-field — cheap sin/cos noise drives subtle direction changes
        const angle =
          Math.sin(p.x * 0.0028 + t) * Math.cos(p.y * 0.0028 - t) * Math.PI;
        p.vx += Math.cos(angle) * 0.004;
        p.vy += Math.sin(angle) * 0.004;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.age++;

        // Wrap edges
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        // Lifecycle fade in/out
        const life = p.age / p.maxAge;
        let alpha;
        if (life < 0.18) alpha = (life / 0.18) * p.maxAlpha;
        else if (life > 0.82) alpha = ((1 - life) / 0.18) * p.maxAlpha;
        else alpha = p.maxAlpha;
        if (alpha < 0) alpha = 0;

        // Soft radial wisp — larger halo for visible drift
        const radius = p.r * 7;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, TWO_PI);
        ctx.fill();

        if (p.age >= p.maxAge) spawn(p);
      }

      if (!reducedMotion) raf = requestAnimationFrame(frame);
    };

    frame();

    const onResize = () => setSize();
    window.addEventListener('resize', onResize);

    // Pause when tab hidden — saves battery
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
