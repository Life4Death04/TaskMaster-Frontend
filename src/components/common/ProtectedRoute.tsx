import { useAuth0 } from '@auth0/auth0-react';
import { useAppSelector } from '@/hooks/redux';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

/**
 * Wrapper component that protects routes requiring authentication
 * Shows loading state while checking auth, redirects to login if not authenticated
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isLoading: auth0Loading } = useAuth0();
    const { isAuthenticated, isLoading: reduxLoading } = useAppSelector(
        (state) => state.auth
    );

    const isLoading = auth0Loading || reduxLoading;

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    // Render protected content if authenticated
    return <>{children}</>;
};
