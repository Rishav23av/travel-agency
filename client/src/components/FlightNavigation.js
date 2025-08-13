import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FlightNavigation = ({ isOpen, onClose, destination }) => {
  const [departureCity, setDepartureCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [tripType, setTripType] = useState('roundtrip');

  const popularCities = [
    'New York, USA',
    'London, UK',
    'Paris, France',
    'Tokyo, Japan',
    'Sydney, Australia',
    'Dubai, UAE',
    'Singapore',
    'Bangkok, Thailand',
    'Mumbai, India',
    'Toronto, Canada'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (departureCity && departureDate) {
      const searchParams = new URLSearchParams({
        from: departureCity,
        to: destination || '',
        departure: departureDate,
        return: returnDate,
        passengers: passengers,
        type: tripType
      });
      window.location.href = `/flights?${searchParams.toString()}`;
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">✈️ Flight Search</h2>
              <p className="text-blue-100 mt-1">Find the best flights to your destination</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Search Form */}
        <div className="p-6">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Trip Type */}
            <div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setTripType('oneway')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    tripType === 'oneway'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  One Way
                </button>
                <button
                  type="button"
                  onClick={() => setTripType('roundtrip')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    tripType === 'roundtrip'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Round Trip
                </button>
              </div>
            </div>

            {/* Flight Route */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      // Get user location logic here
                      setDepartureCity('Your Location');
                    }}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-blue-100 hover:bg-blue-200 text-blue-600 px-2 py-1 rounded text-xs font-medium transition-colors"
                  >
                    📍
                  </button>
                  <input
                    type="text"
                    value={departureCity}
                    onChange={(e) => setDepartureCity(e.target.value)}
                    placeholder="Airport code (e.g., JFK)"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <input
                  type="text"
                  value={destination || ''}
                  placeholder="Airport code (e.g., LAX)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  disabled
                />
              </div>
            </div>

            {/* Departure Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departure Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  📅
                </div>
              </div>
            </div>

            {/* Return Date (if round trip) */}
            {tripType === 'roundtrip' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📅
                  </div>
                </div>
              </div>
            )}

            {/* Passengers and Cabin Class */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Adults */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adults
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Children */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Children
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Infants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Infants
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[0, 1, 2, 3, 4].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cabin Class */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cabin Class
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="economy">Economy</option>
                  <option value="premium">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Search Flights
            </button>
          </form>

          {/* Quick Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link
                to="/flights"
                onClick={onClose}
                className="flex items-center p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <span className="text-2xl mr-3">✈️</span>
                <div>
                  <p className="font-medium text-gray-800">Browse All Flights</p>
                  <p className="text-sm text-gray-600">View available flights</p>
                </div>
              </Link>
              <Link
                to="/track-flight"
                onClick={onClose}
                className="flex items-center p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <span className="text-2xl mr-3">🛫</span>
                <div>
                  <p className="font-medium text-gray-800">Track Flight</p>
                  <p className="text-sm text-gray-600">Check flight status</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightNavigation;
