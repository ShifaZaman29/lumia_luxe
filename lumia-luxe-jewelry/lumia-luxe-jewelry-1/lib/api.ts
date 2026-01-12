// lib/api.ts - FIXED VERSION
const API_BASE_URL = 'https://lumialuxe-production-19d4.up.railway.app/api';

console.log('🔧 API Base URL:', API_BASE_URL);

// Helper function to get token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Fetch wrapper
async function fetchAPI(endpoint: string, options: RequestInit = {}): Promise<any> {
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
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('❌ API error:', error);
    throw error;
  }
}

// Products API - FIXED
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
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    const endpoint = `/products${query ? `?${query}` : ''}`;
    
    console.log('📦 Fetching products from:', endpoint);
    return fetchAPI(endpoint);
  },

  getById: async (id: string) => {
    return fetchAPI(`/products/${id}`);
  }
};

// Auth API - FIXED
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const data = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  },

  login: async (email: string, password: string) => {
    const data = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  },

  getMe: async () => {
    return fetchAPI('/auth/me');
  }
};