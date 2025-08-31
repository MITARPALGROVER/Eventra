// Product Detail Page Functionality
class ProductDetailManager {
  constructor() {
    this.currentProduct = null;
    this.init();
  }

  init() {
    this.loadProductFromURL();
    this.setupEventListeners();
    this.setupImageGallery();
    this.setupTabs();
    this.updateCalculations();
  }

  loadProductFromURL() {
    // Get product data from URL parameters or use default
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const category = urlParams.get('category');
    
    // Mock product data (in real app, this would come from API)
    const products = {
      'maharaja-velvet-sofa': {
        id: 'maharaja-velvet-sofa',
        title: 'Maharaja Velvet Sofa',
        category: 'Royal Seating',
        price: 2500,
        currency: '₹',
        period: 'hr',
        description: 'An exquisite vintage velvet sofa that brings elegance and comfort to any event. Featuring rich burgundy upholstery and gold-finished legs, this piece is perfect for creating intimate seating areas at weddings, galas, and corporate events.',
        images: [
          'https://cpimg.tistatic.com/5553478/b/1/maharaja-wooden-sofa.jpg',
          'https://m.media-amazon.com/images/I/6143l5UinSL._UF1000,1000_QL80_.jpg',
          'https://www.insaraf.com/cdn/shop/products/DSC_3887_eb0cd51d-3131-4df0-9cf8-daf24ec8e620_2048x.jpg?v=1556419293',
          'https://craftzone.in/backend/uploads/products/SKU0000001081/ebffdf8a3f1b5b7c5786677b09481cee.webp'
        ],
        rating: 4.9,
        reviewCount: 24,
        features: [
          'Premium velvet upholstery',
          'Solid hardwood frame',
          'Gold-finished metal legs',
          'Seats up to 3 people comfortably',
          'Professional cleaning included',
          'Perfect for luxury events'
        ],
        specifications: {
          'Dimensions': '84" W x 36" D x 32" H',
          'Weight': '85 lbs',
          'Material': 'Velvet, Hardwood, Metal',
          'Color': 'Burgundy with Gold Accents'
        },
        reviews: [
          {
            name: 'Sarah Johnson',
            rating: 5,
            date: '2 weeks ago',
            text: 'Absolutely beautiful sofa! Perfect for our wedding reception. The quality exceeded our expectations and it was delivered on time.'
          },
          {
            name: 'Michael Rodriguez',
            rating: 4,
            date: '1 month ago',
            text: 'Great piece for our corporate event. Very comfortable and elegant. Only minor issue was a small stain that was quickly resolved.'
          },
          {
            name: 'Emily Chen',
            rating: 5,
            date: '1 month ago',
            text: 'Stunning sofa that made our event look so sophisticated. The burgundy color was exactly what we needed. Highly recommend!'
          }
        ]
      },
      'commercial-15l-coffee-machine': {
        id: 'commercial-15l-coffee-machine',
        title: 'Commercial 15L Coffee Machine',
        category: 'Coffee Makers',
        price: 950,
        currency: '₹',
        period: 'day',
        description: 'Professional-grade coffee machine perfect for large events, weddings, and corporate gatherings. Brews up to 15 liters of fresh coffee with consistent quality and temperature control.',
        images: [
          'https://5.imimg.com/data5/SELLER/Default/2022/6/QH/HV/HR/150627088/coffee-maker-machine.jpg',
          'https://5.imimg.com/data5/ANDROID/Default/2022/5/AH/QT/LP/84840391/product-jpeg-500x500.jpg',
          'https://5.imimg.com/data5/SELLER/Default/2022/2/CJ/SQ/FM/112646635/ss-chafing-dish-500x500.jpg',
          'https://5.imimg.com/data5/SELLER/Default/2023/1/TZ/PR/IP/42553408/table-top-water-dispenser-500x500.jpg'
        ],
        rating: 4.8,
        reviewCount: 42,
        features: [
          '15L capacity',
          'Stainless steel construction',
          'Temperature control',
          'Easy to clean',
          'Professional grade',
          'Energy efficient'
        ],
        specifications: {
          'Capacity': '15 Liters',
          'Power': '2000W',
          'Material': 'Stainless Steel',
          'Dimensions': '45cm x 35cm x 55cm'
        },
        reviews: [
          {
            name: 'Priya Sharma',
            rating: 5,
            date: '1 week ago',
            text: 'Excellent coffee machine for our office event. Made perfect coffee for 200+ guests without any issues.'
          },
          {
            name: 'Rajesh Kumar',
            rating: 4,
            date: '2 weeks ago',
            text: 'Good quality machine. Easy to operate and maintain. Would recommend for large gatherings.'
          }
        ]
      }
    };

    // Load product or use default
    this.currentProduct = products[productId] || products['maharaja-velvet-sofa'];
    this.renderProduct();
  }

  renderProduct() {
    const product = this.currentProduct;
    
    // Update page elements
    document.getElementById('productName').textContent = product.title;
    document.getElementById('productTitle').textContent = product.title;
    document.getElementById('productCategory').textContent = product.category;
    document.getElementById('productPrice').textContent = `${product.currency}${product.price}`;
    document.querySelector('.price-period').textContent = `/${product.period}`;
    document.getElementById('productDescription').textContent = product.description;
    
    // Update rating
    this.updateRating(product.rating, product.reviewCount);
    
    // Update images
    this.updateImages(product.images);
    
    // Update features
    this.updateFeatures(product.features);
    
    // Update specifications
    this.updateSpecifications(product.specifications);
    
    // Update reviews
    this.updateReviews(product.reviews);
    
    // Update page title
    document.title = `${product.title} - Eventra`;
  }

  updateRating(rating, reviewCount) {
    const stars = document.querySelectorAll('.star');
    const fullStars = Math.floor(rating);
    
    stars.forEach((star, index) => {
      if (index < fullStars) {
        star.classList.add('filled');
      } else {
        star.classList.remove('filled');
      }
    });
    
    document.querySelector('.rating-text').textContent = `${rating} (${reviewCount} reviews)`;
  }

  updateImages(images) {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    mainImage.src = images[0];
    
    thumbnails.forEach((thumb, index) => {
      if (images[index]) {
        thumb.src = images[index];
        thumb.style.display = 'block';
      } else {
        thumb.style.display = 'none';
      }
    });
  }

  updateFeatures(features) {
    const featuresList = document.querySelector('.features-list');
    featuresList.innerHTML = features.map(feature => `<li>${feature}</li>`).join('');
  }

  updateSpecifications(specs) {
    const specsGrid = document.querySelector('.specs-grid');
    specsGrid.innerHTML = Object.entries(specs).map(([label, value]) => `
      <div class="spec-item">
        <span class="spec-label">${label}:</span>
        <span class="spec-value">${value}</span>
      </div>
    `).join('');
  }

  updateReviews(reviews) {
    const reviewsContainer = document.querySelector('.reviews-container');
    reviewsContainer.innerHTML = reviews.map(review => `
      <div class="review-item">
        <div class="review-header">
          <div class="reviewer-info">
            <strong>${review.name}</strong>
            <div class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
          </div>
          <span class="review-date">${review.date}</span>
        </div>
        <p class="review-text">${review.text}</p>
      </div>
    `).join('');
  }

  setupImageGallery() {
    // Thumbnail click handlers
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        
        // Update main image
        document.getElementById('mainProductImage').src = thumb.src;
      });
    });
  }

  setupTabs() {
    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', () => {
        const tabId = button.dataset.tab;
        
        // Update active tab button
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update active tab panel
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
      });
    });
  }

  setupEventListeners() {
    // Quantity controls
    document.querySelector('.qty-btn.minus').addEventListener('click', () => {
      const input = document.getElementById('quantity');
      const value = Math.max(1, parseInt(input.value) - 1);
      input.value = value;
      this.updateCalculations();
    });

    document.querySelector('.qty-btn.plus').addEventListener('click', () => {
      const input = document.getElementById('quantity');
      const value = Math.min(10, parseInt(input.value) + 1);
      input.value = value;
      this.updateCalculations();
    });

    // Rental days controls
    document.querySelector('.days-btn.minus').addEventListener('click', () => {
      const input = document.getElementById('rentalDays');
      const value = Math.max(1, parseInt(input.value) - 1);
      input.value = value;
      this.updateCalculations();
    });

    document.querySelector('.days-btn.plus').addEventListener('click', () => {
      const input = document.getElementById('rentalDays');
      const value = Math.min(30, parseInt(input.value) + 1);
      input.value = value;
      this.updateCalculations();
    });

    // Input change handlers
    document.getElementById('quantity').addEventListener('change', () => {
      this.updateCalculations();
    });

    document.getElementById('rentalDays').addEventListener('change', () => {
      this.updateCalculations();
    });

    // Add to cart
    document.querySelector('.add-to-cart-btn').addEventListener('click', () => {
      if (!window.authSystem.isLoggedIn()) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
      }

      const quantity = parseInt(document.getElementById('quantity').value);
      const rentalDays = parseInt(document.getElementById('rentalDays').value);
      
      const item = {
        id: this.currentProduct.id,
        title: this.currentProduct.title,
        price: `${this.currentProduct.currency}${this.currentProduct.price}/${this.currentProduct.period}`,
        image: this.currentProduct.images[0],
        category: this.currentProduct.category,
        quantity: quantity,
        rentalDays: rentalDays
      };

      window.shoppingCart.addItem(item);
    });

    // Book now
    document.querySelector('.book-now-btn').addEventListener('click', () => {
      if (!window.authSystem.isLoggedIn()) {
        alert('Please login to make a booking');
        window.location.href = 'login.html';
        return;
      }

      const quantity = parseInt(document.getElementById('quantity').value);
      const rentalDays = parseInt(document.getElementById('rentalDays').value);
      
      const item = {
        id: this.currentProduct.id,
        title: this.currentProduct.title,
        price: `${this.currentProduct.currency}${this.currentProduct.price}/${this.currentProduct.period}`,
        image: this.currentProduct.images[0],
        category: this.currentProduct.category,
        quantity: quantity,
        rentalDays: rentalDays
      };

      window.bookingSystem.showBookingModal(item);
    });

    // Favorite button
    document.querySelector('.favorite-button-large').addEventListener('click', () => {
      if (!window.authSystem.isLoggedIn()) {
        alert('Please login to add favorites');
        window.location.href = 'login.html';
        return;
      }

      const button = document.querySelector('.favorite-button-large');
      const itemId = this.currentProduct.id;
      const itemData = {
        title: this.currentProduct.title,
        price: `${this.currentProduct.currency}${this.currentProduct.price}/${this.currentProduct.period}`,
        image: this.currentProduct.images[0],
        category: this.currentProduct.category
      };

      if (window.authSystem.isFavorite(itemId)) {
        window.authSystem.removeFromFavorites(itemId);
        this.updateFavoriteButton(button, false);
      } else {
        window.authSystem.addToFavorites(itemId, itemData);
        this.updateFavoriteButton(button, true);
      }
    });

    // Related product clicks
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const relatedTitle = btn.closest('.related-item').querySelector('h4').textContent;
        const relatedId = relatedTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
        window.location.href = `product-detail.html?id=${relatedId}&category=furniture`;
      });
    });
  }

  updateCalculations() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const rentalDays = parseInt(document.getElementById('rentalDays').value);
    const basePrice = this.currentProduct.price;
    const total = basePrice * quantity * rentalDays;
    
    document.getElementById('totalAmount').textContent = `${this.currentProduct.currency}${total.toLocaleString('en-IN')}`;
  }

  updateFavoriteButton(button, isFavorite) {
    const path = button.querySelector('path');
    
    if (isFavorite) {
      button.classList.add('active');
      path.setAttribute('fill', 'currentColor');
    } else {
      button.classList.remove('active');
      path.setAttribute('fill', 'none');
    }
  }
}

// Initialize product detail manager
document.addEventListener('DOMContentLoaded', () => {
  window.productDetailManager = new ProductDetailManager();
  
  // Navigation buttons
  document.getElementById('loginBtn').addEventListener('click', () => {
    if (window.authSystem.isLoggedIn()) {
      window.authSystem.showUserDashboard();
    } else {
      window.location = "login.html";
    }
  });
  
  document.getElementById('signupBtn').addEventListener('click', () => {
    if (window.authSystem.isLoggedIn()) {
      window.authSystem.logout();
    } else {
      window.location = "signup.html";
    }
  });

  // Mobile menu
  document.getElementById('hamburger').addEventListener('click', () => {
    const menu = document.querySelector('.menu');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    menu.style.flexDirection = 'column';
    menu.style.gap = '14px';
    menu.style.position = 'absolute';
    menu.style.top = '68px';
    menu.style.left = '0';
    menu.style.right = '0';
    menu.style.background = 'rgba(255,255,255,.96)';
    menu.style.padding = '16px 20px';
    menu.style.borderBottom = '1px solid #ececf2';
  });
});