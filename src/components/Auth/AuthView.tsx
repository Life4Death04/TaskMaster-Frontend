import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();

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
                        <div className="text-4xl font-bold text-white mb-2">
                            {t('auth.appName')}
                        </div>
                        <p className="text-white">
                            {t('auth.tagline')}
                        </p>
                    </div>

                    <div>
                        {/* Tabs */}
                        <div className="relative flex mb-8 bg-card-primary p-1 border-b border-border-input">
                            {/* Animated Slider */}
                            <motion.div
                                className="absolute bottom-0 h-0.5 bg-primary"
                                initial={false}
                                animate={{
                                    left: activeTab === 'login' ? '0%' : '50%',
                                    width: '50%',
                                }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 30,
                                }}
                            />

                            <button
                                onClick={() => onTabChange('login')}
                                className={`flex-1 py-2 px-4 font-medium transition-colors hover:cursor-pointer relative z-10 ${activeTab === 'login'
                                    ? 'text-primary'
                                    : 'text-text-secondary hover:text-text-secondary-hover'
                                    }`}
                            >
                                {t('auth.tabs.login')}
                            </button>
                            <button
                                onClick={() => onTabChange('register')}
                                className={`flex-1 py-2 px-4 font-medium transition-colors hover:cursor-pointer relative z-10 ${activeTab === 'register'
                                    ? 'text-primary'
                                    : 'text-text-secondary hover:text-text-secondary-hover'
                                    }`}
                            >
                                {t('auth.tabs.register')}
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
                                                {t('auth.social.continueWith')}
                                            </span>
                                        </div>
                                        <div className="flex-grow border-t border-border-input"></div>
                                    </div>

                                    <SocialLoginButtons />
                                </div>
                                <div className="px-6 py-4 bg-background-primary border-t border-border-input text-center rounded-b-2xl">
                                    <p className="text-sm text-gray-500 dark:text-text-secondary">
                                        {t('auth.login.noAccount')}{' '}
                                        <button
                                            onClick={() => onTabChange('register')}
                                            className="text-primary font-bold hover:underline"
                                        >
                                            {t('auth.login.signUpLink')}
                                        </button>
                                    </p>
                                    <div className="mt-2 text-xs text-gray-400 dark:text-gray-600">
                                        {t('auth.footer.agreement')}{' '}
                                        <a
                                            className="hover:text-gray-500 dark:hover:text-gray-400 hover:cursor-pointer underline"
                                            href="#"
                                        >
                                            {t('auth.footer.terms')}
                                        </a>{' '}
                                        {t('auth.footer.and')}{' '}
                                        <a
                                            className="hover:text-gray-500 dark:hover:text-gray-400 hover:cursor-pointer underline"
                                            href="#"
                                        >
                                            {t('auth.footer.privacy')}
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
                                        <div className="flex-grow border-t border-border-input"></div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 text-gray-400 dark:text-text-secondary uppercase font-bold">
                                                {t('auth.social.registerWith')}
                                            </span>
                                        </div>
                                        <div className="flex-grow border-t border-border-input"></div>
                                    </div>

                                    <SocialLoginButtons />
                                </div>
                                <div className="px-6 py-4 bg-background-primary border-t border-border-input text-center rounded-b-2xl">
                                    <p className="text-sm text-gray-500 dark:text-text-secondary">
                                        {t('auth.register.haveAccount')}{' '}
                                        <button
                                            onClick={() => onTabChange('login')}
                                            className="text-primary font-bold hover:underline"
                                        >
                                            {t('auth.register.loginLink')}
                                        </button>
                                    </p>
                                    <div className="mt-2 text-xs text-gray-400 dark:text-gray-600">
                                        {t('auth.footer.agreement')}{' '}
                                        <a
                                            className="hover:text-gray-500 dark:hover:text-gray-400 hover:cursor-pointer underline"
                                            href="#"
                                        >
                                            {t('auth.footer.terms')}
                                        </a>{' '}
                                        {t('auth.footer.and')}{' '}
                                        <a
                                            className="hover:text-gray-500 dark:hover:text-gray-400 hover:cursor-pointer underline"
                                            href="#"
                                        >
                                            {t('auth.footer.privacy')}
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
