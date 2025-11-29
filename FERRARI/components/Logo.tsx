import React from 'react';
import ferrariLogo from '../assets/Untitled design (8).png';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <img 
    src={ferrariLogo}
    alt="Nicole Marie Severson Logo"
    className={className}
  />
);
