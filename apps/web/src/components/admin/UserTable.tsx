'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import {
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell, EmptyTableRow,
} from '@/components/ui/Table';
import { type User, type UserRole } from '@/types';
import { formatDateTime, titleCase } from '@/lib/utils';
import { Users, UserPlus } from 'lucide-react';

function roleVariant(role: UserRole) {
  switch (role) {
    case 'super_admin': return 'danger';
    case 'org_admin': return 'danger';
    case 'provider': return 'primary';
    case 'therapist': return 'primary';
    case 'biller': return 'info';
    case 'care_coordinator': return 'accent';
    case 'intake_staff': return 'default';
    case 'viewer': return 'default';
    default: return 'default';
  }
}

function SkeletonRow() {
  return (
    <TableRow>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableCell key={i}><div className="h-4 bg-slate-100 rounded animate-pulse w-28" /></TableCell>
      ))}
    </TableRow>
  );
}

export function UserTable() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('provider');

  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await adminApi.getUsers();
      return res.data.data as User[];
    },
  });

  const users = data ?? [];

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    setInviteError('');
    try {
      await adminApi.inviteUser({ email: inviteEmail, role: inviteRole });
      setInviteSuccess(true);
      setInviteEmail('');
      setTimeout(() => {
        setInviteSuccess(false);
        setShowInviteModal(false);
        refetch();
      }, 2000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setInviteError(msg ?? 'Failed to send invitation. Please try again.');
    } finally {
      setInviting(false);
    }
  }

  if (error) {
    return (
      <Alert variant="error">
        Failed to load users.{' '}
        <button className="underline font-medium" onClick={() => refetch()}>Try again</button>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="accent"
          size="sm"
          leftIcon={<UserPlus size={14} />}
          onClick={() => setShowInviteModal(true)}
        >
          Invite User
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHead>
            <tr>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Last Login</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : users.length === 0 ? (
              <EmptyTableRow
                colSpan={5}
                icon={<Users size={26} />}
                message="No users found"
              />
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-navy-900">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell className="text-slate-500">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={roleVariant(user.role)}>{titleCase(user.role)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'success' : 'default'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {(user as unknown as { lastLoginAt?: string }).lastLoginAt
                      ? formatDateTime((user as unknown as { lastLoginAt: string }).lastLoginAt)
                      : 'Never'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={showInviteModal}
        onClose={() => { setShowInviteModal(false); setInviteSuccess(false); }}
        title="Invite User"
        description="Send an invitation email to add a new team member."
        size="sm"
      >
        {inviteSuccess ? (
          <div className="text-center py-4">
            <p className="text-sm text-emerald-600 font-medium">Invitation sent successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleInvite} className="space-y-4">
            {inviteError && (
              <Alert variant="error" onDismiss={() => setInviteError('')}>{inviteError}</Alert>
            )}
            <Input
              label="Email Address"
              type="email"
              placeholder="colleague@clinic.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
            <div>
              <label className="label-base">Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as UserRole)}
                className="input-base appearance-none"
              >
                <option value="provider">Provider</option>
                <option value="therapist">Therapist</option>
                <option value="care_coordinator">Care Coordinator</option>
                <option value="biller">Biller</option>
                <option value="intake_staff">Intake Staff</option>
                <option value="viewer">Viewer</option>
                <option value="org_admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowInviteModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={inviting}>
                Send Invite
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
