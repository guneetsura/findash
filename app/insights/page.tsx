'use client';

import { Header } from '@/components/layout/Header';
import { TopCategoryCard } from '@/components/insights/TopCategoryCard';
import { MonthlyComparisonChart } from '@/components/insights/MonthlyComparisonChart';
import { InsightBadges } from '@/components/insights/InsightBadges';
import { motion } from 'framer-motion';

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-accent-violet/20">
      {/* Background ambient glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/[0.05] dark:bg-accent-violet/5 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col max-w-[1600px] mx-auto">
        <Header 
          title="Intelligence" 
          subtitle="Data-driven financial insights" 
        />
        
        <main className="p-6 md:p-10 flex flex-col gap-8">
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex items-center gap-2"
          >
            <div className="w-1.5 h-6 bg-accent-violet rounded-full" />
            <h2 className="font-display text-xl font-bold text-text-primary tracking-widest uppercase">
              Financial Analysis
            </h2>
          </motion.div>

          {/* Grid Layout */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Top Category + Badges */}
            <div className="lg:col-span-4 flex flex-col gap-6">
               <div className="h-[250px]">
                 <TopCategoryCard />
               </div>
               
               <div className="flex flex-col gap-4 mt-2">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted pl-1">
                   Algorithmic Discoveries
                 </h3>
                 <InsightBadges />
               </div>
            </div>

            {/* Right Column: Chart */}
            <div className="lg:col-span-8 flex flex-col gap-6">
               <div className="h-[450px]">
                 <MonthlyComparisonChart />
               </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}