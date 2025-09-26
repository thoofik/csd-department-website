'use client';

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { Sun, Moon } from 'lucide-react';

export default function TestThemePage() {
  const { theme, setTheme } = useTheme();

  const resetToSystemTheme = () => {
    localStorage.removeItem('theme');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Theme Testing Page
        </h1>
        
        <div className="space-y-6">
          {/* Current Theme Status */}
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Current Theme Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Current Theme:</strong> {theme}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Auto-detection:</strong> Website automatically detects system theme on first visit
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {theme === 'light' && <Sun className="w-5 h-5 text-blue-500" />}
                {theme === 'dark' && <Moon className="w-5 h-5 text-yellow-500" />}
                <span className="text-gray-600 dark:text-gray-300">
                  {theme === 'light' ? 'Light Theme' : 'Dark Theme'}
                </span>
              </div>
            </div>
          </div>

          {/* Theme Controls */}
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Theme Controls
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <span className="text-gray-600 dark:text-gray-300">
                  Toggle Button (switches between: light ↔ dark)
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    theme === 'light'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={resetToSystemTheme}
                  className="px-4 py-2 rounded-lg font-medium transition-colors bg-green-500 text-white hover:bg-green-600"
                >
                  Reset to System
                </button>
              </div>
            </div>
          </div>

          {/* Test Content */}
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Test Content
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                This page demonstrates the theme switching functionality. Try the following:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Use the toggle button to switch between light and dark themes</li>
                <li>Use the individual theme buttons to set specific themes</li>
                <li>Clear your browser's localStorage to test automatic system theme detection</li>
                <li>Notice how the website automatically detects your system theme on first visit</li>
              </ul>
            </div>
          </div>

          {/* Color Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Blue Section
              </h3>
              <p className="text-blue-600 dark:text-blue-300">
                This section shows how blue colors adapt to the theme.
              </p>
            </div>
            
            <div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                Green Section
              </h3>
              <p className="text-green-600 dark:text-green-300">
                This section shows how green colors adapt to the theme.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
