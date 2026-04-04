import { Transaction } from '@/types';
import { CATEGORY_LABELS } from '@/constants/categories';
import { format } from 'date-fns';

/**
 * Export transactions to CSV and trigger download
 */
export function exportTransactionsToCSV(transactions: Transaction[], filename: string = 'transactions.csv'): void {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];

  const rows = transactions.map((t) => [
    format(t.date, 'yyyy-MM-dd'),
    t.description,
    CATEGORY_LABELS[t.category],
    t.type.charAt(0).toUpperCase() + t.type.slice(1),
    t.amount.toString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}