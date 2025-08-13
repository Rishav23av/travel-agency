import axios from 'axios';

const UNSPLASH_ACCESS_KEY = 'Kdt4piWRPdhPoOPeV5Jj-Xg8FoFAym06YMTMQyN826g';
const UNSPLASH_API_URL = 'https://api.unsplash.com';

export const unsplashAPI = {
  // Search for images of a place
  searchPlaceImages: async (placeName, count = 12) => {
    try {
      const response = await axios.get(`${UNSPLASH_API_URL}/search/photos`, {
        params: {
          query: `${placeName} travel destination`,
          per_page: count,
          orientation: 'landscape'
        },
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      });

      return response.data.results.map(photo => ({
        id: photo.id,
        url: photo.urls.regular,
        thumb: photo.urls.small,
        full: photo.urls.full,
        alt: photo.alt_description || `${placeName} travel destination`,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        width: photo.width,
        height: photo.height
      }));
    } catch (error) {
      console.error('Unsplash API Error:', error);
      // Return fallback images if API fails
      return getFallbackImages(placeName, count);
    }
  },

  // Get a single featured image for a place
  getFeaturedImage: async (placeName) => {
    try {
      const response = await axios.get(`${UNSPLASH_API_URL}/search/photos`, {
        params: {
          query: `${placeName} travel`,
          per_page: 1,
          orientation: 'landscape'
        },
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      });

      if (response.data.results.length > 0) {
        const photo = response.data.results[0];
        return {
          id: photo.id,
          url: photo.urls.regular,
          full: photo.urls.full,
          alt: photo.alt_description || `${placeName} travel destination`,
          photographer: photo.user.name,
          photographerUrl: photo.user.links.html
        };
      }
      
      return null;
    } catch (error) {
      console.error('Unsplash Featured Image Error:', error);
      return null;
    }
  },

  // Get random travel images for a place
  getRandomImages: async (placeName, count = 6) => {
    try {
      const response = await axios.get(`${UNSPLASH_API_URL}/photos/random`, {
        params: {
          query: `${placeName} travel destination`,
          count: count,
          orientation: 'landscape'
        },
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      });

      return response.data.map(photo => ({
        id: photo.id,
        url: photo.urls.regular,
        thumb: photo.urls.small,
        full: photo.urls.full,
        alt: photo.alt_description || `${placeName} travel destination`,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html
      }));
    } catch (error) {
      console.error('Unsplash Random Images Error:', error);
      return getFallbackImages(placeName, count);
    }
  }
};

// Fallback images when API fails
const getFallbackImages = (placeName, count) => {
  const fallbackImages = [
    {
      id: 'fallback-1',
      url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
      thumb: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
      full: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=800&fit=crop',
      alt: `${placeName} travel destination`,
      photographer: 'Unsplash',
      photographerUrl: 'https://unsplash.com',
      width: 800,
      height: 600
    },
    {
      id: 'fallback-2',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      full: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
      alt: `${placeName} travel destination`,
      photographer: 'Unsplash',
      photographerUrl: 'https://unsplash.com',
      width: 800,
      height: 600
    },
    {
      id: 'fallback-3',
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
      thumb: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
      full: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop',
      alt: `${placeName} travel destination`,
      photographer: 'Unsplash',
      photographerUrl: 'https://unsplash.com',
      width: 800,
      height: 600
    }
  ];

  return fallbackImages.slice(0, count);
};
