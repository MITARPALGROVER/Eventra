// Dashboard functionality
class DashboardManager {
  constructor() {
    this.init();
  }

  init() {
    this.checkAuth();
    this.loadUserData();
    this.setupTabs();
    this.setupEventListeners();
    this.createSampleDataIfNeeded();
    this.loadDashboardData();
  }

  checkAuth() {
    if (!window.authSystem.isLoggedIn()) {
      window.location.href = 'login.html';
      return;
    }
  }

  loadUserData() {
    const user = window.authSystem.currentUser;
    if (user) {
      document.getElementById('userName').textContent = user.firstName;
      
      // Populate profile form
      document.getElementById('firstName').value = user.firstName || '';
      document.getElementById('lastName').value = user.lastName || '';
      document.getElementById('email').value = user.email || '';
      document.getElementById('phone').value = user.phone || '';
      document.getElementById('address').value = user.address || '';
    }
  }

  setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active tab panel
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        
        // Load tab-specific data
        this.loadTabData(tabId);
      });
    });
  }

  loadTabData(tabId) {
    switch (tabId) {
      case 'bookings':
        this.loadBookings();
        break;
      case 'favorites':
        this.loadFavorites();
        break;
      case 'overview':
        this.loadOverview();
        break;
    }
  }

  loadDashboardData() {
    this.loadOverview();
    this.loadBookings();
    this.loadFavorites();
  }

  createSampleDataIfNeeded() {
    const user = window.authSystem.currentUser;
    if (!user || !window.bookingSystem) return;

    // Check if user already has bookings
    const existingBookings = window.bookingSystem.getUserBookings(user.id);
    if (existingBookings.length > 0) {
      console.log('User already has real bookings, skipping sample data creation');
      return;
    }

    console.log('Creating sample data for demonstration purposes...');

    // Create sample bookings for demonstration
    const sampleBookings = [
      {
        items: [
          {
            id: 'professional-sound-system',
            title: 'Professional Sound System',
            price: '₹8,500',
            category: 'Sound Systems',
            quantity: 1,
            rentalDays: 2
          }
        ],
        eventDate: '2025-09-15',
        eventLocation: 'Grand Ballroom, Mumbai',
        totalAmount: 17000,
        status: 'confirmed'
      },
      {
        items: [
          {
            id: 'led-dance-floor',
            title: 'LED Dance Floor',
            price: '₹15,000',
            category: 'Lighting',
            quantity: 1,
            rentalDays: 1
          }
        ],
        eventDate: '2025-09-20',
        eventLocation: 'Outdoor Garden, Delhi',
        totalAmount: 15000,
        status: 'pending'
      }
    ];

    // Add sample bookings
    sampleBookings.forEach(bookingData => {
      try {
        window.bookingSystem.createBooking(bookingData);
      } catch (error) {
        console.log('Error creating sample booking:', error);
      }
    });

    // Add sample favorites to user only if they don't have any
    if (!user.favorites || user.favorites.length === 0) {
      // Don't create sample favorites - let users add real ones from catalog
      user.favorites = [];
      console.log('User will add real favorites from the catalog');
      window.authSystem.saveUserData();
      console.log('User data saved without sample favorites');
    }
  }

  loadOverview() {
    const user = window.authSystem.currentUser;
    if (!user) {
      console.log('No user found');
      return;
    }

    console.log('Current user:', user);

    // Get user bookings (real data first)
    const userBookings = window.bookingSystem ? window.bookingSystem.getUserBookings(user.id) : [];
    console.log('User bookings:', userBookings);
    
    // Check if user has any real data
    const hasRealBookings = userBookings.length > 0;
    const hasRealFavorites = user.favorites && user.favorites.length > 0;
    
    // Only create sample data if user has NO real data at all
    if (!hasRealBookings && !hasRealFavorites) {
      console.log('No real data found, creating sample data for demonstration');
      this.createSampleDataIfNeeded();
      // Get updated bookings after sample data creation
      const updatedBookings = window.bookingSystem ? window.bookingSystem.getUserBookings(user.id) : [];
      this.displayDashboardStats(updatedBookings, user, true);
      // Refresh favorites after sample data creation
      this.loadFavorites();
    } else {
      console.log('Displaying real user data');
      this.displayDashboardStats(userBookings, user, false);
    }
  }

  displayDashboardStats(bookings, user, isSampleData) {
    // Refresh user data to get latest favorites
    const refreshedUser = window.authSystem.currentUser;
    console.log('Dashboard user before refresh:', user.favorites);
    console.log('Dashboard user after refresh:', refreshedUser.favorites);
    
    const totalBookings = bookings.length;
    const totalFavorites = refreshedUser.favorites ? refreshedUser.favorites.length : 0;
    const totalSpent = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

    console.log('Dashboard Stats:', { totalBookings, totalFavorites, totalSpent, isSampleData });

    // Update stats
    document.getElementById('totalBookings').textContent = totalBookings;
    document.getElementById('totalFavorites').textContent = totalFavorites;
    document.getElementById('totalSpent').textContent = `₹${totalSpent.toLocaleString('en-IN')}`;

    // Add indicator if showing sample data
    if (isSampleData) {
      const indicator = document.querySelector('.sample-data-indicator');
      if (!indicator) {
        const dashboard = document.querySelector('.dashboard-stats');
        const sampleIndicator = document.createElement('div');
        sampleIndicator.className = 'sample-data-indicator';
        sampleIndicator.innerHTML = '📋 Showing sample data for demonstration';
        sampleIndicator.style.cssText = 'background: #e3f2fd; padding: 8px 16px; margin: 10px 0; border-radius: 4px; text-align: center; color: #1976d2; font-size: 14px;';
        dashboard.appendChild(sampleIndicator);
      }
    }

    // Load recent activity
    this.loadRecentActivity(bookings);
  }

  loadRecentActivity(bookings) {
    const activityList = document.getElementById('activityList');
    
    if (bookings.length === 0) {
      activityList.innerHTML = `
        <div class="activity-item">
          <div class="activity-icon">🎉</div>
          <div class="activity-content">
            <div class="activity-title">Welcome to Eventra!</div>
            <div class="activity-time">Just now</div>
          </div>
        </div>
      `;
      return;
    }

    const recentBookings = bookings.slice(-5).reverse();
    activityList.innerHTML = recentBookings.map(booking => `
      <div class="activity-item">
        <div class="activity-icon">📦</div>
        <div class="activity-content">
          <div class="activity-title">Booking ${booking.id.slice(-6)} created</div>
          <div class="activity-time">${this.formatDate(booking.createdAt)}</div>
        </div>
      </div>
    `).join('');
  }

  loadBookings() {
    const user = window.authSystem.currentUser;
    if (!user) return;

    const bookingsList = document.getElementById('bookingsList');
    const userBookings = window.bookingSystem ? window.bookingSystem.getUserBookings(user.id) : [];

    if (userBookings.length === 0) {
      bookingsList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📅</div>
          <h4>No bookings yet</h4>
          <p>Start browsing our catalog to make your first booking!</p>
          <button class="btn btn-primary" onclick="window.location.href='categories.html'">
            Browse Catalog
          </button>
        </div>
      `;
      return;
    }

    // Status explanation guide
    const statusGuide = `
      <div class="status-explanation">
        <h4>Booking Status Guide</h4>
        <div class="status-guide">
          <div class="status-item">
            <span class="status-dot pending"></span>
            <span><strong>Pending:</strong> Your booking is being reviewed by our team</span>
          </div>
          <div class="status-item">
            <span class="status-dot confirmed"></span>
            <span><strong>Confirmed:</strong> Your booking has been approved and is scheduled</span>
          </div>
          <div class="status-item">
            <span class="status-dot completed"></span>
            <span><strong>Completed:</strong> Your event has taken place</span>
          </div>
        </div>
      </div>
    `;

    // Helper function to get readable booking ID
    const getReadableId = (id) => {
      return id.slice(-6).toUpperCase();
    };

    // Helper function to get status display
    const getStatusDisplay = (status) => {
      const statusMap = {
        'pending': 'Pending Review',
        'confirmed': 'Confirmed',
        'completed': 'Completed'
      };
      return statusMap[status.toLowerCase()] || status;
    };

    bookingsList.innerHTML = `
      <div class="bookings-full-container">
        ${statusGuide}
        <div class="bookings-content">
          <div class="bookings-header">
            <h3>Your Bookings</h3>
            <p class="helper-text">Reference numbers are for customer service inquiries</p>
          </div>
          <div class="bookings-list">
            ${userBookings.map(booking => `
              <div class="booking-item">
                <div class="booking-header">
                  <span class="booking-id">Ref: #${getReadableId(booking.id)}</span>
                  <span class="booking-status ${booking.status.toLowerCase()}">${getStatusDisplay(booking.status)}</span>
                </div>
                <div class="booking-details">
                  <h4 class="booking-item-name">${booking.items && booking.items.length > 0 ? booking.items.map(item => item.title || item.name || 'Item').join(', ') : 'Booking Item'}</h4>
                  <div class="booking-info">
                    <div class="booking-event-date">📅 Event Date: ${booking.eventDate || 'Not specified'}</div>
                    <div class="booking-location">📍 Location: ${booking.eventLocation || booking.location || 'TBD'}</div>
                  </div>
                </div>
                <div class="booking-total">
                  Total: ₹${(booking.totalAmount || 0).toLocaleString('en-IN')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  loadFavorites() {
    console.log('Loading favorites...');
    const user = window.authSystem.currentUser;
    if (!user) {
      console.log('No user found for favorites');
      return;
    }

    console.log('User favorites:', user.favorites);

    const favoritesList = document.getElementById('favoritesList');
    if (!favoritesList) {
      console.log('favoritesList element not found');
      return;
    }

    const favorites = user.favorites || [];
    console.log('Favorites to display:', favorites);

    if (favorites.length === 0) {
      console.log('No favorites found, showing empty state');
      favoritesList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">❤️</div>
          <h4>No favorites yet</h4>
          <p>Save items you love to easily find them later!</p>
          <button class="btn btn-primary" onclick="window.location.href='categories.html'">
            Browse Catalog
          </button>
        </div>
      `;
      return;
    }

    console.log('Rendering favorite items:', favorites);

    favoritesList.innerHTML = favorites.map(item => `
      <div class="favorite-item">
        <div class="favorite-info">
          <div class="favorite-title">${item.title}</div>
          <div class="favorite-category">${item.category}</div>
          <div class="favorite-price">${item.price}</div>
          <div class="favorite-actions">
            <button class="btn btn-sm btn-primary" onclick="window.dashboardManager.addToCart('${item.id}')">
              Add to Cart
            </button>
            <button class="btn btn-sm btn-ghost" onclick="window.dashboardManager.removeFavorite('${item.id}')">
              Remove
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  refreshStats() {
    // Method to refresh dashboard stats when data changes
    console.log('Refreshing dashboard stats...');
    const user = window.authSystem.currentUser;
    if (!user) return;

    const userBookings = window.bookingSystem ? window.bookingSystem.getUserBookings(user.id) : [];
    this.displayDashboardStats(userBookings, user, false);
  }

  setupEventListeners() {
    // Profile form submission
    document.getElementById('profileForm').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value
      };

      this.updateProfile(formData);
    });
  }

  updateProfile(formData) {
    const users = window.authSystem.getUsers();
    const userIndex = users.findIndex(u => u.id === window.authSystem.currentUser.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...formData };
      localStorage.setItem('eventra_users', JSON.stringify(users));
      localStorage.setItem('eventra_current_user', JSON.stringify(users[userIndex]));
      window.authSystem.currentUser = users[userIndex];
      
      window.showSuccess('Profile updated successfully!', 'Success');
    }
  }

  addToCart(itemId) {
    const user = window.authSystem.currentUser;
    const item = user.favorites.find(fav => fav.id === itemId);
    
    if (item && window.shoppingCart) {
      window.shoppingCart.addItem(item);
    }
  }

  removeFavorite(itemId) {
    window.authSystem.removeFromFavorites(itemId);
    this.loadFavorites();
    this.loadOverview(); // Refresh stats
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  }

  addToCart(itemId) {
    // Create item data for cart
    const itemData = {
      id: itemId,
      title: 'Event Item',
      price: 5000,
      originalPrice: '₹5,000',
      category: 'General'
    };

    if (window.shoppingCart) {
      window.shoppingCart.addItem(itemData);
      alert('Item added to cart successfully!');
    }
  }

  removeFavorite(itemId) {
    if (window.authSystem.removeFromFavorites(itemId)) {
      this.loadFavorites(); // Refresh the favorites display
      this.refreshStats(); // Refresh the stats
      alert('Item removed from favorites!');
    }
  }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  window.dashboardManager = new DashboardManager();
  
  // Navigation
  document.getElementById('loginBtn').addEventListener('click', () => {
    // Already on dashboard
  });
  
  document.getElementById('signupBtn').addEventListener('click', () => {
    window.authSystem.logout();
  });
});