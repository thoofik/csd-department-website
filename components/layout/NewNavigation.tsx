'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HoveredLink, Menu, MenuItem, ProductItem } from '@/components/ui/navbar-menu';
import { cn } from '@/lib/utils';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';
import { Users, GraduationCap, FileText, Briefcase } from 'lucide-react';

const NewNavigation: React.FC = () => {
  const [active, setActive] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const themeContext = useTheme();
  const theme = themeContext.theme;

  const handleNavbarClick = () => {
    setActive(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navigation */}
      <div className={cn(
        "hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled && "opacity-0 pointer-events-none"
      )}>
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative top-4 inset-x-0 max-w-[95%] mx-auto px-8"
        >
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <img
                src={theme === 'dark' ? '/dark-logo.png' : '/light-logo.png'}
                alt="CSD Department Logo"
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                  CSD Department
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  PESITM
                </p>
              </div>
            </motion.a>

            {/* Desktop Navigation Menu */}
            <div className="flex items-center space-x-8">
              <a 
                href="/#about" 
                onClick={handleNavbarClick}
                className="flex items-center space-x-3 group hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full px-4 py-2 transition-all duration-300 hover:scale-110 active:scale-90"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors duration-200">
                  <Users className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                  About
                </span>
              </a>
              
              <a 
                href="/analytics" 
                onClick={handleNavbarClick}
                className="flex items-center space-x-3 group hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full px-4 py-2 transition-all duration-300 hover:scale-110 active:scale-90"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors duration-200">
                  <GraduationCap className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                  Academics
                </span>
              </a>
              
              <a 
                href="https://screenify-ai.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={handleNavbarClick}
                className="flex items-center space-x-3 group hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full px-4 py-2 transition-all duration-300 hover:scale-110 active:scale-90"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors duration-200">
                  <FileText className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                  Resume Analyzer
                </span>
              </a>
              
              <a 
                href="https://interview-prep-green.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={handleNavbarClick}
                className="flex items-center space-x-3 group hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full px-4 py-2 transition-all duration-300 hover:scale-110 active:scale-90"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors duration-200">
                  <Briefcase className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                  Interview Prep
                </span>
              </a>
            </div>

            {/* Desktop Theme Toggle */}
            <ThemeToggle />
          </div>
        </motion.div>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "md:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled && "opacity-0 pointer-events-none"
      )}>
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative top-4 inset-x-0 max-w-[95%] mx-auto px-4"
        >
          <div className="flex items-center justify-between">
            {/* Mobile Logo - Top Left */}
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <img
                src={theme === 'dark' ? '/dark-logo.png' : '/light-logo.png'}
                alt="CSD Department Logo"
                className="h-8 w-auto"
              />
              <div>
                <h1 className="text-sm font-bold text-gray-800 dark:text-white">
                  CSD Department
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  PESITM
                </p>
              </div>
            </motion.a>

            {/* Mobile Controls - Top Right */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setActive(active ? null : 'mobile')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Vertical sidebar when scrolling - Desktop only */}
      <div className={cn(
        "hidden md:block fixed left-4 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-700",
        isScrolled ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col space-y-3"
        >
            {/* Vertical navigation buttons */}
            <a 
              href="/#about" 
              onClick={handleNavbarClick}
              className="relative group flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 active:scale-90"
            >
              <Users className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              {/* Hover tooltip */}
              <div className="absolute left-14 bg-gray-800 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                About
              </div>
            </a>
            
            <a 
              href="/analytics" 
              onClick={handleNavbarClick}
              className="relative group flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 active:scale-90"
            >
              <GraduationCap className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              {/* Hover tooltip */}
              <div className="absolute left-14 bg-gray-800 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                Academics
              </div>
            </a>
            
            <a 
              href="https://screenify-ai.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleNavbarClick}
              className="relative group flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 active:scale-90"
            >
              <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              {/* Hover tooltip */}
              <div className="absolute left-14 bg-gray-800 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                Resume Analyzer
              </div>
            </a>
            
            <a 
              href="https://interview-prep-green.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleNavbarClick}
              className="relative group flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 active:scale-90"
            >
              <Briefcase className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              {/* Hover tooltip */}
              <div className="absolute left-14 bg-gray-800 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                Interview Prep
              </div>
            </a>

            {/* Theme toggle at bottom */}
            <div className="pt-2">
              <ThemeToggle />
            </div>
        </motion.div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={cn(
          "md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-300",
          active === 'mobile' ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={handleNavbarClick}
      >
        <div 
          className="absolute right-4 top-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-4 w-64"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col space-y-3">
            <a 
              href="/#about" 
              onClick={handleNavbarClick}
              className="flex items-center space-x-3 group hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors duration-200"
            >
              <Users className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                About
              </span>
            </a>
            
            <a 
              href="/analytics" 
              onClick={handleNavbarClick}
              className="flex items-center space-x-3 group hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors duration-200"
            >
              <GraduationCap className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                Academics
              </span>
            </a>
            
            <a 
              href="https://screenify-ai.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleNavbarClick}
              className="flex items-center space-x-3 group hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors duration-200"
            >
              <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                Resume Analyzer
              </span>
            </a>
            
            <a 
              href="https://interview-prep-green.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleNavbarClick}
              className="flex items-center space-x-3 group hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors duration-200"
            >
              <Briefcase className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                Interview Prep
              </span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewNavigation;
