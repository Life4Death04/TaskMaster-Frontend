import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListsView } from '../components/Lists/ListsView';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { openModal } from '@/features/ui/uiSlice';
import { useFetchLists } from '@/api/queries/lists.queries';

/**
 * Lists Container
 * Business logic container for the Lists page
 */
export const ListsContainer = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch user from Redux
    const user = useAppSelector((state) => state.auth.user);
    const userName = user?.firstName || 'User';

    // Fetch lists from API
    const { data: lists = [], isLoading } = useFetchLists();

    // Filter and search lists
    const filteredLists = useMemo(() => {
        let filtered = lists;

        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter((list) =>
                list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                list.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    }, [lists, searchQuery]);

    // Format lists for view
    const formattedLists = useMemo(() => {
        return filteredLists.map((list) => ({
            id: String(list.id),
            title: list.title,
            description: list.description || 'No description',
            color: list.color,
            taskCount: list.tasks?.length || 0,
            tasks: list.tasks || [],
        }));
    }, [filteredLists]);

    // Event handlers
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    const handleListClick = (id: string) => {
        navigate(`/lists/${id}`);
    };

    const handleCreateList = () => {
        dispatch(openModal({ type: 'CREATE_LIST' }));
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background-primary flex items-center justify-center">
                <div className="text-text-primary">Loading lists...</div>
            </div>
        );
    }

    return (
        <ListsView
            userName={userName}
            lists={formattedLists}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onListClick={handleListClick}
            onCreateList={handleCreateList}
        />
    );
};
