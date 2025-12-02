import React, { useState, useEffect } from 'react';
import { propertiesService } from '../lib/jsonbinService';
import { Listing } from '../types';
import { PropertyCard } from './ListingCard';
import { PropertyQuickViewModal } from './PropertyQuickViewModal';

const rentalData = [
    {
        statistic: '$1,450',
        category: 'Average Monthly Rent',
        description: 'Pittsburgh average rent is $1,450/month, 35% below national average - exceptional rental yield potential.',
        source: 'RentCafe',
        sourceUrl: 'https://www.rentcafe.com/average-rent-market-trends/us/pa/pittsburgh/'
    },
    {
        statistic: '4.2%',
        category: 'Vacancy Rate',
        description: 'Low 4.2% vacancy rate indicates strong rental demand and consistent tenant occupancy across Pittsburgh.',
        source: 'Apartment List',
        sourceUrl: 'https://www.apartmentlist.com/rentonomics/vacancy-index/'
    },
    {
        statistic: '8.5%',
        category: 'Rental Yield',
        description: 'Average rental yield of 8.5% in Pittsburgh markets, significantly above national average of 6.2%.',
        source: 'RealtyMole',
        sourceUrl: 'https://www.realtymole.com/rental-data'
    },
    {
        statistic: '15%',
        category: 'Rent Growth',
        description: 'Rental rates increased 15% over past 2 years, driven by population growth and limited new construction.',
        source: 'Zillow Research',
        sourceUrl: 'https://www.zillow.com/research/'
    },
];

export const RentalListings: React.FC = () => {
  const [properties, setProperties] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewListing, setQuickViewListing] = useState<Listing | null>(null);

  const getRentalProperties = async () => {
    try {
      const allProperties = await propertiesService.getAll();
      console.log('🏠 RentalListings - Database all:', allProperties.length, 'properties');
      // Filter for rental properties only
      const rentalProperties = allProperties.filter(property => property.type === 'Rentals');
      setProperties(rentalProperties);
    } catch (error) {
      console.error('Error loading properties from database:', error);
      // Fallback to localStorage
      const savedProperties = localStorage.getItem('managedProperties');
      if (savedProperties) {
        const parsed = JSON.parse(savedProperties);
        console.log('🏠 RentalListings - Fallback to localStorage all:', parsed.length, 'properties');
        const rentalProperties = parsed.filter((property: Listing) => property.type === 'Rentals');
        setProperties(rentalProperties);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRentalProperties();

    // Listen for property updates
    const handlePropertiesUpdate = () => getRentalProperties();
    window.addEventListener('propertiesUpdated', handlePropertiesUpdate);
    
    // Refresh every 30 seconds
    const interval = setInterval(getRentalProperties, 30000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('propertiesUpdated', handlePropertiesUpdate);
    };
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cabernet mx-auto"></div>
          <p className="mt-4 text-charcoal-light">Loading rental properties...</p>
        </div>
      </div>
    );
  }

  // Card styling matching hero quick-action cards
  const statCardClass =
    'group relative overflow-hidden rounded-[24px] border border-white/50 bg-gradient-to-br from-white/45 via-white/25 to-white/10 backdrop-blur-2xl p-6 shadow-[0_22px_60px_rgba(0,0,0,0.18)] hover:shadow-[0_34px_85px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1.5 text-center';

  return (
    <>
      {/* Rental Statistics Section */}
      <section id="rental-stats" className="relative pt-0 pb-20 overflow-hidden">
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
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-lg">Did You Know this about Pittsburgh Rentals?</h2>
            <p className="text-center text-white/80 max-w-3xl mx-auto mt-4 text-lg">
              Why Pittsburgh's rental market offers exceptional opportunities for steady income and long-term appreciation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rentalData.map((item, index) => (
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

      {/* Rental Properties Section */}
      <section id="rental-properties" className="py-16 bg-white">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <div
            className="bg-white/95 backdrop-blur-sm border border-accent/20 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl"
            style={{
              filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.066)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.044))',
              boxShadow: '0 0 30px rgba(0, 0, 0, 0.056), 0 0 60px rgba(0, 0, 0, 0.034), inset 0 0 20px rgba(255, 255, 255, 0.088), 0 4px 20px rgba(0, 0, 0, 0.044)',
            }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-primary mb-3">Rental Investment Opportunities</h2>
            <p className="text-center text-charcoal-light max-w-3xl mx-auto mb-4 text-base leading-relaxed">
              With <span className="font-bold text-gold">8.5% rental yields</span> and only 4.2% vacancy rates, 
              these rental properties offer exceptional cash flow potential in Pittsburgh's growing market.
            </p>

            {/* Disclosure banner */}
            <div className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-900 shadow-sm mb-6">
              <p className="font-semibold mb-1">Live listings coming soon</p>
              <p>
                Current properties are sample data while the IDX/MLS feed is finalized. Feel free to browse the experience,
                reach out to Nicole for real inventory, or explore the rest of the site in the meantime.
              </p>
            </div>

            {properties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property) => (
                  <div 
                    key={property.id} 
                    className="transform transition-all duration-300 hover:scale-[1.03] h-full relative overflow-visible"
                    style={{
                      filter: 'drop-shadow(0 6px 20px rgba(0, 0, 0, 0.15)) drop-shadow(0 3px 10px rgba(0, 0, 0, 0.1))',
                    }}
                  >
                    <PropertyCard listing={property} onOpenQuickView={setQuickViewListing} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">No Rental Properties Available</h3>
                <p className="text-charcoal-light">Check back soon for new rental opportunities in Pittsburgh.</p>
              </div>
            )}
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
