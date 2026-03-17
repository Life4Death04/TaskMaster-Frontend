import { test, expect, vi, describe, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { LoginForm, type LoginFormData } from '../../../src/components/Auth/LoginForm';
import { render } from '../test-utils';
import '../setup';

/**
 * LoginForm Integration Tests
 * Tests the integration between LoginForm, React Hook Form, validation, and user interactions
 */

// ============================================================================
// Test Wrapper Component
// ============================================================================

const LoginFormWrapper = ({
    onSubmit,
    isLoading = false,
    errorMessage,
}: {
    onSubmit: (data: LoginFormData) => void;
    isLoading?: boolean;
    errorMessage?: string;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    return (
        <LoginForm
            register={register}
            errors={errors}
            onSubmit={handleSubmit(onSubmit)}
            isLoading={isLoading}
            errorMessage={errorMessage}
        />
    );
};

// ============================================================================
// Integration Tests
// ============================================================================

describe('LoginForm - Integration Tests', () => {
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should render form with all fields', () => {
        render(<LoginFormWrapper onSubmit={mockOnSubmit} />);

        expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in|log in/i })).toBeInTheDocument();
    });

    test('should display email field with correct attributes', () => {
        render(<LoginFormWrapper onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText(/email/i);
        expect(emailInput).toHaveAttribute('type', 'email');
        expect(emailInput).toHaveAttribute('id', 'login-email');
    });

    test('should display password field with correct attributes', () => {
        render(<LoginFormWrapper onSubmit={mockOnSubmit} />);

        const passwordInput = screen.getByLabelText(/^password$/i);
        expect(passwordInput).toHaveAttribute('type', 'password');
        expect(passwordInput).toHaveAttribute('id', 'login-password');
    });

    test('should display forgot password link', () => {
        render(<LoginFormWrapper onSubmit={mockOnSubmit} />);

        const forgotPasswordLink = screen.getByText(/forgot password/i);
        expect(forgotPasswordLink).toBeInTheDocument();
        expect(forgotPasswordLink).toHaveAttribute('href', '#');
    });

    test('should validate required email field', async () => {
        const user = userEvent.setup();

        render(<LoginFormWrapper onSubmit={mockOnSubmit} />);

        const submitButton = screen.getByRole('button', { name: /sign in|log in/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/email.*required/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should validate email format', async () => {
        const user = userEvent.setup();

        render(<LoginFormWrapper onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText(/email/i);
        await user.type(emailInput, 'invalid-email@asdfasdf');

        const submitButton = screen.getByRole('button', { name: /sign in|log in/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should validate required password field', async () => {
        const user = userEvent.setup();

        render(<LoginFormWrapper onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText(/email/i);
        await user.type(emailInput, 'test@example.com');

        const submitButton = screen.getByRole('button', { name: /sign in|log in/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/password.*required/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should validate password minimum length', async () => {
        const user = userEvent.setup();

        render(<LoginFormWrapper onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/^password$/i);

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, '123');

        const submitButton = screen.getByRole('button', { name: /sign in|log in/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/password.*6|minimum.*6/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should submit form with valid data', async () => {
        const user = userEvent.setup();

        render(<LoginFormWrapper onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/^password$/i);

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');

        const submitButton = screen.getByRole('button', { name: /sign in|log in/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: 'test@example.com',
                    password: 'password123',
                }),
                expect.anything()
            );
        });
    });

    test('should display loading state when isLoading is true', () => {
        render(<LoginFormWrapper onSubmit={mockOnSubmit} isLoading={true} />);

        const submitButton = screen.getByRole('button', { name: /logging in/i });
        expect(submitButton).toBeDisabled();
    });

    test('should not allow form submission when loading', async () => {
        const user = userEvent.setup();

        render(<LoginFormWrapper onSubmit={mockOnSubmit} isLoading={true} />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/^password$/i);

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');

        const submitButton = screen.getByRole('button', { name: /logging in/i });
        expect(submitButton).toBeDisabled();

        await user.click(submitButton);

        // Submit should not be called when loading
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should display error message when provided', () => {
        render(
            <LoginFormWrapper
                onSubmit={mockOnSubmit}
                errorMessage="Invalid email or password"
            />
        );

        expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });

    test('should not display error message when not provided', () => {
        render(<LoginFormWrapper onSubmit={mockOnSubmit} />);

        expect(screen.queryByText(/invalid email or password/i)).not.toBeInTheDocument();
    });

    test('should allow typing in email field', async () => {
        const user = userEvent.setup();

        render(<LoginFormWrapper onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
        await user.type(emailInput, 'user@example.com');

        expect(emailInput.value).toBe('user@example.com');
    });

    test('should allow typing in password field', async () => {
        const user = userEvent.setup();

        render(<LoginFormWrapper onSubmit={mockOnSubmit} />);

        const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
        await user.type(passwordInput, 'secret123');

        expect(passwordInput.value).toBe('secret123');
    });

    test('should validate email with valid format', async () => {
        const user = userEvent.setup();

        render(<LoginFormWrapper onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/^password$/i);

        await user.type(emailInput, 'valid.email@example.com');
        await user.type(passwordInput, 'password123');

        const submitButton = screen.getByRole('button', { name: /sign in|log in/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled();
        });

        // Should not show email validation error
        expect(screen.queryByText(/invalid.*email/i)).not.toBeInTheDocument();
    });

    test('should clear validation errors when valid input is provided', async () => {
        const user = userEvent.setup();

        render(<LoginFormWrapper onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText(/email/i);
        const submitButton = screen.getByRole('button', { name: /sign in|log in/i });

        // First trigger validation error
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/email.*required/i)).toBeInTheDocument();
        });

        // Then type valid email
        await user.type(emailInput, 'test@example.com');
        await user.tab(); // Blur the field

        await waitFor(() => {
            expect(screen.queryByText(/email.*required/i)).not.toBeInTheDocument();
        });
    });

    test('should handle form submission with Enter key', async () => {
        const user = userEvent.setup();

        render(<LoginFormWrapper onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/^password$/i);

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.keyboard('{Enter}');

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: 'test@example.com',
                    password: 'password123',
                }),
                expect.anything()
            );
        });
    });

    test('should display password field as masked', () => {
        render(<LoginFormWrapper onSubmit={mockOnSubmit} />);

        const passwordInput = screen.getByLabelText(/^password$/i);
        expect(passwordInput).toHaveAttribute('type', 'password');
    });
});
