'use client';

import React, { useState } from 'react';
import { useNoteVersions } from '@/hooks/useNotes';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { type NoteVersion } from '@/types';
import { History, Eye } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

interface NoteVersionHistoryProps {
  noteId: string;
}

export function NoteVersionHistory({ noteId }: NoteVersionHistoryProps) {
  const { data: versions, isLoading } = useNoteVersions(noteId);
  const [selectedVersion, setSelectedVersion] = useState<NoteVersion | null>(null);
  const [collapsed, setCollapsed] = useState(true);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-2">
        <Spinner size="sm" />
        <span className="text-xs text-slate-400">Loading version history...</span>
      </div>
    );
  }

  if (!versions || versions.length === 0) {
    return (
      <p className="text-xs text-slate-400 py-2">No version history available.</p>
    );
  }

  return (
    <div>
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-navy-900 transition-colors py-1"
      >
        <History size={13} />
        <span>Version History ({versions.length})</span>
      </button>

      {!collapsed && (
        <ul className="mt-2 space-y-1.5">
          {versions.map((version, idx) => (
            <li
              key={version.id}
              className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-slate-50 group"
            >
              <div className="flex items-center gap-2">
                <Badge variant="default" size="sm">v{versions.length - idx}</Badge>
                <span className="text-xs text-slate-500">
                  {formatDateTime(version.createdAt)}
                </span>
                {version.editedById && (
                  <span className="text-xs text-slate-400">by user {version.editedById.slice(0, 8)}</span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Eye size={12} />}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setSelectedVersion(version)}
              >
                View
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Modal
        isOpen={!!selectedVersion}
        onClose={() => setSelectedVersion(null)}
        title="Note Version"
        description={selectedVersion ? formatDateTime(selectedVersion.createdAt) : undefined}
        size="lg"
      >
        {selectedVersion && (
          <div className="bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
              {typeof selectedVersion.content === 'string'
                ? selectedVersion.content
                : JSON.stringify(selectedVersion.content, null, 2)}
            </pre>
          </div>
        )}
      </Modal>
    </div>
  );
}
