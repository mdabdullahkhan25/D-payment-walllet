import axios from 'axios';
import jwtDecode from 'jwt-decode';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      return null;
    }
    
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }
      
      return JSON.parse(user);
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
};

// Wallet Services
export const walletService = {
  getWallet: async () => {
    try {
      const response = await api.get('/wallet');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  addFunds: async (amount, paymentMethodId) => {
    try {
      const response = await api.post('/wallet/add-funds', { amount, paymentMethodId });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  transferFunds: async (transferData) => {
    try {
      const response = await api.post('/wallet/transfer', transferData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  makePayment: async (paymentData) => {
    try {
      const response = await api.post('/wallet/payment', paymentData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
};

// Transaction Services
export const transactionService = {
  getTransactions: async (params = {}) => {
    try {
      const response = await api.get('/transactions', { params });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getTransaction: async (id) => {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getTransactionSummary: async () => {
    try {
      const response = await api.get('/transactions/summary');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
};

export default api; 