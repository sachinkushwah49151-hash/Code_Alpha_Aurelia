import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Cart state persisted to localStorage (support migration from nova_cart)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('aurelia_cart') || localStorage.getItem('nova_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted to localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('aurelia_wishlist') || localStorage.getItem('nova_wishlist');
      return saved ? JSON.parse(saved) : ['aurelia-air-x1', 'aurelia-core'];
    } catch {
      return ['aurelia-air-x1', 'aurelia-core'];
    }
  });

  // User state — authenticated user only (defaults to null if not logged in)
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('aurelia_auth_token') || localStorage.getItem('nova_auth_token');
      if (!token) return null;
      const saved = localStorage.getItem('aurelia_user') || localStorage.getItem('nova_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Orders state — loaded from authenticated Django backend
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Validate session on mount
  useEffect(() => {
    const token = localStorage.getItem('aurelia_auth_token') || localStorage.getItem('nova_auth_token');
    if (token) {
      api.getMe()
        .then((userData) => {
          setUser(userData);
          localStorage.setItem('aurelia_user', JSON.stringify(userData));
        })
        .catch(() => {
          // Token is expired or invalid
          setUser(null);
          setOrders([]);
          localStorage.removeItem('aurelia_auth_token');
          localStorage.removeItem('nova_auth_token');
          localStorage.removeItem('aurelia_user');
          localStorage.removeItem('nova_user');
        });
    }
  }, []);

  // Fetch orders for logged-in user
  const refreshOrders = useCallback(async () => {
    const token = localStorage.getItem('aurelia_auth_token') || localStorage.getItem('nova_auth_token');
    if (!token) {
      setOrders([]);
      return;
    }
    setOrdersLoading(true);
    try {
      const userOrders = await api.getOrders();
      if (Array.isArray(userOrders)) {
        setOrders(userOrders);
      }
    } catch (err) {
      console.error('Failed to load orders from backend:', err);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      refreshOrders();
    } else {
      setOrders([]);
    }
  }, [user, refreshOrders]);

  // Promo code discount
  const [appliedPromo, setAppliedPromo] = useState(null); // { code: 'AURELIA10', discountPercent: 10 }

  // Side Cart Drawer state
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Cart item pulse state for micro-interactions
  const [cartPulse, setCartPulse] = useState(false);

  // Toast notification state
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('aurelia_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('aurelia_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Trigger pulse effect
  const triggerCartPulse = () => {
    setCartPulse(true);
    setTimeout(() => setCartPulse(false), 600);
  };

  // CART OPERATIONS
  const addToCart = (product, quantity = 1, selectedColor = null, openDrawer = true) => {
    const color = selectedColor || (product.colors && product.colors[0]?.name) || 'Standard';
    const cartItemId = `${product.id}-${color}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          cartItemId,
          id: product.id,
          name: product.name,
          category: product.category,
          price: Number(product.price),
          originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
          image: product.image,
          color,
          quantity,
          stock: product.stock || 20,
        },
      ];
    });

    triggerCartPulse();
    showToast(`Added ${product.name} to bag`);

    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeFromCart = (cartItemId) => {
    const item = cart.find((i) => i.cartItemId === cartItemId);
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    if (item) {
      showToast(`Removed ${item.name} from bag`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  // WISHLIST OPERATIONS
  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed item from your wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added item to your wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  // PROMO CODES
  const applyPromoCode = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'AURELIA10' || clean === 'NOVA10') {
      setAppliedPromo({ code: clean, discountPercent: 10 });
      showToast('10% discount privilege applied!');
      return { success: true, message: '10% discount applied!' };
    }
    if (clean === 'FREESHIP') {
      setAppliedPromo({ code: 'FREESHIP', freeShipping: true });
      showToast('Complimentary shipping applied!');
      return { success: true, message: 'Free shipping applied!' };
    }
    showToast('Invalid promo code. Try AURELIA10', 'error');
    return { success: false, message: 'Invalid promo code. Try AURELIA10' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Promo code removed', 'info');
  };

  // FINANCIAL TOTALS (Used for local bag preview; server calculates official total at checkout)
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Free shipping threshold ₹4,999 or promo
  const freeShippingThreshold = 4999;
  const rawShipping = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 299;
  const shippingFee = appliedPromo?.freeShipping ? 0 : rawShipping;

  const discountAmount = appliedPromo?.discountPercent
    ? Math.round((cartSubtotal * appliedPromo.discountPercent) / 100)
    : 0;

  // Estimated GST (18% inclusive)
  const taxableAmount = cartSubtotal - discountAmount;
  const estimatedTax = taxableAmount > 0 ? Math.round(taxableAmount * 0.18) : 0;
  const cartTotal = Math.max(0, taxableAmount + shippingFee);

  // AUTH METHODS
  const login = (userData) => {
    setUser(userData);
    showToast(`Welcome back, ${userData.name || 'Collector'}!`);
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setOrders([]);
    showToast('Signed out successfully', 'info');
  };

  const updateUserProfile = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('aurelia_user', JSON.stringify(updated));
      return updated;
    });
    showToast('Profile updated successfully');
  };

  // ORDER CREATION — connects to real Django backend
  const placeOrder = async (orderData) => {
    const newOrder = await api.createOrder({
      items: cart,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      deliveryMethod: orderData.deliveryMethod,
    });

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedPromo(null);
    showToast(`Order #${newOrder.id} confirmed!`);
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        user,
        orders,
        ordersLoading,
        refreshOrders,
        toasts,
        appliedPromo,
        cartSubtotal,
        totalItemCount,
        shippingFee,
        discountAmount,
        estimatedTax,
        cartTotal,
        freeShippingThreshold,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        cartPulse,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyPromoCode,
        removePromoCode,
        showToast,
        removeToast,
        login,
        logout,
        updateUserProfile,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
