import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { encountersApi } from '@/lib/api';
import type { Encounter, Transcript, CodingSuggestion, PaginatedResponse } from '@clinhelp/types';

export const ENCOUNTERS_KEY = 'encounters';

export function useEncounters(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [ENCOUNTERS_KEY, params],
    queryFn: async () => {
      const res = await encountersApi.list(params);
      return res.data as PaginatedResponse<Encounter>;
    },
  });
}

export function useEncounter(id: string) {
  return useQuery({
    queryKey: [ENCOUNTERS_KEY, id],
    queryFn: async () => {
      const res = await encountersApi.get(id);
      // API returns the encounter object directly (not wrapped in { data: ... })
      return res.data as Encounter;
    },
    enabled: !!id,
  });
}

export function useEncounterTranscript(encounterId: string) {
  return useQuery({
    queryKey: [ENCOUNTERS_KEY, encounterId, 'transcript'],
    queryFn: async () => {
      const res = await encountersApi.getTranscript(encounterId);
      return res.data.data as Transcript;
    },
    enabled: !!encounterId,
  });
}

export function useEncounterCoding(encounterId: string) {
  return useQuery({
    queryKey: [ENCOUNTERS_KEY, encounterId, 'coding'],
    queryFn: async () => {
      const res = await encountersApi.getCodingSuggestions(encounterId);
      // Returns array ordered by createdAt desc; take the latest
      const arr = res.data as CodingSuggestion[];
      return (Array.isArray(arr) ? arr[0] : arr) ?? null;
    },
    enabled: !!encounterId,
  });
}

export function useCreateEncounter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => encountersApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ENCOUNTERS_KEY] });
    },
  });
}

export function useUpdateEncounter(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => encountersApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ENCOUNTERS_KEY, id] });
    },
  });
}

export function useGenerateNote(encounterId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      noteType: string;
      priorNoteContext?: string;
      specialty?: string;
      visitType?: string;
      chiefComplaint?: string;
      hpi?: string;
      symptoms?: string;
      vitals?: string;
      medications?: string;
      allergies?: string;
      labs?: string;
      assessmentClues?: string;
      planItems?: string;
      todayUpdates?: string;
      customInstructions?: string;
      tonePreference?: string;
    }) => encountersApi.generateNote(encounterId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ENCOUNTERS_KEY, encounterId] });
      qc.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}
