import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface BadgeProps {
  label: string;
  color: string;
  backgroundColor: string;
  style?: ViewStyle;
  small?: boolean;
}

export function Badge({ label, color, backgroundColor, style, small = false }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor }, small && styles.small, style]}>
      <Text style={[styles.text, { color }, small && styles.smallText]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  smallText: {
    fontSize: 10,
  },
});
