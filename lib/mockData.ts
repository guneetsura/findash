import { Transaction, Category } from '@/types';

// Helper to generate random transactions
function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const expenseDescriptions: Record<Category, string[]> = {
  food: [
    'Grocery shopping',
    'Restaurant dinner',
    'Cafe lunch',
    'Food delivery',
    'Breakfast at hotel',
    'Snacks and beverages',
    'Vegetables and fruits',
  ],
  transport: [
    'Uber ride',
    'Fuel refill',
    'Metro pass',
    'Bus ticket',
    'Train ticket',
    'Auto rickshaw',
    'Parking fee',
  ],
  bills: [
    'Electricity bill',
    'Water bill',
    'Internet recharge',
    'Phone recharge',
    'Gas bill',
    'Maintenance fee',
    'Insurance premium',
  ],
  shopping: [
    'Online shopping',
    'Clothes purchase',
    'Electronics',
    'Home decor',
    'Footwear',
    'Accessories',
    'Gift purchase',
  ],
  entertainment: [
    'Movie tickets',
    'Netflix subscription',
    'Concert tickets',
    'Gaming subscription',
    'Sports event',
    'Amusement park',
    'Streaming service',
  ],
  health: [
    'Doctor consultation',
    'Medicines',
    'Lab tests',
    'Hospital visit',
    'Gym membership',
    'Health insurance',
    'Dental checkup',
  ],
  salary: [],
  investments: [],
  other: [
    'Miscellaneous expense',
    'ATM withdrawal',
    'Bank charges',
    'Charity donation',
    'Pet expenses',
  ],
};

const incomeDescriptions: Record<Category, string[]> = {
  salary: [
    'Monthly salary',
    'Performance bonus',
    'Annual bonus',
    'Promotion increment',
  ],
  investments: [
    'Dividend income',
    'Interest payout',
    'Mutual fund returns',
    'Stock gains',
  ],
  food: [],
  transport: [],
  bills: [],
  shopping: [],
  entertainment: [],
  health: [],
  other: ['Freelance payment', 'Refund received', 'Gift received'],
};

const expenseCategories: Category[] = [
  'food',
  'transport',
  'bills',
  'shopping',
  'entertainment',
  'health',
  'other',
];

// Income categories are used in the mock data generation above

function generateTransactions(count: number): Transaction[] {
  const transactions: Transaction[] = [];
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

  // Generate salary transactions (monthly income)
  for (let i = 0; i < 6; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    transactions.push({
      id: generateId(),
      description: 'Monthly salary',
      amount: Math.floor(80000 + Math.random() * 40000),
      category: 'salary',
      type: 'income',
      date,
      createdAt: date,
    });
  }

  // Generate investment returns (monthly)
  for (let i = 0; i < 4; i++) {
    const date = randomDate(sixMonthsAgo, now);
    transactions.push({
      id: generateId(),
      description: incomeDescriptions.investments[Math.floor(Math.random() * incomeDescriptions.investments.length)],
      amount: Math.floor(2000 + Math.random() * 8000),
      category: 'investments',
      type: 'income',
      date,
      createdAt: date,
    });
  }

  // Generate expense transactions
  const expenseCount = count - 10; // Reserve ~10 for income
  for (let i = 0; i < expenseCount; i++) {
    const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
    const descriptions = expenseDescriptions[category];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    const date = randomDate(sixMonthsAgo, now);

    // Amount ranges based on category
    let amount: number;
    switch (category) {
      case 'bills':
        amount = Math.floor(500 + Math.random() * 5000);
        break;
      case 'shopping':
        amount = Math.floor(200 + Math.random() * 10000);
        break;
      case 'health':
        amount = Math.floor(100 + Math.random() * 3000);
        break;
      case 'transport':
        amount = Math.floor(50 + Math.random() * 2000);
        break;
      default:
        amount = Math.floor(50 + Math.random() * 1500);
    }

    transactions.push({
      id: generateId(),
      description,
      amount,
      category,
      type: 'expense',
      date,
      createdAt: date,
    });
  }

  // Sort by date (newest first)
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export const mockTransactions: Transaction[] = generateTransactions(70);

export function getInitialTransactions(): Transaction[] {
  // Check localStorage for persisted data
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('transactions');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((t: Transaction) => ({
          ...t,
          date: new Date(t.date),
          createdAt: new Date(t.createdAt),
        }));
      } catch {
        return mockTransactions;
      }
    }
  }
  return mockTransactions;
}