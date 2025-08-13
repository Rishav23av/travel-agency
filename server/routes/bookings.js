const express = require('express');
const router = express.Router();
const {
  getUserBookings,
  createBooking,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');
const { auth, adminAuth } = require('../middleware/auth');

// User routes (authenticated)
router.get('/', auth, getUserBookings);
router.post('/', auth, createBooking);
router.put('/:id/cancel', auth, cancelBooking);

// Admin routes
router.put('/:id/status', adminAuth, updateBookingStatus);

module.exports = router;
