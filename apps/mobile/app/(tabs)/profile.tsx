import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../../components/ui/Avatar';
import { getInitials, formatName } from '../../lib/utils';

interface ProfileRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  destructive?: boolean;
}

function ProfileRow({ icon, label, onPress, destructive = false }: ProfileRowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={20}
        color={destructive ? '#DC2626' : '#475569'}
        style={styles.rowIcon}
      />
      <Text style={[styles.rowLabel, destructive && styles.rowLabelDestructive]}>
        {label}
      </Text>
      {onPress ? (
        <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
      ) : null}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const initials = getInitials(user?.firstName, user?.lastName);
  const fullName = formatName(user?.firstName, user?.lastName);
  const roleLabel = user?.role?.replace('_', ' ') ?? '';

  function handleLogout() {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" backgroundColor="#F8FAFC" />

      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* User card */}
        <View style={styles.userCard}>
          <Avatar initials={initials} size={64} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{fullName}</Text>
            {user?.title ? (
              <Text style={styles.userTitle}>{user.title}</Text>
            ) : null}
            <Text style={styles.userRole}>
              {roleLabel.charAt(0).toUpperCase() + roleLabel.slice(1)}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>

        {/* Org card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organization</Text>
          <View style={styles.orgCard}>
            <Ionicons name="business-outline" size={18} color="#64748B" style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.orgName}>{user?.organization?.name ?? '—'}</Text>
              <Text style={styles.orgPlan}>
                Plan: {user?.organization?.subscriptionTier ?? '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingsCard}>
            <ProfileRow
              icon="settings-outline"
              label="Account Settings"
              onPress={() => {
                Alert.alert('Coming Soon', 'Account settings are available in the web portal.');
              }}
            />
            <ProfileRow
              icon="notifications-outline"
              label="Notifications"
              onPress={() => router.push('/notifications')}
            />
            <ProfileRow
              icon="help-circle-outline"
              label="Help & Support"
              onPress={() => {
                Alert.alert('Support', 'Contact support@noraxsolutions.com for assistance.');
              }}
            />
            <ProfileRow
              icon="information-circle-outline"
              label="About ClinHelp"
              onPress={() => {
                Alert.alert(
                  'About ClinHelp',
                  'ClinHelp v1.0.0\n\nBuilt by Norax Solutions, LLC\n\nAI-assisted clinical documentation — all generated content is for clinical review only.',
                );
              }}
            />
          </View>
        </View>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.signOutLabel}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>
          ClinHelp v1.0.0 — Built by Norax Solutions, LLC
        </Text>
      </ScrollView>
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
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 8,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F1F3D',
  },
  userTitle: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#0EA5E9',
    fontWeight: '600',
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  orgCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  orgName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  orgPlan: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowIcon: {
    marginRight: 12,
    width: 22,
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  rowLabelDestructive: {
    color: '#DC2626',
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 8,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  signOutLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  version: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 11,
    color: '#CBD5E1',
  },
});
