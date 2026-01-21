import { PageHeader } from '../common/PageHeader';
import { ActionButton } from '../common/ActionButton';

interface TaskEvent {
    id: string;
    title: string;
    color: string;
    date: string;
}

interface CalendarViewProps {
    userName: string;
    currentMonth: string;
    currentMonthNumber: number;
    currentYear: number;
    tasks: TaskEvent[];
    daysInMonth: number;
    firstDayOfMonth: number;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    onTaskClick?: (taskId: string) => void;
    onAddTask: () => void;
}

/**
 * Calendar View Component
 * Presentational component for the calendar page layout
 */
export const CalendarView = ({
    userName,
    currentMonth,
    currentMonthNumber,
    currentYear,
    tasks,
    daysInMonth,
    firstDayOfMonth,
    onPreviousMonth,
    onNextMonth,
    onTaskClick,
    onAddTask,
}: CalendarViewProps) => {
    const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

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
        return tasks.filter(task => task.date.startsWith(dateStr));
    };

    return (
        <div className="min-h-screen bg-background-primary p-6">
            {/* Page Header */}
            <PageHeader
                title="Calendar"
                subtitle="View and manage your task schedule"
                userName={userName}
                showSearch={false}
                searchQuery="Sexo"
                onSearchChange={() => { }}
            />

            {/* Calendar Header Controls */}
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                {/* Month Navigation */}
                <div className="flex items-center sm:gap-4 bg-card-primary shadow-md border border-border-default rounded-lg p-2">
                    <button
                        onClick={onPreviousMonth}
                        className="p-2 hover:bg-background-primary-hover rounded-lg transition-colors text-text-primary hover:cursor-pointer"
                        aria-label="Previous month"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <h2 className="text-md md:text-xl font-semibold text-text-primary min-w-[110px] lg:min-w-[140px] text-center">
                        {currentMonth} {currentYear}
                    </h2>

                    <button
                        onClick={onNextMonth}
                        className="p-2 hover:bg-background-primary-hover rounded-lg transition-colors text-text-primary hover:cursor-pointer"
                        aria-label="Next month"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div className='flex flex-wrap gap-4'>
                    {/* Create Task Button */}
                    <ActionButton
                        onClick={onAddTask}
                        label="Create Task"
                        icon={
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        }
                        variant="gradient"
                    />
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-card-primary border border-border-default rounded-2xl shadow-lg overflow-hidden">
                {/* Week Days Header */}
                <div className="grid grid-cols-7 border-b border-border-default">
                    {weekDays.map((day) => (
                        <div
                            key={day}
                            className="p-4 text-xs font-semibold text-text-secondary flex justify-center tracking-wider"
                        >
                            {/* Show first letter only on small screens, full abbreviation on medium+ */}
                            <span className="md:hidden">{day.charAt(0)}</span>
                            <span className="hidden md:inline">{day}</span>
                        </div>
                    ))}
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 auto-rows-[140px]">
                    {calendarDays.map((dayInfo, index) => {
                        const dayTasks = dayInfo.day ? getTasksForDay(dayInfo.day) : [];

                        return (
                            <div
                                key={index}
                                className={`border-r border-b border-border-default p-2 ${!dayInfo.isCurrentMonth ? 'bg-background-secondary/50' : ''
                                    } hover:bg-background-primary-hover transition-colors`}
                            >
                                {dayInfo.day && (
                                    <>
                                        <div className="text-sm font-medium text-text-primary mb-2">
                                            {dayInfo.day}
                                        </div>
                                        <div className="space-y-1 overflow-y-auto max-h-[100px]">
                                            {dayTasks.map((task) => (
                                                <button
                                                    key={task.id}
                                                    onClick={() => onTaskClick?.(task.id)}
                                                    className={`w-full text-left rounded transition-opacity hover:cursor-pointer hover:opacity-80 ${task.color}`}
                                                >
                                                    {/* Small screens: just a colored dot */}
                                                    <div className="sm:hidden w-2 h-2 rounded-full" />
                                                    {/* Medium+ screens: full task pill with title */}
                                                    <div className="hidden sm:block px-2 py-1 text-xs font-medium truncate">
                                                        {task.title}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
