import React, { useState } from 'react';
import nmsLogo from '../assets/Untitled design (8).png';
import expLogo from '../assets/exp_logo (2).png';
import ContactLeadModal from './ContactLeadModal';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLeadOpen, setIsLeadOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-40 h-[80px] sm:h-[90px] md:h-[100px]">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 h-full">
        <div className="flex items-center justify-between h-full relative">
          {/* eXp logo - scales fluidly on all devices, 2x bigger, links to eXp Realty website */}
          <a href="https://www.exprealty.com/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 z-10" aria-label="Visit eXp Realty website">
            <img 
              src={expLogo} 
              alt="eXp Realty" 
              className="h-20 sm:h-28 md:h-40 lg:h-56 w-auto object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
              style={{ maxHeight: 'clamp(5rem, 20vw, 14rem)' }}
            />
          </a>

          {/* NMS Logo - floating center, scales fluidly with proper spacing, bigger */}
          <a href="/" aria-label="Home" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-shrink-0 z-10">
            <img 
              src={nmsLogo} 
              alt="Nicole Marie Severson - eXp Realty Pittsburgh" 
              className="w-24 sm:w-36 md:w-40 lg:w-48 drop-shadow-lg hover:scale-105 transition-transform duration-300 object-contain" 
              style={{ maxWidth: 'clamp(6rem, 18vw, 12rem)' }}
            />
          </a>

          {/* Contact Button - floating right (desktop/tablet) */}
          <nav className="hidden sm:flex items-center flex-shrink-0">
            <button 
              onClick={() => setIsLeadOpen(true)} 
              className="bg-gradient-to-r from-primary to-primary-light text-white py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 hover:from-accent hover:to-accent-light hover:text-primary transition-all duration-300 font-bold text-sm sm:text-base md:text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 border border-accent/20 rounded-lg sm:rounded-xl min-h-[44px]"
            >
              Contact
            </button>
          </nav>

          {/* Mobile Menu Button - proper touch target, smaller icon */}
          <div className="sm:hidden absolute right-3 top-1/2 -translate-y-1/2">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              aria-label="Open navigation menu"
              className="p-3 rounded-lg bg-primary/80 backdrop-blur-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden absolute top-[80px] left-0 right-0 bg-primary/90 backdrop-blur-md shadow-xl">
          <nav className="flex flex-col items-center p-4 space-y-4">
            <button 
              onClick={() => { setIsLeadOpen(true); setIsMenuOpen(false); }} 
              className="bg-accent text-primary py-4 px-8 hover:bg-accent-light transition-all duration-300 font-bold w-full text-center shadow-lg rounded-xl min-h-[44px]"
            >
              Contact
            </button>
          </nav>
        </div>
      )}
      
      <ContactLeadModal isOpen={isLeadOpen} onClose={() => setIsLeadOpen(false)} />
    </header>
  );
};
