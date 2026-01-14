import { PageHeader } from '../common/PageHeader';
import { TaskCard } from './TaskCard';

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
    onCreateTask,
    onEditTask,
    onArchiveTask,
    onDeleteTask,
}: TasksViewProps) => {
    const filterTabs: { key: FilterTab; label: string }[] = [
        { key: 'all', label: 'All Tasks' },
        { key: 'todo', label: 'To Do' },
        { key: 'in_progress', label: 'In Progress' },
        { key: 'done', label: 'Done' },
    ];

    const sortOptions: { key: SortOption; label: string }[] = [
        { key: 'recent', label: 'Recent' },
        { key: 'dueDate', label: 'Due Date' },
        { key: 'priority', label: 'Priority' },
    ];

    return (
        <div className="min-h-screen bg-background-primary p-6">
            {/* Page Header */}
            <PageHeader
                title="My Tasks"
                subtitle="Review and manage your personal task list."
                userName={userName}
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                showSearch={true}
            />

            {/* Filter Tabs, Sort, and Create Button */}
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2 bg-card-primary shadow-md border border-border-default rounded-lg p-1">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => onFilterChange(tab.key)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeFilter === tab.key
                                ? 'bg-primary text-white'
                                : 'text-text-secondary hover:text-text-primary hover:bg-background-primary-hover'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Sort and Create Button */}
                <div className="flex flex-wrap items-center gap-4">
                    {/* Sort Dropdown */}
                    <div className="relative">
                        <select
                            value={sortOption}
                            onChange={(e) => onSortChange(e.target.value as SortOption)}
                            className="pl-4 pr-10 py-2 bg-card-primary border border-border-default rounded-lg text-text-primary text-sm font-medium cursor-pointer hover:bg-background-primary-hover transition-colors appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.key} value={option.key}>
                                    Sort: {option.label}
                                </option>
                            ))}
                        </select>
                        <svg
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {/* Create Task Button */}
                    <button
                        onClick={onCreateTask}
                        className="px-6 py-2.5 bg-gradient-blueToPurple hover:bg-primary-hover text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md hover:shadow-lg hover:cursor-pointer"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Task
                    </button>
                </div>
            </div>

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
