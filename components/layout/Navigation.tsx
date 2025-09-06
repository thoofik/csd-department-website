'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ExternalLink } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { NavigationItem } from '../../types';
import ThemeToggle from '../ui/ThemeToggle';
import { useTheme } from '../../contexts/ThemeContext';


const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  // Use theme with fallback to prevent errors
  const themeContext = useTheme();
  const theme = themeContext.theme;

  const navigationItems: NavigationItem[] = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '#about' },
    { name: 'Faculty', href: '#faculty' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Resume Analyzer', href: 'https://screenify-ai.vercel.app/', external: true },
    { name: 'Interview Prep', href: 'https://interview-prep-green.vercel.app/', external: true }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
      isScrolled 
        ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 shadow-soft border-b border-blue-100 backdrop-blur-md dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 dark:border-gray-700 dark:border-gray-600' 
        : 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 shadow-soft backdrop-blur-md dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 dark:shadow-none dark:border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-2 sm:space-x-3"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 relative">
              {/* Logo Container with Clean Design */}
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 p-1 shadow-lg border-2 border-white relative dark:from-blue-900/30 dark:to-blue-800/30">
                {/* Logo Image */}
                <div className="w-full h-full relative flex items-center justify-center">
                  <img 
                    src={theme === 'dark' ? "/dark-logo.png?v=3" : "/light-logo.png?v=3"} 
                    alt="PESITM CSD DESIGNERS Logo" 
                    className="w-[110%] h-[110%] object-contain"
                    onError={(e) => {
                      console.error('Failed to load logo image');
                      e.currentTarget.style.display = 'none';
                    }}
                    loading="eager"
                  />
                </div>
                
                {/* Clean Border */}
                <div className="absolute inset-0 rounded-full border border-blue-200 dark:border-blue-700" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-lg sm:text-xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-white' : 'text-white dark:text-white'
              }`}>PES Institute of Technology and Management</h1>
              <p className={`text-xs sm:text-sm transition-colors duration-300 ${
                isScrolled ? 'text-blue-100' : 'text-blue-100 dark:text-blue-100'
              }`}>CSD Department</p>
            </div>
            {/* Mobile-only logo text */}
            <div className="block sm:hidden">
              <h1 className={`text-sm font-bold transition-colors duration-300 ${
                isScrolled ? 'text-white' : 'text-white dark:text-white'
              }`}>PESITM</h1>
              <p className={`text-xs transition-colors duration-300 ${
                isScrolled ? 'text-blue-100' : 'text-blue-100 dark:text-blue-100'
              }`}>CSD</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`font-medium transition-colors duration-300 relative group flex items-center gap-1 ${
                  isScrolled ? 'text-white hover:text-blue-200' : 'text-white hover:text-blue-200 dark:text-white dark:hover:text-blue-200'
                }`}
                onClick={(e) => {
                  // Skip custom handling for external links
                  if (item.external) return;
                  
                  // For in-page section links like #about, #faculty
                  if (!item.href.startsWith('/')) {
                    e.preventDefault();
                    if (pathname !== '/') {
                      router.push('/' + item.href);
                      return;
                    }
                    const element = document.querySelector(item.href);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      router.push('/' + item.href);
                    }
                  }
                }}
              >
                {item.name}
                {item.external && <ExternalLink className="w-3 h-3" />}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                  isScrolled ? 'bg-blue-200' : 'bg-blue-200 dark:bg-blue-200'
                }`}></span>
              </motion.a>
            ))}
            
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile Header Controls */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Theme Toggle for Mobile - Smaller Size */}
            <div className="scale-75 sm:scale-90">
              <ThemeToggle />
            </div>
            
            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              onClick={toggleMobileMenu}
              className={`p-2 sm:p-3 rounded-xl backdrop-blur-sm border shadow-soft ${
                isScrolled 
                  ? 'bg-white/20 border-white/30 text-white' 
                  : 'bg-white/20 border-white/30 text-white dark:bg-white/20 dark:border-white/30 dark:text-white'
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`lg:hidden backdrop-blur-md border-t shadow-soft ${
              isScrolled 
                ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 border-white/20 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 dark:border-gray-600' 
                : 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 border-white/20 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 dark:shadow-none dark:border-transparent'
            }`}
          >
            <div className="px-4 py-4 sm:py-6 space-y-2 sm:space-y-4">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  onClick={(e) => {
                    closeMobileMenu();
                    
                    // Skip custom handling for external links
                    if (item.external) return;
                    
                    // Handle section links consistently on non-home pages
                    if (!item.href.startsWith('/')) {
                      e.preventDefault();
                      if (pathname !== '/') {
                        router.push('/' + item.href);
                        return;
                      }
                      const element = document.querySelector(item.href);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        router.push('/' + item.href);
                      }
                    }
                  }}
                  className={`flex items-center gap-2 py-2 sm:py-3 px-3 sm:px-4 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                    isScrolled 
                      ? 'text-white hover:text-blue-200 hover:bg-white/10' 
                      : 'text-white hover:text-blue-200 hover:bg-white/10 dark:text-white dark:hover:text-blue-200 dark:hover:bg-white/10'
                  }`}
                >
                  {item.name}
                  {item.external && <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
