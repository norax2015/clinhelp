'use client';

import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs component must be used together');
  return ctx;
}

interface TabsProps {
  defaultTab: string;
  onChange?: (tab: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ defaultTab, onChange, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleSetTab = (tab: string) => {
    setActiveTab(tab);
    onChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleSetTab }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={cn(
        'flex gap-1 bg-slate-100 p-1 rounded-lg',
        className,
      )}
      role="tablist"
    >
      {children}
    </div>
  );
}

interface TabTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabTrigger({ value, children, className }: TabTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={cn(
        'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150',
        isActive
          ? 'bg-white text-navy-900 shadow-sm'
          : 'text-slate-600 hover:text-slate-900',
        className,
      )}
    >
      {children}
    </button>
  );
}

interface TabContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabContent({ value, children, className }: TabContentProps) {
  const { activeTab } = useTabsContext();
  if (activeTab !== value) return null;

  return (
    <div role="tabpanel" className={cn('animate-fade-in', className)}>
      {children}
    </div>
  );
}
