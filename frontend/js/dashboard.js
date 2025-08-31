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

  loadOverview() {
    const user = window.authSystem.currentUser;
    if (!user) return;

    // Get user bookings
    const userBookings = window.bookingSystem ? window.bookingSystem.getUserBookings(user.id) : [];
    const totalBookings = userBookings.length;
    const totalFavorites = user.favorites ? user.favorites.length : 0;
    const totalSpent = userBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

    // Update stats
    document.getElementById('totalBookings').textContent = totalBookings;
    document.getElementById('totalFavorites').textContent = totalFavorites;
    document.getElementById('totalSpent').textContent = `₹${totalSpent.toLocaleString('en-IN')}`;

    // Load recent activity
    this.loadRecentActivity(userBookings);
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

    bookingsList.innerHTML = userBookings.map(booking => `
      <div class="booking-item">
        <div class="booking-header">
          <span class="booking-id">Booking #${booking.id.slice(-8)}</span>
          <span class="booking-status ${booking.status}">${booking.status}</span>
        </div>
        <div class="booking-details">
          ${booking.items.map(item => item.title).join(', ')}
        </div>
        <div class="booking-details">
          Event Date: ${booking.eventDate || 'Not specified'}
        </div>
        <div class="booking-total">
          Total: ₹${booking.totalAmount.toLocaleString('en-IN')}
        </div>
      </div>
    `).join('');
  }

  loadFavorites() {
    const user = window.authSystem.currentUser;
    if (!user || !user.favorites) return;

    const favoritesList = document.getElementById('favoritesList');

    if (user.favorites.length === 0) {
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

    favoritesList.innerHTML = user.favorites.map(item => `
      <div class="favorite-item">
        <img src="${item.image}" alt="${item.title}">
        <div class="favorite-info">
          <div class="favorite-title">${item.title}</div>
          <div class="favorite-category">${item.category}</div>
          <div class="favorite-price">${item.price}</div>
          <div class="favorite-actions">
            <button class="btn btn-sm btn-primary" onclick="this.addToCart('${item.id}')">
              Add to Cart
            </button>
            <button class="btn btn-sm btn-ghost" onclick="this.removeFavorite('${item.id}')">
              Remove
            </button>
          </div>
        </div>
      </div>
    `).join('');
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
      
      alert('Profile updated successfully!');
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