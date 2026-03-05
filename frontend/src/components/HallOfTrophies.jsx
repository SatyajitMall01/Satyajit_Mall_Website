import React, { useState, useEffect, useRef } from 'react';
import { evidenceCards } from '../data/mock';
import { Separator } from './ui/separator';
import { Search } from 'lucide-react';

/* ── Pattern class map ── */
const patternClassMap = {
  grid: 'pattern-grid',
  diagonal: 'pattern-diagonal',
  blueprint: 'pattern-blueprint',
  circuit: 'pattern-circuit',
};

/* ── Single Evidence Carousel Card ── */
const EvidenceCard = ({ card }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="evidence-card relative flex-shrink-0 w-[360px] md:w-[400px] cursor-pointer select-none"
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card body */}
      <div
        className={`relative overflow-hidden h-[320px] md:h-[360px] ${patternClassMap[card.patternType] || ''}`}
        style={{
          backgroundColor: '#151515',
          border: '2px solid #333',
        }}
      >
        {/* Noise/grain layer on card */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-multiply z-[1]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'repeat',
            backgroundSize: '150px 150px',
          }}
        />

        {/* Static card content (always visible) */}
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
  );
};

/* ── Main Section ── */
const HallOfTrophies = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Duplicate cards for seamless infinite loop
  const duplicatedCards = [...evidenceCards, ...evidenceCards];

  return (
    <section className="py-24" id="evidence" ref={sectionRef}>
      {/* Section header */}
      <div
        className="px-8 md:px-12 mb-14"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        <span
          className="text-[9px] text-[#F4ECD8]/25 tracking-[0.5em] uppercase block mb-3"
          style={{ fontFamily: "'Special Elite', cursive" }}
        >
          Exhibit A
        </span>
        <h2
          className="text-[24px] md:text-[30px] text-[#F4ECD8] tracking-[0.03em]"
          style={{ fontFamily: "'Julius Sans One', sans-serif" }}
        >
          The Hall of Trophies
        </h2>
        <div className="w-12 h-[1px] bg-[#B22222] mt-4" />
      </div>

      {/* Full-width carousel — bleeds off edges */}
      <div
        className="w-full overflow-hidden"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.3s',
        }}
      >
        <div className="evidence-carousel-track py-8 px-4">
          {duplicatedCards.map((card, index) => (
            <EvidenceCard key={`${card.id}-${index}`} card={card} />
          ))}
        </div>
      </div>

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
