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
  food: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  transport: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  bills: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  shopping: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
  entertainment: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  health: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  salary: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  investments: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  other: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
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
           <div className={cn("p-1.5 rounded-lg", isIncome ? "bg-accent-emerald/10 text-accent-emerald" : "bg-surface-hover text-text-muted")}>
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
          isIncome ? "text-accent-emerald" : "text-text-muted"
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
              className="p-1.5 text-text-muted hover:text-accent-emerald hover:bg-accent-emerald/10 rounded-md transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
              className="p-1.5 text-text-muted hover:text-rose-400 hover:bg-rose-400/10 rounded-md transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
           <span className="text-xs text-text-muted italic group-hover:text-text-primary transition-colors">View Only</span>
        )}
      </td>
    </motion.tr>
  );
}
