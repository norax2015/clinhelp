import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { screeningsApi } from '@/lib/api';
import type { Screening, PaginatedResponse } from '@clinhelp/types';

export const SCREENINGS_KEY = 'screenings';

export function useScreenings(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [SCREENINGS_KEY, params],
    queryFn: async () => {
      const res = await screeningsApi.list(params);
      return res.data as PaginatedResponse<Screening>;
    },
  });
}

export function useScreening(id: string) {
  return useQuery({
    queryKey: [SCREENINGS_KEY, id],
    queryFn: async () => {
      const res = await screeningsApi.get(id);
      return res.data.data as Screening;
    },
    enabled: !!id,
  });
}

export function useCreateScreening() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => screeningsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SCREENINGS_KEY] });
    },
  });
}
