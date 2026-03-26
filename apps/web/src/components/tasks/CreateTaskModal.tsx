'use client';

import React, { useState } from 'react';
import { useCreateTask } from '@/hooks/useTasks';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import type { TaskPriority } from '@/types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRIORITY_OPTIONS: { label: string; value: TaskPriority }[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
];

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const createTask = useCreateTask();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [patientId, setPatientId] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleClose() {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setPatientId('');
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    try {
      await createTask.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
        patientId: patientId.trim() || undefined,
      });
      handleClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Failed to create task. Please try again.');
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New Task" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="error" onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Input
          label="Title"
          placeholder="Describe the task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Description{' '}
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Additional context or instructions..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
          />
        </div>

        <Select
          label="Priority"
          options={PRIORITY_OPTIONS}
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
        />

        <Input
          label="Due Date (optional)"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <Input
          label="Patient ID (optional)"
          placeholder="Link to a patient..."
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={createTask.isPending}
          >
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
  );
}
