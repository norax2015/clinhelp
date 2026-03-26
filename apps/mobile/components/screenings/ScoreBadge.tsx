import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ScreeningSeverity } from '@clinhelp/types';
import { getSeverityLabel, getSeverityColor, getSeverityBg } from '../../lib/utils';

interface ScoreBadgeProps {
  score: number;
  severity: ScreeningSeverity;
  type: string;
}

export function ScoreBadge({ score, severity, type }: ScoreBadgeProps) {
  const color = getSeverityColor(severity);
  const bg = getSeverityBg(severity);
  const label = getSeverityLabel(severity);

  return (
    <View style={styles.container}>
      <View style={[styles.scorePill, { backgroundColor: bg }]}>
        <Text style={[styles.score, { color }]}>{score}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.type}>{type}</Text>
        <Text style={[styles.severity, { color }]}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  scorePill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  score: {
    fontSize: 16,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  type: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  severity: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});
