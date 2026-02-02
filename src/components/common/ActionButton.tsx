import { type ReactNode } from 'react';

interface ActionButtonProps {
    onClick: () => void;
    label: string;
    icon?: ReactNode;
    variant?: 'primary' | 'secondary' | 'gradient';
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Action Button Component
 * Reusable button for primary actions like Create, Add, etc.
 */
export const ActionButton = ({
    onClick,
    label,
    icon,
    variant = 'gradient',
    size = 'md',
}: ActionButtonProps) => {
    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-2.5 text-base',
        lg: 'px-8 py-3 text-lg',
    };

    const variantClasses = {
        primary: 'bg-primary hover:bg-primary-hover',
        secondary: 'bg-secondary hover:bg-secondary-hover',
        gradient: 'bg-gradient-blueToPurple hover:bg-primary-hover',
    };

    return (
        <button
            onClick={onClick}
            className={`${sizeClasses[size]} ${variantClasses[variant]} text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md hover:shadow-lg hover:cursor-pointer`}
        >
            {icon && icon}
            {label}
        </button>
    );
};
