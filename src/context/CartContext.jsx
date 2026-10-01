import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const INITIAL_MOCK_ORDERS = [
  {
    id: 'AUR-849201',
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    status: 'Delivered',
    total: 8499,
    subtotal: 8499,
    shipping: 0,
    tax: 0,
    paymentMethod: 'Credit Card (ending 4242)',
    items: [
      {
        id: 'aurelia-air-x1',
        name: 'Aurelia Air X1 Headphones',
        price: 8499,
        quantity: 1,
        color: 'Matte Obsidian',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      },
    ],
    shippingAddress: {
      fullName: 'Alex Vance',
      street: '42 Lotus Boulevard, Apt 8B',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560103',
      country: 'India',
    },
  },
  {
    id: 'AUR-728192',
    date: new Date(Date.now() - 14 * 86400000).toISOString(),
    status: 'Delivered',
    total: 10498,
    subtotal: 10498,
    shipping: 0,
    tax: 0,
    paymentMethod: 'UPI',
    items: [
      {
        id: 'forma-desk-task-lamp',
        name: 'Forma Minimal Desk Lamp',
        price: 4999,
        quantity: 1,
        color: 'Anodized Black',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
      },
      {
        id: 'horizon-polarized-sunglasses',
        name: 'Horizon Minimal Eyewear',
        price: 5499,
        quantity: 1,
        color: 'Matte Gunmetal',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
      },
    ],
    shippingAddress: {
      fullName: 'Alex Vance',
      street: '42 Lotus Boulevard, Apt 8B',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560103',
      country: 'India',
    },
  },
];

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
      return saved ? JSON.parse(saved) : ['aurelia-air-x1', 'chronos-minimal-watch'];
    } catch {
      return ['aurelia-air-x1', 'chronos-minimal-watch'];
    }
  });

  // User state
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aurelia_user') || localStorage.getItem('nova_user');
      return saved
        ? JSON.parse(saved)
        : {
            id: 'usr_83921',
            name: 'Alex Vance',
            email: 'alex.vance@studio-aurelia.co',
            phone: '+91 98765 43210',
            memberSince: 'March 2024',
            addresses: [
              {
                id: 'addr_1',
                title: 'Home / Studio',
                name: 'Alex Vance',
                street: '42 Lotus Boulevard, Apt 8B',
                city: 'Bengaluru',
                state: 'Karnataka',
                postalCode: '560103',
                country: 'India',
                isDefault: true,
              },
            ],
          };
    } catch {
      return null;
    }
  });

  // Orders state
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('aurelia_orders') || localStorage.getItem('nova_orders');
      if (saved) return JSON.parse(saved);
      localStorage.setItem('aurelia_orders', JSON.stringify(INITIAL_MOCK_ORDERS));
      return INITIAL_MOCK_ORDERS;
    } catch {
      return INITIAL_MOCK_ORDERS;
    }
  });

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

  // Sync user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('aurelia_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aurelia_user');
      localStorage.removeItem('aurelia_auth_token');
    }
  }, [user]);

  // Sync orders to localStorage
  useEffect(() => {
    localStorage.setItem('aurelia_orders', JSON.stringify(orders));
  }, [orders]);

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
          price: product.price,
          originalPrice: product.originalPrice,
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

  // FINANCIAL TOTALS
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
    showToast(`Welcome back, ${userData.name}!`);
  };

  const logout = () => {
    setUser(null);
    showToast('Signed out successfully', 'info');
  };

  const updateUserProfile = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
    showToast('Profile updated successfully');
  };

  // ORDER CREATION
  const placeOrder = (orderData) => {
    const newOrder = {
      id: 'AUR-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      shipping: shippingFee,
      discount: discountAmount,
      tax: estimatedTax,
      total: cartTotal,
      status: 'Processing',
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod || 'Credit Card',
    };

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
