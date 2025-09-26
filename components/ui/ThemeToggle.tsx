'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  // Use theme with fallback to prevent errors
  let theme: 'light' | 'dark' = 'light';
  let toggleTheme: () => void = () => {};
  
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    toggleTheme = themeContext.toggleTheme;
  } catch (error) {
    // Fallback to light theme if context is not available
    theme = 'light';
    toggleTheme = () => {
      console.warn('Theme toggle not available');
    };
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-gray-200 dark:border-gray-600 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-white/30 dark:hover:bg-gray-800/30"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-400" />
        )}
      </motion.div>
      
      {/* Theme indicator ring */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-transparent"
        animate={{
          borderColor: theme === 'light' 
            ? 'rgba(59, 130, 246, 0.3)' // Blue for light
            : 'rgba(251, 191, 36, 0.3)', // Yellow for dark
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

export default ThemeToggle;
