'use client';

import { useState, useMemo } from 'react';
import { useTransactions, useTransactionDispatch } from '@/context/TransactionContext';
import { useFilters, useFilterDispatch } from '@/context/FilterContext';
import { useRole } from '@/context/RoleContext';
import { TransactionRow } from './TransactionRow';
import { Transaction } from '@/types';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Inbox, ArrowDownUp } from 'lucide-react';
import { motion } from 'framer-motion';

const PAGE_SIZE = 10;

function SortIcon({ column, sortKey, sortDir }: { column: string; sortKey: string; sortDir: 'asc' | 'desc' }) {
  if (sortKey !== column) return <ArrowDownUp className="w-3 h-3 opacity-30 ml-1" />;
  return sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-accent-emerald ml-1" /> : <ChevronDown className="w-3 h-3 text-accent-emerald ml-1" />;
}

export function TransactionTable({ onEdit }: { onEdit: (t: Transaction) => void }) {
  const { transactions } = useTransactions();
  const dispatchTx = useTransactionDispatch();
  const { search, categories, type, sortKey, sortDir } = useFilters();
  const dispatchFilter = useFilterDispatch();
  const { role } = useRole();

  const [currentPage, setCurrentPage] = useState(1);

  // Derived state: Filter & Sort
  const processedTransactions = useMemo(() => {
    let result = [...transactions];

    // Filter by type
    if (type !== 'all') {
      result = result.filter(t => t.type === type);
    }

    // Filter by search (description)
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(t => t.description.toLowerCase().includes(lowerSearch));
    }

    // Filter by categories
    if (categories.length > 0) {
      result = result.filter(t => categories.includes(t.category));
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortKey === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortKey === 'category') {
        comparison = a.category.localeCompare(b.category);
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [transactions, search, categories, type, sortKey, sortDir]);

  // Derived state: Pagination
  const totalPages = Math.ceil(processedTransactions.length / PAGE_SIZE) || 1;
  // Ensure current page is valid when filtering changes
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  const paginatedTransactions = processedTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatchTx({ type: 'DELETE', payload: id });
    }
  };

  const handleSort = (key: 'date' | 'amount' | 'category') => {
    if (sortKey === key) {
      dispatchFilter({ type: 'TOGGLE_SORT_DIR' });
    } else {
      dispatchFilter({ type: 'SET_SORT_KEY', payload: key });
      dispatchFilter({ type: 'SET_SORT_DIR', payload: 'desc' });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="glass-panel overflow-hidden rounded-2xl border border-surface-border shadow-2xl">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-surface-hover backdrop-blur-sm">
                <th
                  onClick={() => handleSort('date')}
                  className="group cursor-pointer py-4 pl-4 pr-3 text-left text-xs font-bold text-text-muted tracking-widest uppercase hover:text-text-primary transition-colors"
                >
                  <div className="flex items-center">Date <SortIcon column="date" sortKey={sortKey} sortDir={sortDir} /></div>
                </th>
                <th className="px-3 py-4 text-left text-xs font-bold text-text-muted tracking-widest uppercase">Description</th>
                <th
                  onClick={() => handleSort('category')}
                  className="group cursor-pointer px-3 py-4 text-left text-xs font-bold text-text-muted tracking-widest uppercase hover:text-text-primary transition-colors"
                >
                  <div className="flex items-center">Category <SortIcon column="category" sortKey={sortKey} sortDir={sortDir} /></div>
                </th>
                <th
                  onClick={() => handleSort('amount')}
                  className="group cursor-pointer px-3 py-4 text-right text-xs font-bold text-text-muted tracking-widest uppercase hover:text-text-primary transition-colors"
                >
                  <div className="flex items-center justify-end">Amount <SortIcon column="amount" sortKey={sortKey} sortDir={sortDir} /></div>
                </th>
                <th className="py-4 pl-3 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((t) => (
                <TransactionRow
                  key={t.id}
                  transaction={t}
                  role={role}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                />
              ))}

              {paginatedTransactions.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center py-20 text-text-muted gap-4">
                      <div className="w-16 h-16 rounded-full bg-surface-hover flex items-center justify-center border border-surface-border">
                        <Inbox className="w-8 h-8 opacity-50" />
                      </div>
                      <div className="text-center">
                        <p className="font-display font-bold text-text-primary tracking-wide">No transactions found</p>
                        <p className="text-xs mt-1 font-semibold uppercase tracking-widest">Adjust filters or add new data</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {processedTransactions.length > 0 && (
          <div className="h-16 px-6 border-t border-surface-border bg-surface-hover flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-widest">
              Showing {(currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, processedTransactions.length)} of {processedTransactions.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-surface-border text-text-muted hover:text-text-primary hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-xs font-display font-bold text-text-primary px-2">
                {currentPage} / {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-surface-border text-text-muted hover:text-text-primary hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
