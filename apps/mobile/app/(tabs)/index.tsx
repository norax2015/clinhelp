import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import {
  useDashboardSummary,
  useRecentPatients,
  useTodaysTasks,
} from '../../hooks/useDashboard';
import { TaskSummaryCard } from '../../components/dashboard/TaskSummaryCard';
import { RecentPatientRow } from '../../components/dashboard/RecentPatientRow';
import { QuickActionButton } from '../../components/dashboard/QuickActionButton';
import { TaskRow } from '../../components/tasks/TaskRow';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { useCompleteTask } from '../../hooks/useTasks';
import { getDayGreeting, getTodayLabel } from '../../lib/utils';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const greeting = getDayGreeting();
  const todayLabel = getTodayLabel();

  const summary = useDashboardSummary();
  const recentPatients = useRecentPatients();
  const todaysTasks = useTodaysTasks();
  const completeTask = useCompleteTask();

  const firstName = user?.firstName ?? 'there';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" backgroundColor="#F8FAFC" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>
            {greeting}, {firstName}
          </Text>
          <Text style={styles.dateLabel}>{todayLabel}</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/notifications')}
          style={styles.notifBtn}
        >
          <Ionicons name="notifications-outline" size={22} color="#0F1F3D" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Stats row */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={styles.statsContent}
        >
          <TaskSummaryCard
            label="Today's Tasks"
            value={summary.data?.pendingTasks ?? '—'}
            icon="checkmark-circle-outline"
            color="#0EA5E9"
            onPress={() => router.push('/(tabs)/tasks')}
          />
          <TaskSummaryCard
            label="Active Patients"
            value={summary.data?.activePatients ?? '—'}
            icon="people-outline"
            color="#7C3AED"
            onPress={() => router.push('/(tabs)/patients')}
          />
          <TaskSummaryCard
            label="Encounters/mo"
            value={summary.data?.encountersThisMonth ?? '—'}
            icon="clipboard-outline"
            color="#059669"
            onPress={() => router.push('/(tabs)/encounters')}
          />
          <TaskSummaryCard
            label="Notes (AI)"
            value={summary.data?.notesGeneratedByAI ?? '—'}
            icon="document-text-outline"
            color="#D97706"
          />
        </ScrollView>

        {/* Quick actions */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <QuickActionButton
            icon="add-circle-outline"
            label="New Encounter"
            color="#0EA5E9"
            onPress={() => router.push('/encounters/new')}
            style={{ marginRight: 10 }}
          />
          <QuickActionButton
            icon="create-outline"
            label="New Task"
            color="#0F1F3D"
            onPress={() => router.push('/(tabs)/tasks')}
          />
        </View>

        {/* Recent patients */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Patients</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/patients')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {recentPatients.isLoading ? (
            <Spinner size="small" />
          ) : recentPatients.data?.length ? (
            recentPatients.data.slice(0, 5).map((p) => (
              <RecentPatientRow key={p.id} patient={p} />
            ))
          ) : (
            <EmptyState
              icon="people-outline"
              title="No patients yet"
              message="Patients will appear here once added."
            />
          )}
        </View>

        {/* Today's tasks */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/tasks')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {todaysTasks.isLoading ? (
            <Spinner size="small" />
          ) : todaysTasks.data?.length ? (
            todaysTasks.data.slice(0, 5).map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                onComplete={(id) => completeTask.mutate(id)}
              />
            ))
          ) : (
            <EmptyState
              icon="checkmark-circle-outline"
              title="All caught up!"
              message="No tasks due today."
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F8FAFC',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F1F3D',
  },
  dateLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  notifBtn: {
    padding: 4,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1F3D',
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  seeAll: {
    fontSize: 13,
    color: '#0EA5E9',
    fontWeight: '600',
  },
  statsScroll: {
    marginHorizontal: -16,
  },
  statsContent: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  quickActions: {
    flexDirection: 'row',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
});
