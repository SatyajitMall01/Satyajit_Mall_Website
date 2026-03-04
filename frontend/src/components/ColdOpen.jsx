import React, { useState, useEffect, useRef } from 'react';
import { profileData } from '../data/mock';
import { Terminal, ChevronDown } from 'lucide-react';

const ColdOpen = () => {
  const fullText = profileData.headline;
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (indexRef.current < fullText.length) {
        indexRef.current += 1;
        setDisplayText(fullText.slice(0, indexRef.current));
      } else {
        clearInterval(timer);
        setIsTypingDone(true);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [fullText]);

  // Blinking cursor
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      id="cold-open"
    >
      {/* Spotlight radial gradient */}
      <div className="absolute inset-0 bg-[#0F1419]">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 700px 550px at 45% 38%, rgba(244, 236, 216, 0.055) 0%, transparent 100%)',
          }}
        />
        {/* Secondary dim light */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle 300px at 80% 70%, rgba(178, 34, 34, 0.03) 0%, transparent 100%)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-3xl px-8 md:px-12 py-20">
        {/* Terminal header */}
        <div className="flex items-center gap-3 mb-10 animate-fadeIn">
          <Terminal size={14} strokeWidth={1.5} className="text-[#B22222]" />
          <span
            className="text-[10px] text-[#F4ECD8]/30 tracking-[0.4em] uppercase"
            style={{ fontFamily: "'Special Elite', cursive" }}
          >
            Accessing Archive...
          </span>
        </div>

        {/* Typing headline */}
        <h1
          className="text-[28px] md:text-[36px] lg:text-[44px] text-[#F4ECD8] leading-[1.3] tracking-[0.02em]"
          style={{ fontFamily: "'Julius Sans One', sans-serif" }}
        >
          {displayText}
          <span
            className="inline-block w-[3px] h-[0.85em] bg-[#B22222] ml-1.5 align-middle"
            style={{
              opacity: showCursor ? 1 : 0,
              transition: 'opacity 0.08s',
            }}
          />
        </h1>

        {/* Bio text - fades in after typing */}
        <div
          className="mt-10"
          style={{
            opacity: isTypingDone ? 1 : 0,
            transform: isTypingDone ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="w-16 h-[1px] bg-[#B22222] mb-6" />
          <p
            className="text-[13px] text-[#F4ECD8]/40 leading-[2] max-w-xl tracking-wide"
            style={{ fontFamily: "'Special Elite', cursive" }}
          >
            {profileData.bio}
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          className="mt-20"
          style={{
            opacity: isTypingDone ? 1 : 0,
            transition: 'opacity 1s ease 0.5s',
          }}
        >
          <a
            href="#evidence"
            onClick={(e) => {
              e.preventDefault();
              document
                .querySelector('#evidence')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2.5 text-[#F4ECD8]/25 hover:text-[#B22222] group"
            style={{ transition: 'color 0.3s ease' }}
          >
            <span
              className="text-[10px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Special Elite', cursive" }}
            >
              Examine Evidence
            </span>
            <ChevronDown
              size={14}
              strokeWidth={1.5}
              className="animate-bounce"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ColdOpen;
