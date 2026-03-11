import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { staggerContainerVariants, fadeInDownVariants } from '@/utils/animations';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

export interface LoginFormData {
    email: string;
    password: string;
}

interface LoginFormProps {
    register: UseFormRegister<LoginFormData>;
    errors: FieldErrors<LoginFormData>;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    errorMessage?: string;
}

export const LoginForm = ({
    register,
    errors,
    onSubmit,
    isLoading,
    errorMessage,
}: LoginFormProps) => {
    const { t } = useTranslation();

    return (
        <motion.form onSubmit={onSubmit} className="space-y-4" variants={staggerContainerVariants} initial="hidden" animate="visible">
            <motion.div className="text-center" variants={fadeInDownVariants}>
                <h2 className="text-text-primary text-2xl font-bold leading-tight">{t('auth.login.title')}</h2>
                <p className="text-gray-500 dark:text-text-secondary text-sm mt-1">{t('auth.login.subtitle')}</p>
            </motion.div>
            {errorMessage && (
                <motion.div className="bg-error-background border border-error-border text-error-text px-4 py-3 rounded-lg" variants={fadeInDownVariants}>
                    {errorMessage}
                </motion.div>
            )}

            <motion.div variants={fadeInDownVariants}>
                <label
                    htmlFor="login-email"
                    className="block text-sm font-medium text-text-primary mb-2"
                >
                    {t('auth.login.emailLabel')}
                </label>
                <input
                    id="login-email"
                    type="email"
                    {...register('email', {
                        required: t('auth.errors.emailRequired'),
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: t('auth.errors.emailInvalid'),
                        },
                    })}
                    className="w-full px-4 py-3 border border-border-input rounded-lg bg-background-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    placeholder={t('auth.login.emailPlaceholder')}
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.email.message}
                    </p>
                )}
            </motion.div>

            <motion.div variants={fadeInDownVariants}>
                <div className="flex justify-between">
                    <label
                        htmlFor="login-password"
                        className="block text-sm font-medium text-text-primary mb-2"
                    >
                        {t('auth.login.passwordLabel')}
                    </label>
                    <a
                        href="#"
                        className="block text-sm font-medium text-primary dark:text-primary hover:text-primary-hover hover:cursor-pointer mb-2"
                    >
                        {t('auth.login.forgotPassword')}
                    </a>
                </div>
                <input
                    id="login-password"
                    type="password"
                    {...register('password', {
                        required: t('auth.errors.passwordRequired'),
                        minLength: {
                            value: 6,
                            message: t('auth.errors.passwordMinLength'),
                        },
                    })}
                    className="w-full px-4 py-3 border border-border-input rounded-lg bg-background-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    placeholder={t('auth.login.passwordPlaceholder')}
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.password.message}
                    </p>
                )}
            </motion.div>

            <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                variants={fadeInDownVariants}
            >
                {isLoading ? t('auth.login.submitting') : t('auth.login.submitButton')}
            </motion.button>
        </motion.form>
    );
};
