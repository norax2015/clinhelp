'use client';

import React from 'react';
import { useScreenings } from '@/hooks/useScreenings';
import { ScoreBadge } from './ScoreBadge';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import {
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell, EmptyTableRow,
} from '@/components/ui/Table';
import { type Screening } from '@/types';
import { formatDate } from '@/lib/utils';
import { ClipboardList } from 'lucide-react';

interface ScreeningHistoryProps {
  patientId?: string;
}

function SkeletonRow() {
  return (
    <TableRow>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableCell key={i}><div className="h-4 bg-slate-100 rounded animate-pulse w-24" /></TableCell>
      ))}
    </TableRow>
  );
}

export function ScreeningHistory({ patientId }: ScreeningHistoryProps) {
  const params = patientId ? { patientId } : {};
  const { data, isLoading, error, refetch } = useScreenings(params);
  const screenings = (data?.data ?? []) as Screening[];

  if (error) {
    return (
      <Alert variant="error">
        Failed to load screenings.{' '}
        <button className="underline font-medium" onClick={() => refetch()}>Try again</button>
      </Alert>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <Table>
        <TableHead>
          <tr>
            <TableHeader>Type</TableHeader>
            <TableHeader>Patient</TableHeader>
            <TableHeader>Score</TableHeader>
            <TableHeader>Severity</TableHeader>
            <TableHeader>Date</TableHeader>
          </tr>
        </TableHead>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : screenings.length === 0 ? (
            <EmptyTableRow
              colSpan={5}
              icon={<ClipboardList size={26} />}
              message="No screenings recorded yet."
            />
          ) : (
            screenings.map((scr) => (
              <TableRow key={scr.id}>
                <TableCell className="font-medium text-navy-900">{scr.type}</TableCell>
                <TableCell className="text-slate-500">
                  {(scr as unknown as Record<string, unknown>).patient
                    ? `${((scr as unknown as Record<string, unknown>).patient as { firstName: string }).firstName} ${((scr as unknown as Record<string, unknown>).patient as { lastName: string }).lastName}`
                    : '—'}
                </TableCell>
                <TableCell className="text-slate-500">{scr.totalScore ?? '—'}</TableCell>
                <TableCell>
                  <ScoreBadge severity={scr.severity} showScore={false} />
                </TableCell>
                <TableCell className="text-slate-500">{formatDate(scr.createdAt)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
