import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={52} color="#FCA5A5" />
      <Text style={styles.title}>Unable to load</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
          <Ionicons name="refresh-outline" size={16} color="#0EA5E9" style={{ marginRight: 6 }} />
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  title: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  message: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#0EA5E9',
  },
  retryText: {
    color: '#0EA5E9',
    fontSize: 14,
    fontWeight: '600',
  },
});
