import React, { useState, useEffect } from 'react';
import DesktopCaseEngage from './DesktopCaseEngage';
import MobileCaseEngage from './MobileCaseEngage';

const CaseEngage = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return isMobile ? <MobileCaseEngage /> : <DesktopCaseEngage />;
};

export default CaseEngage;
