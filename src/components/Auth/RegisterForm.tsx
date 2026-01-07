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
}

export const RegisterForm = ({
    register,
    errors,
    onSubmit,
    isLoading,
    errorMessage,
}: RegisterFormProps) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {errorMessage && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                    {errorMessage}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        First Name
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        {...register('firstName', {
                            required: 'First name is required',
                            minLength: {
                                value: 2,
                                message: 'At least 2 characters',
                            },
                        })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-border-dark rounded-lg bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                        placeholder="John"
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
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        Last Name
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        {...register('lastName', {
                            required: 'Last name is required',
                            minLength: {
                                value: 2,
                                message: 'At least 2 characters',
                            },
                        })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-border-dark rounded-lg bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                        placeholder="Doe"
                    />
                    {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.lastName.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label
                    htmlFor="register-email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                    Email Address
                </label>
                <input
                    id="register-email"
                    type="email"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                        },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-border-dark rounded-lg bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    placeholder="you@example.com"
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="register-password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                    Password
                </label>
                <input
                    id="register-password"
                    type="password"
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                        },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-border-dark rounded-lg bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    placeholder="Enter your password"
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="register-confirm-password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                    Confirm Password
                </label>
                <input
                    id="register-confirm-password"
                    type="password"
                    {...register('confirmPassword', {
                        required: 'Password confirmation is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                        },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-border-dark rounded-lg bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    placeholder="Enter your password"
                />
                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
            >
                {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
        </form>
    );
};
