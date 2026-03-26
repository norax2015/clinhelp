'use client';

import React from 'react';
import { useUpdateTask } from '@/hooks/useTasks';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { type Task, type TaskStatus, type TaskPriority } from '@/types';
import { formatDate, titleCase } from '@/lib/utils';
import { CheckCircle2, Clock, AlertCircle, Circle } from 'lucide-react';

function priorityVariant(priority: TaskPriority) {
  switch (priority) {
    case 'urgent': return 'danger';
    case 'high': return 'warning';
    case 'medium': return 'info';
    case 'low': return 'default';
    default: return 'default';
  }
}

function StatusIcon({ status }: { status: TaskStatus }) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 size={16} className="text-emerald-500" />;
    case 'in_progress':
      return <Clock size={16} className="text-blue-500" />;
    case 'pending':
      return <Circle size={16} className="text-slate-300" />;
    default:
      return <AlertCircle size={16} className="text-slate-300" />;
  }
}

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const updateTask = useUpdateTask(task.id);

  async function cycleStatus() {
    const next: Record<TaskStatus, TaskStatus> = {
      pending: 'in_progress',
      in_progress: 'completed',
      completed: 'pending',
      cancelled: 'pending',
    };
    await updateTask.mutateAsync({ status: next[task.status] });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <button
          onClick={cycleStatus}
          disabled={updateTask.isPending}
          className="mt-0.5 flex-shrink-0 hover:opacity-70 transition-opacity"
          title="Click to change status"
        >
          <StatusIcon status={task.status} />
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium text-navy-900 ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {task.dueDate && (
              <span className="text-xs text-slate-400">Due {formatDate(task.dueDate)}</span>
            )}
            {task.patient && (
              <span className="text-xs text-slate-400">
                {(task.patient as { firstName: string }).firstName} {(task.patient as { lastName: string }).lastName}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <Badge variant={priorityVariant(task.priority)} size="sm">
            {titleCase(task.priority)}
          </Badge>
          <Badge
            variant={task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'info' : 'default'}
            size="sm"
          >
            {titleCase(task.status)}
          </Badge>
        </div>
      </div>
    </div>
  );
}
