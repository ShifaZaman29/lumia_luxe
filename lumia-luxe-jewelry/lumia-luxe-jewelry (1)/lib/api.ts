// lib/api.ts - API utility for connecting to backend

// FIXED: Changed port from 4001 to 4000 to match backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Helper function to get token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Generic fetch wrapper with auth
async function fetchAPI2(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getAuthToken();
  
  // Create Headers object
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    // Better error handling
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error - please check if the backend server is running');
  }
}

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    return fetchAPI2('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  login: async (email: string, password: string) => {
    return fetchAPI2('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getMe: async () => {
    return fetchAPI2('/auth/me');
  },
};

// Products API
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
    return fetchAPI2(`/products${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return fetchAPI2(`/products/${id}`);
  },

  addReview: async (productId: string, rating: number, comment: string) => {
    return fetchAPI2(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  },
};



// Cart API
export const cartAPI = {
  // Get cart
  get: async () => {
    try {
      return await fetchAPI2('/cart');
    } catch (error) {
      console.error('Cart get error:', error);
      return { success: false, message: 'Failed to fetch cart' };
    }
  },

  // Add item to cart - FIXED method name and endpoint
  addItem: async (productId: string, quantity: number = 1) => {
    try {
      return await fetchAPI2('/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      });
    } catch (error) {
      console.error('Cart add error:', error);
      return { success: false, message: 'Failed to add to cart' };
    }
  },

  // Update item quantity
  update: async (itemId: string, quantity: number) => {
    try {
      return await fetchAPI2(`/cart/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      });
    } catch (error) {
      console.error('Cart update error:', error);
      return { success: false, message: 'Failed to update cart' };
    }
  },

  // Remove item from cart
  remove: async (itemId: string) => {
    try {
      return await fetchAPI2(`/cart/${itemId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Cart remove error:', error);
      return { success: false, message: 'Failed to remove item' };
    }
  },

  // Clear cart
  clear: async () => {
    try {
      return await fetchAPI2('/cart', {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Cart clear error:', error);
      return { success: false, message: 'Failed to clear cart' };
    }
  }
}
// Orders API
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
    return fetchAPI2('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getMyOrders: async () => {
    return fetchAPI2('/orders');
  },

  getById: async (id: string) => {
    return fetchAPI2(`/orders/${id}`);
  },

  cancel: async (id: string, reason: string) => {
    return fetchAPI2(`/orders/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    return fetchAPI2('/users/profile');
  },

  updateProfile: async (data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: any;
  }) => {
    return fetchAPI2('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    return fetchAPI2('/users/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  getWishlist: async () => {
    return fetchAPI2('/users/wishlist');
  },

  addToWishlist: async (productId: string) => {
    return fetchAPI2(`/users/wishlist/${productId}`, {
      method: 'POST',
    });
  },

  removeFromWishlist: async (productId: string) => {
    return fetchAPI2(`/users/wishlist/${productId}`, {
      method: 'DELETE',
    });
  },
};

// Admin API
export const adminAPI = {
  // Dashboard Stats
  getDashboardStats: async () => {
    return fetchAPI2('/admin/stats');
  },

  // Orders Management
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
    return fetchAPI2(`/admin/orders${query ? `?${query}` : ''}`);
  },

  updateOrderStatus: async (orderId: string, status: string, note?: string) => {
    return fetchAPI2(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note }),
    });
  },

  // Users Management
  getAllUsers: async () => {
    return fetchAPI2('/admin/users');
  },

  updateUserRole: async (userId: string, role: string) => {
    return fetchAPI2(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  deleteUser: async (userId: string) => {
    return fetchAPI2(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // Products Management
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
    return fetchAPI2(`/admin/products${query ? `?${query}` : ''}`);
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
    return fetchAPI2('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  updateProduct: async (productId: string, productData: any) => {
    return fetchAPI2(`/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (productId: string) => {
    return fetchAPI2(`/admin/products/${productId}`, {
      method: 'DELETE',
    });
  },

  getProductById: async (productId: string) => {
    return fetchAPI2(`/admin/products/${productId}`);
  },
};

export default {
  auth: authAPI,
  products: productsAPI,
  cart: cartAPI,
  orders: ordersAPI,
  user: userAPI,
  admin: adminAPI,
};