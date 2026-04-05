'use client';

import { useTransactions } from '@/context/TransactionContext';
import { getTopCategory } from '@/lib/analytics';
import { CATEGORY_LABELS } from '@/constants/categories';
import { formatINR } from '@/lib/formatters';
import { Trophy, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export function TopCategoryCard() {
  const { transactions } = useTransactions();
  const topCategory = getTopCategory(transactions);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 rounded-2xl relative overflow-hidden group h-full flex flex-col justify-between"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/[0.07] dark:bg-accent-violet/10 blur-[60px] rounded-full -mr-10 -mt-10" />

      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
           <div className="p-2 bg-violet-100 dark:bg-accent-violet/10 rounded-xl border border-violet-200/80 dark:border-accent-violet/20">
             <Trophy className="w-4 h-4 text-violet-600 dark:text-accent-violet" />
           </div>
           <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-text-muted">Primary Outflow</span>
        </div>
      </div>

      <div className="relative z-10">
        {topCategory ? (
          <div className="flex flex-col gap-1">
            <h3 className="font-display text-4xl font-bold text-slate-900 dark:text-text-primary uppercase tracking-wider">
              {CATEGORY_LABELS[topCategory.category]}
            </h3>
            <p className="font-display text-2xl font-semibold text-violet-600 dark:text-accent-violet mt-1">
              {formatINR(topCategory.amount)}
            </p>

            <div className="mt-6">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-text-muted mb-2">
                 <span>Share of total expenses</span>
                 <span>{topCategory.percentage.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-slate-100/80 dark:bg-surface-hover rounded-full overflow-hidden">
                 <motion.div
                   initial={{ width: 0 }}
                   animate={{ width: `${topCategory.percentage}%` }}
                   transition={{ duration: 1, delay: 0.5, type: "spring" }}
                   className="h-full bg-violet-500 dark:bg-accent-violet shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                 />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 gap-2 text-slate-500 dark:text-text-muted">
             <AlertTriangle className="w-8 h-8 opacity-50" />
             <span className="text-xs uppercase tracking-widest font-bold text-center">Insufficient data to calculate insights</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
