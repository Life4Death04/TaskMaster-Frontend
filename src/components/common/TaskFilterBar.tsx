import { useTranslation } from 'react-i18next';
import { FilterTabs } from './FilterTabs';
import { SortDropdown } from './SortDropdown';
import { ActionButton } from './ActionButton';

interface FilterTabOption<T = string> {
    key: T;
    label: string;
}

// Discriminated union: If showSort is true, all sort-related props are required
type TaskFilterBarProps<T = string, S = string> = {
    filterTabs: FilterTabOption<T>[];
    activeFilter: T;
    onFilterChange: (filter: T) => void;
    onCreateTask: () => void;
} & (
        | {
            showSort: true;
            sortOption: S;
            sortOptions: FilterTabOption<S>[];
            onSortChange: (sort: S) => void;
        }
        | {
            showSort?: false;
            sortOption?: never;
            sortOptions?: never;
            onSortChange?: never;
        }
    );

/**
 * Task Filter Bar Component
 * Reusable filter tabs with Create Task button and optional sort dropdown
 * Now composed of smaller, reusable components
 */
export const TaskFilterBar = <T extends string = string, S extends string = string>(
    props: TaskFilterBarProps<T, S>
) => {
    const { t } = useTranslation();
    const { filterTabs, activeFilter, onFilterChange, onCreateTask } = props;

    return (
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            {/* Filter Tabs */}
            <FilterTabs
                tabs={filterTabs}
                activeTab={activeFilter}
                onTabChange={onFilterChange}
            />

            {/* Sort and Create Button */}
            <div className="flex flex-wrap items-center gap-4">
                {/* Sort Dropdown (Optional) */}
                {props.showSort && (
                    <SortDropdown
                        options={props.sortOptions}
                        value={props.sortOption}
                        onChange={props.onSortChange}
                        label="Sort"
                    />
                )}

                {/* Create Task Button */}
                <ActionButton
                    onClick={onCreateTask}
                    label={t('tasks.create')}
                    icon={
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    }
                    variant="gradient"
                />
            </div>
        </div>
    );
};
