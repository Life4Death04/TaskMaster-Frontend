import { motion } from 'framer-motion';
import { staggerContainerVariants, sectionHeaderVariants, fadeInVariants } from '@/utils/animations';
import { StatsCard } from './StatsCard';
import { TaskItem } from './TaskItem';
import { UpcomingDueDateItem } from './UpcomingDueDateItem';
import { PageHeader } from '../common/PageHeader';
import { useTranslation } from 'react-i18next';
import type {
    DashboardRecentTaskViewModel,
    DashboardUpcomingTaskViewModel,
} from '@/types';

interface DashboardStats {
    totalTasks: number;
    completedToday: number;
    overdue: number;
    totalLists: number;
}

interface DashboardViewProps {
    userName: string;
    stats: DashboardStats;
    recentTasks: DashboardRecentTaskViewModel[];
    activeTasksCount: number;
    upcomingTasks: DashboardUpcomingTaskViewModel[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onTaskToggle: (id: string) => void;
    onTaskClick?: (id: string) => void;
    onViewAllTasks: () => void;
    onCalendarClick: () => void;
    onAddReminder: () => void;
    onEditTask?: (id: string) => void;
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
    onCalendarClick,
    onAddReminder,
    onEditTask,
    onDeleteTask,
}: DashboardViewProps) => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-background-primary p-6">
            {/* Dashboard Header */}
            <PageHeader
                title={t('dashboard.title')}
                subtitle={t('dashboard.subtitle', { userName })}
                userName={userName}
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                showSearch={false}
            />

            {/* Stats Cards */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
            >
                <StatsCard
                    title={t('dashboard.stats.totalTasks')}
                    value={stats.totalTasks}
                    icon={
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                        </svg>
                    }
                />

                <StatsCard
                    title={t('dashboard.stats.completedToday')}
                    value={stats.completedToday}
                    icon={
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    }
                />

                <StatsCard
                    title={t('dashboard.stats.overdue')}
                    value={stats.overdue}
                    icon={
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                        </svg>
                    }
                />

                <StatsCard
                    title={t('dashboard.stats.myLists')}
                    value={stats.totalLists}
                    icon={
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                        </svg>
                    }
                />
            </motion.div>

            {/* Empty State */}
            {recentTasks.length === 0 && upcomingTasks.length === 0 && (
                <motion.div
                    className="flex flex-col items-center justify-center py-20"
                    variants={fadeInVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="w-20 h-20 rounded-full bg-background-primary-hover flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <h3 className="text-text-primary text-xl font-semibold mb-2">{t('dashboard.empty.title')}</h3>
                    <p className="text-text-secondary text-sm mb-6">{t('dashboard.empty.subtitle')}</p>
                    <button
                        onClick={onAddReminder}
                        className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors flex items-center gap-2 hover:cursor-pointer"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {t('dashboard.empty.createTask')}
                    </button>
                </motion.div>
            )}

            {/* Main Content Grid */}
            {(recentTasks.length > 0 || upcomingTasks.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Tasks Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-card-dark rounded-xl">
                            <motion.div
                                className="flex items-center justify-between py-6"
                                variants={sectionHeaderVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <div className="flex items-center gap-3">
                                    <h2 className="text-text-primary text-xl font-bold">{t('dashboard.recentTasks')}</h2>
                                    <span className="px-2 py-1 text-xs font-semibold bg-primary/20 text-primary rounded">
                                        {activeTasksCount} {t('dashboard.active')}
                                    </span>
                                </div>
                                <button onClick={onViewAllTasks} className="text-primary hover:text-primary-hover text-sm font-medium transition-colors hover:cursor-pointer">
                                    {t('dashboard.viewAll')}
                                </button>
                            </motion.div>

                            <motion.div className="flex flex-col gap-4" variants={staggerContainerVariants} initial="hidden" animate="visible">
                                {recentTasks.map((task) => (
                                    <TaskItem
                                        key={task.id}
                                        {...task}
                                        onToggleComplete={onTaskToggle}
                                        onClick={onTaskClick}
                                        onEdit={onEditTask}
                                        onDelete={onDeleteTask}
                                    />
                                ))}
                            </motion.div>
                        </div>
                    </div>

                    {/* Upcoming Due Dates Section */}
                    <div className="lg:col-span-1">
                        <div>
                            <motion.div
                                className="flex items-center justify-between py-6"
                                variants={sectionHeaderVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <h2 className="text-text-primary text-xl font-bold">{t('dashboard.upcomingDueDates')}</h2>
                                <button onClick={onCalendarClick} className="px-2 hover:bg-background-primary-hover rounded-lg transition-colors text-text-secondary hover:text-text-primary hover:cursor-pointer" aria-label="Calendar">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2} />
                                        <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} strokeLinecap="round" />
                                        <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} strokeLinecap="round" />
                                        <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} />
                                    </svg>
                                </button>
                            </motion.div>

                            <div className="bg-card-primary border border-border-default rounded-lg p-4 shadow-md">
                                <motion.div className="divide-y divide-border-default" variants={staggerContainerVariants} initial="hidden" animate="visible">
                                    {upcomingTasks.map((task) => (
                                        <UpcomingDueDateItem key={task.id} {...task} />
                                    ))}
                                </motion.div>

                                <button onClick={onAddReminder} className="w-full p-2 my-2 flex items-center justify-center gap-2 text-text-secondary hover:text-text-primary hover:bg-background-primary-hover transition-colors border border-dashed border-border-default rounded-lg hover:cursor-pointer">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle cx="12" cy="12" r="10" strokeWidth={2} />
                                        <line x1="12" y1="8" x2="12" y2="16" strokeWidth={2} strokeLinecap="round" />
                                        <line x1="8" y1="12" x2="16" y2="12" strokeWidth={2} strokeLinecap="round" />
                                    </svg>
                                    {t('dashboard.addReminder')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
