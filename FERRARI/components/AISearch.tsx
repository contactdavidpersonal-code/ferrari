import React, { useEffect, useRef, useState } from 'react';
import { propertiesService } from '../lib/jsonbinService';
import { Listing } from '../types';
import { PropertyCard } from './ListingCard';
import ContactLeadModal from './ContactLeadModal';
import { PropertyQuickViewModal } from './PropertyQuickViewModal';

type ChatMessage = { role: 'assistant' | 'user'; text: string };

const SUGGESTIONS = [
  'First home under $400k near good schools',
  'Walkable condo with parking + HOA < $400/mo',
  'Duplex in Lawrenceville, 7%+ cap rate',
  'VA-eligible homes with low taxes',
  'Land for custom build north of the city',
];

const AISearch: React.FC = () => {
  const [isLeadOpen, setIsLeadOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text:
        "Hello! I'm your Pittsburgh real estate assistant, here to help you explore the market and find properties that align with your future. What's on your mind today regarding real estate in Pittsburgh?",
    },
  ]);
  const [results, setResults] = useState<Listing[]>([]);
  const [allProperties, setAllProperties] = useState<Listing[]>([]);
  const [hasAISearched, setHasAISearched] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [inferredType, setInferredType] = useState<'Residential' | 'Commercial' | 'Land' | 'Rentals' | undefined>(undefined);
  const [quickViewListing, setQuickViewListing] = useState<Listing | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isThinking, results]);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const properties = await propertiesService.getAll();
        setAllProperties(properties);
        // Show all properties by default, not filtered results
        setResults(properties);
      } catch (error) {
        console.error('Failed to load properties:', error);
      }
    };
    loadProperties();
  }, []);

  const inferPrimaryType = (text: string): 'Residential' | 'Commercial' | 'Land' | 'Rentals' | undefined => {
    const t = text.toLowerCase();
    if (/rent|lease|rental|apartment/.test(t)) return 'Rentals';
    if (/commercial|office|retail|industrial|warehouse|cap\s*rate|investment/.test(t)) return 'Commercial';
    if (/land|lot|acre|acres|build|development/.test(t)) return 'Land';
    if (/home|house|residential|condo|townhouse|single\s*family|duplex|triplex/.test(t)) return 'Residential';
    return undefined;
  };

  const searchProperties = async (query: string, conversationHistory?: string, primaryType?: 'Residential' | 'Commercial' | 'Land' | 'Rentals'): Promise<Listing[]> => {
    const all = await propertiesService.getAll();
    const q = query.toLowerCase();
    const conversation = (conversationHistory || '').toLowerCase();

    // Detect property type from conversation context (will be overridden by primaryType if provided)
    const isRental = /rental|rent|lease|apartment|monthly|shadyside.*rent/i.test(conversation) || /rental|rent|lease|apartment|monthly/i.test(q);
    const isResidential = /residential|home|house|condo|townhouse|single family/i.test(conversation) || /residential|home|house|condo|townhouse|single family/i.test(q);
    const isCommercial = /commercial|business|office|retail|investment|cap rate/i.test(conversation) || /commercial|business|office|retail|investment|cap rate/i.test(q);
    const isLand = /land|lot|vacant|build|construction|development/i.test(conversation) || /land|lot|vacant|build|construction|development/i.test(q);

    // Detect specific features from conversation
    const bedMatch = (conversation + ' ' + q).match(/(\d+)\s*(bed|bedroom|br)/i);
    const bathMatch = (conversation + ' ' + q).match(/(\d+)\s*(bath|bathroom|ba)/i);
    const sqftMatch = (conversation + ' ' + q).match(/(\d+)\s*(sqft|sq\.?\s*ft|square\s*feet)/i);
    
    const requestedBeds = bedMatch ? parseInt(bedMatch[1]) : null;
    const requestedBaths = bathMatch ? parseInt(bathMatch[1]) : null;
    const requestedSqft = sqftMatch ? parseInt(sqftMatch[1]) : null;

    // very light parsing for price anchors
    const numMatch = query.replace(/[\s,]/g, '').match(/(\$)?(\d{3,7})/);
    const priceNum = numMatch ? parseInt(numMatch[2], 10) : undefined;
    const isUnder = /under|below|max|<=/i.test(query);

    const tokens = (q + ' ' + conversation).split(/[^a-z0-9]+/).filter(Boolean);
    const locationTerms = tokens.filter((t) => t.length > 2);

    const filtered = all.filter((p) => {
      // Prefer the provided/detected primary type
      if (primaryType && p.type !== primaryType) return false;
      if (!primaryType) {
        if (isRental && p.type !== 'Rentals') return false;
        if (isResidential && p.type !== 'Residential') return false;
        if (isCommercial && p.type !== 'Commercial') return false;
        if (isLand && p.type !== 'Land') return false;
      }

      // Filter by specific features if mentioned
      if (requestedBeds && p.beds && p.beds !== requestedBeds) return false;
      if (requestedBaths && p.baths && p.baths !== requestedBaths) return false;
      if (requestedSqft && p.sqft && Math.abs(p.sqft - requestedSqft) > requestedSqft * 0.2) return false; // 20% tolerance

      const hay = [
        p.address,
        p.city,
        p.state,
        p.type,
        p.propertyStyle || '',
        (p.features || []).join(' '),
      ]
        .join(' ')
        .toLowerCase();

      const textHit = hay.includes(q);
      const priceHit = priceNum
        ? isUnder
          ? p.price <= priceNum
          : Math.abs(p.price - priceNum) / Math.max(p.price, 1) < 0.3
        : true;
      return textHit || priceHit;
    });

    // Relevance scoring & sorting
    const score = (p: Listing): number => {
      let s = 0;
      if (primaryType && p.type === primaryType) s += 50;
      // Location relevance
      const hayLoc = `${p.address} ${p.city} ${p.state}`.toLowerCase();
      locationTerms.forEach((t) => { if (hayLoc.includes(t)) s += 2; });
      // Style match
      if (p.propertyStyle) {
        const style = p.propertyStyle.toLowerCase();
        if ((conversation + ' ' + q).includes(style)) s += 6;
      }
      // Beds/Baths closeness
      if (requestedBeds && p.beds) s += (requestedBeds === p.beds ? 6 : -Math.abs(p.beds - requestedBeds));
      if (requestedBaths && p.baths) s += (requestedBaths === p.baths ? 4 : -Math.abs(p.baths - requestedBaths));
      // Price proximity
      if (priceNum && p.price) {
        const diff = Math.abs(p.price - priceNum);
        s += Math.max(0, 20 - diff / 25000);
      }
      // Newness
      s += Math.min(10, (new Date(p.listingDate || 0).getTime() / 1e12));
      return s;
    };

    const sorted = [...filtered].sort((a, b) => score(b) - score(a));
    return sorted.slice(0, 9);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await send(input);
    setInput('');
  };

  const detectAndCaptureLead = async (userMessage: string, aiReply: string, conversationHistory: ChatMessage[]) => {
    // Check if user provided contact information
    const emailMatch = userMessage.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    const phoneMatch = userMessage.match(/(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/);
    const nameMatch = userMessage.match(/(?:my name is|i'm|i am)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
    
    // Check if AI asked for contact or user expressed interest
    const aiAskedForContact = /would you like.*nicole.*reach out|can i have.*contact you|share your.*information|provide your.*email|provide your.*phone/i.test(aiReply);
    const userWantsContact = /contact.*nicole|reach out|call me|email me|yes.*contact|schedule.*viewing|interested.*property|want.*more.*info/i.test(userMessage);
    
    if ((emailMatch || phoneMatch || nameMatch) && (aiAskedForContact || userWantsContact)) {
      try {
        const leadData = {
          name: nameMatch ? nameMatch[1] : 'AI Chat Lead',
          email: emailMatch ? emailMatch[1] : '',
          phone: phoneMatch ? phoneMatch[1].replace(/[-.\s]/g, '') : '',
          message: 'Lead captured from AI conversation',
          source: 'AI Chat',
          conversationHistory: conversationHistory.map(m => ({ role: m.role, text: m.text })),
          propertiesInterested: results.slice(0, 3).map(p => ({
            address: p.address,
            city: p.city,
            state: p.state,
            price: p.price,
            beds: p.beds,
            baths: p.baths
          }))
        };

        // Save to database and send email (consolidated endpoint)
        const leadsResponse = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData)
        });

        if (leadsResponse.ok) {
          const { leadId } = await leadsResponse.json();
          console.log('✅ Lead captured and email sent:', leadId);
        }
      } catch (error) {
        console.error('❌ Failed to capture lead:', error);
      }
    }
  };

  const send = async (raw?: string) => {
    const value = (raw ?? inputRef.current?.value ?? '').trim();
    if (!value) return;
    // Build next state locally so parsing includes the latest user message
    const nextMessages = [...messages, { role: 'user', text: value }];
    setMessages(nextMessages);
    setIsThinking(true);
    try {
      // Always use LLM for conversational responses
      const llmReply = await generateConversationalReply(value);
      
      // Always search properties after first user message to give AI properties to work with
      const isPropertyQuery = /home|house|property|rental|commercial|land|price|budget|buy|sell|listing|under|below|around|between|bedroom|bathroom|sqft|square|feet/i.test(value);
      const shouldShowResults = messages.length >= 2 || isPropertyQuery; // Show results after first exchange
      
      if (shouldShowResults) {
        const conversationHistory = nextMessages.map(m => `${m.role}: ${m.text}`).join('\n');
        const primary = inferPrimaryType(conversationHistory) || inferredType;
        if (primary && primary !== inferredType) setInferredType(primary);
        const found = await searchProperties(value, conversationHistory, primary);
        setResults(found);
        setHasAISearched(true);
      }
      
      const updatedMessages = [...nextMessages, { role: 'assistant', text: llmReply }];
      setMessages(updatedMessages);
      
      // Detect and capture leads
      await detectAndCaptureLead(value, llmReply, updatedMessages);
    } catch (e) {
      console.error('Send error:', e);
      setMessages((m) => [...m, { role: 'assistant', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsThinking(false);
    }
  };

  const generateConversationalReply = async (query: string): Promise<string> => {
    try {
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
      console.log('🤖 Gemini API Key present:', !!apiKey);
      
      if (!apiKey) {
        console.log('❌ No Gemini API key found');
        return "Hi there! I'm here to help you find your perfect Pittsburgh property. What brings you to our beautiful city?";
      }

      console.log('🤖 Calling Gemini API with query:', query);
      
      // Get conversation history for context
      const conversationHistory = messages.map(m => `${m.role}: ${m.text}`).join('\n');
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Nicole's friendly AI real estate assistant for Pittsburgh properties. Your goal is to have a natural, helpful conversation and assist users in discovering properties that fit their needs.

Available properties on the site:
- 123 Main St, Lawrenceville - $350,000 (Residential, 3 bed, 2 bath, 1800 sqft, Craftsman, 1955)
- 456 Butler St, Squirrel Hill - $425,000 (Residential, 4 bed, 3 bath, 2400 sqft, Colonial, 1920) 
- 789 Penn Ave, Bloomfield - $299,000 (Residential, 3 bed, 1 bath, 1500 sqft, Bungalow, 1970)
- 100 Commercial Blvd, Pittsburgh - $850,000 (Commercial, 5000 sqft, Office Building, 1995)
- 200 Land Development Rd, Cranberry - $150,000 (Land, 2.5 acres, Vacant Land)
- 555 Rental Ave, Shadyside - $2,800/month (Rental, 2 bed, 1 bath, 1200 sqft, Apartment, 1980)

Conversation so far:
${conversationHistory}

User just said: "${query}"

Your approach:
1. Be conversational and natural - let the user guide the conversation
2. If they just say "hi" or "hello", respond warmly and ask what brings them to Pittsburgh real estate
3. If they mention specific needs (bedrooms, bathrooms, budget, location), acknowledge those and show relevant properties
4. When they mention features like "3 bedroom" or "under $400k", highlight properties that match those exact criteria
5. Share interesting facts about Pittsburgh's market when relevant
6. Be helpful without being pushy
7. If they seem interested in a property, highlight its unique features
8. Keep responses under 100 words and conversational
9. IMPORTANT: After showing properties or discussing their needs, naturally ask if they'd like Nicole to reach out personally. Say something like: "Would you like me to have Nicole contact you directly about these properties? I can pass along your information."
10. If they ask how to contact Nicole or express interest in being contacted, politely ask for their name, email, or phone number

Be warm, knowledgeable, and let the conversation flow naturally. When users specify features like bedrooms, bathrooms, or budget, make sure to acknowledge those specific requirements and show them the best matching properties.`
            }]
          }]
        })
      });

      console.log('🤖 Gemini API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🤖 Gemini API error:', response.status, errorText);
        return "Great! I'd love to help you find the perfect property. What's your budget range?";
      }
      
      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Great! I'd love to help you find the perfect property. What's your budget range?";
      console.log('🤖 Gemini API reply:', reply);
      return reply;
    } catch (e) {
      console.error('LLM error:', e);
      return "Great! I'd love to help you find the perfect property. What's your budget range?";
    }
  };

  const generateAssistantReply = async (query: string, results: Listing[]): Promise<string | null> => {
    try {
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
      console.log('🤖 Gemini API Key present:', !!apiKey);
      
      if (!apiKey) {
        console.log('❌ No Gemini API key found');
        return null;
      }

      console.log('🤖 Calling Gemini API with query:', query, 'and', results.length, 'results');
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Nicole's AI real estate assistant for Pittsburgh properties. Your goal is to be conversational, helpful, and guide users toward contacting Nicole for personalized service.

User asked: "${query}"
I found ${results.length} matching properties.

Available properties: ${results.map(p => `${p.address}, ${p.city} - $${p.price.toLocaleString()} (${p.type}, ${p.beds} bed${p.beds > 1 ? 's' : ''}, ${p.baths} bath${p.baths > 1 ? 's' : ''})`).join('; ')}

Respond conversationally and:
1. Acknowledge their specific needs
2. Highlight the best 1-2 properties that match their criteria
3. Mention unique features or value propositions
4. Suggest next steps (viewing, more details, etc.)
5. Gently guide them to contact Nicole for personalized service
6. Keep it warm, professional, and under 120 words

Be enthusiastic about Pittsburgh's market and Nicole's expertise.`
            }]
          }]
        })
      });

      console.log('🤖 Gemini API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🤖 Gemini API error:', response.status, errorText);
        return null;
      }
      
      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
      console.log('🤖 Gemini API reply:', reply);
      return reply;
    } catch (e) {
      console.error('LLM error:', e);
      return null;
    }
  };

  return (
    <section data-section="custom-search" className="w-full min-h-screen bg-white">
      <div className="max-w-[95%] xl:max-w-[98%] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
        {/* Chat Interface - Above Properties */}
        <div 
          className="relative bg-white border border-accent/30 mb-4 sm:mb-6 md:mb-8 rounded-2xl sm:rounded-3xl overflow-hidden max-w-[95%] xl:max-w-[98%] mx-auto"
          style={{
            filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.088)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.066))',
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.066), 0 0 60px rgba(0, 0, 0, 0.044), inset 0 0 20px rgba(255, 255, 255, 0.111), 0 4px 20px rgba(0, 0, 0, 0.056)',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-accent animate-pulse opacity-80"></div>
          {/* Chat Header */}
          <div className="p-3 sm:p-4 border-b border-accent/30 bg-primary">
            <div className="text-center">
              <h3 className="font-serif font-bold text-white" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>Want to see what Pittsburgh has for you?</h3>
            </div>
          </div>

          {/* Chat Messages */}
          <div ref={scrollRef} className="p-2 sm:p-3 overflow-y-auto space-y-2 sm:space-y-3" style={{ maxHeight: 'clamp(100px, 20vh, 200px)', minHeight: 'clamp(100px, 17.5vh, 175px)' }}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    m.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-accent/10 text-charcoal border border-accent/20'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-accent/10 text-charcoal border border-accent/20 p-3 rounded-2xl">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-2.5 sm:p-3 border-t border-accent/20 bg-white">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-charcoal/50">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="What kind of property are you looking for?"
                  className="w-full pl-8 sm:pl-9 pr-3 py-2.5 sm:py-2 bg-white border border-charcoal/20 focus:outline-none focus:ring-1 focus:ring-primary/50 rounded-xl min-h-[44px]"
                  style={{ fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)' }}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="px-4 sm:px-5 py-2.5 sm:py-2 bg-primary text-white font-semibold hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary/60 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl min-h-[44px] min-w-[60px]"
                style={{ fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)' }}
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Send'
                )}
              </button>
            </form>
            
          </div>
        </div>

        {/* Properties Section - Full Width */}
        <div 
          className="bg-white/95 backdrop-blur-sm border border-accent/20 p-3 sm:p-4 md:p-6 relative overflow-visible rounded-2xl sm:rounded-3xl"
          style={{
            filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.066)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.044))',
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.056), 0 0 60px rgba(0, 0, 0, 0.034), inset 0 0 20px rgba(255, 255, 255, 0.088), 0 4px 20px rgba(0, 0, 0, 0.044)',
          }}
        >
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <div className="w-full flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="font-serif text-primary text-center font-bold" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
                {hasAISearched ? 'Matching Properties' : 'All Properties'}
              </h2>
              {results.length > 0 ? (
                <span className="bg-gradient-to-r from-accent to-accent-light text-white px-3 sm:px-4 py-1.5 sm:py-2 font-semibold shadow-md rounded-lg" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                  {results.length}
                </span>
              ) : (
                <div className="w-8 sm:w-10 h-8 sm:h-10"></div>
              )}
            </div>
            {hasAISearched && (
              <button
                onClick={() => {
                  setResults(allProperties);
                  setHasAISearched(false);
                }}
                className="text-primary hover:text-primary/80 font-medium bg-white border border-primary/20 px-5 sm:px-6 py-2 rounded-lg hover:bg-primary/5 transition-all duration-200 min-h-[44px]"
                style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
              >
                Show All Properties
              </button>
            )}
          </div>
          
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 350px)', minHeight: '780px' }}>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-stretch">
                {results.map((property) => (
                  <div 
                    key={property.id} 
                    className="transform transition-all duration-300 hover:scale-[1.03] h-full relative overflow-visible"
                    style={{
                      filter: 'drop-shadow(0 6px 20px rgba(0, 0, 0, 0.15)) drop-shadow(0 3px 10px rgba(0, 0, 0, 0.1))',
                    }}
                  >
                    <PropertyCard listing={property} onOpenQuickView={setQuickViewListing} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-charcoal-light text-lg mb-2">No properties found</p>
                <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <PropertyQuickViewModal
        listing={quickViewListing}
        isOpen={!!quickViewListing}
        onClose={() => setQuickViewListing(null)}
      />
      <ContactLeadModal isOpen={isLeadOpen} onClose={() => setIsLeadOpen(false)} />
    </section>
  );
};

export default AISearch;