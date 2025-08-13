import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TravelCard from '../components/TravelCard';

const TravelSearch = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Check for destination parameter in URL
  useEffect(() => {
    const destinationParam = searchParams.get('destination');
    if (destinationParam) {
      setSearchQuery(destinationParam);
      setSelectedPlace(destinationParam);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      setSelectedPlace(searchQuery.trim());
      setIsSearching(false);
    }
  };

  const popularDestinations = [
    'Paris, France',
    'Tokyo, Japan',
    'New York, USA',
    'London, UK',
    'Rome, Italy',
    'Barcelona, Spain',
    'Sydney, Australia',
    'Bangkok, Thailand',
    'Dubai, UAE',
    'Singapore'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Your Next Adventure
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get comprehensive travel information, guides, and flight details for any destination
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter a destination (e.g., Paris, Tokyo, New York)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      {!selectedPlace && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Popular Destinations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {popularDestinations.map((destination, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchQuery(destination);
                  setSelectedPlace(destination);
                }}
                className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 text-left group"
              >
                <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                  {destination}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Click to explore
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Travel Card */}
      {selectedPlace && (
        <div className="py-8">
          <TravelCard placeName={selectedPlace} />
          
          {/* Back to Search Button */}
          <div className="max-w-4xl mx-auto px-6 mt-8">
            <button
              onClick={() => {
                setSelectedPlace('');
                setSearchQuery('');
              }}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Search another destination
            </button>
          </div>
        </div>
      )}

      {/* Features Section */}
      {!selectedPlace && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Everything You Need for Your Trip
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* DeepSeek AI Info */}
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI-Powered Insights
              </h3>
              <p className="text-gray-600">
                Get comprehensive destination information powered by DeepSeek AI, including attractions, culture, and travel tips.
              </p>
            </div>

            {/* Wikivoyage Content */}
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Travel Guides
              </h3>
              <p className="text-gray-600">
                Access detailed travel guides from Wikivoyage with local insights, recommendations, and practical information.
              </p>
            </div>

            {/* Flight Information */}
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Flight Details
              </h3>
              <p className="text-gray-600">
                View real-time flight information, schedules, and availability for your chosen destination.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelSearch;
