import React from 'react';

/* ── Global Cursor Styles ── */
export const GlobalCursorStyles = () => (
  <style>{`
    .global-cursor { cursor: none !important; }
    .global-cursor * { cursor: none !important; }
    .global-cursor a, .global-cursor button { cursor: none !important; }
  `}</style>
);

/* ── Crosshair Cursor ── */
export const CrosshairCursor = () => {
  const [pos, setPos] = React.useState({ x: -100, y: -100 });
  const [clicking, setClicking] = React.useState(false);

  React.useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
    };
  }, []);

  const size = clicking ? 12 : 16;
  const opacity = clicking ? 1 : 0.75;

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%, -50%)',
        transition: 'width 0.08s ease, height 0.08s ease, opacity 0.08s ease',
      }}
    >
      {/* Horizontal bar */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: size * 2, height: 1,
        backgroundColor: `rgba(220,38,38,${opacity})`,
      }} />
      {/* Vertical bar */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1, height: size * 2,
        backgroundColor: `rgba(220,38,38,${opacity})`,
      }} />
      {/* Centre dot */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 3, height: 3, borderRadius: '50%',
        backgroundColor: `rgba(220,38,38,${opacity})`,
      }} />
    </div>
  );
};
