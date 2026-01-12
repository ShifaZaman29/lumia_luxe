// lib/api.ts - COMPLETE FIXED VERSION

// ✅ CRITICAL FIX: Railway URL + /api prefix
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://lumialuxe-production-19d4.up.railway.app') + '/api';

// Debug log
if (typeof window !== 'undefined') {
  console.log('🔧 API Base URL:', API_BASE_URL);
  console.log('🔧 Environment API URL:', process.env.NEXT_PUBLIC_API_URL);
}

// Helper function to get token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Generic fetch wrapper with auth
async function fetchAPI(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getAuthToken();
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Important for cookies
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON but got: ${contentType}`);
    }

    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ API Error (${response.status}):`, data);
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    console.log(`✅ API Success (${response.status}):`, data);
    return data;
  } catch (error) {
    console.error('❌ Network/API error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error - please check if the backend server is running');
  }
}

// ==================== AUTH API ====================
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    console.log('📝 Register attempt:', { name, email });
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  login: async (email: string, password: string) => {
    console.log('🔐 Login attempt:', { email });
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getMe: async () => {
    return fetchAPI('/auth/me');
  },

  logout: async () => {
    // Clear local token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    return { success: true, message: 'Logged out' };
  }
};

// ==================== PRODUCTS API ====================
export const productsAPI = {
  getAll: async (params?: {
    category?: string;
    featured?: boolean;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return fetchAPI(`/products${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return fetchAPI(`/products/${id}`);
  },

  getBySlug: async (slug: string) => {
    return fetchAPI(`/products/slug/${slug}`);
  },

  addReview: async (productId: string, rating: number, comment: string) => {
    return fetchAPI(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  },

  getCategories: async () => {
    return fetchAPI('/products/categories');
  }
};

// ==================== CART API ====================
export const cartAPI = {
  getCart: async () => {
    try {
      return await fetchAPI('/cart');
    } catch (error) {
      console.error('Cart get error:', error);
      return { success: false, message: 'Failed to fetch cart', cart: [] };
    }
  },

  addItem: async (productId: string, quantity: number = 1) => {
    try {
      return await fetchAPI('/cart/items', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      });
    } catch (error) {
      console.error('Cart add error:', error);
      return { success: false, message: 'Failed to add to cart' };
    }
  },

  updateItem: async (itemId: string, quantity: number) => {
    try {
      return await fetchAPI(`/cart/items/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      });
    } catch (error) {
      console.error('Cart update error:', error);
      return { success: false, message: 'Failed to update cart item' };
    }
  },

  removeItem: async (itemId: string) => {
    try {
      return await fetchAPI(`/cart/items/${itemId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Cart remove error:', error);
      return { success: false, message: 'Failed to remove item from cart' };
    }
  },

  clearCart: async () => {
    try {
      return await fetchAPI('/cart/clear', {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Cart clear error:', error);
      return { success: false, message: 'Failed to clear cart' };
    }
  },

  getCartCount: async () => {
    try {
      const response = await fetchAPI('/cart/count');
      return response;
    } catch (error) {
      console.error('Cart count error:', error);
      return { success: false, count: 0 };
    }
  }
};

// ==================== ORDERS API ====================
export const ordersAPI = {
  create: async (orderData: {
    shippingAddress: {
      name: string;
      phone: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country?: string;
    };
    paymentMethod: 'cash' | 'card' | 'online';
    notes?: string;
  }) => {
    return fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getMyOrders: async () => {
    return fetchAPI('/orders/my-orders');
  },

  getById: async (id: string) => {
    return fetchAPI(`/orders/${id}`);
  },

  cancel: async (id: string, reason: string) => {
    return fetchAPI(`/orders/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  },

  getOrderStatus: async (id: string) => {
    return fetchAPI(`/orders/${id}/status`);
  }
};

// ==================== USER API ====================
export const userAPI = {
  getProfile: async () => {
    return fetchAPI('/users/profile');
  },

  updateProfile: async (data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: any;
  }) => {
    return fetchAPI('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    return fetchAPI('/users/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  getWishlist: async () => {
    return fetchAPI('/users/wishlist');
  },

  addToWishlist: async (productId: string) => {
    return fetchAPI(`/users/wishlist/${productId}`, {
      method: 'POST',
    });
  },

  removeFromWishlist: async (productId: string) => {
    return fetchAPI(`/users/wishlist/${productId}`, {
      method: 'DELETE',
    });
  },

  getAddresses: async () => {
    return fetchAPI('/users/addresses');
  },

  addAddress: async (address: any) => {
    return fetchAPI('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    });
  }
};

// ==================== ADMIN API ====================
export const adminAPI = {
  getDashboardStats: async () => {
    return fetchAPI('/admin/stats');
  },

  getAllOrders: async (params?: { status?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return fetchAPI(`/admin/orders${query ? `?${query}` : ''}`);
  },

  updateOrderStatus: async (orderId: string, status: string, note?: string) => {
    return fetchAPI(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note }),
    });
  },

  getAllUsers: async () => {
    return fetchAPI('/admin/users');
  },

  updateUserRole: async (userId: string, role: string) => {
    return fetchAPI(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  deleteUser: async (userId: string) => {
    return fetchAPI(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  getAllProducts: async (params?: { 
    category?: string; 
    isActive?: boolean; 
    page?: number; 
    limit?: number 
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    return fetchAPI(`/admin/products${query ? `?${query}` : ''}`);
  },

  createProduct: async (productData: {
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    stock: number;
    isActive?: boolean;
  }) => {
    return fetchAPI('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  updateProduct: async (productId: string, productData: any) => {
    return fetchAPI(`/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (productId: string) => {
    return fetchAPI(`/admin/products/${productId}`, {
      method: 'DELETE',
    });
  },

  getProductById: async (productId: string) => {
    return fetchAPI(`/admin/products/${productId}`);
  }
};

// ==================== HEALTH CHECK ====================
export const healthAPI = {
  check: async () => {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      return response.json();
    } catch (error) {
      return { status: 'ERROR', message: 'Backend not reachable' };
    }
  }
};

// ==================== EXPORT ALL ====================
export default {
  auth: authAPI,
  products: productsAPI,
  cart: cartAPI,
  orders: ordersAPI,
  user: userAPI,
  admin: adminAPI,
  health: healthAPI,
};

// Utility for direct testing
export const testConnection = async () => {
  console.log('🧪 Testing API connection...');
  console.log('API Base URL:', API_BASE_URL);
  
  try {
    const health = await healthAPI.check();
    console.log('Health check:', health);
    
    // Test products endpoint
    const products = await productsAPI.getAll({ limit: 1 });
    console.log('Products test:', products);
    
    return { success: true, health, products };
  } catch (error) {
    console.error('Connection test failed:', error);
    return { success: false, error: error.message };
  }
};