'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const pageTitles: Record<string, string> = {
  '/app/dashboard': 'Dashboard',
  '/app/patients': 'Patients',
  '/app/encounters': 'Encounters',
  '/app/encounters/new': 'New Encounter',
  '/app/notes': 'Notes',
  '/app/screenings': 'Screenings',
  '/app/screenings/new': 'New Screening',
  '/app/tasks': 'Tasks',
  '/app/admin': 'Admin Overview',
  '/app/admin/users': 'User Management',
  '/app/admin/settings': 'Organization Settings',
  '/app/admin/audit-logs': 'Audit Logs',
  '/app/settings': 'Settings',
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith('/app/patients/')) return 'Patient Profile';
  if (pathname.startsWith('/app/encounters/')) return 'Encounter Workspace';
  if (pathname.startsWith('/app/notes/')) return 'Note Detail';
  return 'ClinHelp';
}

export function AppTopbar() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-base font-semibold text-navy-900">{title}</h1>

      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}
