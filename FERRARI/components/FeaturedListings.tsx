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
    const res = await fetch('/api/listings');
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
    console.error('Error loading properties from database:', error);
    // Final fallback if service throws
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
    return (
        <>
            {/* Residential Statistics Section */}
            <section id="residential-stats" className="pt-32 pb-20 bg-cream">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-cabernet">Did You Know this about Pittsburgh Residential?</h2>
                        <p className="text-center text-charcoal-light max-w-3xl mx-auto mt-4 text-lg">
                            Why Pittsburgh's residential and land market offers the perfect opportunity for homeownership and investment.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {residentialData.map((item, index) => (
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

            {/* Residential Properties Section */}
            <section id="residential-properties" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-cabernet mb-4">Residential & Land Opportunities</h2>
                        <p className="text-charcoal-light max-w-3xl mx-auto text-lg leading-relaxed">
                            With Pittsburgh's population growing for the first time in 60 years and <span className="font-bold text-gold">105% home appreciation</span> over the past decade, 
                            these residential homes and development land opportunities offer the perfect entry point before the AI boom drives prices even higher.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {residentialProperties.map((listing) => (
                            <PropertyCard 
                                key={listing.id} 
                                listing={listing} 
                                onOpenQuickView={handleOpenQuickView}
                            />
                        ))}
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