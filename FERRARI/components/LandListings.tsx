import React, { useEffect, useState } from 'react';
import { propertiesService } from '../lib/jsonbinService';
import { Listing } from '../types';
import { PropertyCard } from './ListingCard';
import { PropertyQuickViewModal } from './PropertyQuickViewModal';

const landData = [
    {
        statistic: '$45,000',
        category: 'Average Land Price/Acre',
        description: 'Pittsburgh land prices average $45,000 per acre, significantly below national average - prime development opportunity.',
        source: 'LandHub',
        sourceUrl: 'https://www.landhub.com/land-for-sale/pennsylvania/pittsburgh/'
    },
    {
        statistic: '12.5%',
        category: 'Land Development Growth',
        description: 'Land development projects increased 12.5% in 2024, driven by population growth and infrastructure investment.',
        source: 'Pittsburgh Business Times',
        sourceUrl: 'https://www.bizjournals.com/pittsburgh/'
    },
    {
        statistic: '85%',
        category: 'Zoning Flexibility',
        description: '85% of available land parcels offer flexible zoning options for mixed-use development and adaptive reuse.',
        source: 'City of Pittsburgh Planning',
        sourceUrl: 'https://pittsburghpa.gov/planning/'
    },
    {
        statistic: '3.2x',
        category: 'ROI Potential',
        description: 'Land investments in Pittsburgh show 3.2x average return potential over 5-year development cycles.',
        source: 'Real Estate Investment Network',
        sourceUrl: 'https://www.rein.com/'
    },
];

export const LandListings: React.FC = () => {
  const [properties, setProperties] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewListing, setQuickViewListing] = useState<Listing | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const allProps = await propertiesService.getAll();
        const land = allProps.filter((p: Listing) => p.type === 'Land');
        setProperties(land);
      } finally {
        setLoading(false);
      }
    };

    load();

    const handlePropertiesUpdate = () => load();
    window.addEventListener('propertiesUpdated', handlePropertiesUpdate);
    const interval = setInterval(load, 30000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('propertiesUpdated', handlePropertiesUpdate);
    };
  }, []);

  // Card styling matching hero quick-action cards
  const statCardClass =
    'group relative overflow-hidden rounded-[24px] border border-white/50 bg-gradient-to-br from-white/45 via-white/25 to-white/10 backdrop-blur-2xl p-6 shadow-[0_22px_60px_rgba(0,0,0,0.18)] hover:shadow-[0_34px_85px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1.5 text-center';

  return (
    <>
      {/* Land Statistics Section */}
      <section id="land-stats" className="relative pt-0 pb-20 overflow-hidden">
        {/* Onyx black background */}
        <div className="absolute inset-0 bg-[#0f0f0f]" />
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 0% 0%, rgba(255,255,255,0.06), transparent 50%),
              radial-gradient(circle at 100% 100%, rgba(214,175,104,0.12), transparent 50%),
              radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)
            `,
            backgroundSize: '900px 900px, 700px 700px, 20px 20px',
            opacity: 1,
          }}
        />

        <div className="relative z-10 container mx-auto px-6 pt-12 sm:pt-16 md:pt-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-lg">Did You Know this about Pittsburgh Land Development?</h2>
            <p className="text-center text-white/80 max-w-3xl mx-auto mt-4 text-lg">
              Why Pittsburgh's land market offers exceptional opportunities for development and investment growth.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {landData.map((item, index) => (
              <div key={index} className={statCardClass}>
                {/* Gold accent bar */}
                <span className="absolute inset-x-8 top-0 h-[3px] rounded-b-full bg-gradient-to-r from-transparent via-[#d6af68] to-transparent opacity-85 pointer-events-none" />

                {/* Statistic */}
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-md">
                  {item.statistic}
                </div>
                
                {/* Category */}
                <div className="text-sm font-semibold text-white uppercase tracking-[0.18em] mb-3">
                  {item.category}
                </div>
                
                {/* Description */}
                <div className="text-sm text-white/85 mb-4 leading-relaxed">
                  {item.description}
                </div>
                
                {/* Source Link */}
                <div className="text-xs">
                  <span className="text-white/60">Source: </span>
                  <a 
                    href={item.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#d6af68] hover:text-[#e8c77b] underline font-medium transition-colors"
                  >
                    {item.source}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Land Properties Section */}
      <section id="land-properties" className="py-16 bg-white">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <div
            className="bg-white/95 backdrop-blur-sm border border-accent/20 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl"
            style={{
              filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.066)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.044))',
              boxShadow: '0 0 30px rgba(0, 0, 0, 0.056), 0 0 60px rgba(0, 0, 0, 0.034), inset 0 0 20px rgba(255, 255, 255, 0.088), 0 4px 20px rgba(0, 0, 0, 0.044)',
            }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-primary mb-3">Land & Development Opportunities</h2>
            <p className="text-center text-charcoal-light max-w-3xl mx-auto mb-4 text-base leading-relaxed">
              With <span className="font-bold text-gold">12.5% growth in development projects</span> and flexible zoning on 85% of parcels, 
              these land opportunities offer prime positioning for Pittsburgh's continued expansion and AI-driven economic boom.
            </p>

            {/* Disclosure banner */}
            <div className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-900 shadow-sm mb-6">
              <p className="font-semibold mb-1">Live listings coming soon</p>
              <p>
                Current properties are sample data while the IDX/MLS feed is finalized. Feel free to browse the experience,
                reach out to Nicole for real inventory, or explore the rest of the site in the meantime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties.map((listing) => (
                <div 
                  key={listing.id} 
                  className="transform transition-all duration-300 hover:scale-[1.03] h-full relative overflow-visible"
                  style={{
                    filter: 'drop-shadow(0 6px 20px rgba(0, 0, 0, 0.15)) drop-shadow(0 3px 10px rgba(0, 0, 0, 0.1))',
                  }}
                >
                  <PropertyCard listing={listing} onOpenQuickView={setQuickViewListing} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <PropertyQuickViewModal
        listing={quickViewListing}
        isOpen={!!quickViewListing}
        onClose={() => setQuickViewListing(null)}
      />
    </>
  );
};


