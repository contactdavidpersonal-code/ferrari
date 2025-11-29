export interface Listing {
  id: number;
  // Basic Information
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  type: 'Residential' | 'Commercial' | 'Land' | 'Rentals';
  
  // Property Details
  sqft: number;
  lotSize?: string | number;
  yearBuilt?: number;
  propertyStyle?: string;
  stories?: number;
  
  // eXp Realty Specific Fields
  mlsId?: string;
  estimatedTaxes?: number;
  garageSpaces?: number;
  garageType?: string;
  schoolDistrict?: string;
  township?: string;
  rooms?: Array<{name: string, level: string, dimensions: string}>;
  bedrooms?: Array<{name: string, level: string, dimensions: string}>;
  
  // Residential Details
  beds?: number;
  baths?: number;
  halfBaths?: number;
  
  // Land Details
  landUse?: string;
  utilities?: string[];
  zoning?: string;
  
  // Commercial Details
  parkingSpaces?: number;
  
  // Features & Amenities
  features?: string[];
  appliances?: string[];
  heating?: string;
  cooling?: string;
  flooring?: string[];
  
  // Property Condition
  condition?: 'Excellent' | 'Good' | 'Fair' | 'Needs Work';
  roofAge?: number;
  hvacAge?: number;
  
  // Financial Information
  propertyTaxes?: number;
  hoaFees?: number;
  hoaFrequency?: 'Monthly' | 'Quarterly' | 'Annually';
  
  // Investment Information (for rentals)
  rentalIncome?: number;
  capRate?: number;
  occupancyRate?: number;
  
  // Media
  images: string[];
  videos: string[];
  virtualTour?: string;
  
  // AI Assistant
  aiPrompt?: string;
  
  // Listing Details
  listingDate: string;
  lastUpdated: string;
  status: 'Active' | 'Pending' | 'Sold' | 'Off Market';
  mlsNumber?: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  location: string;
}

export interface Lead {
  id: number;
  // Contact Information
  name: string;
  email: string;
  phone: string;
  
  // Lead Details
  source: 'Contact Form' | 'AI Chat' | 'Property Inquiry' | 'VA Loan Inquiry' | 'Phone Call' | 'Referral' | 'Other';
  interest: 'Buying' | 'Selling' | 'Investing' | 'VA Loan' | 'General Inquiry' | 'Property Viewing';
  status: 'New' | 'Contacted' | 'Qualified' | 'Meeting Scheduled' | 'Under Contract' | 'Closed' | 'Not Interested';
  priority: 'High' | 'Medium' | 'Low';
  
  // Property Interest
  interestedProperties?: number[]; // Array of property IDs
  propertyTypes?: ('Residential' | 'Commercial' | 'Land')[];
  priceRange?: {
    min: number;
    max: number;
  };
  location?: string;
  
  // Communication
  notes: string; // Legacy field - kept for backward compatibility
  noteTimeline: Note[]; // New comprehensive notes system
  lastContact?: string;
  nextFollowUp?: string;
  communicationHistory: Communication[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Additional Info
  budget?: number;
  timeline?: string;
  financingPreApproved?: boolean;
  firstTimeBuyer?: boolean;
  veteran?: boolean;
}

export interface Communication {
  id: string;
  type: 'Call' | 'Email' | 'Text' | 'Meeting' | 'Note';
  date: string;
  content: string;
  outcome?: string;
  nextAction?: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author: string;
  type: 'General' | 'Property Interest' | 'Financial' | 'Timeline' | 'Follow-up' | 'Status Update' | 'Meeting' | 'Objection' | 'Closing';
  tags?: string[];
  isImportant?: boolean;
  relatedProperties?: number[]; // Array of property IDs
}

export interface InstagramPost {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}
