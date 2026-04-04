'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { Transaction } from '@/types';
import { getInitialTransactions } from '@/lib/mockData';

// State
interface TransactionState {
  transactions: Transaction[];
}

// Actions
type TransactionAction =
  | { type: 'ADD'; payload: Transaction }
  | { type: 'UPDATE'; payload: Transaction }
  | { type: 'DELETE'; payload: string }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] };

// Initial state
const initialState: TransactionState = {
  transactions: [],
};

// Reducer
function transactionReducer(
  state: TransactionState,
  action: TransactionAction
): TransactionState {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'UPDATE':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
      };
    default:
      return state;
  }
}

// Context
const TransactionContext = createContext<TransactionState | undefined>(undefined);
const TransactionDispatchContext = createContext<{
  dispatch: React.Dispatch<TransactionAction>;
} | undefined>(undefined);

// Provider
export function TransactionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Load initial transactions on mount
  useEffect(() => {
    const initial = getInitialTransactions();
    dispatch({ type: 'SET_TRANSACTIONS', payload: initial });
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    if (state.transactions.length > 0) {
      localStorage.setItem('transactions', JSON.stringify(state.transactions));
    }
  }, [state.transactions]);

  return (
    <TransactionContext.Provider value={state}>
      <TransactionDispatchContext.Provider value={{ dispatch }}>
        {children}
      </TransactionDispatchContext.Provider>
    </TransactionContext.Provider>
  );
}

// Custom hooks
export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}

export function useTransactionDispatch() {
  const context = useContext(TransactionDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useTransactionDispatch must be used within a TransactionProvider'
    );
  }
  return context.dispatch;
}