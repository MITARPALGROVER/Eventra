import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const Categories = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const categories = [
    {
      id: 'furniture',
      title: 'Furniture',
      description: 'Elegant seating, tables, and staging.',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80&auto=format&fit=crop',
      icon: '🪑'
    },
    {
      id: 'sound-system',
      title: 'Sound Systems',
      description: 'Professional audio equipment for events.',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=80&auto=format&fit=crop',
      icon: '🔊'
    },
    {
      id: 'lighting',
      title: 'Lighting',
      description: 'Ambience, stage, and spotlight kits.',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1400&auto=format&fit=crop',
      icon: '💡'
    },
    {
      id: 'decor',
      title: 'Décor',
      description: 'Backdrops, centerpieces, and accents.',
      image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80&auto=format&fit=crop',
      icon: '🎨'
    },
    {
      id: 'appliances',
      title: 'Event Electric Appliances',
      description: 'Reliable appliances and event essentials.',
      image: 'https://plus.unsplash.com/premium_photo-1673439305380-79947d273735?q=80&w=687&auto=format&fit=crop',
      icon: '⚡'
    }
  ];

  const filteredCategories = search.trim()
    ? categories.filter(c => {
        const q = search.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
        );
      })
    : categories;

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('animate-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    setTimeout(() => {
      document.querySelectorAll('.scroll-animate').forEach((el) => io.observe(el));
    }, 100);
    
    return () => io.disconnect();
  }, [search]);

  return (
    <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
      {/* Page Header */}
      <div className="categories-header">
        <div className="categories-title-section">
          <h1 className="categories-main-title">Browse Categories</h1>
          <p className="categories-subtitle">
            Discover premium event equipment and services for your next occasion
          </p>
        </div>

        {/* Search Bar */}
        <div className="categories-search-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="categories-search"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length > 0 ? (
        <div className="categories-grid">
          {filteredCategories.map((category, index) => (
            <article
              key={category.id}
              className="category-card scroll-animate"
              onClick={() => navigate(`/category/${category.id}`)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="category-image-wrapper">
                <img src={category.image} alt={category.title} className="category-image" />
                <div className="category-overlay"></div>
              </div>
              <div className="category-content">
                <h3 className="category-title">{category.title}</h3>
                <p className="category-description">{category.description}</p>
                <span className="category-cta">Explore →</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No categories found</h3>
          <p>Try searching for something else</p>
          <button className="btn btn-outline" onClick={() => setSearch('')}>Clear Search</button>
        </div>
      )}
    </div>
  );
};

export default Categories;
