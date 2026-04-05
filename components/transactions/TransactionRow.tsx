'use client';

import { Transaction, Role } from '@/types';
import { CATEGORY_LABELS } from '@/constants/categories';
import { formatINR, formatDateShort } from '@/lib/formatters';
import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TransactionRowProps {
  transaction: Transaction;
  role: Role;
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  food: 'text-amber-700 bg-amber-50 border-amber-200/80 dark:text-amber-400 dark:bg-amber-400/10 dark:border-amber-400/20',
  transport: 'text-blue-700 bg-blue-50 border-blue-200/80 dark:text-blue-400 dark:bg-blue-400/10 dark:border-blue-400/20',
  bills: 'text-violet-700 bg-violet-50 border-violet-200/80 dark:text-violet-400 dark:bg-violet-400/10 dark:border-violet-400/20',
  shopping: 'text-pink-700 bg-pink-50 border-pink-200/80 dark:text-pink-400 dark:bg-pink-400/10 dark:border-pink-400/20',
  entertainment: 'text-purple-700 bg-purple-50 border-purple-200/80 dark:text-purple-400 dark:bg-purple-400/10 dark:border-purple-400/20',
  health: 'text-rose-700 bg-rose-50 border-rose-200/80 dark:text-rose-400 dark:bg-rose-400/10 dark:border-rose-400/20',
  salary: 'text-emerald-700 bg-emerald-50 border-emerald-200/80 dark:text-emerald-400 dark:bg-emerald-400/10 dark:border-emerald-400/20',
  investments: 'text-cyan-700 bg-cyan-50 border-cyan-200/80 dark:text-cyan-400 dark:bg-cyan-400/10 dark:border-cyan-400/20',
  other: 'text-slate-700 bg-slate-50 border-slate-200/80 dark:text-slate-400 dark:bg-slate-400/10 dark:border-slate-400/20',
};

export function TransactionRow({ transaction, role, onEdit, onDelete }: TransactionRowProps) {
  const isIncome = transaction.type === 'income';

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group hover:bg-surface-hover transition-colors border-b border-surface-border last:border-0"
    >
      <td className="py-4 pl-4 pr-3 whitespace-nowrap text-xs font-semibold text-text-muted">
        {formatDateShort(transaction.date)}
      </td>
      <td className="px-3 py-4 text-sm font-medium text-text-primary">
        <div className="flex items-center gap-3">
           <div className={cn("p-1.5 rounded-lg", isIncome ? "bg-emerald-100 text-emerald-600 dark:bg-accent-emerald/10 dark:text-accent-emerald" : "bg-slate-100 text-slate-500 dark:bg-surface-hover dark:text-text-muted")}>
             {isIncome ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
           </div>
           {transaction.description}
        </div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <span className={cn(
          "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border",
          CATEGORY_COLORS[transaction.category] || CATEGORY_COLORS['other']
        )}>
          {CATEGORY_LABELS[transaction.category]}
        </span>
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-right">
        <span className={cn(
          "font-display text-sm font-bold tracking-wide",
          isIncome ? "text-emerald-600 dark:text-accent-emerald" : "text-slate-600 dark:text-text-muted"
        )}>
          {isIncome ? '+' : '-'}{formatINR(transaction.amount)}
        </span>
      </td>

      {/* Actions (Admin Only) */}
      <td className="py-4 pl-3 pr-4 whitespace-nowrap text-right text-sm font-medium w-[100px]">
        {role === 'admin' ? (
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(transaction)}
              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-100 dark:hover:bg-accent-emerald/10 rounded-md transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-400/10 rounded-md transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
           <span className="text-xs text-slate-400 dark:text-text-muted italic group-hover:text-slate-600 dark:group-hover:text-text-primary transition-colors">View Only</span>
        )}
      </td>
    </motion.tr>
  );
}
