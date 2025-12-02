import React, { useState, useEffect } from 'react';
import { HottestProperties } from './HottestProperties';
import { Timeline } from './Timeline';
import { InvestorListings } from './InvestorListings';
import { InvestmentReasons } from './InvestmentReasons';
import { ResidentialListings } from './FeaturedListings';
import { LandListings } from './LandListings';
import { RentalListings } from './RentalListings';
import AISearch from './AISearch';
import { Hero } from './Hero';
import ContactLeadModal from './ContactLeadModal';
import pittsburghWallpaper from '../assets/pittsburgh wallpaper.jpg';

type Tab = 'commercial' | 'residential' | 'land' | 'rentals' | 'ai';

export const TabbedContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('ai');
  const [isLeadOpen, setIsLeadOpen] = useState(false);

  // Fix: Add useEffect to sync the active tab with the URL hash.
  // This allows navigation from the header to control which tab is displayed.
  useEffect(() => {
    const openContact = () => setIsLeadOpen(true);
    window.addEventListener('openContactLeadModal', openContact as EventListener);

    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      console.log('Hash changed to:', hash);
      if (hash === 'commercial' || hash === 'residential' || hash === 'land' || hash === 'rentals' || hash === 'ai') {
        console.log('Setting active tab to:', hash);
        setActiveTab(hash as Tab);
      } else if (hash === '') {
        console.log('Empty hash, setting to ai');
        setActiveTab('ai');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Call handler on initial load to sync with any existing hash in the URL
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('openContactLeadModal', openContact as EventListener);
    };
  }, []);

  // Simplified tab click handler - directly set state
  const handleTabClick = (tab: Tab) => {
    console.log('Tab clicked:', tab);
    setActiveTab(tab);
    window.location.hash = tab;
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tab = e.target.value as Tab;
    handleTabClick(tab);
  };

  const tabLabels: Record<Tab, string> = {
    'ai': 'Custom Search',
    'commercial': 'Commercial & Business',
    'residential': 'Residential',
    'land': 'Land',
    'rentals': 'Rentals'
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero onOpenContact={() => setIsLeadOpen(true)} />

      <div 
        className="relative bg-gradient-to-b from-white/95 via-white/90 to-white/85 backdrop-blur-2xl pt-4 sm:pt-5 md:pt-6 pb-4 sm:pb-5 md:pb-6 sticky top-0 z-30 border-b border-accent/30 rounded-b-2xl sm:rounded-b-3xl overflow-hidden"
        style={{
          filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.12)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))',
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.1), 0 0 80px rgba(0, 0, 0, 0.06), inset 0 0 30px rgba(255, 255, 255, 0.3), 0 4px 25px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d6af68] to-transparent opacity-60"></div>
        
        <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
          {/* Mobile: Dropdown menu */}
          <div className="md:hidden">
            <select
              value={activeTab}
              onChange={handleDropdownChange}
              className="w-full py-3 px-4 font-serif font-semibold text-primary bg-white/95 backdrop-blur-md border-2 border-accent/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300 min-h-[44px] shadow-lg hover:shadow-xl"
              style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
            >
              <option value="ai">Custom Search</option>
              <option value="commercial">Commercial & Business</option>
              <option value="residential">Residential</option>
              <option value="land">Land</option>
              <option value="rentals">Rentals</option>
            </select>
          </div>

          {/* Desktop: Tab buttons */}
          <div className="hidden md:flex md:flex-row md:justify-center md:items-center md:overflow-visible gap-1">
            {(['ai', 'commercial', 'residential', 'land', 'rentals'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`
                  relative px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 font-serif font-semibold 
                  min-h-[44px] rounded-xl transition-all duration-300
                  ${activeTab === tab 
                    ? 'text-primary bg-gradient-to-br from-[#d6af68]/15 via-[#d6af68]/10 to-[#d6af68]/5 border-2 border-[#d6af68]/40 shadow-lg' 
                    : 'text-primary/70 border-2 border-transparent hover:text-primary hover:bg-white/50 hover:border-accent/20 hover:shadow-md'
                  }
                  group
                `}
                style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1.05rem)' }}
              >
                {activeTab === tab && (
                  <span className="absolute inset-x-4 top-0 h-[3px] rounded-b-full bg-gradient-to-r from-transparent via-[#d6af68] to-transparent opacity-80"></span>
                )}
                <span className="relative z-10 group-hover:scale-105 transition-transform duration-200 whitespace-nowrap">
                  {tabLabels[tab]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        {activeTab === 'commercial' && (
          <>
            <HottestProperties />
            <InvestorListings />
          </>
        )}
        {activeTab === 'residential' && (
          <>
            <ResidentialListings />
          </>
        )}
        {activeTab === 'land' && (
          <>
            <LandListings />
          </>
        )}
        {activeTab === 'rentals' && (
          <>
            <RentalListings />
          </>
        )}
        {activeTab === 'ai' && (
          <>
            <AISearch />
          </>
        )}
      </div>
      <ContactLeadModal isOpen={isLeadOpen} onClose={() => setIsLeadOpen(false)} />
    </div>
  );
};