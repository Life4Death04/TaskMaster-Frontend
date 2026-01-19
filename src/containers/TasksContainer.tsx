import { useState, useMemo } from 'react';
import { TasksView } from '../components/Tasks/TasksView';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { openModal } from '@/features/ui/uiSlice';
import { useFetchTasks } from '@/api/queries/tasks.queries';
import { useDeleteTask, useToggleTaskStatus } from '@/api/mutations/tasks.mutations';

type FilterTab = 'all' | 'todo' | 'in_progress' | 'done';
type SortOption = 'recent' | 'dueDate' | 'priority';

/**
 * Tasks Container
 * Business logic container for the Tasks page
 */
export const TasksContainer = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
    const [sortOption, setSortOption] = useState<SortOption>('recent');

    // Fetch tasks from API
    const { data: tasks = [], isLoading, error } = useFetchTasks();
    const deleteTaskMutation = useDeleteTask();
    const toggleStatusMutation = useToggleTaskStatus();

    const userName = user?.firstName || 'User';

    // Filter, search, and sort tasks
    const processedTasks = useMemo(() => {
        let filtered = [...tasks].filter((task) => !task.archived);

        // Apply status filter
        if (activeFilter === 'todo') {
            filtered = filtered.filter((task) => task.status === 'TODO');
        } else if (activeFilter === 'in_progress') {
            filtered = filtered.filter((task) => task.status === 'IN_PROGRESS');
        } else if (activeFilter === 'done') {
            filtered = filtered.filter((task) => task.status === 'DONE');
        }

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (task) =>
                    task.taskName.toLowerCase().includes(query) ||
                    task.description?.toLowerCase().includes(query)
            );
        }

        // Apply sorting
        if (sortOption === 'priority') {
            const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
            filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        } else if (sortOption === 'dueDate') {
            filtered.sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            });
        }
        // 'recent' keeps the original order (newest first from API)

        return filtered;
    }, [tasks, activeFilter, searchQuery, sortOption]);

    // Map API tasks to UI format
    /**
     * The code iterates through each task in processedTasks and transforms it into a new shape suitable for your UI components. This transformation handles several important aspects of task display.
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
                        dueDate = `Due: Today`;
                        dueTime = date.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                        });
                    } else {
                        dueDate = `Due: ${date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}`;
                    }
                }

                // Determine if task is overdue
                const isOverdue =
                    task.dueDate &&
                    task.status !== 'DONE' &&
                    new Date(task.dueDate) < new Date();

                return {
                    id: String(task.id),
                    title: task.taskName,
                    description: task.description || '',
                    label: isOverdue ? 'OVERDUE' : undefined,
                    dueDate,
                    dueTime,
                    priority: task.priority.toLowerCase() as 'low' | 'medium' | 'high',
                    progressStatus: task.status,
                };
            }),
        [processedTasks]
    );

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

    const handleTaskToggle = async (id: string) => {
        try {
            await toggleStatusMutation.mutateAsync(Number(id));
        } catch (error) {
            console.error('Failed to toggle task status:', error);
        }
    };

    const handleTaskClick = (id: string) => {
        const task = tasks.find((t) => t.id === Number(id));
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
        const task = tasks.find((t) => t.id === Number(id));
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

    const handleArchiveTask = (id: string) => {
        // TODO: Implement archive task
        console.log('Archive task:', id);
    };

    const handleDeleteTask = (id: string) => {
        const task = tasks.find((t) => t.id === Number(id));
        if (task) {
            dispatch(
                openModal({
                    type: 'DELETE_CONFIRMATION',
                    data: {
                        itemName: task.taskName,
                        itemType: 'task' as const,
                        onConfirm: async () => {
                            try {
                                await deleteTaskMutation.mutateAsync(task.id);
                            } catch (error) {
                                console.error('Failed to delete task:', error);
                            }
                        },
                    },
                })
            );
        }
    };

    const handleCreateTask = () => {
        dispatch(openModal({ type: 'CREATE_TASK' }));
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
            onArchiveTask={handleArchiveTask}
            onDeleteTask={handleDeleteTask}
        />
    );
};
