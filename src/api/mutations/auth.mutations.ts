import { useMutation } from '@tanstack/react-query';
import type { User as Auth0User } from '@auth0/auth0-react';
import {
  registerUserAPI,
  loginUserAPI,
  syncUserWithBackendAPI,
} from '../request/auth.api';

import { useDispatch } from 'react-redux';
import { setToken, setUser } from '@/features/auth/authSlice';

/**
 * React Query mutation hook for user registration
 * Creates a new user account in both Auth0 and backend
 */
export const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUserAPI,
    onSuccess: (data) => {
      console.log('✅ Registration successful:', data);
    },
    onError: (error: Error) => {
      console.error('❌ Registration error:', error);
    },
  });
};

/**
 * React Query mutation hook for user login
 * Authenticates user with email and password
 */
export const useLoginUser = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: loginUserAPI,
    onSuccess: (data) => {
      console.log('✅ Login successful:', data);
      dispatch(setUser(data.user));
      dispatch(setToken(data.token));
    },
    onError: (error: Error) => {
      console.error('❌ Login error:', error);
    },
  });
};

/**
 * React Query mutation hook to sync user with backend
 * Checks if user exists in backend database
 */
export const useSyncUserWithBackend = () => {
  return useMutation({
    mutationFn: ({
      auth0User,
      token,
    }: {
      auth0User: Auth0User;
      token: string;
    }) => syncUserWithBackendAPI(auth0User, token),
    onError: (error: Error) => {
      console.error('Error checking user in backend:', error);

      // If user doesn't exist in backend, throw error to redirect to register
      if (error.message === 'USER_NOT_REGISTERED') {
        throw new Error('USER_NOT_REGISTERED');
      }
    },
  });
};
