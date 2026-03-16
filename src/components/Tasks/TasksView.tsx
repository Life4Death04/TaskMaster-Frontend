import { motion } from 'framer-motion';
import { staggerContainerVariants, fadeInVariants } from '@/utils/animations';
import { PageHeader } from '../common/PageHeader';
import { TaskCard } from './TaskCard';
import { TaskFilterBar } from '../common/TaskFilterBar';
import { useTranslation } from 'react-i18next';
import type { TaskFilterTab, TaskSortOption, TaskViewModel } from '@/types';

interface TasksViewProps {
    userName: string;
    tasks: TaskViewModel[];
    searchQuery: string;
    activeFilter: TaskFilterTab;
    sortOption: TaskSortOption;
    onSearchChange: (query: string) => void;
    onFilterChange: (filter: TaskFilterTab) => void;
    onSortChange: (sort: TaskSortOption) => void;
    onTaskToggle: (id: string) => void;
    onTaskClick?: (id: string) => void;
    onCreateTask: () => void;
    onEditTask?: (id: string) => void;
    onDeleteTask?: (id: string) => void;
    // Pagination props
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    onLoadMore?: () => void;
    totalTasks?: number;
    currentlyShowing?: number;
}

/**
 * Tasks View Component
 * Pure presentational component for the tasks page layout
 */
export const TasksView = ({
    userName,
    tasks,
    searchQuery,
    activeFilter,
    sortOption,
    onSearchChange,
    onFilterChange,
    onSortChange,
    onTaskToggle,
    onTaskClick,
    onCreateTask,
    onEditTask,
    onDeleteTask,
    // Pagination props
    hasNextPage = false,
    isFetchingNextPage = false,
    onLoadMore,
    totalTasks,
    currentlyShowing,
}: TasksViewProps) => {
    const { t } = useTranslation();

    const filterTabs: { key: TaskFilterTab; label: string }[] = [
        { key: 'all', label: t('tasks.filter.all') },
        { key: 'todo', label: t('tasks.filter.todo') },
        { key: 'in_progress', label: t('tasks.filter.inProgress') },
        { key: 'done', label: t('tasks.filter.completed') },
    ];

    const sortOptions: { key: TaskSortOption; label: string }[] = [
        { key: 'recent', label: t('tasks.sort.recent') },
        { key: 'dueDate', label: t('tasks.sort.dueDate') },
        { key: 'priority', label: t('tasks.sort.priority') },
    ];

    return (
        <div className="min-h-screen bg-background-primary p-6">
            {/* Page Header */}
            <PageHeader
                title={t('tasks.title')}
                subtitle={t('tasks.subtitle')}
                userName={userName}
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                showSearch={true}
            />

            {/* Filter Bar with Tabs, Sort, and Create Button */}
            <TaskFilterBar
                filterTabs={filterTabs}
                activeFilter={activeFilter}
                onFilterChange={onFilterChange}
                onCreateTask={onCreateTask}
                showSort={true}
                sortOption={sortOption}
                sortOptions={sortOptions}
                onSortChange={onSortChange}
            />

            {/* Tasks List */}
            <motion.div className="space-y-3" variants={staggerContainerVariants} initial="hidden" animate="visible">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        description={task.description}
                        label={task.label}
                        dueDate={task.dueDate}
                        dueTime={task.dueTime}
                        priority={task.priority}
                        progressStatus={task.progressStatus}
                        onToggleComplete={onTaskToggle}
                        onClick={onTaskClick}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                    />
                ))}
            </motion.div>

            {/* Empty State */}
            {tasks.length === 0 && (
                <motion.div className="flex flex-col items-center justify-center py-20" variants={fadeInVariants} initial="hidden" animate="visible">
                    <div className="w-20 h-20 rounded-full bg-background-primary-hover flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <h3 className="text-text-primary text-xl font-semibold mb-2">No tasks found</h3>
                    <p className="text-text-secondary text-sm mb-6">Create your first task to get started</p>
                    <button
                        onClick={onCreateTask}
                        className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors flex items-center gap-2 hover:cursor-pointer"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Task
                    </button>
                </motion.div>
            )}

            {/* Load More Button - Only show when we've loaded at least 10 tasks */}
            {currentlyShowing && currentlyShowing >= 10 && hasNextPage && onLoadMore && (
                <motion.div 
                    className="flex flex-col items-center justify-center mt-8 space-y-3"
                    variants={fadeInVariants} 
                    initial="hidden" 
                    animate="visible"
                >
                    {/* Pagination Info */}
                    {totalTasks && currentlyShowing && (
                        <p className="text-text-secondary text-sm">
                            Showing {currentlyShowing} of {totalTasks} tasks
                        </p>
                    )}
                    
                    {/* Load More Button */}
                    <button
                        onClick={onLoadMore}
                        disabled={isFetchingNextPage}
                        className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-all flex items-center gap-2 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                        {isFetchingNextPage ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Loading...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                <span>Load More Tasks</span>
                            </>
                        )}
                    </button>
                </motion.div>
            )}

            {/* Footer Message */}
            {tasks.length > 0 && (
                <motion.p className="text-center text-text-secondary text-sm mt-8" variants={fadeInVariants} initial="hidden" animate="visible">
                    Managing your personal productivity workflow
                </motion.p>
            )}
        </div>
    );
};
