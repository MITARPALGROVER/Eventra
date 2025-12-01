import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Upload, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { useVendorStore } from '../stores/vendorStore';

const AddProduct = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const addProduct = useVendorStore((state) => state.addProduct);
  
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const imageUrl = watch('image');

  // Update image preview when URL changes
  useState(() => {
    if (imageUrl) {
      setImagePreview(imageUrl);
    }
  }, [imageUrl]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      if (!currentUser || currentUser.accountType !== 'vendor') {
        toast.error('Only vendors can add products');
        navigate('/login');
        return;
      }

      // Format price
      const priceValue = parseFloat(data.priceValue);
      const formattedPrice = `₹${priceValue.toLocaleString('en-IN')}/hr`;

      const productData = {
        title: data.title,
        category: data.category,
        description: data.description,
        price: formattedPrice,
        priceValue: priceValue,
        image: data.image || 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80',
        stock: parseInt(data.stock) || 0,
      };

      addProduct(productData, currentUser.id);
      toast.success('Product added successfully!');
      navigate('/vendor/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to add product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={() => navigate('/vendor/dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            cursor: 'pointer',
            fontSize: '1rem',
            marginBottom: '16px',
            padding: '8px',
            borderRadius: '8px',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'}
          onMouseOut={(e) => e.currentTarget.style.background = 'none'}
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Package size={32} />
          Add New Product
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem' }}>
          Fill in the details to add a new product to your inventory
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="auth-card" style={{ maxWidth: '100%', padding: '40px' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Product Title */}
            <div className="field">
              <label htmlFor="title">Product Title *</label>
              <input
                type="text"
                id="title"
                placeholder="e.g., Premium Sofa Set"
                className={errors.title ? 'error' : ''}
                {...register('title', {
                  required: 'Product title is required',
                  minLength: {
                    value: 3,
                    message: 'Title must be at least 3 characters',
                  },
                })}
              />
              {errors.title && (
                <div className="error-message show">{errors.title.message}</div>
              )}
            </div>

            {/* Category */}
            <div className="field">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                className={errors.category ? 'error' : ''}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  width: '100%',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
                {...register('category', {
                  required: 'Please select a category',
                })}
              >
                <option value="">Select a category</option>
                <option value="furniture">Furniture</option>
                <option value="sound-system">Sound Systems</option>
                <option value="lighting">Lighting</option>
                <option value="decor">Décor</option>
                <option value="appliances">Event Electric Appliances</option>
              </select>
              {errors.category && (
                <div className="error-message show">{errors.category.message}</div>
              )}
            </div>

            {/* Description */}
            <div className="field">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                placeholder="Describe your product..."
                rows="4"
                className={errors.description ? 'error' : ''}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  width: '100%',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 10,
                    message: 'Description must be at least 10 characters',
                  },
                })}
              />
              {errors.description && (
                <div className="error-message show">{errors.description.message}</div>
              )}
            </div>

            {/* Price and Stock */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div className="field" style={{ margin: 0 }}>
                <label htmlFor="priceValue">Price per Hour (₹) *</label>
                <input
                  type="number"
                  id="priceValue"
                  placeholder="e.g., 2500"
                  min="0"
                  step="1"
                  className={errors.priceValue ? 'error' : ''}
                  {...register('priceValue', {
                    required: 'Price is required',
                    min: {
                      value: 1,
                      message: 'Price must be at least ₹1',
                    },
                  })}
                />
                {errors.priceValue && (
                  <div className="error-message show">{errors.priceValue.message}</div>
                )}
              </div>

              <div className="field" style={{ margin: 0 }}>
                <label htmlFor="stock">Stock Quantity *</label>
                <input
                  type="number"
                  id="stock"
                  placeholder="e.g., 5"
                  min="0"
                  step="1"
                  className={errors.stock ? 'error' : ''}
                  {...register('stock', {
                    required: 'Stock quantity is required',
                    min: {
                      value: 0,
                      message: 'Stock cannot be negative',
                    },
                  })}
                />
                {errors.stock && (
                  <div className="error-message show">{errors.stock.message}</div>
                )}
              </div>
            </div>

            {/* Image URL */}
            <div className="field">
              <label htmlFor="image">Product Image URL *</label>
              <input
                type="url"
                id="image"
                placeholder="https://example.com/image.jpg"
                className={errors.image ? 'error' : ''}
                {...register('image', {
                  required: 'Image URL is required',
                  pattern: {
                    value: /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/i,
                    message: 'Please enter a valid image URL',
                  },
                })}
                onChange={(e) => setImagePreview(e.target.value)}
              />
              {errors.image && (
                <div className="error-message show">{errors.image.message}</div>
              )}
              <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '6px' }}>
                Tip: Use Unsplash.com for free high-quality images
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', color: '#111' }}>
                  Image Preview:
                </div>
                <div style={{
                  width: '100%',
                  height: '300px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid #e5e7eb',
                }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={() => setImagePreview('')}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isLoading ? (
                'Adding Product...'
              ) : (
                <>
                  <Upload size={20} />
                  Add Product
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
