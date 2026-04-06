'use client';

import { useFilters, useFilterDispatch } from '@/context/FilterContext';
import { CATEGORY_LABELS, ALL_CATEGORIES } from '@/constants/categories';
import { Search, FilterX } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TransactionFilters() {
  const state = useFilters();
  const dispatch = useFilterDispatch();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH', payload: e.target.value });
  };

  const hasActiveFilters = state.search !== '' || state.categories.length > 0 || state.type !== 'all';

  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-col gap-4 w-full">
      <div className="flex flex-col md:flex-row gap-4 items-center w-full">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 dark:text-text-muted" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200/80 dark:border-surface-border rounded-xl leading-5 bg-white dark:bg-surface-hover text-slate-800 dark:text-text-primary placeholder-slate-400 dark:placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all shadow-sm"
            placeholder="Search transactions..."
            value={state.search}
            onChange={handleSearchChange}
          />
        </div>

        {/* Type Toggle */}
        <div className="flex bg-slate-100/80 dark:bg-surface-hover border border-slate-200/80 dark:border-surface-border p-1 rounded-xl">
          {(['all', 'income', 'expense'] as const).map((type) => (
            <button
              key={type}
              onClick={() => dispatch({ type: 'SET_TYPE', payload: type })}
              className={cn(
                'px-4 py-1.5 text-xs font-bold rounded-lg transition-all capitalize',
                state.type === type
                  ? type === 'income' ? 'bg-emerald-500 text-white shadow-sm' : type === 'expense' ? 'bg-violet-500 text-white shadow-sm' : 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-text-muted hover:text-slate-800 dark:hover:text-text-primary'
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-400/10 transition-colors"
          >
            <FilterX className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-[10px] text-slate-500 dark:text-text-muted uppercase tracking-widest font-bold mr-2">Categories</span>
        {ALL_CATEGORIES.map((cat) => {
          const isActive = state.categories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => dispatch({ type: 'TOGGLE_CATEGORY', payload: cat })}
              className={cn(
                'px-3 py-1 text-xs font-semibold rounded-full border transition-all',
                isActive
                  ? 'border-emerald-400/80 bg-emerald-50 text-emerald-700 shadow-[0_0_10px_rgba(16,185,129,0.12)] dark:border-accent-emerald/50 dark:bg-accent-emerald/10 dark:text-accent-emerald dark:shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800 dark:border-surface-border dark:bg-transparent dark:text-text-muted dark:hover:border-text-muted dark:hover:text-text-primary'
              )}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
