import React, { useState } from 'react';
import { navLinks } from '../data/mock';
import { FileText, Menu, X } from 'lucide-react';
import { Separator } from './ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';

const LedgerEdge = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  const handleLinkClick = (e, link) => {
    setActiveLink(link.id);
    setMobileOpen(false);
    const target = document.querySelector(link.href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-5 left-5 z-[60] lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? (
          <X size={22} strokeWidth={1.5} className="text-[#F4ECD8]" />
        ) : (
          <Menu size={22} strokeWidth={1.5} className="text-[#F4ECD8]" />
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[45] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar navigation */}
      <nav
        className={`fixed left-0 top-0 h-screen w-[260px] lg:w-[15vw] lg:min-w-[220px] bg-[#0D1117] z-[50] flex flex-col justify-between py-10 px-6 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        style={{ borderRight: '2px solid #2A2A2A' }}
      >
        {/* Top section */}
        <div>
          {/* Logo / File label */}
          <div className="flex items-center gap-2.5 mb-3">
            <FileText size={16} strokeWidth={1.5} className="text-[#B22222]" />
            <span
              className="text-[#F4ECD8] text-[11px] tracking-[0.35em] uppercase"
              style={{ fontFamily: "'Julius Sans One', sans-serif" }}
            >
              Case File
            </span>
          </div>

          <Separator className="bg-[#2A2A2A] mb-10" />

          {/* Navigation links */}
          <div className="flex flex-col gap-1">
            {navLinks.map((link, index) => (
              <Tooltip key={link.id} delayDuration={400}>
                <TooltipTrigger asChild>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link)}
                    className={`group flex items-start gap-3.5 py-3 px-2 rounded-sm transition-colors duration-300 ${
                      activeLink === link.id
                        ? 'bg-[#F4ECD8]/5 text-[#F4ECD8]'
                        : 'text-[#F4ECD8]/40 hover:text-[#F4ECD8]/80 hover:bg-[#F4ECD8]/[0.02]'
                    }`}
                  >
                    <span
                      className="text-[10px] text-[#F4ECD8]/20 mt-[3px] tabular-nums"
                      style={{ fontFamily: "'Special Elite', cursive" }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="text-[12px] tracking-[0.15em] uppercase leading-snug"
                      style={{ fontFamily: "'Special Elite', cursive" }}
                    >
                      {link.label}
                    </span>
                  </a>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-[#1A1A1A] text-[#F4ECD8] border-[#333] text-xs"
                  style={{ fontFamily: "'Special Elite', cursive" }}
                >
                  Navigate to {link.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div>
          <Separator className="bg-[#2A2A2A] mb-5" />
          <p
            className="text-[9px] text-[#F4ECD8]/25 tracking-[0.25em] uppercase"
            style={{ fontFamily: "'Special Elite', cursive" }}
          >
            Classification
          </p>
          <p
            className="text-[9px] text-[#B22222] tracking-[0.25em] uppercase mt-1.5"
            style={{ fontFamily: "'Special Elite', cursive" }}
          >
            Confidential
          </p>
          <p
            className="text-[9px] text-[#F4ECD8]/15 mt-4"
            style={{ fontFamily: "'Special Elite', cursive" }}
          >
            &copy; 2025 S. Mall
          </p>
        </div>
      </nav>
    </>
  );
};

export default LedgerEdge;
