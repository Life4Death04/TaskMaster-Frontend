import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsView } from '../components/Settings/SettingsView';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { logout } from '@/features/auth/authSlice';
import { useFetchSettings } from '@/api/queries/settings.queries';
import { useUpdateSettings } from '@/api/mutations/settings.mutations';
import { useUpdateUser } from '@/api/mutations/users.mutations';
import { useTheme } from '@/contexts/ThemeContext';
import type { ThemeTypes, DateFormatTypes, LanguageTypes, PriorityTypes, StatusTypes } from '@/types';

/**
 * Settings Container
 * Business logic container for the Settings page
 */
export const SettingsContainer = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { setTheme } = useTheme();

    // Get user from Redux
    const user = useAppSelector((state) => state.auth.user);

    // Fetch settings from API
    const { data: settings, isLoading, error } = useFetchSettings();
    const updateSettingsMutation = useUpdateSettings();
    const updateUserMutation = useUpdateUser();

    // Settings state
    const [darkMode, setDarkMode] = useState(true);
    const [language, setLanguage] = useState<'en' | 'es'>('en');
    const [defaultPriority, setDefaultPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
    const [defaultStatus, setDefaultStatus] = useState<'TODO' | 'IN_PROGRESS' | 'DONE'>('TODO');
    const [dateFormat, setDateFormat] = useState<'MM_DD_YYYY' | 'DD_MM_YYYY' | 'YYYY_MM_DD'>('DD_MM_YYYY');
    const [hasChanges, setHasChanges] = useState(false);

    // Profile editing state
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedFirstName, setEditedFirstName] = useState('');
    const [editedLastName, setEditedLastName] = useState('');

    // Original values to track changes
    const [originalSettings, setOriginalSettings] = useState({
        darkMode: true,
        language: 'en' as 'en' | 'es',
        defaultPriority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
        defaultStatus: 'TODO' as 'TODO' | 'IN_PROGRESS' | 'DONE',
        dateFormat: 'DD_MM_YYYY' as 'MM_DD_YYYY' | 'DD_MM_YYYY' | 'YYYY_MM_DD',
    });

    // Initialize state from API settings
    useEffect(() => {
        if (settings) {
            const isDarkMode = settings.theme === 'DARK';
            const lang = settings.language === 'EN' ? 'en' : 'es';

            setDarkMode(isDarkMode);
            setLanguage(lang);
            setDefaultPriority(settings.defaultPriority);
            setDefaultStatus(settings.defaultStatus);
            setDateFormat(settings.dateFormat);

            setOriginalSettings({
                darkMode: isDarkMode,
                language: lang,
                defaultPriority: settings.defaultPriority,
                defaultStatus: settings.defaultStatus,
                dateFormat: settings.dateFormat,
            });
        }
    }, [settings]);

    // Check if settings have changed
    useEffect(() => {
        const changed =
            darkMode !== originalSettings.darkMode ||
            language !== originalSettings.language ||
            defaultPriority !== originalSettings.defaultPriority ||
            defaultStatus !== originalSettings.defaultStatus ||
            dateFormat !== originalSettings.dateFormat;
        setHasChanges(changed);
    }, [darkMode, language, defaultPriority, defaultStatus, dateFormat, originalSettings]);

    // Event handlers
    const handleEditProfile = () => {
        setIsEditingName(true);
        setEditedFirstName(user?.firstName || '');
        setEditedLastName(user?.lastName || '');
    };

    const handleFirstNameChange = (name: string) => {
        setEditedFirstName(name);
    };

    const handleLastNameChange = (name: string) => {
        setEditedLastName(name);
    };

    const handleSaveName = async () => {
        // Validate inputs
        const trimmedFirstName = editedFirstName.trim();
        const trimmedLastName = editedLastName.trim();

        if (!trimmedFirstName || !trimmedLastName) {
            alert('Both first name and last name are required.');
            return;
        }

        if (trimmedFirstName.length < 2 || trimmedLastName.length < 2) {
            alert('Names must be at least 2 characters long.');
            return;
        }

        try {
            await updateUserMutation.mutateAsync({
                firstName: trimmedFirstName,
                lastName: trimmedLastName,
            });

            setIsEditingName(false);
            console.log('✅ Name updated successfully!');
        } catch (error) {
            console.error('Failed to update name:', error);
            alert('Failed to update name. Please try again.');
        }
    };

    const handleCancelNameEdit = () => {
        setIsEditingName(false);
        setEditedFirstName('');
        setEditedLastName('');
    };

    const handleDarkModeToggle = () => {
        setDarkMode(!darkMode);
    };

    const handleLanguageChange = (lang: 'en' | 'es') => {
        setLanguage(lang);
    };

    const handleDefaultPriorityChange = (priority: 'LOW' | 'MEDIUM' | 'HIGH') => {
        setDefaultPriority(priority);
    };

    const handleDefaultStatusChange = (status: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
        setDefaultStatus(status);
    };

    const handleDateFormatChange = (format: 'MM_DD_YYYY' | 'DD_MM_YYYY' | 'YYYY_MM_DD') => {
        setDateFormat(format);
    };

    const handleLogout = () => {
        // Clear Redux auth state and localStorage tokens
        dispatch(logout());
        // Redirect to auth page
        navigate('/auth');
    };

    const handleDeleteAccount = () => {
        // TODO: Open confirmation modal
        console.log('Delete account');
    };

    const handleDiscard = () => {
        // Reset to original values
        setDarkMode(originalSettings.darkMode);
        setLanguage(originalSettings.language);
        setDefaultPriority(originalSettings.defaultPriority);
        setDefaultStatus(originalSettings.defaultStatus);
        setDateFormat(originalSettings.dateFormat);
    };

    const handleApplyChanges = async () => {
        try {
            // Map UI state to backend types
            const updateData = {
                theme: (darkMode ? 'DARK' : 'LIGHT') as ThemeTypes,
                language: (language === 'en' ? 'EN' : 'ES') as LanguageTypes,
                defaultPriority: defaultPriority as PriorityTypes,
                defaultStatus: defaultStatus as StatusTypes,
                dateFormat: dateFormat as DateFormatTypes,
            };

            await updateSettingsMutation.mutateAsync(updateData);

            // Update theme in ThemeContext
            setTheme(darkMode ? 'dark' : 'light');

            // Update original settings after successful save
            setOriginalSettings({
                darkMode,
                language,
                defaultPriority,
                defaultStatus,
                dateFormat,
            });

            console.log('Settings saved successfully!');
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-text-secondary">Loading settings...</div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-red-500">Failed to load settings</div>
            </div>
        );
    }

    return (
        <SettingsView
            userName={user ? `${user.firstName} ${user.lastName}` : 'User'}
            userEmail={user?.email || 'user@example.com'}
            isEditingName={isEditingName}
            editedFirstName={editedFirstName}
            editedLastName={editedLastName}
            onFirstNameChange={handleFirstNameChange}
            onLastNameChange={handleLastNameChange}
            onSaveName={handleSaveName}
            onCancelNameEdit={handleCancelNameEdit}
            darkMode={darkMode}
            language={language}
            defaultPriority={defaultPriority}
            defaultStatus={defaultStatus}
            dateFormat={dateFormat}
            hasChanges={hasChanges}
            onEditProfile={handleEditProfile}
            onDarkModeToggle={handleDarkModeToggle}
            onLanguageChange={handleLanguageChange}
            onDefaultPriorityChange={handleDefaultPriorityChange}
            onDefaultStatusChange={handleDefaultStatusChange}
            onDateFormatChange={handleDateFormatChange}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
            onDiscard={handleDiscard}
            onApplyChanges={handleApplyChanges}
        />
    );
};
