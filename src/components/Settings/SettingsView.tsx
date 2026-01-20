import { SettingSelector } from './SettingSelector';

interface SettingsViewProps {
    userName: string;
    userEmail: string;
    darkMode: boolean;
    language: 'en' | 'es';
    defaultPriority: 'LOW' | 'MEDIUM' | 'HIGH';
    defaultStatus: 'TODO' | 'IN_PROGRESS' | 'DONE';
    dateFormat: 'MM_DD_YYYY' | 'DD_MM_YYYY' | 'YYYY_MM_DD';
    hasChanges: boolean;
    onEditProfile: () => void;
    onDarkModeToggle: () => void;
    onLanguageChange: (lang: 'en' | 'es') => void;
    onDefaultPriorityChange: (priority: 'LOW' | 'MEDIUM' | 'HIGH') => void;
    onDefaultStatusChange: (status: 'TODO' | 'IN_PROGRESS' | 'DONE') => void;
    onDateFormatChange: (format: 'MM_DD_YYYY' | 'DD_MM_YYYY' | 'YYYY_MM_DD') => void;
    onLogout: () => void;
    onDeleteAccount: () => void;
    onDiscard: () => void;
    onApplyChanges: () => void;
}

/**
 * Settings View Component
 * Pure presentational component for the settings page layout
 */
export const SettingsView = ({
    userName,
    userEmail,
    darkMode,
    language,
    defaultPriority,
    defaultStatus,
    dateFormat,
    hasChanges,
    onEditProfile,
    onDarkModeToggle,
    onLanguageChange,
    onDefaultPriorityChange,
    onDefaultStatusChange,
    onDateFormatChange,
    onLogout,
    onDeleteAccount,
    onDiscard,
    onApplyChanges,
}: SettingsViewProps) => {
    return (
        <div className="min-h-screen bg-background-primary p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-text-primary text-3xl font-bold mb-2">Account Settings</h1>
                <p className="text-text-secondary text-sm">Manage your profile information and account preferences.</p>
            </div>

            {/* Profile Card */}
            <div className="bg-card-primary border border-border-default rounded-xl p-6 mb-6 shadow-md">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {/* Avatar with Camera Icon */}
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-2xl font-bold text-white">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="text-center sm:text-left">
                            <h2 className="text-text-primary text-xl font-bold mb-1">{userName}</h2>
                            <p className="text-text-secondary text-sm">{userEmail}</p>
                        </div>
                    </div>

                    {/* Edit Profile Button */}
                    <button
                        onClick={onEditProfile}
                        className="px-6 py-2.5 bg-background-primary hover:cursor-pointer hover:bg-background-primary-hover text-text-primary rounded-lg font-medium transition-colors border border-border-default hover:border-white w-full md:w-auto"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* General Preferences */}
            <div className="bg-card-primary border border-border-default rounded-xl p-6 mb-6 shadow-md">
                <h3 className="text-text-primary text-lg font-bold mb-6">General Preferences</h3>

                <div className="space-y-6">
                    {/* Dark Mode */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-background-primary-hover flex items-center justify-center">
                                <svg className="w-5 h-5 text-text-secondary" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            </div>
                            {/* Here should be language switcher for screens < 640px */}
                            <button
                                onClick={onDarkModeToggle}
                                className={`min-[510px]:hidden relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-primary' : 'bg-gray-600'
                                    }`}
                                aria-label="Toggle dark mode"
                            >
                                <span
                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'
                                        }`}
                                ></span>
                            </button>
                            <div>
                                <p className="text-text-primary font-semibold">Dark Mode</p>
                                <p className="text-text-secondary text-sm">Adjust the visual theme of the app.</p>
                            </div>
                        </div>
                        <button
                            onClick={onDarkModeToggle}
                            className={`hidden min-[510px]:block relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-primary' : 'bg-gray-600'
                                }`}
                            aria-label="Toggle dark mode"
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                            ></span>
                        </button>
                    </div>

                    {/* Language */}
                    <div className="flex items-center justify-between ">
                        <div className="flex items-center flex-wrap gap-4">
                            <div className="w-10 h-10 rounded-lg bg-background-primary-hover flex items-center justify-center">
                                <svg className="w-5 h-5 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                                </svg>
                            </div>
                            <div className="flex min-[510px]:hidden items-center gap-2 bg-background-primary-hover border border-border-default rounded-lg p-1">
                                <button
                                    onClick={() => onLanguageChange('en')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:cursor-pointer ${language === 'en'
                                        ? 'bg-primary text-white'
                                        : 'text-text-secondary hover:text-text-primary'
                                        }`}
                                >
                                    EN
                                </button>
                                <button
                                    onClick={() => onLanguageChange('es')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:cursor-pointer ${language === 'es'
                                        ? 'bg-primary text-white'
                                        : 'text-text-secondary hover:text-text-primary'
                                        }`}
                                >
                                    ES
                                </button>
                            </div>
                            <div>
                                <p className="text-text-primary font-semibold">Language</p>
                                <p className="text-text-secondary text-sm">Choose your preferred language.</p>
                            </div>
                        </div>
                        {/* Here should be language switcher for screens >= 640px */}
                        <div className="hidden min-[510px]:flex items-center gap-2 bg-background-primary-hover border border-border-default rounded-lg p-1">
                            <button
                                onClick={() => onLanguageChange('en')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:cursor-pointer ${language === 'en'
                                    ? 'bg-primary text-white'
                                    : 'text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => onLanguageChange('es')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:cursor-pointer ${language === 'es'
                                    ? 'bg-primary text-white'
                                    : 'text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                ES
                            </button>
                        </div>
                    </div>

                    {/* Default Task Priority */}
                    <SettingSelector
                        icon={
                            <svg className="w-5 h-5 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        }
                        title="Default Task Priority"
                        description="Priority for newly created tasks."
                        value={defaultPriority}
                        options={[
                            { value: 'LOW', label: 'Low' },
                            { value: 'MEDIUM', label: 'Medium' },
                            { value: 'HIGH', label: 'High' },
                        ]}
                        onChange={onDefaultPriorityChange}
                    />

                    {/* Default Task Status */}
                    <SettingSelector
                        icon={
                            <svg className="w-5 h-5 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        }
                        title="Default Task Status"
                        description="Status for newly created tasks."
                        value={defaultStatus}
                        options={[
                            { value: 'TODO', label: 'To Do' },
                            { value: 'IN_PROGRESS', label: 'In Progress' },
                            { value: 'DONE', label: 'Done' },
                        ]}
                        onChange={onDefaultStatusChange}
                    />

                    {/* Date Format */}
                    <SettingSelector
                        icon={
                            <svg className="w-5 h-5 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        }
                        title="Date Format"
                        description="Preferred display format for dates."
                        value={dateFormat}
                        options={[
                            { value: 'DD_MM_YYYY', label: 'DD/MM/YYYY' },
                            { value: 'MM_DD_YYYY', label: 'MM/DD/YYYY' },
                            { value: 'YYYY_MM_DD', label: 'YYYY/MM/DD' },
                        ]}
                        onChange={onDateFormatChange}
                    />
                </div>
            </div>
            {/* Account Management */}
            <div className="bg-card-primary border border-border-default rounded-xl p-6 mb-6 shadow-md">
                <h3 className="text-text-primary text-lg font-bold mb-6">Account Management</h3>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                    {/* Logout Button */}
                    <button
                        onClick={onLogout}
                        className="flex-1 min-w-[100px] px-6 py-3 bg-background-primary-hover hover:border-white text-text-primary rounded-lg font-medium transition-colors border border-border-default flex items-center justify-center gap-2 hover:cursor-pointer"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout Session
                    </button>

                    {/* Delete Account Button */}
                    <button
                        onClick={onDeleteAccount}
                        className="flex-1 min-w-[100px] px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg font-medium transition-colors border border-red-500/30 flex items-center justify-center gap-2 hover:cursor-pointer"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Account
                    </button>
                </div>

                <p className="text-text-secondary text-xs text-center">
                    Warning: Deleting your account is permanent and cannot be undone. All your data will be wiped.
                </p>
            </div>

            {/* Action Buttons */}
            {hasChanges && (
                <div className="bg-card-primary p-4 flex flex-wrap items-center justify-end gap-4 shadow-md rounded-lg">
                    <button
                        onClick={onDiscard}
                        className="px-6 py-2.5 bg-background-primary-hover hover:bg-border-dark text-text-primary rounded-lg font-medium transition-colors w-full md:w-auto hover:cursor-pointer"
                    >
                        Discard
                    </button>
                    <button
                        onClick={onApplyChanges}
                        className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-md w-full md:w-auto hover:cursor-pointer"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Apply Changes
                    </button>
                </div>
            )}
        </div>
    );
};
