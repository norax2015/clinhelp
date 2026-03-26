'use client';

import React from 'react';
import Link from 'next/link';
import { useEncounters } from '@/hooks/useEncounters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, titleCase } from '@/lib/utils';
import { type Encounter, type EncounterStatus } from '@/types';
import { AlertCircle, ChevronRight } from 'lucide-react';

function statusVariant(status: EncounterStatus) {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in_progress':
      return 'info';
    case 'scheduled':
      return 'warning';
    case 'cancelled':
      return 'danger';
    default:
      return 'default';
  }
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="table-cell"><div className="h-4 bg-slate-100 rounded w-32" /></td>
      <td className="table-cell"><div className="h-5 bg-slate-100 rounded w-20" /></td>
      <td className="table-cell"><div className="h-4 bg-slate-100 rounded w-24" /></td>
      <td className="table-cell"><div className="h-5 bg-slate-100 rounded w-16" /></td>
    </tr>
  );
}

export function RecentEncounters() {
  const { data, isLoading, error, refetch } = useEncounters({ limit: 5, sort: '-createdAt' });
  const encounters = (data?.data ?? []) as Encounter[];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-base font-semibold text-navy-900">Recent Encounters</h2>
        <Link href="/app/encounters">
          <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={14} />}>
            View all
          </Button>
        </Link>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-6">
          <AlertCircle size={24} className="text-red-400" />
          <p className="text-sm text-slate-500">Failed to load encounters.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="table-header text-left">Patient</th>
                <th className="table-header text-left">Type</th>
                <th className="table-header text-left">Date</th>
                <th className="table-header text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : encounters.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-sm text-slate-400">
                    No encounters yet. Start your first encounter to see it here.
                  </td>
                </tr>
              ) : (
                encounters.map((enc) => (
                  <tr
                    key={enc.id}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => {
                      window.location.href = `/app/encounters/${enc.id}`;
                    }}
                  >
                    <td className="table-cell font-medium text-navy-900">
                      {enc.patient
                        ? `${(enc.patient as { firstName: string }).firstName} ${(enc.patient as { lastName: string }).lastName}`
                        : enc.patientId}
                    </td>
                    <td className="table-cell">
                      <Badge variant="default">{titleCase(enc.type)}</Badge>
                    </td>
                    <td className="table-cell text-slate-500">{formatDate(enc.createdAt)}</td>
                    <td className="table-cell">
                      <Badge variant={statusVariant(enc.status)}>{titleCase(enc.status)}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
