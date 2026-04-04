# FinDash

A premium, "Zen-Futuristic" financial dashboard and transaction registry application. Built focusing on high-density data views, fluid micro-interactions, and a bespoke glass-morphic aesthetic.

## Features

- **Dashboard Intelligence:** Provides an overview of your total assets, income vs expenses, and categorized spending with dynamic charts.
- **Transactions Ledger:** Highly performant, paginated, and sortable transaction lists with multi-conditional filtering.
- **Financial Analysis:** Algorithmic insights pinpointing your primary outflows, dynamic trends, and savings comparisons over the last 6 months.
- **Glass-morphic Zen Design:** Curated visual language implementing atmospheric glows, deep midnight backgrounds (`#020617`), and `framer-motion` integrated transitions.
- **Role-Based Workflows:** Seamless `Viewer` and `Admin` role switching, enforcing secure access to edit, delete, and add new transaction data.
- **Full Persistence:** Data modifications are synchronously persisted to LocalStorage, ensuring zero loss of analytics across sessions.
- **CSV Data Export:** Generate structural snapshots of your finances directly to your local file system.

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

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Framer Motion
- **State Management:** React Context API + `useReducer`
- **Charting:** Recharts
- **Icons:** Lucide React
- **Typography:** Outfit (Display) + Inter (Body)
