import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTasks, TaskFilter } from '../../hooks/useTasks';
import { useCompleteTask } from '../../hooks/useTasks';
import { TaskRow } from '../../components/tasks/TaskRow';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';

const FILTERS: { key: TaskFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Due Today' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];

export default function TasksScreen() {
  const [filter, setFilter] = useState<TaskFilter>('all');
  const { data: tasks, isLoading, isError, refetch } = useTasks(filter);
  const completeTask = useCompleteTask();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" backgroundColor="#F8FAFC" />

      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterTab, filter === f.key && styles.filterTabActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text
              style={[
                styles.filterLabel,
                filter === f.key && styles.filterLabelActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorState
          message="Could not load tasks. Check your connection."
          onRetry={refetch}
        />
      ) : !tasks?.length ? (
        <EmptyState
          icon="checkmark-circle-outline"
          title="No tasks found"
          message={
            filter === 'today'
              ? 'No tasks due today.'
              : filter === 'pending'
              ? 'No pending tasks.'
              : filter === 'completed'
              ? 'No completed tasks.'
              : 'No tasks yet.'
          }
        />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskRow
              task={item}
              onComplete={(id) => completeTask.mutate(id)}
            />
          )}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F1F3D',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  filterTabActive: {
    backgroundColor: '#0F1F3D',
    borderColor: '#0F1F3D',
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterLabelActive: {
    color: '#FFFFFF',
  },
  list: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
});
