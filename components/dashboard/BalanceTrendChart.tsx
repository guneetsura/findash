'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTransactions } from '@/context/TransactionContext';
import { getDailyBalance } from '@/lib/analytics';
import { formatDateShort, formatINR } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const CHART_COLORS = {
  emerald: 'var(--chart-emerald)',
  violet: 'var(--chart-violet)',
  slate: 'var(--chart-slate)',
};

type Period = '30D' | '90D' | '6M';

const periods: { value: Period; label: string; days: number }[] = [
  { value: '30D', label: '30D', days: 30 },
  { value: '90D', label: '90D', days: 90 },
  { value: '6M', label: '6M', days: 180 },
];

export function BalanceTrendChart() {
  const [period, setPeriod] = useState<Period>('90D');
  const { transactions } = useTransactions();

  const selectedPeriod = periods.find((p) => p.value === period);

  const chartData = useMemo(() => {
    if (!selectedPeriod) return [];
    const data = getDailyBalance(transactions, selectedPeriod.days);
    return data.map((d) => ({
      date: formatDateShort(d.date),
      balance: d.balance,
    }));
  }, [transactions, selectedPeriod]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-panel rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-xl font-bold text-text-primary tracking-tight">
            Balance Trend
          </h2>
          <p className="text-xs text-text-muted font-medium uppercase tracking-wider mt-1">Growth analysis</p>
        </div>
        <div className="flex p-1 rounded-full bg-surface-hover border border-surface-border gap-1">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300',
                period === p.value
                  ? 'bg-accent-emerald text-background'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full mt-4">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="60%" stopColor="#10b981" stopOpacity={0.05} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="currentColor"
                className="text-surface-border"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fontWeight: 600, fill: 'currentColor' }}
                className="text-text-muted"
                stroke="transparent"
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fontSize: 10, fontWeight: 600, fill: 'currentColor' }}
                className="text-text-muted"
                stroke="transparent"
                tickLine={false}
                axisLine={false}
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
                      <div className="bg-background backdrop-blur-md border border-surface-border p-3 rounded-lg shadow-2xl">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted mb-1">{label}</p>
                        <p className="font-display font-bold text-text-primary">
                          {formatINR(payload[0].value as number)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                animationBegin={500}
                animationDuration={1500}
                type="monotone"
                dataKey="balance"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#balanceGradient)"
                strokeLinecap="round"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-text-muted gap-2">
            <div className="w-12 h-1 bg-surface-hover rounded-full overflow-hidden">
               <motion.div
                animate={{ x: [-50, 50] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-full h-full bg-accent-emerald"
               />
            </div>
            <span className="text-xs font-medium uppercase tracking-widest">Generating Insight...</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}