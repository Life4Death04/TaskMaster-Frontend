import { useState, useEffect } from 'react';
import { Sidebar, type NavigationItem, type ListItem } from '@/components/Sidebar/Sidebar';

/**
 * Container component for Sidebar
 * Handles all business logic including responsive behavior and state management
 */
export const SidebarContainer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Navigation items configuration
    const navigationItems: NavigationItem[] = [
        {
            path: '/home',
            label: 'Dashboard',
            icon: (
                <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
            ),
        },
        {
            path: '/tasks',
            label: 'My Tasks',
            icon: (
                <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                </svg>
            ),
        },
        {
            path: '/lists',
            label: 'My Lists',
            icon: (
                <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                </svg>
            ),
        }
    ];

    // Sample lists - in real app, this would come from API/Redux
    const listItems: ListItem[] = [
        { id: '1', name: 'Work Projects', color: '#3b82f6' },
        { id: '2', name: 'Personal', color: '#10b981' },
        { id: '3', name: 'Shopping', color: '#f59e0b' },
        { id: '4', name: 'Ideas', color: '#8b5cf6' },
    ];

    // Detect screen size and set mobile state
    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth < 1024; // lg breakpoint in Tailwind
            setIsMobile(mobile);

            // On mobile, start collapsed; on desktop, start expanded
            if (mobile) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
            }
        };

        // Check on mount
        checkScreenSize();

        // Add event listener for window resize
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const handleClose = () => {
        if (isMobile) {
            setIsOpen(false);
        }
    };

    return (
        <Sidebar
            isOpen={isOpen}
            isMobile={isMobile}
            onToggle={handleToggle}
            onClose={handleClose}
            navigationItems={navigationItems}
            listItems={listItems}
        />
    );
};
