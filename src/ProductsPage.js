import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { API_URL } from './config';
import './index.css'; 
import cartIconImg from './assets/shopping-bag-add-200h.png'; 

const ToastAlert = ({ message, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="custom-toast-alert">
      <div className="toast-icon-wrapper">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#427a5b"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <span className="toast-message-text">{message}</span>
      <button onClick={onClose} className="toast-close-btn" aria-label="Close">
        ✕
      </button>
    </div>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { addSingleVariantDirectly } = useCart();

  useEffect(() => {
    fetch(`${API_URL}/api/products?populate=*`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setProducts(data.data);
      })
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  const handleAddToCart = (product, variant) => {
    addSingleVariantDirectly(product, variant);
    setToastMessage(`დაემატა კალათაში: ${product.title} (${variant.type})`);
    setShowToast(true);
  };

  return (
    <div className="products-page-container">
      <ToastAlert
        message={toastMessage}
        isOpen={showToast}
        onClose={() => setShowToast(false)}
      />

      <div className="products-grid">
        {products.map((product) => {
          const title = product.title;
          const rawVariants = product.variant || [];
          
          const variants = [...rawVariants].sort((a, b) => {
            if (a.type === "სტანდარტული") return -1;
            if (b.type === "სტანდარტული") return 1;
            return 0;
          });
          
          let imgUrl = "";
          if (product.cover && product.cover.length > 0) {
            imgUrl = product.cover[0].url || "";
          }

          const fullImgUrl = imgUrl 
            ? (imgUrl.startsWith('http') ? imgUrl : `${API_URL}${imgUrl}`) 
            : '';

          return (
            <div key={product.id} className="product-card">
              <Link to={`/products/${product.documentId || product.id}`} className="product-card-link-wrapper">
                <div className="product-title-section">
                  <h3 className="product-title">{title}</h3>
                </div>

                <div className="product-image-container">
                  {fullImgUrl ? (
                    <img src={fullImgUrl} alt={title} className="product-cover" />
                  ) : (
                    <div className="image-placeholder">No Image</div>
                  )}
                </div>
              </Link>

              <div className="product-meta-section">
                {variants.map((v, index) => (
                  <div key={index} className="product-price-row">
                    <span className="price-label">
                      {v.type}: <strong className="price-amount">{v.price} ₾</strong>
                    </span>
                    <button 
                      onClick={() => handleAddToCart(product, v)}
                      className="add-to-cart-btn"
                    >
                      <img src={cartIconImg} alt="Add to Cart" className="cart-row-icon-img" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsPage;