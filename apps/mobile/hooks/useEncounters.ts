import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { encountersApi } from '../lib/api';
import type { Encounter, Note, PaginatedResponse, ApiResponse } from '@clinhelp/types';

export function useEncounters() {
  return useQuery({
    queryKey: ['encounters'],
    queryFn: async () => {
      const res = await encountersApi.list(1, 20);
      const body = res.data;
      if (body?.data && Array.isArray(body.data)) return body.data as Encounter[];
      if (Array.isArray(body)) return body as Encounter[];
      return [] as Encounter[];
    },
  });
}

export function useEncounter(id: string) {
  return useQuery({
    queryKey: ['encounters', id],
    queryFn: async () => {
      const res = await encountersApi.get(id);
      const body = res.data as ApiResponse<Encounter> | Encounter;
      return ('data' in body ? body.data : body) as Encounter;
    },
    enabled: !!id,
  });
}

export function useEncounterNote(encounterId: string) {
  return useQuery({
    queryKey: ['encounters', encounterId, 'note'],
    queryFn: async () => {
      const res = await encountersApi.getNote(encounterId);
      const body = res.data;
      if (Array.isArray(body)) return body[0] as Note | undefined;
      if (body?.data && Array.isArray(body.data)) return body.data[0] as Note | undefined;
      return undefined;
    },
    enabled: !!encounterId,
  });
}

export function useCreateEncounter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      patientId: string;
      type: string;
      visitMode: string;
      chiefComplaint?: string;
    }) => encountersApi.create(data).then((r) => {
      const body = r.data;
      return ('data' in body ? body.data : body) as Encounter;
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['encounters'] });
    },
  });
}

export function useGenerateNote(encounterId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (noteType: string) =>
      encountersApi.generateNote(encounterId, noteType).then((r) => {
        const body = r.data;
        return ('data' in body ? body.data : body);
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['encounters', encounterId, 'note'] });
    },
  });
}

export function useSaveNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      encounterId,
      noteId,
      content,
    }: {
      encounterId: string;
      noteId: string;
      content: string;
    }) => encountersApi.saveNote(encounterId, noteId, content),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['encounters', vars.encounterId, 'note'] });
    },
  });
}
