'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useTheme } from 'next-themes';
import { useTransactions } from '@/context/TransactionContext';
import { getMonthlyComparison } from '@/lib/analytics';
import { formatINR } from '@/lib/formatters';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export function MonthlyComparisonChart() {
  const { resolvedTheme } = useTheme();
  const { transactions } = useTransactions();
  const data = getMonthlyComparison(transactions).reverse(); // Oldest to newest horizontally
  const isDark = resolvedTheme === 'dark';
  const cursorFill = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)';
  const gridStroke = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-panel p-6 rounded-2xl h-full flex flex-col relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-500/[0.07] dark:bg-accent-emerald/5 blur-[80px] rounded-full -ml-10 -mt-10" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-text-primary tracking-widest uppercase">
            Flow History
          </h2>
          <p className="text-[10px] text-slate-500 dark:text-text-muted font-bold uppercase tracking-widest mt-1">Income vs Expenses (6M)</p>
        </div>
        <div className="p-2 bg-slate-100/80 dark:bg-surface-hover rounded-xl border border-slate-200/80 dark:border-surface-border">
          <Activity className="w-4 h-4 text-slate-500 dark:text-text-muted" />
        </div>
      </div>

      <div className="flex-1 min-h-[250px] relative z-10">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#5b21b6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={gridStroke} vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                stroke="transparent"
                dy={10}
              />
              <YAxis
                tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                stroke="transparent"
                tickFormatter={(value) => {
                  if (value >= 100000) return `${(value / 100000).toFixed(0)}L`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                  return value;
                }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-background backdrop-blur-md border border-slate-200 dark:border-surface-border p-4 rounded-xl shadow-xl flex flex-col gap-2">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-text-muted">{label}</p>
                        {payload.map((entry) => {
                          const name = entry.name as string;
                          const value = entry.value as number;
                          const color = entry.color;
                          return (
                            <div key={name} className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                                <span className="text-xs font-semibold text-slate-500 dark:text-text-muted capitalize">{name}</span>
                              </div>
                              <span className="font-display font-bold text-slate-800 dark:text-text-primary pl-3.5">
                                {formatINR(value)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                }}
                cursor={{ fill: cursorFill }}
              />
              <Legend
                wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}
                iconType="circle"
                iconSize={6}
              />
              <Bar
                dataKey="income"
                name="Income"
                fill="url(#incomeGradient)"
                radius={[4, 4, 0, 0]}
                barSize={12}
                animationBegin={200}
                animationDuration={1000}
              />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="url(#expenseGradient)"
                radius={[4, 4, 0, 0]}
                barSize={12}
                animationBegin={400}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-text-muted font-bold uppercase tracking-widest">
            Waiting for activity
          </div>
        )}
      </div>
    </motion.div>
  );
}