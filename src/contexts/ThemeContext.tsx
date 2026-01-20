import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useFetchSettings } from '@/api/queries/settings.queries';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('dark'); // Default to dark while loading

    // Fetch user settings to get theme preference
    const { data: settings, isLoading } = useFetchSettings();

    // Update theme when settings are loaded
    useEffect(() => {
        if (settings && !isLoading) {
            const userTheme = settings.theme === 'DARK' ? 'dark' : 'light';
            setTheme(userTheme);
        }
    }, [settings, isLoading]);

    // Apply theme to document
    useEffect(() => {
        const root = window.document.documentElement;

        // Remove previous theme class
        root.classList.remove('light', 'dark');

        // Add current theme class
        root.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
