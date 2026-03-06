import React, { useState, useEffect, useRef } from 'react';
import { profileData, jurisdictions } from '../data/mock';
import { ChevronRight, FileSearch } from 'lucide-react';

/* ── Headline with highlighted phrase ── */
const StyledHeadline = () => {
  const { headline, highlightedPhrase } = profileData;
  const parts = headline.split(highlightedPhrase);

  return (
    <h1
      className="text-[36px] md:text-[44px] lg:text-[54px] leading-[1.15] tracking-[0.01em]"
      style={{ fontFamily: "'Julius Sans One', sans-serif" }}
    >
      <span className="text-white">{parts[0]}</span>
      <span className="text-[#F4ECD8]">{highlightedPhrase}</span>
      <span className="text-white">{parts[1]}</span>
    </h1>
  );
};

/* ── Jurisdictions / Logo Strip ── */
const JurisdictionsBar = () => {
  const barRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (barRef.current) observer.observe(barRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={barRef}
      className="w-full border-t border-b border-[#1E1E1E] py-6 md:py-7 mt-0"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.8s ease 0.2s',
      }}
    >
      <div className="flex flex-col md:flex-row items-center gap-5 md:gap-10 px-8 md:px-12">
        {/* Label */}
        <span
          className="text-[9px] text-[#F4ECD8]/25 tracking-[0.4em] uppercase flex-shrink-0"
          style={{ fontFamily: "'Special Elite', cursive" }}
        >
          Jurisdictions Patrolled:
        </span>

        {/* Separator */}
        <div className="hidden md:block w-px h-5 bg-[#2A2A2A]" />

        {/* Logo strip */}
        <div className="flex items-center gap-8 md:gap-12">
          {jurisdictions.map((j) => (
            <span
              key={j.id}
              className="text-[13px] md:text-[14px] tracking-[0.25em] uppercase select-none"
              style={{
                fontFamily: "'Special Elite', cursive",
                color: 'rgba(244, 236, 216, 0.2)',
                filter: 'grayscale(100%) contrast(150%)',
                textShadow: '0 0 1px rgba(244, 236, 216, 0.05)',
              }}
            >
              {j.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Main Hero Section ── */
const ColdOpen = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="cold-open" ref={sectionRef}>
      {/* ── Cinematic Full-Bleed Hero ── */}
      <div className="relative w-full min-h-[85vh] flex items-center bg-[#0F1419] overflow-hidden">

        {/* Layer 0: Hero image — pinned top-right, head-safe */}
        <img
          src={profileData.heroImage}
          alt="Satyajit Mall — Product Manager"
          className="absolute right-0 top-0 h-full w-[80%] md:w-[60%] object-cover object-[center_top] z-0"
          style={{
            filter: 'grayscale(100%) contrast(115%) brightness(0.85)',
          }}
        />

        {/* Layer 1a: Left-to-right fade — text area blends into image */}
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#0F1419] via-[#0F1419]/90 to-transparent" />

        {/* Layer 1b: Bottom fade — blends into next section */}
        <div className="absolute inset-x-0 bottom-0 h-32 z-[1] pointer-events-none bg-gradient-to-t from-[#0F1419] to-transparent" />

        {/* Layer 2: Subtle film grain */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
          }}
        />

        {/* Layer 3: Foreground content */}
        <div
          className="relative z-10 w-full md:w-[60%] pl-8 md:pl-16 py-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s',
          }}
        >
          {/* Case file tag */}
          <div className="flex items-center gap-2.5 mb-8">
            <FileSearch size={13} strokeWidth={1.5} className="text-[#B22222]" />
            <span
              className="text-[9px] text-[#F4ECD8]/30 tracking-[0.4em] uppercase"
              style={{ fontFamily: "'Special Elite', cursive" }}
            >
              Case File #001 &mdash; Active
            </span>
          </div>

          {/* Headline */}
          <StyledHeadline />

          {/* Sub-headline */}
          <p
            className="mt-7 text-[13px] leading-[2.1] tracking-[0.02em] max-w-lg"
            style={{
              fontFamily: "'Special Elite', cursive",
              color: '#A0A0A0',
            }}
          >
            {profileData.subHeadline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
            {/* Button 1: Initiate Investigation */}
            <a
              href="#evidence"
              onClick={(e) => {
                e.preventDefault();
                document
                  .querySelector('#evidence')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#B22222] text-white text-[11px] tracking-[0.25em] uppercase select-none group"
              style={{
                fontFamily: "'Special Elite', cursive",
                border: 'none',
                borderRadius: '0',
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#8B1A1A';
                e.currentTarget.style.boxShadow = '4px 4px 0px #111';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#B22222';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Initiate Investigation
              <ChevronRight size={14} strokeWidth={2} className="group-hover:translate-x-0.5" style={{ transition: 'transform 0.2s ease' }} />
            </a>

            {/* Button 2: Review Evidence */}
            <a
              href="#informants"
              onClick={(e) => {
                e.preventDefault();
                document
                  .querySelector('#informants')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 text-white text-[11px] tracking-[0.25em] uppercase select-none"
              style={{
                fontFamily: "'Special Elite', cursive",
                background: 'transparent',
                border: '2px solid #FFFFFF',
                borderRadius: '0',
                transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '4px 4px 0px #333';
                e.currentTarget.style.borderColor = '#F4ECD8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#FFFFFF';
              }}
            >
              Review Evidence
            </a>
          </div>
        </div>
      </div>

      {/* ── Jurisdictions Bar ── */}
      <JurisdictionsBar />
    </section>
  );
};

export default ColdOpen;
