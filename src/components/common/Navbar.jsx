import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const cartItemCount = useCartStore((state) => state.getItemCount());
  
  // Make favorites count reactive to store changes
  const favoritesCount = useAuthStore((state) => 
    state.currentUser?.favorites?.length || 0
  );

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="nav">
      <div className="container nav-inner">
        <div className="brand" onClick={() => handleNavClick('/')}>
          Eventra
        </div>

        <nav className={`menu ${isMobileMenuOpen ? 'active' : ''}`} aria-label="Main">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/categories" onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          
          {/* Mobile Menu Buttons */}
          {isMobileMenuOpen && (
            <div className="mobile-menu-buttons">
              {currentUser ? (
                <>
                  <button 
                    className="btn btn-outline" 
                    onClick={() => handleNavClick(currentUser.accountType === 'vendor' ? '/vendor/dashboard' : '/dashboard')}
                    style={{ width: '100%' }}
                  >
                    Dashboard
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleLogout}
                    style={{ width: '100%' }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="btn btn-outline" 
                    onClick={() => handleNavClick('/login')}
                    style={{ width: '100%' }}
                  >
                    Sign In
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleNavClick('/signup')}
                    style={{ width: '100%' }}
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          )}
        </nav>

        <div className="nav-buttons">
          {currentUser && (
            <div className="cart-icon" onClick={() => navigate('/favorites')} style={{ marginRight: '12px' }}>
              <Heart size={24} />
              {favoritesCount > 0 && (
                <span className="cart-count">{favoritesCount}</span>
              )}
            </div>
          )}
          
          <div className="cart-icon" onClick={() => navigate('/cart')}>
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </div>
          
          {currentUser ? (
            <>
              <button 
                className="btn btn-outline" 
                onClick={() => navigate(currentUser.accountType === 'vendor' ? '/vendor/dashboard' : '/dashboard')}
              >
                Dashboard
              </button>
              <button className="btn btn-primary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                className="btn btn-outline" 
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/signup')}
              >
                Get Started
              </button>
            </>
          )}
          
          <button 
            className="hamburger" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
