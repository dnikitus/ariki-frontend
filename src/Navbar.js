import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext'; 
import './index.css'; 
import logoImg from './assets/arikii-200h.png'; 
import cartImage from './assets/shopping-bag-200h.png';
import cartWithDotImage from './assets/shopping-bag-full-200h.png';
import profileGuy from './assets/login-200h.png';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();

  // Calculate total items count across all variants
  const totalItemsCount = cart.reduce((total, item) => {
    const itemQuantity = item.variants 
      ? item.variants.reduce((sum, v) => sum + v.quantity, 0)
      : 0;
    return total + itemQuantity;
  }, 0);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link 
          to="/" 
          onClick={(e) => {
            setIsMobileMenuOpen(false);

            if (window.location.pathname === '/') {
              window.location.reload();
            }
          }}
        >
          <img src={logoImg} alt="არიკი" className="logo-image" />
        </Link>
      </div>

      <ul className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <li>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>მთავარი</Link>
        </li>
        <li>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>ჩვენ შესახებ</Link>
        </li>
        <li>
          <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>პროდუქცია</Link>
        </li>
        <li>
          <Link to="/news" onClick={() => setIsMobileMenuOpen(false)}>ღონისძიებები</Link>
        </li>
        <li>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>კონტაქტი</Link>
        </li>
      </ul>

      <div className="navbar-actions">
        <Link to="/cart" className="nav-icon-link cart-icon-wrapper" onClick={() => setIsMobileMenuOpen(false)}>
          <img 
            src={totalItemsCount > 0 ? cartWithDotImage : cartImage} 
            alt="Cart" 
            className="nav-custom-icon" 
          />
        </Link>

        <Link to="/profile" className="nav-icon-link" onClick={() => setIsMobileMenuOpen(false)}>
          <img 
            src={profileGuy} 
            alt="Profile" 
            className="nav-custom-icon" 
          />
        </Link>

        <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle Navigation">
          <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;