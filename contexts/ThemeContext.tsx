'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return a default theme instead of throwing an error
    console.warn('useTheme must be used within a ThemeProvider, using default light theme');
    return {
      theme: 'light' as Theme,
      toggleTheme: () => {
        console.warn('Theme toggle not available outside ThemeProvider');
      }
    };
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    try {
      // Get theme from localStorage or system preference
      const savedTheme = localStorage.getItem('theme') as Theme;
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setTheme(savedTheme);
      } else {
        setTheme(systemTheme);
      }
    } catch (error) {
      // Fallback to light theme if there's an error
      console.warn('Error loading theme preference, using light theme:', error);
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
      } catch (error) {
        console.warn('Error applying theme:', error);
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <div className="light">{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
