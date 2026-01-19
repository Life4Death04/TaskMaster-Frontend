import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsView } from '../components/Settings/SettingsView';
import { useAppDispatch } from '@/hooks/redux';
import { logout } from '@/features/auth/authSlice';

/**
 * Settings Container
 * Business logic container for the Settings page
 */
export const SettingsContainer = () => {

    // Mock user data - will be replaced with Redux state later
    const userName = 'Jane Doe';
    const userEmail = 'jane.doe@example.com';
    const userAvatar = undefined;

    // Settings state
    const [darkMode, setDarkMode] = useState(true);
    const [language, setLanguage] = useState<'en' | 'es'>('en');
    const [defaultPriority, setDefaultPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
    const [defaultStatus, setDefaultStatus] = useState<'TODO' | 'IN_PROGRESS' | 'DONE'>('TODO');
    const [dateFormat, setDateFormat] = useState<'MM_DD_YYYY' | 'DD_MM_YYYY' | 'YYYY_MM_DD'>('DD_MM_YYYY');
    const [hasChanges, setHasChanges] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Original values to track changes
    const [originalSettings, setOriginalSettings] = useState({
        darkMode: true,
        language: 'en' as 'en' | 'es',
        defaultPriority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
        defaultStatus: 'TODO' as 'TODO' | 'IN_PROGRESS' | 'DONE',
        dateFormat: 'DD_MM_YYYY' as 'MM_DD_YYYY' | 'DD_MM_YYYY' | 'YYYY_MM_DD',
    });

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
        // TODO: Open edit profile modal
        console.log('Edit profile');
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

    const handleApplyChanges = () => {
        // TODO: Save settings to backend/Redux
        console.log('Apply changes:', { darkMode, language, defaultPriority, defaultStatus, dateFormat });

        // Update original settings
        setOriginalSettings({
            darkMode,
            language,
            defaultPriority,
            defaultStatus,
            dateFormat,
        });

        // Success message could be shown here
        alert('Settings saved successfully!');
    };

    return (
        <SettingsView
            userName={userName}
            userEmail={userEmail}
            userAvatar={userAvatar}
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
