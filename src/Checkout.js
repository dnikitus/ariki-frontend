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
    <div style={styles.container}>
      <div style={styles.checkoutBox}>
        {/* Cart Items List */}
        <div style={styles.itemsList}>
          {activeCartLines.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>
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
                <div key={`${line.id || index}-${line.variantType || index}`} style={styles.itemCard}>
                  <img
                    src={imageUrl}
                    alt={displayTitle}
                    style={styles.itemImage}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                    }}
                  />
                  <div style={styles.itemDetails}>
                    <h4 style={styles.itemTitle}>{displayTitle}</h4>
                    <p style={styles.itemMeta}>ფასი: {line.price} ₾</p>
                    <p style={styles.itemMeta}>რაოდენობა: {line.quantity}</p>
                    <p style={styles.itemMeta}>ჯამი: {itemTotal} ₾</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Delivery Checkbox & Total */}
        <div style={styles.summarySection}>
          <label style={styles.checkboxLabel}>
            მიტანის სერვისი (საფასური 5 ₾):
            <input
              type="checkbox"
              checked={includeDelivery}
              onChange={(e) => setIncludeDelivery(e.target.checked)}
              style={styles.checkbox}
            />
          </label>

          <div style={styles.totalRow}>
            <strong>სულ გადასახდელი: {total} ₾</strong>
          </div>

          <button
            onClick={handlePayment}
            style={styles.payButton}
            disabled={activeCartLines.length === 0}
          >
            💳 <span style={styles.invisible}>1  </span> გადახდა
          </button>

          <p style={styles.paymentNote}>
            გადახდა შესაძლებელია ნებისმიერი ტიპის საბანკო ბარათით
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'transparent',
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '50px'
  },

  invisible: {
    color: '#0C2325',
  },

  checkoutBox: {
    width: '100%',
    maxWidth: '700px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '25px',
  },
  itemsList: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  itemCard: {
    backgroundColor: 'transparent',
    padding: '20px',
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    boxShadow: '6px 6px 6px rgb(212, 212, 212)',
  },
  itemImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '6px',
    backgroundColor: '#ddd',
  },
  itemDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    color: '#333',
    fontSize: '14px',
  },
  itemTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '500',
    color: '#A36A32',
  },
  itemMeta: {
    margin: 0,
    color: '#0C2325',
    fontSize: '16px',
  },
  summarySection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '18px',
    color: '#0C2325',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  totalRow: {
    fontSize: '18px',
    color: '#0C2325',
    marginTop: '5px',
    fontWeight: '300',
  },
  payButton: {
    backgroundColor: '#1b1b1b',
    color: '#F1DFB8',
    border: 'none',
    padding: '12px 35px',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '500',
    marginTop: '5px',
    transition: 'background-color 0.2s',
  },
  paymentNote: {
    fontSize: '14px',
    color: '#0C2325',
    margin: 0,
    textAlign: 'center',
  },
};