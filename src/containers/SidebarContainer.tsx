import { useState, useEffect, useMemo } from 'react';
import { Sidebar, type NavigationItem, type ListItem } from '@/components/Sidebar/Sidebar';
import { logout } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/hooks/redux';
import { useNavigate } from 'react-router-dom';
import { useFetchLists } from '@/api/queries/lists.queries';

/**
 * Container component for Sidebar
 * Handles all business logic including responsive behavior and state management
 */
export const SidebarContainer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Fetch lists from API
    const { data: allLists = [] } = useFetchLists();

    // Filter only favorite lists for sidebar
    const listItems: ListItem[] = useMemo(() => {
        return allLists
            .filter(list => list.isFavorite)
            .map(list => ({
                id: String(list.id),
                name: list.title,
                color: list.color,
            }));
    }, [allLists]);

    // Navigation items configuration
    const navigationItems: NavigationItem[] = [
        {
            path: '/home',
            label: 'Dashboard',
            icon: (
                <span className="material-symbols-outlined fill-1" style={{ fontSize: '20px' }}>
                    dashboard
                </span>
            ),
        },
        {
            path: '/tasks',
            label: 'My Tasks',
            icon: (
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    task_alt
                </span>
            ),
        },
        {
            path: '/lists',
            label: 'My Lists',
            icon: (
                <span className="material-symbols-outlined text-[20px] fill-1">
                    view_list
                </span>
            ),
        },
        {
            path: '/calendar',
            label: 'Calendar',
            icon: (
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    calendar_month
                </span>
            ),
        }
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

    const handleLogout = () => {
        dispatch(logout());
        navigate('/auth');
    }

    return (
        <Sidebar
            isOpen={isOpen}
            isMobile={isMobile}
            onToggle={handleToggle}
            onClose={handleClose}
            navigationItems={navigationItems}
            listItems={listItems}
            onLogout={handleLogout}
        />
    );
};
