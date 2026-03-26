import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/layout/Header';
import { EmptyState } from '../components/ui/EmptyState';

interface NotificationItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const PLACEHOLDER_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    icon: 'document-text-outline',
    title: 'Note Ready for Review',
    message: 'AI-generated SOAP note is ready for your review — John D.',
    time: '10 min ago',
    read: false,
  },
  {
    id: '2',
    icon: 'checkmark-circle-outline',
    title: 'Task Due Today',
    message: 'Follow-up call with patient Jane S. is due today.',
    time: '1 hr ago',
    read: false,
  },
  {
    id: '3',
    icon: 'calendar-outline',
    title: 'Upcoming Encounter',
    message: 'Telehealth session with Robert M. starts in 30 minutes.',
    time: '2 hrs ago',
    read: true,
  },
];

function NotificationRow({ item }: { item: NotificationItem }) {
  return (
    <View style={[styles.notifRow, !item.read && styles.notifRowUnread]}>
      <View style={[styles.iconWrap, !item.read && styles.iconWrapUnread]}>
        <Ionicons
          name={item.icon}
          size={20}
          color={item.read ? '#94A3B8' : '#0EA5E9'}
        />
      </View>
      <View style={styles.notifContent}>
        <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]}>
          {item.title}
        </Text>
        <Text style={styles.notifMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notifTime}>{item.time}</Text>
      </View>
      {!item.read ? <View style={styles.unreadDot} /> : null}
    </View>
  );
}

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Header title="Notifications" showBack />
      {PLACEHOLDER_NOTIFICATIONS.length === 0 ? (
        <EmptyState
          icon="notifications-off-outline"
          title="No notifications"
          message="You're all caught up."
        />
      ) : (
        <FlatList
          data={PLACEHOLDER_NOTIFICATIONS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationRow item={item} />}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <Text style={styles.footer}>
              Notifications are for reference only — real-time push notifications require device permissions.
            </Text>
          }
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
  list: {
    flex: 1,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  notifRowUnread: {
    backgroundColor: '#F0F9FF',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconWrapUnread: {
    backgroundColor: '#E0F2FE',
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  notifTitleUnread: {
    color: '#0F1F3D',
  },
  notifMessage: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  notifTime: {
    marginTop: 4,
    fontSize: 11,
    color: '#94A3B8',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0EA5E9',
    marginTop: 6,
    marginLeft: 4,
  },
  footer: {
    padding: 16,
    fontSize: 11,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 16,
  },
});
