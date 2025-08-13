import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllDestinations } from '../services/destinationData';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get destinations from the enhanced data service
  const topDestinations = getAllDestinations();

  const categories = ['All', 'Europe', 'Asia', 'Americas', 'Oceania', 'Africa'];

  // Filter destinations based on selected category
  const filteredDestinations = selectedCategory === 'All' 
    ? topDestinations 
    : topDestinations.filter(dest => dest.category === selectedCategory);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/travel-search?destination=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Your Next Adventure</h1>
          <p>Get comprehensive travel information, guides, and flight details for any destination</p>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-box">
            <input
              type="text"
              placeholder="Search for a destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Top Travel Destinations</h2>
            <p className="section-subtitle">
              Explore the world's most popular destinations with AI-powered insights
            </p>
          </div>

          {/* Category Filters */}
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Destinations Count */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              Showing {filteredDestinations.length} destinations
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </p>
          </div>

          {/* Destinations Grid */}
          <div className="destinations-grid">
            {filteredDestinations.map((destination, index) => (
              <Link
                key={index}
                to={`/travel-search?destination=${encodeURIComponent(destination.name)}`}
                className="destination-card fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="card-image"
                />
                <div className="card-content">
                  <div className="card-icon">
                    {destination.icon}
                  </div>
                  <h3 className="card-title">{destination.name}</h3>
                  <p className="card-category">{destination.category}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div style={{ textAlign: 'center' }}>
            <Link to="/travel-search" className="btn-primary">
              Explore All Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Everything You Need for Your Trip</h2>
            <p className="section-subtitle">
              Comprehensive travel tools and information to make your journey unforgettable
            </p>
          </div>
          
          <div className="features-grid">
            {/* High-Quality Images */}
            <div className="feature-card">
              <div className="feature-icon">📸</div>
              <h3 className="feature-title">High-Quality Images</h3>
              <p className="feature-description">
                Beautiful photos from Unsplash for every destination, helping you visualize your perfect trip.
              </p>
            </div>

            {/* Travel Guides */}
            <div className="feature-card">
              <div className="feature-icon">📖</div>
              <h3 className="feature-title">Travel Guides</h3>
              <p className="feature-description">
                Access detailed travel guides from Wikivoyage with local insights, recommendations, and practical information.
              </p>
            </div>

            {/* Flight Information */}
            <div className="feature-card">
              <div className="feature-icon">✈️</div>
              <h3 className="feature-title">Flight Details</h3>
              <p className="feature-description">
                View real-time flight information, schedules, and availability for your chosen destination.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
