import { PageHeader } from '../common/PageHeader';
import { TaskCard } from './TaskCard';
import { TaskFilterBar } from '../common/TaskFilterBar';
import { useTranslation } from 'react-i18next';

type FilterTab = 'all' | 'todo' | 'in_progress' | 'done';
type SortOption = 'recent' | 'dueDate' | 'priority';

interface Task {
    id: string;
    title: string;
    description: string;
    label?: string;
    dueDate: string;
    dueTime?: string;
    priority: 'high' | 'medium' | 'low';
    progressStatus: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

interface TasksViewProps {
    userName: string;
    tasks: Task[];
    searchQuery: string;
    activeFilter: FilterTab;
    sortOption: SortOption;
    onSearchChange: (query: string) => void;
    onFilterChange: (filter: FilterTab) => void;
    onSortChange: (sort: SortOption) => void;
    onTaskToggle: (id: string) => void;
    onTaskClick?: (id: string) => void;
    onCreateTask: () => void;
    onEditTask?: (id: string) => void;
    onArchiveTask?: (id: string) => void;
    onDeleteTask?: (id: string) => void;
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
    onArchiveTask,
    onDeleteTask,
}: TasksViewProps) => {
    const { t } = useTranslation();

    const filterTabs: { key: FilterTab; label: string }[] = [
        { key: 'all', label: t('tasks.filter.all') },
        { key: 'todo', label: t('tasks.filter.todo') },
        { key: 'in_progress', label: t('tasks.filter.inProgress') },
        { key: 'done', label: t('tasks.filter.completed') },
    ];

    const sortOptions: { key: SortOption; label: string }[] = [
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
            <div className="space-y-3">
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
                        onArchive={onArchiveTask}
                        onDelete={onDeleteTask}
                    />
                ))}
            </div>

            {/* Empty State */}
            {tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
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
                </div>
            )}

            {/* Footer Message */}
            {tasks.length > 0 && (
                <p className="text-center text-text-secondary text-sm mt-8">
                    Managing your personal productivity workflow
                </p>
            )}
        </div>
    );
};
