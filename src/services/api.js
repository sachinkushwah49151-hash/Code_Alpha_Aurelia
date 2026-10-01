import { PRODUCTS, CATEGORIES, REVIEWS } from '../data/products.js';

// Centralized API Base URL configuration
export const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:8000/api';
const USE_MOCK = typeof import.meta === 'undefined' || import.meta.env?.VITE_USE_MOCK !== 'false';

/**
 * Standard HTTP Client for Django REST Framework
 * Attaches Authorization header if JWT token is stored.
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('aurelia_auth_token') || localStorage.getItem('nova_auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.detail || errorData.message || 'API request failed');
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response.json();
}

/**
 * Simulated delay for mock responses to feel organic and test loading states
 */
const mockDelay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================
// API Service Methods
// ============================================================

export const api = {
  // PRODUCTS
  async getProducts(params = {}) {
    if (USE_MOCK) {
      await mockDelay(180);
      let filtered = [...PRODUCTS];

      const { category, search, sort, priceMin, priceMax, rating, inStockOnly, featured, newArrival } = params;

      if (category && category !== 'all') {
        filtered = filtered.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase() || p.categoryId === category.toLowerCase()
        );
      }

      if (search && search.trim()) {
        const query = search.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.shortDescriptor.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
      }

      if (priceMin !== undefined && priceMin !== '') {
        filtered = filtered.filter((p) => p.price >= Number(priceMin));
      }

      if (priceMax !== undefined && priceMax !== '') {
        filtered = filtered.filter((p) => p.price <= Number(priceMax));
      }

      if (rating !== undefined && rating !== '') {
        filtered = filtered.filter((p) => p.rating >= Number(rating));
      }

      if (inStockOnly) {
        filtered = filtered.filter((p) => p.stock > 0);
      }

      if (featured) {
        filtered = filtered.filter((p) => p.featured);
      }

      if (newArrival) {
        filtered = filtered.filter((p) => p.newArrival);
      }

      // Sorting
      if (sort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sort === 'newest') {
        filtered.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
      } else if (sort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else {
        // default: featured first
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      }

      return { count: filtered.length, results: filtered };
    }

    const queryParams = new URLSearchParams(params).toString();
    return request(`/products/${queryParams ? `?${queryParams}` : ''}`);
  },

  async getProductById(id) {
    if (USE_MOCK) {
      await mockDelay(150);
      let product = PRODUCTS.find((p) => p.id === id);
      if (!product) {
        const aliasMap = {
          'lumen-desk-speaker': 'aurelia-studio-one',
          'arc-wireless-keyboard': 'aurelia-arc',
          'forma-desk-task-lamp': 'aurelia-forma',
          'terra-travel-carryall': 'aurelia-terra',
          'chronos-minimal-watch': 'aurelia-core',
          'aurelia-everyday-leather-wallet': 'atelier-leather-wallet',
          'horizon-polarized-sunglasses': 'horizon-sunglasses',
          'apex-stainless-thermal-flask': 'apex-thermal-flask',
          'kyoto-scented-soy-candle': 'kyoto-hinoki-candle',
        };
        const canonicalId = aliasMap[id];
        if (canonicalId) {
          product = PRODUCTS.find((p) => p.id === canonicalId);
        }
      }

      if (!product) {
        const error = new Error('Product not found');
        error.status = 404;
        throw error;
      }
      const reviews = REVIEWS.filter((r) => r.productId === product.id);
      const related = PRODUCTS.filter(
        (p) =>
          (p.category === product.category ||
            (product.categoryId && p.categoryId === product.categoryId)) &&
          p.id !== product.id
      ).slice(0, 4);

      return { ...product, reviewsList: reviews, relatedProducts: related };
    }

    return request(`/products/${id}/`);
  },

  async getCategories() {
    if (USE_MOCK) {
      await mockDelay(100);
      return CATEGORIES;
    }

    return request('/categories/');
  },

  // AUTHENTICATION
  async login(credentials) {
    if (USE_MOCK) {
      await mockDelay(300);
      if (credentials.email && credentials.password) {
        const mockUser = {
          id: 'usr_83921',
          name: credentials.email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Alex Vance',
          email: credentials.email,
          phone: '+91 98765 43210',
          memberSince: 'March 2024',
          addresses: [
            {
              id: 'addr_1',
              title: 'Home',
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
        const mockToken = 'mock_jwt_token_aurelia_secure_' + Date.now();
        localStorage.setItem('aurelia_auth_token', mockToken);
        return { user: mockUser, token: mockToken };
      }
      throw new Error('Please provide a valid email and password');
    }

    const data = await request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      localStorage.setItem('aurelia_auth_token', data.token);
    }
    return data;
  },

  async register(userData) {
    if (USE_MOCK) {
      await mockDelay(350);
      const mockUser = {
        id: 'usr_' + Date.now(),
        name: userData.fullName || userData.name || 'Aurelia Member',
        email: userData.email,
        phone: userData.phone || '+91 98765 00000',
        memberSince: 'Just now',
        addresses: [],
      };
      const mockToken = 'mock_jwt_token_aurelia_secure_' + Date.now();
      localStorage.setItem('aurelia_auth_token', mockToken);
      return { user: mockUser, token: mockToken };
    }

    const data = await request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      localStorage.setItem('aurelia_auth_token', data.token);
    }
    return data;
  },

  // ORDERS
  async getOrders() {
    if (USE_MOCK) {
      await mockDelay(200);
      const localOrders = JSON.parse(
        localStorage.getItem('aurelia_orders') || localStorage.getItem('nova_orders') || '[]'
      );
      return localOrders;
    }

    return request('/orders/');
  },

  async createOrder(orderData) {
    if (USE_MOCK) {
      await mockDelay(400);
      const newOrder = {
        id: 'AUR-' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toISOString(),
        items: orderData.items,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        tax: orderData.tax,
        total: orderData.total,
        status: 'Processing',
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod || 'Credit Card',
      };

      const existingOrders = JSON.parse(
        localStorage.getItem('aurelia_orders') || localStorage.getItem('nova_orders') || '[]'
      );
      const updatedOrders = [newOrder, ...existingOrders];
      localStorage.setItem('aurelia_orders', JSON.stringify(updatedOrders));

      return newOrder;
    }

    return request('/orders/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
};
