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
            ${bookingData.items.length === 1 ? `
            <div class="booking-options">
              <div class="form-row">
                <div class="form-group">
                  <label for="quantity">Quantity</label>
                  <input type="number" id="quantity" value="${bookingData.items[0].quantity}" min="1" max="10" required>
                </div>
                <div class="form-group">
                  <label for="rentalDays">Rental Duration</label>
                  <select id="rentalDays" required>
                    <option value="1" ${bookingData.items[0].rentalDays === 1 ? 'selected' : ''}>1 Day</option>
                    <option value="2" ${bookingData.items[0].rentalDays === 2 ? 'selected' : ''}>2 Days</option>
                    <option value="3" ${bookingData.items[0].rentalDays === 3 ? 'selected' : ''}>3 Days</option>
                    <option value="7" ${bookingData.items[0].rentalDays === 7 ? 'selected' : ''}>1 Week</option>
                  </select>
                </div>
              </div>
            </div>
            ` : ''}
            <div class="form-group">
              <label for="eventDate">Event Date</label>
              <input type="date" id="eventDate" required min="${new Date().toISOString().split('T')[0]}">
            </div>
            
            <h5 style="margin: 24px 0 16px 0; font-size: 1.1rem; font-weight: 600; color: #1f2937;">Event Address</h5>
            
            <div class="form-group">
              <label for="eventVenue">Venue/Building Name</label>
              <input type="text" id="eventVenue" placeholder="e.g., Grand Hotel, Community Center" required>
            </div>
            
            <div class="form-group">
              <label for="eventAddress">Street Address</label>
              <textarea id="eventAddress" placeholder="House/Building No., Street Name, Area" rows="2" required></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="eventCity">City</label>
                <input type="text" id="eventCity" placeholder="e.g., Mumbai, Delhi" required>
              </div>
              <div class="form-group">
                <label for="eventPincode">Pincode</label>
                <input type="text" id="eventPincode" placeholder="e.g., 400001" pattern="[0-9]{6}" maxlength="6" required>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="eventState">State</label>
                <select id="eventState" required>
                  <option value="">Select State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Puducherry">Puducherry</option>
                  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                  <option value="Ladakh">Ladakh</option>
                </select>
              </div>
              <div class="form-group">
                <label for="eventCountry">Country</label>
                <input type="text" id="eventCountry" value="India" readonly style="background: #f3f4f6; color: #6b7280;">
              </div>
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
    const quantityInput = modal.querySelector('#quantity');
    const rentalDaysSelect = modal.querySelector('#rentalDays');

    // Update total when quantity or rental days change (for single item bookings)
    const updateTotal = () => {
      if (bookingData.items.length === 1 && quantityInput && rentalDaysSelect) {
        const basePrice = parseFloat(bookingData.items[0].price.replace(/[^\d.]/g, ''));
        const quantity = parseInt(quantityInput.value);
        const rentalDays = parseInt(rentalDaysSelect.value);
        const newTotal = basePrice * quantity * rentalDays;
        
        // Update booking data
        bookingData.items[0].quantity = quantity;
        bookingData.items[0].rentalDays = rentalDays;
        bookingData.totalAmount = newTotal;
        
        // Update summary display
        const summaryTotal = modal.querySelector('.summary-total strong');
        if (summaryTotal) {
          summaryTotal.textContent = `Total: ₹${newTotal.toLocaleString('en-IN')}`;
        }
        
        // Update individual item display
        const summaryItem = modal.querySelector('.summary-item:last-child span:last-child');
        if (summaryItem) {
          summaryItem.textContent = `₹${newTotal.toLocaleString('en-IN')}`;
        }
      }
    };

    if (quantityInput) quantityInput.addEventListener('input', updateTotal);
    if (rentalDaysSelect) rentalDaysSelect.addEventListener('change', updateTotal);

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
      const eventVenueInput = modal.querySelector('#eventVenue');
      const eventAddressInput = modal.querySelector('#eventAddress');
      const eventCityInput = modal.querySelector('#eventCity');
      const eventPincodeInput = modal.querySelector('#eventPincode');
      const eventStateInput = modal.querySelector('#eventState');
      const eventCountryInput = modal.querySelector('#eventCountry');
      const specialRequestsInput = modal.querySelector('#specialRequests');
      
      if (eventDateInput && eventVenueInput) {
        // Validate required fields
        if (!eventDateInput.value || !eventVenueInput.value || !eventAddressInput.value || 
            !eventCityInput.value || !eventPincodeInput.value || !eventStateInput.value) {
          window.showWarning('Please fill in all required event details.', 'Missing Information');
          return;
        }
        
        // Validate pincode format
        const pincodePattern = /^[0-9]{6}$/;
        if (!pincodePattern.test(eventPincodeInput.value)) {
          window.showWarning('Please enter a valid 6-digit pincode.', 'Invalid Pincode');
          return;
        }
        
        // Combine address data
        const fullAddress = `${eventVenueInput.value}, ${eventAddressInput.value}, ${eventCityInput.value}, ${eventStateInput.value} - ${eventPincodeInput.value}, ${eventCountryInput.value}`;
        
        addressData = {
          eventDate: eventDateInput.value,
          eventLocation: fullAddress,
          eventVenue: eventVenueInput.value,
          eventAddress: eventAddressInput.value,
          eventCity: eventCityInput.value,
          eventPincode: eventPincodeInput.value,
          eventState: eventStateInput.value,
          eventCountry: eventCountryInput.value,
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

        // Send email confirmation
        await this.sendEmailConfirmation(completeBookingData, transaction);

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
        window.showError(error.message, 'Payment Failed');
        
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
      window.showWarning('Please login to proceed with checkout', 'Login Required');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
      return;
    }

    if (!window.shoppingCart || window.shoppingCart.items.length === 0) {
      window.showWarning('Your cart is empty', 'Empty Cart');
      return;
    }

    const bookingData = {
      items: window.shoppingCart.items,
      totalAmount: window.shoppingCart.getTotal()
    };

    this.showPaymentModal(bookingData);
  }

  // Send email confirmation after payment
  async sendEmailConfirmation(bookingData, transaction) {
    try {
      // Only send email if email service is available
      if (!window.emailService) {
        console.log('Email service not available');
        return;
      }

      // Get customer information
      const currentUser = window.authSystem?.currentUser;
      if (!currentUser) {
        console.log('No user information available for email');
        return;
      }

      // Prepare email data
      const emailData = {
        customerName: currentUser.fullName || currentUser.name || 'Customer',
        customerEmail: currentUser.email,
        orderId: transaction.id,
        transactionId: transaction.id,
        totalAmount: bookingData.totalAmount,
        items: bookingData.items || [],
        eventDate: bookingData.eventDate || null,
        eventLocation: bookingData.eventLocation || null,
        paymentMethod: transaction.method || 'Credit Card',
        bookingDate: new Date().toISOString()
      };

      // Send payment confirmation email
      await window.emailService.sendPaymentConfirmation(emailData);
      
    } catch (error) {
      console.error('Failed to send email confirmation:', error);
      // Don't throw error to avoid disrupting payment flow
    }
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