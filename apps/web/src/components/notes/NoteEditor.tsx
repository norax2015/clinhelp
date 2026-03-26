'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useNote, useUpdateNote, useFinalizeNote } from '@/hooks/useNotes';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { NoteVersionHistory } from './NoteVersionHistory';
import { type Note } from '@/types';
import { Save, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import { formatDateTime, titleCase } from '@/lib/utils';

interface NoteEditorProps {
  noteId: string;
}

export function NoteEditor({ noteId }: NoteEditorProps) {
  const { data: note, isLoading, error, refetch } = useNote(noteId);
  const updateNote = useUpdateNote(noteId);
  const finalizeNote = useFinalizeNote(noteId);

  const [content, setContent] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (note) {
      setContent(typeof note.content === 'string' ? note.content : JSON.stringify(note.content, null, 2));
    }
  }, [note]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !note) {
    return (
      <Alert variant="error">
        Failed to load note.{' '}
        <button className="underline font-medium" onClick={() => refetch()}>Try again</button>
      </Alert>
    );
  }

  const n = note as Note;
  const isFinalized = n.status === 'finalized' || n.status === 'signed';

  async function handleSave() {
    setSaveSuccess(false);
    setSaveError(null);
    try {
      await updateNote.mutateAsync({ content });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError('Failed to save. Please try again.');
    }
  }

  async function handleFinalize() {
    setSaveError(null);
    try {
      await updateNote.mutateAsync({ content });
      await finalizeNote.mutateAsync();
    } catch {
      setSaveError('Failed to finalize note.');
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/app/notes" className="hover:text-navy-900 transition-colors">Notes</Link>
        <ChevronRight size={14} />
        <span className="text-navy-900 font-medium">
          {titleCase(n.type)} Note
        </span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-navy-900">{titleCase(n.type)} Note</h1>
            <Badge variant={isFinalized ? 'success' : n.status === 'draft' ? 'warning' : 'default'}>
              {titleCase(n.status)}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">Last updated {formatDateTime(n.updatedAt)}</p>
        </div>
        {n.encounterId && (
          <Link href={`/app/encounters/${n.encounterId}`}>
            <Button variant="outline" size="sm">View Encounter</Button>
          </Link>
        )}
      </div>

      {saveSuccess && (
        <Alert variant="success" onDismiss={() => setSaveSuccess(false)}>
          Draft saved successfully.
        </Alert>
      )}
      {saveError && (
        <Alert variant="error" onDismiss={() => setSaveError(null)}>
          {saveError}
        </Alert>
      )}

      {/* Editor */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isFinalized}
          className="w-full min-h-[400px] p-4 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-y disabled:opacity-60 disabled:cursor-not-allowed font-mono leading-relaxed"
        />

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            AI-assisted draft for clinician review. Not a substitute for clinical judgment.
          </p>
        </div>

        {!isFinalized && (
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              leftIcon={updateNote.isPending ? <Spinner size="sm" /> : <Save size={14} />}
              isLoading={updateNote.isPending}
              onClick={handleSave}
            >
              Save Draft
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={finalizeNote.isPending ? <Spinner size="sm" /> : <CheckCircle size={14} />}
              isLoading={finalizeNote.isPending}
              onClick={handleFinalize}
            >
              Finalize Note
            </Button>
          </div>
        )}
      </div>

      {/* Version history */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <NoteVersionHistory noteId={noteId} />
      </div>
    </div>
  );
}
