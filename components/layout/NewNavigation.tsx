'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HoveredLink, Menu, MenuItem, ProductItem } from '@/components/ui/navbar-menu';
import { VerticalFloatingDock } from '@/components/ui/vertical-floating-dock';
import { cn } from '@/lib/utils';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';
import { Users, GraduationCap, FileText, Briefcase } from 'lucide-react';

const NewNavigation: React.FC = () => {
  const [active, setActive] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const themeContext = useTheme();
  const theme = themeContext.theme;

  const handleNavbarClick = () => {
    setActive(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation items for the vertical floating dock
  const navigationItems = [
    {
      title: "About",
      icon: <Users className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/#hero",
    },
    {
      title: "Academics",
      icon: <GraduationCap className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/analytics",
    },
    {
      title: "Resume Analyzer",
      icon: <FileText className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://screenify-ai.vercel.app/",
    },
    {
      title: "Interview Prep",
      icon: <Briefcase className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://interview-prep-green.vercel.app/",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
      setShowScrollToTop(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
                href="/#hero" 
                onClick={handleNavbarClick}
                className="flex items-center space-x-3 group hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full px-4 py-2 transition-all duration-300 hover:scale-110 active:scale-90"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors duration-200">
                  <Users className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
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
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                  Student Analytics
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
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
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
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                  Interview Prep
                </span>
              </a>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </motion.div>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "md:hidden fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled && "opacity-0 pointer-events-none"
      )}>
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative top-4 inset-x-0 w-full px-4"
        >
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between p-4">
              {/* Mobile Logo */}
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
              
              {/* Mobile Controls */}
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  aria-label="Toggle mobile menu"
                >
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Mobile Menu - No Container */}
            {isMobileMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 py-2 z-50">
                <a 
                  href="/#hero" 
                  onClick={() => {
                    handleNavbarClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 group hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors duration-200 w-full"
                >
                  <Users className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                    About
                  </span>
                </a>
                
                <a 
                  href="/analytics" 
                  onClick={() => {
                    handleNavbarClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 group hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors duration-200 w-full"
                >
                  <GraduationCap className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                    Analytics
                  </span>
                </a>
                
                <a 
                  href="https://screenify-ai.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => {
                    handleNavbarClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 group hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors duration-200 w-full"
                >
                  <FileText className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                    Resume Analyzer
                  </span>
                </a>
                
                <a 
                  href="https://interview-prep-green.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => {
                    handleNavbarClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 group hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors duration-200 w-full"
                >
                  <Briefcase className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                    Interview Prep
                  </span>
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button - Mobile Only */}
      {showScrollToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className="md:hidden fixed bottom-6 right-6 z-50 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors duration-200"
          aria-label="Scroll to top"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 10l7-7m0 0l7 7m-7-7v18" 
            />
          </svg>
        </motion.button>
      )}

      {/* Vertical Floating Dock - Desktop Only */}
      <div className="hidden md:block">
        <VerticalFloatingDock items={navigationItems} />
      </div>
    </>
  );
};

export default NewNavigation;