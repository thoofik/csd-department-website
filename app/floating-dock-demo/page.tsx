import React from "react";
import FloatingDockDemo from "@/components/floating-dock-demo";
import { VerticalFloatingDock } from "@/components/ui/vertical-floating-dock";
import { Users, GraduationCap, FileText, Briefcase } from "lucide-react";

export default function FloatingDockDemoPage() {
  const verticalItems = [
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Floating Dock Components Demo
        </h1>
        
        {/* Horizontal Floating Dock Demo */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
            Horizontal Floating Dock (Desktop)
          </h2>
          <FloatingDockDemo />
        </div>

        {/* Vertical Floating Dock Demo */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
            Vertical Floating Dock (Scrolling State)
          </h2>
          <div className="relative h-96 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <VerticalFloatingDock items={verticalItems} />
            <div className="p-8">
              <p className="text-gray-600 dark:text-gray-400">
                This vertical floating dock appears on the left side when scrolling.
                Hover over the icons to see the interactive effects and tooltips.
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            How it works:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-blue-800 dark:text-blue-200">
            <li>The horizontal dock is designed for desktop navigation bars</li>
            <li>The vertical dock is perfect for scrolling sidebars</li>
            <li>Both components use Framer Motion for smooth animations</li>
            <li>Hover effects include scaling and tooltip displays</li>
            <li>Components are fully responsive and theme-aware</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
