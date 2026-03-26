import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi, aiApi } from '@/lib/api';
import type { Note, NoteVersion, PaginatedResponse } from '@clinhelp/types';

export const NOTES_KEY = 'notes';

export function useNotes(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [NOTES_KEY, params],
    queryFn: async () => {
      const res = await notesApi.list(params);
      return res.data as PaginatedResponse<Note>;
    },
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: [NOTES_KEY, id],
    queryFn: async () => {
      const res = await notesApi.get(id);
      return res.data as Note;
    },
    enabled: !!id,
  });
}

export function useNoteVersions(noteId: string) {
  return useQuery({
    queryKey: [NOTES_KEY, noteId, 'versions'],
    queryFn: async () => {
      const res = await notesApi.getVersions(noteId);
      return res.data as NoteVersion[];
    },
    enabled: !!noteId,
  });
}

export function useSignNote(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notesApi.sign(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [NOTES_KEY, id] });
      qc.invalidateQueries({ queryKey: [NOTES_KEY] });
    },
  });
}

export function useUpdateNote(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => notesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [NOTES_KEY, id] });
    },
  });
}

export function useFinalizeNote(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notesApi.finalize(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [NOTES_KEY, id] });
      qc.invalidateQueries({ queryKey: [NOTES_KEY] });
    },
  });
}

export function useRegenerateSection() {
  return useMutation({
    mutationFn: (data: {
      noteId: string;
      sectionKey: string;
      currentNoteText: string;
      additionalContext?: string;
      specialty?: string;
      customInstructions?: string;
    }) => aiApi.regenerateSection(data),
  });
}
