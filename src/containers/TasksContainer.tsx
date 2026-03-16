import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TasksView } from '../components/Tasks/TasksView';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { openModal } from '@/features/ui/uiSlice';
import { useFetchTasksPaginated } from '@/api/queries/tasks.queries';
import { useToggleTaskStatus } from '@/api/mutations/tasks.mutations';
import { useFetchSettings } from '@/api/queries/settings.queries';
import {
    sortTasksByPriority,
    sortTasksByDueDate,
    filterTasksBySearch,
    filterTasksByStatus,
    formatTaskDate,
    isTaskOverdue,
} from '@/utils/taskHelpers';
import type { TaskFilterTab, TaskSortOption, Task } from '@/types';

/**
 * Tasks Container
 * Business logic container for the Tasks page with pagination support
 */
export const TasksContainer = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<TaskFilterTab>('all');
    const [sortOption, setSortOption] = useState<TaskSortOption>('recent');

    // Fetch tasks with pagination (10 per page)
    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useFetchTasksPaginated(10);

    const toggleStatusMutation = useToggleTaskStatus();

    // Fetch user settings for date format
    const { data: settings } = useFetchSettings();
    const dateFormat = settings?.dateFormat || 'MM_DD_YYYY';

    const userName = user?.firstName || 'User';

    // Flatten all pages into a single array of tasks
    const allTasks = useMemo(() => {
        if (!data?.pages) return [];
        // Combine all tasks from all pages into one array
        return data.pages.flatMap((page) => page.data);
    }, [data]);

    // Get pagination info from the last page
    const paginationInfo = useMemo(() => {
        if (!data?.pages || data.pages.length === 0) return null;
        return data.pages[data.pages.length - 1].pagination;
    }, [data]);

    // Filter, search, and sort tasks
    const processedTasks = useMemo(() => {
        let filtered = [...allTasks];

        // Apply status filter using utility function
        filtered = filterTasksByStatus(filtered, activeFilter);

        // Apply search using utility function
        filtered = filterTasksBySearch(filtered, searchQuery);

        // Apply sorting using utility functions
        if (sortOption === 'priority') {
            filtered = sortTasksByPriority(filtered);
        } else if (sortOption === 'dueDate') {
            filtered = sortTasksByDueDate(filtered);
        }
        // 'recent' keeps the original order (newest first from API)

        return filtered;
    }, [allTasks, activeFilter, searchQuery, sortOption]);

    // Map API tasks to UI format
    /**
     * The code iterates through each task in processedTasks and transforms it into a new shape suitable for the UI components. This transformation handles several important aspects of task display.
     */
    const mappedTasks = useMemo(
        () =>
            processedTasks.map((task) => {
                // Format due date
                let dueDate = '';
                let dueTime: string | undefined;
                if (task.dueDate) {
                    const date = new Date(task.dueDate);
                    const today = new Date();
                    const isToday =
                        date.getDate() === today.getDate() &&
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear();

                    if (isToday) {
                        dueDate = t('tasks.dueToday');
                        dueTime = date.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                        });
                    } else {
                        // Format date based on user's date format preference
                        const { dateString } = formatTaskDate(date, dateFormat);
                        dueDate = `${t('tasks.dueLabel')} ${dateString}`;
                    }
                }

                // Determine if task is overdue using utility function
                const taskIsOverdue = isTaskOverdue(task);

                return {
                    id: String(task.id),
                    title: task.taskName,
                    description: task.description || '',
                    label: taskIsOverdue ? 'OVERDUE' : undefined,
                    dueDate,
                    dueTime,
                    priority: task.priority,
                    progressStatus: task.status,
                };
            }),
        [processedTasks, dateFormat, t]
    );

    // Event handlers
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    const handleFilterChange = (filter: TaskFilterTab) => {
        setActiveFilter(filter);
    };

    const handleSortChange = (sort: TaskSortOption) => {
        setSortOption(sort);
    };

    const handleTaskToggle = async (id: string) => {
        try {
            await toggleStatusMutation.mutateAsync(Number(id));
        } catch (error) {
            console.error('Failed to toggle task status:', error);
        }
    };

    const handleTaskClick = (id: string) => {
        const task = allTasks.find((t) => t.id === Number(id));
        if (task) {
            dispatch(
                openModal({
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
                })
            );
        }
    };

    const handleEditTask = (id: string) => {
        const task = allTasks.find((t) => t.id === Number(id));
        if (task) {
            dispatch(
                openModal({
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
                })
            );
        }
    };

    const handleDeleteTask = (id: string) => {
        const task = allTasks.find((t) => t.id === Number(id));
        if (task) {
            // Open delete confirmation with task data (no functions in Redux!)
            dispatch(openModal({
                type: 'DELETE_CONFIRMATION',
                data: {
                    taskId: task.id,
                    itemName: task.taskName || 'this task',
                    itemType: 'task',
                },
            }));
        }
    };

    const handleCreateTask = () => {
        dispatch(openModal({ type: 'CREATE_TASK' }));
    };

    // Handle Load More button click
    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-text-secondary">Loading tasks...</div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-400">Failed to load tasks. Please try again.</div>
            </div>
        );
    }

    return (
        <TasksView
            userName={userName}
            tasks={mappedTasks}
            searchQuery={searchQuery}
            activeFilter={activeFilter}
            sortOption={sortOption}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onTaskToggle={handleTaskToggle}
            onTaskClick={handleTaskClick}
            onCreateTask={handleCreateTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            // Pagination props
            hasNextPage={hasNextPage || false}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={handleLoadMore}
            totalTasks={paginationInfo?.total}
            currentlyShowing={allTasks.length}
        />
    );
};
