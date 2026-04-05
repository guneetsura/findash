'use client';

import { Header } from '@/components/layout/Header';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { BalanceTrendChart } from '@/components/dashboard/BalanceTrendChart';
import { SpendingBreakdownChart } from '@/components/dashboard/SpendingBreakdownChart';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-accent-emerald/20">
      {/* Background ambient glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/[0.07] dark:bg-accent-emerald/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/[0.06] dark:bg-accent-violet/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex flex-col max-w-[1600px] mx-auto">
        <Header 
          title="Overview" 
          subtitle="Real-time financial intelligence & analytics" 
        />
        
        <main className="p-6 md:p-10 flex flex-col gap-10">
          {/* Section: Key Insights */}
          <section className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2"
            >
              <div className="w-1.5 h-6 bg-accent-emerald rounded-full" />
              <h2 className="font-display text-xl font-bold text-text-primary tracking-widest uppercase">
                Key Pulse
              </h2>
            </motion.div>
            <SummaryCards />
          </section>

          {/* Section: Visual Analytics */}
          <section className="flex flex-col gap-6">
             <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2"
            >
              <div className="w-1.5 h-6 bg-accent-violet rounded-full" />
              <h2 className="font-display text-xl font-bold text-text-primary tracking-widest uppercase">
                Financial Velocity
              </h2>
            </motion.div>
            <div className="grid gap-6 lg:grid-cols-2">
              <BalanceTrendChart />
              <SpendingBreakdownChart />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}