import React, { useState, useEffect } from 'react';
import { FEATURED_LISTINGS } from '../constants';
import { PropertyCard } from './ListingCard';
import { PropertyQuickViewModal } from './PropertyQuickViewModal';
import { propertiesService } from '../lib/jsonbinService';
import { Listing } from '../types';

// Get all properties from Supabase (fallback to localStorage handled in service)
// Force save to fix import issue - CACHE BUST v2
const getAllProperties = async (): Promise<Listing[]> => {
  try {
    // Prefer server Neon source
    const res = await fetch('/api/listings').catch(err => {
      console.log('📍 Listings API not available (development mode)');
      return { ok: false } as Response;
    });
    if (res.ok){
      const data = await res.json();
      const mapped: Listing[] = (data.listings||[]).map((r:any)=>({
        id: r.id,
        address: r.address,
        city: r.city,
        state: r.state,
        zipCode: r.zip,
        price: Number(r.price)||0,
        type: r.type,
        sqft: Number(r.sqft)||0,
        beds: r.beds||0,
        baths: r.baths||0,
        lotSize: r.lot_acres,
        yearBuilt: r.year_built,
        images: r.images||[],
        videos: r.videos||[],
        listingDate: r.listing_date,
        lastUpdated: r.listing_date,
        status: r.status
      }));
      return mapped;
    }
    const all = await propertiesService.getAll();
    console.log('🏠 FeaturedListings - Database all:', all.length, 'properties');
    return all;
  } catch (error) {
    // Silently fallback to local data
    const savedProperties = localStorage.getItem('managedProperties');
    if (savedProperties) {
      const parsed = JSON.parse(savedProperties);
      console.log('🏠 FeaturedListings - Fallback to localStorage all:', parsed.length, 'properties');
      return parsed;
    }
    return [];
  }
};

const residentialData = [
    {
        statistic: '$254,724',
        category: 'Median Home Price',
        description: 'Pittsburgh median home price as of June 2025, up 5% from previous year - perfect entry point before AI boom.',
        source: 'Rocket Homes',
        sourceUrl: 'https://rocket.com/homes/market-reports/pa/pittsburgh'
    },
    {
        statistic: '105%',
        category: 'Decade Appreciation',
        description: 'Home values have appreciated 105% over past decade with 7.44% annual average - consistent growth.',
        source: 'NeighborhoodScout',
        sourceUrl: 'https://www.neighborhoodscout.com/pa/pittsburgh/real-estate'
    },
    {
        statistic: '27,200+',
        category: 'New Residents',
        description: 'Allegheny County added 27,200+ residents over past decade - first population growth in 60 years.',
        source: 'House in City',
        sourceUrl: 'https://www.houseincity.com/pittsburgh-real-estate-market/'
    },
    {
        statistic: '76.03%',
        category: 'High Equity Properties',
        description: 'Percentage of Pittsburgh properties with 50%+ equity - redevelopment and investment opportunities.',
        source: 'Property Focus',
        sourceUrl: 'https://www.propertyfocus.com/trends/city/pa/pittsburgh'
    },
];

export const ResidentialListings: React.FC = () => {
    const [properties, setProperties] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [quickViewListing, setQuickViewListing] = useState<Listing | null>(null);

    const handleOpenQuickView = (listing: Listing) => {
        console.log('FeaturedListings: Opening quick view for:', listing.address);
        setQuickViewListing(listing);
    };

  useEffect(() => {
    const loadProperties = async () => {
      try {
        console.log('🏠 FeaturedListings - Loading properties...');
        const allProps = await getAllProperties();
        const filteredProperties = allProps.filter((prop: Listing) => prop.type === 'Residential');
        setProperties(filteredProperties);
        console.log(`🏠 FeaturedListings - Loaded ${filteredProperties.length} properties`);
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
      console.log('🏠 FeaturedListings - Received properties update event, refreshing...');
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

    const residentialProperties = properties.slice(0, 6);

    // Card styling matching hero quick-action cards
    const statCardClass =
      'group relative overflow-hidden rounded-[24px] border border-white/50 bg-gradient-to-br from-white/45 via-white/25 to-white/10 backdrop-blur-2xl p-6 shadow-[0_22px_60px_rgba(0,0,0,0.18)] hover:shadow-[0_34px_85px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1.5 text-center';

    return (
        <>
            {/* Residential Statistics Section */}
            <section id="residential-stats" className="relative pt-0 pb-20 overflow-hidden">
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
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-lg">Did You Know this about Pittsburgh Residential?</h2>
                        <p className="text-center text-white/80 max-w-3xl mx-auto mt-4 text-lg">
                            Why Pittsburgh's residential and land market offers the perfect opportunity for homeownership and investment.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {residentialData.map((item, index) => (
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

            {/* Residential Properties Section */}
            <section id="residential-properties" className="py-16 bg-white">
                <div className="container mx-auto px-3 sm:px-4 md:px-6">
                    <div
                      className="bg-white/95 backdrop-blur-sm border border-accent/20 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl"
                      style={{
                        filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.066)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.044))',
                        boxShadow: '0 0 30px rgba(0, 0, 0, 0.056), 0 0 60px rgba(0, 0, 0, 0.034), inset 0 0 20px rgba(255, 255, 255, 0.088), 0 4px 20px rgba(0, 0, 0, 0.044)',
                      }}
                    >
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-primary mb-3">Residential & Land Opportunities</h2>
                        <p className="text-center text-charcoal-light max-w-3xl mx-auto mb-4 text-base leading-relaxed">
                            With Pittsburgh's population growing for the first time in 60 years and <span className="font-bold text-gold">105% home appreciation</span> over the past decade, 
                            these residential homes and development land opportunities offer the perfect entry point before the AI boom drives prices even higher.
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
                            {residentialProperties.map((listing) => (
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
            {console.log('FeaturedListings: Rendering modal with listing:', quickViewListing?.address, 'isOpen:', !!quickViewListing)}
            <PropertyQuickViewModal
                listing={quickViewListing}
                isOpen={!!quickViewListing}
                onClose={() => {
                    console.log('FeaturedListings: Closing modal');
                    setQuickViewListing(null);
                }}
            />
        </>
    );
};