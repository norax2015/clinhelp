'use client';

import React, { useState } from 'react';
import { useTasks, useCreateTask } from '@/hooks/useTasks';
import { usePatients } from '@/hooks/usePatients';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import {
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell, EmptyTableRow,
} from '@/components/ui/Table';
import { useUpdateTask } from '@/hooks/useTasks';
import { formatDate, titleCase } from '@/lib/utils';
import { type Task, type TaskStatus, type TaskPriority, type Patient } from '@/types';
import { Plus, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterValue = 'all' | TaskStatus | 'urgent' | 'high';

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Urgent', value: 'urgent' },
  { label: 'High Priority', value: 'high' },
];

function priorityVariant(priority: TaskPriority) {
  switch (priority) {
    case 'urgent': return 'danger';
    case 'high': return 'warning';
    case 'medium': return 'info';
    case 'low': return 'default';
    default: return 'default';
  }
}

function statusVariant(status: TaskStatus) {
  switch (status) {
    case 'completed': return 'success';
    case 'in_progress': return 'info';
    case 'pending': return 'default';
    case 'cancelled': return 'danger';
    default: return 'default';
  }
}

function InlineStatusSelect({ task }: { task: Task }) {
  const updateTask = useUpdateTask(task.id);
  return (
    <select
      value={task.status}
      onChange={(e) => updateTask.mutateAsync({ status: e.target.value })}
      disabled={updateTask.isPending}
      className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
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
      {Array.from({ length: 6 }).map((_, i) => (
        <TableCell key={i}><div className="h-4 bg-slate-100 rounded animate-pulse w-24" /></TableCell>
      ))}
    </TableRow>
  );
}

export function TaskList() {
  const [filter, setFilter] = useState<FilterValue>('all');
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [taskPatientId, setTaskPatientId] = useState('');

  const params: Record<string, unknown> = {};
  if (filter === 'pending' || filter === 'in_progress' || filter === 'completed') {
    params.status = filter;
  } else if (filter === 'urgent' || filter === 'high') {
    params.priority = filter;
  }

  const { data, isLoading, error, refetch } = useTasks(params);
  const createTask = useCreateTask();
  const { data: patientsData } = usePatients({ limit: 200 });
  const patients = (patientsData?.data ?? []) as Patient[];
  const tasks = (data?.data ?? []) as Task[];

  const patientOptions = [
    { label: 'No patient', value: '' },
    ...patients.map((p) => ({
      label: `${p.firstName} ${p.lastName}`,
      value: p.id,
    })),
  ];

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createTask.mutateAsync({
      title,
      priority,
      dueDate: dueDate || undefined,
      patientId: taskPatientId || undefined,
    });
    setTitle('');
    setPriority('medium');
    setDueDate('');
    setTaskPatientId('');
    setShowModal(false);
  }

  if (error) {
    return (
      <Alert variant="error">
        Failed to load tasks.{' '}
        <button className="underline font-medium" onClick={() => refetch()}>Try again</button>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-lg font-medium transition-colors',
              filter === f.value
                ? 'bg-navy-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHead>
            <tr>
              <TableHeader>Title</TableHeader>
              <TableHeader>Patient</TableHeader>
              <TableHeader>Assigned To</TableHeader>
              <TableHeader>Priority</TableHeader>
              <TableHeader>Due Date</TableHeader>
              <TableHeader>Status</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            ) : tasks.length === 0 ? (
              <EmptyTableRow
                colSpan={6}
                icon={<ClipboardList size={26} />}
                message="No tasks found"
                action={
                  <Button
                    variant="accent"
                    size="sm"
                    leftIcon={<Plus size={14} />}
                    onClick={() => setShowModal(true)}
                  >
                    New Task
                  </Button>
                }
              />
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium text-navy-900 max-w-56 truncate">
                    {task.title}
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {task.patient
                      ? `${(task.patient as { firstName: string }).firstName} ${(task.patient as { lastName: string }).lastName}`
                      : '—'}
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {task.assignedTo
                      ? `${(task.assignedTo as { firstName: string }).firstName} ${(task.assignedTo as { lastName: string }).lastName}`
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityVariant(task.priority)}>{titleCase(task.priority)}</Badge>
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {task.dueDate ? formatDate(task.dueDate) : '—'}
                  </TableCell>
                  <TableCell>
                    <InlineStatusSelect task={task} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* New Task Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Task">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="Describe the task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Select
            label="Priority"
            options={[
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' },
              { label: 'Urgent', value: 'urgent' },
            ]}
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          />
          <Select
            label="Patient (optional)"
            options={patientOptions}
            value={taskPatientId}
            onChange={(e) => setTaskPatientId(e.target.value)}
          />
          <Input
            label="Due Date (optional)"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={createTask.isPending}>
              Create Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
