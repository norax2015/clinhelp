'use client';

import React from 'react';
import Link from 'next/link';
import { UserTable } from '@/components/admin/UserTable';
import { ChevronRight } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/app/admin" className="hover:text-navy-900 transition-colors">Admin</Link>
        <ChevronRight size={14} />
        <span className="text-navy-900 font-medium">Users</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-navy-900">User Management</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage team members, roles, and send invitations
        </p>
      </div>

      <UserTable />
    </div>
  );
}
