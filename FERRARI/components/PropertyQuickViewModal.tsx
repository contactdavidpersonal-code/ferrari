import React, { useState, useEffect } from 'react';
import { Listing } from '../types';
import { ContactLeadModal } from './ContactLeadModal';

interface PropertyQuickViewModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PropertyQuickViewModal: React.FC<PropertyQuickViewModalProps> = ({ 
  listing, 
  isOpen, 
  onClose 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  // Reset image index when listing changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [listing]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !listing) {
    console.log('PropertyQuickViewModal not rendering - isOpen:', isOpen, 'listing:', !!listing);
    return null;
  }
  
  console.log('PropertyQuickViewModal rendering for listing:', listing.address);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });

  // Helper function to get all features (up to 8)
  const getAllFeatures = (): string[] => {
    const features: string[] = [];
    
    // Add features array
    if (listing.features && Array.isArray(listing.features) && listing.features.length > 0) {
      features.push(...listing.features);
    }
    
    // Add appliances
    if (listing.appliances && Array.isArray(listing.appliances) && listing.appliances.length > 0) {
      features.push(...listing.appliances.map(app => `Appliance: ${app}`));
    }
    
    // Add flooring
    if (listing.flooring && Array.isArray(listing.flooring) && listing.flooring.length > 0) {
      features.push(...listing.flooring.map(floor => `Flooring: ${floor}`));
    }
    
    // Add heating/cooling
    if (listing.heating) features.push(`Heating: ${listing.heating}`);
    if (listing.cooling) features.push(`Cooling: ${listing.cooling}`);
    
    // Add utilities for land
    if (listing.utilities && Array.isArray(listing.utilities) && listing.utilities.length > 0) {
      features.push(...listing.utilities.map(util => `Utility: ${util}`));
    }
    
    return features.slice(0, 8);
  };

  // Helper function to render field if it has a value
  const renderField = (label: string, value: any, formatter?: (val: any) => string) => {
    if (value === undefined || value === null || value === '' || 
        (Array.isArray(value) && value.length === 0)) {
      return null;
    }
    
    // Only filter out zero values for specific fields that shouldn't show 0
    const fieldsToHideZero = ['roofAge', 'hvacAge', 'capRate', 'occupancyRate'];
    const fieldKey = label.toLowerCase().replace(/\s+/g, '');
    if (value === 0 && fieldsToHideZero.some(field => fieldKey.includes(field.toLowerCase()))) {
      return null;
    }
    
    const displayValue = formatter ? formatter(value) : value;
    return (
      <div className="flex justify-between py-2 border-b border-gray-100">
        <span className="font-medium text-gray-600">{label}:</span>
        <span className="text-gray-900">{displayValue}</span>
      </div>
    );
  };

  // Helper function to render array field
  const renderArrayField = (label: string, values: string[] | undefined) => {
    if (!values || !Array.isArray(values) || values.length === 0) return null;
    
    return (
      <div className="py-2 border-b border-gray-100">
        <div className="font-medium text-gray-600 mb-2">{label}:</div>
        <div className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
              {value}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const features = getAllFeatures();
  const hasMoreFeatures = ((Array.isArray(listing.features) ? listing.features.length : 0) + 
                         (Array.isArray(listing.appliances) ? listing.appliances.length : 0) + 
                         (Array.isArray(listing.flooring) ? listing.flooring.length : 0) + 
                         (Array.isArray(listing.utilities) ? listing.utilities.length : 0) + 
                         (listing.heating ? 1 : 0) + 
                         (listing.cooling ? 1 : 0)) > 8;

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-lg shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                {listing.address}
              </h2>
              <p className="text-gray-600">{listing.city}, {listing.state}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row max-h-[calc(90vh-120px)]">
            {/* Left Side - Vertical Photo Stream */}
            <div className="lg:w-1/2 p-6 overflow-y-auto">
              {listing.images && Array.isArray(listing.images) && listing.images.length > 0 ? (
                <div className="space-y-4">
                  {listing.images.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`Property view ${idx + 1}`}
                      className="w-full rounded-lg border border-gray-200 object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e)=>{ (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/seed/modal-fallback/1000/650'; }}
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xl">🏠 No Images Available</span>
                </div>
              )}

              {/* Virtual Tour */}
              {listing.virtualTour && (
                <div className="mt-4">
                  <a
                    href={listing.virtualTour}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-cabernet text-white px-4 py-2 rounded-lg hover:bg-cabernet/90 transition-colors"
                  >
                    🏠 View Virtual Tour
                  </a>
                </div>
              )}
            </div>

            {/* Right Side - Details */}
            <div className="lg:w-1/2 p-6 overflow-y-auto">
              {/* Price */}
              <div className="mb-6">
                <div className="text-3xl font-serif font-bold text-cabernet">
                  {formatter.format(listing.price)}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">
                  {listing.type} Property
                </div>
              </div>

              {/* Key Features (up to 8) */}
              {Array.isArray(features) && features.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                    {hasMoreFeatures && (
                      <span className="bg-cabernet/10 text-cabernet px-3 py-1 rounded-full text-sm">
                        +{((Array.isArray(listing.features) ? listing.features.length : 0) + (Array.isArray(listing.appliances) ? listing.appliances.length : 0) + (Array.isArray(listing.flooring) ? listing.flooring.length : 0) + (Array.isArray(listing.utilities) ? listing.utilities.length : 0) + (listing.heating ? 1 : 0) + (listing.cooling ? 1 : 0)) - 8} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Property Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">Property Details</h3>
                  
                  {/* Basic Information */}
                  {renderField('Square Feet', listing.sqft, (val) => val.toLocaleString())}
                  {renderField('Lot Size', listing.lotSize, (val) => `${val} acres`)}
                  {renderField('Year Built', listing.yearBuilt)}
                  {renderField('Property Style', listing.propertyStyle)}
                  {renderField('Stories', listing.stories)}
                  {renderField('Condition', listing.condition)}
                  {renderField('MLS ID', listing.mlsId || listing.mlsNumber)}
                  
                  {/* Residential Details */}
                  {listing.type === 'Residential' && (
                    <>
                      {renderField('Bedrooms', listing.beds)}
                      {renderField('Full Bathrooms', listing.baths)}
                      {renderField('Half Bathrooms', listing.halfBaths)}
                      {renderField('Garage Spaces', listing.garageSpaces)}
                      {renderField('Garage Type', listing.garageType)}
                      {renderField('Parking Spaces', listing.parkingSpaces)}
                    </>
                  )}
                  
                  {/* Commercial Details */}
                  {listing.type === 'Commercial' && (
                    <>
                      {renderField('Bedrooms', listing.beds)}
                      {renderField('Bathrooms', listing.baths)}
                      {renderField('Half Bathrooms', listing.halfBaths)}
                      {renderField('Parking Spaces', listing.parkingSpaces)}
                      {renderField('Zoning', listing.zoning)}
                    </>
                  )}
                  
                  {/* Land Details */}
                  {listing.type === 'Land' && (
                    <>
                      {renderField('Land Use', listing.landUse)}
                      {renderField('Zoning', listing.zoning)}
                      {renderArrayField('Utilities Available', listing.utilities)}
                    </>
                  )}
                  
                  {/* Location & School Information */}
                  {renderField('School District', listing.schoolDistrict)}
                  {renderField('Township', listing.township)}
                  
                  {/* Property Condition & Age */}
                  {renderField('Roof Age', listing.roofAge, (val) => `${val} years`)}
                  {renderField('HVAC Age', listing.hvacAge, (val) => `${val} years`)}
                  
                  {/* Features & Amenities */}
                  {renderArrayField('Features', listing.features)}
                  {renderArrayField('Appliances', listing.appliances)}
                  {renderArrayField('Flooring', listing.flooring)}
                  {renderField('Heating', listing.heating)}
                  {renderField('Cooling', listing.cooling)}
                  
                  {/* Financial Information */}
                  {renderField('Property Taxes', listing.propertyTaxes, (val) => formatter.format(val))}
                  {renderField('Estimated Taxes', listing.estimatedTaxes, (val) => formatter.format(val))}
                  {renderField('HOA Fees', listing.hoaFees, (val) => formatter.format(val))}
                  {renderField('HOA Frequency', listing.hoaFrequency)}
                  
                  {/* Investment Information */}
                  {renderField('Rental Income', listing.rentalIncome, (val) => formatter.format(val))}
                  {renderField('Cap Rate', listing.capRate, (val) => `${val}%`)}
                  {renderField('Occupancy Rate', listing.occupancyRate, (val) => `${val}%`)}
                  
                  {/* Rooms Information */}
                  {listing.rooms && Array.isArray(listing.rooms) && listing.rooms.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Rooms</h4>
                      <div className="space-y-1">
                        {listing.rooms.map((room, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {room.name} ({room.level}) - {room.dimensions}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Bedrooms Information */}
                  {listing.bedrooms && Array.isArray(listing.bedrooms) && listing.bedrooms.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Bedroom Details</h4>
                      <div className="space-y-1">
                        {listing.bedrooms.map((bedroom, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {bedroom.name} ({bedroom.level}) - {bedroom.dimensions}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                          {/* Additional Details for All Property Types */}
                          {renderField('Property Style', listing.propertyStyle)}
                          {renderField('Stories', listing.stories)}
                          {renderField('Condition', listing.condition)}
                          {renderField('Half Bathrooms', listing.halfBaths)}
                          {renderField('Garage Spaces', listing.garageSpaces)}
                          {renderField('Garage Type', listing.garageType)}
                          {renderField('Parking Spaces', listing.parkingSpaces)}
                          {renderField('Zoning', listing.zoning)}
                          {renderField('Land Use', listing.landUse)}
                          {renderArrayField('Utilities Available', listing.utilities)}
                          {renderField('School District', listing.schoolDistrict)}
                          {renderField('Township', listing.township)}
                          {renderField('Roof Age', listing.roofAge, (val) => `${val} years`)}
                          {renderField('HVAC Age', listing.hvacAge, (val) => `${val} years`)}
                          {renderArrayField('Features', listing.features)}
                          {renderArrayField('Appliances', listing.appliances)}
                          {renderArrayField('Flooring', listing.flooring)}
                          {renderField('Heating', listing.heating)}
                          {renderField('Cooling', listing.cooling)}
                          {renderField('Property Taxes', listing.propertyTaxes, (val) => formatter.format(val))}
                          {renderField('Estimated Taxes', listing.estimatedTaxes, (val) => formatter.format(val))}
                          {renderField('HOA Fees', listing.hoaFees, (val) => formatter.format(val))}
                          {renderField('HOA Frequency', listing.hoaFrequency)}
                          {renderField('Rental Income', listing.rentalIncome, (val) => formatter.format(val))}
                          {renderField('Cap Rate', listing.capRate, (val) => `${val}%`)}
                          {renderField('Occupancy Rate', listing.occupancyRate, (val) => `${val}%`)}
                          
                          {/* AI Prompt - HIDDEN per user request */}
                          {/* {renderField('AI Assistant Notes', listing.aiPrompt)} */}
                </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-500">
              MLS #{listing.mlsId || listing.mlsNumber || 'N/A'} • Listed {new Date(listing.listingDate).toLocaleDateString()}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowContactModal(true)}
                className="bg-cabernet text-white px-6 py-2 rounded-lg hover:bg-cabernet/90 transition-colors font-semibold"
              >
                Contact Agent
              </button>
              <button
                onClick={onClose}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactLeadModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </>
  );
};
