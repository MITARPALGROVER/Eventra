import { useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';

const Cart = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotal = useCartStore((state) => state.getTotal);

  const deliveryFee = 500;
  const setupFee = 300;
  const taxRate = 0.18;
  const subtotal = getTotal();
  const tax = (subtotal + deliveryFee + setupFee) * taxRate;
  const total = subtotal + deliveryFee + setupFee + tax;

  const handleCheckout = () => {
    if (!currentUser) {
      toast.error('Please login to proceed with checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.success('Cart cleared');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px', textAlign: 'center' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛒</div>
          <h2 style={{ marginBottom: '16px' }}>Your Cart is Empty</h2>
          <p style={{ color: '#6b7280', marginBottom: '32px' }}>
            Looks like you haven't added anything to your cart yet.
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/categories')}
          >
            Browse Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Shopping Cart ({items.length} items)</h1>
        <button
          className="btn btn-outline"
          onClick={handleClearCart}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Trash2 size={18} />
          Clear Cart
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
        {/* Cart Items */}
        <div>
          {items.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                padding: '20px',
                marginBottom: '16px',
                display: 'flex',
                gap: '20px',
                cursor: 'default',
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '12px' }}>
                  {item.category}
                </p>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}>
                  {item.price}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    cursor: 'pointer',
                    padding: '8px',
                  }}
                >
                  <Trash2 size={20} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="btn btn-outline"
                    style={{ padding: '8px 12px' }}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ fontWeight: '600', minWidth: '30px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="btn btn-outline"
                    style={{ padding: '8px 12px' }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ marginBottom: '20px' }}>Order Summary</h2>
            
            <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#6b7280' }}>Hourly Rate</span>
                <span style={{ fontWeight: '600' }}>₹{subtotal.toLocaleString('en-IN')}/hr</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#6b7280' }}>Delivery & Pickup</span>
                <span style={{ fontWeight: '600' }}>₹{deliveryFee.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#6b7280' }}>Setup & Teardown</span>
                <span style={{ fontWeight: '600' }}>₹{setupFee.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>GST (18%)</span>
                <span style={{ fontWeight: '600' }}>₹{Math.round(tax).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
              <strong>Note:</strong> Final price will be calculated based on rental duration selected at checkout.
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1.25rem', fontWeight: '700' }}>
              <span>Estimated Total</span>
              <span style={{ color: 'var(--primary)' }}>
                ₹{Math.round(total).toLocaleString('en-IN')}
              </span>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px' }}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>

            <button
              className="btn btn-outline"
              style={{ width: '100%', marginTop: '12px', padding: '14px' }}
              onClick={() => navigate('/categories')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
