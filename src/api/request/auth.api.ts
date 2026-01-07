import api from '@/lib/axios';
import axios from 'axios';
import type { User } from '@/types';
import type { User as Auth0User } from '@auth0/auth0-react';

// API Endpoints
const ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  AUTH0_USER: (auth0Id: string) => `/users/auth0/${auth0Id}`,
};

interface BackendUserResponse {
  success: boolean;
  data: {
    user: User;
  };
  message?: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface RegisterResponse {
  user: User;
  token: string;
}

/**
 * API call to register a new user
 * Creates a new user account in both Auth0 and backend
 */
export const registerUserAPI = async (data: RegisterData): Promise<User> => {
  try {
    const response = await api.post<RegisterResponse>(ENDPOINTS.REGISTER, data);

    if (response.data.user && response.data.token) {
      // Store token in localStorage
      localStorage.setItem('auth_token', response.data.token);
      return response.data.user;
    }

    throw new Error('Registration failed');
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      console.error('Registration API error:', message);
      throw new Error(message);
    }
    throw error;
  }
};

/**
 * API call to login user with email and password
 * Returns user data and JWT token
 */
export const loginUserAPI = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(ENDPOINTS.LOGIN, data);

    if (response.data.user && response.data.token) {
      // Store token in localStorage for axios interceptor
      localStorage.setItem('auth_token', response.data.token);
      return response.data;
    }

    throw new Error('Login failed');
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      console.error('Login API error:', message);
      throw new Error(message);
    }
    throw error;
  }
};

/**
 * API call to check if user exists in backend database
 * Returns user if exists, throws error if not
 */
export const syncUserWithBackendAPI = async (
  auth0User: Auth0User,
  token: string
): Promise<User> => {
  try {
    // Check if user exists in backend (doesn't create, just checks)
    const response = await api.get<BackendUserResponse>(
      ENDPOINTS.AUTH0_USER(auth0User.sub || ''),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success && response.data.data.user) {
      return response.data.data.user;
    }

    throw new Error('User not found in backend');
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('USER_NOT_REGISTERED');
      }
      const message = error.response?.data?.message || error.message;
      console.error('Sync user API error:', message);
      throw new Error(message);
    }
    throw error;
  }
};
