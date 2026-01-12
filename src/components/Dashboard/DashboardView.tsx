import { StatsCard } from './StatsCard';
import { TaskItem } from './TaskItem';
import { UpcomingDueDateItem } from './UpcomingDueDateItem';

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'overdue' | 'normal' | 'completed';
    dueDate: string;
    dueTime?: string;
    priority: 'high' | 'medium' | 'low';
    assignees: string[];
}

interface UpcomingTask {
    id: string;
    date: string;
    month: string;
    title: string;
    description: string;
    time?: string;
    priority?: 'high' | 'medium' | 'low';
    assignee?: string;
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
    onNotificationClick: () => void;
    onTaskToggle: (id: string) => void;
    onTaskMenuClick: (id: string) => void;
    onViewAllTasks: () => void;
    onCreateTask: () => void;
    onCreateList: () => void;
    onAddReminder: () => void;
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
    onNotificationClick,
    onTaskToggle,
    onTaskMenuClick,
    onViewAllTasks,
    onCreateTask,
    onCreateList,
    onAddReminder,
}: DashboardViewProps) => {
    return (
        <div className="min-h-screen bg-background-dark p-6">
            {/* Dashboard Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between flex-wrap gap-4 ">
                    <div>
                        <h1 className="text-text-primary text-3xl font-bold mb-1">Dashboard</h1>
                        <p className="text-text-secondary text-sm">Welcome back, {userName}. Here's your daily overview.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="11" cy="11" r="8" strokeWidth={2} />
                                <path strokeLinecap="round" strokeWidth={2} d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-card-dark border border-border-dark rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary w-full"
                            />
                        </div>

                        {/* <button
              onClick={onNotificationClick}
              className="p-2 bg-card-dark border border-border-dark rounded-lg hover:bg-background-primary-hover transition-colors text-text-secondary hover:text-text-primary"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button> */}
                    </div>
                </div>
            </div>

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

                {/* <StatsCard title="QUICK ACTIONS" value="" variant="action">
                    <button onClick={onCreateTask} className="quick-action-button quick-action-task">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Task
                    </button>
                    <button onClick={onCreateList} className="quick-action-button quick-action-list">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        List
                    </button>
                </StatsCard> */}
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
                            <button onClick={onViewAllTasks} className="text-primary hover:text-primary-hover text-sm font-medium transition-colors">
                                View All
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            {recentTasks.map((task) => (
                                <TaskItem
                                    key={task.id}
                                    {...task}
                                    onToggleComplete={onTaskToggle}
                                    onMenuClick={onTaskMenuClick}
                                />
                            ))}
                        </div>

                        {/* <div className="p-4 text-center">
                            <p className="text-text-secondary text-sm">Drag and drop to prioritize tasks</p>
                        </div> */}
                    </div>
                </div>

                {/* Upcoming Due Dates Section */}
                <div className="lg:col-span-1">
                    <div className="bg-card-dark">
                        <div className="flex items-center justify-between py-6">
                            <h2 className="text-text-primary text-xl font-bold">Upcoming Due Dates</h2>
                            <button className="px-2 hover:bg-background-primary-hover rounded-lg transition-colors text-text-secondary hover:text-text-primary" aria-label="Calendar">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2} />
                                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} strokeLinecap="round" />
                                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} strokeLinecap="round" />
                                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} />
                                </svg>
                            </button>
                        </div>

                        <div className="bg-background-surface border border-border-default rounded-lg p-4">
                            <div className="divide-y divide-border-default">
                                {upcomingTasks.map((task) => (
                                    <UpcomingDueDateItem key={task.id} {...task} />
                                ))}
                            </div>

                            <button onClick={onAddReminder} className="w-full p-2 my-2 flex items-center justify-center gap-2 text-text-secondary hover:text-text-primary hover:bg-background-primary-hover transition-colors border border-dashed border-border-default rounded-lg">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                                    <line x1="12" y1="8" x2="12" y2="16" strokeWidth={2} strokeLinecap="round" />
                                    <line x1="8" y1="12" x2="16" y2="12" strokeWidth={2} strokeLinecap="round" />
                                </svg>
                                Add Reminder
                            </button>
                        </div>


                        {/* Pro Tip Box */}
                        {/* <div className="m-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z\" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-text-primary font-semibold text-sm mb-1">Pro Tip</h4>
                                    <p className="text-text-secondary text-xs">Drag tasks to the sidebar projects to quickly move them.</p>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};
