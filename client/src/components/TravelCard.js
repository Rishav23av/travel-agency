import React, { useState, useEffect } from 'react';
import { wikivoyageAPI } from '../services/wikivoyageAPI';
import { unsplashAPI } from '../services/unsplashAPI';
import { freeFlightsAPI } from '../services/freeFlightsAPI';
import { locationAPI } from '../services/locationAPI';
import { getDestinationDetails } from '../services/destinationData';
import FlightNavigation from './FlightNavigation';

const TravelCard = ({ placeName, departureCity = 'New York' }) => {
  const [wikivoyageContent, setWikivoyageContent] = useState(null);
  const [travelTips, setTravelTips] = useState([]);
  const [images, setImages] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyAirports, setNearbyAirports] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [destinationDetails, setDestinationDetails] = useState(null);
  const [showFlightNav, setShowFlightNav] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError('');

      try {
        // Fetch data from all APIs in parallel for better performance
        const [wikivoyageData, travelTipsData, imagesData, featuredImageData] = await Promise.allSettled([
          wikivoyageAPI.getTravelGuide(placeName),
          wikivoyageAPI.getTravelTips(placeName),
          unsplashAPI.searchPlaceImages(placeName, 12),
          unsplashAPI.getFeaturedImage(placeName)
        ]);

        // Handle Wikivoyage data
        if (wikivoyageData.status === 'fulfilled' && wikivoyageData.value) {
          setWikivoyageContent(wikivoyageData.value);
        }

        // Handle travel tips
        if (travelTipsData.status === 'fulfilled') {
          setTravelTips(travelTipsData.value || []);
        }

        // Handle images
        if (imagesData.status === 'fulfilled') {
          setImages(imagesData.value || []);
        }

        // Handle featured image
        if (featuredImageData.status === 'fulfilled') {
          setFeaturedImage(featuredImageData.value);
        }

      } catch (error) {
        console.error('Error fetching travel data:', error);
        setError('Failed to load travel information');
      } finally {
        setLoading(false);
      }
    };

    if (placeName) {
      fetchAllData();
      // Get destination details
      const details = getDestinationDetails(placeName);
      setDestinationDetails(details);
    }
  }, [placeName]);

  // Get user location and nearby airports
  const getUserLocation = async () => {
    setLocationLoading(true);
    try {
      const location = await locationAPI.getUserLocation();
      setUserLocation(location);
      
      const airports = await locationAPI.getNearbyAirports(location.city, location.countryCode);
      setNearbyAirports(airports);
      
      // Fetch flights from user's location to destination
      if (airports.length > 0) {
        const flightsData = await freeFlightsAPI.getFlights(airports[0].code, 'LAX', '2024-01-15');
        setFlights(flightsData.data.data || []);
      }
    } catch (error) {
      console.error('Error getting user location:', error);
      // Use default flights
      const flightsData = await freeFlightsAPI.getFlights('JFK', 'LAX', '2024-01-15');
      setFlights(flightsData.data.data || []);
    } finally {
      setLocationLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    try {
      return new Date(timeString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return timeString;
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="ml-4 text-lg text-gray-600">Loading travel information for {placeName}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="travel-card">
      {/* Header */}
      <div className="travel-header">
        <h1 className="travel-title">{placeName}</h1>
        <p className="travel-subtitle">Discover amazing destinations and plan your perfect trip</p>
      </div>

      {/* Tabs */}
      <div className="travel-tabs">
        <div className="tab-nav">
          {['overview', 'travel-guide', 'gallery', 'flights'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab - Featured Image and Description */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Featured Image */}
            {featuredImage && (
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src={featuredImage.url} 
                  alt={featuredImage.alt}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white text-sm">
                    Photo by{' '}
                    <a 
                      href={featuredImage.photographerUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:text-blue-200"
                    >
                      {featuredImage.photographer}
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Main Description */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                📍 About {placeName}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {destinationDetails?.description || `Discover the amazing ${placeName} - a destination filled with culture, history, and unforgettable experiences.`}
              </p>
              
              {/* Destination Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <h4 className="font-semibold text-blue-800 mb-2">🌍 Popular Tourist Attractions</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {destinationDetails?.popularAttractions?.slice(0, 5).map((attraction, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-blue-500 mr-2">•</span>
                        {attraction}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Travel Information</h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Best Time:</span>
                      <span>{destinationDetails?.bestTimeToVisit || 'Year-round'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Currency:</span>
                      <span>{destinationDetails?.currency || 'Local currency'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Language:</span>
                      <span>{destinationDetails?.language || 'Local language'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Tips */}
            {travelTips.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                  💡 Travel Tips
                </h3>
                <div className="space-y-2">
                  {travelTips.slice(0, 3).map((tip, index) => (
                    <div key={index} className="text-sm">
                      <a
                        href={`https://en.wikivoyage.org/wiki/${encodeURIComponent(tip.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {tip.title}
                      </a>
                      <p className="text-gray-600 text-xs mt-1">
                        {tip.snippet.replace(/<[^>]*>/g, '')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Travel Guide Tab - Enhanced Content */}
        {activeTab === 'travel-guide' && (
          <div className="space-y-6">
            {/* Main Travel Guide */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 text-xl">📖</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-800">Travel Guide</h3>
                  <p className="text-green-600">Everything you need to know about {placeName}</p>
                </div>
              </div>
              
              {wikivoyageContent?.mainContent ? (
                <div className="bg-white rounded-lg p-6 border border-green-100">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">
                    {wikivoyageContent.mainContent?.title || `About ${placeName}`}
                  </h4>
                  <div className="text-gray-700 leading-relaxed text-base">
                    {wikivoyageContent.mainContent?.content}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-6 border border-green-100">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">About {placeName}</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {placeName} is a remarkable destination that offers visitors an unforgettable experience. 
                    From its rich cultural heritage to modern attractions, this place has something for everyone.
                  </p>
                </div>
              )}
            </div>

            {/* Travel Tips Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 text-xl">💡</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-800">Travel Tips</h3>
                  <p className="text-blue-600">Essential advice for your trip to {placeName}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Best Time to Visit */}
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <h5 className="font-semibold text-gray-800 mb-2">🌤️ Best Time to Visit</h5>
                  <p className="text-gray-600 text-sm">
                    The best time to visit {placeName} is typically during the spring and fall months 
                    when the weather is pleasant and crowds are manageable.
                  </p>
                </div>

                {/* Getting Around */}
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <h5 className="font-semibold text-gray-800 mb-2">🚇 Getting Around</h5>
                  <p className="text-gray-600 text-sm">
                    Public transportation is excellent in {placeName}. Consider getting a travel pass 
                    for unlimited access to buses, trains, and metro services.
                  </p>
                </div>

                {/* Local Cuisine */}
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <h5 className="font-semibold text-gray-800 mb-2">🍽️ Local Cuisine</h5>
                  <p className="text-gray-600 text-sm">
                    Don't miss the local specialties! Try traditional dishes and visit local markets 
                    to experience authentic flavors of {placeName}.
                  </p>
                </div>

                {/* Safety Tips */}
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <h5 className="font-semibold text-gray-800 mb-2">🛡️ Safety Tips</h5>
                  <p className="text-gray-600 text-sm">
                    {placeName} is generally safe for tourists. Keep your belongings secure and 
                    be aware of your surroundings, especially in crowded areas.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            {wikivoyageContent?.searchResults && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600 text-xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-yellow-800">Related Articles</h3>
                    <p className="text-yellow-600">More information about {placeName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wikivoyageContent.searchResults.slice(0, 6).map((result, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-yellow-100 hover:shadow-md transition-shadow duration-200">
                      <a
                        href={`https://en.wikivoyage.org/wiki/${encodeURIComponent(result.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <h5 className="font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors duration-200">
                          {result.title}
                        </h5>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {result.snippet.replace(/<[^>]*>/g, '').substring(0, 120)}...
                        </p>
                        <div className="mt-2 text-blue-600 text-sm font-medium">
                          Read more →
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Gallery Tab - Unsplash Images */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">
                📸 Photo Gallery
              </h3>
              {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div 
                      key={image.id} 
                      className="relative group cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img 
                        src={image.thumb} 
                        alt={image.alt}
                        className="w-full h-32 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-end">
                        <div className="p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="font-medium">{image.photographer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-purple-700">
                  Loading images for {placeName}...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Flights Tab - Flight Information */}
        {activeTab === 'flights' && (
          <div className="space-y-6">
            {/* Flight Search Navigation */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowFlightNav(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Search Flights
                </button>
                <div className="text-right">
                  <h3 className="text-xl font-semibold text-purple-800 mb-2">
                    Find Flights to {placeName}
                  </h3>
                  <p className="text-purple-700">
                    Search for flights from your location or any city worldwide
                  </p>
                </div>
              </div>
            </div>



            {/* Modern Flight Cards */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Available Flights to {placeName}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white">
                    <option>Price</option>
                    <option>Duration</option>
                    <option>Departure Time</option>
                  </select>
                </div>
              </div>
              
              {flights.length > 0 ? (
                <div className="space-y-4">
                  {flights.slice(0, 6).map((flight, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center justify-between">
                        {/* Airline Info */}
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {flight.airline?.name?.charAt(0) || 'A'}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 text-lg">
                              {flight.airline?.name || 'Unknown Airline'}
                            </h4>
                            <p className="text-gray-600">Flight {flight.flight?.number || 'N/A'}</p>
                          </div>
                        </div>

                        {/* Route Info */}
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <p className="font-semibold text-gray-800">{formatTime(flight.departure?.time)}</p>
                            <p className="text-sm text-gray-600">{flight.departure?.airport || 'N/A'}</p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-0.5 bg-gray-300"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="w-16 h-0.5 bg-gray-300"></div>
                          </div>
                          
                          <div className="text-center">
                            <p className="font-semibold text-gray-800">{formatTime(flight.arrival?.time)}</p>
                            <p className="text-sm text-gray-600">{flight.arrival?.airport || 'N/A'}</p>
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="text-center">
                          <p className="font-medium text-gray-800">{flight.duration || 'N/A'}</p>
                          <p className="text-sm text-gray-600">Duration</p>
                        </div>

                        {/* Price and Action */}
                        <div className="text-right">
                          <p className="text-3xl font-bold text-green-600 mb-2">
                            ${flight.price || 'N/A'}
                          </p>
                          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✈️</span>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">No Flights Available</h4>
                  <p className="text-gray-600 mb-4">We couldn't find any flights to {placeName} at the moment.</p>
                  <button 
                    onClick={() => setShowFlightNav(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    Search Different Dates
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300 z-10"
            >
              ×
            </button>
            <img 
              src={selectedImage.full} 
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
              <p className="text-sm">
                Photo by{' '}
                <a 
                  href={selectedImage.photographerUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-200"
                >
                  {selectedImage.photographer}
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Flight Navigation Modal */}
      <FlightNavigation
        isOpen={showFlightNav}
        onClose={() => setShowFlightNav(false)}
        destination={placeName}
      />
    </div>
  );
};

export default TravelCard;
