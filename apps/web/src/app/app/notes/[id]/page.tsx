'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { NoteEditor } from '@/components/notes/NoteEditor';

export default function NoteDetailPage() {
  const params = useParams<{ id: string }>();
  return <NoteEditor noteId={params.id} />;
}
