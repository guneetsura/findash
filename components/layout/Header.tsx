'use client';

import { GlobalSearch } from './GlobalSearch';
import { NotificationDropdown } from './NotificationDropdown';
import { ThemeToggle } from './ThemeToggle';
// import { RoleSwitcher } from './RoleSwitcher';
import { motion } from 'framer-motion';
// import { usePathname } from 'next/navigation';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {

  // const link = usePathname();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 w-full glass-panel border-b-0 px-6 py-4 h-20 flex items-center justify-between"
    >
      <div className="flex flex-col">
        <motion.h1 
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-display text-2xl font-bold tracking-tight text-text-primary"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p 
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-text-muted font-medium"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <GlobalSearch />

        {/* {link === '/transactions' && <RoleSwitcher />} */}

        <div className="flex items-center gap-2 border-l border-surface-border pl-4">
          <NotificationDropdown />
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}