'use client';

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useTransactions } from '@/context/TransactionContext';
import { getCategoryBreakdown } from '@/lib/analytics';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/constants/categories';
import { formatINR } from '@/lib/formatters';
import type { Category } from '@/types';
import { useFilterDispatch } from '@/context/FilterContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export function SpendingBreakdownChart() {
  const { transactions } = useTransactions();
  const dispatchFilter = useFilterDispatch();
  const router = useRouter();

  const breakdown = useMemo(() => getCategoryBreakdown(transactions, 'expense'), [transactions]);

  const chartData = useMemo(() => breakdown.map((item) => ({
    name: CATEGORY_LABELS[item.category],
    value: item.amount,
    percentage: item.percentage,
    category: item.category,
    color: CATEGORY_COLORS[item.category]?.chart || 'var(--chart-slate)',
  })), [breakdown]);

  const hasData = chartData.length > 0;

  const handleCategoryClick = (category: Category) => {
    dispatchFilter({ type: 'SET_CATEGORIES', payload: [category] });
    router.push('/transactions');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-panel rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-text-primary tracking-tight">
          Spending Breakdown
        </h2>
        <p className="text-xs text-text-muted font-medium uppercase tracking-wider mt-1">Allocation by category</p>
      </div>

      <div className="h-64 relative">
        {hasData ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  animationBegin={200}
                  animationDuration={1200}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      onClick={() => handleCategoryClick(entry.category)}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background backdrop-blur-md border border-surface-border p-3 rounded-lg shadow-2xl">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted mb-1">{data.name}</p>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
                            <p className="font-display font-bold text-text-primary">
                              {formatINR(data.value)}
                            </p>
                          </div>
                          <p className="text-[10px] text-text-muted mt-1 font-semibold">{data.percentage.toFixed(1)}% of total</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                  wrapperStyle={{ zIndex: 1000 }}
                  allowEscapeViewBox={{ x: true, y: true }}

                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-muted">Expenses</span>
              <span className="text-lg font-display font-bold text-text-primary mt-1">
                {breakdown.length} Categories
              </span>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-text-muted text-xs font-semibold uppercase tracking-widest">
            No expense data
          </div>
        )}
      </div>

      {/* Custom Legend */}
      {hasData && (
        <div className="mt-8 flex flex-col gap-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
          {breakdown.map((item) => (
            <div
              key={item.category}
              onClick={() => handleCategoryClick(item.category)}
              className="group flex items-center gap-3 p-2 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <div
                className="w-2 h-6 rounded-full shrink-0"
                style={{
                  backgroundColor: CATEGORY_COLORS[item.category]?.chart || 'var(--chart-slate)',
                }}
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-text-muted group-hover:text-text-primary transition-colors truncate">
                  {CATEGORY_LABELS[item.category]}
                </span>
                <span className="text-[10px] font-semibold text-text-muted">
                  {item.percentage.toFixed(1)}% allocation
                </span>
              </div>
              <span className="text-xs font-display font-bold text-text-primary ml-auto shrink-0 pl-2">
                {formatINR(item.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}