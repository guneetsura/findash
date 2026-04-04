import { Transaction, MonthlyTotals, DailyBalance, CategoryBreakdown, Insight, Category } from '@/types';
import { CATEGORY_LABELS, ALL_CATEGORIES } from '@/constants/categories';
import { format } from 'date-fns';

/**
 * Calculate totals for a given period
 */
export function getTotals(transactions: Transaction[]): MonthlyTotals {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthTransactions = transactions.filter(
    (t) => t.date.getMonth() === currentMonth && t.date.getFullYear() === currentYear
  );

  const income = currentMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expenses,
    balance: income - expenses,
  };
}

/**
 * Calculate last month's totals for comparison
 */
export function getLastMonthTotals(transactions: Transaction[]): MonthlyTotals {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthIndex = lastMonth.getMonth();
  const lastMonthYear = lastMonth.getFullYear();

  const lastMonthTransactions = transactions.filter(
    (t) => t.date.getMonth() === lastMonthIndex && t.date.getFullYear() === lastMonthYear
  );

  const income = lastMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = lastMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expenses,
    balance: income - expenses,
  };
}

/**
 * Calculate total balance across all transactions
 */
export function getTotalBalance(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount;
  }, 0);
}

/**
 * Get daily running balance for the last N days
 */
export function getDailyBalance(transactions: Transaction[], days: number = 90): DailyBalance[] {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // Filter transactions within date range and sort by date
  const filtered = transactions
    .filter((t) => t.date >= startDate && t.date <= now)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Group by date
  const dailyTotals: Record<string, number> = {};
  const runningBalance = getTotalBalance(transactions); // Starting balance (all transactions before start date)

  // Calculate daily changes
  filtered.forEach((t) => {
    const dateKey = format(t.date, 'yyyy-MM-dd');
    const amount = t.type === 'income' ? t.amount : -t.amount;
    dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + amount;
  });

  // Generate daily balance data
  const result: DailyBalance[] = [];
  let currentBalance = runningBalance;

  // Walk backwards from today to calculate running balance
  for (let d = new Date(now); d >= startDate; d.setDate(d.getDate() - 1)) {
    const dateKey = format(d, 'yyyy-MM-dd');
    currentBalance -= dailyTotals[dateKey] || 0;
  }

  // Now walk forward to build the chart data
  currentBalance = runningBalance - Object.values(dailyTotals).reduce((a, b) => a + b, 0) + (dailyTotals[format(now, 'yyyy-MM-dd')] || 0);

  for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
    const dateKey = format(d, 'yyyy-MM-dd');
    currentBalance += dailyTotals[dateKey] || 0;
    result.push({
      date: new Date(d),
      balance: currentBalance,
    });
  }

  return result;
}

/**
 * Get spending breakdown by category
 */
export function getCategoryBreakdown(
  transactions: Transaction[],
  type: 'income' | 'expense' = 'expense'
): CategoryBreakdown[] {
  const filtered = transactions.filter((t) => t.type === type);
  const total = filtered.reduce((sum, t) => sum + t.amount, 0);

  if (total === 0) return [];

  const byCategory: Record<Category, number> = {} as Record<Category, number>;

  filtered.forEach((t) => {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
  });

  return ALL_CATEGORIES
    .filter((cat) => byCategory[cat] > 0)
    .map((category) => ({
      category,
      amount: byCategory[category] || 0,
      percentage: ((byCategory[category] || 0) / total) * 100,
    }))
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Get top spending category
 */
export function getTopCategory(transactions: Transaction[]): { category: Category; amount: number; percentage: number } | null {
  const breakdown = getCategoryBreakdown(transactions, 'expense');
  if (breakdown.length === 0) return null;
  return {
    category: breakdown[0].category,
    amount: breakdown[0].amount,
    percentage: breakdown[0].percentage,
  };
}

/**
 * Get monthly comparison data (last 6 months)
 */
export function getMonthlyComparison(transactions: Transaction[]): { month: string; income: number; expenses: number }[] {
  const now = new Date();
  const result: { month: string; income: number; expenses: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthIndex = monthDate.getMonth();
    const year = monthDate.getFullYear();

    const monthTransactions = transactions.filter(
      (t) => t.date.getMonth() === monthIndex && t.date.getFullYear() === year
    );

    const income = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    result.push({
      month: format(monthDate, 'MMM'),
      income,
      expenses,
    });
  }

  return result;
}

/**
 * Generate auto insights from transaction data
 */
export function getInsights(transactions: Transaction[]): Insight[] {
  const insights: Insight[] = [];
  const currentTotals = getTotals(transactions);
  const lastMonthTotals = getLastMonthTotals(transactions);

  // Net savings insight
  if (currentTotals.income > 0) {
    const savingsRate = ((currentTotals.income - currentTotals.expenses) / currentTotals.income) * 100;
    insights.push({
      type: 'savings',
      message: `Net savings this month: ${savingsRate.toFixed(0)}% of income`,
      value: currentTotals.balance,
    });
  }

  // Spending change insight
  if (lastMonthTotals.expenses > 0) {
    const changePercent = ((currentTotals.expenses - lastMonthTotals.expenses) / lastMonthTotals.expenses) * 100;
    const direction = changePercent >= 0 ? 'more' : 'less';
    insights.push({
      type: 'trend',
      message: `You spent ${Math.abs(changePercent).toFixed(0)}% ${direction} this month vs last month`,
    });
  }

  // Top category insight
  const topCategory = getTopCategory(transactions);
  if (topCategory) {
    insights.push({
      type: 'spending',
      message: `Highest spending category: ${CATEGORY_LABELS[topCategory.category]} (${topCategory.percentage.toFixed(0)}% of expenses)`,
      value: topCategory.amount,
    });
  }

  // Highest single expense
  const expenses = transactions.filter((t) => t.type === 'expense');
  if (expenses.length > 0) {
    const highest = expenses.reduce((max, t) => (t.amount > max.amount ? t : max), expenses[0]);
    insights.push({
      type: 'alert',
      message: `Highest single expense: ₹${highest.amount.toLocaleString('en-IN')} on ${highest.description}`,
    });
  }

  return insights;
}