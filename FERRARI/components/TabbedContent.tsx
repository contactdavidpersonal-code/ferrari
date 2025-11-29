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

  const tabStyles = "py-2.5 sm:py-3 md:py-2 px-3 sm:px-4 md:px-6 font-semibold focus:outline-none transition-all duration-300 w-full md:w-auto border-b-2 relative z-10";
  const activeTabStyles = "text-primary border-primary";
  const inactiveTabStyles = "text-primary border-transparent hover:text-primary";

  return (
    <div>
      {/* Hero Section */}
      <Hero onOpenContact={() => setIsLeadOpen(true)} />

      <div 
        className="bg-white/70 backdrop-blur-xl pt-3 sm:pt-4 md:pt-6 pb-4 sm:pb-5 md:pb-6 sticky top-0 z-30 border-b border-accent/20 rounded-b-2xl sm:rounded-b-3xl"
        style={{
          filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.1)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08))',
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.08), 0 0 60px rgba(0, 0, 0, 0.05), inset 0 0 20px rgba(255, 255, 255, 0.2), 0 4px 20px rgba(0, 0, 0, 0.06)',
        }}
      >
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          {/* Mobile: Dropdown menu */}
          <div className="md:hidden">
            <select
              value={activeTab}
              onChange={handleDropdownChange}
              className="w-full py-3 px-4 font-serif font-semibold text-primary bg-white/90 backdrop-blur-sm border-2 border-accent/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300 min-h-[44px] shadow-md"
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
          <div className="hidden md:flex md:flex-row md:justify-center md:overflow-visible gap-0">
            <button
                onClick={() => handleTabClick('ai')}
                className={`${tabStyles} ${activeTab === 'ai' ? 'text-accent border-accent bg-accent/5' : 'text-primary border-transparent hover:text-accent hover:bg-accent/5'} group font-serif min-h-[44px]`}
                style={{ fontSize: 'clamp(0.75rem, 2vw, 1.125rem)' }}
            >
                <span className="group-hover:scale-105 transition-transform duration-200 whitespace-nowrap">Custom Search</span>
            </button>
            <button
                onClick={() => handleTabClick('commercial')}
                className={`${tabStyles} ${activeTab === 'commercial' ? 'text-accent border-accent bg-accent/5' : 'text-primary border-transparent hover:text-accent hover:bg-accent/5'} group font-serif min-h-[44px]`}
                style={{ fontSize: 'clamp(0.75rem, 2vw, 1.125rem)' }}
            >
                <span className="group-hover:scale-105 transition-transform duration-200 whitespace-nowrap">Commercial & Business</span>
            </button>
            <button
                onClick={() => handleTabClick('residential')}
                className={`${tabStyles} ${activeTab === 'residential' ? 'text-accent border-accent bg-accent/5' : 'text-primary border-transparent hover:text-accent hover:bg-accent/5'} group font-serif min-h-[44px]`}
                style={{ fontSize: 'clamp(0.75rem, 2vw, 1.125rem)' }}
            >
                <span className="group-hover:scale-105 transition-transform duration-200 whitespace-nowrap">Residential</span>
            </button>
            <button
                onClick={() => handleTabClick('land')}
                className={`${tabStyles} ${activeTab === 'land' ? 'text-accent border-accent bg-accent/5' : 'text-primary border-transparent hover:text-accent hover:bg-accent/5'} group font-serif min-h-[44px]`}
                style={{ fontSize: 'clamp(0.75rem, 2vw, 1.125rem)' }}
            >
                <span className="group-hover:scale-105 transition-transform duration-200 whitespace-nowrap">Land</span>
            </button>
            <button
                onClick={() => handleTabClick('rentals')}
                className={`${tabStyles} ${activeTab === 'rentals' ? 'text-accent border-accent bg-accent/5' : 'text-primary border-transparent hover:text-accent hover:bg-accent/5'} group font-serif min-h-[44px]`}
                style={{ fontSize: 'clamp(0.75rem, 2vw, 1.125rem)' }}
            >
                <span className="group-hover:scale-105 transition-transform duration-200 whitespace-nowrap">Rentals</span>
            </button>
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