import { PageHeader } from '../common/PageHeader';
import { ListCard } from './ListCard';

type FilterTab = 'all' | 'todo' | 'in_progress' | 'done';

interface List {
    id: string;
    title: string;
    description: string;
    color: string;
    icon: React.ReactNode;
    taskCount: number;
    status?: string;
    progressStatus?: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

interface ListsViewProps {
    userName: string;
    lists: List[];
    searchQuery: string;
    activeFilter: FilterTab;
    onSearchChange: (query: string) => void;
    onFilterChange: (filter: FilterTab) => void;
    onListClick: (id: string) => void;
    onCreateList: () => void;
}

/**
 * Lists View Component
 * Pure presentational component for the lists page layout
 */
export const ListsView = ({
    userName,
    lists,
    searchQuery,
    activeFilter,
    onSearchChange,
    onFilterChange,
    onListClick,
    onCreateList,
}: ListsViewProps) => {
    const filterTabs: { key: FilterTab; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'todo', label: 'To Do' },
        { key: 'in_progress', label: 'In Progress' },
        { key: 'done', label: 'Done' },
    ];

    return (
        <div className="min-h-screen bg-background-primary p-6">
            {/* Page Header */}
            <PageHeader
                title="My Lists"
                subtitle="Organize your tasks with custom lists."
                userName={userName}
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                showSearch={true}
            />

            {/* Filter Tabs and Create Button */}
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2 bg-card-primary border border-border-default rounded-lg p-1">
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

                {/* Create New List Button */}
                <button
                    onClick={onCreateList}
                    className="px-6 py-2.5 bg-gradient-blueToPurple hover:bg-primary-hover text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New List
                </button>
            </div>

            {/* Lists Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {lists.map((list) => (
                    <ListCard
                        key={list.id}
                        id={list.id}
                        title={list.title}
                        description={list.description}
                        color={list.color}
                        icon={list.icon}
                        taskCount={list.taskCount}
                        status={list.status}
                        onClick={() => onListClick(list.id)}
                    />
                ))}

                {/* Create New List Card */}
                <ListCard
                    id="new"
                    title=""
                    description=""
                    color=""
                    icon={null}
                    taskCount={0}
                    isNewCard={true}
                    onClick={onCreateList}
                />
            </div>

            {/* Empty State */}
            {lists.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-20 h-20 rounded-full bg-background-primary-hover flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-text-primary text-xl font-semibold mb-2">No lists found</h3>
                    <p className="text-text-secondary text-sm mb-6">Create your first list to get started</p>
                    <button
                        onClick={onCreateList}
                        className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New List
                    </button>
                </div>
            )}
        </div>
    );
};
