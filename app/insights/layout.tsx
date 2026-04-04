'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';

export default function InsightsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="md:pl-64">
        <div className="pb-16 md:pb-0">{children}</div>
      </div>
    </div>
  );
}
