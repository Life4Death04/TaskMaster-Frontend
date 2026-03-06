import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ListDetailsView } from '@/components/Lists/ListDetailsView';
import { useAppDispatch } from '@/hooks/redux';
import { openModal } from '@/features/ui/uiSlice';
import { useGetListById } from '@/api/queries/lists.queries';
import { useFetchSettings } from '@/api/queries/settings.queries';
import { useToggleTaskStatus } from '@/api/mutations/tasks.mutations';
import { useToggleListFavorite } from '@/api/mutations/lists.mutations';
import {
    sortTasksByPriority,
    sortTasksByDueDate,
    filterTasksBySearch,
    filterTasksByStatus,
    formatTaskDate,
} from '@/utils/taskHelpers';
import type { ListTaskFilterTab, TaskSortOption } from '@/types';

/**
 * List Details Container
 * Business logic for the List Details page
 */
export const ListDetailsContainer = () => {
    const { listId } = useParams<{ listId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<ListTaskFilterTab>('all');
    const [sortOption, setSortOption] = useState<TaskSortOption>('recent');

    // Fetch list data from API
    const { data: listData, isLoading } = useGetListById(Number(listId));

    // Fetch user settings for date format
    const { data: settings } = useFetchSettings();
    const dateFormat = settings?.dateFormat || 'MM_DD_YYYY';

    // Toggle task status mutation
    const toggleTaskStatusMutation = useToggleTaskStatus();

    // Toggle list favorite mutation
    const toggleListFavoriteMutation = useToggleListFavorite();

    // Filter and search tasks
    const filteredTasks = useMemo(() => {
        if (!listData?.tasks) return [];

        let filtered = listData.tasks;

        // Apply status filter using utility function
        filtered = filterTasksByStatus(filtered, activeFilter);

        // Apply search filter using utility function
        filtered = filterTasksBySearch(filtered, searchQuery);

        // Apply sorting using utility functions
        if (sortOption === 'priority') {
            filtered = sortTasksByPriority(filtered);
        } else if (sortOption === 'dueDate') {
            filtered = sortTasksByDueDate(filtered);
        }
        // 'recent' keeps the original order (newest first from API)

        return filtered;
    }, [listData?.tasks, activeFilter, searchQuery, sortOption]);

    // Calculate statistics
    const totalTasks = listData?.tasks?.length || 0;
    const completedTasks = listData?.tasks?.filter(task => task.status === 'DONE').length || 0;

    // Event handlers
    const handleBack = () => {
        navigate('/lists');
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    const handleFilterChange = (filter: ListTaskFilterTab) => {
        setActiveFilter(filter);
    };

    const handleSortChange = (sort: TaskSortOption) => {
        setSortOption(sort);
    };

    const handleToggleFavorite = async () => {
        if (!listId) return;

        try {
            await toggleListFavoriteMutation.mutateAsync(Number(listId));
        } catch (error) {
            console.error('Failed to toggle favorite status:', error);
        }
    };

    const handleEditList = () => {
        if (listData) {
            dispatch(openModal({
                type: 'EDIT_LIST',
                data: {
                    id: listData.id,
                    title: listData.title,
                    description: listData.description,
                    color: listData.color,
                },
            }));
        }
    };

    const handleDeleteList = async () => {
        if (!listId) return;

        dispatch(openModal({
            type: 'DELETE_CONFIRMATION',
            data: {
                itemName: listData?.title || 'this list',
                itemType: 'list',
                listId: Number(listId),
            },
        }));
    };

    const handleCreateTask = () => {
        dispatch(openModal({
            type: 'CREATE_TASK',
            data: { defaultListId: Number(listId) },
        }));
    };

    const handleTaskToggle = async (id: string) => {
        try {
            await toggleTaskStatusMutation.mutateAsync(Number(id));
        } catch (error) {
            console.error('Failed to toggle task status:', error);
        }
    };

    const handleTaskClick = (id: string) => {
        const task = listData?.tasks?.find(t => String(t.id) === id);
        if (task) {
            dispatch(openModal({
                type: 'TASK_DETAILS',
                data: {
                    id: task.id,
                    taskName: task.taskName,
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    dueDate: task.dueDate,
                    listId: task.listId,
                },
            }));
        }
    };

    const handleEditTask = (id: string) => {
        const task = listData?.tasks?.find(t => String(t.id) === id);
        if (task) {
            dispatch(openModal({
                type: 'EDIT_TASK',
                data: {
                    id: task.id,
                    taskName: task.taskName,
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    dueDate: task.dueDate,
                    listId: task.listId,
                },
            }));
        }
    };


    const handleDeleteTask = (id: string) => {
        const task = listData?.tasks?.find(t => String(t.id) === id);
        if (task) {
            dispatch(openModal({
                type: 'DELETE_CONFIRMATION',
                data: {
                    itemName: task.taskName,
                    itemType: 'task',
                    taskId: Number(id),
                },
            }));
        }
    };

    // Format tasks for view
    const formattedTasks = useMemo(() => {
        return filteredTasks.map(task => {
            // Format due date based on user settings using utility function
            let formattedDueDate = '';
            if (task.dueDate) {
                const date = new Date(task.dueDate);
                const { dateString } = formatTaskDate(date, dateFormat);
                formattedDueDate = dateString;
            }

            return {
                id: String(task.id),
                title: task.taskName,
                description: task.description || '',
                label: task.priority,
                dueDate: formattedDueDate,
                priority: task.priority,
                progressStatus: task.status,
            };
        });
    }, [filteredTasks, dateFormat]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background-primary flex items-center justify-center">
                <div className="text-text-primary">Loading list...</div>
            </div>
        );
    }

    // Show error if list not found
    if (!listData) {
        return (
            <div className="min-h-screen bg-background-primary flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-text-primary text-xl font-bold mb-2">List not found</h2>
                    <button
                        onClick={handleBack}
                        className="text-primary hover:underline"
                    >
                        Go back to lists
                    </button>
                </div>
            </div>
        );
    }

    return (
        <ListDetailsView
            listName={listData.title}
            listDescription={listData.description || undefined}
            totalTasks={totalTasks}
            activeTasks={completedTasks}
            tasks={formattedTasks}
            activeFilter={activeFilter}
            searchQuery={searchQuery}
            sortOption={sortOption}
            isFavorite={listData.isFavorite}
            onBack={handleBack}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onToggleFavorite={handleToggleFavorite}
            onEditList={handleEditList}
            onDeleteList={handleDeleteList}
            onCreateTask={handleCreateTask}
            onTaskToggle={handleTaskToggle}
            onTaskClick={handleTaskClick}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
        />
    );
};
