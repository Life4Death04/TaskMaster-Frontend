import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LoginForm } from '@/components/Auth/LoginForm';
import { RegisterForm } from '@/components/Auth/RegisterForm';
import { SocialLoginButtons } from '@/components/Auth/SocialLoginButtons';
import type { LoginFormData } from '@/components/Auth/LoginForm';
import type { RegisterFormData } from '@/components/Auth/RegisterForm';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

type TabType = 'login' | 'register';

interface AuthViewProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    // Login props
    loginRegister: UseFormRegister<LoginFormData>;
    loginErrors: FieldErrors<LoginFormData>;
    onLoginSubmit: (e: React.FormEvent) => void;
    loginLoading: boolean;
    loginError?: string;
    // Register props
    registerRegister: UseFormRegister<RegisterFormData>;
    registerErrors: FieldErrors<RegisterFormData>;
    onRegisterSubmit: (e: React.FormEvent) => void;
    registerLoading: boolean;
    registerError?: string;
    registerSuccess?: string;
}

/**
 * Pure presentational component for authentication UI
 * Handles only visual rendering, no business logic
 */
export const AuthView = ({
    activeTab,
    onTabChange,
    loginRegister,
    loginErrors,
    onLoginSubmit,
    loginLoading,
    loginError,
    registerRegister,
    registerErrors,
    onRegisterSubmit,
    registerLoading,
    registerError,
    registerSuccess,
}: AuthViewProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-auth-page">
            {/* Theme Toggle - Top Right */}
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="max-w-md w-full mx-4">
                <div className="bg-card-primary rounded-2xl shadow-xl transition-colors">
                    {/* Header */}
                    <div className="text-center bg-auth-header w-full py-6 px-4 rounded-t-2xl">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            TaskMaster
                        </h1>
                        <p className="text-white">
                            Organize your life, master your tasks
                        </p>
                    </div>

                    <div>
                        {/* Tabs */}
                        <div className="flex mb-8 bg-card-primary  p-1 border-b border-border-input">
                            <button
                                onClick={() => onTabChange('login')}
                                className={`flex-1 py-2 px-4 font-medium transition-colors hover:cursor-pointer ${activeTab === 'login'
                                    ? 'border-b-3 border-primary text-gray-900 text-primary shadow-sm'
                                    : 'text-text-secondary hover:text-text-secondary-hover '
                                    }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => onTabChange('register')}
                                className={`flex-1 py-2 px-4 font-medium transition-colors hover:cursor-pointer ${activeTab === 'register'
                                    ? 'border-b-3 border-primary text-gray-900 text-primary shadow-sm'
                                    : 'text-text-secondary hover:text-text-secondary-hover '
                                    }`}
                            >
                                Register
                            </button>
                        </div>

                        {/* Login Tab Content */}
                        {activeTab === 'login' && (
                            <div>
                                <div className="space-y-6 px-8 pb-8">
                                    <LoginForm
                                        register={loginRegister}
                                        errors={loginErrors}
                                        onSubmit={onLoginSubmit}
                                        isLoading={loginLoading}
                                        errorMessage={loginError}
                                    />

                                    <div className="relative flex py-1 items-center">
                                        <div className="flex-grow border-t border-border-input"></div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 text-gray-400 dark:text-text-secondary uppercase font-bold">
                                                Or continue with
                                            </span>
                                        </div>
                                        <div className="flex-grow border-t border-border-input"></div>
                                    </div>

                                    <SocialLoginButtons />
                                </div>
                                <div className="px-6 py-4 bg-background-primary border-t border-border-input text-center rounded-b-2xl">
                                    <p className="text-sm text-gray-500 dark:text-text-secondary">
                                        Don't have an account?{' '}
                                        <button
                                            onClick={() => onTabChange('register')}
                                            className="text-primary font-bold hover:underline"
                                        >
                                            Sign up
                                        </button>
                                    </p>
                                    <div className="mt-2 text-xs text-gray-400 dark:text-gray-600">
                                        By continuing, you agree to TaskMaster's{' '}
                                        <a
                                            className="hover:text-gray-500 dark:hover:text-gray-400 underline"
                                            href="#"
                                        >
                                            Terms
                                        </a>{' '}
                                        and{' '}
                                        <a
                                            className="hover:text-gray-500 dark:hover:text-gray-400 underline"
                                            href="#"
                                        >
                                            Privacy Policy
                                        </a>
                                        .
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Register Tab Content */}
                        {activeTab === 'register' && (
                            <div>
                                <div className="space-y-6 px-8 pb-8">
                                    <RegisterForm
                                        register={registerRegister}
                                        errors={registerErrors}
                                        onSubmit={onRegisterSubmit}
                                        isLoading={registerLoading}
                                        errorMessage={registerError}
                                        successMessage={registerSuccess}
                                    />

                                    <div className="relative flex py-1 items-center">
                                        <div className="flex-grow border-t border-gray-200 dark:border-border-dark"></div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 text-gray-400 dark:text-text-secondary uppercase font-bold">
                                                Or register with
                                            </span>
                                        </div>
                                        <div className="flex-grow border-t border-gray-200 dark:border-border-dark"></div>
                                    </div>

                                    <SocialLoginButtons />
                                </div>
                                <div className="px-6 py-4 bg-background-primary border-t border-gray-200 dark:border-border-dark text-center rounded-b-2xl">
                                    <p className="text-sm text-gray-500 dark:text-text-secondary">
                                        Already have an account?{' '}
                                        <button
                                            onClick={() => onTabChange('login')}
                                            className="text-primary font-bold hover:underline"
                                        >
                                            Log in
                                        </button>
                                    </p>
                                    <div className="mt-2 text-xs text-gray-400 dark:text-gray-600">
                                        By continuing, you agree to TaskMaster's{' '}
                                        <a
                                            className="hover:text-gray-500 dark:hover:text-gray-400 underline"
                                            href="#"
                                        >
                                            Terms
                                        </a>{' '}
                                        and{' '}
                                        <a
                                            className="hover:text-gray-500 dark:hover:text-gray-400 underline"
                                            href="#"
                                        >
                                            Privacy Policy
                                        </a>
                                        .
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
