# FinDash

A premium, "Zen-Futuristic" financial dashboard and transaction registry application. Built focusing on high-density data views, fluid micro-interactions, and a bespoke glass-morphic aesthetic.

## Features

- **Dashboard Intelligence:** Provides an overview of your total assets, income vs expenses, and categorized spending with dynamic charts.
- **Transactions Ledger:** Highly performant, paginated, and sortable transaction lists with multi-conditional filtering.
- **Financial Analysis:** Algorithmic insights pinpointing your primary outflows, dynamic trends, and savings comparisons over the last 6 months.
- **Glass-morphic Zen Design:** Curated visual language implementing atmospheric glows, deep midnight backgrounds (`#020617`), and `framer-motion` integrated transitions.
- **Role-Based Workflows:** Seamless `Viewer` and `Admin` role switching, enforcing secure access to edit, delete, and add new transaction data.
- **Full Persistence:** Data modifications are synchronously persisted to LocalStorage, ensuring zero loss of analytics across sessions.
- **CSV Data Export:** Generate structural snapshots of your finances directly to your local file system with category labels.

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```

3. **Navigate to the App:**
   Open [http://localhost:3000](http://localhost:3000) in your browser. The app defaults to the `/dashboard` route.

## Architecture

### State Management
The application uses React Context API with `useReducer` for predictable state management across three core domains:

- **TransactionContext** — Handles transaction CRUD operations and data synchronization
- **FilterContext** — Controls search, category filters, sorting, and date range options
- **RoleContext** — Manages role-based access control (Admin vs Viewer)

All providers are composed in `AppProviders` component with proper nesting order for dependency management.

### Folder Structure
```
app/                    # Next.js App Router pages
  dashboard/            # Dashboard overview page
  insights/             # Financial insights page
  transactions/         # Transaction registry page
components/             # Reusable UI components organized by feature
  dashboard/            # SummaryCards, BalanceTrendChart, SpendingBreakdownChart
  insights/             # TopCategoryCard, MonthlyComparisonChart, InsightBadges
  layout/               # Sidebar, Header, RoleSwitcher, ThemeToggle, GlobalSearch, NotificationDropdown
  transactions/         # TransactionTable, TransactionFilters, AddTransactionModal, TransactionRow
  ThemeProvider.tsx     # Theme context wrapper (next-themes)
context/                # React Context providers and custom hooks
  TransactionContext.tsx
  FilterContext.tsx
  RoleContext.tsx
  AppProviders.tsx      # Composes all providers
lib/                    # Utility functions
  analytics.ts          # Financial calculations and insights
  formatters.ts         # Currency and date formatting
  exportCSV.ts          # CSV export functionality
  mockData.ts           # Mock transaction generator
  utils.ts              # cn() helper (clsx + tailwind-merge)
types/                  # TypeScript type definitions
constants/              # Default data and configuration (categories)
public/                 # Static assets
```

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Framer Motion
- **State Management:** React Context API + `useReducer`
- **Charting:** Recharts
- **Icons:** Lucide React
- **Typography:** Outfit (Display) + Inter (Body)
