const Booking = require('../models/Booking');
const Package = require('../models/Package');

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('packageId')
      .sort({ createdAt: -1 });

    // Transform the data to match frontend expectations
    const transformedBookings = bookings.map(booking => ({
      _id: booking._id,
      package: booking.packageId,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    }));

    res.json(transformedBookings);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new booking
const createBooking = async (req, res) => {
  try {
    const { packageId } = req.body;

    // Check if package exists
    const package = await Package.findById(packageId);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Check if user already booked this package
    const existingBooking = await Booking.findOne({
      userId: req.user._id,
      packageId: packageId
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this package' });
    }

    // Create new booking
    const newBooking = new Booking({
      userId: req.user._id,
      packageId: packageId,
      status: 'pending'
    });

    await newBooking.save();

    // Populate package details
    await newBooking.populate('packageId');

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        _id: newBooking._id,
        package: newBooking.packageId,
        status: newBooking.status,
        createdAt: newBooking.createdAt,
        updatedAt: newBooking.updatedAt
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update booking status (admin only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserBookings,
  createBooking,
  updateBookingStatus,
  cancelBooking
};
