import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">Eventra</div>
          <p>Premium event rentals for unforgettable occasions</p>
        </div>
        <div className="footer-links">
          <div>© 2025 Eventra. All rights reserved.</div>
          <div>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/support">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
