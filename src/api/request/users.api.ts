import api from '@/lib/axios';
import axios from 'axios';
import type { User } from '@/types';

// API Endpoints
const ENDPOINTS = {
  UPDATE_USER: '/users/me',
  DELETE_USER: '/users/me',
};

interface BackendUserResponse {
  success: boolean;
  user: User;
  message?: string;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
}

/**
 * API call to update user profile information
 * Updates firstName and/or lastName
 */
export const updateUserAPI = async (data: UpdateUserData): Promise<User> => {
  try {
    const response = await api.put<BackendUserResponse>(
      ENDPOINTS.UPDATE_USER,
      data
    );

    if (response.data.user) {
      return response.data.user;
    }

    throw new Error('Update user failed');
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      console.error('Update user API error:', message);
      throw new Error(message);
    }
    throw error;
  }
};

/**
 * API call to delete user account
 * Permanently deletes the user's account and all associated data
 */
export const deleteUserAPI = async (): Promise<void> => {
  try {
    await api.delete(ENDPOINTS.DELETE_USER);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      console.error('Delete user API error:', message);
      throw new Error(message);
    }
    throw error;
  }
};
