'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export function Skeleton({ 
  className = '', 
  width = '100%', 
  height = '1rem', 
  rounded = false 
}: SkeletonProps) {
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
      style={{ width, height }}
    />
  );
}

export function FacultyCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-xl overflow-hidden mb-3">
          <Skeleton width="100%" height="100%" />
        </div>
        <Skeleton width="80%" height="1.2rem" className="mx-auto mb-2" />
        <Skeleton width="60%" height="1rem" className="mx-auto mb-1" />
        <Skeleton width="40%" height="0.8rem" className="mx-auto" />
      </div>
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Skeleton width="200px" height="2rem" className="mx-auto mb-6" />
          <Skeleton width="400px" height="3rem" className="mx-auto mb-4" />
          <Skeleton width="600px" height="1.5rem" className="mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <FacultyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
