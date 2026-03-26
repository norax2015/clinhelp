'use client';

import React, { useState } from 'react';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import {
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell, EmptyTableRow,
} from '@/components/ui/Table';
import { type AuditLog, type AuditAction } from '@/types';
import { formatDateTime, titleCase } from '@/lib/utils';
import { Shield } from 'lucide-react';

const ACTION_OPTIONS = [
  { label: 'All Actions', value: '' },
  { label: 'Login', value: 'login' },
  { label: 'Logout', value: 'logout' },
  { label: 'Patient View', value: 'patient_view' },
  { label: 'Patient Create', value: 'patient_create' },
  { label: 'Encounter Create', value: 'encounter_create' },
  { label: 'Note Generate', value: 'note_generate' },
  { label: 'Note Finalize', value: 'note_finalize' },
  { label: 'Screening Submit', value: 'screening_submit' },
  { label: 'File Upload', value: 'file_upload' },
  { label: 'Admin Change', value: 'admin_change' },
];

function actionVariant(action: AuditAction) {
  switch (action) {
    case 'patient_create':
    case 'encounter_create':
    case 'task_create':
      return 'success';
    case 'note_generate':
    case 'transcript_request':
      return 'warning';
    case 'login':
      return 'accent';
    case 'note_finalize':
    case 'note_sign':
      return 'info';
    case 'admin_change':
    case 'settings_change':
      return 'danger';
    default:
      return 'default';
  }
}

function SkeletonRow() {
  return (
    <TableRow>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableCell key={i}><div className="h-4 bg-slate-100 rounded animate-pulse w-24" /></TableCell>
      ))}
    </TableRow>
  );
}

const PAGE_SIZE = 25;

export function AuditLogTable() {
  const [actionFilter, setActionFilter] = useState('');
  const [page, setPage] = useState(1);

  const params: Record<string, unknown> = {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    sort: '-createdAt',
  };
  if (actionFilter) params.action = actionFilter;

  const { data, isLoading, error, refetch } = useAuditLogs(params);
  const logs = (data?.data ?? []) as AuditLog[];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (error) {
    return (
      <Alert variant="error">
        Failed to load audit logs.{' '}
        <button className="underline font-medium" onClick={() => refetch()}>Try again</button>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select
          options={ACTION_OPTIONS}
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
          className="max-w-48"
        />
        <span className="text-sm text-slate-400">{total} total events</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHead>
            <tr>
              <TableHeader>Timestamp</TableHeader>
              <TableHeader>User</TableHeader>
              <TableHeader>Action</TableHeader>
              <TableHeader>Resource Type</TableHeader>
              <TableHeader>Resource ID</TableHeader>
              <TableHeader>IP Address</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
            ) : logs.length === 0 ? (
              <EmptyTableRow
                colSpan={6}
                icon={<Shield size={26} />}
                message="No audit log entries found."
              />
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-slate-500 text-xs whitespace-nowrap">
                    {formatDateTime(log.createdAt)}
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">
                    {log.user
                      ? `${(log.user as { firstName: string }).firstName} ${(log.user as { lastName: string }).lastName}`
                      : log.userId}
                  </TableCell>
                  <TableCell>
                    <Badge variant={actionVariant(log.action)} size="sm">
                      {titleCase(log.action)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 capitalize">{log.resourceType ?? '—'}</TableCell>
                  <TableCell className="text-slate-400 text-xs font-mono truncate max-w-32">
                    {log.resourceId ?? '—'}
                  </TableCell>
                  <TableCell className="text-slate-400 text-xs font-mono">
                    {log.ipAddress ?? '—'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
