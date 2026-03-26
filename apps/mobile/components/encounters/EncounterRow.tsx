import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import type { Encounter } from '@clinhelp/types';
import { Badge } from '../ui/Badge';
import {
  formatName,
  formatDateTime,
  getEncounterTypeLabel,
  getVisitModeLabel,
} from '../../lib/utils';

interface EncounterRowProps {
  encounter: Encounter;
}

function getStatusColor(status: Encounter['status']) {
  const map: Record<string, { color: string; bg: string }> = {
    scheduled: { color: '#D97706', bg: '#FEF3C7' },
    in_progress: { color: '#0EA5E9', bg: '#E0F2FE' },
    completed: { color: '#16A34A', bg: '#DCFCE7' },
    cancelled: { color: '#6B7280', bg: '#F3F4F6' },
    no_show: { color: '#DC2626', bg: '#FEE2E2' },
  };
  return map[status] ?? { color: '#6B7280', bg: '#F3F4F6' };
}

export function EncounterRow({ encounter }: EncounterRowProps) {
  const router = useRouter();
  const { color, bg } = getStatusColor(encounter.status);

  const patientName = encounter.patient
    ? formatName(encounter.patient.firstName, encounter.patient.lastName)
    : 'Patient';

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`/encounters/${encounter.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.main}>
        <Text style={styles.patient} numberOfLines={1}>
          {patientName}
        </Text>
        <Text style={styles.meta}>
          {getEncounterTypeLabel(encounter.type)} ·{' '}
          {getVisitModeLabel(encounter.visitMode)}
        </Text>
        <Text style={styles.date}>
          {formatDateTime(encounter.scheduledAt ?? encounter.createdAt)}
        </Text>
      </View>
      <Badge label={encounter.status.replace('_', ' ')} color={color} backgroundColor={bg} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  main: {
    flex: 1,
    marginRight: 10,
  },
  patient: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  meta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  date: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
});
