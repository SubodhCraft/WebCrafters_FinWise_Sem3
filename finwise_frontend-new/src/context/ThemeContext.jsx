import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Initialize from localStorage to avoid flash of wrong theme
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved === 'true';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    const value = {
        isDarkMode,
        toggleTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
