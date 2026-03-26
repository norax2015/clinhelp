import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

interface SpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  centered?: boolean;
}

export function Spinner({ size = 'large', color = '#0EA5E9', centered = true }: SpinnerProps) {
  if (centered) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }
  return <ActivityIndicator size={size} color={color} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
});
