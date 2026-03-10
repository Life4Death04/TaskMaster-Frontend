import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarView } from '@/components/Calendar/CalendarView';
import { useAppDispatch } from '@/hooks/redux';
import { openModal } from '@/features/ui/uiSlice';
import { useFetchTasks } from '@/api/queries/tasks.queries';
import { getPriorityColor } from '@/utils/taskHelpers';
import type { Task } from '@/types';

/**
 * Calendar Container
 * Business logic for the Calendar page
 */
export const CalendarContainer = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [currentDate, setCurrentDate] = useState(new Date());

    // Fetch tasks from API
    const { data: tasks = [], isLoading, error } = useFetchTasks();

    // Map tasks to calendar events format
    const calendarTasks = useMemo(() => {
        return tasks
            .filter((task: Task) => task.dueDate)
            .map((task: Task) => ({
                id: String(task.id),
                title: task.taskName,
                color: getPriorityColor(task.priority),
                date: task.dueDate!,
            }));
    }, [tasks]);

    // Get calendar data
    const monthNames = [
        t('calendar.months.january'),
        t('calendar.months.february'),
        t('calendar.months.march'),
        t('calendar.months.april'),
        t('calendar.months.may'),
        t('calendar.months.june'),
        t('calendar.months.july'),
        t('calendar.months.august'),
        t('calendar.months.september'),
        t('calendar.months.october'),
        t('calendar.months.november'),
        t('calendar.months.december')
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

    // Generate calendar grid
    const generateCalendarDays = () => {
        const days = [];
        const totalCells = 35; // 5 weeks

        // Previous month empty cells
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({ day: null, isCurrentMonth: false });
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({ day, isCurrentMonth: true });
        }

        // Fill remaining cells
        const remainingCells = totalCells - days.length;
        for (let i = 0; i < remainingCells; i++) {
            days.push({ day: null, isCurrentMonth: false });
        }

        return days;
    };

    const calendarDays = generateCalendarDays();

    // Get tasks for a specific day
    const getTasksForDay = (day: number | null) => {
        if (!day) return [];
        const dateStr = `${currentYear}-${String(currentMonthNumber).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return calendarTasks.filter(task => task.date.startsWith(dateStr));
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
            currentMonth={currentMonth}
            currentYear={currentYear}
            calendarDays={calendarDays}
            getTasksForDay={getTasksForDay}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTask}
        />
    );
};
