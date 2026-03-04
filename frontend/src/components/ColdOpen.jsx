import React, { useState, useEffect, useRef } from 'react';
import { profileData, jurisdictions } from '../data/mock';
import { Separator } from './ui/separator';
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
      {/* Two-Column Hero Grid */}
      <div className="relative min-h-[85vh] overflow-hidden">
        {/* Spotlight backgrounds */}
        <div className="absolute inset-0 bg-[#0F1419]">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 700px 550px at 30% 45%, rgba(244, 236, 216, 0.04) 0%, transparent 100%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle 400px at 75% 55%, rgba(178, 34, 34, 0.025) 0%, transparent 100%)',
            }}
          />
        </div>

        {/* Grid layout */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 min-h-[85vh] items-center gap-8 lg:gap-12 px-8 md:px-12 lg:px-16 py-16">
          {/* ── Left Column: The Briefing ── */}
          <div
            className="flex flex-col justify-center"
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

          {/* ── Right Column: The Hero Image ── */}
          <div
            className="flex items-center justify-center md:justify-end"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(40px)',
              transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
            }}
          >
            <div
              className="relative max-w-[420px] w-full"
              style={{
                transform: 'rotate(2deg)',
                boxShadow: '-10px 10px 0px #111',
              }}
            >
              {/* Image container — harsh geometric rectangle */}
              <div
                className="relative overflow-hidden"
                style={{
                  border: '3px solid #1A1A1A',
                  aspectRatio: '4 / 5',
                }}
              >
                <img
                  src={profileData.heroImage}
                  alt="Satyajit Mall — Technical Product Architect"
                  className="w-full h-full object-cover object-top"
                  style={{
                    filter: 'grayscale(100%) contrast(115%) brightness(0.9)',
                  }}
                />

                {/* Noise/grain overlay on image */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.18] mix-blend-multiply"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    backgroundRepeat: 'repeat',
                    backgroundSize: '200px 200px',
                  }}
                />

                {/* Vignette overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, transparent 50%, rgba(15, 20, 25, 0.6) 100%)',
                  }}
                />
              </div>

              {/* Case file label strip beneath image */}
              <div
                className="bg-[#1A1A1A] py-2.5 px-4 flex items-center justify-between"
                style={{ border: '3px solid #1A1A1A', borderTop: 'none' }}
              >
                <span
                  className="text-[8px] text-[#F4ECD8]/30 tracking-[0.35em] uppercase"
                  style={{ fontFamily: "'Special Elite', cursive" }}
                >
                  Subject: S. Mall
                </span>
                <span
                  className="text-[8px] text-[#B22222]/60 tracking-[0.25em] uppercase"
                  style={{ fontFamily: "'Special Elite', cursive" }}
                >
                  Classification: Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Jurisdictions Bar ── */}
      <JurisdictionsBar />
    </section>
  );
};

export default ColdOpen;
