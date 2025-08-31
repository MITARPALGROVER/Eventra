// Payment processing system (frontend simulation)
class PaymentSystem {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  // Process payment (simulated)
  processPayment(paymentData) {
    return new Promise((resolve, reject) => {
      // Simulate payment processing delay
      setTimeout(() => {
        // Simulate 95% success rate
        if (Math.random() > 0.05) {
          const transaction = {
            id: 'TXN' + Date.now().toString(),
            amount: paymentData.amount,
            status: 'success',
            method: paymentData.method,
            timestamp: new Date().toISOString()
          };
          resolve(transaction);
        } else {
          reject(new Error('Payment failed. Please try again.'));
        }
      }, 2000);
    });
  }

  // Show payment modal
  showPaymentModal(bookingData) {
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>Complete Payment</h3>
          <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="payment-summary">
            <h4>Order Summary</h4>
            <div class="summary-items">
              ${bookingData.items.map(item => `
                <div class="summary-item">
                  <span>${item.title} x${item.quantity}</span>
                  <span>₹${(parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity * (item.rentalDays || 1)).toLocaleString('en-IN')}</span>
                </div>
              `).join('')}
            </div>
            <div class="summary-total">
              <strong>Total: ₹${bookingData.totalAmount.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          ${!bookingData.eventLocation ? `
          <div class="address-section">
            <h4>Event Details</h4>
            <div class="form-group">
              <label for="eventDate">Event Date</label>
              <input type="date" id="eventDate" required>
            </div>
            <div class="form-group">
              <label for="eventLocation">Event Location</label>
              <textarea id="eventLocation" placeholder="Enter complete event address" required></textarea>
            </div>
            <div class="form-group">
              <label for="specialRequests">Special Requirements (Optional)</label>
              <textarea id="specialRequests" placeholder="Any special requirements or instructions"></textarea>
            </div>
          </div>
          ` : ''}
          
          <div class="payment-methods">
            <h4>Payment Method</h4>
            <div class="payment-options">
              <label class="payment-option">
                <input type="radio" name="paymentMethod" value="card" checked>
                <span class="option-content">
                  <span class="option-icon">💳</span>
                  <span>Credit/Debit Card</span>
                </span>
              </label>
              <label class="payment-option">
                <input type="radio" name="paymentMethod" value="upi">
                <span class="option-content">
                  <span class="option-icon">📱</span>
                  <span>UPI Payment</span>
                </span>
              </label>
              <label class="payment-option">
                <input type="radio" name="paymentMethod" value="netbanking">
                <span class="option-content">
                  <span class="option-icon">🏦</span>
                  <span>Net Banking</span>
                </span>
              </label>
            </div>
          </div>

          <div class="payment-form" id="cardForm">
            <div class="form-group">
              <label for="cardNumber">Card Number</label>
              <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="expiryDate">Expiry Date</label>
                <input type="text" id="expiryDate" placeholder="MM/YY" maxlength="5">
              </div>
              <div class="form-group">
                <label for="cvv">CVV</label>
                <input type="text" id="cvv" placeholder="123" maxlength="3">
              </div>
            </div>
            <div class="form-group">
              <label for="cardName">Cardholder Name</label>
              <input type="text" id="cardName" placeholder="Enter name on card">
            </div>
          </div>

          <div class="payment-form" id="upiForm" style="display: none;">
            <div class="form-group">
              <label for="upiId">UPI ID</label>
              <input type="text" id="upiId" placeholder="yourname@paytm">
            </div>
          </div>

          <div class="payment-form" id="netbankingForm" style="display: none;">
            <div class="form-group">
              <label for="bankSelect">Select Bank</label>
              <select id="bankSelect">
                <option value="">Choose your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
              </select>
            </div>
          </div>

          <button type="button" class="btn btn-primary btn-lg payment-btn" id="processPaymentBtn">
            <span class="btn-text">Pay ₹${bookingData.totalAmount.toLocaleString('en-IN')}</span>
            <span class="btn-loading" style="display: none;">
              <div class="loading-spinner"></div>
              Processing...
            </span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.setupPaymentModalEvents(modal, bookingData);
    
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
  }

  // Setup payment modal events
  setupPaymentModalEvents(modal, bookingData) {
    const closeBtn = modal.querySelector('.close-modal');
    const overlay = modal.querySelector('.modal-overlay');
    const paymentOptions = modal.querySelectorAll('input[name="paymentMethod"]');
    const paymentBtn = modal.querySelector('#processPaymentBtn');
    const cardForm = modal.querySelector('#cardForm');
    const upiForm = modal.querySelector('#upiForm');
    const netbankingForm = modal.querySelector('#netbankingForm');

    // Close modal
    const closeModal = () => {
      modal.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // Payment method selection
    paymentOptions.forEach(option => {
      option.addEventListener('change', () => {
        // Hide all forms
        cardForm.style.display = 'none';
        upiForm.style.display = 'none';
        netbankingForm.style.display = 'none';

        // Show selected form
        switch (option.value) {
          case 'card':
            cardForm.style.display = 'block';
            break;
          case 'upi':
            upiForm.style.display = 'block';
            break;
          case 'netbanking':
            netbankingForm.style.display = 'block';
            break;
        }
      });
    });

    // Process payment
    paymentBtn.addEventListener('click', async () => {
      const selectedMethod = modal.querySelector('input[name="paymentMethod"]:checked').value;
      
      // Collect address data if form exists
      let addressData = {};
      const eventDateInput = modal.querySelector('#eventDate');
      const eventLocationInput = modal.querySelector('#eventLocation');
      const specialRequestsInput = modal.querySelector('#specialRequests');
      
      if (eventDateInput && eventLocationInput) {
        if (!eventDateInput.value || !eventLocationInput.value) {
          alert('Please fill in all required event details.');
          return;
        }
        addressData = {
          eventDate: eventDateInput.value,
          eventLocation: eventLocationInput.value,
          specialRequests: specialRequestsInput.value || ''
        };
      }
      
      // Show loading state
      const btnText = paymentBtn.querySelector('.btn-text');
      const btnLoading = paymentBtn.querySelector('.btn-loading');
      btnText.style.display = 'none';
      btnLoading.style.display = 'flex';
      paymentBtn.disabled = true;

      try {
        const transaction = await this.processPayment({
          amount: bookingData.totalAmount,
          method: selectedMethod
        });

        // Create booking with complete data
        const completeBookingData = {
          ...bookingData,
          ...addressData,
          transactionId: transaction.id
        };

        // Save booking if we have the booking system
        if (window.bookingSystem && addressData.eventDate) {
          window.bookingSystem.createBooking(completeBookingData);
        }

        // Payment successful
        closeModal();
        // Redirect to order confirmation page
        const orderParams = new URLSearchParams({
          orderId: transaction.id,
          total: completeBookingData.totalAmount,
          eventDate: completeBookingData.eventDate || ''
        });
        window.location.href = `order-confirmation.html?${orderParams.toString()}`;
        
        // Clear cart if items were from cart
        if (window.shoppingCart) {
          window.shoppingCart.clearCart();
        }

      } catch (error) {
        // Payment failed
        alert(error.message);
        
        // Reset button state
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
        paymentBtn.disabled = false;
      }
    });

    // Format card number input
    const cardNumberInput = modal.querySelector('#cardNumber');
    if (cardNumberInput) {
      cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
      });
    }

    // Format expiry date input
    const expiryInput = modal.querySelector('#expiryDate');
    if (expiryInput) {
      expiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
          value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
      });
    }
  }

  // Show payment success
  showPaymentSuccess(transaction, bookingData) {
    const success = document.createElement('div');
    success.className = 'payment-success';
    success.innerHTML = `
      <div class="success-content">
        <div class="success-animation">
          <div class="checkmark">✓</div>
        </div>
        <h3>Payment Successful!</h3>
        <p>Transaction ID: <strong>${transaction.id}</strong></p>
        <p>Amount Paid: <strong>₹${transaction.amount.toLocaleString('en-IN')}</strong></p>
        <p>Your booking has been confirmed. We'll send you a confirmation email shortly.</p>
        <div class="success-actions">
          <button class="btn btn-primary" onclick="window.location.href='index.html'">
            Back to Home
          </button>
          <button class="btn btn-ghost" onclick="this.closest('.payment-success').remove()">
            Continue Shopping
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(success);
    
    setTimeout(() => {
      success.classList.add('show');
    }, 10);
  }

  // Setup event listeners
  setupEventListeners() {
    // Checkout buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('checkout-btn')) {
        e.preventDefault();
        this.handleCheckout();
      }
    });
  }

  // Handle checkout
  handleCheckout() {
    if (!window.authSystem.isLoggedIn()) {
      alert('Please login to proceed with checkout');
      window.location.href = 'login.html';
      return;
    }

    if (!window.shoppingCart || window.shoppingCart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const bookingData = {
      items: window.shoppingCart.items,
      totalAmount: window.shoppingCart.getTotal()
    };

    this.showPaymentModal(bookingData);
  }
}

// Initialize payment system
window.paymentSystem = new PaymentSystem();

// Add payment styles
const paymentStyles = `
  .payment-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .payment-modal.show {
    opacity: 1;
    visibility: visible;
  }

  .payment-summary {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 24px;
  }

  .payment-summary h4 {
    margin: 0 0 16px;
    color: #111;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    color: #666;
  }

  .summary-total {
    border-top: 1px solid #ddd;
    padding-top: 12px;
    margin-top: 12px;
    font-size: 1.1rem;
  }

  .payment-methods h4 {
    margin: 0 0 16px;
    color: #111;
  }

  .payment-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }

  .payment-option {
    display: flex;
    align-items: center;
    padding: 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .payment-option:hover {
    border-color: #d1d5db;
  }

  .payment-option input[type="radio"] {
    margin-right: 12px;
  }

  .payment-option input[type="radio"]:checked + .option-content {
    color: var(--primary);
  }

  .payment-option:has(input:checked) {
    border-color: var(--primary);
    background: #fff8e0;
  }

  .option-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .option-icon {
    font-size: 20px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 16px;
  }

  .payment-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-loading {
    display: none;
    align-items: center;
    gap: 8px;
  }

  .payment-success {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .payment-success.show {
    opacity: 1;
  }

  .success-content {
    background: white;
    padding: 40px;
    border-radius: 16px;
    text-align: center;
    max-width: 450px;
    width: 90%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .success-animation {
    margin-bottom: 24px;
  }

  .checkmark {
    width: 80px;
    height: 80px;
    background: #10b981;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: bold;
    margin: 0 auto;
    animation: checkmarkPop 0.6s ease-out;
  }

  @keyframes checkmarkPop {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  .success-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 24px;
  }

  .success-actions .btn {
    flex: 1;
    max-width: 150px;
  }
`;

const paymentStyleSheet = document.createElement('style');
paymentStyleSheet.textContent = paymentStyles;
document.head.appendChild(paymentStyleSheet);