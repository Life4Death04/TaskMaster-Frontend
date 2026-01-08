import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar/Sidebar';

/**
 * Container component for Sidebar
 * Handles all business logic including responsive behavior and state management
 */
export const SidebarContainer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

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
        />
    );
};
