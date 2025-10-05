'use client';

import React from 'react';
import ResumeStorage from '../../components/resume/ResumeStorage';
import NewNavigation from '../../components/layout/NewNavigation';

export default function ResumeStoragePage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <NewNavigation />
      <ResumeStorage />
    </main>
  );
}
