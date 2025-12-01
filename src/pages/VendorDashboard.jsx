import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { useVendorStore } from '../stores/vendorStore';
import { useBookingStore } from '../stores/bookingStore';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const allProducts = useVendorStore((state) => state.products);
  const deleteProduct = useVendorStore((state) => state.deleteProduct);
  const updateProductStatus = useVendorStore((state) => state.updateProductStatus);
  const bookings = useBookingStore((state) => state.bookings);

  // Filter products by vendor ID
  const products = allProducts.filter(p => p.vendorId === currentUser?.id);

  // Check if user is vendor
  useEffect(() => {
    if (!currentUser) {
      toast.error('Please login to access vendor dashboard');
      navigate('/login');
    } else if (currentUser.accountType !== 'vendor') {
      toast.error('Access denied. Vendor account required.');
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.accountType !== 'vendor') {
    return null;
  }

  // Calculate stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'available').length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  
  // Get orders for vendor's products
  const vendorOrders = bookings.filter(booking => 
    booking.items.some(item => products.find(p => p.id === item.id))
  );
  const totalOrders = vendorOrders.length;
  const totalRevenue = vendorOrders.reduce((sum, order) => sum + (order.pricing?.grandTotal || 0), 0);

  const handleDeleteProduct = (productId, productTitle) => {
    if (window.confirm(`Are you sure you want to delete "${productTitle}"?`)) {
      deleteProduct(productId);
      toast.success('Product deleted successfully');
    }
  };

  const handleToggleStatus = (productId, currentStatus) => {
    const newStatus = currentStatus === 'available' ? 'unavailable' : 'available';
    updateProductStatus(productId, newStatus);
    toast.success(`Product marked as ${newStatus}`);
  };7

  const getCategoryBadgeColor = (category) => {
    const colors = {
      'furniture': '#3b82f6',
      'sound-system': '#8b5cf6',
      'lighting': '#eab308',
      'decor': '#ec4899',
      'appliances': '#10b981',
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>Vendor Dashboard</h1>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            Manage your products and track orders
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/vendor/add-product')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '40px' 
      }}>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(var(--primary-rgb), 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Package size={24} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px' }}>
                Total Products
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111' }}>
                {totalProducts}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#10b981' }}>
            {activeProducts} active
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShoppingCart size={24} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px' }}>
                Total Orders
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111' }}>
                {totalOrders}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            All time
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(234, 179, 8, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <DollarSign size={24} color="#eab308" />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px' }}>
                Total Revenue
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111' }}>
                ₹{Math.round(totalRevenue).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} />
            Revenue earned
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(139, 92, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Package size={24} color="#8b5cf6" />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px' }}>
                Total Stock
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111' }}>
                {totalStock}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Items available
          </div>
        </div>
      </div>

      {/* Products List */}
      <div>
        <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Package size={24} />
          Your Products
        </h2>

        {products.length === 0 ? (
          <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.3 }}>📦</div>
            <h3 style={{ marginBottom: '12px', color: '#111' }}>No products yet</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '1rem' }}>
              Start adding products to showcase your inventory to customers
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/vendor/add-product')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={20} />
              Add Your First Product
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {products.map((product) => (
              <div key={product.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  {/* Product Image */}
                  <div style={{ 
                    width: '200px', 
                    height: '200px', 
                    flexShrink: 0,
                    overflow: 'hidden'
                  }}>
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ marginBottom: '8px', fontSize: '1.25rem' }}>
                          {product.title}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            background: `${getCategoryBadgeColor(product.category)}20`,
                            color: getCategoryBadgeColor(product.category),
                          }}>
                            {product.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </span>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            background: product.status === 'available' ? '#d1fae5' : '#fee2e2',
                            color: product.status === 'available' ? '#065f46' : '#991b1b',
                          }}>
                            {product.status === 'available' ? '● Available' : '● Unavailable'}
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                        {product.price}
                      </div>
                    </div>

                    <p style={{ color: '#6b7280', marginBottom: '16px', fontSize: '0.95rem' }}>
                      {product.description}
                    </p>

                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px' }}>
                          Stock
                        </div>
                        <div style={{ fontWeight: '600', color: '#111' }}>
                          {product.stock || 0} units
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px' }}>
                          Rating
                        </div>
                        <div style={{ fontWeight: '600', color: '#111' }}>
                          ⭐ {product.rating || 0}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px' }}>
                          Added
                        </div>
                        <div style={{ fontWeight: '600', color: '#111' }}>
                          {new Date(product.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                      <button
                        className="btn btn-outline"
                        onClick={() => navigate(`/vendor/edit-product/${product.id}`)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => handleToggleStatus(product.id, product.status)}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          flex: 1,
                          color: product.status === 'available' ? '#ef4444' : '#10b981',
                          borderColor: product.status === 'available' ? '#ef4444' : '#10b981',
                        }}
                      >
                        {product.status === 'available' ? <EyeOff size={16} /> : <Eye size={16} />}
                        {product.status === 'available' ? 'Mark Unavailable' : 'Mark Available'}
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => handleDeleteProduct(product.id, product.title)}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          color: '#ef4444',
                          borderColor: '#ef4444',
                        }}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      {vendorOrders.length > 0 && (
        <div style={{ marginTop: '60px' }}>
          <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShoppingCart size={24} />
            Recent Orders
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {vendorOrders.slice(0, 5).map((order) => {
              const vendorItems = order.items.filter(item => 
                products.find(p => p.id === item.id)
              );

              return (
                <div key={order.id} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '4px' }}>
                        Order #{order.id}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                        {new Date(order.eventDate).toLocaleDateString('en-IN')} at {order.eventTime}
                      </div>
                    </div>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      background: order.status === 'confirmed' ? '#d1fae5' : '#fee2e2',
                      color: order.status === 'confirmed' ? '#065f46' : '#991b1b',
                    }}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '8px' }}>
                      Your Products in this Order:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {vendorItems.map((item, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '6px 12px',
                            background: '#f3f4f6',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            color: '#374151',
                          }}
                        >
                          {item.title} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    paddingTop: '12px', 
                    borderTop: '1px solid #e5e7eb' 
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                      Customer: {order.firstName} {order.lastName}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                      Contact: {order.phone}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
