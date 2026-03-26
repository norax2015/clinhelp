import React from 'react';
import { Badge } from '../ui/Badge';
import type { TaskStatus } from '@clinhelp/types';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  small?: boolean;
}

const STATUS_MAP: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#D97706', bg: '#FEF3C7' },
  in_progress: { label: 'In Progress', color: '#0EA5E9', bg: '#E0F2FE' },
  completed: { label: 'Completed', color: '#16A34A', bg: '#DCFCE7' },
  cancelled: { label: 'Cancelled', color: '#6B7280', bg: '#F3F4F6' },
};

export function TaskStatusBadge({ status, small = false }: TaskStatusBadgeProps) {
  const { label, color, bg } = STATUS_MAP[status] ?? {
    label: status,
    color: '#6B7280',
    bg: '#F3F4F6',
  };
  return <Badge label={label} color={color} backgroundColor={bg} small={small} />;
}
