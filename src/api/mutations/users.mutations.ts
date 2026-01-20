import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setUser } from '@/features/auth/authSlice';
import { updateUserAPI } from '../request/users.api';

/**
 * React Query mutation hook to update user profile
 * Updates firstName and/or lastName and syncs with Redux
 */
export const useUpdateUser = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: updateUserAPI,
    retry: false,
    onSuccess: (updatedUser) => {
      console.log('✅ User updated successfully:', updatedUser);
      // Update Redux state with new user data
      dispatch(setUser(updatedUser));
    },
    onError: (error: Error) => {
      console.error('❌ Update user error:', error);
    },
  });
};
