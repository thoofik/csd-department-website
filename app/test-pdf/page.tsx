'use client';

import React from 'react';

export default function TestPDFPage() {
  const openPDF = (filename: string) => {
    console.log('Opening PDF:', filename);
    const url = `/${filename}`;
    console.log('PDF URL:', url);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
          PDF Test Page
        </h1>
        
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test PDF Links</h2>
            
            <div className="space-y-2">
              <button
                onClick={() => openPDF('CSD Newsletter 2023.pdf')}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-4"
              >
                Open 2023 Newsletter
              </button>
              
              <button
                onClick={() => openPDF('CSD Newsletter 2024_20250804_130023_0000.pdf')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Open 2024 Newsletter
              </button>
            </div>
            
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>Check the browser console for any error messages.</p>
              <p>If the PDFs don't open, there might be a browser security issue or the files might be corrupted.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
