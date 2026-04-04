// Transaction types
export type TransactionType = 'income' | 'expense';

export type Role = 'admin' | 'viewer';

export type Category =
  | 'food'
  | 'transport'
  | 'bills'
  | 'shopping'
  | 'entertainment'
  | 'health'
  | 'salary'
  | 'investments'
  | 'other';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: Category;
  type: TransactionType;
  date: Date;
  createdAt: Date;
}

// Filter state
export interface FilterState {
  search: string;
  categories: Category[];
  type: 'all' | TransactionType;
  dateRange: [Date | null, Date | null];
  sortKey: 'date' | 'amount' | 'category';
  sortDir: 'asc' | 'desc';
}

// Analytics types
export interface MonthlyTotals {
  income: number;
  expenses: number;
  balance: number;
}

export interface DailyBalance {
  date: Date;
  balance: number;
}

export interface CategoryBreakdown {
  category: Category;
  amount: number;
  percentage: number;
}

export interface Insight {
  type: 'spending' | 'savings' | 'trend' | 'alert';
  message: string;
  value?: number;
}