import { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';

const ProductCard = ({ product }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const toggleFavorite = useAuthStore((state) => state.toggleFavorite);
  const addItem = useCartStore((state) => state.addItem);
  
  // Make isFavorite reactive by subscribing to the store state
  const isProductFavorite = useAuthStore((state) => {
    if (!state.currentUser || !state.currentUser.favorites) return false;
    return state.currentUser.favorites.some(fav => fav.id === product.id);
  });
  
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    
    if (!currentUser) {
      toast.error('Please login to add favorites');
      return;
    }

    toggleFavorite({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      rating: product.rating,
    });
    
    if (isProductFavorite) {
      toast.success('Removed from favorites');
    } else {
      toast.success('Added to favorites', {
        icon: '❤️',
      });
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    setIsAddingToCart(true);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    
    toast.success('Added to cart!', {
      icon: '🛒',
    });
    
    setIsAddingToCart(false);
  };

  return (
    <article className="card" style={{ cursor: 'default', position: 'relative' }}>
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(255, 255, 255, 0.95)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'all 0.2s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <Heart
          size={20}
          fill={isProductFavorite ? '#ef4444' : 'none'}
          color={isProductFavorite ? '#ef4444' : '#6b7280'}
        />
      </button>

      {/* Product Image */}
      <img src={product.image} alt={product.title} />
      
      <div className="body">
        {/* Rating */}
        {product.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <span style={{ color: '#fbbf24', fontSize: '1rem' }}>★</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{product.rating}</span>
            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>({Math.floor(Math.random() * 50 + 10)} reviews)</span>
          </div>
        )}

        {/* Title */}
        <h3 style={{ marginBottom: '8px' }}>{product.title}</h3>
        
        {/* Description */}
        <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '12px' }}>
          {product.description}
        </p>

        {/* Price and Add to Cart */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          {(() => {
            const [amount, unit] = String(product.price || '').split('/');
            return (
              <div className="price">
                <span className="price-amount">{amount}</span>
                {unit && <span className="price-unit">/{unit}</span>}
              </div>
            );
          })()}
          
          <button
            className="btn btn-primary"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            style={{
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
            }}
          >
            <ShoppingCart size={16} />
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
