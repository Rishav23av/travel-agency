import axios from 'axios';

export const locationAPI = {
  // Get user's current location
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  },

  // Reverse geocoding to get city name from coordinates
  getCityFromCoords: async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      
      return {
        city: response.data.city || response.data.locality,
        country: response.data.countryName,
        countryCode: response.data.countryCode,
        latitude,
        longitude
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Fallback to default location
      return {
        city: 'New York',
        country: 'United States',
        countryCode: 'US',
        latitude: 40.7128,
        longitude: -74.0060
      };
    }
  },

  // Get user's location with city name
  getUserLocation: async () => {
    try {
      const coords = await locationAPI.getCurrentLocation();
      const location = await locationAPI.getCityFromCoords(coords.latitude, coords.longitude);
      return location;
    } catch (error) {
      console.error('Error getting user location:', error);
      // Return default location
      return {
        city: 'New York',
        country: 'United States',
        countryCode: 'US',
        latitude: 40.7128,
        longitude: -74.0060
      };
    }
  },

  // Get nearby airports for a location
  getNearbyAirports: async (city, countryCode) => {
    try {
      // Mock data for nearby airports - in real app, you'd use an airport API
      const airports = {
        'New York': [
          { code: 'JFK', name: 'John F. Kennedy International Airport', distance: '15 km' },
          { code: 'LGA', name: 'LaGuardia Airport', distance: '12 km' },
          { code: 'EWR', name: 'Newark Liberty International Airport', distance: '20 km' }
        ],
        'London': [
          { code: 'LHR', name: 'Heathrow Airport', distance: '24 km' },
          { code: 'LGW', name: 'Gatwick Airport', distance: '45 km' },
          { code: 'STN', name: 'Stansted Airport', distance: '48 km' }
        ],
        'Paris': [
          { code: 'CDG', name: 'Charles de Gaulle Airport', distance: '25 km' },
          { code: 'ORY', name: 'Orly Airport', distance: '13 km' },
          { code: 'BVA', name: 'Beauvais Airport', distance: '85 km' }
        ],
        'Tokyo': [
          { code: 'NRT', name: 'Narita International Airport', distance: '60 km' },
          { code: 'HND', name: 'Haneda Airport', distance: '14 km' }
        ],
        'Sydney': [
          { code: 'SYD', name: 'Sydney Airport', distance: '8 km' },
          { code: 'BNE', name: 'Brisbane Airport', distance: '750 km' }
        ]
      };

      return airports[city] || [
        { code: 'JFK', name: 'John F. Kennedy International Airport', distance: '15 km' },
        { code: 'LGA', name: 'LaGuardia Airport', distance: '12 km' }
      ];
    } catch (error) {
      console.error('Error getting nearby airports:', error);
      return [];
    }
  }
};
