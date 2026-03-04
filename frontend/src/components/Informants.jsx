import React, { useState, useEffect, useRef } from 'react';
import { informants } from '../data/mock';
import { Separator } from './ui/separator';

const renderTranscript = (text, redactedWords) => {
  if (!redactedWords || redactedWords.length === 0) return text;

  // Escape special regex chars in words
  const escapedWords = redactedWords.map((w) =>
    w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  const regex = new RegExp(`(${escapedWords.join('|')})`, 'g');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (redactedWords.includes(part)) {
      return (
        <span
          key={index}
          className="redacted-word"
          title="[HOVER TO DECLASSIFY]"
        >
          {part}
        </span>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const TranscriptCard = ({ informant, index }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative pl-8 md:pl-10"
      style={{
        borderLeft: '2px solid #2A2A2A',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
        transition: `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`,
      }}
    >
      {/* Left border accent dot */}
      <div
        className="absolute left-[-5px] top-0 w-[8px] h-[8px] rounded-full bg-[#B22222]"
      />

      {/* Witness label */}
      <div className="flex items-center gap-4 mb-4">
        <span
          className="text-[11px] text-[#B22222] tracking-[0.3em] uppercase"
          style={{ fontFamily: "'Special Elite', cursive" }}
        >
          {informant.label}
        </span>
        <span
          className="text-[10px] text-[#F4ECD8]/20 tracking-wider"
          style={{ fontFamily: "'Special Elite', cursive" }}
        >
          ({informant.role})
        </span>
      </div>

      {/* Transcript body */}
      <blockquote
        className="text-[12px] text-[#F4ECD8]/50 leading-[2.2] tracking-[0.03em]"
        style={{ fontFamily: "'Special Elite', cursive" }}
      >
        &ldquo;{renderTranscript(informant.transcript, informant.redactedWords)}&rdquo;
      </blockquote>

      {/* Transcript metadata */}
      <div className="mt-5 flex items-center gap-3">
        <span
          className="text-[8px] text-[#F4ECD8]/15 tracking-[0.3em] uppercase"
          style={{ fontFamily: "'Special Elite', cursive" }}
        >
          Transcript #{String(index + 1).padStart(3, '0')} &mdash; Recorded
          under oath
        </span>
      </div>
    </div>
  );
};

const Informants = () => {
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
    <section
      className="py-24 px-8 md:px-12"
      id="informants"
      ref={sectionRef}
    >
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

      {/* Transcript list */}
      <div className="flex flex-col gap-14 max-w-3xl">
        {informants.map((informant, index) => (
          <TranscriptCard
            key={informant.id}
            informant={informant}
            index={index}
          />
        ))}
      </div>

      {/* Section footer stamp */}
      <div className="mt-20 max-w-3xl">
        <Separator className="bg-[#2A2A2A]" />
        <p
          className="text-[8px] text-[#F4ECD8]/10 tracking-[0.4em] uppercase mt-4"
          style={{ fontFamily: "'Special Elite', cursive" }}
        >
          End of Exhibits &mdash; All testimony verified
        </p>
      </div>
    </section>
  );
};

export default Informants;
