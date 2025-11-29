import React, { useState } from 'react';
import { MortgageRates } from './MortgageRates';
import BookingModal from './BookingModal';
import pittsburghWallpaper from '../assets/pittsburgh wallpaper.jpg';

interface HeroProps {
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact }) => {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSource, setBookingSource] = useState<'Invest' | 'Finance'>('Invest');
  const scrollToProperties = () => {
    const searchSection = document.querySelector('[data-section="custom-search"]');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-white h-screen overflow-hidden flex flex-col">
      {/* Pittsburgh background image - subtle color */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.4]"
        style={{
          backgroundImage: `url(${pittsburghWallpaper})`,
          filter: 'grayscale(40%) sepia(10%) hue-rotate(15deg)',
        }}
      />
      
      {/* Subtle dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/25"></div>
      
      {/* Subtle background pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}></div>
      </div>
      
      {/* Main Content Area - Compact spacing to fit all elements */}
      <div className="relative z-10 container mx-auto px-3 sm:px-4 md:px-6 flex-1 flex flex-col justify-center pt-[80px] sm:pt-[90px] md:pt-[100px] pb-8 sm:pb-10 md:pb-12">
        <div className="max-w-4xl mx-auto text-center w-full">
          {/* Main Headline - 3 lines with PLACE as center line */}
          <h1 className="font-bold text-primary mb-2 sm:mb-3 md:mb-4 leading-tight px-2" style={{ fontSize: 'clamp(1.75rem, 6vw, 4.5rem)' }}>
            Everyone needs a
            <span className="block mt-0.5 sm:mt-1">PLACE</span>
            <span className="block mt-0.5 sm:mt-1">in Pittsburgh</span>
          </h1>
          
          {/* Subheadline - Fluid typography with clamp, smaller */}
          <p className="text-black mb-2 sm:mb-3 max-w-2xl mx-auto leading-relaxed px-4" style={{ fontSize: 'clamp(0.75rem, 2vw, 1.125rem)' }}>
            Find your perfect Pittsburgh property with expert guidance from Nicole Marie Severson, your trusted eXp Realty agent.
          </p>
          
          {/* CTA Buttons - Fluid sizing with proper touch targets, smaller */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center mb-2 sm:mb-3 px-4">
            <button
              onClick={scrollToProperties}
              className="w-full sm:w-auto bg-primary text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 font-semibold hover:bg-primary/90 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 min-h-[44px]"
              style={{ fontSize: 'clamp(0.8125rem, 1.8vw, 1rem)' }}
            >
              Find a Home
            </button>
            <button
              onClick={onOpenContact}
              className="w-full sm:w-auto bg-white text-primary border-2 border-primary px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 font-semibold hover:bg-primary hover:text-white transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 min-h-[44px]"
              style={{ fontSize: 'clamp(0.8125rem, 1.8vw, 1rem)' }}
            >
              Sell Your Home
            </button>
          </div>
          
          {/* Quick Links Grid - Smaller to fit in viewport */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3 max-w-3xl mx-auto px-2 sm:px-4 mb-2 sm:mb-2.5">
            <button
              onClick={onOpenContact}
              className="p-2 sm:p-2.5 md:p-3 bg-white/90 backdrop-blur-sm rounded-lg border-2 border-white/50 shadow-lg hover:bg-white hover:border-accent/80 hover:shadow-[0_0_25px_rgba(107,78,15,0.5)] transition-all duration-300 group cursor-pointer hover:-translate-y-1 active:scale-95 min-h-[55px] sm:min-h-[60px] md:min-h-[65px]"
            >
              <div className="text-xl sm:text-xl md:text-2xl mb-1 group-hover:scale-110 transition-transform" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}>🏠</div>
              <div className="font-bold text-primary mb-0.5 text-xs" style={{ fontSize: 'clamp(0.75rem, 1.6vw, 0.875rem)' }}>Buy</div>
              <div className="text-gray-600 leading-tight px-0.5" style={{ fontSize: 'clamp(0.6rem, 1.1vw, 0.7rem)', lineHeight: '1.25' }}>
                Median: $269K (Realtor.com, Aug 2025)
              </div>
            </button>
            <button
              onClick={onOpenContact}
              className="p-2 sm:p-2.5 md:p-3 bg-white/90 backdrop-blur-sm rounded-lg border-2 border-white/50 shadow-lg hover:bg-white hover:border-accent/80 hover:shadow-[0_0_25px_rgba(107,78,15,0.5)] transition-all duration-300 group cursor-pointer hover:-translate-y-1 active:scale-95 min-h-[55px] sm:min-h-[60px] md:min-h-[65px]"
            >
              <div className="text-xl sm:text-xl md:text-2xl mb-1 group-hover:scale-110 transition-transform" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}>💼</div>
              <div className="font-bold text-primary mb-0.5 text-xs" style={{ fontSize: 'clamp(0.75rem, 1.6vw, 0.875rem)' }}>Sell</div>
              <div className="text-gray-600 leading-tight px-0.5" style={{ fontSize: 'clamp(0.6rem, 1.1vw, 0.7rem)', lineHeight: '1.25' }}>
                43 days avg (June 2025)
              </div>
            </button>
            <button
              onClick={() => {
                setBookingSource('Invest');
                setBookingModalOpen(true);
              }}
              className="p-2 sm:p-2.5 md:p-3 bg-white/90 backdrop-blur-sm rounded-lg border-2 border-white/50 shadow-lg hover:bg-white hover:border-accent/80 hover:shadow-[0_0_25px_rgba(107,78,15,0.5)] transition-all duration-300 group cursor-pointer hover:-translate-y-1 active:scale-95 min-h-[55px] sm:min-h-[60px] md:min-h-[65px]"
            >
              <div className="text-xl sm:text-xl md:text-2xl mb-1 group-hover:scale-110 transition-transform" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}>🏢</div>
              <div className="font-bold text-primary mb-0.5 text-xs" style={{ fontSize: 'clamp(0.75rem, 1.6vw, 0.875rem)' }}>Invest</div>
              <div className="text-gray-600 leading-tight px-0.5" style={{ fontSize: 'clamp(0.6rem, 1.1vw, 0.7rem)', lineHeight: '1.25' }}>
                $1,396/mo rent (Q2 2025)
              </div>
            </button>
            <button
              onClick={() => {
                setBookingSource('Finance');
                setBookingModalOpen(true);
              }}
              className="p-2 sm:p-2.5 md:p-3 bg-white/90 backdrop-blur-sm rounded-lg border-2 border-white/50 shadow-lg hover:bg-white hover:border-accent/80 hover:shadow-[0_0_25px_rgba(107,78,15,0.5)] transition-all duration-300 group cursor-pointer hover:-translate-y-1 active:scale-95 min-h-[55px] sm:min-h-[60px] md:min-h-[65px]"
            >
              <div className="text-xl sm:text-xl md:text-2xl mb-1 group-hover:scale-110 transition-transform" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}>💵</div>
              <div className="font-bold text-primary mb-0.5 text-xs" style={{ fontSize: 'clamp(0.75rem, 1.6vw, 0.875rem)' }}>Finance</div>
              <div className="text-gray-600 leading-tight px-0.5" style={{ fontSize: 'clamp(0.6rem, 1.1vw, 0.7rem)', lineHeight: '1.25' }}>
                5.75% avg rate (Oct 2025)
              </div>
            </button>
          </div>
        </div>
        
        {/* Mortgage Rates - Below the 4 cards with compact spacing */}
        <div className="mt-1.5 sm:mt-2">
          <MortgageRates />
          
          {/* Professional Down Arrow - Below mortgage rates, same on mobile and web */}
          <div className="flex justify-center mt-2 sm:mt-2.5">
            <button
              onClick={scrollToProperties}
              className="group cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Scroll to properties"
            >
              <svg 
                className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 text-accent group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                style={{
                  animation: 'float 3s ease-in-out infinite'
                }}
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Booking Modal */}
      <BookingModal 
        isOpen={bookingModalOpen} 
        onClose={() => setBookingModalOpen(false)}
        source={bookingSource}
      />
    </section>
  );
};

