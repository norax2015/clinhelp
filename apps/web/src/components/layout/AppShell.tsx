'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppTopbar } from './AppTopbar';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const onboardingChecked = useRef(false);
  const { user } = useAuth();

  useEffect(() => {
    // Show onboarding wizard once on first login when specialty & title are both unset
    if (user && !onboardingChecked.current) {
      onboardingChecked.current = true;
      if (!user.specialty && !user.title) {
        setShowOnboarding(true);
      }
    }
  }, [user]);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 lg:relative lg:flex lg:flex-shrink-0 transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <AppSidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* Mobile topbar with hamburger */}
        <div className="flex items-center h-14 bg-white border-b border-slate-100 px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 mr-2"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <span className="font-semibold text-navy-900">ClinHelp</span>
        </div>

        {/* Desktop topbar */}
        <div className="hidden lg:block">
          <AppTopbar />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto animate-fade-in">{children}</div>
        </main>
      </div>

      {/* Onboarding wizard — shown once on first login */}
      {showOnboarding && (
        <OnboardingWizard onDone={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}
