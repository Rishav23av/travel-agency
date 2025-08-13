import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './PackageDetails.css';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api'}/packages/${id}`);
        setPackageData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching package details:', error);
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setBooking(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
                  `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api'}/bookings`,
        { packageId: id },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Package booked successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error booking package:', error);
      alert('Failed to book package. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading package details...</h2>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="error">
        <h2>Package not found</h2>
      </div>
    );
  }

  return (
    <div className="package-details">
      <div className="package-hero">
        <div className="package-image">
          <img src={packageData.image} alt={packageData.title} />
        </div>
        <div className="package-info">
          <h1>{packageData.title}</h1>
          <p className="location">📍 {packageData.location}</p>
          <div className="price-section">
            <span className="price">${packageData.price}</span>
            <span className="per-person">per person</span>
          </div>
          <button 
            className="book-now-btn"
            onClick={handleBooking}
            disabled={booking}
          >
            {booking ? 'Booking...' : 'Book Now'}
          </button>
        </div>
      </div>

      <div className="package-content">
        <div className="description-section">
          <h2>About This Package</h2>
          <p>{packageData.description}</p>
        </div>

        <div className="highlights-section">
          <h2>Highlights</h2>
          <ul>
            <li>Professional tour guide</li>
            <li>Comfortable accommodation</li>
            <li>All meals included</li>
            <li>Transportation provided</li>
            <li>Exciting activities</li>
          </ul>
        </div>

        <div className="itinerary-section">
          <h2>What's Included</h2>
          <div className="included-items">
            <div className="item">
              <span className="icon">🏨</span>
              <span>Accommodation</span>
            </div>
            <div className="item">
              <span className="icon">🍽️</span>
              <span>Meals</span>
            </div>
            <div className="item">
              <span className="icon">🚌</span>
              <span>Transportation</span>
            </div>
            <div className="item">
              <span className="icon">👨‍💼</span>
              <span>Tour Guide</span>
            </div>
            <div className="item">
              <span className="icon">🎫</span>
              <span>Activities</span>
            </div>
            <div className="item">
              <span className="icon">🛡️</span>
              <span>Insurance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
