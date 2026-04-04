'use client';

import { useTransactions } from '@/context/TransactionContext';
import { getInsights } from '@/lib/analytics';
import { Insight } from '@/types';
import { formatINR } from '@/lib/formatters';
import { AlertCircle, TrendingDown, TrendingUp, PiggyBank, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

function InsightIcon({ type }: { type: Insight['type'] }) {
  switch (type) {
    case 'savings':
      return <PiggyBank className="w-5 h-5 text-accent-emerald" />;
    case 'spending':
      return <TrendingDown className="w-5 h-5 text-accent-violet" />;
    case 'trend':
      return <TrendingUp className="w-5 h-5 text-blue-400" />;
    case 'alert':
      return <AlertCircle className="w-5 h-5 text-rose-400" />;
    default:
      return <Sparkles className="w-5 h-5 text-amber-400" />;
  }
}

export function InsightBadges() {
  const { transactions } = useTransactions();
  const insights = getInsights(transactions);

  if (insights.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      {insights.map((insight, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className="glass-panel p-4 rounded-xl flex items-start gap-4 border border-surface-border hover:bg-surface-hover transition-colors relative overflow-hidden group"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-surface-border to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="p-2.5 rounded-xl bg-surface-hover border border-surface-border shrink-0 shadow-inner">
             <InsightIcon type={insight.type} />
          </div>

          <div className="flex flex-col justify-center py-1">
             <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Auto-Generated</span>
                <div className="w-1 h-1 rounded-full bg-accent-emerald animate-pulse" />
             </div>
             <p className="text-sm font-medium text-text-primary">
               {insight.message}
             </p>
             {insight.value !== undefined && insight.type !== 'alert' && (
                <p className="font-display font-bold text-text-primary mt-2 tracking-wide">
                  {formatINR(insight.value)}
                </p>
             )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
