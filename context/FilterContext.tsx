'use client';

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
} from 'react';
import { FilterState, Category, TransactionType } from '@/types';

// State (already defined in types, but we need initial state)
const initialFilterState: FilterState = {
  search: '',
  categories: [],
  type: 'all',
  dateRange: [null, null],
  sortKey: 'date',
  sortDir: 'desc',
};

// Actions
type FilterAction =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'TOGGLE_CATEGORY'; payload: Category }
  | { type: 'SET_TYPE'; payload: 'all' | TransactionType }
  | { type: 'SET_DATE_RANGE'; payload: [Date | null, Date | null] }
  | { type: 'SET_SORT_KEY'; payload: 'date' | 'amount' | 'category' }
  | { type: 'SET_SORT_DIR'; payload: 'asc' | 'desc' }
  | { type: 'TOGGLE_SORT_DIR' }
  | { type: 'RESET' };

// Reducer
function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'TOGGLE_CATEGORY':
      const categories = state.categories.includes(action.payload)
        ? state.categories.filter((c) => c !== action.payload)
        : [...state.categories, action.payload];
      return { ...state, categories };
    case 'SET_TYPE':
      return { ...state, type: action.payload };
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload };
    case 'SET_SORT_KEY':
      return { ...state, sortKey: action.payload };
    case 'SET_SORT_DIR':
      return { ...state, sortDir: action.payload };
    case 'TOGGLE_SORT_DIR':
      return {
        ...state,
        sortDir: state.sortDir === 'asc' ? 'desc' : 'asc',
      };
    case 'RESET':
      return initialFilterState;
    default:
      return state;
  }
}

// Context
const FilterContext = createContext<FilterState | undefined>(undefined);
const FilterDispatchContext = createContext<{
  dispatch: React.Dispatch<FilterAction>;
} | undefined>(undefined);

// Provider
export function FilterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(filterReducer, initialFilterState);

  return (
    <FilterContext.Provider value={state}>
      <FilterDispatchContext.Provider value={{ dispatch }}>
        {children}
      </FilterDispatchContext.Provider>
    </FilterContext.Provider>
  );
}

// Custom hooks
export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}

export function useFilterDispatch() {
  const context = useContext(FilterDispatchContext);
  if (context === undefined) {
    throw new Error('useFilterDispatch must be used within a FilterProvider');
  }
  return context.dispatch;
}