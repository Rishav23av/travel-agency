import React, { useState } from 'react';
import { flightAPI } from '../services/api';
import './FlightTracker.css';

const FlightTracker = () => {
  const [flightNumber, setFlightNumber] = useState('');
  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!flightNumber.trim()) {
      setError('Please enter a flight number');
      return;
    }

    setLoading(true);
    setError('');
    setFlightData(null);

    try {
      const response = await flightAPI.trackFlight(flightNumber);
      if (response.data) {
        setFlightData(response.data);
      } else {
        setError('No flight data found for this flight number');
      }
    } catch (error) {
      console.error('Flight tracking error:', error);
      if (error.response?.status === 404) {
        setError('Flight not found. Please check the flight number.');
      } else if (error.response?.status === 429) {
        setError('API rate limit exceeded. Please try again later.');
      } else {
        setError('Error tracking flight. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return '#28a745';
      case 'boarding':
        return '#ffc107';
      case 'departed':
        return '#17a2b8';
      case 'arrived':
        return '#28a745';
      case 'delayed':
        return '#dc3545';
      case 'cancelled':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="flight-tracker">
      <div className="flight-tracker-header">
        <h1>Flight Tracker</h1>
        <p>Track your flight in real-time</p>
      </div>

      <div className="tracker-container">
        <form onSubmit={handleSubmit} className="tracker-form">
          <div className="form-group">
            <label htmlFor="flightNumber">Flight Number</label>
            <div className="input-group">
              <input
                type="text"
                id="flightNumber"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                placeholder="Enter flight number (e.g., AA123)"
                required
              />
              <button type="submit" className="track-btn" disabled={loading}>
                {loading ? 'Tracking...' : 'Track Flight'}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {flightData && (
          <div className="flight-info">
            <div className="flight-header">
              <h2>Flight {flightData.flightNumber}</h2>
              <div 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(flightData.status) }}
              >
                {flightData.status || 'Unknown'}
              </div>
            </div>

            <div className="flight-details-grid">
              <div className="detail-card">
                <h3>Airline</h3>
                <p>{flightData.airlineName || 'N/A'}</p>
              </div>

              <div className="detail-card">
                <h3>Aircraft</h3>
                <p>{flightData.aircraft || 'N/A'}</p>
              </div>

              <div className="detail-card">
                <h3>Origin</h3>
                <p>{flightData.origin || 'N/A'}</p>
              </div>

              <div className="detail-card">
                <h3>Destination</h3>
                <p>{flightData.destination || 'N/A'}</p>
              </div>

              <div className="detail-card">
                <h3>Scheduled Departure</h3>
                <p>{formatTime(flightData.scheduledDeparture)}</p>
                <small>{formatDate(flightData.scheduledDeparture)}</small>
              </div>

              <div className="detail-card">
                <h3>Actual Departure</h3>
                <p>{formatTime(flightData.actualDeparture)}</p>
                <small>{formatDate(flightData.actualDeparture)}</small>
              </div>

              <div className="detail-card">
                <h3>Scheduled Arrival</h3>
                <p>{formatTime(flightData.scheduledArrival)}</p>
                <small>{formatDate(flightData.scheduledArrival)}</small>
              </div>

              <div className="detail-card">
                <h3>Actual Arrival</h3>
                <p>{formatTime(flightData.actualArrival)}</p>
                <small>{formatDate(flightData.actualArrival)}</small>
              </div>

              <div className="detail-card">
                <h3>Gate</h3>
                <p>{flightData.gate || 'N/A'}</p>
              </div>

              <div className="detail-card">
                <h3>Terminal</h3>
                <p>{flightData.terminal || 'N/A'}</p>
              </div>
            </div>

            {flightData.delay && (
              <div className="delay-info">
                <h3>Delay Information</h3>
                <p>Flight is delayed by {flightData.delay} minutes</p>
              </div>
            )}

            {flightData.remarks && (
              <div className="remarks">
                <h3>Remarks</h3>
                <p>{flightData.remarks}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightTracker;
