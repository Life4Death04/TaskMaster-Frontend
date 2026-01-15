interface FilterTabOption<T = string> {
    key: T;
    label: string;
}

interface TaskFilterBarProps<T = string, S = string> {
    filterTabs: FilterTabOption<T>[];
    activeFilter: T;
    onFilterChange: (filter: T) => void;
    onCreateTask: () => void;
    showSort?: boolean;
    sortOption?: S;
    sortOptions?: FilterTabOption<S>[];
    onSortChange?: (sort: S) => void;
}

/**
 * Task Filter Bar Component
 * Reusable filter tabs with Create Task button and optional sort dropdown
 */
export const TaskFilterBar = <T extends string = string, S extends string = string>({
    filterTabs,
    activeFilter,
    onFilterChange,
    onCreateTask,
    showSort = false,
    sortOption,
    sortOptions,
    onSortChange,
}: TaskFilterBarProps<T, S>) => {
    return (
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 bg-card-primary shadow-md border border-border-default rounded-lg p-1">
                {filterTabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => onFilterChange(tab.key)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:cursor-pointer ${activeFilter === tab.key
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
                {/* Sort Dropdown (Optional) */}
                {showSort && sortOptions && sortOption && onSortChange && (
                    <div className="relative">
                        <select
                            value={sortOption}
                            onChange={(e) => onSortChange(e.target.value as S)}
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
                )}

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
    );
};
