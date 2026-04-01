import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { profileData, jurisdictions } from '../data/mock';
import { ChevronRight, FileSearch } from 'lucide-react';

/* ── Unified cinematic easing ── */
const CINEMATIC_EASE = [0.25, 1, 0.5, 1];

const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

/* ── Jurisdictions Bar — variant definitions ── */

// Parent: stagger the children like ships emerging from fog one by one
const logoContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.25, delayChildren: 0.2 },
  },
};

// Label: fog reveal — no base filter needed
const labelVariants = {
  hidden: { opacity: 0, filter: 'blur(10px)', y: 10 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: 1.2, ease: CINEMATIC_EASE },
  },
};

// Each logo: fog reveal — grayscale + contrast baked into filter chain so
// Framer Motion owns the full filter and there's no CSS conflict
const logoVariants = {
  hidden: { opacity: 0, filter: 'grayscale(100%) contrast(150%) blur(10px)', y: 10 },
  visible: {
    opacity: 1,
    filter: 'grayscale(100%) contrast(150%) blur(0px)',
    y: 0,
    transition: { duration: 1.2, ease: CINEMATIC_EASE },
  },
};

/* ── Headline with highlighted phrase — Mask Reveal ── */
const StyledHeadline = () => {
  const { headline, highlightedPhrase } = profileData;
  const parts = headline.split(highlightedPhrase);

  return (
    <div className="overflow-hidden">
      <motion.h1
        className="text-[36px] md:text-[44px] lg:text-[54px] leading-[1.15] tracking-[0.01em]"
        style={{ fontFamily: SWISS }}
        initial={{ y: '100%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.0, ease: CINEMATIC_EASE, delay: 0.2 }}
      >
        <span className="text-white">{parts[0]}</span>
        <span className="text-[#FFFFFF]">{highlightedPhrase}</span>
        <span className="text-white">{parts[1]}</span>
      </motion.h1>
    </div>
  );
};

/* ── Jurisdictions / Logo Strip — Fog Reveal ── */
const JurisdictionsBar = () => (
  <motion.div
    className="w-full border-t border-b border-[#1E1E1E] py-6 md:py-7 mt-0"
    variants={logoContainerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-100px' }}
  >
    <div className="flex flex-col md:flex-row items-center gap-5 md:gap-10 px-8 md:px-12">

      {/* Label — first ship out of the fog */}
      <motion.span
        className="text-[9px] text-[#FFFFFF]/50 tracking-[0.4em] uppercase flex-shrink-0"
        style={{ fontFamily: SWISS }}
        variants={labelVariants}
      >
        Systems Deployed:
      </motion.span>

      <div className="hidden md:block w-px h-5 bg-[#2A2A2A]" />

      {/* Logos — each drifts in through the fog after the label */}
      <div className="flex items-center gap-8 md:gap-12">
        {jurisdictions.map((j) => (
          <motion.span
            key={j.id}
            className="text-[13px] md:text-[14px] tracking-[0.25em] uppercase select-none"
            style={{
              fontFamily: SWISS,
              color: 'rgba(244, 236, 216, 0.45)',
              textShadow: '0 0 1px rgba(244, 236, 216, 0.05)',
            }}
            variants={logoVariants}
          >
            {j.name}
          </motion.span>
        ))}
      </div>
    </div>
  </motion.div>
);

/* ── Main Hero Section ── */
const ColdOpen = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const shadowOpacity = useTransform(scrollYProgress, [0, 0.72], [0, 0.92]);
  const imageY        = useTransform(scrollYProgress, [0, 1],    ['0%', '22%']);
  const textSinkY     = useTransform(scrollYProgress, [0, 0.65], ['0px', '52px']);

  return (
    <section id="cold-open" ref={sectionRef}>
      <div className="relative w-full min-h-[85vh] flex items-center bg-[#141A21] overflow-hidden">

        {/* Layer 0: Hero image — parallax sink */}
        <motion.img
          src={profileData.heroImage}
          alt="Satyajit Mall — Product Manager"
          className="absolute right-0 top-0 h-full w-[80%] md:w-[60%] object-cover object-[center_top] z-0"
          style={{
            filter: 'grayscale(100%) contrast(115%) brightness(0.85)',
            y: imageY,
          }}
        />

        {/* Layer 1a: Left-to-right fade */}
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#141A21] via-[#141A21]/90 to-transparent" />

        {/* Layer 1b: Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 z-[1] pointer-events-none bg-gradient-to-t from-[#141A21] to-transparent" />

        {/* Layer 2: Chiaroscuro shadow — "Into the Shadows" */}
        <motion.div
          className="absolute inset-0 z-[15] pointer-events-none"
          style={{ backgroundColor: '#141A21', opacity: shadowOpacity }}
        />

        {/* Layer 3: Foreground content — sinks on scroll */}
        <motion.div
          className="relative z-10 w-full md:w-[60%] pl-8 md:pl-16 py-16"
          style={{ y: textSinkY }}
        >
          {/* Case file tag */}
          <motion.div
            className="flex items-center gap-2.5 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'linear', delay: 0.1 }}
          >
            <FileSearch size={13} strokeWidth={1.5} className="text-[#dc2626]" />
            <span
              className="text-[9px] text-[#FFFFFF]/50 tracking-[0.4em] uppercase"
              style={{ fontFamily: SWISS }}
            >
              Active File #001
            </span>
          </motion.div>

          {/* Headline — mask reveal */}
          <StyledHeadline />

          {/* Sub-headline — blur fade */}
          <motion.p
            className="mt-7 text-[13px] leading-[2.1] tracking-[0.02em] max-w-lg"
            style={{ fontFamily: SWISS, color: '#A0A0A0' }}
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.2, ease: 'linear', delay: 0.4 }}
          >
            {profileData.subHeadline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-start gap-4 mt-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: CINEMATIC_EASE, delay: 0.6 }}
          >
            <a
              href="#evidence"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#evidence')?.scrollIntoView({ behavior: 'smooth' });
                window.dispatchEvent(new CustomEvent('open-action-agent'));
              }}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#dc2626] text-white text-[11px] tracking-[0.25em] uppercase select-none group"
              style={{
                fontFamily: SWISS,
                border: 'none',
                borderRadius: '0',
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#8B1A1A';
                e.currentTarget.style.boxShadow = '4px 4px 0px #111';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Initiate Investigation
              <ChevronRight size={14} strokeWidth={2} className="group-hover:translate-x-0.5" style={{ transition: 'transform 0.2s ease' }} />
            </a>

            <a
              href="#informants"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#informants')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 text-white text-[11px] tracking-[0.25em] uppercase select-none"
              style={{
                fontFamily: SWISS,
                background: 'transparent',
                border: '2px solid #FFFFFF',
                borderRadius: '0',
                transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '4px 4px 0px #333';
                e.currentTarget.style.borderColor = '#E5E7EB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#FFFFFF';
              }}
            >
              Review Evidence
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Jurisdictions Bar — fog reveal ── */}
      <JurisdictionsBar />
    </section>
  );
};

export default ColdOpen;
