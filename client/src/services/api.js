import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Packages API calls
export const packagesAPI = {
  getAll: () => api.get('/packages'),
  getById: (id) => api.get(`/packages/${id}`),
  create: (packageData) => api.post('/packages', packageData),
  update: (id, packageData) => api.put(`/packages/${id}`, packageData),
  delete: (id) => api.delete(`/packages/${id}`),
};

// Bookings API calls
export const bookingsAPI = {
  getAll: () => api.get('/bookings'),
  create: (bookingData) => api.post('/bookings', bookingData),
  update: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  delete: (id) => api.delete(`/bookings/${id}`),
};

// Flight API calls
const FLIGHT_API_KEY = process.env.REACT_APP_FLIGHT_API_KEY || '689b0813ee7a9992a776e96a';
const FLIGHT_API_BASE_URL = 'https://api.flightapi.io';

// Mock flight data for demonstration
const mockFlights = [
  {
    airlineName: 'American Airlines',
    flightNumber: 'AA123',
    origin: 'JFK',
    destination: 'LAX',
    departureTime: '2024-01-15T08:00:00Z',
    arrivalTime: '2024-01-15T11:30:00Z',
    duration: 210,
    price: 299,
    aircraft: 'Boeing 737-800'
  },
  {
    airlineName: 'Delta Air Lines',
    flightNumber: 'DL456',
    origin: 'JFK',
    destination: 'LAX',
    departureTime: '2024-01-15T10:30:00Z',
    arrivalTime: '2024-01-15T14:00:00Z',
    duration: 210,
    price: 325,
    aircraft: 'Airbus A320'
  },
  {
    airlineName: 'United Airlines',
    flightNumber: 'UA789',
    origin: 'JFK',
    destination: 'LAX',
    departureTime: '2024-01-15T14:15:00Z',
    arrivalTime: '2024-01-15T17:45:00Z',
    duration: 210,
    price: 275,
    aircraft: 'Boeing 737-900'
  }
];

const mockFlightTracking = {
  flightNumber: 'AA123',
  airlineName: 'American Airlines',
  aircraft: 'Boeing 737-800',
  origin: 'JFK',
  destination: 'LAX',
  status: 'Scheduled',
  scheduledDeparture: '2024-01-15T08:00:00Z',
  actualDeparture: null,
  scheduledArrival: '2024-01-15T11:30:00Z',
  actualArrival: null,
  gate: 'A12',
  terminal: 'Terminal 8',
  delay: null,
  remarks: 'Flight is on time'
};

export const flightAPI = {
  // Oneway Trip Search
  searchOneway: async (from, to, date, adults = 1, children = 0, infants = 0, cabinClass = 'economy') => {
    try {
      // Try real API first
      const response = await axios.get(`${FLIGHT_API_BASE_URL}/onewaytrip`, {
        params: {
          token: FLIGHT_API_KEY,
          from,
          to,
          date,
          adults,
          children,
          infants,
          cabinClass
        }
      });
      return response;
    } catch (error) {
      // Fallback to mock data
      console.log('Using mock flight data');
      return Promise.resolve({
        data: {
          legs: mockFlights.map(flight => ({
            ...flight,
            price: flight.price * adults + (flight.price * 0.7 * children) + (flight.price * 0.1 * infants)
          }))
        }
      });
    }
  },

  // Round Trip Search
  searchRoundtrip: async (from, to, departureDate, returnDate, adults = 1, children = 0, infants = 0, cabinClass = 'economy') => {
    try {
      // Try real API first
      const response = await axios.get(`${FLIGHT_API_BASE_URL}/roundtrip`, {
        params: {
          token: FLIGHT_API_KEY,
          from,
          to,
          departureDate,
          returnDate,
          adults,
          children,
          infants,
          cabinClass
        }
      });
      return response;
    } catch (error) {
      // Fallback to mock data
      console.log('Using mock flight data for round trip');
      const outboundFlights = mockFlights.map(flight => ({
        ...flight,
        price: flight.price * adults + (flight.price * 0.7 * children) + (flight.price * 0.1 * infants)
      }));
      const returnFlights = mockFlights.map(flight => ({
        ...flight,
        origin: flight.destination,
        destination: flight.origin,
        departureTime: returnDate + 'T' + flight.departureTime.split('T')[1],
        arrivalTime: returnDate + 'T' + flight.arrivalTime.split('T')[1],
        price: flight.price * adults + (flight.price * 0.7 * children) + (flight.price * 0.1 * infants)
      }));
      return Promise.resolve({
        data: {
          legs: [...outboundFlights, ...returnFlights]
        }
      });
    }
  },

  // Flight Tracking
  trackFlight: async (flightNumber) => {
    try {
      // Try real API first
      const response = await axios.get(`${FLIGHT_API_BASE_URL}/flight`, {
        params: {
          token: FLIGHT_API_KEY,
          flightNumber
        }
      });
      return response;
    } catch (error) {
      // Fallback to mock data
      console.log('Using mock flight tracking data');
      return Promise.resolve({
        data: {
          ...mockFlightTracking,
          flightNumber: flightNumber
        }
      });
    }
  },

  // Airport Schedule
  getAirportSchedule: async (airportCode, date) => {
    try {
      // Try real API first
      const response = await axios.get(`${FLIGHT_API_BASE_URL}/airport`, {
        params: {
          token: FLIGHT_API_KEY,
          airportCode,
          date
        }
      });
      return response;
    } catch (error) {
      // Fallback to mock data
      console.log('Using mock airport schedule data');
      return Promise.resolve({
        data: {
          airport: airportCode,
          date: date,
          flights: mockFlights
        }
      });
    }
  },

  // Airline & Airport Codes
  getAirlineAirportCodes: async () => {
    try {
      // Try real API first
      const response = await axios.get(`${FLIGHT_API_BASE_URL}/airline`, {
        params: {
          token: FLIGHT_API_KEY
        }
      });
      return response;
    } catch (error) {
      // Fallback to mock data
      console.log('Using mock airline/airport codes data');
      return Promise.resolve({
        data: {
          airports: [
            { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York' },
            { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles' },
            { code: 'ORD', name: 'O\'Hare International Airport', city: 'Chicago' },
            { code: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas' },
            { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta' },
            { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco' },
            { code: 'MIA', name: 'Miami International Airport', city: 'Miami' },
            { code: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle' }
          ]
        }
      });
    }
  }
};

export default api;
