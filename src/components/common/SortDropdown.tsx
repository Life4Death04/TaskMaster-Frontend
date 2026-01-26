import { useTranslation } from 'react-i18next';

interface SortOption<T = string> {
    key: T;
    label: string;
}

interface SortDropdownProps<T = string> {
    options: SortOption<T>[];
    value: T;
    onChange: (value: T) => void;
    label?: string;
}

/**
 * Sort Dropdown Component
 * Reusable dropdown for sorting options
 */
export const SortDropdown = <T extends string = string>({
    options,
    value,
    onChange,
    label = 'Sort',
}: SortDropdownProps<T>) => {
    const { t } = useTranslation();

    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as T)}
                className="px-6 py-2.5 pr-10 bg-card-primary border border-border-default rounded-lg text-text-primary text-sm font-medium cursor-pointer hover:bg-background-primary-hover transition-colors appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
            >
                {options.map((option) => (
                    <option key={option.key} value={option.key}>
                        {t('tasks.sort.label')}: {option.label}
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
    );
};
