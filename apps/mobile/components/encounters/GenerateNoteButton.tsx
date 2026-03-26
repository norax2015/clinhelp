import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GenerateNoteButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function GenerateNoteButton({ onPress, loading = false, disabled = false }: GenerateNoteButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.btn, (loading || disabled) && styles.disabled]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" style={{ marginRight: 8 }} />
      ) : (
        <Ionicons name="sparkles" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
      )}
      <Text style={styles.label}>
        {loading ? 'Generating Note...' : 'Generate Note'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0EA5E9',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  disabled: {
    opacity: 0.6,
    shadowOpacity: 0,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
