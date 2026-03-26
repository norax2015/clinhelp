'use client';

import React, { useState } from 'react';
import { useTasks, useUpdateTask } from '@/hooks/useTasks';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  EmptyTableRow,
} from '@/components/ui/Table';
import { formatDate, titleCase } from '@/lib/utils';
import type { Task, TaskStatus, TaskPriority } from '@/types';
import { ClipboardList, Plus } from 'lucide-react';

function priorityVariant(
  priority: TaskPriority
): 'default' | 'success' | 'warning' | 'info' | 'danger' {
  switch (priority) {
    case 'low': return 'default';
    case 'medium': return 'info';
    case 'high': return 'warning';
    case 'urgent': return 'danger';
    default: return 'default';
  }
}

function statusVariant(
  status: TaskStatus
): 'default' | 'success' | 'warning' | 'info' | 'danger' {
  switch (status) {
    case 'pending': return 'default';
    case 'in_progress': return 'info';
    case 'completed': return 'success';
    case 'cancelled': return 'default';
    default: return 'default';
  }
}

function InlineStatusSelect({ task }: { task: Task }) {
  const updateTask = useUpdateTask(task.id);
  return (
    <select
      value={task.status}
      onChange={(e) => updateTask.mutate({ status: e.target.value })}
      disabled={updateTask.isPending}
      className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-50"
    >
      <option value="pending">Pending</option>
      <option value="in_progress">In Progress</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}

function SkeletonRow() {
  return (
    <TableRow>
      {Array.from({ length: 7 }).map((_, i) => (
        <TableCell key={i}>
          <div className="h-4 bg-slate-100 rounded animate-pulse w-24" />
        </TableCell>
      ))}
    </TableRow>
  );
}

export default function TasksPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading, error, refetch } = useTasks({ sort: '-createdAt' });
  const tasks = (data?.data ?? []) as Task[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Tasks</h1>
          <p className="text-slate-500 text-sm mt-1">
            Track and manage clinical follow-up tasks
          </p>
        </div>
        <Button
          variant="accent"
          leftIcon={<Plus size={16} />}
          onClick={() => setModalOpen(true)}
        >
          New Task
        </Button>
      </div>

      {error ? (
        <Alert variant="error">
          Failed to load tasks.{' '}
          <button className="underline font-medium" onClick={() => refetch()}>
            Try again
          </button>
        </Alert>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <Table>
            <TableHead>
              <tr>
                <TableHeader>Title</TableHeader>
                <TableHeader>Patient</TableHeader>
                <TableHeader>Priority</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Due Date</TableHeader>
                <TableHeader>Assigned To</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 7 }).map((_, i) => <SkeletonRow key={i} />)
              ) : tasks.length === 0 ? (
                <EmptyTableRow
                  colSpan={7}
                  icon={<ClipboardList size={28} />}
                  message="No tasks found"
                  action={
                    <Button
                      variant="accent"
                      size="sm"
                      leftIcon={<Plus size={14} />}
                      onClick={() => setModalOpen(true)}
                    >
                      New Task
                    </Button>
                  }
                />
              ) : (
                tasks.map((task) => {
                  const patient = (
                    task as unknown as {
                      patient?: { firstName: string; lastName: string };
                    }
                  ).patient;
                  const assignedTo = task.assignedTo as
                    | { firstName: string; lastName: string }
                    | undefined;

                  return (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium text-navy-900 max-w-48 truncate">
                        {task.title}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {patient
                          ? `${patient.firstName} ${patient.lastName}`
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={priorityVariant(task.priority)}>
                          {titleCase(task.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(task.status)}>
                          {titleCase(task.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {task.dueDate ? formatDate(task.dueDate) : '—'}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {assignedTo
                          ? `${assignedTo.firstName} ${assignedTo.lastName}`
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <InlineStatusSelect task={task} />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {data && data.total > 0 && (
        <p className="text-xs text-slate-400 text-right">
          Showing {tasks.length} of {data.total} tasks
        </p>
      )}

      <CreateTaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
