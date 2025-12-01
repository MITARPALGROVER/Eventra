import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import toast from 'react-hot-toast';

const Favorites = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const getFavorites = useAuthStore((state) => state.getFavorites);
  const removeFromFavorites = useAuthStore((state) => state.removeFromFavorites);
  const addItem = useCartStore((state) => state.addItem);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setFavorites(getFavorites());
  }, [currentUser, navigate, getFavorites]);

  const handleRemoveFavorite = (itemId) => {
    removeFromFavorites(itemId);
    setFavorites(getFavorites());
    toast.success('Removed from favorites');
  };

  const handleAddToCart = (item) => {
    try {
      addItem({
        id: item.id,
        title: item.title,
        category: item.category,
        price: item.price,
        image: item.image,
      });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px', minHeight: '80vh' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Heart size={32} color="var(--primary)" fill="var(--primary)" />
          My Favorites
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          {favorites.length} {favorites.length === 1 ? 'item' : 'items'} in your favorites
        </p>
      </div>

      {favorites.length > 0 ? (
        <div style={{ display: 'grid', gap: '24px' }}>
          {favorites.map((item) => (
            <div key={item.id} className="card" style={{ padding: '24px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '150px 1fr auto',
                gap: '24px',
                alignItems: 'center',
              }}>
                {/* Product Image */}
                <div style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#f3f4f6',
                }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>

                {/* Product Details */}
                <div>
                  <h3 style={{ marginBottom: '8px', fontSize: '1.3rem' }}>
                    {item.title}
                  </h3>
                  {item.description && (
                    <p style={{ color: '#6b7280', marginBottom: '12px', fontSize: '0.95rem' }}>
                      {item.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                    <span style={{
                      padding: '4px 12px',
                      background: '#e0f2fe',
                      color: '#0369a1',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                    }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--primary)' }}>
                      {item.price}
                    </span>
                  </div>
                  {item.addedAt && (
                    <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                      Added on {new Date(item.addedAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '160px' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                    }}
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => handleRemoveFavorite(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      color: '#ef4444',
                      borderColor: '#ef4444',
                    }}
                  >
                    <Trash2 size={18} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '24px', opacity: 0.3 }}>
            <Heart size={80} />
          </div>
          <h2 style={{ marginBottom: '12px', color: '#111827' }}>No favorites yet</h2>
          <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '32px' }}>
            Start adding items to your favorites to see them here
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/categories')}
            style={{ padding: '14px 32px', fontSize: '1rem' }}
          >
            Browse Categories
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
