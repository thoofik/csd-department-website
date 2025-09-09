'use client';

import React from 'react';
import InfiniteMovingCardsDemo from '../../components/infinite-moving-cards-demo';

export default function InfiniteMovingCardsDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Infinite Moving Cards Demo
        </h1>
        <InfiniteMovingCardsDemo />
      </div>
    </div>
  );
}
