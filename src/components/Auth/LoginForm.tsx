import { motion } from 'framer-motion';
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
    return (
        <motion.form onSubmit={onSubmit} className="space-y-4" variants={staggerContainerVariants} initial="hidden" animate="visible">
            <motion.div className="text-center" variants={fadeInDownVariants}>
                <h2 className="text-text-primary text-2xl font-bold leading-tight">Welcome Back</h2>
                <p className="text-gray-500 dark:text-text-secondary text-sm mt-1">Please enter your details to sign in.</p>
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
                    Email Address
                </label>
                <input
                    id="login-email"
                    type="email"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                        },
                    })}
                    className="w-full px-4 py-3 border border-border-input rounded-lg bg-background-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    placeholder="name@example.com"
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
                        Password
                    </label>
                    <a
                        href="#"
                        className="block text-sm font-medium text-primary dark:text-primary hover:text-primary-hover hover:cursor-pointer mb-2"
                    >
                        Forgot password?
                    </a>
                </div>
                <input
                    id="login-password"
                    type="password"
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                        },
                    })}
                    className="w-full px-4 py-3 border border-border-input rounded-lg bg-background-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    placeholder="Enter your password"
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
                {isLoading ? 'Logging in...' : 'Log In'}
            </motion.button>
        </motion.form>
    );
};
