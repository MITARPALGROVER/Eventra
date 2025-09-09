// Shopping cart functionality
class ShoppingCart {
  constructor() {
    this.items = this.getCartItems();
    this.init();
  }

  init() {
    this.updateCartUI();
    this.setupEventListeners();
  }

  // Get cart items from localStorage
  getCartItems() {
    const items = localStorage.getItem('eventra_cart');
    return items ? JSON.parse(items) : [];
  }

  // Save cart to localStorage
  saveCart() {
    localStorage.setItem('eventra_cart', JSON.stringify(this.items));
    this.updateCartUI();
  }

  // Add item to cart
  addItem(item) {
    const existingItem = this.items.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        ...item,
        quantity: 1,
        addedAt: new Date().toISOString()
      });
    }
    
    this.saveCart();
    this.showAddToCartAnimation();
    return true;
  }

  // Remove item from cart
  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.saveCart();
  }

  // Update item quantity
  updateQuantity(itemId, quantity) {
    const item = this.items.find(cartItem => cartItem.id === itemId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
  }

  // Get cart total
  getTotal() {
    return this.items.reduce((total, item) => {
      // Handle both string and number price formats
      let price = 0;
      if (typeof item.price === 'string') {
        price = parseFloat(item.price.replace(/[^\d.]/g, ''));
      } else if (typeof item.price === 'number') {
        price = item.price;
      }
      return total + (price * item.quantity);
    }, 0);
  }

  // Get cart item count
  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  // Clear cart
  clearCart() {
    this.items = [];
    this.saveCart();
  }

  // Update cart UI
  updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.querySelector('.cart-total');
    
    if (cartCount) {
      const count = this.getItemCount();
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
    
    if (cartTotal) {
      cartTotal.textContent = `₹${this.getTotal().toLocaleString('en-IN')}`;
    }
  }

  // Show add to cart animation
  showAddToCartAnimation() {
    // Create floating notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span>✓ Added to cart</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  }

  // Setup event listeners
  setupEventListeners() {
    // Add to cart buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart-btn')) {
        e.preventDefault();
        
        if (!window.authSystem.isLoggedIn()) {
          window.showWarning('Please login to add items to cart', 'Login Required');
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 2000);
          return;
        }

        const productCard = e.target.closest('.product-card');
        const item = this.extractItemData(productCard);
        this.addItem(item);
      }
    });
  }

  // Extract item data from product card
  extractItemData(productCard) {
    const title = productCard.querySelector('.product-title').textContent;
    const price = productCard.querySelector('.product-price').textContent;
    const image = productCard.querySelector('img').src;
    const categoryElement = productCard.querySelector('.product-category');
    const category = categoryElement ? categoryElement.textContent : 'General';
    
    return {
      id: title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'),
      title,
      price,
      image,
      category
    };
  }
}

// Initialize cart
window.shoppingCart = new ShoppingCart();

// Add cart notification styles
const cartStyles = `
  .cart-notification {
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--primary);
    color: var(--primary-ink);
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .cart-notification.show {
    transform: translateX(0);
  }

  .cart-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #e53e3e;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    display: none;
  }
`;

const cartStyleSheet = document.createElement('style');
cartStyleSheet.textContent = cartStyles;
document.head.appendChild(cartStyleSheet);