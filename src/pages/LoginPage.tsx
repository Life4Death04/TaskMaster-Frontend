import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLoginUser } from '@/api/mutations/auth.mutations';
import { LoginButton } from '@/components/common/LoginButton';

interface LoginFormData {
    email: string;
    password: string;
}

/**
 * Login page with email/password form and Auth0 social login
 */
export const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    const loginMutation = useLoginUser();

    const onSubmit = async (data: LoginFormData) => {
        try {
            console.log('🔐 Attempting login with:', { email: data.email });
            const result = await loginMutation.mutateAsync(data);
            console.log('✅ Login successful:', result);
            navigate('/home');
        } catch (error) {
            console.error('❌ Login failed:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark">
            <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-card-dark rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        TaskMaster
                    </h1>
                    <p className="text-gray-600 dark:text-text-secondary mb-8">
                        Sign in to manage your tasks
                    </p>
                </div>

                {/* Success message from registration */}
                {location.state?.message && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded">
                        {location.state.message}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Error Display */}
                    {loginMutation.isError && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                            <p className="font-semibold">Login Failed</p>
                            <p className="text-sm">{loginMutation.error?.message}</p>
                        </div>
                    )}

                    {/* Email Field */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-background-dark dark:text-white"
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters',
                                },
                            })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-background-dark dark:text-white"
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loginMutation.isPending ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Logging in...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-border-dark"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-card-dark text-gray-500 dark:text-text-secondary">
                            Or continue with
                        </span>
                    </div>
                </div>

                {/* Auth0 Login */}
                <div className="flex justify-center">
                    <LoginButton />
                </div>

                {/* Register Link */}
                <p className="text-center text-sm text-gray-600 dark:text-text-secondary mt-6">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="font-medium text-primary hover:text-primary-hover"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};
