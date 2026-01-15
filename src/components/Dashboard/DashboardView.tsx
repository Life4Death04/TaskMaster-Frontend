import { StatsCard } from './StatsCard';
import { TaskItem } from './TaskItem';
import { UpcomingDueDateItem } from './UpcomingDueDateItem';
import { PageHeader } from '../common/PageHeader';

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'overdue' | 'normal' | 'completed';
    dueDate: string;
    dueTime?: string;
    priority: 'high' | 'medium' | 'low';
}

interface UpcomingTask {
    id: string;
    date: string;
    month: string;
    title: string;
    description: string;
    time?: string;
    priority?: 'high' | 'medium' | 'low';
}

interface DashboardStats {
    totalTasks: number;
    completedToday: number;
    overdue: number;
}

interface DashboardViewProps {
    userName: string;
    stats: DashboardStats;
    recentTasks: Task[];
    activeTasksCount: number;
    upcomingTasks: UpcomingTask[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onTaskToggle: (id: string) => void;
    onTaskClick?: (id: string) => void;
    onViewAllTasks: () => void;
    onAddReminder: () => void;
    onEditTask?: (id: string) => void;
    onArchiveTask?: (id: string) => void;
    onDeleteTask?: (id: string) => void;
}

/**
 * Dashboard View Component
 * Pure presentational component for the dashboard layout
 */
export const DashboardView = ({
    userName,
    stats,
    recentTasks,
    activeTasksCount,
    upcomingTasks,
    searchQuery,
    onSearchChange,
    onTaskToggle,
    onTaskClick,
    onViewAllTasks,
    onAddReminder,
    onEditTask,
    onArchiveTask,
    onDeleteTask,
}: DashboardViewProps) => {
    return (
        <div className="min-h-screen bg-background-primary p-6">
            {/* Dashboard Header */}
            <PageHeader
                title="Dashboard"
                subtitle="Welcome back, {userName}. Here's your daily overview."
                userName={userName}
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                showSearch={true}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="TOTAL TASKS"
                    value={stats.totalTasks}
                    icon={
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                        </svg>
                    }
                />

                <StatsCard
                    title="COMPLETED TODAY"
                    value={stats.completedToday}
                    icon={
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    }
                />

                <StatsCard
                    title="OVERDUE"
                    value={stats.overdue}
                    icon={
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                        </svg>
                    }
                />

            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Tasks Section */}
                <div className="lg:col-span-2">
                    <div className="bg-card-dark rounded-xl">
                        <div className="flex items-center justify-between py-6">
                            <div className="flex items-center gap-3">
                                <h2 className="text-text-primary text-xl font-bold">Recent Tasks</h2>
                                <span className="px-2 py-1 text-xs font-semibold bg-primary/20 text-primary rounded">
                                    {activeTasksCount} Active
                                </span>
                            </div>
                            <button onClick={onViewAllTasks} className="text-primary hover:text-primary-hover text-sm font-medium transition-colors hover:cursor-pointer">
                                View All
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {recentTasks.map((task) => (
                                <TaskItem
                                    key={task.id}
                                    {...task}
                                    onToggleComplete={onTaskToggle}
                                    onClick={onTaskClick}
                                    onEdit={onEditTask}
                                    onArchive={onArchiveTask}
                                    onDelete={onDeleteTask}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Upcoming Due Dates Section */}
                <div className="lg:col-span-1">
                    <div>
                        <div className="flex items-center justify-between py-6">
                            <h2 className="text-text-primary text-xl font-bold">Upcoming Due Dates</h2>
                            <button className="px-2 hover:bg-background-primary-hover rounded-lg transition-colors text-text-secondary hover:text-text-primary hover:cursor-pointer" aria-label="Calendar">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2} />
                                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} strokeLinecap="round" />
                                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} strokeLinecap="round" />
                                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} />
                                </svg>
                            </button>
                        </div>

                        <div className="bg-card-primary border border-border-default rounded-lg p-4 shadow-md">
                            <div className="divide-y divide-border-default">
                                {upcomingTasks.map((task) => (
                                    <UpcomingDueDateItem key={task.id} {...task} />
                                ))}
                            </div>

                            <button onClick={onAddReminder} className="w-full p-2 my-2 flex items-center justify-center gap-2 text-text-secondary hover:text-text-primary hover:bg-background-primary-hover transition-colors border border-dashed border-border-default rounded-lg hover:cursor-pointer">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                                    <line x1="12" y1="8" x2="12" y2="16" strokeWidth={2} strokeLinecap="round" />
                                    <line x1="8" y1="12" x2="16" y2="12" strokeWidth={2} strokeLinecap="round" />
                                </svg>
                                Add Reminder
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
