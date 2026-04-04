'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFilterDispatch } from '@/context/FilterContext';
import { Search, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const dispatchFilter = useFilterDispatch();
  const searchRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      dispatchFilter({ type: 'SET_SEARCH', payload: query });
      setIsOpen(false);
      setQuery('');
      router.push('/transactions');
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-hover border border-surface-border text-text-muted hover:text-text-primary hover:bg-surface-hover/80 transition-colors shadow-inner"
      >
        <Search className="w-4 h-4" />
        <span className="text-xs tracking-wide">Search...</span>
        <kbd className="ml-2 px-1.5 py-0.5 rounded-md bg-surface-hover text-[10px] font-bold tracking-widest text-text-muted uppercase flex items-center gap-1">
          <Command className="w-3 h-3" /> K
        </kbd>
      </button>

      {/* Mobile Search Button */}
      <button 
         onClick={() => setIsOpen(true)}
         className="flex md:hidden p-2 rounded-full text-text-muted hover:bg-surface-hover hover:text-text-primary transition-all"
      >
         <Search className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ ease: "easeOut", duration: 0.15 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-[101] px-4"
            >
              <form ref={searchRef} onSubmit={handleSearch} className="bg-background overflow-hidden rounded-2xl border border-surface-border shadow-2xl flex flex-col">
                <div className="flex items-center px-4 py-4 border-b border-surface-border">
                  <Search className="w-5 h-5 text-accent-emerald mr-3" />
                  <input 
                    autoFocus
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search transactions..." 
                    className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder-text-muted font-medium"
                  />
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-surface-hover border border-surface-border text-[10px] font-bold text-text-muted uppercase">
                    ESC
                  </kbd>
                </div>
                {query.trim() && (
                  <div className="px-4 py-3 bg-surface-hover cursor-pointer hover:bg-surface-hover/80 transition-colors group" onClick={handleSearch}>
                    <p className="text-sm font-medium text-text-muted flex items-center justify-between">
                       <span>Press <strong className="text-text-primary">Enter</strong> to search for &quot;<span className="text-accent-emerald">{query}</span>&quot;</span>
                       <span className="text-xs bg-accent-emerald/20 text-accent-emerald px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Submit</span>
                    </p>
                  </div>
                )}
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
