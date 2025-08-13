import axios from 'axios';

// Using Aviation Stack API (free tier available)
const AVIATION_API_KEY = process.env.REACT_APP_AVIATION_STACK_API_KEY || 'YOUR_AVIATION_STACK_KEY';
const AVIATION_API_URL = 'http://api.aviationstack.com/v1';

// Fallback to mock data when API key is not available
const mockFlights = [
  {
    airline: { name: 'American Airlines' },
    flight: { number: 'AA123', iata: 'AA123' },
    departure: {
      airport: 'John F. Kennedy International Airport',
      iata: 'JFK',
      scheduled: '2024-01-15T08:00:00+00:00',
      estimated: '2024-01-15T08:00:00+00:00',
      terminal: '8',
      gate: 'A12'
    },
    arrival: {
      airport: 'Los Angeles International Airport',
      iata: 'LAX',
      scheduled: '2024-01-15T11:30:00+00:00',
      estimated: '2024-01-15T11:30:00+00:00',
      terminal: '5',
      gate: 'B8'
    },
    aircraft: { registration: 'N123AA', iata: 'B738' },
    status: 'scheduled'
  },
  {
    airline: { name: 'Delta Air Lines' },
    flight: { number: 'DL456', iata: 'DL456' },
    departure: {
      airport: 'John F. Kennedy International Airport',
      iata: 'JFK',
      scheduled: '2024-01-15T10:30:00+00:00',
      estimated: '2024-01-15T10:30:00+00:00',
      terminal: '4',
      gate: 'C15'
    },
    arrival: {
      airport: 'Los Angeles International Airport',
      iata: 'LAX',
      scheduled: '2024-01-15T14:00:00+00:00',
      estimated: '2024-01-15T14:00:00+00:00',
      terminal: '2',
      gate: 'A5'
    },
    aircraft: { registration: 'N456DL', iata: 'A320' },
    status: 'scheduled'
  },
  {
    airline: { name: 'United Airlines' },
    flight: { number: 'UA789', iata: 'UA789' },
    departure: {
      airport: 'John F. Kennedy International Airport',
      iata: 'JFK',
      scheduled: '2024-01-15T14:15:00+00:00',
      estimated: '2024-01-15T14:15:00+00:00',
      terminal: '7',
      gate: 'D3'
    },
    arrival: {
      airport: 'Los Angeles International Airport',
      iata: 'LAX',
      scheduled: '2024-01-15T17:45:00+00:00',
      estimated: '2024-01-15T17:45:00+00:00',
      terminal: '7',
      gate: 'B12'
    },
    aircraft: { registration: 'N789UA', iata: 'B739' },
    status: 'scheduled'
  }
];

export const freeFlightsAPI = {
  // Get flights between two airports
  getFlights: async (departureIata, arrivalIata, date) => {
    try {
      if (AVIATION_API_KEY === 'YOUR_AVIATION_STACK_KEY') {
        // Use mock data if no API key
        console.log('Using mock flight data');
        return Promise.resolve({
          data: {
            data: mockFlights.filter(flight => 
              flight.departure.iata === departureIata && 
              flight.arrival.iata === arrivalIata
            )
          }
        });
      }

      const response = await axios.get(`${AVIATION_API_URL}/flights`, {
        params: {
          access_key: AVIATION_API_KEY,
          dep_iata: departureIata,
          arr_iata: arrivalIata,
          flight_date: date
        }
      });

      return response;
    } catch (error) {
      console.error('Free Flights API Error:', error);
      // Fallback to mock data
      return Promise.resolve({
        data: {
          data: mockFlights.filter(flight => 
            flight.departure.iata === departureIata && 
            flight.arrival.iata === arrivalIata
          )
        }
      });
    }
  },

  // Get flight status by flight number
  getFlightStatus: async (flightNumber) => {
    try {
      if (AVIATION_API_KEY === 'YOUR_AVIATION_STACK_KEY') {
        // Use mock data if no API key
        console.log('Using mock flight status data');
        const mockFlight = mockFlights.find(flight => 
          flight.flight.number === flightNumber || 
          flight.flight.iata === flightNumber
        );
        
        return Promise.resolve({
          data: {
            data: mockFlight ? [mockFlight] : []
          }
        });
      }

      const response = await axios.get(`${AVIATION_API_URL}/flights`, {
        params: {
          access_key: AVIATION_API_KEY,
          flight_iata: flightNumber
        }
      });

      return response;
    } catch (error) {
      console.error('Free Flights Status Error:', error);
      // Fallback to mock data
      const mockFlight = mockFlights.find(flight => 
        flight.flight.number === flightNumber || 
        flight.flight.iata === flightNumber
      );
      
      return Promise.resolve({
        data: {
          data: mockFlight ? [mockFlight] : []
        }
      });
    }
  },

  // Get airports by city
  getAirports: async (city) => {
    try {
      if (AVIATION_API_KEY === 'YOUR_AVIATION_STACK_KEY') {
        // Use mock data if no API key
        console.log('Using mock airports data');
        const mockAirports = [
          { airport_name: 'John F. Kennedy International Airport', iata_code: 'JFK', city: 'New York' },
          { airport_name: 'Los Angeles International Airport', iata_code: 'LAX', city: 'Los Angeles' },
          { airport_name: 'O\'Hare International Airport', iata_code: 'ORD', city: 'Chicago' },
          { airport_name: 'Dallas/Fort Worth International Airport', iata_code: 'DFW', city: 'Dallas' },
          { airport_name: 'Hartsfield-Jackson Atlanta International Airport', iata_code: 'ATL', city: 'Atlanta' },
          { airport_name: 'San Francisco International Airport', iata_code: 'SFO', city: 'San Francisco' },
          { airport_name: 'Miami International Airport', iata_code: 'MIA', city: 'Miami' },
          { airport_name: 'Seattle-Tacoma International Airport', iata_code: 'SEA', city: 'Seattle' }
        ];
        
        return Promise.resolve({
          data: {
            data: mockAirports.filter(airport => 
              airport.city.toLowerCase().includes(city.toLowerCase())
            )
          }
        });
      }

      const response = await axios.get(`${AVIATION_API_URL}/cities`, {
        params: {
          access_key: AVIATION_API_KEY,
          search: city
        }
      });

      return response;
    } catch (error) {
      console.error('Free Flights Airports Error:', error);
      // Fallback to mock data
      const mockAirports = [
        { airport_name: 'John F. Kennedy International Airport', iata_code: 'JFK', city: 'New York' },
        { airport_name: 'Los Angeles International Airport', iata_code: 'LAX', city: 'Los Angeles' },
        { airport_name: 'O\'Hare International Airport', iata_code: 'ORD', city: 'Chicago' },
        { airport_name: 'Dallas/Fort Worth International Airport', iata_code: 'DFW', city: 'Dallas' },
        { airport_name: 'Hartsfield-Jackson Atlanta International Airport', iata_code: 'ATL', city: 'Atlanta' },
        { airport_name: 'San Francisco International Airport', iata_code: 'SFO', city: 'San Francisco' },
        { airport_name: 'Miami International Airport', iata_code: 'MIA', city: 'Miami' },
        { airport_name: 'Seattle-Tacoma International Airport', iata_code: 'SEA', city: 'Seattle' }
      ];
      
      return Promise.resolve({
        data: {
          data: mockAirports.filter(airport => 
            airport.city.toLowerCase().includes(city.toLowerCase())
          )
        }
      });
    }
  }
};
