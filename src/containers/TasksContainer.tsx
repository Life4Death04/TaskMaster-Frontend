import { useState } from 'react';
import { TasksView } from '../components/Tasks/TasksView';

type FilterTab = 'all' | 'todo' | 'in_progress' | 'done';
type SortOption = 'recent' | 'dueDate' | 'priority';

/**
 * Tasks Container
 * Business logic container for the Tasks page
 */
export const TasksContainer = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
    const [sortOption, setSortOption] = useState<SortOption>('recent');

    // Mock data - will be replaced with Redux state later
    const userName = 'John';

    const allTasks = [
        {
            id: '1',
            title: 'Finalize Q3 Financial Report',
            description: 'Add missing expense data from Marketing department',
            label: 'OVERDUE',
            dueDate: 'Due: Oct 12, 2023',
            priority: 'high' as const,
            progressStatus: 'IN_PROGRESS' as const,
        },
        {
            id: '2',
            title: 'Review App Redesign Mockups',
            description: 'Check mobile responsiveness on new dashboard',
            label: 'IN DEV',
            dueDate: 'Due: Today, 5:00 PM',
            dueTime: '5:00 PM',
            priority: 'medium' as const,
            progressStatus: 'IN_PROGRESS' as const,
        },
        {
            id: '3',
            title: 'Update Software Licenses',
            description: 'Renew Figma and Adobe CC subscriptions',
            dueDate: 'Due: Oct 28, 2023',
            priority: 'low' as const,
            progressStatus: 'TODO' as const,
        },
        {
            id: '4',
            title: 'Brainstorm Q4 Marketing Campaign',
            description: 'Initial ideation session with the creative team',
            label: 'MARKETING',
            dueDate: 'Due: Nov 05, 2023',
            priority: 'medium' as const,
            progressStatus: 'TODO' as const,
        },
        {
            id: '5',
            title: 'Design Homepage UI',
            description: 'Create mockups for new homepage layout',
            label: 'IN DEV',
            dueDate: 'Due: Oct 24, 2023',
            dueTime: '11:00 AM',
            priority: 'high' as const,
            progressStatus: 'IN_PROGRESS' as const,
        },
        {
            id: '6',
            title: 'Client Presentation',
            description: 'Marketing Strategy Review with stakeholders',
            label: 'OVERDUE',
            dueDate: 'Due: Oct 10, 2023',
            priority: 'high' as const,
            progressStatus: 'TODO' as const,
        },
        {
            id: '7',
            title: 'Team Sync Meeting',
            description: 'Weekly progress update with development team',
            dueDate: 'Due: Oct 25, 2023',
            dueTime: '10:00 AM',
            priority: 'medium' as const,
            progressStatus: 'DONE' as const,
        },
        {
            id: '8',
            title: 'Code Review - Auth Module',
            description: 'Review pull request for authentication updates',
            label: 'IN DEV',
            dueDate: 'Due: Oct 23, 2023',
            priority: 'medium' as const,
            progressStatus: 'DONE' as const,
        },
    ];

    // Filter and sort tasks
    const getProcessedTasks = () => {
        let filtered = allTasks;

        // Apply filter
        if (activeFilter === 'todo') {
            filtered = filtered.filter((task) => task.progressStatus === 'TODO');
        } else if (activeFilter === 'in_progress') {
            filtered = filtered.filter((task) => task.progressStatus === 'IN_PROGRESS');
        } else if (activeFilter === 'done') {
            filtered = filtered.filter((task) => task.progressStatus === 'DONE');
        }
        // 'all' filter shows everything, no filtering needed

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (task) =>
                    task.title.toLowerCase().includes(query) ||
                    task.description.toLowerCase().includes(query) ||
                    task.label?.toLowerCase().includes(query)
            );
        }

        // Apply sorting
        const sorted = [...filtered];
        if (sortOption === 'priority') {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        } else if (sortOption === 'dueDate') {
            // Simple alphabetical sort for demo (in real app, would parse dates)
            sorted.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
        }
        // 'recent' keeps the original order

        return sorted;
    };

    const processedTasks = getProcessedTasks();

    // Event handlers
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    const handleFilterChange = (filter: FilterTab) => {
        setActiveFilter(filter);
    };

    const handleSortChange = (sort: SortOption) => {
        setSortOption(sort);
    };

    const handleTaskToggle = (id: string) => {
        // TODO: Toggle task completion status
        console.log('Toggle task:', id);
    };

    const handleTaskMenuClick = (id: string) => {
        // TODO: Open task menu
        console.log('Task menu clicked:', id);
    };

    const handleCreateTask = () => {
        // TODO: Open create task modal
        console.log('Create new task');
    };

    return (
        <TasksView
            userName={userName}
            tasks={processedTasks}
            searchQuery={searchQuery}
            activeFilter={activeFilter}
            sortOption={sortOption}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onTaskToggle={handleTaskToggle}
            onTaskMenuClick={handleTaskMenuClick}
            onCreateTask={handleCreateTask}
        />
    );
};
