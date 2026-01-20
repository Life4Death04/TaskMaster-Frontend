interface PageHeaderProps {
    title: string;
    subtitle: string;
    userName?: string;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    showSearch?: boolean;
    showBackButton?: boolean;
    onBack?: () => void;
    actionButtons?: React.ReactNode;
}

/**
 * Page Header Component
 * Reusable header with title, subtitle and search bar
 */
export const PageHeader = ({
    title,
    subtitle,
    userName,
    searchQuery,
    onSearchChange,
    showSearch = true,
    showBackButton = false,
    onBack,
    actionButtons,
}: PageHeaderProps) => {
    const formattedSubtitle = userName ? subtitle.replace('{userName}', userName) : subtitle;

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    {/* Back Button */}
                    {showBackButton && onBack && (
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-background-primary-hover hover:cursor-pointer rounded-lg transition-colors text-text-secondary hover:text-text-primary"
                            aria-label="Go back"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Title and Subtitle */}
                    <div>
                        <h1 className="text-text-primary text-3xl font-bold mb-1">{title}</h1>
                        <p className="text-text-secondary text-sm">{formattedSubtitle}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Action Buttons (for List Details) */}
                    {actionButtons}

                    {showSearch && (
                        <div className="relative">
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                            >
                                <circle cx="11" cy="11" r="8" strokeWidth={2} />
                                <path strokeLinecap="round" strokeWidth={2} d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-background-input border border-border-input rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary w-full"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
