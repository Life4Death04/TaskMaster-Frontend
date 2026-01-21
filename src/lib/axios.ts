import axios from 'axios';
import { store } from '@/app/store';
import { logout } from '@/features/auth/authSlice';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Auth0 token
api.interceptors.request.use(
  (config) => {
    // Get token from Redux store
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Only logout and redirect if not already on auth page
      // This prevents infinite loops when login fails or page refreshes
      const isOnAuthPage = window.location.pathname.startsWith('/auth');

      if (!isOnAuthPage) {
        console.error('Unauthorized - logging out');
        store.dispatch(logout());
        window.location.href = '/auth';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
