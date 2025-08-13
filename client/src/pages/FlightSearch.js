import React, { useState, useEffect } from 'react';
import { flightAPI } from '../services/api';
import './FlightSearch.css';

const FlightSearch = () => {
  const [searchType, setSearchType] = useState('oneway');
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: 'economy'
  });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    // Load airport codes on component mount
    loadAirportCodes();
  }, []);

  const loadAirportCodes = async () => {
    try {
      const response = await flightAPI.getAirlineAirportCodes();
      if (response.data && response.data.airports) {
        setAirports(response.data.airports);
      }
    } catch (error) {
      console.error('Error loading airport codes:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFlights([]);

    try {
      let response;
      if (searchType === 'oneway') {
        response = await flightAPI.searchOneway(
          formData.from,
          formData.to,
          formData.departureDate,
          formData.adults,
          formData.children,
          formData.infants,
          formData.cabinClass
        );
      } else {
        response = await flightAPI.searchRoundtrip(
          formData.from,
          formData.to,
          formData.departureDate,
          formData.returnDate,
          formData.adults,
          formData.children,
          formData.infants,
          formData.cabinClass
        );
      }

      if (response.data && response.data.legs) {
        setFlights(response.data.legs);
      } else {
        setError('No flights found for the selected criteria');
      }
    } catch (error) {
      console.error('Flight search error:', error);
      if (error.response?.status === 410) {
        setError('No flights available for the selected dates');
      } else if (error.response?.status === 429) {
        setError('API rate limit exceeded. Please try again later.');
      } else {
        setError('Error searching for flights. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="flight-search">
      <div className="flight-search-header">
        <h1>Flight Search</h1>
        <p>Find the best flights for your journey</p>
      </div>

      <div className="search-container">
        <div className="search-type-toggle">
          <button
            className={`toggle-btn ${searchType === 'oneway' ? 'active' : ''}`}
            onClick={() => setSearchType('oneway')}
          >
            One Way
          </button>
          <button
            className={`toggle-btn ${searchType === 'roundtrip' ? 'active' : ''}`}
            onClick={() => setSearchType('roundtrip')}
          >
            Round Trip
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flight-search-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="from">From</label>
              <input
                type="text"
                id="from"
                name="from"
                value={formData.from}
                onChange={handleChange}
                placeholder="Airport code (e.g., JFK)"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="to">To</label>
              <input
                type="text"
                id="to"
                name="to"
                value={formData.to}
                onChange={handleChange}
                placeholder="Airport code (e.g., LAX)"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="departureDate">Departure Date</label>
              <input
                type="date"
                id="departureDate"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                required
              />
            </div>

            {searchType === 'roundtrip' && (
              <div className="form-group">
                <label htmlFor="returnDate">Return Date</label>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="adults">Adults</label>
              <select
                id="adults"
                name="adults"
                value={formData.adults}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="children">Children</label>
              <select
                id="children"
                name="children"
                value={formData.children}
                onChange={handleChange}
              >
                {[0, 1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="infants">Infants</label>
              <select
                id="infants"
                name="infants"
                value={formData.infants}
                onChange={handleChange}
              >
                {[0, 1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cabinClass">Cabin Class</label>
              <select
                id="cabinClass"
                name="cabinClass"
                value={formData.cabinClass}
                onChange={handleChange}
              >
                <option value="economy">Economy</option>
                <option value="premium">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>
          </div>

          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search Flights'}
          </button>
        </form>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {flights.length > 0 && (
        <div className="flights-results">
          <h2>Available Flights</h2>
          <div className="flights-grid">
            {flights.map((flight, index) => (
              <div key={index} className="flight-card">
                <div className="flight-header">
                  <div className="airline-info">
                    <h3>{flight.airlineName || 'Airline'}</h3>
                    <p>Flight {flight.flightNumber}</p>
                  </div>
                  <div className="flight-price">
                    <span className="price">{formatPrice(flight.price || 0)}</span>
                  </div>
                </div>

                <div className="flight-details">
                  <div className="flight-route">
                    <div className="departure">
                      <span className="time">{formatTime(flight.departureTime)}</span>
                      <span className="airport">{flight.origin}</span>
                    </div>
                    <div className="flight-duration">
                      <div className="duration-line"></div>
                      <span className="duration">{formatDuration(flight.duration || 0)}</span>
                    </div>
                    <div className="arrival">
                      <span className="time">{formatTime(flight.arrivalTime)}</span>
                      <span className="airport">{flight.destination}</span>
                    </div>
                  </div>
                </div>

                <div className="flight-footer">
                  <button className="select-flight-btn">
                    Select Flight
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
