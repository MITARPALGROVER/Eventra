const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { authenticate } = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      userId: req.user._id,
      status: 'confirmed',
      paymentStatus: 'paid',
    };

    const booking = await Booking.create(bookingData);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Create Booking Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating booking',
    });
  }
});

// @route   GET /api/bookings
// @desc    Get all bookings for current user
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Get Bookings Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching bookings',
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('items.productId')
      .populate('userId', 'firstName lastName email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is the owner
    if (booking.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own bookings',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Get Booking Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching booking',
    });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking status
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is the owner
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own bookings',
      });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking,
    });
  } catch (error) {
    console.error('Update Booking Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating booking',
    });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel booking
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is the owner
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own bookings',
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Cancel Booking Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error cancelling booking',
    });
  }
});

// @route   GET /api/bookings/vendor/orders
// @desc    Get orders for vendor's products
// @access  Private (Vendor only)
router.get('/vendor/orders', authenticate, async (req, res) => {
  try {
    if (req.user.accountType !== 'vendor') {
      return res.status(403).json({
        success: false,
        message: 'Only vendors can view orders',
      });
    }

    // Get all bookings and filter those containing vendor's products
    const bookings = await Booking.find()
      .populate('items.productId')
      .sort({ createdAt: -1 });

    // Filter bookings that contain at least one product from this vendor
    const vendorOrders = bookings.filter(booking => 
      booking.items.some(item => 
        item.productId && item.productId.vendorId.toString() === req.user._id.toString()
      )
    );

    res.status(200).json({
      success: true,
      count: vendorOrders.length,
      data: vendorOrders,
    });
  } catch (error) {
    console.error('Get Vendor Orders Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching vendor orders',
    });
  }
});

module.exports = router;
