import { useState, useMemo } from 'react';
import { CalendarView } from '@/components/Calendar/CalendarView';
import { useAppDispatch } from '@/hooks/redux';
import { openModal } from '@/features/ui/uiSlice';
import { useFetchTasks } from '@/api/queries/tasks.queries';
import type { Task } from '@/types';

type ViewMode = 'month' | 'week' | 'day';

/**
 * Get priority-based color styling for calendar events
 */
const getPriorityColors = (priority: string): string => {
    switch (priority.toUpperCase()) {
        case 'HIGH':
            return 'bg-red-500/80 text-white';
        case 'MEDIUM':
            return 'bg-amber-500/80 text-white';
        case 'LOW':
            return 'bg-green-500/80 text-white';
        default:
            return 'bg-gray-500/80 text-white';
    }
};

/**
 * Calendar Container
 * Business logic for the Calendar page
 */
export const CalendarContainer = () => {
    const dispatch = useAppDispatch();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('month');

    // Fetch tasks from API
    const { data: tasks = [], isLoading, error } = useFetchTasks();

    // Map tasks to calendar events format
    const calendarTasks = useMemo(() => {
        return tasks
            .filter((task: Task) => task.dueDate && !task.archived)
            .map((task: Task) => ({
                id: String(task.id),
                title: task.taskName,
                color: getPriorityColors(task.priority),
                date: task.dueDate!,
            }));
    }, [tasks]);

    // Get calendar data
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentMonth = monthNames[currentDate.getMonth()];
    const currentMonthNumber = currentDate.getMonth() + 1; // 1-12
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1).getDay();

    // Event handlers
    const handlePreviousMonth = () => {
        setCurrentDate(new Date(currentYear, currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentDate.getMonth() + 1, 1));
    };

    const handleViewModeChange = (mode: ViewMode) => {
        setViewMode(mode);
        // TODO: Implement week and day views
        if (mode !== 'month') {
            console.log(`${mode} view not implemented yet`);
        }
    };

    const handleTaskClick = (taskId: string) => {
        const task = tasks.find((t: Task) => String(t.id) === taskId);
        if (task) {
            dispatch(openModal({
                type: 'TASK_DETAILS',
                data: task,
            }));
        }
    };

    const handleAddTask = () => {
        dispatch(openModal({ type: 'CREATE_TASK' }));
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-text-secondary">Loading calendar...</div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-red-500">Failed to load tasks</div>
            </div>
        );
    }

    return (
        <CalendarView
            userName="User"
            currentMonth={currentMonth}
            currentMonthNumber={currentMonthNumber}
            currentYear={currentYear}
            viewMode={viewMode}
            tasks={calendarTasks}
            daysInMonth={daysInMonth}
            firstDayOfMonth={firstDayOfMonth}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onViewModeChange={handleViewModeChange}
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTask}
        />
    );
};
