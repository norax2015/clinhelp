'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEncounters } from '@/hooks/useEncounters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import {
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell, EmptyTableRow,
} from '@/components/ui/Table';
import { formatDate, titleCase } from '@/lib/utils';
import { type Encounter, type EncounterStatus } from '@/types';
import { Stethoscope, Plus } from 'lucide-react';

function statusVariant(status: EncounterStatus) {
  switch (status) {
    case 'completed': return 'success';
    case 'in_progress': return 'info';
    case 'scheduled': return 'warning';
    case 'cancelled': return 'danger';
    default: return 'default';
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

export function EncounterList() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useEncounters({ sort: '-createdAt' });
  const encounters = (data?.data ?? []) as Encounter[];

  if (error) {
    return (
      <Alert variant="error">
        Failed to load encounters.{' '}
        <button className="underline font-medium" onClick={() => refetch()}>Try again</button>
      </Alert>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <Table>
        <TableHead>
          <tr>
            <TableHeader>Patient</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Visit Mode</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Provider</TableHeader>
          </tr>
        </TableHead>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
          ) : encounters.length === 0 ? (
            <EmptyTableRow
              colSpan={6}
              icon={<Stethoscope size={28} />}
              message="No encounters found"
              action={
                <Button
                  variant="accent"
                  size="sm"
                  leftIcon={<Plus size={14} />}
                  onClick={() => router.push('/app/encounters/new')}
                >
                  New Encounter
                </Button>
              }
            />
          ) : (
            encounters.map((enc) => (
              <TableRow
                key={enc.id}
                clickable
                onClick={() => router.push(`/app/encounters/${enc.id}`)}
              >
                <TableCell className="font-medium text-navy-900">
                  {enc.patient
                    ? `${(enc.patient as { firstName: string }).firstName} ${(enc.patient as { lastName: string }).lastName}`
                    : enc.patientId}
                </TableCell>
                <TableCell>
                  <Badge variant="default">{titleCase(enc.type)}</Badge>
                </TableCell>
                <TableCell className="text-slate-500">{titleCase(enc.visitMode)}</TableCell>
                <TableCell className="text-slate-500">{formatDate(enc.createdAt)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(enc.status)}>{titleCase(enc.status)}</Badge>
                </TableCell>
                <TableCell className="text-slate-500">
                  {enc.provider
                    ? `${(enc.provider as { firstName: string }).firstName} ${(enc.provider as { lastName: string }).lastName}`
                    : '—'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
