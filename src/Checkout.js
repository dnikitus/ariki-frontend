import React, { useState } from 'react';
import { useCart } from './CartContext';

// Strapi URL for media assets
const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

export default function Checkout() {
  const cartContext = useCart();

  // Safely extract cart items array
  const cartItems =
    cartContext?.cartItems ||
    cartContext?.cart ||
    cartContext?.items ||
    [];

  const [includeDelivery, setIncludeDelivery] = useState(false);

  const DELIVERY_FEE = 5;

  // Helper to resolve full Strapi image URL
  const getImageUrl = (item) => {
    const rawImage =
      item?.coverUrl ||
      item?.coverImg ||
      item?.image?.url ||
      item?.image ||
      item?.img ||
      item?.attributes?.image?.data?.attributes?.url ||
      item?.product?.attributes?.image?.data?.attributes?.url;

    if (!rawImage) return '/placeholder.jpg';
    if (typeof rawImage === 'string' && rawImage.startsWith('http')) {
      return rawImage;
    }
    return `${STRAPI_URL}${rawImage}`;
  };

  // Helper to extract active variants (quantity > 0) or fallback to root item
  const getItemActiveVariants = (item) => {
    if (Array.isArray(item?.variants) && item.variants.length > 0) {
      const activeVariants = item.variants.filter((v) => Number(v.quantity) > 0);
      if (activeVariants.length > 0) {
        return activeVariants.map((v) => ({
          ...item,
          variantType: v.type,
          price: Number(v.price) || 0,
          quantity: Number(v.quantity) || 1,
        }));
      }
    }

    // Fallback if variants array isn't populated or structured differently
    return [
      {
        ...item,
        variantType: item?.selectedVariant || item?.type || null,
        price: Number(item?.price) || 0,
        quantity: Number(item?.quantity || item?.count) || 1,
      },
    ];
  };

  // Flatten cart items to account for multiple active variants per product
  const activeCartLines = cartItems.flatMap((item) => getItemActiveVariants(item));

  // Calculate subtotal safely
  const subtotal = activeCartLines.reduce((acc, line) => {
    return acc + line.price * line.quantity;
  }, 0);

  // Grand total including optional delivery fee
  const total = subtotal + (includeDelivery ? DELIVERY_FEE : 0);

  const handlePayment = () => {
    alert('გადახდის გვერდზე გადამისამართება...');
  };

  return (
    <div className="checkout-container">
      <div className="checkout-box">
        {/* Cart Items List */}
        <div className="checkout-items-list">
          {activeCartLines.length === 0 ? (
            <p className="checkout-empty-text">
              კალათა ცარიელია
            </p>
          ) : (
            activeCartLines.map((line, index) => {
              const itemTotal = line.price * line.quantity;
              const baseTitle = line?.title || line?.name || 'პროდუქტი';
              const displayTitle = line.variantType
                ? `${baseTitle}, ${line.variantType}`
                : baseTitle;
              const imageUrl = getImageUrl(line);

              return (
                <div key={`${line.id || index}-${line.variantType || index}`} className="checkout-item-card">
                  <img
                    src={imageUrl}
                    alt={displayTitle}
                    className="checkout-item-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                    }}
                  />
                  <div className="checkout-item-details">
                    <h4 className="checkout-item-title">{displayTitle}</h4>
                    <p className="checkout-item-meta">ფასი: {line.price} ₾</p>
                    <p className="checkout-item-meta">რაოდენობა: {line.quantity}</p>
                    <p className="checkout-item-meta">ჯამი: {itemTotal} ₾</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Delivery Checkbox & Total */}
        <div className="checkout-summary-section">
          <label className="checkout-checkbox-label">
            მიტანის სერვისი (საფასური 5 ₾):
            <input
              type="checkbox"
              checked={includeDelivery}
              onChange={(e) => setIncludeDelivery(e.target.checked)}
              className="checkout-checkbox"
            />
          </label>

          <div className="checkout-total-row">
            <strong>სულ გადასახდელი: {total} ₾</strong>
          </div>

          <button
            onClick={handlePayment}
            className="checkout-pay-button"
            disabled={activeCartLines.length === 0}
          >
            💳 <span className="checkout-invisible-space">1  </span> გადახდა
          </button>

          <p className="checkout-payment-note">
            გადახდა შესაძლებელია ნებისმიერი ტიპის საბანკო ბარათით
          </p>
        </div>
      </div>
    </div>
  );
}