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

  return (
    <>
      {/* Land Statistics Section */}
      <section id="land-stats" className="pt-32 pb-20 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-cabernet">Did You Know this about Pittsburgh Land Development?</h2>
            <p className="text-center text-charcoal-light max-w-3xl mx-auto mt-4 text-lg">
              Why Pittsburgh's land market offers exceptional opportunities for development and investment growth.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {landData.map((item, index) => (
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

      {/* Land Properties Section */}
      <section id="land-properties" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-cabernet mb-4">Land & Development Opportunities</h2>
            <p className="text-charcoal-light max-w-3xl mx-auto text-lg leading-relaxed">
              With <span className="font-bold text-gold">12.5% growth in development projects</span> and flexible zoning on 85% of parcels, 
              these land opportunities offer prime positioning for Pittsburgh's continued expansion and AI-driven economic boom.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {properties.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} onOpenQuickView={setQuickViewListing} />
            ))}
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


