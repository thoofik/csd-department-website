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
    return {
      theme: 'light' as Theme,
      toggleTheme: () => {
        // Silent fallback to prevent console warnings during SSR
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
        // Silent error handling
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Always render the provider with consistent theme
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div suppressHydrationWarning>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
