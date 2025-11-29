import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock data for when API credentials are not configured - 12 posts for 2 rows
const mockInstagramPosts = [
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const userId = process.env.INSTAGRAM_USER_ID;
    
    // If credentials are not configured, return mock data
    if (!accessToken || !userId) {
      console.log('Instagram API: Using mock data (credentials not configured)');
      return res.status(200).json({ posts: mockInstagramPosts });
    }

    // Fetch recent media from Instagram Graph API
    const mediaResponse = await fetch(
      `https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&limit=12&access_token=${accessToken}`
    );

    if (!mediaResponse.ok) {
      const errorData = await mediaResponse.json().catch(() => ({}));
      console.error('Instagram API error:', errorData);
      // Fallback to mock data on API error
      return res.status(200).json({ posts: mockInstagramPosts });
    }

    const mediaData = await mediaResponse.json();
    
    // Fetch additional details for each post
    const posts = await Promise.all(
      mediaData.data.slice(0, 12).map(async (post: any) => {
        try {
          const postResponse = await fetch(
            `https://graph.instagram.com/${post.id}?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`
          );
          if (postResponse.ok) {
            return await postResponse.json();
          }
          // If individual post fetch fails, use the data from media list
          return post;
        } catch (err) {
          console.error(`Error fetching post ${post.id}:`, err);
          return post;
        }
      })
    );

    return res.status(200).json({ posts });
  } catch (error: any) {
    console.error('Error fetching Instagram posts:', error);
    // Return mock data on any error
    return res.status(200).json({ posts: mockInstagramPosts });
  }
}

