import React, { useState, useEffect, useRef } from 'react';
import { informants } from '../data/mock';
import { Separator } from './ui/separator';

/* ── Redacted text renderer ── */
const renderTranscript = (text, redactedWords) => {
  if (!redactedWords || redactedWords.length === 0) return text;
  const escapedWords = redactedWords.map((w) =>
    w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  const regex = new RegExp(`(${escapedWords.join('|')})`, 'g');
  const parts = text.split(regex);
  return parts.map((part, index) => {
    if (redactedWords.includes(part)) {
      return (
        <span key={index} className="informant-redacted" title="[HOVER TO DECLASSIFY]">
          {part}
        </span>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

/* ── Surveillance Avatar ── */
const SurveillanceAvatar = ({ initials, caseRef }) => (
  <div className="relative w-[72px] h-[88px] flex-shrink-0" style={{ border: '2px solid #1A1A1A' }}>
    {/* Photo area */}
    <div
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: '#2A2A2A',
        filter: 'grayscale(100%) contrast(120%)',
      }}
    >
      {/* Silhouette / initials */}
      <span
        className="text-[22px] text-[#666] tracking-[0.1em] select-none"
        style={{ fontFamily: "'Julius Sans One', sans-serif" }}
      >
        {initials}
      </span>
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        }}
      />
      {/* Corner crosshair markers */}
      <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#888]/50" />
      <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#888]/50" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#888]/50" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#888]/50" />
    </div>
    {/* Case ref strip */}
    <div
      className="absolute -bottom-[14px] left-0 right-0 text-center text-[7px] tracking-[0.2em] text-[#1A1A1A]/50"
      style={{ fontFamily: "'Special Elite', cursive" }}
    >
      {caseRef}
    </div>
  </div>
);

/* ── Single Evidence Card ── */
const EvidenceCard = ({ informant, index }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const isDark = informant.bg === '#FFFFFF';
  const textColor = '#1A1A1A';
  const subtextColor = 'rgba(26, 26, 26, 0.55)';
  const quoteMarkColor = isDark ? 'rgba(26, 26, 26, 0.06)' : 'rgba(26, 26, 26, 0.07)';

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${
        informant.cardType === 'wide'
          ? 'md:col-span-2'
          : informant.cardType === 'tall'
          ? 'md:row-span-2'
          : ''
      }`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s ease ${index * 0.18}s, transform 0.7s ease ${index * 0.18}s`,
      }}
    >
      <div
        className="relative h-full p-7 md:p-8"
        style={{
          backgroundColor: informant.bg,
          border: '2px solid #1A1A1A',
          boxShadow: '6px 6px 0px #1A1A1A',
        }}
      >
        {/* Oversized quotation mark — background graphic */}
        <div
          className="absolute select-none pointer-events-none leading-none"
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: informant.cardType === 'wide' ? '220px' : informant.cardType === 'tall' ? '180px' : '150px',
            color: quoteMarkColor,
            top: '-20px',
            right: informant.cardType === 'wide' ? '30px' : '10px',
            lineHeight: '1',
          }}
        >
          &ldquo;
        </div>

        {/* Top row: avatar + label */}
        <div className="relative z-10 flex items-start gap-5 mb-6">
          <SurveillanceAvatar initials={informant.initials} caseRef={informant.caseRef} />
          <div className="pt-1">
            <p
              className="text-[12px] tracking-[0.3em] uppercase mb-1"
              style={{ fontFamily: "'Special Elite', cursive", color: textColor }}
            >
              {informant.label}
            </p>
            <p
              className="text-[10px] tracking-[0.15em] uppercase"
              style={{ fontFamily: "'Special Elite', cursive", color: subtextColor }}
            >
              ({informant.role})
            </p>
          </div>
        </div>

        {/* Transcript body */}
        <blockquote
          className="relative z-10 leading-[2.1] tracking-[0.02em]"
          style={{
            fontFamily: "'Special Elite', cursive",
            fontSize: informant.cardType === 'wide' ? '14px' : '13px',
            color: textColor,
          }}
        >
          &ldquo;{renderTranscript(informant.transcript, informant.redactedWords)}&rdquo;
        </blockquote>

        {/* Bottom: classified stamp */}
        <div className="relative z-10 mt-6 flex items-center justify-between">
          <span
            className="text-[8px] tracking-[0.35em] uppercase"
            style={{ fontFamily: "'Special Elite', cursive", color: subtextColor }}
          >
            Transcript — Verified
          </span>
          <span
            className="text-[9px] tracking-[0.2em] uppercase px-2 py-0.5"
            style={{
              fontFamily: "'Special Elite', cursive",
              color: '#B22222',
              border: '1px solid #B22222',
            }}
          >
            Classified
          </span>
        </div>
      </div>
    </div>
  );
};

/* ── Floating Decorative Quote Block ── */
const FloatingQuote = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex items-center justify-center relative"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.8s ease 0.5s',
      }}
    >
      <div className="text-center px-4">
        <div
          className="select-none leading-none mb-3"
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '120px',
            color: 'rgba(244, 236, 216, 0.08)',
            lineHeight: '0.7',
          }}
        >
          &ldquo;
        </div>
        <p
          className="text-[11px] text-[#F4ECD8]/30 tracking-[0.2em] uppercase max-w-[200px] mx-auto"
          style={{ fontFamily: "'Special Elite', cursive", lineHeight: '2' }}
        >
          Every product is a crime scene. Every metric is a clue.
        </p>
      </div>
    </div>
  );
};

/* ── Main Section ── */
const Informants = () => {
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

  return (
    <section className="py-24 px-8 md:px-12" id="informants" ref={sectionRef}>
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
          Exhibit B
        </span>
        <h2
          className="text-[24px] md:text-[30px] text-[#F4ECD8] tracking-[0.03em]"
          style={{ fontFamily: "'Julius Sans One', sans-serif" }}
        >
          The Informants
        </h2>
        <p
          className="text-[10px] text-[#F4ECD8]/25 mt-2.5 tracking-[0.2em] uppercase"
          style={{ fontFamily: "'Special Elite', cursive" }}
        >
          Redacted Interrogation Transcripts &mdash; Hover to Declassify
        </p>
        <div className="w-12 h-[1px] bg-[#B22222] mt-4" />
      </div>

      {/* Masonry evidence board grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 max-w-5xl"
        style={{ gridAutoRows: 'minmax(200px, auto)' }}
      >
        {/* Card 1: Commissioner — wide (spans 2 cols) */}
        <EvidenceCard informant={informants[0]} index={0} />

        {/* Card 2: Detective Partner — tall (spans 2 rows) */}
        <EvidenceCard informant={informants[1]} index={1} />

        {/* Card 3: Witness — standard */}
        <EvidenceCard informant={informants[2]} index={2} />

        {/* Floating decorative quote */}
        <FloatingQuote />
      </div>

      {/* Section footer */}
      <div className="mt-20 max-w-5xl">
        <Separator className="bg-[#2A2A2A]" />
        <p
          className="text-[8px] text-[#F4ECD8]/10 tracking-[0.4em] uppercase mt-4"
          style={{ fontFamily: "'Special Elite', cursive" }}
        >
          End of Exhibits &mdash; All testimony verified &amp; sealed
        </p>
      </div>
    </section>
  );
};

export default Informants;
