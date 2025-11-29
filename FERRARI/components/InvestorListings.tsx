import React, { useState, useEffect } from 'react';
import { INVESTOR_LISTINGS } from '../constants';
import { PropertyCard } from './ListingCard';
import { propertiesService } from '../lib/jsonbinService';
import { Listing } from '../types';
import { PropertyQuickViewModal } from './PropertyQuickViewModal';

// Get all properties from Supabase (fallback handled in service)
const getAllProperties = async (): Promise<Listing[]> => {
  try {
    const all = await propertiesService.getAll();
    console.log('🏢 InvestorListings - Database all:', all.length, 'properties');
    return all;
  } catch (error) {
    console.error('Error loading properties from database:', error);
    const savedProperties = localStorage.getItem('managedProperties');
    if (savedProperties) {
      const parsed = JSON.parse(savedProperties);
      console.log('🏢 InvestorListings - Fallback to localStorage all:', parsed.length, 'properties');
      return parsed;
    }
    return [];
  }
};

export const InvestorListings: React.FC = () => {
  const [properties, setProperties] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewListing, setQuickViewListing] = useState<Listing | null>(null);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        console.log('🏢 InvestorListings - Loading properties...');
        const allProps = await getAllProperties();
        const filteredProperties = allProps.filter((prop: Listing) => prop.type === 'Commercial');
        setProperties(filteredProperties);
        console.log(`🏢 InvestorListings - Loaded ${filteredProperties.length} properties`);
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
      console.log('🏢 InvestorListings - Received properties update event, refreshing...');
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

  const investmentProperties = properties;

  return (
    <section id="invest" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-cabernet mb-4">Portfolio-Defining Investment Opportunities</h2>
            <p className="text-charcoal-light max-w-3xl mx-auto text-lg leading-relaxed">
                With billions in federal and corporate funding transforming Pittsburgh into a global hub for AI, robotics, and biotech, the smart money is already here. 
                Analysts project a <span className="font-bold text-gold">40%+ asset value increase</span> over the next decade. 
                These commercial properties and development land are your entry point before the market soars.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {investmentProperties.map((listing: any) => (
            <PropertyCard key={listing.id} listing={listing} onOpenQuickView={setQuickViewListing} />
          ))}
        </div>
      </div>
      
      <PropertyQuickViewModal
        listing={quickViewListing}
        isOpen={!!quickViewListing}
        onClose={() => setQuickViewListing(null)}
      />
    </section>
  );
};