'use client';

import { useState, useEffect } from 'react';
import { useTransactionDispatch } from '@/context/TransactionContext';
import { CATEGORY_LABELS, ALL_CATEGORIES } from '@/constants/categories';
import { Transaction, TransactionType, Category } from '@/types';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

export function AddTransactionModal({ isOpen, onClose, editTransaction }: AddTransactionModalProps) {
  const dispatch = useTransactionDispatch();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Sync edit mode
  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setAmount(editTransaction.amount.toString());
      setDescription(editTransaction.description);
      setCategory(editTransaction.category);
      setDate(new Date(editTransaction.date).toISOString().split('T')[0]);
    } else {
      setType('expense');
      setAmount('');
      setDescription('');
      setCategory('other');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editTransaction, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    const payload: Transaction = {
      id: editTransaction ? editTransaction.id : crypto.randomUUID(),
      description,
      amount: parseFloat(amount),
      category,
      type,
      date: new Date(date),
      createdAt: editTransaction ? editTransaction.createdAt : new Date(),
    };

    if (editTransaction) {
      dispatch({ type: 'UPDATE', payload });
    } else {
      dispatch({ type: 'ADD', payload });
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            className="relative w-full max-w-lg glass-panel bg-background rounded-2xl p-6 border border-surface-border shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent-emerald/10 blur-[80px] rounded-full -mr-10 -mt-10" />

            <div className="flex items-center justify-between mb-6 relative z-10">
              <h2 className="text-xl font-display font-bold text-text-primary tracking-widest uppercase">
                {editTransaction ? 'Edit Transaction' : 'New Transaction'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-text-muted hover:text-text-primary rounded-xl hover:bg-surface-hover transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
              {/* Type Toggle */}
              <div className="flex p-1 bg-surface-hover rounded-xl border border-surface-border">
                {(['expense', 'income'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                      type === t
                        ? t === 'expense' ? 'bg-accent-violet text-white shadow-lg' : 'bg-accent-emerald text-background shadow-lg'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Amount (INR)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-text-muted font-display font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-surface-hover border border-surface-border rounded-xl text-text-primary font-display font-bold text-lg focus:outline-none focus:ring-2 focus:ring-accent-emerald transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-hover border border-surface-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-emerald transition-all"
                  placeholder="e.g. Groceries at Supermart"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-4 py-3 bg-background border border-surface-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-emerald transition-all appearance-none"
                  >
                    {ALL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_LABELS[cat]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-hover border border-surface-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-emerald transition-all"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-4 w-full py-3 bg-gradient-to-r from-accent-emerald to-emerald-400 text-background font-display font-bold text-sm tracking-widest uppercase rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                {editTransaction ? 'Save Changes' : (
                   <>
                     <Plus className="w-5 h-5" />
                     Add Transaction
                   </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
