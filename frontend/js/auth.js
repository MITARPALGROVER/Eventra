// Authentication system using localStorage
class AuthSystem {
  constructor() {
    this.currentUser = this.getCurrentUser();
    this.init();
  }

  init() {
    // Check if user is logged in on page load
    this.updateUIBasedOnAuth();
  }

  // Register new user
  register(userData) {
    const users = this.getUsers();
    
    // Check if email already exists
    if (users.find(user => user.email === userData.email)) {
      throw new Error('Email already exists');
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      favorites: [],
      bookings: []
    };

    users.push(newUser);
    localStorage.setItem('eventra_users', JSON.stringify(users));
    
    // Auto login after registration
    this.login(userData.email, userData.password);
    
    return newUser;
  }

  // Login user
  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Store current session
    localStorage.setItem('eventra_current_user', JSON.stringify(user));
    this.currentUser = user;
    this.updateUIBasedOnAuth();
    
    return user;
  }

  // Logout user
  logout() {
    localStorage.removeItem('eventra_current_user');
    this.currentUser = null;
    this.updateUIBasedOnAuth();
    window.location.href = 'index.html';
  }

  // Get current logged in user
  getCurrentUser() {
    const userData = localStorage.getItem('eventra_current_user');
    return userData ? JSON.parse(userData) : null;
  }

  // Get all users
  getUsers() {
    const users = localStorage.getItem('eventra_users');
    return users ? JSON.parse(users) : [];
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.currentUser !== null;
  }

  // Update UI based on authentication status
  updateUIBasedOnAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (this.isLoggedIn()) {
      // User is logged in
      if (loginBtn) {
        loginBtn.textContent = 'Dashboard';
        loginBtn.onclick = () => this.showUserDashboard();
      }
      if (signupBtn) {
        signupBtn.textContent = 'Logout';
        signupBtn.onclick = () => this.logout();
      }
    } else {
      // User is not logged in
      if (loginBtn) {
        loginBtn.textContent = 'Sign In';
        loginBtn.onclick = () => window.location.href = 'login.html';
      }
      if (signupBtn) {
        signupBtn.textContent = 'Get Started';
        signupBtn.onclick = () => window.location.href = 'signup.html';
      }
    }
  }

  // Show user dashboard (simple alert for now)
  showUserDashboard() {
    alert(`Welcome ${this.currentUser.firstName}! Dashboard functionality would be implemented here.`);
  }

  // Add item to favorites
  addToFavorites(itemId, itemData) {
    if (!this.isLoggedIn()) {
      alert('Please login to add favorites');
      return false;
    }

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === this.currentUser.id);
    
    if (userIndex !== -1) {
      if (!users[userIndex].favorites.find(fav => fav.id === itemId)) {
        users[userIndex].favorites.push({ id: itemId, ...itemData, addedAt: new Date().toISOString() });
        localStorage.setItem('eventra_users', JSON.stringify(users));
        localStorage.setItem('eventra_current_user', JSON.stringify(users[userIndex]));
        this.currentUser = users[userIndex];
        return true;
      }
    }
    return false;
  }

  // Remove from favorites
  removeFromFavorites(itemId) {
    if (!this.isLoggedIn()) return false;

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === this.currentUser.id);
    
    if (userIndex !== -1) {
      users[userIndex].favorites = users[userIndex].favorites.filter(fav => fav.id !== itemId);
      localStorage.setItem('eventra_users', JSON.stringify(users));
      localStorage.setItem('eventra_current_user', JSON.stringify(users[userIndex]));
      this.currentUser = users[userIndex];
      return true;
    }
    return false;
  }

  // Check if item is in favorites
  isFavorite(itemId) {
    if (!this.isLoggedIn()) return false;
    return this.currentUser.favorites.some(fav => fav.id === itemId);
  }
}

// Initialize auth system
window.authSystem = new AuthSystem();