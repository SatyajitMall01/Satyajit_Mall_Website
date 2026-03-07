import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { evidenceCards } from '../data/mock';
import { Separator } from './ui/separator';
import { Search } from 'lucide-react';

/* ── Unified cinematic easing — heavy ease-out, no spring ── */
const CINEMATIC_EASE = [0.25, 1, 0.5, 1];

/* ── Pattern class map ── */
const patternClassMap = {
  grid: 'pattern-grid',
  diagonal: 'pattern-diagonal',
  blueprint: 'pattern-blueprint',
  circuit: 'pattern-circuit',
};

/* ── Single Evidence Carousel Card ── */
const EvidenceCard = ({ card, onHoverStart, onHoverEnd }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    /* Outer motion.div handles scroll-driven "Focus Settle" entry animation.
       Inner div handles CSS hover transforms — kept separate to avoid conflicts. */
    <motion.div
      className="flex-shrink-0 w-[360px] md:w-[400px]"
      initial={{ scale: 1.05, opacity: 0 }}
      whileInView={{ scale: 1.0, opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
    >
      <div
        className="evidence-card relative cursor-pointer select-none"
        style={{
          transform: isHovered
            ? 'translateY(-20px) scale(1.02) rotate(0deg)'
            : `rotate(${card.rotate})`,
          transition:
            'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease',
          boxShadow: isHovered
            ? '10px 10px 0px #080808'
            : '8px 8px 0px #111',
        }}
        onMouseEnter={() => { setIsHovered(true); onHoverStart?.(); }}
        onMouseLeave={() => { setIsHovered(false); onHoverEnd?.(); }}
      >
        {/* Card body */}
        <div
          className={`relative overflow-hidden h-[320px] md:h-[360px] ${patternClassMap[card.patternType] || ''}`}
          style={{
            backgroundColor: '#151515',
            border: '2px solid #333',
          }}
        >
          {/* Noise/grain layer on card — card-level texture, intentional */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-multiply z-[1]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundRepeat: 'repeat',
              backgroundSize: '150px 150px',
            }}
          />

          {/* Static card content */}
          <div className="relative z-[2] h-full flex flex-col justify-between p-7">
            {/* Top: case number + status */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <span
                  className="text-[9px] text-[#F4ECD8]/25 tracking-[0.35em] uppercase"
                  style={{ fontFamily: "'Special Elite', cursive" }}
                >
                  {card.caseNumber}
                </span>
                <span
                  className="text-[8px] text-[#B22222]/50 tracking-[0.2em] uppercase"
                  style={{ fontFamily: "'Special Elite', cursive" }}
                >
                  Closed &mdash; Solved
                </span>
              </div>

              {/* Display title */}
              <h3
                className="text-[15px] text-[#F4ECD8]/40 tracking-[0.15em] uppercase mb-2"
                style={{ fontFamily: "'Special Elite', cursive" }}
              >
                {card.displayTitle}
              </h3>

              {/* Base title — large */}
              <h2
                className="text-[22px] md:text-[24px] text-[#F4ECD8] tracking-[0.02em] leading-snug"
                style={{ fontFamily: "'Julius Sans One', sans-serif" }}
              >
                {card.baseTitle}
              </h2>
            </div>

            {/* Bottom: tags + microscope hint */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[8px] text-[#F4ECD8]/20 border border-[#333] px-2.5 py-1 tracking-[0.2em] uppercase"
                    style={{ fontFamily: "'Special Elite', cursive" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Search size={11} strokeWidth={1.5} className="text-[#F4ECD8]/15" />
                <span
                  className="text-[8px] text-[#F4ECD8]/15 tracking-[0.3em] uppercase"
                  style={{ fontFamily: "'Special Elite', cursive" }}
                >
                  Hover to Examine
                </span>
              </div>
            </div>
          </div>

          {/* ── Hover Overlay: The "Microscope" Reveal ── */}
          <div
            className="absolute inset-0 z-[3] flex flex-col justify-end p-7"
            style={{
              background: 'rgba(15, 20, 25, 0.92)',
              transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            {/* Forensic insight header */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-[#B22222]" />
                <span
                  className="text-[9px] text-[#B22222] tracking-[0.35em] uppercase"
                  style={{ fontFamily: "'Special Elite', cursive" }}
                >
                  Forensic Insight
                </span>
              </div>
              <Separator className="bg-[#333] mb-4" />
            </div>

            {/* Case title repeat */}
            <h3
              className="text-[18px] text-[#F4ECD8] tracking-[0.02em] leading-snug mb-4"
              style={{ fontFamily: "'Julius Sans One', sans-serif" }}
            >
              {card.baseTitle}
            </h3>

            {/* Forensic insight text */}
            <p
              className="text-[12px] text-[#F4ECD8]/60 leading-[2] tracking-[0.02em]"
              style={{ fontFamily: "'Special Elite', cursive" }}
            >
              &ldquo;{card.forensicInsight}&rdquo;
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-5">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[8px] text-[#B22222]/60 border border-[#B22222]/30 px-2.5 py-1 tracking-[0.2em] uppercase"
                  style={{ fontFamily: "'Special Elite', cursive" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Main Section ── */
const HallOfTrophies = () => {
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const rafRef = useRef(null);
  const isHovering = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const [carouselReady, setCarouselReady] = useState(false);

  // Scroll-driven "emerge from darkness" — section rises from below
  // offset: section bottom hits viewport bottom → section top hits 35% down viewport
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start 0.35'],
  });

  // Heavy, linear emergence — no spring, no bounce
  // 100px to 0px matches "Focus Pull" spec
  const sectionY = useTransform(sectionProgress, [0, 1], [100, 0]);
  const sectionOpacity = useTransform(sectionProgress, [0, 0.55], [0, 1]);

  // Darkness overlay that dissipates as section emerges — chiaroscuro effect
  const darknessOpacity = useTransform(sectionProgress, [0, 0.85], [0.78, 0]);

  // Start carousel once section has entered view (~40% progress)
  useEffect(() => {
    const unsub = sectionProgress.on('change', (v) => {
      if (v >= 0.4 && !carouselReady) setCarouselReady(true);
    });
    return unsub;
  }, [sectionProgress, carouselReady]);

  // RAF auto-scroll engine — starts once section is visible
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !carouselReady) return;

    const tick = () => {
      if (!isHovering.current && !isDragging.current) {
        el.scrollLeft += 1;
        // Seamless infinite loop: reset to 0 when past the first duplicated set
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [carouselReady]);

  // Drag handlers
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    isHovering.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  // Duplicated for infinite illusion
  const duplicatedCards = [...evidenceCards, ...evidenceCards];

  return (
    <section className="relative py-24 bg-[#0F1419]" id="evidence" ref={sectionRef}>
      {/* Darkness overlay — dissipates as section emerges, chiaroscuro effect */}
      <motion.div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{ backgroundColor: '#0F1419', opacity: darknessOpacity }}
      />

      {/* Section content — rises from below, heavy linear physics */}
      <motion.div style={{ y: sectionY, opacity: sectionOpacity }}>
        {/* Section header */}
        <div className="px-8 md:px-12 mb-14">
          <motion.span
            className="text-[9px] text-[#F4ECD8]/25 tracking-[0.5em] uppercase block mb-3"
            style={{ fontFamily: "'Special Elite', cursive" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: 'linear' }}
          >
            Exhibit A
          </motion.span>

          {/* Section headline — mask reveal */}
          <div className="overflow-hidden">
            <motion.h2
              className="text-[24px] md:text-[30px] text-[#F4ECD8] tracking-[0.03em]"
              style={{ fontFamily: "'Julius Sans One', sans-serif" }}
              initial={{ y: '100%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.0, ease: CINEMATIC_EASE, delay: 0.1 }}
            >
              The Hall of Trophies
            </motion.h2>
          </div>

          <div className="w-12 h-[1px] bg-[#B22222] mt-4" />
        </div>

        {/* Draggable auto-scroll carousel */}
        <div>
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide gap-10 py-8 px-4 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            {duplicatedCards.map((card, index) => (
              <EvidenceCard
                key={`${card.id}-${index}`}
                card={card}
                onHoverStart={() => { isHovering.current = true; }}
                onHoverEnd={() => { isHovering.current = false; }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Section footer */}
      <div className="px-8 md:px-12 mt-14">
        <div className="max-w-5xl">
          <Separator className="bg-[#2A2A2A]" />
          <p
            className="text-[8px] text-[#F4ECD8]/10 tracking-[0.4em] uppercase mt-4"
            style={{ fontFamily: "'Special Elite', cursive" }}
          >
            Evidence carousel &mdash; All cases documented &amp; sealed
          </p>
        </div>
      </div>
    </section>
  );
};

export default HallOfTrophies;
