'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  CheckSquare,
  Settings,
  ShieldCheck,
  Stethoscope,
  Activity,
  LogOut,
  ChevronRight,
  Mail,
  HelpCircle,
} from 'lucide-react';
import type { UserRole } from '@clinhelp/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: UserRole[];
  badge?: number;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/app/dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: 'Patients',
    href: '/app/patients',
    icon: <Users size={18} />,
  },
  {
    label: 'Encounters',
    href: '/app/encounters',
    icon: <Stethoscope size={18} />,
  },
  {
    label: 'Notes',
    href: '/app/notes',
    icon: <FileText size={18} />,
  },
  {
    label: 'Screenings',
    href: '/app/screenings',
    icon: <ClipboardList size={18} />,
  },
  {
    label: 'Tasks',
    href: '/app/tasks',
    icon: <CheckSquare size={18} />,
  },
  {
    label: 'Letters',
    href: '/app/letters',
    icon: <Mail size={18} />,
  },
  {
    label: 'FAQ & Help',
    href: '/app/faq',
    icon: <HelpCircle size={18} />,
  },
];

const adminItems: NavItem[] = [
  {
    label: 'Admin',
    href: '/app/admin',
    icon: <ShieldCheck size={18} />,
    roles: ['super_admin', 'org_admin'],
  },
];

const bottomItems: NavItem[] = [
  {
    label: 'Settings',
    href: '/app/settings',
    icon: <Settings size={18} />,
  },
];

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive =
    pathname === item.href ||
    (item.href !== '/app/dashboard' && pathname.startsWith(item.href));

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
        isActive
          ? 'bg-teal-500/10 text-teal-600'
          : 'text-slate-600 hover:bg-slate-100 hover:text-navy-900',
      )}
    >
      <span className="flex items-center gap-3">
        <span className={cn(isActive ? 'text-teal-500' : 'text-slate-400')}>
          {item.icon}
        </span>
        {item.label}
      </span>
      {item.badge !== undefined && item.badge > 0 && (
        <span className="bg-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {item.badge > 99 ? '99+' : item.badge}
        </span>
      )}
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const canAccessAdmin =
    user?.role === 'super_admin' || user?.role === 'org_admin';

  return (
    <aside className="flex flex-col h-full w-60 bg-white border-r border-slate-100">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        <div className="min-w-0">
          <span className="font-bold text-navy-900 text-base">ClinHelp</span>
          {user?.organization && (
            <p className="text-xs text-slate-400 truncate">{user.organization.name}</p>
          )}
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}

        {canAccessAdmin && (
          <>
            <div className="pt-4 pb-1">
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Administration
              </p>
            </div>
            {adminItems.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </>
        )}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-slate-100 space-y-1">
        {bottomItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}

        {/* User card */}
        {user && (
          <div className="mt-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-semibold">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-navy-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
              <button
                onClick={logout}
                title="Log out"
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
