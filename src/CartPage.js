import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import './index.css';
import trashIconImg from './assets/trash.png';
import bagIconImg from './assets/shopping-bag-add-200h.png';

const CartPage = () => {
  const { cart, updateQuantity, removeItem } = useCart();

  const calculateGrandTotal = () => {
    return cart.reduce((acc, item) => {
      const itemSum = item.variants.reduce((sum, v) => sum + (v.price * v.quantity), 0);
      return acc + itemSum;
    }, 0);
  };

  if (cart.length === 0) {
    return <div className="loading-container">კალათა ცარიელია</div>;
  }

  return (
    <div className="cart-page-container">
      <div className="cart-layout-holder">
        
        <div className="cart-items-list">
          {cart.map((item) => (
            <div key={item.id} className="cart-item-card">
              
              <Link to={`/products/${item.id}`} className="cart-item-main-details" style={{ textDecoration: 'none' }}>
                <div className="cart-item-cover-frame">
                  {item.coverUrl ? (
                    <img src={item.coverUrl} alt={item.title} className="cart-item-cover-img" />
                  ) : (
                    <div className="image-placeholder">No Image</div>
                  )}
                </div>
                
                <div className="cart-item-text-info">
                  <h3 className="cart-item-title">{item.title}</h3>
                  <div className="cart-item-variants-specs">
                    {item.variants.map((v, idx) => (
                      <div key={idx} className="cart-spec-row">
                        <span className="cart-spec-label">
                          {v.type}: <strong className="cart-spec-price">{v.price} ₾</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>

              <div className="cart-item-controls-block">
                <button onClick={() => removeItem(item.id)} className="cart-trash-btn" aria-label="Delete">
  <svg 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="cart-trash-svg"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
</button>

                <div className="cart-counters-stack">
                  {item.variants.map((v, idx) => (
                    <div key={idx} className="cart-counter-row-wrapper">
                      <div className="cart-qty-counter-block">
                        <button onClick={() => updateQuantity(item.id, v.type, 'minus')} className="cart-qty-btn">-</button>
                        <span className="cart-qty-display-value">{v.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, v.type, 'plus')} className="cart-qty-btn">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="cart-summary-footer-panel">
          <div className="cart-grand-total-text">
            სულ გადასახდელი: <span className="total-sum-highlight">{calculateGrandTotal()} ₾</span>
          </div>
          <button className="cart-checkout-submit-btn" onClick={() => alert('შეკვეთა გაფორმებულია!')}>
            <img src={bagIconImg} alt="Checkout" className="cart-checkout-btn-icon" />
            შეკვეთის გაფორმება
          </button>
        </div>

      </div>
    </div>
  );
};

export default CartPage;