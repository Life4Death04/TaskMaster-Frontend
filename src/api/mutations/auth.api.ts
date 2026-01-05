import api from '@/lib/axios';
import type { User } from '@/types';
import type { User as Auth0User } from '@auth0/auth0-react';

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

interface RegisterResponse {
  success: boolean;
  data: {
    user: User;
    message: string;
  };
}

/**
 * API call to register a new user
 * Creates a new user account in both Auth0 and backend
 */
export const registerUserAPI = async (data: RegisterData): Promise<User> => {
  const response = await api.post<RegisterResponse>('/users/register', data);

  if (response.data.success && response.data.data.user) {
    return response.data.data.user;
  }

  throw new Error('Registration failed');
};

/**
 * API call to check if user exists in backend database
 * Returns user if exists, throws error if not
 */
export const syncUserWithBackendAPI = async (
  auth0User: Auth0User,
  token: string
): Promise<User> => {
  // Check if user exists in backend (doesn't create, just checks)
  const response = await api.get<BackendUserResponse>(
    `/users/auth0/${auth0User.sub}`,
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
};
