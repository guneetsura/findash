'use client';

import { ReactNode } from 'react';
import { TransactionProvider } from './TransactionContext';
import { FilterProvider } from './FilterContext';
import { RoleProvider } from './RoleContext';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Composes all context providers in the correct nesting order.
 * Order matters: outer providers should wrap inner ones.
 *
 * Nesting order:
 * - RoleProvider (outermost - affects permissions throughout)
 * - TransactionProvider (core data)
 * - FilterProvider (innermost - filters transaction view)
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <RoleProvider>
      <TransactionProvider>
        <FilterProvider>{children}</FilterProvider>
      </TransactionProvider>
    </RoleProvider>
  );
}