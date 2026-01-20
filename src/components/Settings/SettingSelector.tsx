interface SettingSelectorOption {
    value: string;
    label: string;
}

interface SettingSelectorProps<T extends string> {
    icon: React.ReactNode;
    title: string;
    description: string;
    value: T;
    options: SettingSelectorOption[];
    onChange: (value: T) => void;
}

/**
 * Setting Selector Component
 * Reusable component for settings dropdown selectors with responsive design
 */
export const SettingSelector = <T extends string>({
    icon,
    title,
    description,
    value,
    options,
    onChange,
}: SettingSelectorProps<T>) => {
    return (
        <div className="relative flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-background-primary-hover flex items-center justify-center">
                    {icon}
                </div>
                {/* Selector for small screens */}
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value as T)}
                    className="min-[510px]:hidden px-4 py-2 bg-background-primary-hover border border-border-default rounded-lg text-text-primary font-medium transition-colors hover:cursor-pointer focus:outline-none focus:border-primary"
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div>
                    <p className="text-text-primary font-semibold">{title}</p>
                    <p className="text-text-secondary text-sm">{description}</p>
                </div>
            </div>
            {/* Selector for large screens */}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as T)}
                className="hidden min-[510px]:block px-4 py-2 bg-background-primary-hover border border-border-default rounded-lg text-text-primary font-medium transition-colors hover:cursor-pointer focus:outline-none focus:border-primary"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
