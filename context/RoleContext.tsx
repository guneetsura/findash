'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { Role } from '@/types';

// State
interface RoleState {
  role: Role;
}

// Actions
type RoleAction = { type: 'SET_ROLE'; payload: Role };

// Initial state
const initialState: RoleState = {
  role: 'admin', // Default to admin for development
};

// Reducer
function roleReducer(state: RoleState, action: RoleAction): RoleState {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    default:
      return state;
  }
}

// Context
const RoleContext = createContext<RoleState | undefined>(undefined);
const RoleDispatchContext = createContext<{
  dispatch: React.Dispatch<RoleAction>;
} | undefined>(undefined);

// Provider
export function RoleProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(roleReducer, initialState);

  // Load role from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('role');
    if (stored === 'admin' || stored === 'viewer') {
      dispatch({ type: 'SET_ROLE', payload: stored });
    }
  }, []);

  // Persist role to localStorage on change
  useEffect(() => {
    localStorage.setItem('role', state.role);
  }, [state.role]);

  return (
    <RoleContext.Provider value={state}>
      <RoleDispatchContext.Provider value={{ dispatch }}>
        {children}
      </RoleDispatchContext.Provider>
    </RoleContext.Provider>
  );
}

// Custom hooks
export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

export function useRoleDispatch() {
  const context = useContext(RoleDispatchContext);
  if (context === undefined) {
    throw new Error('useRoleDispatch must be used within a RoleProvider');
  }
  return context.dispatch;
}