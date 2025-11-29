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

  return (
    <>
      {/* Rental Statistics Section */}
      <section id="rental-stats" className="pt-32 pb-20 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-cabernet">Did You Know this about Pittsburgh Rentals?</h2>
            <p className="text-center text-charcoal-light max-w-3xl mx-auto mt-4 text-lg">
              Why Pittsburgh's rental market offers exceptional opportunities for steady income and long-term appreciation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {rentalData.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
                {/* Statistic */}
                <div className="text-3xl md:text-4xl font-bold text-cabernet mb-2">
                  {item.statistic}
                </div>
                
                {/* Category */}
                <div className="text-lg font-semibold text-charcoal mb-3">
                  {item.category}
                </div>
                
                {/* Description */}
                <div className="text-sm text-charcoal-light mb-4 leading-relaxed">
                  {item.description}
                </div>
                
                {/* Source Link */}
                <div className="text-xs">
                  <span className="text-gray-500">Source: </span>
                  <a 
                    href={item.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cabernet hover:text-cabernet/90 underline font-medium"
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
      <section id="rental-properties" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-cabernet mb-4">Rental Investment Opportunities</h2>
            <p className="text-charcoal-light max-w-3xl mx-auto text-lg leading-relaxed">
              With <span className="font-bold text-gold">8.5% rental yields</span> and only 4.2% vacancy rates, 
              these rental properties offer exceptional cash flow potential in Pittsburgh's growing market.
            </p>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="transform transition-transform hover:scale-[1.02]">
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
      </section>
      
      <PropertyQuickViewModal
        listing={quickViewListing}
        isOpen={!!quickViewListing}
        onClose={() => setQuickViewListing(null)}
      />
    </>
  );
};
