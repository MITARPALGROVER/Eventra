// Search functionality
class SearchManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupSearchBar();
    this.setupEventListeners();
  }

  setupSearchBar() {
    // Add search bar to navbar if not exists
    const navbar = document.querySelector('.nav-inner');
    if (navbar && !document.querySelector('.search-bar')) {
      const searchBar = document.createElement('div');
      searchBar.className = 'search-bar';
      searchBar.innerHTML = `
        <div class="search-input-container">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input type="text" class="search-input" placeholder="Search for event items...">
          <div class="search-results" id="searchResults"></div>
        </div>
      `;
      
      // Insert search bar between menu and buttons
      const menu = navbar.querySelector('.menu');
      const buttons = navbar.querySelector('.nav-buttons');
      navbar.insertBefore(searchBar, buttons);
    }
  }

  setupEventListeners() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');

    if (searchInput) {
      let searchTimeout;

      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();

        if (query.length < 2) {
          searchResults.style.display = 'none';
          return;
        }

        searchTimeout = setTimeout(() => {
          this.performSearch(query);
        }, 300);
      });

      // Hide results when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-bar')) {
          searchResults.style.display = 'none';
        }
      });

      // Show results when focusing on input
      searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length >= 2) {
          searchResults.style.display = 'block';
        }
      });
    }
  }

  performSearch(query) {
    const searchResults = document.querySelector('.search-results');
    
    // Mock search data (in real app, this would come from API)
    const mockResults = [
      { title: 'Royal Jhumar Crystal Chandelier', category: 'Lighting', price: '₹2,800/hr', url: 'lighting.html' },
      { title: 'Maharaja Velvet Sofa', category: 'Furniture', price: '₹2,500/hr', url: 'furniture.html' },
      { title: 'Commercial Coffee Machine', category: 'Appliances', price: '₹950/day', url: 'appliances.html' },
      { title: 'JBL Professional PA System', category: 'Sound', price: '₹3,200/hr', url: 'sound-system.html' },
      { title: 'Premium Floral Backdrop', category: 'Decor', price: '₹8,500/day', url: 'decor.html' },
      { title: 'Traditional Brass Diya Set', category: 'Lighting', price: '₹900/hr', url: 'lighting.html' },
      { title: 'Electric Tea Urn', category: 'Appliances', price: '₹650/day', url: 'appliances.html' }
    ];

    // Filter results based on query
    const filteredResults = mockResults.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );

    // Display results
    if (filteredResults.length > 0) {
      searchResults.innerHTML = filteredResults.slice(0, 5).map(item => `
        <div class="search-result-item" onclick="window.location.href='${item.url}'">
          <div class="result-info">
            <div class="result-title">${item.title}</div>
            <div class="result-meta">
              <span class="result-category">${item.category}</span>
              <span class="result-price">${item.price}</span>
            </div>
          </div>
        </div>
      `).join('');
      
      if (filteredResults.length > 5) {
        searchResults.innerHTML += `
          <div class="search-result-more">
            <a href="categories.html">View all ${filteredResults.length} results</a>
          </div>
        `;
      }
    } else {
      searchResults.innerHTML = `
        <div class="search-no-results">
          <div class="no-results-text">No items found for "${query}"</div>
          <div class="no-results-suggestion">Try searching for "furniture", "lighting", or "sound"</div>
        </div>
      `;
    }

    searchResults.style.display = 'block';
  }
}

// Initialize search manager
window.searchManager = new SearchManager();

// Add search styles
const searchStyles = `
  .search-bar {
    flex: 1;
    max-width: 400px;
    margin: 0 20px;
    position: relative;
  }

  .search-input-container {
    position: relative;
  }

  .search-input {
    width: 100%;
    padding: 10px 16px 10px 44px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.95rem;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    transition: all 0.2s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--ring);
    background: white;
  }

  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
  }

  .search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    max-height: 400px;
    overflow-y: auto;
    display: none;
  }

  .search-result-item {
    padding: 12px 16px;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .search-result-item:hover {
    background: #f9fafb;
  }

  .search-result-item:last-child {
    border-bottom: none;
  }

  .result-title {
    font-weight: 600;
    color: #111;
    margin-bottom: 4px;
  }

  .result-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .result-category {
    font-size: 0.85rem;
    color: #666;
    background: #f3f4f6;
    padding: 2px 8px;
    border-radius: 12px;
  }

  .result-price {
    font-weight: 600;
    color: var(--primary);
    font-size: 0.9rem;
  }

  .search-result-more {
    padding: 12px 16px;
    text-align: center;
    border-top: 1px solid #f3f4f6;
  }

  .search-result-more a {
    color: var(--primary);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .search-no-results {
    padding: 20px 16px;
    text-align: center;
  }

  .no-results-text {
    color: #666;
    margin-bottom: 4px;
  }

  .no-results-suggestion {
    color: #9ca3af;
    font-size: 0.85rem;
  }

  @media (max-width: 980px) {
    .search-bar {
      display: none;
    }
  }
`;

const searchStyleSheet = document.createElement('style');
searchStyleSheet.textContent = searchStyles;
document.head.appendChild(searchStyleSheet);