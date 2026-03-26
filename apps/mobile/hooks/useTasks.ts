import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../lib/api';
import type { Task } from '@clinhelp/types';

export type TaskFilter = 'all' | 'today' | 'pending' | 'completed';

function resolveTasksFromResponse(body: unknown): Task[] {
  if (Array.isArray(body)) return body as Task[];
  const b = body as any;
  if (b?.data && Array.isArray(b.data)) return b.data as Task[];
  return [];
}

export function useTasks(filter: TaskFilter = 'all') {
  const apiFilter = filter === 'all' ? undefined : filter;
  return useQuery({
    queryKey: ['tasks', filter],
    queryFn: async () => {
      const res = await tasksApi.list(apiFilter);
      return resolveTasksFromResponse(res.data);
    },
  });
}

export function useCompleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => tasksApi.complete(taskId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      description?: string;
      patientId?: string;
      dueDate?: string;
      priority: string;
    }) => tasksApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
