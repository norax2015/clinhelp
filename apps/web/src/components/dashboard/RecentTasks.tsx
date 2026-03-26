'use client';

import React from 'react';
import Link from 'next/link';
import { useTasks } from '@/hooks/useTasks';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, titleCase } from '@/lib/utils';
import { type Task, type TaskPriority } from '@/types';
import { AlertCircle, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

function priorityVariant(priority: TaskPriority) {
  switch (priority) {
    case 'urgent':
      return 'danger';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
      return 'default';
    default:
      return 'default';
  }
}

export function RecentTasks() {
  const { data, isLoading, error, refetch } = useTasks({ limit: 5, status: 'pending', sort: '-priority' });
  const tasks = (data?.data ?? []) as Task[];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-base font-semibold text-navy-900">Pending Tasks</h2>
        <Link href="/app/tasks">
          <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={14} />}>
            View all
          </Button>
        </Link>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-center px-6">
          <AlertCircle size={22} className="text-red-400" />
          <p className="text-sm text-slate-500">Failed to load tasks.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="px-6 py-3 animate-pulse flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-slate-100" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 bg-slate-100 rounded w-48" />
                  <div className="h-3 bg-slate-100 rounded w-28" />
                </div>
                <div className="h-5 bg-slate-100 rounded w-14" />
              </li>
            ))
          ) : tasks.length === 0 ? (
            <li className="py-12 text-center text-sm text-slate-400">
              No pending tasks. Great job!
            </li>
          ) : (
            tasks.map((task) => (
              <li key={task.id} className="px-6 py-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-slate-300">
                    {task.status === 'completed' ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : (
                      <Clock size={16} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-900 truncate">{task.title}</p>
                    {task.dueDate && (
                      <p className="text-xs text-slate-400 mt-0.5">Due {formatDate(task.dueDate)}</p>
                    )}
                  </div>
                  <Badge variant={priorityVariant(task.priority)} size="sm">
                    {titleCase(task.priority)}
                  </Badge>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
