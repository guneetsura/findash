'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutGrid, ArrowRightLeft, PieChart, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutGrid },
  { href: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/insights', label: 'Insights', icon: PieChart },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:left-0 z-50">
        <div className="absolute inset-y-0 left-0 w-64 bg-white/90 dark:bg-background/50 backdrop-blur-xl border-r border-slate-200/80 dark:border-surface-border" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center h-20 px-8 border-b border-slate-200/80 dark:border-surface-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-violet-500 dark:from-accent-emerald dark:to-accent-violet flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-display font-bold text-slate-800 dark:text-text-primary tracking-wide">
                FinDash
              </h1>
            </div>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-2">
            <div className="px-4 mb-4">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-text-muted">Menu</p>
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative group block"
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-slate-100/80 dark:bg-surface-hover rounded-xl border border-slate-200/80 dark:border-surface-border"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className={cn(
                    "relative flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors z-10",
                    isActive ? "text-slate-900 dark:text-text-primary" : "text-slate-600 dark:text-text-muted hover:text-slate-800 dark:hover:text-text-primary"
                  )}>
                    <item.icon className={cn(
                      "w-5 h-5 mr-3 transition-colors",
                      isActive ? "text-emerald-500 dark:text-accent-emerald" : "text-slate-400 dark:text-text-muted group-hover:text-emerald-500 dark:group-hover:text-accent-emerald"
                    )} />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="p-6 mt-auto">
            <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-background border border-slate-200/80 dark:border-surface-border flex items-center justify-center shadow-sm">
                 <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=Admin`} alt="Avatar" className="w-8 h-8 object-contain" />
              </div>
              <div className="flex flex-col">
                 <span className="text-xs font-bold text-slate-700 dark:text-text-primary">Guest User</span>
                 <span className="text-[10px] text-emerald-600 dark:text-accent-emerald tracking-wider uppercase font-semibold">Active</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t-slate-200/80 dark:border-t-surface-border border-x-0 border-b-0 pb-safe z-50 bg-white/95 dark:bg-background/80">
        <div className="flex justify-around items-center h-16 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center w-full h-full"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute inset-x-8 -top-px h-0.5 bg-emerald-500 dark:bg-accent-emerald"
                  />
                )}
                <item.icon className={cn(
                  "w-5 h-5 mb-1 transition-colors",
                  isActive ? "text-emerald-500 dark:text-accent-emerald" : "text-slate-400 dark:text-text-muted"
                )} />
                <span className={cn(
                  "text-[10px] tracking-wider font-semibold transition-colors",
                  isActive ? "text-slate-800 dark:text-text-primary" : "text-slate-500 dark:text-text-muted"
                )}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}