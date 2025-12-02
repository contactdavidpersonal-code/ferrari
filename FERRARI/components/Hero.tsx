import React, { useState } from 'react';
import BookingModal from './BookingModal';
import ConsultationModal from './ConsultationModal';
import pittsburghWallpaper from '../assets/pittsburgh wallpaper.jpg';

interface HeroProps {
  onOpenContact?: () => void; // kept for backwards compat but not used
}

type QuickActionType = 'contact' | 'booking';

interface QuickAction {
  key: string;
  label: string;
  icon: string;
  meta: string;
  action: QuickActionType;
  source?: 'Invest' | 'Finance';
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    key: 'buy',
    label: 'Buy',
    icon: '🏠',
    meta: 'Median: $269K (Realtor.com, Aug 2025)',
    action: 'contact',
  },
  {
    key: 'sell',
    label: 'Sell',
    icon: '💼',
    meta: '43 days avg (June 2025)',
    action: 'contact',
  },
  {
    key: 'invest',
    label: 'Invest',
    icon: '🏢',
    meta: '$1,396/mo rent (Q2 2025)',
    action: 'booking',
    source: 'Invest',
  },
  {
    key: 'finance',
    label: 'Finance',
    icon: '💵',
    meta: '5.75% avg rate (Oct 2025)',
    action: 'booking',
    source: 'Finance',
  },
];

export const Hero: React.FC<HeroProps> = () => {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSource, setBookingSource] = useState<'Invest' | 'Finance'>('Invest');
  const [consultationOpen, setConsultationOpen] = useState(false);
  const scrollToProperties = () => {
    const searchSection = document.querySelector('[data-section="custom-search"]');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickActionCardClass =
    'group relative overflow-hidden rounded-[24px] border border-white/50 bg-gradient-to-br from-white/45 via-white/25 to-white/10 backdrop-blur-2xl px-4 sm:px-5 md:px-6 shadow-[0_22px_60px_rgba(0,0,0,0.28)] hover:shadow-[0_34px_85px_rgba(0,0,0,0.38)] transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d6af68]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent';
  const quickActionIconClass =
    'w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/26 text-2xl sm:text-3xl flex items-center justify-center text-primary shadow-inner shadow-white/45';

  const handleQuickAction = (item: QuickAction) => {
    if (item.action === 'contact') {
      setConsultationOpen(true);
      return;
    }

    if (item.source) {
      setBookingSource(item.source);
    }
    setBookingModalOpen(true);
  };

  return (
    <section className="relative bg-white h-screen overflow-hidden flex flex-col">
      {/* Pittsburgh background image - more visible for depth */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.65]"
        style={{
          backgroundImage: `url(${pittsburghWallpaper})`,
          filter: 'grayscale(30%) sepia(8%) hue-rotate(10deg)',
        }}
      />
      
      {/* Subtle dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/45" />
      
      {/* Elegant texture + vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 0% 0%, rgba(255,255,255,0.22), transparent 55%),
            radial-gradient(circle at 100% 100%, rgba(214,175,104,0.38), transparent 55%),
            linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0.40) 55%, rgba(0,0,0,0.80) 100%),
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.30) 1px, transparent 0)
          `,
          backgroundSize: '1100px 1100px, 900px 900px, 100% 100%, 20px 20px',
          mixBlendMode: 'soft-light',
          opacity: 0.95,
        }}
      />
      
      {/* Main Content Area - Compact spacing to fit all elements */}
      <div className="relative z-10 flex-1 flex flex-col pt-[70px] sm:pt-[80px] md:pt-[90px] pb-6 sm:pb-8 md:pb-10">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 flex-1 flex flex-col justify-center">
          <div className="max-w-5xl mx-auto text-center w-full space-y-3.5 sm:space-y-4 md:space-y-5">
            {/* Main Headline - 3 lines with PLACE as center line */}
            <h1
              className="font-serif font-bold text-white leading-tight px-2 drop-shadow-lg tracking-[0.01em] hero-fade-up"
              style={{ fontSize: 'clamp(2.4rem, 7vw, 5.75rem)', animationDelay: '0.05s' }}
            >
              <span className="block text-sm tracking-[0.3em] uppercase font-sans font-semibold text-white/70 mb-2 sm:mb-3">
                Everyone needs a
              </span>
              <span className="block mt-0.5 sm:mt-1 tracking-[0.08em]">PLACE</span>
              <span className="block mt-0.5 sm:mt-1 tracking-[0.02em]">in Pittsburgh</span>
            </h1>
            
            {/* Subheadline - Fluid typography with clamp, smaller */}
            <p
              className="text-white/90 leading-relaxed mx-auto drop-shadow-md font-light hero-fade-up"
              style={{ fontSize: 'clamp(0.85rem, 2.2vw, 1.2rem)', maxWidth: '42rem', animationDelay: '0.15s' }}
            >
              Find your perfect Pittsburgh property with expert guidance from Nicole Marie Severson,
              your trusted eXp Realty advisor for discerning buyers, sellers, and investors across the city.
            </p>

            <div className="flex flex-col items-center gap-2.5 sm:gap-3 hero-fade-up" style={{ animationDelay: '0.25s' }}>
              <button
                onClick={() => setConsultationOpen(true)}
                className="inline-flex items-center justify-center bg-gradient-to-r from-[#d6af68] via-[#c69750] to-[#a87632] text-primary font-semibold tracking-wide rounded-full px-7 sm:px-9 md:px-10 py-2.5 sm:py-3 shadow-[0_12px_38px_rgba(0,0,0,0.35)] hover:scale-[1.02] hover:shadow-[0_18px_45px_rgba(0,0,0,0.4)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#d6af68]/70 focus-visible:ring-offset-transparent"
              >
                Schedule a Private Consultation
              </button>
              <span className="text-white/70 text-xs sm:text-sm">
                Fast response within 1 business day · Bespoke market strategy
              </span>
            </div>
          </div>
          
          {/* Quick Links Grid - Smaller to fit in viewport */}
          <div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3.5 max-w-4xl mx-auto px-2 sm:px-4 mt-4 sm:mt-5 md:mt-6 hero-fade-up"
            style={{ animationDelay: '0.35s' }}
          >
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.key}
                onClick={() => handleQuickAction(action)}
                className={`${quickActionCardClass} py-4 sm:py-5 md:py-6`}
              >
                <span className="absolute inset-x-8 top-0 h-[3px] rounded-b-full bg-gradient-to-r from-transparent via-[#d6af68] to-transparent opacity-85 pointer-events-none" />
                <div className="flex flex-col items-center text-center gap-2">
                  <div className={`${quickActionIconClass} group-hover:scale-105 transition-transform`}>
                    <span>{action.icon}</span>
                  </div>
                  <div
                    className="font-semibold text-white uppercase tracking-[0.2em]"
                    style={{ fontSize: 'clamp(0.7rem, 1.4vw, 0.9rem)' }}
                  >
                    {action.label}
                  </div>
                  <div
                    className="text-white/85 leading-tight px-1 text-xs sm:text-sm font-medium"
                    style={{ fontSize: 'clamp(0.62rem, 1.2vw, 0.8rem)', lineHeight: '1.35' }}
                  >
                    {action.meta}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="mt-4 hero-fade-up" style={{ animationDelay: '0.45s' }}>
          <div className="flex justify-center">
            <button
              onClick={scrollToProperties}
              className="group cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Scroll to properties"
            >
              <svg 
                className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
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

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
      />
    </section>
  );
};

