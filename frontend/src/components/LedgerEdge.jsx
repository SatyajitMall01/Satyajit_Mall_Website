import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Separator } from './ui/separator';

const navItems = [
  { id: 'evidence',   label: 'The Evidence',   route: '/cases' },
  { id: 'laboratory', label: 'The Laboratory',  route: '/lab' },
  { id: 'dossier',    label: 'The Dossier',     route: '/dossier' },
  { id: 'informants', label: 'The Informants',  route: '/informants' },
];

const LedgerEdge = () => {
  const [isFolderOpen, setIsFolderOpen] = useState(false);

  return (
    <>
      {/* ── Fixed Spine — always visible ── */}
      <div className="fixed left-0 top-0 h-screen w-16 z-50 bg-[#0F1419] border-r border-[#333] flex flex-col items-center justify-between py-6">
        {/* Toggle button */}
        <button
          onClick={() => setIsFolderOpen(!isFolderOpen)}
          className="flex flex-col items-center gap-3 group"
          aria-label="Toggle navigation"
        >
          <FileText
            size={15}
            strokeWidth={1.5}
            className={`transition-colors duration-300 ${isFolderOpen ? 'text-[#B22222]' : 'text-[#B22222]/60 group-hover:text-[#B22222]'}`}
          />
          <span
            className="text-[8px] text-[#F4ECD8]/30 tracking-[0.3em] uppercase group-hover:text-[#F4ECD8]/60 transition-colors duration-300 select-none"
            style={{
              fontFamily: "'Special Elite', cursive",
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
            }}
          >
            Case File
          </span>
        </button>

        {/* Confidential label — bottom of spine */}
        <span
          className="text-[7px] text-[#B22222]/40 tracking-[0.2em] uppercase select-none"
          style={{
            fontFamily: "'Special Elite', cursive",
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          Confidential
        </span>
      </div>

      {/* ── Slide-out Drawer ── */}
      <nav
        className={`fixed left-16 top-0 h-screen w-64 bg-[#0F1419] z-40 flex flex-col justify-between py-10 px-6 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isFolderOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ borderRight: '2px solid #1A1A1A' }}
      >
        {/* Top section */}
        <div>
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
            {navItems.map((item, index) => (
              <Link
                key={item.id}
                to={item.route}
                className="group flex items-start gap-3.5 py-3 px-2 text-[#F4ECD8]/40 hover:text-white hover:pl-4 transition-all duration-300"
                onClick={() => setIsFolderOpen(false)}
              >
                <span
                  className="text-[10px] text-[#F4ECD8]/20 mt-[3px] tabular-nums flex-shrink-0"
                  style={{ fontFamily: "'Special Elite', cursive" }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className="text-[12px] tracking-[0.15em] uppercase leading-snug"
                  style={{ fontFamily: "'Special Elite', cursive" }}
                >
                  {item.label}
                </span>
              </Link>
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

      {/* ── Backdrop — closes drawer on outside click ── */}
      {isFolderOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40"
          onClick={() => setIsFolderOpen(false)}
        />
      )}
    </>
  );
};

export default LedgerEdge;
