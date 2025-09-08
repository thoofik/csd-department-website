'use client';

import React, { useState, useEffect } from 'react';
import { VerticalFloatingDock } from '@/components/ui/vertical-floating-dock';
import { Users, GraduationCap, FileText, Briefcase } from 'lucide-react';

export default function TestFloatingDockPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Test Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Test Vertical Floating Dock
        </h1>
        
        <div className="space-y-8">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Test Section {i + 1}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This is test content to make the page scrollable. Scroll down to see the vertical floating dock appear on the left side.
                The floating dock should have interactive effects when you hover over the icons.
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Instructions:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-blue-800 dark:text-blue-200">
            <li>Scroll down to trigger the vertical floating dock</li>
            <li>Hover over the icons to see subtle scaling effects (48px → 60px)</li>
            <li>Notice the increased gap between buttons for better spacing</li>
            <li>Move your mouse vertically to see proximity-based scaling</li>
            <li>Click on icons to navigate</li>
            <li>Use the theme toggle at the bottom to switch between light/dark mode</li>
            <li>Notice the transparent glass-morphism effect in dark mode</li>
          </ul>
        </div>
      </div>

      {/* Vertical Floating Dock */}
      {isScrolled && (
        <VerticalFloatingDock 
          items={navigationItems} 
          className="transition-all duration-700"
        />
      )}
    </div>
  );
}
