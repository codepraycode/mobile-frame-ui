import { useState, useEffect } from 'react';
import { brand } from '../config/brand';

type Theme = 'light' | 'dark';

export function useTheme() {
    const appName = brand.appName;
    const themeStoreKey = `${appName}-theme`;

    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem(themeStoreKey);
        if (saved === 'light' || saved === 'dark') return saved;
        // Default to light mode as requested
        return 'light';
    });

    useEffect(() => {
        localStorage.setItem(themeStoreKey, theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return { theme, toggleTheme };
}
