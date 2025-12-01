import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, User, LogOut, Calendar, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useBookingStore } from '../stores/bookingStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const getFavorites = useAuthStore((state) => state.getFavorites);
  const items = useCartStore((state) => state.items);
  const bookings = useBookingStore((state) => state.bookings);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  // Redirect vendors to vendor dashboard
  if (currentUser.accountType === 'vendor') {
    navigate('/vendor/dashboard');
    return null;
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  const favorites = getFavorites();

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <h1 style={{ marginBottom: '30px' }}>Dashboard</h1>

      {/* User Info Card */}
      <div className="card" style={{ padding: '30px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            color: 'white',
            fontWeight: '700',
          }}>
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ marginBottom: '8px' }}>{currentUser.name || 'User'}</h2>
            <p style={{ color: '#6b7280', marginBottom: '4px' }}>{currentUser.email}</p>
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600',
              background: currentUser.accountType === 'vendor' ? '#fef3c7' : '#dbeafe',
              color: currentUser.accountType === 'vendor' ? '#92400e' : '#1e40af',
            }}>
              {currentUser.accountType === 'vendor' ? 'Vendor Account' : 'Customer Account'}
            </span>
          </div>
          <button
            className="btn btn-outline"
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div className="card" style={{ padding: '24px', textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/cart')}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(var(--primary-rgb), 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <ShoppingBag size={28} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px', color: 'var(--primary)' }}>
            {items.length}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Items in Cart</div>
        </div>

        <div className="card" style={{ padding: '24px', textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate('/favorites')}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Heart size={28} color="#ef4444" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px', color: '#ef4444' }}>
            {favorites.length}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Favorites</div>
        </div>

        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Calendar size={28} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px', color: '#10b981' }}>
            {bookings.length}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Bookings</div>
        </div>
      </div>

      {/* Recent Bookings */}
      <section>
        <h2 style={{ marginBottom: '20px' }}>Recent Bookings</h2>
        {bookings.length > 0 ? (
          <div style={{ display: 'grid', gap: '16px' }}>
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Package size={20} color="var(--primary)" />
                      {booking.eventType.charAt(0).toUpperCase() + booking.eventType.slice(1)} Event
                    </h3>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '4px' }}>
                      <strong>Booking ID:</strong> {booking.id}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '4px' }}>
                      <strong>Event Date:</strong> {new Date(booking.eventDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })} at {booking.eventTime}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                      <strong>Duration:</strong> {booking.rentalDuration} hours
                    </div>
                  </div>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    background: booking.status === 'confirmed' ? '#d1fae5' : '#fee2e2',
                    color: booking.status === 'confirmed' ? '#065f46' : '#991b1b',
                  }}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                {/* Items */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Items Booked:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {booking.items.map((item, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '4px 12px',
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

                {/* Address */}
                <div style={{ marginBottom: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ fontWeight: '600', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Delivery Address:
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    {booking.address}, {booking.city}, {booking.state} - {booking.pincode}
                  </div>
                </div>

                {/* Pricing */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px' }}>
                      Total Amount
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                      ₹{Math.round(booking.pricing.grandTotal).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px', textAlign: 'right' }}>
                      Payment Status
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#10b981' }}>
                      {booking.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div style={{ marginTop: '16px', padding: '12px', background: '#f9fafb', borderRadius: '8px', fontSize: '0.85rem', color: '#6b7280' }}>
                  <strong>Contact:</strong> {booking.phone}
                  {booking.specialInstructions && (
                    <div style={{ marginTop: '8px' }}>
                      <strong>Special Instructions:</strong> {booking.specialInstructions}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.3 }}>📋</div>
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>No bookings yet</p>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '8px' }}>
              Start browsing our categories to rent equipment for your events
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/categories')}
              style={{ marginTop: '24px' }}
            >
              Browse Categories
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
