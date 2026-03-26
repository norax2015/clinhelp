'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { usePatients } from '@/hooks/usePatients';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import {
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell, EmptyTableRow,
} from '@/components/ui/Table';
import { PatientFormModal } from '@/components/patients/PatientFormModal';
import { formatDate, calculateAge, formatMRN, titleCase } from '@/lib/utils';
import { type Patient, type PatientStatus } from '@/types';
import { Search, Users, UserPlus } from 'lucide-react';


function statusVariant(status: PatientStatus) {
  switch (status) {
    case 'active': return 'success';
    case 'inactive': return 'default';
    case 'discharged': return 'warning';
    case 'waitlist': return 'info';
    default: return 'default';
  }
}

const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Discharged', value: 'discharged' },
  { label: 'Waitlist', value: 'waitlist' },
];

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell><div className="h-4 bg-slate-100 rounded animate-pulse w-36" /></TableCell>
      <TableCell><div className="h-4 bg-slate-100 rounded animate-pulse w-24" /></TableCell>
      <TableCell><div className="h-4 bg-slate-100 rounded animate-pulse w-20" /></TableCell>
      <TableCell><div className="h-5 bg-slate-100 rounded-full animate-pulse w-16" /></TableCell>
      <TableCell><div className="h-4 bg-slate-100 rounded animate-pulse w-24" /></TableCell>
      <TableCell><div className="h-7 bg-slate-100 rounded animate-pulse w-14" /></TableCell>
    </TableRow>
  );
}

export function PatientList() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  const params = useMemo(() => {
    const p: Record<string, unknown> = {};
    if (search) p.search = search;
    if (status) p.status = status;
    return p;
  }, [search, status]);

  const { data, isLoading, error, refetch } = usePatients(params);
  const patients = (data?.data ?? []) as Patient[];

  if (error) {
    return (
      <Alert variant="error">
        Failed to load patients.{' '}
        <button className="underline font-medium" onClick={() => refetch()}>
          Try again
        </button>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <Input
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftElement={<Search size={14} />}
          className="sm:max-w-xs"
        />
        <Select
          options={statusOptions}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="sm:max-w-48"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHead>
            <tr>
              <TableHeader>Name</TableHeader>
              <TableHeader>MRN</TableHeader>
              <TableHeader>Date of Birth</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Last Encounter</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
            ) : patients.length === 0 ? (
              <EmptyTableRow
                colSpan={6}
                icon={<Users size={28} />}
                message="No patients found"
                action={
                  <Button variant="accent" size="sm" leftIcon={<UserPlus size={13} />} onClick={() => setShowNewModal(true)}>
                    Add First Patient
                  </Button>
                }
              />
            ) : (
              patients.map((patient) => (
                <TableRow
                  key={patient.id}
                  clickable
                  onClick={() => router.push(`/app/patients/${patient.id}`)}
                >
                  <TableCell className="font-medium text-navy-900">
                    {patient.firstName} {patient.lastName}
                  </TableCell>
                  <TableCell className="text-slate-500 font-mono text-xs">
                    {formatMRN(patient.mrn)}
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {formatDate(patient.dateOfBirth)}{' '}
                    <span className="text-slate-400 text-xs">
                      ({calculateAge(patient.dateOfBirth)} yrs)
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(patient.status)}>
                      {titleCase(patient.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {(patient as unknown as { lastEncounterAt?: string }).lastEncounterAt
                        ? formatDate((patient as unknown as { lastEncounterAt: string }).lastEncounterAt)
                        : '—'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/app/patients/${patient.id}`);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.total > 0 && (
        <p className="text-xs text-slate-400 text-right">
          Showing {patients.length} of {data.total} patients
        </p>
      )}

      <PatientFormModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
      />
    </div>
  );
}
