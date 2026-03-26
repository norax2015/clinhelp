'use client';

import React, { useState } from 'react';
import { useScreenings } from '@/hooks/useScreenings';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ScreeningFormModal } from '@/components/screenings/ScreeningFormModal';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  EmptyTableRow,
} from '@/components/ui/Table';
import { formatDate, titleCase } from '@/lib/utils';
import type { Screening, ScreeningSeverity } from '@/types';
import { ClipboardList, Plus } from 'lucide-react';

function severityVariant(
  severity: ScreeningSeverity
): 'default' | 'success' | 'warning' | 'info' | 'danger' {
  switch (severity) {
    case 'none':
    case 'minimal': return 'success';
    case 'mild': return 'info';
    case 'moderate': return 'warning';
    case 'moderately_severe':
    case 'severe': return 'danger';
    default: return 'default';
  }
}

function SkeletonRow() {
  return (
    <TableRow>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableCell key={i}>
          <div className="h-4 bg-slate-100 rounded animate-pulse w-24" />
        </TableCell>
      ))}
    </TableRow>
  );
}

export default function ScreeningsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading, error, refetch } = useScreenings({ sort: '-createdAt' });
  const screenings = (data?.data ?? []) as Screening[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Screenings</h1>
          <p className="text-slate-500 text-sm mt-1">
            PHQ-9, GAD-7, C-SSRS, AUDIT and more
          </p>
        </div>
        <Button
          variant="accent"
          leftIcon={<Plus size={16} />}
          onClick={() => setModalOpen(true)}
        >
          New Screening
        </Button>
      </div>

      {error ? (
        <Alert variant="error">
          Failed to load screenings.{' '}
          <button className="underline font-medium" onClick={() => refetch()}>
            Try again
          </button>
        </Alert>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <Table>
            <TableHead>
              <tr>
                <TableHeader>Patient</TableHeader>
                <TableHeader>Type</TableHeader>
                <TableHeader>Score</TableHeader>
                <TableHeader>Severity</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Administered By</TableHeader>
              </tr>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : screenings.length === 0 ? (
                <EmptyTableRow
                  colSpan={6}
                  icon={<ClipboardList size={28} />}
                  message="No screenings recorded yet."
                  action={
                    <Button
                      variant="accent"
                      size="sm"
                      leftIcon={<Plus size={14} />}
                      onClick={() => setModalOpen(true)}
                    >
                      New Screening
                    </Button>
                  }
                />
              ) : (
                screenings.map((scr) => {
                  const patient = (
                    scr as unknown as {
                      patient?: { firstName: string; lastName: string };
                    }
                  ).patient;
                  const administeredBy = (
                    scr as unknown as {
                      administeredBy?: { firstName: string; lastName: string };
                    }
                  ).administeredBy;

                  return (
                    <TableRow key={scr.id}>
                      <TableCell className="font-medium text-navy-900">
                        {patient
                          ? `${patient.firstName} ${patient.lastName}`
                          : '—'}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {scr.type}
                      </TableCell>
                      <TableCell className="text-slate-500 font-mono text-sm">
                        {scr.totalScore ?? '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={severityVariant(scr.severity)}>
                          {titleCase(scr.severity)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {formatDate(scr.createdAt)}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {administeredBy
                          ? `${administeredBy.firstName} ${administeredBy.lastName}`
                          : '—'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {data && data.total > 0 && (
        <p className="text-xs text-slate-400 text-right">
          Showing {screenings.length} of {data.total} screenings
        </p>
      )}

      <ScreeningFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
