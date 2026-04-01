import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Menu, X } from 'lucide-react';

const SWISS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const TELE  = "'Courier New', Courier, monospace";

const navItems = [
  { id: 'evidence',   label: 'The Evidence',   route: '/cases' },
  { id: 'laboratory', label: 'The Laboratory',  route: '/lab' },
  { id: 'dossier',    label: 'The Dossier',     route: '/dossier' },
  { id: 'informants', label: 'The Informants',  route: '/informants' },
];

const LedgerEdge = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ── Edge trigger strip — 3px, barely there when closed ── */}
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', left: 0, top: 0,
            width: 3, height: '100vh',
            backgroundColor: 'rgba(178,34,34,0.25)',
            zIndex: 50, cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(178,34,34,0.6)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(178,34,34,0.25)'; }}
        />
      )}

      {/* ── Toggle button — floats at top-left ── */}
      <button
        onClick={() => setIsOpen(v => !v)}
        aria-label="Toggle navigation"
        style={{
          position: 'fixed', top: 18, left: isOpen ? 292 : 14,
          height: 36,
          paddingLeft: 10, paddingRight: isOpen ? 10 : 14,
          backgroundColor: isOpen ? 'rgba(139,26,26,0.95)' : 'rgba(10,12,16,0.85)',
          border: `1px solid ${isOpen ? 'rgba(220,38,38,0.5)' : 'rgba(178,34,34,0.28)'}`,
          borderRadius: 3,
          display: 'flex', alignItems: 'center', gap: 8,
          cursor: 'pointer', outline: 'none',
          zIndex: 51,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition: 'left 0.4s cubic-bezier(0.25,1,0.5,1), background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: isOpen ? '0 0 16px rgba(220,38,38,0.2)' : '0 2px 12px rgba(0,0,0,0.5)',
        }}
        onMouseEnter={e => { if (!isOpen) e.currentTarget.style.borderColor = 'rgba(178,34,34,0.6)'; }}
        onMouseLeave={e => { if (!isOpen) e.currentTarget.style.borderColor = 'rgba(178,34,34,0.28)'; }}
      >
        {isOpen
          ? <X size={13} strokeWidth={2} color="#E5E7EB" />
          : <Menu size={14} strokeWidth={1.5} color="rgba(220,38,38,0.9)" />
        }
        {!isOpen && (
          <span style={{
            fontFamily: TELE, fontSize: 9,
            color: '#D1D5DB', letterSpacing: '0.2em',
            textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>
            MENU
          </span>
        )}
      </button>

      {/* ── Slide-out Drawer ── */}
      <nav
        style={{
          position: 'fixed', left: 0, top: 0,
          height: '100vh', width: 280,
          backgroundColor: 'rgba(6,8,12,0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          zIndex: 49,
          display: 'flex', flexDirection: 'column',
          paddingTop: 72,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.4s cubic-bezier(0.25,1,0.5,1)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '0 28px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <p style={{
            fontFamily: TELE, fontSize: 9,
            color: 'rgba(220,38,38,0.65)', letterSpacing: '0.35em',
            textTransform: 'uppercase', margin: '0 0 7px',
          }}>
            [ CASE FILE ]
          </p>
          <p style={{
            fontFamily: SWISS, fontSize: 12, fontWeight: 400,
            color: '#D1D5DB', letterSpacing: '0.04em',
            margin: 0,
          }}>
            Satyajit Mall — Product Manager
          </p>
        </div>

        {/* Nav links */}
        <div style={{ flex: 1, padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>

          {/* Home */}
          <NavLink to="/" icon={<Home size={12} strokeWidth={1.5} />} label="Home" onClose={() => setIsOpen(false)} isHome />

          <div style={{ height: 1, margin: '6px 28px', backgroundColor: 'rgba(255,255,255,0.04)' }} />

          {navItems.map((item, i) => (
            <NavLink
              key={item.id}
              to={item.route}
              index={i + 1}
              label={item.label}
              onClose={() => setIsOpen(false)}
            />
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 28px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <p style={{
            fontFamily: TELE, fontSize: 9,
            color: '#9CA3AF', letterSpacing: '0.22em',
            textTransform: 'uppercase', margin: '0 0 4px',
          }}>
            CLASSIFICATION
          </p>
          <p style={{
            fontFamily: TELE, fontSize: 9,
            color: 'rgba(220,38,38,0.5)', letterSpacing: '0.28em',
            textTransform: 'uppercase', margin: '0 0 14px',
          }}>
            CONFIDENTIAL
          </p>
          <p style={{
            fontFamily: SWISS, fontSize: 10,
            color: '#6B7280',
            margin: 0,
          }}>
            &copy; 2025 S. Mall
          </p>
        </div>
      </nav>

      {/* Backdrop */}
      {isOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 30,
            backgroundColor: 'rgba(0,0,0,0.55)',
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

/* ── Shared nav link row ── */
const NavLink = ({ to, label, index, icon, onClose, isHome }) => {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to={to}
      onClick={onClose}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '11px 28px',
        color: hov ? '#ffffff' : '#D1D5DB',
        textDecoration: 'none',
        borderLeft: `2px solid ${hov ? (isHome ? 'rgba(255,255,255,0.3)' : '#dc2626') : 'transparent'}`,
        backgroundColor: hov ? (isHome ? 'rgba(255,255,255,0.03)' : 'rgba(220,38,38,0.05)') : 'transparent',
        transition: 'all 0.18s ease',
      }}
    >
      {icon ? (
        <span style={{ color: hov ? '#FFFFFF' : '#D1D5DB', flexShrink: 0 }}>
          {icon}
        </span>
      ) : (
        <span style={{
          fontFamily: TELE, fontSize: 9,
          color: hov ? '#9CA3AF' : '#9CA3AF',
          flexShrink: 0, width: 18,
        }}>
          {String(index).padStart(2, '0')}
        </span>
      )}
      <span style={{
        fontFamily: SWISS, fontSize: 12, fontWeight: 500,
        letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        {label}
      </span>
    </Link>
  );
};

export default LedgerEdge;
