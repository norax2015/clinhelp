import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import type { Patient } from '@clinhelp/types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import {
  formatName,
  getInitials,
  getPatientStatusLabel,
  getPatientStatusColor,
  getPatientStatusBg,
} from '../../lib/utils';

interface RecentPatientRowProps {
  patient: Patient;
}

export function RecentPatientRow({ patient }: RecentPatientRowProps) {
  const router = useRouter();
  const initials = getInitials(patient.firstName, patient.lastName);

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`/patients/${patient.id}`)}
      activeOpacity={0.7}
    >
      <Avatar initials={initials} size={38} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {formatName(patient.firstName, patient.lastName)}
        </Text>
        <Text style={styles.mrn}>MRN {patient.mrn}</Text>
      </View>
      <Badge
        label={getPatientStatusLabel(patient.status)}
        color={getPatientStatusColor(patient.status)}
        backgroundColor={getPatientStatusBg(patient.status)}
        small
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  mrn: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 1,
  },
});
