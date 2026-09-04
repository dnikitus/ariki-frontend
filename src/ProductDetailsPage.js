import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from './CartContext';
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

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:1337/api/products/${id}?populate=*`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.data) {
          setProduct(resData.data);
          const initialQuantities = {};
          (resData.data.variant || []).forEach((v, index) => {
            initialQuantities[index] = index === 0 ? 1 : 0;
          });
          setQuantities(initialQuantities);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching detailed product:", err);
        setLoading(false);
      });
  }, [id]);

  const handleQtyChange = (index, action) => {
    setQuantities(prev => {
      const current = prev[index] || 0;
      const updated = action === 'plus' ? current + 1 : Math.max(0, current - 1);
      return { ...prev, [index]: updated };
    });
  };

  const handleAddToCart = () => {
    addToCart(product, quantities);
    setShowToast(true);
  };

  if (loading) return <div className="loading-container">იტვირთება...</div>;
  if (!product) return <div className="loading-container">პროდუქტი ვერ მოიძებნა.</div>;

  const title = product.title;
  const description = product.description || "";
  const info = product.info || "";
  const variants = product.variant || [];

  let imgUrl = "";
  if (product.cover && product.cover.length > 0) {
    imgUrl = product.cover[0].url || "";
  }
  const fullImgUrl = imgUrl ? `http://localhost:1337${imgUrl}` : '';

  return (
    <div className="details-page-container">
      <ToastAlert
        message="პროდუქტი დაემატა კალათაში"
        isOpen={showToast}
        onClose={() => setShowToast(false)}
      />

      <div className="details-layout-holder">
        
        <div className="details-image-panel">
          <div className="details-cover-frame">
            {fullImgUrl ? (
              <img src={fullImgUrl} alt={title} className="details-cover-img" />
            ) : (
              <div className="image-placeholder">No Image</div>
            )}
          </div>
        </div>

        <div className="details-info-panel">
          <h1 className="details-main-title">{title}</h1>
          <p className="details-description-text">{description}</p>
          
          <div className="details-info-meta">
            {info.split('\n').map((line, idx) => (
              <span key={idx} className="info-meta-line">{line}</span>
            ))}
          </div>

          <div className="details-variants-list">
            {variants.map((v, index) => (
              <div key={index} className="details-qty-row">
                <span className="details-variant-label">
                  {v.type}: <strong className="details-price-tag">{v.price} ₾</strong>
                </span>
                
                <div className="qty-counter-block">
                  <button onClick={() => handleQtyChange(index, 'minus')} className="qty-btn">-</button>
                  <span className="qty-display-value">{quantities[index] || 0}</span>
                  <button onClick={() => handleQtyChange(index, 'plus')} className="qty-btn">+</button>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={handleAddToCart}
            className="details-submit-cart-btn"
          >
            <img src={cartIconImg} alt="Cart" className="details-cart-btn-icon" />
            კალათაში დამატება
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailsPage;