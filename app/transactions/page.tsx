'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal';
import { useRole } from '@/context/RoleContext';
import { useTransactions } from '@/context/TransactionContext';
import { exportTransactionsToCSV } from '@/lib/exportCSV';
import { Plus, Download } from 'lucide-react';
import { Transaction } from '@/types';
import { motion } from 'framer-motion';
import { RoleSwitcher } from '@/components/layout/RoleSwitcher';

export default function TransactionsPage() {
  const { role } = useRole();
  const { transactions } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleEdit = (t: Transaction) => {
    setEditingTransaction(t);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // slight delay to reset state after animation closes
    setTimeout(() => setEditingTransaction(null), 300);
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-accent-emerald/20">
      {/* Background ambient glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[30%] h-[30%] bg-emerald-500/[0.06] dark:bg-accent-emerald/5 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col mx-auto">
        <Header 
          title="Ledger" 
          subtitle="Comprehensive transaction registry" 
        />
        
        <main className="p-6 md:p-10 flex flex-col gap-6">
          <div className="flex items-center justify-end gap-4 w-full">
            <RoleSwitcher />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-1.5 h-6 bg-accent-emerald rounded-full" />
              <h2 className="font-display text-xl font-bold text-text-primary tracking-widest uppercase">
                Transactions
              </h2>
            </motion.div>
            
            {role === 'admin' && (
              <div className="flex items-center gap-3">
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => exportTransactionsToCSV(transactions, 'zorvyn-ledger.csv')}
                  className="group flex items-center gap-2 px-5 py-2.5 bg-surface-hover border border-surface-border text-text-muted rounded-xl font-display font-bold text-sm tracking-widest uppercase hover:text-text-primary hover:bg-surface-hover/80 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden lg:inline">Export</span>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setIsModalOpen(true)}
                  className="group flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-accent-emerald to-emerald-400 text-background rounded-xl font-display font-bold text-sm tracking-widest uppercase shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                  Add Record
                </motion.button>
              </div>
            )}
          </div>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
          >
            <TransactionFilters />
          </motion.div>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
          >
            <TransactionTable onEdit={handleEdit} />
          </motion.div>
        </main>
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        editTransaction={editingTransaction} 
      />
    </div>
  );
}