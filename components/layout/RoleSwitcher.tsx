'use client';

import { useRole, useRoleDispatch } from '@/context/RoleContext';
import { Role } from '@/types';
import { cn } from '@/lib/utils';
import { Shield, Eye } from 'lucide-react';

const roles: { value: Role; label: string; description: string; icon: any }[] = [
  {
    value: 'admin',
    label: 'Admin',
    description: 'Can add, edit, and delete transactions',
    icon: Shield
  },
  {
    value: 'viewer',
    label: 'Viewer',
    description: 'Read-only access',
    icon: Eye
  },
];

export function RoleSwitcher() {
  const { role } = useRole();
  const dispatch = useRoleDispatch();

  return (
    <div className="flex bg-surface-hover/50 border border-surface-border p-1 rounded-xl">
      {roles.map((r) => {
        const isActive = role === r.value;
        const Icon = r.icon;
        
        return (
          <button
            key={r.value}
            onClick={() => dispatch({ type: 'SET_ROLE', payload: r.value })}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize',
              isActive
                ? r.value === 'admin' 
                   ? 'bg-accent-emerald text-background shadow-lg' 
                   : 'bg-accent-violet text-white shadow-lg'
                : 'text-text-muted hover:text-text-primary'
            )}
            title={r.description}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{r.label}</span>
          </button>
        );
      })}
    </div>
  );
}