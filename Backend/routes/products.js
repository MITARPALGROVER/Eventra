const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, status, search, minPrice, maxPrice } = req.query;
    
    let query = {};
    
    if (category) query.category = category;
    if (status) query.status = status;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (minPrice || maxPrice) {
      query.priceValue = {};
      if (minPrice) query.priceValue.$gte = Number(minPrice);
      if (maxPrice) query.priceValue.$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
      .populate('vendorId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching products',
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendorId', 'firstName lastName email phone');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Get Product Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching product',
    });
  }
});

// @route   POST /api/products
// @desc    Create new product (Vendor only)
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, category, description, priceValue, image, stock } = req.body;

    // Check if user is a vendor
    if (req.user.accountType !== 'vendor') {
      return res.status(403).json({
        success: false,
        message: 'Only vendors can create products',
      });
    }

    const formattedPrice = `₹${priceValue.toLocaleString('en-IN')}/hr`;

    const product = await Product.create({
      vendorId: req.user._id,
      title,
      category,
      description,
      price: formattedPrice,
      priceValue,
      image,
      stock: stock || 0,
      status: 'available',
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating product',
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (Vendor only - own products)
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user is the owner
    if (product.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own products',
      });
    }

    const { title, category, description, priceValue, image, stock, status } = req.body;

    if (priceValue) {
      req.body.price = `₹${priceValue.toLocaleString('en-IN')}/hr`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating product',
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Vendor only - own products)
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user is the owner
    if (product.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own products',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting product',
    });
  }
});

// @route   GET /api/products/vendor/:vendorId
// @desc    Get products by vendor
// @access  Public
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.params.vendorId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Get Vendor Products Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching vendor products',
    });
  }
});

module.exports = router;
