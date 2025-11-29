import React, { useState } from 'react';
import { FEATURED_LISTINGS } from '../constants';
import { PropertyCard } from './ListingCard';
import { PropertyQuickViewModal } from './PropertyQuickViewModal';
import { Listing } from '../types';

// Get managed properties or fallback to constants
const getManagedProperties = () => {
  const savedProperties = localStorage.getItem('managedProperties');
  if (savedProperties) {
    return JSON.parse(savedProperties);
  }
  return FEATURED_LISTINGS;
};

const vaLoanData = [
    {
        statistic: '$3.9 Trillion',
        category: 'Economic Impact',
        description: 'VA Loan program has contributed this amount to the U.S. economy since inception, driving veteran homeownership.',
        source: 'Veterans United',
        sourceUrl: 'https://www.veteransunited.com/newsroom/as-the-va-loan-turns-80-new-analysis-finds-the-benefit-has-contributed-3-9-trillion-to-the-u-s-economy/'
    },
    {
        statistic: '89%',
        category: 'Veteran Satisfaction',
        description: 'Percentage of veterans who rank VA home loan as their top benefit, surpassing healthcare and education.',
        source: 'Veterans United',
        sourceUrl: 'https://www.veteransunited.com/newsroom/as-the-va-loan-turns-80-new-analysis-finds-the-benefit-has-contributed-3-9-trillion-to-the-u-s-economy/'
    },
    {
        statistic: '60%',
        category: 'Young Veteran Buyers',
        description: 'Percentage of VA purchase loans in 2023 used by Millennial and Gen Z veterans - perfect timing for Pittsburgh growth.',
        source: 'Veterans United',
        sourceUrl: 'https://www.veteransunited.com/newsroom/as-the-va-loan-turns-80-new-analysis-finds-the-benefit-has-contributed-3-9-trillion-to-the-u-s-economy/'
    },
    {
        statistic: '4% Higher',
        category: 'Female Veteran Ownership',
        description: 'Female veterans have 4 percentage points higher homeownership rate than female civilians.',
        source: 'Veterans United',
        sourceUrl: 'https://www.veteransunited.com/newsroom/as-the-va-loan-turns-80-new-analysis-finds-the-benefit-has-contributed-3-9-trillion-to-the-u-s-economy/'
    },
];

const vaProperties = [
    ...getManagedProperties().filter((prop: any) => prop.type === 'Residential' && prop.status === 'Active'),
].slice(0, 8);

export const VaLoanBenefits: React.FC = () => {
    const [quickViewListing, setQuickViewListing] = useState<Listing | null>(null);
    console.log('VaLoanBenefits component rendering');
    return (
        <>
            {/* VA Loan Statistics Section */}
            <section id="va-stats" className="pt-32 pb-20 bg-cream">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-cabernet">Did You Know this about VA Loans?</h2>
                        <p className="text-center text-charcoal-light max-w-3xl mx-auto mt-4 text-lg">
                            Why VA loans give veterans the perfect advantage in Pittsburgh's growing real estate market.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {vaLoanData.map((item, index) => (
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
                                        className="text-cabernet hover:text-cabernet-dark underline font-medium"
                                    >
                                        {item.source}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* VA Loan Properties Section */}
            <section id="va-properties" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-cabernet mb-4">VA Loan Ready Properties</h2>
                        <p className="text-charcoal-light max-w-3xl mx-auto text-lg leading-relaxed">
                            With Pittsburgh's real estate market projected for <span className="font-bold text-gold">40%+ growth</span> over the next decade, 
                            these VA loan eligible properties offer veterans the perfect opportunity to secure their home with zero down payment before prices soar.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {vaProperties.map((listing) => (
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