import React, { useState, useEffect, useRef } from 'react';
import { evidenceCards } from '../data/mock';
import { Separator } from './ui/separator';

const EvidenceCard = ({ card }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative bg-[#151515] p-6 pb-5 border border-[#2A2A2A] cursor-pointer"
      style={{
        transform: isHovered
          ? 'rotate(0deg) translateY(-6px)'
          : `rotate(${card.rotate})`,
        boxShadow: isHovered ? '8px 8px 0px #0A0A0A' : '5px 5px 0px #0A0A0A',
        transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.35s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pin at top */}
      <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-[14px] h-[14px] rounded-full bg-[#B22222] z-10 shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />

      {/* Tape strip effect */}
      <div className="absolute -top-[1px] left-6 right-6 h-[3px] bg-[#F4ECD8]/[0.06]" />

      {/* Case number + status */}
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
          {card.status}
        </span>
      </div>

      {/* Title */}
      <h3
        className="text-[17px] text-[#F4ECD8] mb-3 tracking-[0.02em] leading-snug"
        style={{ fontFamily: "'Julius Sans One', sans-serif" }}
      >
        {card.title}
      </h3>

      {/* Summary */}
      <p
        className="text-[11px] text-[#F4ECD8]/40 leading-[1.9] mb-5 tracking-wide"
        style={{ fontFamily: "'Special Elite', cursive" }}
      >
        {card.summary}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {card.tags.map((tag) => (
          <span
            key={tag}
            className="text-[8px] text-[#F4ECD8]/25 border border-[#2A2A2A] px-2.5 py-1 tracking-[0.2em] uppercase"
            style={{
              fontFamily: "'Special Elite', cursive",
              transition: 'border-color 0.3s ease, color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#B22222';
              e.target.style.color = 'rgba(244, 236, 216, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#2A2A2A';
              e.target.style.color = 'rgba(244, 236, 216, 0.25)';
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <Separator className="bg-[#2A2A2A] mb-3" />

      {/* Date */}
      <span
        className="text-[9px] text-[#F4ECD8]/15 tracking-[0.3em]"
        style={{ fontFamily: "'Special Elite', cursive" }}
      >
        {card.date}
      </span>
    </div>
  );
};

const HallOfTrophies = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 px-8 md:px-12" id="evidence" ref={sectionRef}>
      {/* Section header */}
      <div
        className="mb-16"
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

      {/* Staggered evidence grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 max-w-4xl">
        {evidenceCards.map((card, index) => (
          <div
            key={card.id}
            className={index % 2 === 1 ? 'md:mt-20' : ''}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`,
            }}
          >
            <EvidenceCard card={card} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default HallOfTrophies;
