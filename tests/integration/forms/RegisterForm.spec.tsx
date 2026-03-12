import { test, expect, vi, describe, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { RegisterForm, type RegisterFormData } from '../../../src/components/Auth/RegisterForm';
import { render } from '../test-utils';
import '../setup';

/**
 * RegisterForm Integration Tests
 * Tests the integration between RegisterForm, React Hook Form, validation, and user interactions
 */

// ============================================================================
// Test Wrapper Component
// ============================================================================

const RegisterFormWrapper = ({
    onSubmit,
    isLoading = false,
    errorMessage,
    successMessage,
}: {
    onSubmit: (data: RegisterFormData) => void;
    isLoading?: boolean;
    errorMessage?: string;
    successMessage?: string;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>();

    return (
        <RegisterForm
            register={register}
            errors={errors}
            onSubmit={handleSubmit(onSubmit)}
            isLoading={isLoading}
            errorMessage={errorMessage}
            successMessage={successMessage}
        />
    );
};

// ============================================================================
// Integration Tests
// ============================================================================

describe('RegisterForm - Integration Tests', () => {
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should render form with all fields', () => {
        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        expect(screen.getByText(/Create an account/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/John/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Doe/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter your password$/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter your password again/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    test('should display firstName field with correct attributes', () => {
        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const firstNameInput = screen.getByLabelText(/first.*name/i);
        expect(firstNameInput).toHaveAttribute('type', 'text');
        expect(firstNameInput).toHaveAttribute('id', 'firstName');
    });

    test('should display lastName field with correct attributes', () => {
        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const lastNameInput = screen.getByLabelText(/last.*name/i);
        expect(lastNameInput).toHaveAttribute('type', 'text');
        expect(lastNameInput).toHaveAttribute('id', 'lastName');
    });

    test('should display email field with correct attributes', () => {
        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText(/email/i);
        expect(emailInput).toHaveAttribute('type', 'email');
        expect(emailInput).toHaveAttribute('id', 'register-email');
    });

    test('should display password field with correct attributes', () => {
        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const passwordInput = screen.getByLabelText(/^password$/i);
        expect(passwordInput).toHaveAttribute('type', 'password');
        expect(passwordInput).toHaveAttribute('id', 'register-password');
    });

    test('should display confirm password field with correct attributes', () => {
        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const confirmPasswordInput = screen.getByLabelText(/confirm.*password/i);
        expect(confirmPasswordInput).toHaveAttribute('type', 'password');
        expect(confirmPasswordInput).toHaveAttribute('id', 'register-confirm-password');
    });

    test('should validate required firstName field', async () => {
        const user = userEvent.setup();

        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const submitButton = screen.getByRole('button', { name: /register|sign up|create/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/first.*name.*required/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should validate firstName minimum length', async () => {
        const user = userEvent.setup();

        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const firstNameInput = screen.getByLabelText(/first.*name/i);
        await user.type(firstNameInput, 'A');

        const submitButton = screen.getByRole('button', { name: /create account/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should validate required lastName field', async () => {
        const user = userEvent.setup();

        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const firstNameInput = screen.getByLabelText(/first.*name/i);
        await user.type(firstNameInput, 'John');

        const submitButton = screen.getByRole('button', { name: /register|sign up|create/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/last.*name.*required/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should validate lastName minimum length', async () => {
        const user = userEvent.setup();

        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const lastNameInput = screen.getByLabelText(/last.*name/i);
        await user.type(lastNameInput, 'D');

        const submitButton = screen.getByRole('button', { name: /register|sign up|create/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should validate required email field', async () => {
        const user = userEvent.setup();

        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const firstNameInput = screen.getByLabelText(/first.*name/i);
        const lastNameInput = screen.getByLabelText(/last.*name/i);

        await user.type(firstNameInput, 'John');
        await user.type(lastNameInput, 'Doe');

        const submitButton = screen.getByRole('button', { name: /register|sign up|create/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/email.*required/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should validate email format', async () => {
        const user = userEvent.setup();

        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText(/email address/i);
        await user.type(emailInput, 'invalid-email@asdfasd');

        const submitButton = screen.getByRole('button', { name: /create account/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should validate required password field', async () => {
        const user = userEvent.setup();

        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const firstNameInput = screen.getByLabelText(/first.*name/i);
        const lastNameInput = screen.getByLabelText(/last.*name/i);
        const emailInput = screen.getByLabelText(/email/i);

        await user.type(firstNameInput, 'John');
        await user.type(lastNameInput, 'Doe');
        await user.type(emailInput, 'john@example.com');

        const submitButton = screen.getByRole('button', { name: /register|sign up|create/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should validate password minimum length', async () => {
        const user = userEvent.setup();

        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const passwordInput = screen.getByLabelText(/^password$/i);
        await user.type(passwordInput, '123');

        const submitButton = screen.getByRole('button', { name: /register|sign up|create/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/password.*6|minimum.*6/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should validate required confirmPassword field', async () => {
        const user = userEvent.setup();

        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const firstNameInput = screen.getByLabelText(/first.*name/i);
        const lastNameInput = screen.getByLabelText(/last.*name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/^password$/i);

        await user.type(firstNameInput, 'John');
        await user.type(lastNameInput, 'Doe');
        await user.type(emailInput, 'john@example.com');
        await user.type(passwordInput, 'password123');

        const submitButton = screen.getByRole('button', { name: /create account/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/password confirmation is required/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should validate confirmPassword minimum length', async () => {
        const user = userEvent.setup();

        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const confirmPasswordInput = screen.getByLabelText(/confirm.*password/i);
        await user.type(confirmPasswordInput, '123');

        const submitButton = screen.getByRole('button', { name: /create account/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should submit form with valid data', async () => {
        const user = userEvent.setup();

        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const firstNameInput = screen.getByLabelText(/first.*name/i);
        const lastNameInput = screen.getByLabelText(/last.*name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm.*password/i);

        await user.type(firstNameInput, 'John');
        await user.type(lastNameInput, 'Doe');
        await user.type(emailInput, 'john@example.com');
        await user.type(passwordInput, 'password123');
        await user.type(confirmPasswordInput, 'password123');

        const submitButton = screen.getByRole('button', { name: /create account/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(
                {
                    "firstName": 'John',
                    "lastName": 'Doe',
                    "email": 'john@example.com',
                    "password": 'password123',
                    "confirmPassword": 'password123',
                },
                expect.anything()
            );
        });
    });

    test('should display loading state when isLoading is true', () => {
        render(<RegisterFormWrapper onSubmit={mockOnSubmit} isLoading={true} />);

        const submitButton = screen.getByRole('button', { name: /Creating account/i });
        expect(submitButton).toBeDisabled();
    });

    test('should not allow form submission when loading', async () => {
        const user = userEvent.setup();

        render(<RegisterFormWrapper onSubmit={mockOnSubmit} isLoading={true} />);

        const firstNameInput = screen.getByLabelText(/first.*name/i);
        await user.type(firstNameInput, 'John');

        const submitButton = screen.getByRole('button', { name: /Creating account/i });
        expect(submitButton).toBeDisabled();

        await user.click(submitButton);

        // Submit should not be called when loading
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should display error message when provided', () => {
        render(
            <RegisterFormWrapper
                onSubmit={mockOnSubmit}
                errorMessage="Registration failed"
            />
        );

        expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    });

    test('should display success message when provided', () => {
        render(
            <RegisterFormWrapper
                onSubmit={mockOnSubmit}
                successMessage="Registration successful"
            />
        );

        expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });

    test('should not display error message when not provided', () => {
        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        expect(screen.queryByText(/registration failed/i)).not.toBeInTheDocument();
    });

    test('should not display success message when not provided', () => {
        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        expect(screen.queryByText(/registration successful/i)).not.toBeInTheDocument();
    });

    test('should allow typing in firstName field', async () => {
        const user = userEvent.setup();

        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const firstNameInput = screen.getByLabelText(/first.*name/i) as HTMLInputElement;
        await user.type(firstNameInput, 'Jane');

        expect(firstNameInput.value).toBe('Jane');
    });

    test('should allow typing in lastName field', async () => {
        const user = userEvent.setup();

        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const lastNameInput = screen.getByLabelText(/last.*name/i) as HTMLInputElement;
        await user.type(lastNameInput, 'Smith');

        expect(lastNameInput.value).toBe('Smith');
    });

    test('should allow typing in email field', async () => {
        const user = userEvent.setup();

        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
        await user.type(emailInput, 'jane@example.com');

        expect(emailInput.value).toBe('jane@example.com');
    });

    test('should allow typing in password field', async () => {
        const user = userEvent.setup();

        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
        await user.type(passwordInput, 'secret123');

        expect(passwordInput.value).toBe('secret123');
    });

    test('should allow typing in confirmPassword field', async () => {
        const user = userEvent.setup();

        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const confirmPasswordInput = screen.getByLabelText(/confirm.*password/i) as HTMLInputElement;
        await user.type(confirmPasswordInput, 'secret123');

        expect(confirmPasswordInput.value).toBe('secret123');
    });

    test('should validate email with valid format', async () => {
        const user = userEvent.setup();

        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const firstNameInput = screen.getByLabelText(/first.*name/i);
        const lastNameInput = screen.getByLabelText(/last.*name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm.*password/i);

        await user.type(firstNameInput, 'John');
        await user.type(lastNameInput, 'Doe');
        await user.type(emailInput, 'valid.email@example.com');
        await user.type(passwordInput, 'password123');
        await user.type(confirmPasswordInput, 'password123');

        const submitButton = screen.getByRole('button', { name: /register|sign up|create/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled();
        });

        // Should not show email validation error
        expect(screen.queryByText(/invalid.*email/i)).not.toBeInTheDocument();
    });

    test('should clear validation errors when valid input is provided', async () => {
        const user = userEvent.setup();

        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const firstNameInput = screen.getByLabelText(/first.*name/i);
        const submitButton = screen.getByRole('button', { name: /register|sign up|create/i });

        // First trigger validation error
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/first.*name.*required/i)).toBeInTheDocument();
        });

        // Then type valid name
        await user.type(firstNameInput, 'John');
        await user.tab(); // Blur the field

        await waitFor(() => {
            expect(screen.queryByText(/first.*name.*required/i)).not.toBeInTheDocument();
        });
    });

    test('should handle form submission with Enter key', async () => {
        const user = userEvent.setup();

        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const firstNameInput = screen.getByLabelText(/first.*name/i);
        const lastNameInput = screen.getByLabelText(/last.*name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm.*password/i);

        await user.type(firstNameInput, 'John');
        await user.type(lastNameInput, 'Doe');
        await user.type(emailInput, 'john@example.com');
        await user.type(passwordInput, 'password123');
        await user.type(confirmPasswordInput, 'password123');
        await user.keyboard('{Enter}');

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    password: 'password123',
                    confirmPassword: 'password123',
                }),
                expect.anything()
            );
        });
    });

    test('should display password fields as masked', () => {
        render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        const passwordInput = screen.getByLabelText(/^password$/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm.*password/i);

        expect(passwordInput).toHaveAttribute('type', 'password');
        expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });

    test('should display error and success messages conditionally', () => {
        const { rerender } = render(<RegisterFormWrapper onSubmit={mockOnSubmit} />);

        // No messages initially
        expect(screen.queryByText(/registration failed/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/registration successful/i)).not.toBeInTheDocument();

        // Display error message
        rerender(
            <RegisterFormWrapper
                onSubmit={mockOnSubmit}
                errorMessage="Registration failed"
            />
        );
        expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
        expect(screen.queryByText(/registration successful/i)).not.toBeInTheDocument();

        // Display success message
        rerender(
            <RegisterFormWrapper
                onSubmit={mockOnSubmit}
                successMessage="Registration successful"
            />
        );
        expect(screen.queryByText(/registration failed/i)).not.toBeInTheDocument();
        expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });
});
