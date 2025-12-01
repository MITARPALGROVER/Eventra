import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Calendar, Clock, MapPin, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useBookingStore } from '../stores/bookingStore';
import RazorpayCheckout from '../components/common/RazorpayCheckout';

const Checkout = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const addBooking = useBookingStore((state) => state.addBooking);
  
  const [rentalDuration, setRentalDuration] = useState(4); // Default 4 hours
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (!currentUser) {
    toast.error('Please login to checkout');
    navigate('/login');
    return null;
  }

  if (items.length === 0) {
    toast.error('Your cart is empty');
    navigate('/cart');
    return null;
  }

  // Calculate pricing based on hours
  const hourlyRate = getTotal(); // Base price per hour
  const rentalTotal = hourlyRate * rentalDuration;
  const deliveryFee = 500;
  const setupFee = 300;
  const taxRate = 0.18;
  const tax = (rentalTotal + deliveryFee + setupFee) * taxRate;
  const grandTotal = rentalTotal + deliveryFee + setupFee + tax;

  const onSubmit = (data) => {
    if (!eventDate || !eventTime) {
      toast.error('Please select event date and time');
      return;
    }

    const booking = {
      ...data,
      eventDate,
      eventTime,
      rentalDuration,
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
      })),
      pricing: {
        hourlyRate,
        rentalTotal,
        deliveryFee,
        setupFee,
        tax,
        grandTotal,
      },
      customerName: currentUser.name,
      customerEmail: currentUser.email,
    };

    setBookingData(booking);
    setCheckoutComplete(true);
    toast.success('Details saved! Proceed to payment.');
  };

  const handlePaymentSuccess = (response) => {
    console.log('Payment successful:', response);
    
    // Save booking to store (no return value needed)
    addBooking({
      ...bookingData,
      paymentId: response.razorpay_payment_id || `payment_${Date.now()}`,
      paymentStatus: 'paid',
    });
    
    // Clear cart
    clearCart();
    
    toast.success('Booking confirmed! Redirecting to dashboard...', {
      duration: 3000,
    });
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
    setCheckoutComplete(false);
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <button className="btn btn-outline" onClick={() => navigate('/cart')} style={{ marginBottom: '20px' }}>
        <ArrowLeft size={20} style={{ marginRight: '8px' }} />
        Back to Cart
      </button>

      <h1 style={{ marginBottom: '30px' }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px' }}>
        {/* Checkout Form */}
        <div>
          {!checkoutComplete ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Event Details */}
              <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <Calendar size={24} color="var(--primary)" />
                  Event Details
                </h2>

                <div className="field">
                  <label htmlFor="eventType">Event Type</label>
                  <select
                    id="eventType"
                    className={errors.eventType ? 'error' : ''}
                    {...register('eventType', { required: 'Event type is required' })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '1rem',
                    }}
                  >
                    <option value="">Select event type</option>
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday Party</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="conference">Conference</option>
                    <option value="concert">Concert</option>
                    <option value="exhibition">Exhibition</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.eventType && (
                    <div className="error-message show">{errors.eventType.message}</div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="field">
                    <label htmlFor="eventDate">Event Date</label>
                    <input
                      type="date"
                      id="eventDate"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="eventTime">Event Start Time</label>
                    <input
                      type="time"
                      id="eventTime"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="guestCount">Expected Guest Count</label>
                  <input
                    type="number"
                    id="guestCount"
                    placeholder="e.g., 100"
                    className={errors.guestCount ? 'error' : ''}
                    {...register('guestCount', {
                      required: 'Guest count is required',
                      min: { value: 1, message: 'At least 1 guest required' },
                    })}
                  />
                  {errors.guestCount && (
                    <div className="error-message show">{errors.guestCount.message}</div>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="rentalDuration">
                    <Clock size={18} style={{ display: 'inline', marginRight: '8px' }} />
                    Rental Duration (Hours)
                  </label>
                  <select
                    id="rentalDuration"
                    value={rentalDuration}
                    onChange={(e) => setRentalDuration(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '1rem',
                    }}
                  >
                    <option value="2">2 Hours - ₹{(hourlyRate * 2).toLocaleString('en-IN')}</option>
                    <option value="4">4 Hours - ₹{(hourlyRate * 4).toLocaleString('en-IN')}</option>
                    <option value="6">6 Hours - ₹{(hourlyRate * 6).toLocaleString('en-IN')}</option>
                    <option value="8">8 Hours - ₹{(hourlyRate * 8).toLocaleString('en-IN')}</option>
                    <option value="12">12 Hours - ₹{(hourlyRate * 12).toLocaleString('en-IN')}</option>
                    <option value="24">Full Day (24 Hours) - ₹{(hourlyRate * 24).toLocaleString('en-IN')}</option>
                  </select>
                  <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '8px' }}>
                    Hourly rate: ₹{hourlyRate.toLocaleString('en-IN')}/hour
                  </p>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <MapPin size={24} color="var(--primary)" />
                  Delivery Address
                </h2>

                <div className="field">
                  <label htmlFor="address">Street Address</label>
                  <input
                    type="text"
                    id="address"
                    placeholder="House/Flat No., Street Name"
                    className={errors.address ? 'error' : ''}
                    {...register('address', { required: 'Address is required' })}
                  />
                  {errors.address && (
                    <div className="error-message show">{errors.address.message}</div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="field">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      placeholder="City"
                      className={errors.city ? 'error' : ''}
                      {...register('city', { required: 'City is required' })}
                    />
                    {errors.city && (
                      <div className="error-message show">{errors.city.message}</div>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      placeholder="State"
                      className={errors.state ? 'error' : ''}
                      {...register('state', { required: 'State is required' })}
                    />
                    {errors.state && (
                      <div className="error-message show">{errors.state.message}</div>
                    )}
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="pincode">Pincode</label>
                  <input
                    type="text"
                    id="pincode"
                    placeholder="123456"
                    className={errors.pincode ? 'error' : ''}
                    {...register('pincode', {
                      required: 'Pincode is required',
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: 'Invalid pincode',
                      },
                    })}
                  />
                  {errors.pincode && (
                    <div className="error-message show">{errors.pincode.message}</div>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="landmark">Landmark (Optional)</label>
                  <input
                    type="text"
                    id="landmark"
                    placeholder="Near..."
                    {...register('landmark')}
                  />
                </div>
              </div>

              {/* Contact Details */}
              <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <User size={24} color="var(--primary)" />
                  Contact Details
                </h2>

                <div className="field">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="10-digit mobile number"
                    className={errors.phone ? 'error' : ''}
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Invalid phone number',
                      },
                    })}
                  />
                  {errors.phone && (
                    <div className="error-message show">{errors.phone.message}</div>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="alternatePhone">Alternate Phone (Optional)</label>
                  <input
                    type="tel"
                    id="alternatePhone"
                    placeholder="10-digit mobile number"
                    {...register('alternatePhone', {
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Invalid phone number',
                      },
                    })}
                  />
                  {errors.alternatePhone && (
                    <div className="error-message show">{errors.alternatePhone.message}</div>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="specialInstructions">Special Instructions (Optional)</label>
                  <textarea
                    id="specialInstructions"
                    rows="4"
                    placeholder="Any specific setup requirements, access instructions, etc."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #ddd',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                    {...register('specialInstructions')}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                Continue to Payment
              </button>
            </form>
          ) : (
            <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✅</div>
              <h2 style={{ marginBottom: '16px' }}>Details Confirmed!</h2>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                Please proceed with payment to confirm your booking
              </p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ marginBottom: '20px' }}>Booking Summary</h2>

            {/* Items */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: '600', marginBottom: '12px', fontSize: '0.9rem', color: '#444' }}>
                Items ({items.length})
              </div>
              {items.map((item) => (
                <div key={item.id} style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '6px' }}>
                  {item.title} × {item.quantity}
                </div>
              ))}
            </div>

            <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '16px' }} />

            {/* Pricing Breakdown */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: '#6b7280' }}>Rental ({rentalDuration}hrs @ ₹{hourlyRate}/hr)</span>
                <span style={{ fontWeight: '600' }}>₹{rentalTotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: '#6b7280' }}>Delivery & Pickup</span>
                <span style={{ fontWeight: '600' }}>₹{deliveryFee.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: '#6b7280' }}>Setup & Teardown</span>
                <span style={{ fontWeight: '600' }}>₹{setupFee.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#6b7280' }}>GST (18%)</span>
                <span style={{ fontWeight: '600' }}>₹{Math.round(tax).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '16px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1.25rem', fontWeight: '700' }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>
                ₹{Math.round(grandTotal).toLocaleString('en-IN')}
              </span>
            </div>

            {checkoutComplete ? (
              <RazorpayCheckout
                amount={Math.round(grandTotal)}
                onSuccess={handlePaymentSuccess}
                onFailure={handlePaymentFailure}
              />
            ) : (
              <div style={{ padding: '12px', background: '#f3f4f6', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem', color: '#6b7280' }}>
                Complete the form to proceed
              </div>
            )}

            <div style={{ marginTop: '16px', padding: '12px', background: '#fef3c7', borderRadius: '8px', fontSize: '0.85rem' }}>
              <strong>Note:</strong> Setup will be done 2 hours before event start time. Pickup will be 2 hours after event end time.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
