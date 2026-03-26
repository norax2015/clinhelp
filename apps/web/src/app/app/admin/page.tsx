'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { adminApi } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { Tabs, TabsList, TabTrigger, TabContent } from '@/components/ui/Tabs';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  EmptyTableRow,
} from '@/components/ui/Table';
import { formatDate, formatDateTime, titleCase } from '@/lib/utils';
import type { User, UserRole, AuditLog, PaginatedResponse } from '@/types';
import { Users, Shield } from 'lucide-react';

function roleVariant(
  role: UserRole
): 'default' | 'success' | 'warning' | 'info' | 'danger' {
  switch (role) {
    case 'super_admin':
    case 'org_admin': return 'danger';
    case 'provider':
    case 'therapist': return 'info';
    case 'care_coordinator':
    case 'intake_staff': return 'warning';
    case 'biller': return 'default';
    case 'viewer': return 'default';
    default: return 'default';
  }
}

function UserSkeletonRow() {
  return (
    <TableRow>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableCell key={i}>
          <div className="h-4 bg-slate-100 rounded animate-pulse w-28" />
        </TableCell>
      ))}
    </TableRow>
  );
}

function AuditSkeletonRow() {
  return (
    <TableRow>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableCell key={i}>
          <div className="h-4 bg-slate-100 rounded animate-pulse w-28" />
        </TableCell>
      ))}
    </TableRow>
  );
}

function UsersTab() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await adminApi.getUsers({ limit: 100 });
      return res.data as PaginatedResponse<User>;
    },
  });

  const users = (data?.data ?? []) as User[];

  if (error) {
    return (
      <Alert variant="error">
        Failed to load users.{' '}
        <button className="underline font-medium" onClick={() => refetch()}>
          Try again
        </button>
      </Alert>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <Table>
        <TableHead>
          <tr>
            <TableHeader>Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Role</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Joined</TableHeader>
          </tr>
        </TableHead>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <UserSkeletonRow key={i} />)
          ) : users.length === 0 ? (
            <EmptyTableRow
              colSpan={5}
              icon={<Users size={26} />}
              message="No users found."
            />
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-navy-900">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell className="text-slate-500">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={roleVariant(user.role)}>
                    {titleCase(user.role)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? 'success' : 'default'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500">
                  {formatDate(user.createdAt)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function AuditLogTab() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: async () => {
      const res = await adminApi.getAuditLogs({ limit: 100, sort: '-createdAt' });
      return res.data as PaginatedResponse<AuditLog>;
    },
  });

  const logs = (data?.data ?? []) as AuditLog[];

  if (error) {
    return (
      <Alert variant="error">
        Failed to load audit logs.{' '}
        <button className="underline font-medium" onClick={() => refetch()}>
          Try again
        </button>
      </Alert>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <Table>
        <TableHead>
          <tr>
            <TableHeader>Action</TableHeader>
            <TableHeader>Resource</TableHeader>
            <TableHeader>User</TableHeader>
            <TableHeader>IP Address</TableHeader>
            <TableHeader>Date</TableHeader>
          </tr>
        </TableHead>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <AuditSkeletonRow key={i} />)
          ) : logs.length === 0 ? (
            <EmptyTableRow
              colSpan={5}
              icon={<Shield size={26} />}
              message="No audit logs found."
            />
          ) : (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium text-navy-900 font-mono text-xs">
                  {log.action}
                </TableCell>
                <TableCell className="text-slate-500 text-xs">
                  {log.resourceType ?? '—'}
                  {log.resourceId && (
                    <span className="text-slate-400"> ({log.resourceId.slice(0, 8)}…)</span>
                  )}
                </TableCell>
                <TableCell className="text-slate-500">
                  {log.user
                    ? `${log.user.firstName} ${log.user.lastName}`
                    : log.userId ?? '—'}
                </TableCell>
                <TableCell className="text-slate-500 font-mono text-xs">
                  {log.ipAddress ?? '—'}
                </TableCell>
                <TableCell className="text-slate-500 text-xs">
                  {formatDateTime(log.createdAt)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function AdminPage() {
  const { user } = useAuth();

  if (user && user.role !== 'org_admin' && user.role !== 'super_admin') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Admin</h1>
        </div>
        <Alert variant="warning">
          Access restricted to administrators. Contact your organization admin if you need access.
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Admin</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage users and review system activity
        </p>
      </div>

      <Tabs defaultTab="users">
        <TabsList className="mb-5">
          <TabTrigger value="users">Users</TabTrigger>
          <TabTrigger value="audit">Audit Log</TabTrigger>
        </TabsList>

        <TabContent value="users">
          <UsersTab />
        </TabContent>

        <TabContent value="audit">
          <AuditLogTab />
        </TabContent>
      </Tabs>
    </div>
  );
}
