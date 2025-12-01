const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    title: String,
    price: String,
    quantity: Number,
    image: String,
  }],
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    enum: ['wedding', 'corporate', 'birthday', 'conference', 'other'],
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required'],
  },
  eventTime: {
    type: String,
    required: [true, 'Event time is required'],
  },
  rentalDuration: {
    type: Number,
    required: [true, 'Rental duration is required'],
    min: 1,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
  },
  state: {
    type: String,
    required: [true, 'State is required'],
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
  },
  specialInstructions: {
    type: String,
    trim: true,
  },
  pricing: {
    subtotal: Number,
    gst: Number,
    delivery: Number,
    grandTotal: Number,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'paid',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for queries
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ eventDate: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
