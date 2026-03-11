import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { staggerContainerVariants, fadeInDownVariants } from '@/utils/animations';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

export interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}

interface RegisterFormProps {
    register: UseFormRegister<RegisterFormData>;
    errors: FieldErrors<RegisterFormData>;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    errorMessage?: string;
    successMessage?: string;
}

export const RegisterForm = ({
    register,
    errors,
    onSubmit,
    isLoading,
    errorMessage,
    successMessage,
}: RegisterFormProps) => {
    const { t } = useTranslation();

    return (
        <motion.form onSubmit={onSubmit} className="space-y-4" variants={staggerContainerVariants} initial="hidden" animate="visible">
            <motion.div className="text-center" variants={fadeInDownVariants}>
                <h2 className="text-text-primary text-2xl font-bold leading-tight">{t('auth.register.title')}</h2>
                <p className="text-gray-500 dark:text-text-secondary text-sm mt-1">{t('auth.register.subtitle')}</p>
            </motion.div>

            {errorMessage && (
                <motion.div className="bg-error-background border border-error-border text-error-text px-4 py-3 rounded-lg" variants={fadeInDownVariants}>
                    {errorMessage}
                </motion.div>
            )}

            {successMessage && (
                <motion.div className="bg-success-background border border-success-border text-success-text px-4 py-3 rounded-lg" variants={fadeInDownVariants}>
                    {successMessage}
                </motion.div>
            )}

            <motion.div className="grid grid-cols-2 gap-4" variants={fadeInDownVariants}>
                <div>
                    <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-text-primary mb-2"
                    >
                        {t('auth.register.firstNameLabel')}
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        {...register('firstName', {
                            required: t('auth.errors.firstNameRequired'),
                            minLength: {
                                value: 2,
                                message: t('auth.errors.firstNameMinLength'),
                            },
                        })}
                        className="w-full px-4 py-3 border border-border-input rounded-lg bg-background-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                        placeholder={t('auth.register.firstNamePlaceholder')}
                    />
                    {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.firstName.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-text-primary mb-2"
                    >
                        {t('auth.register.lastNameLabel')}
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        {...register('lastName', {
                            required: t('auth.errors.lastNameRequired'),
                            minLength: {
                                value: 2,
                                message: t('auth.errors.lastNameMinLength'),
                            },
                        })}
                        className="w-full px-4 py-3 border border-border-input rounded-lg bg-background-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                        placeholder={t('auth.register.lastNamePlaceholder')}
                    />
                    {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.lastName.message}
                        </p>
                    )}
                </div>
            </motion.div>

            <motion.div variants={fadeInDownVariants}>
                <label
                    htmlFor="register-email"
                    className="block text-sm font-medium text-text-primary mb-2"
                >
                    {t('auth.register.emailLabel')}
                </label>
                <input
                    id="register-email"
                    type="email"
                    {...register('email', {
                        required: t('auth.errors.emailRequired'),
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: t('auth.errors.emailInvalid'),
                        },
                    })}
                    className="w-full px-4 py-3 border border-border-input rounded-lg bg-background-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    placeholder={t('auth.register.emailPlaceholder')}
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.email.message}
                    </p>
                )}
            </motion.div>

            <motion.div variants={fadeInDownVariants}>
                <label
                    htmlFor="register-password"
                    className="block text-sm font-medium text-text-primary mb-2"
                >
                    {t('auth.register.passwordLabel')}
                </label>
                <input
                    id="register-password"
                    type="password"
                    {...register('password', {
                        required: t('auth.errors.passwordRequired'),
                        minLength: {
                            value: 6,
                            message: t('auth.errors.passwordMinLength'),
                        },
                    })}
                    className="w-full px-4 py-3 border border-border-input rounded-lg bg-background-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    placeholder={t('auth.register.passwordPlaceholder')}
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.password.message}
                    </p>
                )}
            </motion.div>

            <motion.div variants={fadeInDownVariants}>
                <label
                    htmlFor="register-confirm-password"
                    className="block text-sm font-medium text-text-primary mb-2"
                >
                    {t('auth.register.confirmPasswordLabel')}
                </label>
                <input
                    id="register-confirm-password"
                    type="password"
                    {...register('confirmPassword', {
                        required: t('auth.errors.confirmPasswordRequired'),
                        minLength: {
                            value: 6,
                            message: t('auth.errors.passwordMinLength'),
                        },
                    })}
                    className="w-full px-4 py-3 border border-border-input rounded-lg bg-background-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    placeholder={t('auth.register.confirmPasswordPlaceholder')}
                />
                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </motion.div>

            <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                variants={fadeInDownVariants}
            >
                {isLoading ? t('auth.register.submitting') : t('auth.register.submitButton')}
            </motion.button>
        </motion.form>
    );
};
