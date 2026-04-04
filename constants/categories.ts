import { Category } from '@/types';

export const CATEGORY_LABELS: Record<Category, string> = {
  food: 'Food & Dining',
  transport: 'Transport',
  bills: 'Bills & Utilities',
  shopping: 'Shopping',
  entertainment: 'Entertainment',
  health: 'Health & Medical',
  salary: 'Salary',
  investments: 'Investments',
  other: 'Other',
};

export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; chart: string }> = {
  food: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-400',
    chart: 'var(--chart-orange)',
  },
  transport: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    chart: 'var(--chart-blue)',
  },
  bills: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-400',
    chart: 'var(--chart-yellow)',
  },
  shopping: {
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    text: 'text-pink-700 dark:text-pink-400',
    chart: 'var(--chart-pink)',
  },
  entertainment: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-400',
    chart: 'var(--chart-purple)',
  },
  health: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    chart: 'var(--chart-red)',
  },
  salary: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    chart: 'var(--chart-green)',
  },
  investments: {
    bg: 'bg-teal-100 dark:bg-teal-900/30',
    text: 'text-teal-700 dark:text-teal-400',
    chart: 'var(--chart-teal)',
  },
  other: {
    bg: 'bg-gray-100 dark:bg-gray-900/30',
    text: 'text-gray-700 dark:text-gray-400',
    chart: 'var(--chart-gray)',
  },
};

export const EXPENSE_CATEGORIES: Category[] = [
  'food',
  'transport',
  'bills',
  'shopping',
  'entertainment',
  'health',
  'other',
];

export const INCOME_CATEGORIES: Category[] = ['salary', 'investments', 'other'];

export const ALL_CATEGORIES: Category[] = [
  'food',
  'transport',
  'bills',
  'shopping',
  'entertainment',
  'health',
  'salary',
  'investments',
  'other',
];