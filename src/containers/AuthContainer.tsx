import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useRegisterUser, useLoginUser } from '@/api/mutations/auth.mutations';
import { AuthView } from '@/components/Auth/AuthView';
import type { LoginFormData } from '@/components/Auth/LoginForm';
import type { RegisterFormData } from '@/components/Auth/RegisterForm';

type TabType = 'login' | 'register';

/**
 * Container component for authentication logic
 * Handles all business logic, state management, and data fetching
 */
export const AuthContainer = () => {
    const [activeTab, setActiveTab] = useState<TabType>('login');
    const navigate = useNavigate();
    const location = useLocation();

    // Login form
    const {
        register: loginRegister,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors },
    } = useForm<LoginFormData>();

    // Register form
    const {
        register: registerRegister,
        handleSubmit: handleRegisterSubmit,
        formState: { errors: registerErrors },
        reset: resetRegisterForm,
    } = useForm<RegisterFormData>();

    const loginMutation = useLoginUser();
    const registerMutation = useRegisterUser();

    const onLoginSubmit = handleLoginSubmit(async (data: LoginFormData) => {
        try {
            await loginMutation.mutateAsync(data);
            navigate('/home');
        } catch (error) {
            console.error('Login failed:', error);
        }
    });

    const onRegisterSubmit = handleRegisterSubmit(async (data: RegisterFormData) => {
        try {
            await registerMutation.mutateAsync(data);
            resetRegisterForm();
            setActiveTab('login');
            // TODO: Show success toast notification
        } catch (error) {
            console.error('Registration failed:', error);
        }
    });

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
    };

    return (
        <AuthView
            activeTab={activeTab}
            onTabChange={handleTabChange}
            loginRegister={loginRegister}
            loginErrors={loginErrors}
            onLoginSubmit={onLoginSubmit}
            loginLoading={loginMutation.isPending}
            loginError={loginMutation.error?.message}
            loginSuccess={location.state?.message}
            registerRegister={registerRegister}
            registerErrors={registerErrors}
            onRegisterSubmit={onRegisterSubmit}
            registerLoading={registerMutation.isPending}
            registerError={registerMutation.error?.message}
        />
    );
};
