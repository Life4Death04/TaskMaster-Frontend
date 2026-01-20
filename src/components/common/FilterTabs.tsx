interface FilterTabOption<T = string> {
    key: T;
    label: string;
}

interface FilterTabsProps<T = string> {
    tabs: FilterTabOption<T>[];
    activeTab: T;
    onTabChange: (tab: T) => void;
}

/**
 * Filter Tabs Component
 * Reusable tab selector for filtering content
 */
export const FilterTabs = <T extends string = string>({
    tabs,
    activeTab,
    onTabChange,
}: FilterTabsProps<T>) => {
    return (
        <div className="flex flex-wrap items-center gap-2 bg-card-primary shadow-md border border-border-default rounded-lg p-1">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onTabChange(tab.key)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:cursor-pointer ${activeTab === tab.key
                            ? 'bg-primary text-white'
                            : 'text-text-secondary hover:text-text-primary hover:bg-background-primary-hover'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};
