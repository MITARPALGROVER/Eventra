import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';

const RazorpayCheckout = ({ amount, onSuccess, onFailure }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const currentUser = useAuthStore((state) => state.currentUser);
  const clearCart = useCartStore((state) => state.clearCart);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!currentUser) {
      toast.error('Please login to proceed with payment');
      return;
    }

    setIsProcessing(true);

    // Load Razorpay script
    const res = await loadRazorpay();

    if (!res) {
      toast.error('Razorpay SDK failed to load. Please check your internet connection.');
      setIsProcessing(false);
      return;
    }

    // For demo purposes without backend - just use amount directly
    // In production, you would create an order via backend API first

    const options = {
      key: 'rzp_test_RYB2hx3Up7ZLSi', // Your Razorpay test key
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'Eventra',
      description: 'Event Equipment Rental',
      image: 'https://img.icons8.com/fluency/96/000000/event-accepted.png',
      // Remove order_id for demo without backend
      handler: function (response) {
        // Payment successful
        console.log('Payment Successful:', response);
        
        toast.success('Payment successful! Your booking is confirmed.', {
          duration: 4000,
          icon: '✅',
        });

        // Clear the cart
        clearCart();

        // Call success callback
        if (onSuccess) {
          onSuccess(response);
        }

        setIsProcessing(false);
      },
      prefill: {
        name: currentUser.name || 'Customer',
        email: currentUser.email || '',
        contact: currentUser.phone || '',
      },
      notes: {
        address: 'Eventra Event Rentals',
      },
      theme: {
        color: '#f5c518', // Eventra primary color
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
          toast.error('Payment cancelled');
          if (onFailure) {
            onFailure('Payment cancelled by user');
          }
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        console.error('Payment Failed:', response.error);
        
        toast.error(`Payment failed: ${response.error.description}`, {
          duration: 5000,
        });

        if (onFailure) {
          onFailure(response.error);
        }

        setIsProcessing(false);
      });

      rzp.open();
    } catch (error) {
      console.error('Razorpay Error:', error);
      toast.error('Unable to initialize payment. Please try again.');
      setIsProcessing(false);
      
      if (onFailure) {
        onFailure(error);
      }
    }
  };

  return (
    <button
      className="btn btn-primary"
      onClick={handlePayment}
      disabled={isProcessing}
      style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
    >
      {isProcessing ? 'Processing...' : `Pay ₹${amount.toLocaleString('en-IN')}`}
    </button>
  );
};

export default RazorpayCheckout;
