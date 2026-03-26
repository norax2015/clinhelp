import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Patient } from '@clinhelp/types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import {
  formatName,
  getInitials,
  calculateAge,
  formatDate,
  getPatientStatusLabel,
  getPatientStatusColor,
  getPatientStatusBg,
} from '../../lib/utils';

interface PatientHeaderProps {
  patient: Patient;
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  const initials = getInitials(patient.firstName, patient.lastName);
  const age = calculateAge(patient.dateOfBirth);
  const dob = formatDate(patient.dateOfBirth);

  const sexLabel =
    patient.sex === 'male'
      ? 'M'
      : patient.sex === 'female'
      ? 'F'
      : patient.sex === 'other'
      ? 'O'
      : '—';

  return (
    <View style={styles.container}>
      <Avatar initials={initials} size={60} />
      <View style={styles.info}>
        <Text style={styles.name}>
          {formatName(patient.firstName, patient.lastName)}
        </Text>
        <Text style={styles.meta}>
          MRN {patient.mrn} · {dob} · {age} · {sexLabel}
        </Text>
        <View style={styles.badgeRow}>
          <Badge
            label={getPatientStatusLabel(patient.status)}
            color={getPatientStatusColor(patient.status)}
            backgroundColor={getPatientStatusBg(patient.status)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F1F3D',
  },
  meta: {
    marginTop: 3,
    fontSize: 12,
    color: '#64748B',
  },
  badgeRow: {
    marginTop: 6,
  },
});
