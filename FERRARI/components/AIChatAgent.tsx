import React, { useState, useEffect } from 'react';
import { FEATURED_LISTINGS, INVESTOR_LISTINGS } from '../constants';
import { propertiesService } from '../lib/jsonbinService';
import { Listing } from '../types';
import {
  CHAT_HEADER_TITLE,
  CHAT_HEADER_SUBTITLE,
  WELCOME_MESSAGE,
  PHONE_CTA_GENERIC,
  PHONE_CAPTURED_CONFIRMATION,
  DEFAULT_FALLBACK_MESSAGE,
  AI_DISCLOSURE_BANNER,
  COMPLIANCE_SHORT,
  ACCURACY_DISCLAIMER,
  PRIVACY_NOTE,
  LIABILITY_NOTICE,
  FAIR_HOUSING_NOTE,
  MLS_DATA_NOTICE,
  BROKERAGE_NAME,
  BROKER_PHONE,
  BROKER_CITY_STATE,
  LICENSE_JURISDICTION,
  CONSUMER_NOTICE_URL,
  NO_LICENSED_ACTIVITY_MESSAGE,
  NO_LEGAL_TAX_FINANCIAL_MESSAGE,
  PRIVACY_URL,
  TERMS_URL,
} from './agentPrompts';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIChatAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<any>(null);
  const [showDisclosures, setShowDisclosures] = useState(false);

  // expose setter for property context
  useEffect(() => {
    (window as any).setAIContext = (ctx: any) => setContext(ctx);
    return () => { (window as any).setAIContext = undefined; };
  }, []);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 1,
        text: WELCOME_MESSAGE,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const [allProperties, setAllProperties] = useState<Listing[]>([]);

  // Load properties from Supabase or fallback to constants
  useEffect(() => {
    const loadProperties = async () => {
      try {
        console.log('🤖 AIChatAgent - Loading properties...');
        const supabaseProperties = await propertiesService.getAll();
        const activeProperties = supabaseProperties.filter((prop: Listing) => prop.status === 'Active');
        setAllProperties(activeProperties);
        console.log(`🤖 AIChatAgent - Loaded ${activeProperties.length} active properties from Database`);
      } catch (error) {
        console.error('Error loading properties for AI:', error);
        // Fallback to localStorage only if Supabase completely fails
        const savedProperties = localStorage.getItem('managedProperties');
        if (savedProperties) {
          const parsed = JSON.parse(savedProperties);
          const activeProperties = parsed.filter((prop: any) => prop.status === 'Active');
          setAllProperties(activeProperties);
          console.log(`🤖 AIChatAgent - Loaded ${activeProperties.length} properties from localStorage fallback`);
        } else {
          setAllProperties([]);
          console.log(`🤖 AIChatAgent - No properties found, returning empty array`);
        }
      }
    };

    loadProperties();
    
    // Listen for global property update events from admin
    const handlePropertiesUpdate = () => {
      console.log('🤖 AIChatAgent - Received properties update event, refreshing...');
      loadProperties();
    };
    
    window.addEventListener('propertiesUpdated', handlePropertiesUpdate);
    
    return () => {
      window.removeEventListener('propertiesUpdated', handlePropertiesUpdate);
    };
  }, []);

  // Function to provide comprehensive property information to AI
  const getPropertyDetails = (property: any) => {
    const details = {
      basic: {
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
        price: property.price,
        type: property.type,
        status: property.status
      },
      physical: {
        sqft: property.sqft,
        lotSize: property.lotSize,
        beds: property.beds,
        baths: property.baths,
        halfBaths: property.halfBaths,
        units: property.units,
        yearBuilt: property.yearBuilt,
        propertyStyle: property.propertyStyle,
        stories: property.stories,
        condition: property.condition
      },
      features: {
        features: property.features,
        appliances: property.appliances,
        heating: property.heating,
        cooling: property.cooling,
        flooring: property.flooring,
        parkingSpaces: property.parkingSpaces
      },
      land: {
        landUse: property.landUse,
        utilities: property.utilities,
        zoning: property.zoning
      },
      financial: {
        propertyTaxes: property.propertyTaxes,
        hoaFees: property.hoaFees,
        hoaFrequency: property.hoaFrequency,
        rentalIncome: property.rentalIncome,
        capRate: property.capRate,
        occupancyRate: property.occupancyRate
      },
      media: {
        images: property.images,
        videos: property.videos,
        virtualTour: property.virtualTour
      },
      listing: {
        listingDate: property.listingDate,
        lastUpdated: property.lastUpdated,
        mlsNumber: property.mlsNumber
      },
      aiPrompt: property.aiPrompt
    };
    return details;
  };

  // Enhanced AI response with internet access simulation
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Guardrails: refuse licensed activity
    if (
      lowerMessage.includes('what is this worth') ||
      lowerMessage.includes('what should i offer') ||
      lowerMessage.includes('negotiate') ||
      lowerMessage.includes('defect') ||
      lowerMessage.includes('disclosure') ||
      lowerMessage.includes('write the contract') ||
      lowerMessage.includes('fill out') ||
      lowerMessage.includes('title issue') ||
      lowerMessage.includes('escrow')
    ) {
      return NO_LICENSED_ACTIVITY_MESSAGE;
    }

    // Guardrails: refuse legal/tax/financial advice
    if (
      lowerMessage.includes('legal') ||
      lowerMessage.includes('attorney') ||
      lowerMessage.includes('tax') ||
      lowerMessage.includes('capital gains') ||
      lowerMessage.includes('1031') ||
      lowerMessage.includes('financial advice')
    ) {
      return NO_LEGAL_TAX_FINANCIAL_MESSAGE;
    }

    // Enhanced property search with all details
    if (lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('show me')) {
      const searchTerm = userMessage.toLowerCase();
      const matchingProperties = allProperties.filter((property: any) => 
        property.address.toLowerCase().includes(searchTerm) ||
        property.city.toLowerCase().includes(searchTerm) ||
        property.type.toLowerCase().includes(searchTerm) ||
        property.propertyStyle?.toLowerCase().includes(searchTerm) ||
        property.features?.some((feature: string) => feature.toLowerCase().includes(searchTerm))
      );

      if (matchingProperties.length > 0) {
        const property = matchingProperties[0];
        return `I found ${matchingProperties.length} matching property(ies)! 🏠 Here's the first one: ${property.address} in ${property.city} - ${property.type} for $${property.price.toLocaleString()}. ${property.aiPrompt || 'This property has great potential!'} Would you like to see more details about this property or others?`;
      }
      return `I searched through all ${allProperties.length} of our properties, but I didn't find an exact match for "${userMessage}". However, we have amazing options in Pittsburgh! Would you like me to show you properties by type (Residential, Commercial, Land) or specific features?`;
    }

    // Location-based questions with internet access simulation
    if (lowerMessage.includes('around') || lowerMessage.includes('nearby') || lowerMessage.includes('area') || lowerMessage.includes('neighborhood')) {
      if (context?.selectedListing) {
        const property = context.selectedListing;
        // Simulate internet lookup for area information
        return `Great question about the ${property.city} area! 🌍 Based on current data, ${property.city} is known for its vibrant community, excellent schools, and growing tech sector. The area around ${property.address} has seen significant development with new restaurants, shopping centers, and recreational facilities. For the most current local information, Nicole can provide you with detailed neighborhood insights and recent market trends. Would you like her to call you with specific area details?`;
      }
      return `I'd love to tell you about the area! 🗺️ Pittsburgh neighborhoods each have their own unique character - from the trendy Lawrenceville with its restaurants and shops, to the family-friendly Squirrel Hill with great schools, to the growing tech hub of Oakland. Which area interests you most? I can share more details!`;
    }
    
    // Check for greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! 😊 So glad you're here! I'm Nicole's assistant and I absolutely love helping people find their perfect home in Pittsburgh. Nicole has been doing this for years and she's incredible at matching people with properties they'll love. Are you looking to buy, invest, or just curious about the market?";
    }
    
    // Check for phone number
    const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
    if (phoneRegex.test(userMessage)) {
      const phoneMatch = userMessage.match(phoneRegex);
      const phoneNumber = phoneMatch ? phoneMatch[0].replace(/[-.\s()]/g, '') : '';
      
      // Save lead to database and send email via API
      try {
        const leadData = {
          name: 'AI Chat User',
          email: '',
          phone: phoneNumber,
          message: `Phone number captured from AI chat. User message: "${userMessage}"`,
          source: 'AI Chat',
          conversationHistory: messages.map(m => ({ 
            role: m.isUser ? 'user' : 'assistant', 
            text: m.text 
          }))
        };

        // Save to database and send email (consolidated endpoint)
        fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData)
        }).then(response => {
          if (response.ok) {
            console.log('✅ Lead captured and email sent to nicole@exppgh.com');
          }
        }).catch(error => {
          console.error('❌ Failed to capture lead:', error);
        });
      } catch (error) {
        console.error('❌ Failed to capture lead:', error);
      }
      
      return PHONE_CAPTURED_CONFIRMATION;
    }
    
    // Check for email address
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
    if (emailRegex.test(userMessage)) {
      const emailMatch = userMessage.match(emailRegex);
      const emailAddress = emailMatch ? emailMatch[1] : '';
      
      // Save lead to database and send email via API
      try {
        const leadData = {
          name: 'AI Chat User',
          email: emailAddress,
          phone: '',
          message: `Email address captured from AI chat. User message: "${userMessage}"`,
          source: 'AI Chat',
          conversationHistory: messages.map(m => ({ 
            role: m.isUser ? 'user' : 'assistant', 
            text: m.text 
          }))
        };

        // Save to database and send email (consolidated endpoint)
        fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData)
        }).then(response => {
          if (response.ok) {
            console.log('✅ Lead captured and email sent to nicole@exppgh.com');
          }
        }).catch(error => {
          console.error('❌ Failed to capture lead:', error);
        });
      } catch (error) {
        console.error('❌ Failed to capture lead:', error);
      }
      
      return "Perfect! I've got your email address. Nicole will reach out to you soon at that address. Is there anything specific about Pittsburgh properties you'd like to know while you wait?";
    }
    
    // Check for price inquiries
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
      return `Great question! 💰 I can see all the pricing on our properties, but Nicole has the inside scoop on comps and negotiation strategies that could save you thousands. ${PHONE_CTA_GENERIC}`;
    }
    
    // Enhanced property details with comprehensive information
    const propertyKeywords = ['property', 'listing', 'home', 'house', 'apartment', 'condo', 'commercial', 'land'];
    const hasPropertyKeyword = propertyKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (hasPropertyKeyword || lowerMessage.includes('details') || lowerMessage.includes('about') || lowerMessage.includes('tell me')) {
      if (context?.selectedListing) {
        const p = context.selectedListing;
        let details = [`You're asking about ${p.address}, ${p.city}, ${p.state} ${p.zipCode}.`];
        
        // Add comprehensive property details
        details.push(`Type: ${p.type}`);
        details.push(`Price: $${p.price.toLocaleString()}`);
        if (p.sqft) details.push(`Size: ${p.sqft.toLocaleString()} sqft`);
        if (p.lotSize) details.push(`Lot Size: ${p.lotSize.toLocaleString()} sqft`);
        if (p.beds) details.push(`Beds: ${p.beds}`);
        if (p.baths) details.push(`Baths: ${p.baths}`);
        if (p.units) details.push(`Units: ${p.units}`);
        if (p.yearBuilt) details.push(`Built: ${p.yearBuilt}`);
        if (p.propertyStyle) details.push(`Style: ${p.propertyStyle}`);
        if (p.condition) details.push(`Condition: ${p.condition}`);
        if (p.parkingSpaces) details.push(`Parking: ${p.parkingSpaces} spaces`);
        if (p.landUse) details.push(`Land Use: ${p.landUse}`);
        if (p.zoning) details.push(`Zoning: ${p.zoning}`);
        if (p.features && p.features.length > 0) details.push(`Features: ${p.features.join(', ')}`);
        if (p.rentalIncome) details.push(`Rental Income: $${p.rentalIncome.toLocaleString()}/month`);
        if (p.capRate) details.push(`Cap Rate: ${p.capRate}%`);
        
        const lines = details.join(' • ');
        
        // Add AI prompt information if available
        const aiPrompt = (p as any).aiPrompt;
        if (aiPrompt) {
          return `Great choice! 🏠 ${lines}. ${aiPrompt} What are you planning to use it for (personal, invest, business)? I can provide more specific details about the area and market trends.`;
        }
        
        return `Great choice! 🏠 ${lines}. What are you planning to use it for (personal, invest, business)? I can provide more specific details about the area and market trends.`;
      }
      return `Oh, I love talking about our properties! 🏠 We have ${allProperties.length} listings right now across Pittsburgh - from charming residential homes to prime commercial properties and development land. Tell me which type interests you most or what you're hoping to use it for!`;
    }
    
    // Property comparison feature
    if (lowerMessage.includes('compare') || lowerMessage.includes('vs') || lowerMessage.includes('better')) {
      const residentialProps = allProperties.filter((p: any) => p.type === 'Residential');
      const commercialProps = allProperties.filter((p: any) => p.type === 'Commercial');
      const landProps = allProperties.filter((p: any) => p.type === 'Land');
      
      return `Great question! 🏠 I can help you compare properties! We currently have ${residentialProps.length} residential properties, ${commercialProps.length} commercial properties, and ${landProps.length} land parcels. I can compare features, prices, locations, and investment potential. Which properties would you like me to compare? Or would you prefer to compare by type (residential vs commercial vs land)?`;
    }

    // Check for investment inquiries with enhanced data
    if (lowerMessage.includes('investment') || lowerMessage.includes('invest') || lowerMessage.includes('roi') || lowerMessage.includes('rental')) {
      if (context?.selectedListing) {
        const p = context.selectedListing;
        let investmentInfo = `For ${p.address}, I can see:`;
        if (p.rentalIncome) investmentInfo += ` Rental Income: $${p.rentalIncome.toLocaleString()}/month`;
        if (p.capRate) investmentInfo += ` Cap Rate: ${p.capRate}%`;
        if (p.occupancyRate) investmentInfo += ` Occupancy: ${p.occupancyRate}%`;
        if (p.propertyTaxes) investmentInfo += ` Taxes: $${p.propertyTaxes.toLocaleString()}/year`;
        if (p.hoaFees) investmentInfo += ` HOA: $${p.hoaFees}/${p.hoaFrequency || 'month'}`;
        
        return `${investmentInfo}. Nicole can walk you through detailed ROI calculations, market trends, and exit strategies. She has access to current market data and can help you make informed investment decisions. Want her to call you with a detailed investment analysis?`;
      }
      
      const investmentProps = allProperties.filter((p: any) => p.rentalIncome || p.capRate);
      return `I can see ${investmentProps.length} properties with investment data! 🏢 Nicole specializes in helping investors find the best opportunities. She can analyze cap rates, rental yields, market appreciation, and help you build a diversified portfolio. Would you like her to call you with investment opportunities?`;
    }
    
    // Check for VA loan inquiries
    if (lowerMessage.includes('va loan') || lowerMessage.includes('veteran') || lowerMessage.includes('military')) {
      return "Thank you for your service! 🇺🇸 Nicole has a special place in her heart for veterans - she's helped so many military families find their perfect homes with zero down payment. She knows all the VA loan tricks and can make the whole process so smooth for you. Would you like to talk with her?";
    }
    
    // Market insights and statistics
    if (lowerMessage.includes('statistics') || lowerMessage.includes('stats') || lowerMessage.includes('numbers') || lowerMessage.includes('data')) {
      const residentialCount = allProperties.filter((p: any) => p.type === 'Residential').length;
      const commercialCount = allProperties.filter((p: any) => p.type === 'Commercial').length;
      const landCount = allProperties.filter((p: any) => p.type === 'Land').length;
      const avgPrice = allProperties.reduce((sum: number, p: any) => sum + p.price, 0) / allProperties.length;
      const priceRange = {
        min: Math.min(...allProperties.map((p: any) => p.price)),
        max: Math.max(...allProperties.map((p: any) => p.price))
      };
      
      return `Here are our current property statistics! 📊 We have ${allProperties.length} total properties: ${residentialCount} residential, ${commercialCount} commercial, and ${landCount} land parcels. Price range: $${priceRange.min.toLocaleString()} - $${priceRange.max.toLocaleString()}, with an average of $${Math.round(avgPrice).toLocaleString()}. I can break down stats by area, type, or price range. What specific data interests you?`;
    }

    // Check for timing/market questions with enhanced insights
    if (lowerMessage.includes('when') || lowerMessage.includes('timing') || lowerMessage.includes('market') || lowerMessage.includes('good time')) {
      const activeProps = allProperties.filter((p: any) => p.status === 'Active').length;
      const recentListings = allProperties.filter((p: any) => {
        const listingDate = new Date(p.listingDate);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return listingDate > thirtyDaysAgo;
      }).length;
      
      return `Honestly? RIGHT NOW! 🚀 We have ${activeProps} active properties and ${recentListings} new listings in the last 30 days. Nicole keeps telling me this is the sweet spot - prices haven't skyrocketed yet but all the smart money is already moving here. The AI boom is bringing tech companies, and that means more jobs and higher property values. Don't wait!`;
    }
    
    // Check for contact requests
    if (lowerMessage.includes('contact') || lowerMessage.includes('call') || lowerMessage.includes('speak') || lowerMessage.includes('talk')) {
      return "Yes! Nicole would absolutely love to talk with you! She's the kind of person who gets genuinely excited about helping people find their dream homes. She's got this gift for really listening and understanding what people want. Just share your phone number and she'll call you back today!";
    }
    
    // Check for objections/concerns
    if (lowerMessage.includes('not sure') || lowerMessage.includes('maybe') || lowerMessage.includes('thinking') || lowerMessage.includes('considering')) {
      return "I totally get it! 🤔 Real estate is a big decision. That's exactly why talking with Nicole is so valuable - she's not pushy at all, she just loves helping people figure out what's right for them. Even if you're just exploring, she's happy to chat and answer questions. No pressure, just helpful advice!";
    }
    
    // Default response - warm and encouraging
    return DEFAULT_FALLBACK_MESSAGE;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      // Generate AI response with enhanced capabilities
      const aiResponseText = await generateAIResponse(currentInput);
      
      // Simulate AI typing delay
      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now() + 1,
          text: aiResponseText,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500 + Math.random() * 1000);
    } catch (error) {
      // Fallback response if there's an error
      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now() + 1,
          text: "I'm having a small technical hiccup, but Nicole would love to help you directly! She's amazing at answering all your real estate questions. Would you like her to call you?",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 flex items-center gap-3 bg-white text-primary rounded-full pl-4 pr-5 py-2 shadow-xl border border-primary/30 hover:shadow-2xl transition-all duration-300 z-50 overflow-visible"
          aria-label="Open chat"
        >
          <div className="relative shrink-0" style={{ width: '3.5rem', height: '3.5rem' }}>
            <img
              src="/nicole_waving_transparent.png"
              alt="Nicole waving avatar"
              className="absolute -top-12 left-1/2 -translate-x-1/2 w-36 h-36 object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.25)]"
            />
          </div>
          <span className="font-semibold text-base leading-tight pr-1">Need Help?</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[420px] h-[620px] bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
          {/* Chat Header */}
          <div className="bg-cabernet text-white px-5 py-5 rounded-t-lg flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/nicole_animated.png"
                alt="Nicole's assistant avatar"
                className="w-12 h-12 rounded-full border border-white/40 object-cover shadow-lg"
              />
              <div>
                <h3 className="font-semibold">{CHAT_HEADER_TITLE}</h3>
                <p className="text-sm opacity-90">{CHAT_HEADER_SUBTITLE}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Compliance strip */}
          <div className="px-4 pt-3 pb-4 text-[11px] text-white/90 bg-cabernet/90">
            <div>{AI_DISCLOSURE_BANNER}</div>
            <div className="opacity-90">{COMPLIANCE_SHORT}</div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 pt-6 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.isUser
                      ? 'bg-cabernet text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer compliance + links (collapsible) */}
          <div className="px-4 pb-2 text-[10px] text-charcoal">
            <button
              onClick={() => setShowDisclosures(v => !v)}
              className="w-full text-left py-2 flex items-center justify-between border-t border-gray-200"
            >
              <span className="font-semibold">Disclosures & Links</span>
              <svg className={`w-4 h-4 transition-transform ${showDisclosures ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
            </button>
            {showDisclosures && (
              <div className="mt-2 space-y-1">
                <div>{ACCURACY_DISCLAIMER}</div>
                <div>{PRIVACY_NOTE}</div>
                <div>{LIABILITY_NOTICE}</div>
                <div>{FAIR_HOUSING_NOTE}</div>
                <div>{MLS_DATA_NOTICE}</div>
                <div>
                  Brokerage: <span className="font-semibold">{BROKERAGE_NAME}</span> • {BROKER_CITY_STATE} • Main: {BROKER_PHONE} • License: {LICENSE_JURISDICTION}
                </div>
                <div className="space-x-3">
                  <a href={CONSUMER_NOTICE_URL} target="_blank" rel="noopener noreferrer" className="underline">PA Consumer Notice</a>
                  <a href={PRIVACY_URL} className="underline">Privacy</a>
                  <a href={TERMS_URL} className="underline">Terms</a>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about properties or share your phone number..."
                className="flex-1 px-3 py-2.5 sm:py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[44px]"
                style={{ fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-primary text-white px-4 sm:px-5 py-2.5 sm:py-2 rounded-md hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors min-h-[44px] min-w-[60px]"
                style={{ fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)' }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatAgent;
