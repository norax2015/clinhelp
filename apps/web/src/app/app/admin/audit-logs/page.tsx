'use client';

import React from 'react';
import Link from 'next/link';
import { AuditLogTable } from '@/components/admin/AuditLogTable';
import { ChevronRight } from 'lucide-react';

export default function AdminAuditLogsPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/app/admin" className="hover:text-navy-900 transition-colors">Admin</Link>
        <ChevronRight size={14} />
        <span className="text-navy-900 font-medium">Audit Logs</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-navy-900">Audit Logs</h1>
        <p className="text-slate-500 text-sm mt-1">
          Review all system activity, security events, and data access logs
        </p>
      </div>

      <AuditLogTable />
    </div>
  );
}
