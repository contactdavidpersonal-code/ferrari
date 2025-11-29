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

  return (
    <>
      {/* Commercial Statistics Section */}
      <section id="commercial-stats" className="pt-32 pb-20 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-cabernet">Did You Know this about Pittsburgh Commercial?</h2>
            <p className="text-center text-charcoal-light max-w-3xl mx-auto mt-4 text-lg">
              Why Pittsburgh's commercial real estate market offers the perfect opportunity for investors and businesses.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {commercialData.map((item, index) => (
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

      {/* Hottest Properties Section */}
      <section id="hottest" className="pt-16 pb-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-center text-cabernet mb-4">Properties Attracting the Most Attention</h2>
          <p className="text-center text-charcoal-light max-w-3xl mx-auto mb-12 text-lg">
            These prime commercial properties and development land are currently generating the most interest from savvy investors and developers. Explore them before they're gone.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                  {properties.map((listing) => (
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