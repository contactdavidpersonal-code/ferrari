import React from 'react';

const didYouKnowData = [
    {
        statistic: '$70-90 Billion',
        category: 'AI & Energy Investment',
        description: 'Massive private-sector investment announced July 2025 for energy infrastructure and AI development across PA.',
        source: 'Pittsburgh Living',
        sourceUrl: 'https://pghliving.com/pa-ai-investment/'
    },
    {
        statistic: '$500 Million',
        category: 'PA SITES Initiative',
        description: 'State funding for pad-ready site development across Pennsylvania, including Pittsburgh region.',
        source: 'Pittsburgh Region',
        sourceUrl: 'https://pittsburghregion.org/the-region/'
    },
    {
        statistic: '408,000 Sq Ft',
        category: 'Industrial Complex',
        description: 'Major $38M acquisition of 79 North Industrial & Research Park driving industrial expansion.',
        source: 'CRE Page',
        sourceUrl: 'https://crepage.com/city/pittsburgh/'
    },
    {
        statistic: '3 Districts',
        category: 'Neighborhood Revitalization',
        description: 'Lawrenceville, East Liberty, and Strip District attracting restaurants, shops, and mixed-use development.',
        source: 'Linqs Realty',
        sourceUrl: 'https://www.linqsrealty.com/posts/commercial-real-estate-investment-in-pittsburgh-retail-office-industrial-opportunities-linqs-realty'
    },
];

export const Timeline: React.FC = () => {
  return (
    <section id="market-intel" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal">Did You Know this about the Pittsburgh?</h2>
          <p className="text-center text-charcoal-light max-w-3xl mx-auto mt-4 text-lg">
            Major developments and investments coming to Pittsburgh that will transform the commercial real estate market.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {didYouKnowData.map((item, index) => (
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
  );
};