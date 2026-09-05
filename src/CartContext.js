import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_URL } from './config';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('app_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('app_cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cart]);

  // Helper to format image URLs (Handles relative Strapi paths vs absolute cloud URLs)
  const formatImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${API_URL}${url}`;
  };

  const addToCart = (product, quantities) => {
    setCart((prevCart) => {
      const activeVariants = Object.keys(quantities)
        .filter((index) => quantities[index] > 0)
        .map((index) => {
          const variant = product.variant[index];
          return {
            type: variant.type,
            price: variant.price,
            quantity: quantities[index],
          };
        });

      if (activeVariants.length === 0) return prevCart;

      const targetId = product.documentId || product.id;
      const existingProductIdx = prevCart.findIndex((item) => item.id === targetId);

      if (existingProductIdx > -1) {
        return prevCart.map((item, idx) => {
          if (idx !== existingProductIdx) return item;

          const updatedVariants = [...item.variants];
          activeVariants.forEach((newV) => {
            const variantIdx = updatedVariants.findIndex((v) => v.type === newV.type);
            if (variantIdx > -1) {
              updatedVariants[variantIdx] = {
                ...updatedVariants[variantIdx],
                quantity: updatedVariants[variantIdx].quantity + newV.quantity
              };
            } else {
              updatedVariants.push(newV);
            }
          });

          return { ...item, variants: updatedVariants };
        });
      } else {
        let imgUrl = "";
        if (product.cover && product.cover.length > 0) {
          imgUrl = product.cover[0].url || "";
        }

        return [
          ...prevCart,
          {
            id: targetId,
            title: product.title,
            coverUrl: formatImageUrl(imgUrl),
            variants: activeVariants,
          },
        ];
      }
    });
  };

  const addSingleVariantDirectly = (product, targetVariant) => {
    setCart((prevCart) => {
      const targetId = product.documentId || product.id;
      const existingProductIdx = prevCart.findIndex((item) => item.id === targetId);

      if (existingProductIdx > -1) {
        return prevCart.map((item, idx) => {
          if (idx !== existingProductIdx) return item;

          const updatedVariants = [...item.variants];
          const variantIdx = updatedVariants.findIndex((v) => v.type === targetVariant.type);

          if (variantIdx > -1) {
            updatedVariants[variantIdx] = {
              ...updatedVariants[variantIdx],
              quantity: updatedVariants[variantIdx].quantity + 1
            };
          } else {
            updatedVariants.push({
              type: targetVariant.type,
              price: targetVariant.price,
              quantity: 1
            });
          }

          return { ...item, variants: updatedVariants };
        });
      } else {
        let imgUrl = "";
        if (product.cover && product.cover.length > 0) {
          imgUrl = product.cover[0].url || "";
        }

        return [
          ...prevCart,
          {
            id: targetId,
            title: product.title,
            coverUrl: formatImageUrl(imgUrl),
            variants: [
              {
                type: targetVariant.type,
                price: targetVariant.price,
                quantity: 1
              }
            ]
          }
        ];
      }
    });
  };

  const updateQuantity = (productId, variantType, action) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id !== productId) return item;
        const updatedVariants = item.variants
          .map((v) => {
            if (v.type !== variantType) return v;
            return {
              ...v,
              quantity: action === 'plus' ? v.quantity + 1 : Math.max(0, v.quantity - 1),
            };
          })
          .filter((v) => v.quantity > 0);

        return { ...item, variants: updatedVariants };
      }).filter((item) => item.variants.length > 0)
    );
  };

  const removeItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('app_cart');
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        addSingleVariantDirectly, 
        updateQuantity, 
        removeItem,
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);