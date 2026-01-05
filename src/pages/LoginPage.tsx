import { LoginButton } from '@/components/common/LoginButton';
import { Link } from 'react-router-dom';

/**
 * Landing page for unauthenticated users
 */
export const LoginPage = () => {

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">TaskMaster</h1>
                    <p className="text-gray-600 mb-8">
                        Manage your tasks efficiently and stay organized
                    </p>
                </div>

                <div className="flex justify-center">
                    <LoginButton />
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Sign in to access your tasks and lists
                </p>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};
