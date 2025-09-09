// Favorites functionality
class FavoritesManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateFavoriteButtons();
  }

  setupEventListeners() {
    // Favorite button clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.favorite-button')) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleFavorite(e.target.closest('.favorite-button'));
      }
    });
  }

  toggleFavorite(button) {
    if (!window.authSystem.isLoggedIn()) {
      window.showWarning('Please login to add favorites', 'Login Required');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
      return;
    }

    const productCard = button.closest('.product-card');
    const itemId = this.getItemId(productCard);
    const itemData = this.extractItemData(productCard);

    if (window.authSystem.isFavorite(itemId)) {
      // Remove from favorites
      window.authSystem.removeFromFavorites(itemId);
      this.updateFavoriteButton(button, false);
      this.showFavoriteNotification('Removed from favorites', false);
    } else {
      // Add to favorites
      window.authSystem.addToFavorites(itemId, itemData);
      this.updateFavoriteButton(button, true);
      this.showFavoriteNotification('Added to favorites', true);
    }
  }

  updateFavoriteButton(button, isFavorite) {
    const path = button.querySelector('path');
    
    if (isFavorite) {
      button.classList.add('active');
      path.setAttribute('fill', 'currentColor');
      // Add heart beat animation
      button.style.animation = 'heartBeat 0.6s ease-in-out';
      setTimeout(() => {
        button.style.animation = '';
      }, 600);
    } else {
      button.classList.remove('active');
      path.setAttribute('fill', 'none');
    }
  }

  updateFavoriteButtons() {
    if (!window.authSystem.isLoggedIn()) return;

    document.querySelectorAll('.favorite-button').forEach(button => {
      const productCard = button.closest('.product-card');
      const itemId = this.getItemId(productCard);
      const isFavorite = window.authSystem.isFavorite(itemId);
      this.updateFavoriteButton(button, isFavorite);
    });
  }

  getItemId(productCard) {
    const title = productCard.querySelector('.product-title').textContent;
    const price = productCard.querySelector('.product-price').textContent;
    return btoa(title + price).replace(/[^a-zA-Z0-9]/g, '');
  }

  extractItemData(productCard) {
    const title = productCard.querySelector('.product-title').textContent;
    const price = productCard.querySelector('.product-price').textContent;
    const image = productCard.querySelector('img').src;
    const categoryElement = productCard.querySelector('.product-category');
    const category = categoryElement ? categoryElement.textContent : 'General';
    
    return {
      title,
      price,
      image,
      category
    };
  }

  showFavoriteNotification(message, isAdded) {
    const notification = document.createElement('div');
    notification.className = 'favorite-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${isAdded ? '❤️' : '💔'}</span>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentElement) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 2000);
  }
}

// Initialize favorites manager
window.favoritesManager = new FavoritesManager();

// Add favorite notification styles
const favoriteStyles = `
  .favorite-notification {
    position: fixed;
    top: 100px;
    right: 20px;
    background: white;
    border: 1px solid #e5e7eb;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .favorite-notification.show {
    transform: translateX(0);
  }

  .notification-content {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #333;
  }

  .notification-icon {
    font-size: 16px;
  }
`;

const favoriteStyleSheet = document.createElement('style');
favoriteStyleSheet.textContent = favoriteStyles;
document.head.appendChild(favoriteStyleSheet);