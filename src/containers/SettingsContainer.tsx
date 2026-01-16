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
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Original values to track changes
    const [originalSettings, setOriginalSettings] = useState({
        darkMode: true,
        language: 'en' as 'en' | 'es',
        emailNotifications: true,
    });

    // Check if settings have changed
    useEffect(() => {
        const changed =
            darkMode !== originalSettings.darkMode ||
            language !== originalSettings.language ||
            emailNotifications !== originalSettings.emailNotifications;
        setHasChanges(changed);
    }, [darkMode, language, emailNotifications, originalSettings]);

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

    const handleEmailNotificationsToggle = () => {
        setEmailNotifications(!emailNotifications);
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
        setEmailNotifications(originalSettings.emailNotifications);
    };

    const handleApplyChanges = () => {
        // TODO: Save settings to backend/Redux
        console.log('Apply changes:', { darkMode, language, emailNotifications });

        // Update original settings
        setOriginalSettings({
            darkMode,
            language,
            emailNotifications,
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
            emailNotifications={emailNotifications}
            hasChanges={hasChanges}
            onEditProfile={handleEditProfile}
            onDarkModeToggle={handleDarkModeToggle}
            onLanguageChange={handleLanguageChange}
            onEmailNotificationsToggle={handleEmailNotificationsToggle}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
            onDiscard={handleDiscard}
            onApplyChanges={handleApplyChanges}
        />
    );
};
