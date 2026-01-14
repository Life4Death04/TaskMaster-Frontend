import { Link } from 'react-router-dom';
import { type ReactNode } from 'react';

export interface NavigationItem {
    path: string;
    label: string;
    icon: ReactNode;
}

export interface ListItem {
    id: string;
    name: string;
    color: string;
}

interface SidebarProps {
    isOpen: boolean;
    isMobile: boolean;
    onToggle: () => void;
    onClose: () => void;
    navigationItems: NavigationItem[];
    listItems: ListItem[];
}

/**
 * Presentational Sidebar Component
 * Renders the sidebar UI without handling any logic
 */
export const Sidebar = ({ isOpen, isMobile, onToggle, onClose, navigationItems, listItems }: SidebarProps) => {
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
          bg-card-primary
          border-r border-border-input
          transition-all duration-300 ease-in-out
          
          ${isOpen ? 'w-50' : 'w-19'}
        `}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-border-input lg:w-50">
                    {isMobile && (
                        <button
                            onClick={onToggle}
                            className="p-2 rounded-lg hover:bg-background-primary-hover transition-colors hover:cursor-pointer"
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
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-primary-hover transition-colors hover:cursor-pointer"
                        >
                            <div className="w-5 h-5 text-text-primary flex-shrink-0">
                                {item.icon}
                            </div>
                            {isOpen && (
                                <span className="text-text-primary">{item.label}</span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Lists Navigation Section */}
                <div className="border-t border-border-input">
                    <div className="space-y-2 p-4">
                        {listItems.map((list) => (
                            <Link
                                key={list.id}
                                to={`/lists/${list.id}`}
                                onClick={onClose}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-primary-hover transition-colors hover:cursor-pointer"
                            >
                                <svg
                                    className="w-5 h-5 flex-shrink-0"
                                    fill={list.color}
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                                </svg>
                                {isOpen && (
                                    <span className="text-text-primary text-sm truncate">{list.name}</span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>


                {/* Sidebar Footer */}
                <div className="flex items-center justify-between p-4 border-t border-border-input lg:w-50 bottom-0 right-0 left-0 absolute">
                    <Link
                        key={"/settings"}
                        to={"/settings"}
                        onClick={onClose}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-primary-hover transition-colors w-full hover:cursor-pointer"
                    >
                        <div className="w-5 h-5 text-text-primary flex-shrink-0">
                            <svg
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        {isOpen && (
                            <span className="text-text-primary">{"Settings"}</span>
                        )}
                    </Link>
                </div>
            </aside>
        </>
    );
};
