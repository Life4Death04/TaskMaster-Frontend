import { useState } from 'react';
import { CalendarView } from '@/components/Calendar/CalendarView';
import { useAppDispatch } from '@/hooks/redux';
import { openModal } from '@/features/ui/uiSlice';

type ViewMode = 'month' | 'week' | 'day';

interface TaskEvent {
    id: string;
    title: string;
    color: string;
    date: string;
}

/**
 * Calendar Container
 * Business logic for the Calendar page
 */
export const CalendarContainer = () => {
    const dispatch = useAppDispatch();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('month');

    // Mock data - will be replaced with Redux state/API call later
    const mockTasks: TaskEvent[] = [
        { id: '1', title: 'Q4 Strategic Planning', color: 'bg-red-500/80 text-white', date: '2026-01-02' },
        { id: '2', title: 'Survey Redesign', color: 'bg-amber-500/80 text-white', date: '2026-10-02' },
        { id: '3', title: 'Clean-Backup', color: 'bg-cyan-500/80 text-white', date: '2026-10-04' },
        { id: '4', title: 'Client Kickoff Meeting', color: 'bg-purple-500/80 text-white', date: '2026-10-05' },
        { id: '5', title: 'Contract Review', color: 'bg-gray-500/80 text-white', date: '2026-10-05' },
        { id: '6', title: 'Send Assets', color: 'bg-amber-600/80 text-white', date: '2026-10-05' },
        { id: '7', title: 'User Interview #1', color: 'bg-yellow-500/80 text-white', date: '2026-10-09' },
        { id: '8', title: 'User Interview #2', color: 'bg-yellow-500/80 text-white', date: '2026-10-11' },
        { id: '9', title: 'Project Launch 🚀', color: 'bg-pink-500/80 text-white', date: '2026-10-12' },
        { id: '10', title: 'Sync with Team', color: 'bg-teal-500/80 text-white', date: '2026-10-16' },
        { id: '11', title: 'Client Review', color: 'bg-red-400/80 text-white', date: '2026-10-20' },
    ];

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
        const task = mockTasks.find(t => t.id === taskId);
        if (task) {
            // TODO: Open task details modal with actual task data
            console.log('Task clicked:', taskId);
            dispatch(openModal({
                type: 'TASK_DETAILS',
                data: {
                    id: task.id,
                    title: task.title,
                    description: 'Task description will be loaded from API',
                    status: 'TODO',
                    priority: 'MEDIUM',
                    dueDate: task.date,
                    listName: 'General',
                },
            }));
        }
    };

    const handleAddTask = () => {
        dispatch(openModal({ type: 'CREATE_TASK' }));
    };

    return (
        <CalendarView
            userName="User"
            currentMonth={currentMonth}
            currentMonthNumber={currentMonthNumber}
            currentYear={currentYear}
            viewMode={viewMode}
            tasks={mockTasks}
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
