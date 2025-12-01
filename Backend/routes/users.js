const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching profile',
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phone },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile',
    });
  }
});

// @route   POST /api/users/favorites/:productId
// @desc    Add product to favorites
// @access  Private
router.post('/favorites/:productId', authenticate, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const user = await User.findById(req.user._id);

    if (user.favorites.includes(req.params.productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in favorites',
      });
    }

    user.favorites.push(req.params.productId);
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('favorites');

    res.status(200).json({
      success: true,
      message: 'Product added to favorites',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Add Favorite Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding to favorites',
    });
  }
});

// @route   DELETE /api/users/favorites/:productId
// @desc    Remove product from favorites
// @access  Private
router.delete('/favorites/:productId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(
      fav => fav.toString() !== req.params.productId
    );
    
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('favorites');

    res.status(200).json({
      success: true,
      message: 'Product removed from favorites',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Remove Favorite Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error removing from favorites',
    });
  }
});

// @route   GET /api/users/favorites
// @desc    Get user's favorites
// @access  Private
router.get('/favorites', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');

    res.status(200).json({
      success: true,
      count: user.favorites.length,
      data: user.favorites,
    });
  } catch (error) {
    console.error('Get Favorites Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching favorites',
    });
  }
});

module.exports = router;
