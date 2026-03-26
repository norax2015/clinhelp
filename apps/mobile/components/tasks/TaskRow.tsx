import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Task } from '@clinhelp/types';
import { Badge } from '../ui/Badge';
import { TaskStatusBadge } from './TaskStatusBadge';
import {
  formatName,
  formatDateShort,
  getPriorityLabel,
  getPriorityColor,
  getPriorityBg,
} from '../../lib/utils';

interface TaskRowProps {
  task: Task;
  onComplete?: (id: string) => void;
}

export function TaskRow({ task, onComplete }: TaskRowProps) {
  const isCompleted = task.status === 'completed' || task.status === 'cancelled';

  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={() => !isCompleted && onComplete?.(task.id)}
        disabled={isCompleted}
        style={styles.checkBtn}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={isCompleted ? '#16A34A' : '#CBD5E1'}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text
          style={[styles.title, isCompleted && styles.titleDone]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        {task.patient ? (
          <Text style={styles.patient} numberOfLines={1}>
            {formatName(task.patient.firstName, task.patient.lastName)}
          </Text>
        ) : null}
        <View style={styles.row2}>
          {task.dueDate ? (
            <Text style={styles.dueDate}>{formatDateShort(task.dueDate)}</Text>
          ) : null}
          <Badge
            label={getPriorityLabel(task.priority)}
            color={getPriorityColor(task.priority)}
            backgroundColor={getPriorityBg(task.priority)}
            small
            style={{ marginLeft: task.dueDate ? 8 : 0 }}
          />
        </View>
      </View>

      <TaskStatusBadge status={task.status} small />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  checkBtn: {
    marginRight: 10,
    paddingTop: 1,
  },
  content: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 20,
  },
  titleDone: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  patient: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dueDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
