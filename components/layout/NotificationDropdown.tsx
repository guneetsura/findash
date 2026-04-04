'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Notification = {
  id: string;
  type: 'alert' | 'insight' | 'system';
  message: string;
  time: string;
  isRead: boolean;
};

const initialNotifications: Notification[] = [
  { id: '1', type: 'alert', message: 'Unusual spike in shopping expenses detected.', time: '10m ago', isRead: false },
  { id: '2', type: 'insight', message: 'You saved 20% more on food this month!', time: '2h ago', isRead: false },
  { id: '3', type: 'system', message: 'Automatic local backup completed.', time: '1d ago', isRead: true },
];

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'alert': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'insight': return <TrendingUp className="w-4 h-4 text-accent-emerald" />;
      case 'system': return <Sparkles className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-text-muted hover:bg-surface-hover hover:text-text-primary transition-all focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-2 right-2 w-2 h-2 bg-accent-emerald rounded-full border-2 border-background animate-pulse" 
            />
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-3 w-80 bg-background border border-surface-border rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-surface-border bg-surface-hover">
               <h3 className="text-sm font-bold text-text-primary tracking-widest uppercase">Notifications</h3>
               {unreadCount > 0 && (
                 <button onClick={markAllRead} className="text-[10px] uppercase font-bold text-accent-emerald tracking-wide hover:text-emerald-300 transition-colors flex items-center gap-1">
                   <CheckCircle2 className="w-3 h-3" /> Mark all read
                 </button>
               )}
            </div>
            
            <div className="max-h-[350px] overflow-y-auto custom-scrollbar flex flex-col">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n.id} className={`group flex items-start gap-4 p-4 border-b border-surface-border last:border-0 transition-all hover:bg-surface-hover cursor-pointer ${n.isRead ? 'opacity-50 hover:opacity-100' : 'bg-surface-hover/50'}`}>
                    <div className={`shrink-0 mt-0.5 p-2 rounded-xl border ${n.isRead ? 'bg-surface-hover border-surface-border' : 'bg-accent-emerald/10 border-accent-emerald/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'}`}>
                      {getIcon(n.type)}
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                      <p className={`text-xs leading-relaxed ${n.isRead ? 'text-text-muted font-medium' : 'text-text-primary font-bold'}`}>
                        {n.message}
                      </p>
                      <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest flex items-center gap-2">
                        {n.time}
                        {!n.isRead && <span className="w-1 h-1 rounded-full bg-accent-emerald" />}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
                  <div className="w-12 h-12 rounded-full border border-surface-border bg-surface-hover flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-text-muted opacity-50" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary tracking-widest uppercase">All caught up</h4>
                    <p className="text-xs text-text-muted font-medium mt-1">No new notifications</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
