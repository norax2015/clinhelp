import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AvatarProps {
  initials: string;
  size?: number;
  color?: string;
}

const AVATAR_COLORS = [
  '#0F1F3D',
  '#0EA5E9',
  '#7C3AED',
  '#059669',
  '#D97706',
  '#DC2626',
  '#DB2777',
];

function getColorForInitials(initials: string): string {
  const code = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

export function Avatar({ initials, size = 40, color }: AvatarProps) {
  const bg = color ?? getColorForInitials(initials);
  const fontSize = size * 0.38;

  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
      ]}
    >
      <Text style={[styles.text, { fontSize }]}>{initials.slice(0, 2).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
