import { useState } from 'react';
import { DashboardView } from '@/components/Dashboard/DashboardView';

/**
 * Dashboard Container Component
 * Handles all business logic for the dashboard
 */
export const DashboardContainer = () => {
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data - replace with actual data from Redux/API
    const userName = 'Jane';

    const stats = {
        totalTasks: 24,
        completedToday: 8,
        overdue: 3,
    };

    const recentTasks = [
        {
            id: '1',
            title: 'Finalize Q3 Financial Report',
            description: 'Add missing expense data from Marketing department',
            status: 'overdue' as const,
            dueDate: 'Yesterday',
            priority: 'high' as const,
        },
        {
            id: '2',
            title: 'Review App Redesign Mockups',
            description: 'Check mobile responsiveness on new d...',
            status: 'normal' as const,
            dueDate: 'Today',
            dueTime: '2:00 PM',
            priority: 'medium' as const,
        },
        {
            id: '3',
            title: 'Update Software Licenses',
            description: 'Renew Figma and Adobe CC subscriptions',
            status: 'normal' as const,
            dueDate: 'Tomorrow',
            priority: 'low' as const,
        },
    ];

    const upcomingTasks = [
        {
            id: '1',
            date: '24',
            month: 'MAR',
            title: 'Client Presentation',
            description: 'Marketing Strategy Review',
            priority: 'high' as const,
        },
        {
            id: '2',
            date: '25',
            month: 'OCT',
            title: 'Team Sync',
            description: 'Weekly progress update',
            time: '10 AM',
        },
        {
            id: '3',
            date: '28',
            month: 'OCT',
            title: 'Project Launch',
            description: 'Go-live for Mobile App',
        },
    ];

    // Event handlers
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        // TODO: Implement search logic
    };

    const handleNotificationClick = () => {
        // TODO: Open notifications panel
        console.log('Notifications clicked');
    };

    const handleTaskToggle = (id: string) => {
        // TODO: Toggle task completion
        console.log('Toggle task:', id);
    };

    const handleTaskMenuClick = (id: string) => {
        // TODO: Open task menu
        console.log('Task menu clicked:', id);
    };

    const handleViewAllTasks = () => {
        // TODO: Navigate to tasks page
        console.log('View all tasks');
    };

    const handleAddReminder = () => {
        // TODO: Open reminder creation modal
        console.log('Add reminder');
    };

    return (
        <DashboardView
            userName={userName}
            stats={stats}
            recentTasks={recentTasks}
            activeTasksCount={12}
            upcomingTasks={upcomingTasks}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onNotificationClick={handleNotificationClick}
            onTaskToggle={handleTaskToggle}
            onTaskMenuClick={handleTaskMenuClick}
            onViewAllTasks={handleViewAllTasks}
            onAddReminder={handleAddReminder}
        />
    );
};
