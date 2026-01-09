import { Link } from 'react-router-dom';
import { type ReactNode } from 'react';

export interface NavigationItem {
    path: string;
    label: string;
    icon: ReactNode;
}

interface SidebarProps {
    isOpen: boolean;
    isMobile: boolean;
    onToggle: () => void;
    onClose: () => void;
    navigationItems: NavigationItem[];
}

/**
 * Presentational Sidebar Component
 * Renders the sidebar UI without handling any logic
 */
export const Sidebar = ({ isOpen, isMobile, onToggle, onClose, navigationItems }: SidebarProps) => {
    return (
        <>
            {/* Overlay for mobile when sidebar is open */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full z-50
          bg-white dark:bg-background-dark
          border-r border-gray-200 dark:border-border-dark
          transition-all duration-300 ease-in-out

          
          ${isOpen ? 'w-50' : 'w-19'}
        `}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-border-dark lg:w-50">
                    {isMobile && (
                        <button
                            onClick={onToggle}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                        >

                            {isOpen ? (
                                <svg
                                    className="w-5 h-5 text-gray-600 dark:text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-5 h-5 text-gray-600 dark:text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                    />
                                </svg>
                            )}
                        </button>
                    )
                    }
                </div>

                {/* Sidebar Navigation */}
                <nav className="p-4 space-y-2">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <div className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0">
                                {item.icon}
                            </div>
                            {isOpen && (
                                <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                            )}
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
};
