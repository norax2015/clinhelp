import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuickActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
  style?: ViewStyle;
}

export function QuickActionButton({
  icon,
  label,
  color,
  onPress,
  style,
}: QuickActionButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.btn, { borderColor: color }, style]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Ionicons name={icon} size={20} color={color} style={{ marginRight: 8 }} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
