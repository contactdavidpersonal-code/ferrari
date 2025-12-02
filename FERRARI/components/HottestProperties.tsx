import React, { useState, useEffect } from 'react';
import { INVESTOR_LISTINGS } from '../constants';
import { PropertyCard } from './ListingCard';
import { PropertyQuickViewModal } from './PropertyQuickViewModal';
import { propertiesService } from '../lib/jsonbinService';
import { Listing } from '../types';

const commercialData = [
    {
        statistic: '$2.1 Billion',
        category: 'Federal AI Investment',
        description: 'Pittsburgh received $2.1 billion in federal funding for AI and robotics research, driving unprecedented commercial real estate demand.',
        source: 'Pittsburgh Business Times',
        sourceUrl: 'https://www.bizjournals.com/pittsburgh/news/2024/01/15/federal-ai-investment-pittsburgh.html'
    },
    {
        statistic: '40%+',
        category: 'Projected Asset Growth',
        description: 'Commercial real estate values projected to increase 40%+ over next decade as tech companies expand operations.',
        source: 'CBRE Market Research',
        sourceUrl: 'https://www.cbre.com/insights/reports/us-real-estate-market-outlook-2024'
    },
    {
        statistic: '85%',
        category: 'Office Occupancy Rate',
        description: 'Downtown Pittsburgh office occupancy at 85% with strong demand for Class A and tech-ready spaces.',
        source: 'Colliers International',
        sourceUrl: 'https://www.colliers.com/en/research/us/pittsburgh-office-market-report'
    },
    {
        statistic: '150+',
        category: 'New Tech Companies',
        description: 'Over 150 new tech companies established in Pittsburgh in 2024, driving commercial space demand.',
        source: 'Innovation Works',
        sourceUrl: 'https://www.innovationworks.org/pittsburgh-tech-growth-2024'
    },
];

// Get managed properties from Supabase only - no fallback to constants
const getManagedProperties = async (): Promise<Listing[]> => {
  try {
    const supabaseProperties = await propertiesService.getAll();
    console.log('🔥 HottestProperties - Database returned:', supabaseProperties.length, 'properties');
    return supabaseProperties; // Always return what Supabase has, even if empty
  } catch (error) {
    console.error('Error loading properties from database:', error);
    // Only fallback to localStorage if Supabase completely fails
    const savedProperties = localStorage.getItem('managedProperties');
    if (savedProperties) {
      const parsed = JSON.parse(savedProperties);
      console.log('🔥 HottestProperties - Fallback to localStorage:', parsed.length, 'properties');
      return parsed;
    }
    console.log('🔥 HottestProperties - No properties found, returning empty array');
    return []; // Return empty array instead of constants
  }
};


export const HottestProperties: React.FC = () => {
  const [properties, setProperties] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewListing, setQuickViewListing] = useState<Listing | null>(null);

  const handleOpenQuickView = (listing: Listing) => {
    console.log('HottestProperties: Opening quick view for:', listing.address);
    setQuickViewListing(listing);
  };

  useEffect(() => {
    const loadProperties = async () => {
      try {
        console.log('🔥 HottestProperties - Loading properties...');
        const allManagedProperties = await getManagedProperties();
        // Only show Commercial & Land opportunities in the Commercial & Business tab
        const filteredProperties = allManagedProperties.filter((prop: Listing) => 
          (prop.type === 'Commercial' || prop.type === 'Land') && prop.status === 'Active'
        ).slice(0, 8);
        setProperties(filteredProperties);
        console.log(`🔥 HottestProperties - Loaded ${filteredProperties.length} properties`);
      } catch (error) {
        console.error('Error loading properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
    
    // Listen for global property update events from admin
    const handlePropertiesUpdate = () => {
      console.log('🔥 HottestProperties - Received properties update event, refreshing...');
      loadProperties();
    };
    
    window.addEventListener('propertiesUpdated', handlePropertiesUpdate);
    
    // Refresh properties every 30 seconds to pick up admin changes
    const interval = setInterval(loadProperties, 30000);
    
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
      {/* Commercial Statistics Section */}
      <section id="commercial-stats" className="relative pt-32 pb-20 overflow-hidden">
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

        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-lg">Did You Know this about Pittsburgh Commercial?</h2>
            <p className="text-center text-white/80 max-w-3xl mx-auto mt-4 text-lg">
              Why Pittsburgh's commercial real estate market offers the perfect opportunity for investors and businesses.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commercialData.map((item, index) => (
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

      {/* Hottest Properties Section */}
      <section id="hottest" className="py-16 bg-white">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <div
            className="bg-white/95 backdrop-blur-sm border border-accent/20 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl"
            style={{
              filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.066)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.044))',
              boxShadow: '0 0 30px rgba(0, 0, 0, 0.056), 0 0 60px rgba(0, 0, 0, 0.034), inset 0 0 20px rgba(255, 255, 255, 0.088), 0 4px 20px rgba(0, 0, 0, 0.044)',
            }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-primary mb-3">Properties Attracting the Most Attention</h2>
            <p className="text-center text-charcoal-light max-w-3xl mx-auto mb-4 text-base">
            These prime commercial properties and development land are currently generating the most interest from savvy investors and developers. Explore them before they're gone.
          </p>

            {/* Disclosure banner */}
            <div className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-900 shadow-sm mb-6">
              <p className="font-semibold mb-1">Live listings coming soon</p>
              <p>
                Current properties are sample data while the IDX/MLS feed is finalized. Feel free to browse the experience,
                reach out to Nicole for real inventory, or explore the rest of the site in the meantime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                  {properties.map((listing) => (
                <div 
                  key={listing.id} 
                  className="transform transition-all duration-300 hover:scale-[1.03] h-full relative overflow-visible"
                  style={{
                    filter: 'drop-shadow(0 6px 20px rgba(0, 0, 0, 0.15)) drop-shadow(0 3px 10px rgba(0, 0, 0, 0.1))',
                  }}
                >
                    <PropertyCard 
                      listing={listing} 
                      onOpenQuickView={handleOpenQuickView}
                    />
                </div>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {console.log('HottestProperties: Rendering modal with listing:', quickViewListing?.address, 'isOpen:', !!quickViewListing)}
      <PropertyQuickViewModal
        listing={quickViewListing}
        isOpen={!!quickViewListing}
        onClose={() => {
          console.log('HottestProperties: Closing modal');
          setQuickViewListing(null);
        }}
      />
    </>
  );
};