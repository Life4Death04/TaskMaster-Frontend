import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListsView } from '../components/Lists/ListsView';
import { useAppDispatch } from '@/hooks/redux';
import { openModal } from '@/features/ui/uiSlice';

type FilterTab = 'all' | 'todo' | 'in_progress' | 'done';

/**
 * Lists Container
 * Business logic container for the Lists page
 */
export const ListsContainer = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

    // Mock data - will be replaced with Redux state later
    const userName = 'John';

    const allLists = [
        {
            id: '1',
            title: 'Marketing Campaign',
            description: 'Plan and execute Q4 marketing initiatives',
            color: 'bg-blue-500',
            icon: '📱',
            taskCount: 12,
            status: 'DUE SOON',
            progressStatus: 'IN_PROGRESS' as const,
        },
        {
            id: '2',
            title: 'Personal Goals',
            description: 'Track personal development and fitness',
            color: 'bg-purple-500',
            icon: '🎯',
            taskCount: 8,
            status: 'ONGOING',
            progressStatus: 'IN_PROGRESS' as const,
        },
        {
            id: '3',
            title: 'Home Renovation',
            description: 'Kitchen and bathroom upgrades',
            color: 'bg-orange-500',
            icon: '🏠',
            taskCount: 15,
            status: 'PLANNING',
            progressStatus: 'TODO' as const,
        },
        {
            id: '4',
            title: 'Product Launch',
            description: 'Coordinate mobile app release',
            color: 'bg-green-500',
            icon: '🚀',
            taskCount: 24,
            status: 'WEEKLY',
            progressStatus: 'IN_PROGRESS' as const,
        },
        {
            id: '5',
            title: 'Health & Wellness',
            description: 'Exercise routines and meal planning',
            color: 'bg-pink-500',
            icon: '💪',
            taskCount: 5,
            status: 'HEALTH',
            progressStatus: 'TODO' as const,
        },
        {
            id: '6',
            title: 'Team Onboarding',
            description: 'New employee training and resources',
            color: 'bg-cyan-500',
            icon: '👥',
            taskCount: 10,
            status: 'ONGOING',
            progressStatus: 'IN_PROGRESS' as const,
        },
        {
            id: '7',
            title: 'Budget Planning',
            description: 'Financial goals and expense tracking',
            color: 'bg-yellow-500',
            icon: '💰',
            taskCount: 6,
            status: 'PLANNING',
            progressStatus: 'TODO' as const,
        },
        {
            id: '8',
            title: 'Client Projects',
            description: 'Ongoing client deliverables',
            color: 'bg-red-500',
            icon: '📊',
            taskCount: 18,
            status: 'DUE SOON',
            progressStatus: 'DONE' as const,
        },
        {
            id: '9',
            title: 'Old Project Archive',
            description: 'Completed projects from last quarter',
            color: 'bg-gray-500',
            icon: '📦',
            taskCount: 42,
            progressStatus: 'DONE' as const,
        },
    ];

    // Filter lists based on active filter
    const getFilteredLists = () => {
        let filtered = allLists;

        // Apply filter
        if (activeFilter === 'todo') {
            filtered = filtered.filter((list) => list.progressStatus === 'TODO');
        } else if (activeFilter === 'in_progress') {
            filtered = filtered.filter((list) => list.progressStatus === 'IN_PROGRESS');
        } else if (activeFilter === 'done') {
            filtered = filtered.filter((list) => list.progressStatus === 'DONE');
        }
        // 'all' filter shows everything, no filtering needed

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (list) =>
                    list.title.toLowerCase().includes(query) ||
                    list.description.toLowerCase().includes(query)
            );
        }

        return filtered;
    };

    const filteredLists = getFilteredLists();

    // Event handlers
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    const handleFilterChange = (filter: FilterTab) => {
        setActiveFilter(filter);
    };

    const handleListClick = (id: string) => {
        navigate(`/lists/${id}`);
    };

    const handleCreateList = () => {
        dispatch(openModal({ type: 'CREATE_LIST' }));
    };

    return (
        <ListsView
            userName={userName}
            lists={filteredLists}
            searchQuery={searchQuery}
            activeFilter={activeFilter}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onListClick={handleListClick}
            onCreateList={handleCreateList}
        />
    );
};
