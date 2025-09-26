'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
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
      },
      setTheme: () => {
        // Silent fallback
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
      // Get theme from localStorage or detect system preference
      const savedTheme = localStorage.getItem('theme') as Theme;
      
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        console.log('Using saved theme:', savedTheme);
        setTheme(savedTheme);
      } else {
        // Auto-detect system theme preference on first visit
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemTheme = systemPrefersDark ? 'dark' : 'light';
        console.log('System prefers dark:', systemPrefersDark, 'Setting theme to:', systemTheme);
        setTheme(systemTheme);
      }
    } catch (error) {
      console.log('Error in theme detection, falling back to light');
      // Fallback to light theme if there's an error
      setTheme('light');
    }
  }, []);

  // Listen for system theme changes when no user preference is set
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      // Only auto-switch if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(systemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted]);

  // Apply theme to DOM
  useEffect(() => {
    if (mounted) {
      try {
        const root = window.document.documentElement;
        
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        
        // Save the theme preference
        localStorage.setItem('theme', theme);
      } catch (error) {
        // Silent error handling
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // Function to reset theme to system detection
  const resetToSystemTheme = () => {
    try {
      localStorage.removeItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = systemPrefersDark ? 'dark' : 'light';
      console.log('Resetting to system theme:', systemTheme);
      setTheme(systemTheme);
    } catch (error) {
      console.log('Error resetting theme, falling back to light');
      setTheme('light');
    }
  };

  // Always render the provider with consistent theme
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      setTheme: handleSetTheme 
    }}>
      <div suppressHydrationWarning>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
