import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format a number as Indian Rupees (INR)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date): string {
  return format(date, 'dd MMM yyyy');
}

/**
 * Format a date to a short string
 */
export function formatDateShort(date: Date): string {
  return format(date, 'dd MMM');
}

/**
 * Format a date to show relative time (e.g., "2 days ago")
 */
export function formatRelative(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Format a percentage change with arrow
 */
export function formatDelta(current: number, previous: number): {
  value: string;
  isPositive: boolean;
  percentage: number;
} {
  if (previous === 0) {
    return {
      value: current >= 0 ? '+100%' : '-100%',
      isPositive: current >= 0,
      percentage: current >= 0 ? 100 : -100,
    };
  }

  const percentage = ((current - previous) / previous) * 100;
  const isPositive = percentage >= 0;

  return {
    value: `${isPositive ? '+' : ''}${percentage.toFixed(1)}%`,
    isPositive,
    percentage,
  };
}

/**
 * Format a number to compact form (e.g., 1.2L, 2.5K)
 */
export function formatCompact(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount}`;
}