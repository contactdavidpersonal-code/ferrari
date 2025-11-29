import React, { useState, useEffect } from 'react';
import expLogo from '../assets/exp_logo (2).png';
import { InstagramPost } from '../types';
import { InstagramIcon } from '../constants';

// Mock data for development when API is not available
const mockInstagramPosts: InstagramPost[] = [
  {
    id: 'mock_1',
    caption: 'Beautiful Pittsburgh property with stunning views! 🏠✨ #PittsburghRealEstate #eXpRealty',
    media_type: 'IMAGE',
    media_url: 'https://picsum.photos/seed/instagram1/600/600',
    thumbnail_url: 'https://picsum.photos/seed/instagram1/600/600',
    permalink: 'https://www.instagram.com/p/mock1/',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_2',
    caption: 'Just listed! This charming home is perfect for families. Contact me for a private showing. 🏡',
    media_type: 'IMAGE',
    media_url: 'https://picsum.photos/seed/instagram2/600/600',
    thumbnail_url: 'https://picsum.photos/seed/instagram2/600/600',
    permalink: 'https://www.instagram.com/p/mock2/',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_3',
    caption: 'Pittsburgh market insights: Investment opportunities are growing! 📈 #RealEstateInvesting',
    media_type: 'IMAGE',
    media_url: 'https://picsum.photos/seed/instagram3/600/600',
    thumbnail_url: 'https://picsum.photos/seed/instagram3/600/600',
    permalink: 'https://www.instagram.com/p/mock3/',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_4',
    caption: 'Thank you to my amazing clients! Your trust means everything. 🙏 #ClientSuccess',
    media_type: 'IMAGE',
    media_url: 'https://picsum.photos/seed/instagram4/600/600',
    thumbnail_url: 'https://picsum.photos/seed/instagram4/600/600',
    permalink: 'https://www.instagram.com/p/mock4/',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_5',
    caption: 'New listing alert! Don\'t miss this opportunity in the heart of Pittsburgh. 🎯',
    media_type: 'IMAGE',
    media_url: 'https://picsum.photos/seed/instagram5/600/600',
    thumbnail_url: 'https://picsum.photos/seed/instagram5/600/600',
    permalink: 'https://www.instagram.com/p/mock5/',
    timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_6',
    caption: 'Pittsburgh is booming! Let\'s find your perfect property together. 💼 #PittsburghRealEstate',
    media_type: 'IMAGE',
    media_url: 'https://picsum.photos/seed/instagram6/600/600',
    thumbnail_url: 'https://picsum.photos/seed/instagram6/600/600',
    permalink: 'https://www.instagram.com/p/mock6/',
    timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const ExpRealty: React.FC = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Fetching Instagram posts from /api/instagram');
        const response = await fetch('/api/instagram');
        console.log('Instagram API response status:', response.status);
        
        // Check if response is HTML (404 page) - means API route not available
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          console.log('API route not available, using mock data for development');
          setPosts(mockInstagramPosts);
          setLoading(false);
          return;
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Instagram API error response:', errorText);
          // Fallback to mock data on error
          setPosts(mockInstagramPosts);
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        console.log('Instagram API data received:', data);
        setPosts(data.posts || mockInstagramPosts);
      } catch (err: any) {
        console.error('Error loading Instagram feed, using mock data:', err);
        // Use mock data as fallback
        setPosts(mockInstagramPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section id="partner" className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Top Section: eXp Experience Heading */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-4">
            The eXp Experience
          </h2>
          <div className="max-w-md mx-auto mb-6">
            <div className="flex justify-center items-center">
              {/* eXp Logo */}
              <img 
                src={expLogo} 
                alt="eXp Realty" 
                className="h-32 w-auto object-contain opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Instagram Grid Section */}
        {!loading && !error && posts.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
              {posts.map((post) => (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  <img
                    src={post.thumbnail_url || post.media_url}
                    alt={post.caption?.substring(0, 100) || 'Instagram post'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://picsum.photos/seed/fallback/600/600';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <InstagramIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 fill-current" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-8 flex justify-center">
            <div className="text-gray-400 text-sm">Loading Instagram feed...</div>
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

