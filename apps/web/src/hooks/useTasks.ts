import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/lib/api';
import type { Task, PaginatedResponse } from '@clinhelp/types';

export const TASKS_KEY = 'tasks';

export function useTasks(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [TASKS_KEY, params],
    queryFn: async () => {
      const res = await tasksApi.list(params);
      return res.data as PaginatedResponse<Task>;
    },
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: [TASKS_KEY, id],
    queryFn: async () => {
      const res = await tasksApi.get(id);
      return res.data.data as Task;
    },
    enabled: !!id,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => tasksApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
  });
}

export function useUpdateTask(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => tasksApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
  });
}
