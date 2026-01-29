import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardView } from '@/components/Dashboard/DashboardView';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { openModal } from '@/features/ui/uiSlice';
import { useFetchTasks } from '@/api/queries/tasks.queries';
import { useFetchLists } from '@/api/queries/lists.queries';
import { useToggleTaskStatus } from '@/api/mutations/tasks.mutations';

/**
 * Dashboard Container Component
 * Handles all business logic for the dashboard
 */
export const DashboardContainer = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch user from Redux
    const user = useAppSelector((state) => state.auth.user);
    const userName = user?.firstName || 'User';

    // Fetch tasks and lists from API
    const { data: allTasks = [] } = useFetchTasks();
    const { data: allLists = [] } = useFetchLists();
    const toggleTaskStatusMutation = useToggleTaskStatus();

    // Calculate statistics
    const stats = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const nonArchivedTasks = allTasks.filter(task => !task.archived);

        // Completed today (status is DONE and has no due date or due date is today or in the past)
        const completedToday = nonArchivedTasks.filter(task => {
            if (task.status !== 'DONE') return false;
            // For simplicity, count all completed tasks
            return true;
        }).length;

        // Overdue tasks (not done and due date is in the past)
        const overdue = nonArchivedTasks.filter(task => {
            if (task.status === 'DONE' || !task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            return dueDate < today;
        }).length;

        return {
            totalTasks: nonArchivedTasks.length,
            completedToday,
            overdue,
            totalLists: allLists.length,
        };
    }, [allTasks, allLists]);

    // Get recent tasks (last 5 non-archived tasks)
    const recentTasks = useMemo(() => {
        const nonArchivedTasks = allTasks.filter(task => !task.archived);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return nonArchivedTasks.slice(0, 5).map(task => {
            const dueDate = task.dueDate ? new Date(task.dueDate) : null;
            let dueDateText = t('tasks.noDueDate');
            let status: 'overdue' | 'normal' | 'completed' = 'normal';

            if (task.status === 'DONE') {
                status = 'completed';
            } else if (dueDate) {
                const diffTime = dueDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays < 0) {
                    dueDateText = diffDays === -1 ? t('tasks.yesterday') : t('tasks.daysAgo', { count: Math.abs(diffDays) });
                    status = 'overdue';
                } else if (diffDays === 0) {
                    dueDateText = t('tasks.today');
                } else if (diffDays === 1) {
                    dueDateText = t('tasks.tomorrow');
                } else {
                    dueDateText = t('tasks.inDays', { count: diffDays });
                }
            }

            return {
                id: String(task.id),
                title: task.taskName,
                description: task.description || t('tasks.noDescription'),
                status,
                dueDate: dueDateText,
                priority: task.priority.toLowerCase() as 'high' | 'medium' | 'low',
            };
        });
    }, [allTasks, t]);

    // Get upcoming tasks (next 5 tasks with due dates)
    const upcomingTasks = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return allTasks
            .filter(task => !task.archived && task.status !== 'DONE' && task.dueDate)
            .sort((a, b) => {
                const dateA = new Date(a.dueDate!).getTime();
                const dateB = new Date(b.dueDate!).getTime();
                return dateA - dateB;
            })
            .slice(0, 5)
            .map(task => {
                const dueDate = new Date(task.dueDate!);
                const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

                return {
                    id: String(task.id),
                    date: dueDate.getDate().toString(),
                    month: monthNames[dueDate.getMonth()],
                    title: task.taskName,
                    description: task.description || t('tasks.noDescription'),
                    priority: task.priority.toLowerCase() as 'high' | 'medium' | 'low',
                };
            });
    }, [allTasks]);

    // Active tasks count (non-archived, not completed)
    const activeTasksCount = useMemo(() => {
        return allTasks.filter(task => !task.archived && task.status !== 'DONE').length;
    }, [allTasks]);

    // Event handlers
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    const handleTaskToggle = async (id: string) => {
        try {
            await toggleTaskStatusMutation.mutateAsync(Number(id));
        } catch (error) {
            console.error('Failed to toggle task status:', error);
        }
    };

    const handleTaskClick = (id: string) => {
        const task = allTasks.find(t => String(t.id) === id);
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
        const task = allTasks.find(t => String(t.id) === id);
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

    const handleArchiveTask = (id: string) => {
        // TODO: Implement archive functionality
        console.log('Archive task:', id);
    };

    const handleDeleteTask = (id: string) => {
        const task = allTasks.find(t => String(t.id) === id);
        if (task) {
            dispatch(openModal({
                type: 'DELETE_CONFIRMATION',
                data: {
                    itemName: task.taskName,
                    itemType: 'task',
                    taskId: task.id,
                },
            }));
        }
    };

    const handleViewAllTasks = () => {
        navigate('/tasks');
    };

    const handleCalendarClick = () => {
        navigate('/calendar');
    };

    const handleAddReminder = () => {
        dispatch(openModal({ type: 'CREATE_TASK' }));
    };

    return (
        <DashboardView
            userName={userName}
            stats={stats}
            recentTasks={recentTasks}
            activeTasksCount={activeTasksCount}
            upcomingTasks={upcomingTasks}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onTaskToggle={handleTaskToggle}
            onTaskClick={handleTaskClick}
            onViewAllTasks={handleViewAllTasks}
            onCalendarClick={handleCalendarClick}
            onAddReminder={handleAddReminder}
            onEditTask={handleEditTask}
            onArchiveTask={handleArchiveTask}
            onDeleteTask={handleDeleteTask}
        />
    );
};
