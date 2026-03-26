import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../lib/api';
import type { AnalyticsSummary, Patient, Task } from '@clinhelp/types';

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const res = await dashboardApi.summary();
      const body = res.data;
      return ('data' in body ? body.data : body) as AnalyticsSummary;
    },
  });
}

export function useRecentPatients() {
  return useQuery({
    queryKey: ['dashboard', 'recentPatients'],
    queryFn: async () => {
      const res = await dashboardApi.recentPatients();
      const body = res.data;
      if (Array.isArray(body)) return body as Patient[];
      if (body?.data && Array.isArray(body.data)) return body.data as Patient[];
      return [] as Patient[];
    },
  });
}

export function useTodaysTasks() {
  return useQuery({
    queryKey: ['dashboard', 'todaysTasks'],
    queryFn: async () => {
      const res = await dashboardApi.todaysTasks();
      const body = res.data;
      if (Array.isArray(body)) return body as Task[];
      if (body?.data && Array.isArray(body.data)) return body.data as Task[];
      return [] as Task[];
    },
  });
}
