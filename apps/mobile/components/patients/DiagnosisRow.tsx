import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Diagnosis } from '@clinhelp/types';
import { Badge } from '../ui/Badge';

interface DiagnosisRowProps {
  diagnosis: Diagnosis;
}

function getStatusColor(status: Diagnosis['status']) {
  if (status === 'active') return { color: '#16A34A', bg: '#DCFCE7' };
  if (status === 'resolved') return { color: '#6B7280', bg: '#F3F4F6' };
  return { color: '#D97706', bg: '#FEF3C7' };
}

export function DiagnosisRow({ diagnosis }: DiagnosisRowProps) {
  const { color, bg } = getStatusColor(diagnosis.status);

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.code}>{diagnosis.icd10Code}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {diagnosis.description}
        </Text>
      </View>
      <Badge
        label={diagnosis.status}
        color={color}
        backgroundColor={bg}
        small
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  left: {
    flex: 1,
    marginRight: 8,
  },
  code: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0EA5E9',
    fontFamily: 'monospace',
  },
  desc: {
    marginTop: 2,
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
});
