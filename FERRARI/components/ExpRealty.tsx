import React, { useState, useEffect } from 'react';
import expLogo from '../assets/exp_logo (2).png';
import { InstagramPost } from '../types';
import { InstagramIcon } from '../constants';

// Mock data for development when API is not available - 12 posts for 2 rows
const mockInstagramPosts: InstagramPost[] = [
  {
    id: 'mock_1',
    caption: 'Beautiful Pittsburgh property with stunning views! 🏠✨ #PittsburghRealEstate #eXpRealty',
    media_type: 'IMAGE',
    media_url: 'https://picsum.photos/seed/instagram1/600/1000',
    thumbnail_url: 'https://picsum.photos/seed/instagram1/600/1000',
    permalink: 'https://www.instagram.com/p/mock1/',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_2',
    caption: 'Just listed! This charming home is perfect for families. Contact me for a private showing. 🏡',
    media_type: 'IMAGE',
    media_url: 'https://picsum.photos/seed/instagram2/600/1000',
    thumbnail_url: 'https://picsum.photos/seed/instagram2/600/1000',
    permalink: 'https://www.instagram.com/p/mock2/',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_3',
    caption: 'Pittsburgh market insights: Investment opportunities are growing! 📈 #RealEstateInvesting',
    media_type: 'IMAGE',
    media_url: 'https://picsum.photos/seed/instagram3/600/1000',
    thumbnail_url: 'https://picsum.photos/seed/instagram3/600/1000',
    permalink: 'https://www.instagram.com/p/mock3/',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_4',
    caption: 'Thank you to my amazing clients! Your trust means everything. 🙏 #ClientSuccess',
    media_type: 'IMAGE',
    media_url: 'https://picsum.photos/seed/instagram4/600/1000',
    thumbnail_url: 'https://picsum.photos/seed/instagram4/600/1000',
    permalink: 'https://www.instagram.com/p/mock4/',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_5',
    caption: 'New listing alert! Don\'t miss this opportunity in the heart of Pittsburgh. 🎯',
    media_type: 'IMAGE',
    media_url: 'https://picsum.photos/seed/instagram5/600/1000',
    thumbnail_url: 'https://picsum.photos/seed/instagram5/600/1000',
    permalink: 'https://www.instagram.com/p/mock5/',
    timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_6',
    caption: 'Pittsburgh is booming! Let\'s find your perfect property together. 💼 #PittsburghRealEstate',
    media_type: 'IMAGE',
    media_url: 'https://picsum.photos/seed/instagram6/600/1000',
    thumbnail_url: 'https://picsum.photos/seed/instagram6/600/1000',
    permalink: 'https://www.instagram.com/p/mock6/',
    timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_7',
    caption: 'Luxury living in the heart of the city! Modern amenities and stunning architecture. 🏙️',
    media_type: 'IMAGE',
    media_url: 'https://picsum.photos/seed/instagram7/600/1000',
    thumbnail_url: 'https://picsum.photos/seed/instagram7/600/1000',
    permalink: 'https://www.instagram.com/p/mock7/',
    timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_8',
    caption: 'Investment opportunity: High ROI properties available now! 📊 #RealEstateInvesting',
    media_type: 'IMAGE',
    media_url: 'https://picsum.photos/seed/instagram8/600/1000',
    thumbnail_url: 'https://picsum.photos/seed/instagram8/600/1000',
    permalink: 'https://www.instagram.com/p/mock8/',
    timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_9',
    caption: 'Historic charm meets modern convenience. Explore Pittsburgh\'s finest properties! 🏛️',
    media_type: 'IMAGE',
    media_url: 'https://picsum.photos/seed/instagram9/600/1000',
    thumbnail_url: 'https://picsum.photos/seed/instagram9/600/1000',
    permalink: 'https://www.instagram.com/p/mock9/',
    timestamp: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_10',
    caption: 'Your dream home awaits! Schedule a viewing today. 🗓️ #DreamHome',
    media_type: 'IMAGE',
    media_url: 'https://picsum.photos/seed/instagram10/600/1000',
    thumbnail_url: 'https://picsum.photos/seed/instagram10/600/1000',
    permalink: 'https://www.instagram.com/p/mock10/',
    timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_11',
    caption: 'Commercial space available in prime location! Perfect for your business. 💼',
    media_type: 'IMAGE',
    media_url: 'https://picsum.photos/seed/instagram11/600/1000',
    thumbnail_url: 'https://picsum.photos/seed/instagram11/600/1000',
    permalink: 'https://www.instagram.com/p/mock11/',
    timestamp: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_12',
    caption: 'Pittsburgh real estate market update: Trends and opportunities! 📈',
    media_type: 'IMAGE',
    media_url: 'https://picsum.photos/seed/instagram12/600/1000',
    thumbnail_url: 'https://picsum.photos/seed/instagram12/600/1000',
    permalink: 'https://www.instagram.com/p/mock12/',
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const ExpRealty: React.FC = () => {
  // Initialize with mock data immediately so frame is visible right away
  const [posts, setPosts] = useState<InstagramPost[]>(mockInstagramPosts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/instagram');
        
        // Check if response is HTML (404 page) - means API route not available
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          // Keep mock data for development
          return;
        }
        
        if (!response.ok) {
          // Keep mock data, already set
          return;
        }
        
        const data = await response.json();
        // Only update if we got real data
        if (data.posts && data.posts.length > 0) {
          setPosts(data.posts);
        }
      } catch (err: any) {
        // Silently use mock data in development
      }
    };

    fetchPosts();
  }, []);

  return (
    <section id="partner" className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Top Section: eXp Logo */}
        <div className="text-center mb-8">
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex justify-center items-center overflow-visible" style={{ minHeight: '200px' }}>
              {/* eXp Logo - 2x bigger, fully visible */}
              <img 
                src={expLogo} 
                alt="eXp Realty" 
                className="h-128 w-auto object-contain opacity-80"
                style={{ height: '256px' }}
              />
            </div>
          </div>
        </div>

        {/* Instagram Grid Section - 2 Rows, 12 Cards Total */}
        {posts.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 max-w-7xl mx-auto">
              {posts.slice(0, 12).map((post) => (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-visible"
                  style={{
                    filter: 'drop-shadow(0 12px 32px rgba(0, 0, 0, 0.2)) drop-shadow(0 6px 16px rgba(0, 0, 0, 0.15))',
                  }}
                >
                  <div 
                    className="relative aspect-[3/5] overflow-hidden bg-gray-200 transition-all duration-300 group-hover:scale-[1.08] group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
                    style={{
                      clipPath: 'polygon(12% 0%, 88% 0%, 100% 12%, 100% 88%, 88% 100%, 12% 100%, 0% 88%, 0% 12%)',
                      boxShadow: '0 0 30px rgba(0, 0, 0, 0.15), 0 0 60px rgba(0, 0, 0, 0.08), inset 0 0 30px rgba(255, 255, 255, 0.15), 0 4px 20px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <img
                      src={post.thumbnail_url || post.media_url}
                      alt={post.caption?.substring(0, 100) || 'Instagram post'}
                      className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
                      loading="lazy"
                      style={{ imageRendering: 'crisp-edges' }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/seed/fallback/600/1000';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/25 group-hover:from-black/15 group-hover:via-black/8 group-hover:to-black/35 transition-all duration-300 flex items-center justify-center">
                      <InstagramIcon className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 fill-current drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]" />
                    </div>
                    {/* Sharp glow effect overlay */}
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 20%, transparent 80%, rgba(255,255,255,0.05) 100%)',
                        boxShadow: 'inset 0 0 40px rgba(255, 255, 255, 0.2)',
                      }}
                    ></div>
                    {/* Sharp edge highlight */}
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-30"
                      style={{
                        clipPath: 'polygon(12% 0%, 88% 0%, 100% 12%, 100% 88%, 88% 100%, 12% 100%, 0% 88%, 0% 12%)',
                        boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.3)',
                      }}
                    ></div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}


        {/* Bottom Section: Copyright */}
        <div className="text-center">
          <p className="text-xs text-gray-400 max-w-lg mx-auto">
            © {new Date().getFullYear()} eXp Realty, LLC. Each office is independently owned and operated. eXp Realty is an Equal Housing Opportunity brokerage.
          </p>
        </div>
      </div>
    </section>
  );
};

