import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setLoading, setToken, setUser, logout } from '@/features/auth/authSlice';
import { getMeAPI } from '@/api/request/auth.api';

/**
 * AuthBootstrap
 * Ensures Redux auth state is restored on refresh and loading is cleared.
 */
export const AuthBootstrap = () => {
    const dispatch = useAppDispatch();
    const tokenInState = useAppSelector((s) => s.auth.token);

    useEffect(() => {
        let cancelled = false;
        const init = async () => {
            dispatch(setLoading(true));
            try {
                // Prefer Redux token, fallback to localStorage keys
                const storedToken = /* tokenInState
                    ||  */localStorage.getItem('token')
                    || localStorage.getItem('auth_token');

                if (storedToken) {
                    // Ensure Redux knows the token (axios interceptor reads from Redux)
                    dispatch(setToken(storedToken));
                    const me = await getMeAPI();
                    if (!cancelled) dispatch(setUser(me));
                } else {
                    // No token present – clear user and stop loading
                    if (!cancelled) dispatch(setUser(null));
                }
            } catch (e) {
                // Token invalid/expired -> logout and clear
                if (!cancelled) dispatch(logout());
            } finally {
                if (!cancelled) dispatch(setLoading(false));
            }
        };
        init();
        return () => {
            cancelled = true;
        };
    }, [dispatch, tokenInState]);

    return null;
};
