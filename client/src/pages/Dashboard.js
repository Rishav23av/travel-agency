import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch user bookings
        const bookingsResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api'}/bookings`, { headers });
        setBookings(bookingsResponse.data);

        // If user is admin, fetch all packages
        if (user?.role === 'admin') {
          const packagesResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api'}/packages`, { headers });
          setPackages(packagesResponse.data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const handleDeletePackage = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api'}/packages/${packageId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPackages(packages.filter(pkg => pkg._id !== packageId));
        alert('Package deleted successfully!');
      } catch (error) {
        console.error('Error deleting package:', error);
        alert('Failed to delete package');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <h1>Welcome, {user?.name}!</h1>
          <p>{user?.email}</p>
        </div>
        <div className="header-actions">
          {user?.role === 'admin' && (
            <Link to="/add-package" className="add-package-btn">
              Add New Package
            </Link>
          )}
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings
          </button>
          {user?.role === 'admin' && (
            <button 
              className={`tab ${activeTab === 'packages' ? 'active' : ''}`}
              onClick={() => setActiveTab('packages')}
            >
              Manage Packages
            </button>
          )}
        </div>

        <div className="tab-content">
          {activeTab === 'bookings' && (
            <div className="bookings-section">
              <h2>My Bookings</h2>
              {bookings.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't made any bookings yet.</p>
                  <Link to="/" className="browse-packages-btn">
                    Browse Packages
                  </Link>
                </div>
              ) : (
                <div className="bookings-grid">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="booking-card">
                      <div className="booking-image">
                        <img src={booking.package.image} alt={booking.package.title} />
                      </div>
                      <div className="booking-info">
                        <h3>{booking.package.title}</h3>
                        <p className="location">📍 {booking.package.location}</p>
                        <p className="price">${booking.package.price}</p>
                        <div className="booking-status">
                          <span className={`status ${booking.status}`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="booking-date">
                          Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'packages' && user?.role === 'admin' && (
            <div className="packages-section">
              <h2>Manage Packages</h2>
              <div className="packages-grid">
                {packages.map((pkg) => (
                  <div key={pkg._id} className="package-card">
                    <div className="package-image">
                      <img src={pkg.image} alt={pkg.title} />
                    </div>
                    <div className="package-info">
                      <h3>{pkg.title}</h3>
                      <p className="location">📍 {pkg.location}</p>
                      <p className="price">${pkg.price}</p>
                      <div className="package-actions">
                        <Link to={`/edit-package/${pkg._id}`} className="edit-btn">
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDeletePackage(pkg._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
