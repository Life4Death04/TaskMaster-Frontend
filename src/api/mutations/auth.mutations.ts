import { useMutation } from '@tanstack/react-query';
import {
  registerUserAPI,
  loginUserAPI,
} from '../request/auth.api';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '@/features/auth/authSlice';

/**
 * React Query mutation hook for user registration
 * Creates a new user account in the backend database
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
