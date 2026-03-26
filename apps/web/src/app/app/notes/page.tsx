'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useNotes } from '@/hooks/useNotes';
import { useEncounters } from '@/hooks/useEncounters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
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
import type { Note, NoteStatus } from '@/types';
import { FileText, Plus, Search, X, ChevronRight, ExternalLink } from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_TABS = [
  { label: 'All', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Pending Review', value: 'pending_review' },
  { label: 'Finalized', value: 'finalized' },
  { label: 'Signed', value: 'signed' },
];

function statusVariant(status: NoteStatus): 'default' | 'success' | 'warning' | 'info' | 'danger' {
  switch (status) {
    case 'draft': return 'default';
    case 'pending_review': return 'warning';
    case 'finalized': return 'info';
    case 'signed': return 'success';
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

// ─── Add Note Modal ────────────────────────────────────────────────────────────

function AddNoteModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { data: encData, isLoading } = useEncounters({ sort: '-createdAt', limit: 25 });
  const encounters = (encData?.data ?? []) as unknown as Array<Record<string, unknown>>;
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return encounters;
    const q = search.toLowerCase();
    return encounters.filter((e) => {
      const patient = e.patient as { firstName: string; lastName: string } | undefined;
      const name = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : '';
      return name.includes(q) || (e.type as string | undefined)?.toLowerCase().includes(q);
    });
  }, [encounters, search]);

  // Close on Escape
  React.useEffect(() => {
    const handler = (ev: KeyboardEvent) => { if (ev.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
           style={{ maxHeight: '80vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-navy-900">Add Note</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an encounter to open its note workspace
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-4 pb-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              type="text"
              placeholder="Search patient or encounter type…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 bg-white"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Encounter list */}
        <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-1.5 min-h-0">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Spinner size="md" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10">
              {search ? 'No encounters match your search.' : 'No encounters found.'}
            </p>
          ) : (
            filtered.map((enc) => {
              const patient = enc.patient as { firstName: string; lastName: string } | undefined;
              const patientName = patient
                ? `${patient.firstName} ${patient.lastName}`
                : 'Unknown Patient';
              return (
                <button
                  key={enc.id as string}
                  className="w-full text-left flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-teal-300 hover:bg-teal-50/40 transition-all group"
                  onClick={() => {
                    router.push(`/app/encounters/${enc.id as string}`);
                    onClose();
                  }}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy-900 truncate">{patientName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {titleCase((enc.type as string) ?? '')} ·{' '}
                      {titleCase((enc.visitMode as string) ?? '')} ·{' '}
                      {formatDate((enc.createdAt as string) ?? '')}
                    </p>
                  </div>
                  <ChevronRight
                    size={14}
                    className="flex-shrink-0 ml-3 text-slate-300 group-hover:text-teal-500 transition-colors"
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            Notes are created inside encounter workspaces
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              router.push('/app/encounters/new');
              onClose();
            }}
          >
            <Plus size={14} className="mr-1.5" />
            New Encounter
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Notes Page ────────────────────────────────────────────────────────────────

export default function NotesPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const queryParams: Record<string, unknown> = { sort: '-updatedAt' };
  if (statusFilter) queryParams.status = statusFilter;

  const { data, isLoading, error, refetch } = useNotes(queryParams);
  const allNotes = (data?.data ?? []) as Note[];

  // Client-side search across patient name, provider, note type
  const notes = useMemo(() => {
    if (!search.trim()) return allNotes;
    const q = search.toLowerCase();
    return allNotes.filter((note) => {
      const patient = (note as unknown as Record<string, unknown>).patient as
        | { firstName: string; lastName: string }
        | undefined;
      const provider = (note as unknown as Record<string, unknown>).provider as
        | { firstName: string; lastName: string }
        | undefined;
      const patientName = patient
        ? `${patient.firstName} ${patient.lastName}`.toLowerCase()
        : '';
      const providerName = provider
        ? `${provider.firstName} ${provider.lastName}`.toLowerCase()
        : '';
      return (
        patientName.includes(q) ||
        providerName.includes(q) ||
        note.type?.toLowerCase().includes(q)
      );
    });
  }, [allNotes, search]);

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Notes</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Clinical notes generated and managed in ClinHelp
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} className="mr-1.5 -ml-0.5" />
          Add Note
        </Button>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Status tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg flex-shrink-0">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                statusFilter === tab.value
                  ? 'bg-white text-navy-900 shadow-sm'
                  : 'text-slate-500 hover:text-navy-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, provider, type…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {error ? (
        <Alert variant="error">
          Failed to load notes.{' '}
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
                <TableHeader>Status</TableHeader>
                <TableHeader>Provider</TableHeader>
                <TableHeader>Updated</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : notes.length === 0 ? (
                <EmptyTableRow
                  colSpan={6}
                  icon={<FileText size={28} />}
                  message={
                    search || statusFilter
                      ? 'No notes match your filters. Try clearing the search or changing the status tab.'
                      : 'No notes yet. Open an encounter and click Generate Smart Note to create one.'
                  }
                />
              ) : (
                notes.map((note) => {
                  const patient = (note as unknown as Record<string, unknown>).patient as
                    | { id?: string; firstName: string; lastName: string }
                    | undefined;
                  const provider = (note as unknown as Record<string, unknown>).provider as
                    | { firstName: string; lastName: string }
                    | undefined;

                  return (
                    <TableRow
                      key={note.id}
                      clickable
                      onClick={() => router.push(`/app/notes/${note.id}`)}
                    >
                      <TableCell className="font-medium text-navy-900">
                        {patient ? `${patient.firstName} ${patient.lastName}` : '—'}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {titleCase(note.type)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(note.status)}>
                          {titleCase(note.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {provider
                          ? `${provider.firstName} ${provider.lastName}`
                          : '—'}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {formatDate(note.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/app/notes/${note.id}`);
                            }}
                          >
                            View Note
                          </Button>
                          <button
                            title="Open in Encounter Workspace"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/app/encounters/${note.encounterId}`);
                            }}
                            className="p-1.5 rounded-md text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                          >
                            <ExternalLink size={14} />
                          </button>
                        </div>
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
          Showing {notes.length} of {data.total} notes
          {statusFilter ? ` · filtered by ${titleCase(statusFilter)}` : ''}
        </p>
      )}

      {/* Add Note modal */}
      {showAddModal && <AddNoteModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
