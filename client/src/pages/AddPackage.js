import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './AddPackage.css';

const AddPackage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    description: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

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

    try {
      const token = localStorage.getItem('token');
      await axios.post(
                  `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api'}/packages`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      alert('Package added successfully!');
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add package. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-package-container">
      <div className="add-package-card">
        <div className="add-package-header">
          <h1>Add New Package</h1>
          <p>Create a new travel package for your customers</p>
        </div>

        <form onSubmit={handleSubmit} className="add-package-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="title">Package Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter package title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Enter destination location"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (USD)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              placeholder="Enter package price"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              placeholder="Enter image URL"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Enter detailed package description"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="add-package-btn"
              disabled={loading}
            >
              {loading ? 'Adding Package...' : 'Add Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPackage;
