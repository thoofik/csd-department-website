'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, BarChart3 } from 'lucide-react';
import Button from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';


const HeroSection: React.FC = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Use theme with fallback to prevent errors
  const themeContext = useTheme();
  const theme = themeContext.theme;

  const animatedTexts = [
    "Computer Science & Design",
    "Innovation & Technology",
    "Future-Ready Education",
    "Excellence in Learning"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % animatedTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [animatedTexts.length]);

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-10 dark:opacity-20" />
      
      {/* Floating Elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y, opacity }}
      >
        {/* Large floating circles */}
        <div className="absolute top-20 left-4 sm:left-10 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-blue-200/20 dark:bg-blue-400/10 rounded-full animate-float blur-3xl" />
        <div className="absolute top-40 right-4 sm:right-20 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-blue-100/30 dark:bg-blue-300/10 rounded-full animate-float blur-3xl" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-4 sm:left-20 w-28 h-28 sm:w-40 sm:h-40 md:w-56 md:h-56 bg-blue-200/20 dark:bg-blue-400/10 rounded-full animate-float blur-3xl" style={{ animationDelay: '2s' }} />
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/4 right-1/4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-2 border-blue-200/30 dark:border-blue-400/20 rounded-2xl rotate-45 animate-float opacity-20" />
        <div className="absolute bottom-1/3 right-1/3 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-blue-100/30 dark:bg-blue-300/10 rounded-full animate-float opacity-15" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 left-1/3 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-200/20 dark:bg-blue-400/10 rounded-lg animate-float opacity-20" style={{ animationDelay: '0.5s' }} />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-7xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-2 sm:mb-3"
          >
            <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 mx-auto relative">
              <img 
                src={theme === 'dark' ? "/dark-logo.png?v=3" : "/light-logo.png?v=3"} 
                alt="PESITM CSD DESIGNERS Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Failed to load logo image');
                  e.currentTarget.style.display = 'none';
                }}
                loading="eager"
              />
              
              {/* Subtle Floating Elements */}
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-blue-300/20 dark:bg-blue-400/20 rounded-full animate-pulse" />
              <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 bg-blue-200/30 dark:bg-blue-300/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-shadow-lg">
              <span className="block text-gray-800 dark:text-gray-100 mb-2 sm:mb-3">Welcome to</span>
              <motion.span
                key={currentTextIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-blue-600 dark:text-blue-400 display-font"
              >
                {animatedTexts[currentTextIndex]}
              </motion.span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium px-2 sm:px-0">
              Developing students experienced with computing approaches, design tools, 
              and new digital media technologies for the future of technology.
            </p>
          </motion.div>
        </div>
      </div>
      
    </section>
  );
};

export default HeroSection;
