// Booking system functionality
class BookingSystem {
  constructor() {
    this.bookings = this.getBookings();
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  // Get bookings from localStorage
  getBookings() {
    const bookings = localStorage.getItem('eventra_bookings');
    return bookings ? JSON.parse(bookings) : [];
  }

  // Save bookings to localStorage
  saveBookings() {
    localStorage.setItem('eventra_bookings', JSON.stringify(this.bookings));
  }

  // Create new booking
  createBooking(bookingData) {
    if (!window.authSystem.isLoggedIn()) {
      throw new Error('Please login to make a booking');
    }

    const booking = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      userId: window.authSystem.currentUser.id,
      ...bookingData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      totalAmount: this.calculateTotal(bookingData.items)
    };

    this.bookings.push(booking);
    this.saveBookings();
    
    // Add to user's bookings
    this.addBookingToUser(booking);
    
    return booking;
  }

  // Add booking to user's record
  addBookingToUser(booking) {
    const users = window.authSystem.getUsers();
    const userIndex = users.findIndex(u => u.id === booking.userId);
    
    if (userIndex !== -1) {
      if (!users[userIndex].bookings) {
        users[userIndex].bookings = [];
      }
      users[userIndex].bookings.push(booking.id);
      localStorage.setItem('eventra_users', JSON.stringify(users));
    }
  }

  // Calculate total amount
  calculateTotal(items) {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
      const days = item.rentalDays || 1;
      return total + (price * item.quantity * days);
    }, 0);
  }

  // Get user bookings
  getUserBookings(userId) {
    return this.bookings.filter(booking => booking.userId === userId);
  }

  // Update booking status
  updateBookingStatus(bookingId, status) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = status;
      booking.updatedAt = new Date().toISOString();
      this.saveBookings();
    }
  }

  // Setup event listeners
  setupEventListeners() {
    // Book now buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('book-now-btn')) {
        e.preventDefault();
        this.handleBookNow(e.target);
      }
    });
  }

  // Handle book now button click
  handleBookNow(button) {
    if (!window.authSystem.isLoggedIn()) {
      alert('Please login to make a booking');
      window.location.href = 'login.html';
      return;
    }

    const productCard = button.closest('.product-card');
    const item = this.extractItemData(productCard);
    
    this.showBookingModal(item);
  }

  // Extract item data from product card
  extractItemData(productCard) {
    const title = productCard.querySelector('.product-title').textContent;
    const price = productCard.querySelector('.product-price').textContent;
    const image = productCard.querySelector('img').src;
    const categoryElement = productCard.querySelector('.product-category');
    const category = categoryElement ? categoryElement.textContent : 'General';
    
    return {
      id: title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') + '-' + Date.now(),
      title,
      price,
      image,
      category
    };
  }

  // Show booking modal
  showBookingModal(item) {
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>Book ${item.title}</h3>
          <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="booking-item">
            <img src="${item.image}" alt="${item.title}">
            <div class="item-details">
              <h4>${item.title}</h4>
              <p class="item-category">${item.category}</p>
              <p class="item-price">${item.price}</p>
            </div>
          </div>
          <form class="booking-form">
            <div class="form-group">
              <label for="eventDate">Event Date</label>
              <input type="date" id="eventDate" required min="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
              <label for="rentalDays">Rental Duration (Days)</label>
              <select id="rentalDays" required>
                <option value="1">1 Day</option>
                <option value="2">2 Days</option>
                <option value="3">3 Days</option>
                <option value="7">1 Week</option>
              </select>
            </div>
            <div class="form-group">
              <label for="quantity">Quantity</label>
              <input type="number" id="quantity" value="1" min="1" max="10" required>
            </div>
            <div class="form-group">
              <label for="eventLocation">Event Location</label>
              <input type="text" id="eventLocation" placeholder="Enter event address" required>
            </div>
            <div class="form-group">
              <label for="specialRequests">Special Requests (Optional)</label>
              <textarea id="specialRequests" placeholder="Any special requirements or notes"></textarea>
            </div>
            <div class="booking-total">
              <strong>Total: <span id="bookingTotal">${item.price}</span></strong>
            </div>
            <button type="submit" class="btn btn-primary btn-lg">Confirm Booking</button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    
    // Setup modal functionality
    this.setupModalEvents(modal, item);
    
    // Show modal with animation
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
  }

  // Setup modal events
  setupModalEvents(modal, item) {
    const closeBtn = modal.querySelector('.close-modal');
    const overlay = modal.querySelector('.modal-overlay');
    const form = modal.querySelector('.booking-form');
    const quantityInput = modal.querySelector('#quantity');
    const daysSelect = modal.querySelector('#rentalDays');
    const totalSpan = modal.querySelector('#bookingTotal');

    // Close modal
    const closeModal = () => {
      modal.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // Update total when quantity or days change
    const updateTotal = () => {
      const quantity = parseInt(quantityInput.value);
      const days = parseInt(daysSelect.value);
      const basePrice = parseFloat(item.price.replace(/[^\d.]/g, ''));
      const total = basePrice * quantity * days;
      totalSpan.textContent = `₹${total.toLocaleString('en-IN')}`;
    };

    quantityInput.addEventListener('input', updateTotal);
    daysSelect.addEventListener('change', updateTotal);

    // Handle form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const bookingData = {
        items: [{
          ...item,
          quantity: parseInt(quantityInput.value),
          rentalDays: parseInt(daysSelect.value)
        }],
        eventDate: document.getElementById('eventDate').value,
        eventLocation: document.getElementById('eventLocation').value,
        specialRequests: document.getElementById('specialRequests').value
      };

      try {
        const booking = this.createBooking(bookingData);
        closeModal();
        
        // Show payment modal instead of direct confirmation
        if (window.paymentSystem) {
          const paymentData = {
            items: booking.items,
            totalAmount: booking.totalAmount,
            bookingId: booking.id,
            eventDate: booking.eventDate,
            eventLocation: booking.eventLocation,
            specialRequests: booking.specialRequests
          };
          window.paymentSystem.showPaymentModal(paymentData);
        } else {
          this.showBookingConfirmation(booking);
        }
      } catch (error) {
        alert(error.message);
      }
    });
  }

  // Show booking confirmation
  showBookingConfirmation(booking) {
    const confirmation = document.createElement('div');
    confirmation.className = 'booking-confirmation';
    confirmation.innerHTML = `
      <div class="confirmation-content">
        <div class="success-icon">✓</div>
        <h3>Booking Confirmed!</h3>
        <p>Your booking ID: <strong>${booking.id}</strong></p>
        <p>Total Amount: <strong>₹${booking.totalAmount.toLocaleString('en-IN')}</strong></p>
        <p>We'll contact you soon to confirm the details.</p>
        <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">
          Continue Shopping
        </button>
      </div>
    `;

    document.body.appendChild(confirmation);
    
    setTimeout(() => {
      confirmation.classList.add('show');
    }, 10);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (confirmation.parentElement) {
        confirmation.remove();
      }
    }, 5000);
  }
}

// Initialize booking system
window.bookingSystem = new BookingSystem();

// Add booking modal styles
const bookingStyles = `
  .booking-modal {
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

  .booking-modal.show {
    opacity: 1;
    visibility: visible;
  }

  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
  }

  .modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 16px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
  }

  .modal-header h3 {
    margin: 0;
    color: #111;
  }

  .close-modal {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
  }

  .modal-body {
    padding: 20px;
  }

  .booking-item {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    padding: 16px;
    background: #f9f9f9;
    border-radius: 12px;
  }

  .booking-item img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
  }

  .item-details h4 {
    margin: 0 0 4px;
    color: #111;
  }

  .item-category {
    color: #666;
    font-size: 0.9rem;
    margin: 0 0 4px;
  }

  .item-price {
    color: var(--primary);
    font-weight: bold;
    margin: 0;
  }

  .booking-form .form-group {
    margin-bottom: 16px;
  }

  .booking-form label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    color: #111;
  }

  .booking-form input,
  .booking-form select,
  .booking-form textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
  }

  .booking-form textarea {
    resize: vertical;
    min-height: 80px;
  }

  .booking-total {
    background: #f0f8ff;
    padding: 16px;
    border-radius: 8px;
    margin: 20px 0;
    text-align: center;
    font-size: 1.2rem;
  }

  .booking-confirmation {
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

  .booking-confirmation.show {
    opacity: 1;
  }

  .confirmation-content {
    background: white;
    padding: 40px;
    border-radius: 16px;
    text-align: center;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .success-icon {
    width: 60px;
    height: 60px;
    background: #10b981;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    margin: 0 auto 20px;
  }

  .confirmation-content h3 {
    margin: 0 0 16px;
    color: #111;
  }

  .confirmation-content p {
    margin: 8px 0;
    color: #666;
  }
`;

const bookingStyleSheet = document.createElement('style');
bookingStyleSheet.textContent = bookingStyles;
document.head.appendChild(bookingStyleSheet);