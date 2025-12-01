const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vendor ID is required'],
  },
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['furniture', 'sound-system', 'lighting', 'decor', 'appliances'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  price: {
    type: String,
    required: [true, 'Price is required'],
  },
  priceValue: {
    type: Number,
    required: [true, 'Price value is required'],
    min: 0,
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
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

// Index for better search performance
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ vendorId: 1 });

module.exports = mongoose.model('Product', productSchema);
