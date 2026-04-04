'use client';

import { useTransactions } from '@/context/TransactionContext';
import { getTotals, getTotalBalance, getLastMonthTotals } from '@/lib/analytics';
import { formatINR, formatDelta } from '@/lib/formatters';
import { motion, type Variants } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function SummaryCards() {
  const { transactions } = useTransactions();

  const totals = getTotals(transactions);
  const lastMonthTotals = getLastMonthTotals(transactions);
  const totalBalance = getTotalBalance(transactions);

  const incomeDelta = formatDelta(totals.income, lastMonthTotals.income);
  const expenseDelta = formatDelta(totals.expenses, lastMonthTotals.expenses);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {/* Total Balance Card */}
      <motion.div variants={item} className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-emerald/10 blur-[80px] rounded-full -mr-10 -mt-10" />
        <div className="flex items-center justify-between relative z-10">
          <div className="p-3 rounded-xl bg-surface-hover border border-surface-border group-hover:bg-surface-hover/80 transition-colors">
            <Wallet className="w-5 h-5 text-accent-emerald" />
          </div>
          <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Total Assets</span>
        </div>
        <div className="mt-6 relative z-10">
          <p className="text-sm font-medium text-text-muted">Net Worth</p>
          <p className="font-display text-4xl font-bold mt-1 text-text-primary tracking-tight">
            {formatINR(totalBalance)}
          </p>
        </div>
        <div className="mt-6 flex items-center gap-2 text-xs text-text-muted relative z-10 uppercase tracking-widest font-semibold opacity-60">
          Integrated accounts active
        </div>
      </motion.div>

      {/* Monthly Income Card */}
      <motion.div variants={item} className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-emerald/5 blur-[60px] rounded-full -mr-10 -mt-10" />
        <div className="flex items-center justify-between relative z-10">
          <div className="p-3 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 group-hover:bg-accent-emerald/20 transition-colors">
            <TrendingUp className="w-5 h-5 text-accent-emerald" />
          </div>
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${incomeDelta.isPositive ? 'bg-accent-emerald/20 text-accent-emerald' : 'bg-red-400/20 text-red-400'}`}>
            {incomeDelta.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {incomeDelta.value}
          </div>
        </div>
        <div className="mt-6 relative z-10">
          <p className="text-sm font-medium text-text-muted">Monthly Inflow</p>
          <p className="font-display text-4xl font-bold mt-1 text-text-primary tracking-tight">
            {formatINR(totals.income)}
          </p>
        </div>
        <p className="mt-6 text-xs text-text-muted uppercase tracking-widest font-semibold opacity-60">
          vs. previous 30 days
        </p>
      </motion.div>

      {/* Monthly Expense Card */}
      <motion.div variants={item} className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-violet/5 blur-[60px] rounded-full -mr-10 -mt-10" />
        <div className="flex items-center justify-between relative z-10">
          <div className="p-3 rounded-xl bg-accent-violet/10 border border-accent-violet/20 group-hover:bg-accent-violet/20 transition-colors">
            <TrendingDown className="w-5 h-5 text-accent-violet" />
          </div>
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${expenseDelta.isPositive ? 'bg-accent-violet/20 text-accent-violet' : 'bg-accent-emerald/20 text-accent-emerald'}`}>
            {expenseDelta.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {expenseDelta.value}
          </div>
        </div>
        <div className="mt-6 relative z-10">
          <p className="text-sm font-medium text-text-muted">Monthly Outflow</p>
          <p className="font-display text-4xl font-bold mt-1 text-text-primary tracking-tight">
            {formatINR(totals.expenses)}
          </p>
        </div>
        <p className="mt-6 text-xs text-text-muted uppercase tracking-widest font-semibold opacity-60">
          vs. previous 30 days
        </p>
      </motion.div>
    </motion.div>
  );
}