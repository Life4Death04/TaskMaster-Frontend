import api from '@/lib/axios';
import axios from 'axios';
import type {
  User,
  RegisterData,
  LoginData,
  AuthResponse,
  RegisterResponse,
} from '@/types';

// API Endpoints
const ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  ME: '/users/me',
};

/**
 * API call to register a new user
 * Creates a new user account in the backend database
 */
export const registerUserAPI = async (data: RegisterData): Promise<User> => {
  try {
    const response = await api.post<RegisterResponse>(ENDPOINTS.REGISTER, data);

    // Guard clause - fail fast
    if (!response.data.user || !response.data.token) {
      throw new Error('Registration failed');
    }

    // Happy path - clear and unindented
    localStorage.setItem('auth_token', response.data.token);
    return response.data.user;
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

    // Guard clause - fail fast
    if (!response.data.user || !response.data.token) {
      throw new Error('Login failed');
    }

    // Happy path - clear and unindented
    localStorage.setItem('auth_token', response.data.token);
    return response.data;
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
 * API call to fetch current authenticated user
 */
export const getMeAPI = async (): Promise<User> => {
  const response = await api.get<{ user: User }>(ENDPOINTS.ME);
  return response.data.user;
};
