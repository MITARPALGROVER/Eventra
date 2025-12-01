import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import { useVendorStore } from '../stores/vendorStore';

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');
  const [search, setSearch] = useState('');

  // Get products from vendor store
  const allVendorProducts = useVendorStore((state) => state.products);
  const vendorProducts = allVendorProducts.filter(p => p.category === categoryId && p.status === 'available');

  // Category data
  const categories = {
    furniture: {
      title: 'Furniture',
      description: 'Elegant seating, tables, and staging for your events',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80&auto=format&fit=crop',
      products: [
        {
          id: 'f1',
          title: 'Premium Chiavari Chairs',
          description: 'Elegant gold chiavari chairs perfect for weddings and formal events',
          price: '₹450/day',
          priceValue: 450,
          image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80&auto=format&fit=crop',
          rating: 4.8,
          category: 'Furniture'
        },
        {
          id: 'f2',
          title: 'Round Banquet Tables',
          description: '60-inch round tables with premium finish',
          price: '₹800/day',
          priceValue: 800,
          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80&auto=format&fit=crop',
          rating: 4.9,
          category: 'Furniture'
        },
        {
          id: 'f3',
          title: 'Lounge Sofa Set',
          description: 'Comfortable 3-piece lounge furniture set',
          price: '₹2500/day',
          priceValue: 2500,
          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80&auto=format&fit=crop',
          rating: 4.7,
          category: 'Furniture'
        },
        {
          id: 'f4',
          title: 'Bar Counter Setup',
          description: 'Professional bar counter with stools',
          price: '₹3500/day',
          priceValue: 3500,
          image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80&auto=format&fit=crop',
          rating: 4.6,
          category: 'Furniture'
        },
        {
          id: 'f5',
          title: 'Stage Platform',
          description: 'Modular stage platform 8x6 feet',
          price: '₹5000/day',
          priceValue: 5000,
          image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80&auto=format&fit=crop',
          rating: 4.9,
          category: 'Furniture'
        },
        {
          id: 'f6',
          title: 'Cocktail Tables',
          description: 'High-top cocktail tables with covers',
          price: '₹600/day',
          priceValue: 600,
          image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&auto=format&fit=crop',
          rating: 4.7,
          category: 'Furniture'
        }
      ]
    },
    'sound-system': {
      title: 'Sound Systems',
      description: 'Professional audio equipment for crystal clear sound',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=80&auto=format&fit=crop',
      products: [
        {
          id: 's1',
          title: 'Professional PA System',
          description: '2000W PA system with speakers and mixer',
          price: '₹4500/day',
          priceValue: 4500,
          image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80&auto=format&fit=crop',
          rating: 4.9,
          category: 'Sound Systems'
        },
        {
          id: 's2',
          title: 'Wireless Microphone Set',
          description: '4-channel wireless microphone system',
          price: '₹1500/day',
          priceValue: 1500,
          image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80&auto=format&fit=crop',
          rating: 4.8,
          category: 'Sound Systems'
        },
        {
          id: 's3',
          title: 'DJ Equipment Package',
          description: 'Complete DJ setup with turntables and mixer',
          price: '₹6000/day',
          priceValue: 6000,
          image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80&auto=format&fit=crop',
          rating: 4.7,
          category: 'Sound Systems'
        },
        {
          id: 's4',
          title: 'Subwoofer System',
          description: 'Powerful bass speakers for enhanced audio',
          price: '₹2500/day',
          priceValue: 2500,
          image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80&auto=format&fit=crop',
          rating: 4.6,
          category: 'Sound Systems'
        }
      ]
    },
    lighting: {
      title: 'Lighting',
      description: 'Create the perfect ambience with our lighting solutions',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1400&auto=format&fit=crop',
      products: [
        {
          id: 'l1',
          title: 'LED Par Can Lights',
          description: 'RGBW LED par can lights - Set of 8',
          price: '₹3000/day',
          priceValue: 3000,
          image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80&auto=format&fit=crop',
          rating: 4.8,
          category: 'Lighting'
        },
        {
          id: 'l2',
          title: 'Moving Head Spotlights',
          description: 'DMX controlled moving head lights - Set of 4',
          price: '₹5500/day',
          priceValue: 5500,
          image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80&auto=format&fit=crop',
          rating: 4.9,
          category: 'Lighting'
        },
        {
          id: 'l3',
          title: 'Uplighting Package',
          description: 'Wireless LED uplights - Set of 12',
          price: '₹4000/day',
          priceValue: 4000,
          image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80&auto=format&fit=crop',
          rating: 4.7,
          category: 'Lighting'
        },
        {
          id: 'l4',
          title: 'Fairy String Lights',
          description: 'Warm white fairy lights - 100 meters',
          price: '₹1200/day',
          priceValue: 1200,
          image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80&auto=format&fit=crop',
          rating: 4.9,
          category: 'Lighting'
        }
      ]
    },
    decor: {
      title: 'Décor',
      description: 'Beautiful decorations to transform your venue',
      image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80&auto=format&fit=crop',
      products: [
        {
          id: 'd1',
          title: 'Floral Centerpieces',
          description: 'Premium artificial flower arrangements',
          price: '₹800/piece',
          priceValue: 800,
          image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80&auto=format&fit=crop',
          rating: 4.8,
          category: 'Décor'
        },
        {
          id: 'd2',
          title: 'Backdrop Draping',
          description: 'Elegant fabric backdrop 20x10 feet',
          price: '₹3500/day',
          priceValue: 3500,
          image: 'https://images.unsplash.com/photo-1519167758481-83f29da8a776?w=800&q=80&auto=format&fit=crop',
          rating: 4.9,
          category: 'Décor'
        },
        {
          id: 'd3',
          title: 'Balloon Arch Kit',
          description: 'Balloon arch with stand and decorations',
          price: '₹2500/day',
          priceValue: 2500,
          image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80&auto=format&fit=crop',
          rating: 4.7,
          category: 'Décor'
        },
        {
          id: 'd4',
          title: 'Candelabra Set',
          description: 'Crystal candelabras - Set of 6',
          price: '₹1800/day',
          priceValue: 1800,
          image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80&auto=format&fit=crop',
          rating: 4.6,
          category: 'Décor'
        }
      ]
    },
    appliances: {
      title: 'Event Electric Appliances',
      description: 'Reliable appliances for catering and events',
      image: 'https://plus.unsplash.com/premium_photo-1673439305380-79947d273735?q=80&w=687&auto=format&fit=crop',
      products: [
        {
          id: 'a1',
          title: 'Chafing Dish Set',
          description: 'Stainless steel chafing dishes - Set of 4',
          price: '₹1200/day',
          priceValue: 1200,
          image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80&auto=format&fit=crop',
          rating: 4.7,
          category: 'Appliances'
        },
        {
          id: 'a2',
          title: 'Coffee & Tea Station',
          description: 'Commercial coffee maker with accessories',
          price: '₹2000/day',
          priceValue: 2000,
          image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80&auto=format&fit=crop',
          rating: 4.8,
          category: 'Appliances'
        },
        {
          id: 'a3',
          title: 'Refrigerator Unit',
          description: 'Commercial refrigerator for beverages',
          price: '₹3000/day',
          priceValue: 3000,
          image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80&auto=format&fit=crop',
          rating: 4.9,
          category: 'Appliances'
        },
        {
          id: 'a4',
          title: 'Portable Generator',
          description: '5KVA silent generator for outdoor events',
          price: '₹4500/day',
          priceValue: 4500,
          image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80&auto=format&fit=crop',
          rating: 4.6,
          category: 'Appliances'
        }
      ]
    }
  };

  const currentCategory = categories[categoryId];

  if (!currentCategory) {
    return (
      <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px', textAlign: 'center' }}>
        <h2>Category not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/categories')}>
          Back to Categories
        </button>
      </div>
    );
  }

  // Combine hardcoded products with vendor products
  const allProducts = [...currentCategory.products, ...vendorProducts];
  
  // Filter and sort products
  let filteredProducts = [...allProducts];

  // Text search filter
  if (search.trim()) {
    const q = search.toLowerCase();
    filteredProducts = filteredProducts.filter((p) =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  }

  // Price filter
  if (priceRange !== 'all') {
    const ranges = {
      'low': [0, 1500],
      'mid': [1500, 3500],
      'high': [3500, 10000]
    };
    const [min, max] = ranges[priceRange];
    filteredProducts = filteredProducts.filter(p => p.priceValue >= min && p.priceValue <= max);
  }

  // Sort
  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.priceValue - b.priceValue);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.priceValue - a.priceValue);
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <button className="back-btn" onClick={() => navigate('/categories')}>
        <ArrowLeft size={16} />
        Back
      </button>

      <section className="category-hero">
        <div className="hero-banner">
          <img src={currentCategory.image} alt={currentCategory.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div className="overlay" />
          <div className="hero-content">
            <h1 style={{ margin: 0 }}>{currentCategory.title}</h1>
            <p className="sub" style={{ marginTop: 8 }}>{currentCategory.description}</p>
          </div>
        </div>
      </section>

      <section className="category-grid">
        <aside className="filters">
          <div className="filter-group">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ececf2' }}
            />
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #ececf2' }}>
              <option value="all">All Prices</option>
              <option value="low">Under ₹1,500</option>
              <option value="mid">₹1,500 - ₹3,500</option>
              <option value="high">Above ₹3,500</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #ececf2' }}>
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <div style={{ marginTop: 8, color: 'var(--muted)', fontSize: '0.95rem' }}>
            Showing <strong>{filteredProducts.length}</strong> of {allProducts.length}
          </div>
        </aside>

        <div>
          {filteredProducts.length > 0 ? (
            <div className="product-list">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>No products found matching your filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryDetail;
