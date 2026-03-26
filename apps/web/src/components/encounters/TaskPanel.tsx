'use client';

import React, { useState } from 'react';
import { useTasks, useCreateTask, useUpdateTask } from '@/hooks/useTasks';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { type Task, type TaskPriority } from '@/types';
import { Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { formatDate, titleCase } from '@/lib/utils';

function priorityVariant(priority: TaskPriority) {
  switch (priority) {
    case 'urgent': return 'danger';
    case 'high': return 'warning';
    case 'medium': return 'info';
    case 'low': return 'default';
    default: return 'default';
  }
}

interface TaskPanelProps {
  encounterId: string;
  patientId?: string;
}

function TaskRow({ task }: { task: Task }) {
  const updateTask = useUpdateTask(task.id);
  const isCompleted = task.status === 'completed';

  function toggleComplete() {
    updateTask.mutate({ status: isCompleted ? 'pending' : 'completed' });
  }

  return (
    <li className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50 group">
      <button
        onClick={toggleComplete}
        disabled={updateTask.isPending}
        title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
        className="mt-0.5 flex-shrink-0 transition-colors disabled:opacity-50"
      >
        {updateTask.isPending ? (
          <Spinner size="sm" />
        ) : isCompleted ? (
          <CheckCircle2 size={14} className="text-emerald-500" />
        ) : (
          <Clock size={14} className="text-slate-300 group-hover:text-slate-400" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium truncate ${isCompleted ? 'line-through text-slate-400' : 'text-navy-900'}`}>
          {task.title}
        </p>
        {task.dueDate && (
          <p className="text-xs text-slate-400">Due {formatDate(task.dueDate)}</p>
        )}
      </div>
      <Badge variant={priorityVariant(task.priority)} size="sm">
        {titleCase(task.priority)}
      </Badge>
    </li>
  );
}

export function TaskPanel({ encounterId, patientId }: TaskPanelProps) {
  const { data, isLoading } = useTasks({ encounterId });
  const createTask = useCreateTask();
  const tasks = (data?.data ?? []) as Task[];

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createTask.mutateAsync({
      title,
      priority,
      dueDate: dueDate || undefined,
      encounterId,
      patientId,
    });
    setTitle('');
    setPriority('medium');
    setDueDate('');
    setShowModal(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-navy-900">Tasks</p>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Plus size={13} />}
          onClick={() => setShowModal(true)}
        >
          Add
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6"><Spinner size="sm" /></div>
      ) : tasks.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4">No tasks for this encounter.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </ul>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Task" size="sm">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="Enter task description"
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
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={createTask.isPending}
            >
              Create Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
