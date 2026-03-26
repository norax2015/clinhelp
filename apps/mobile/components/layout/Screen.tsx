import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  refreshing?: boolean;
  onRefresh?: () => void;
  keyboardAvoiding?: boolean;
  backgroundColor?: string;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
}

export function Screen({
  children,
  scrollable = false,
  style,
  contentStyle,
  refreshing = false,
  onRefresh,
  keyboardAvoiding = false,
  backgroundColor = '#F8FAFC',
  edges = ['top', 'left', 'right'],
}: ScreenProps) {
  const inner = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0EA5E9"
            colors={['#0EA5E9']}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flat, contentStyle]}>{children}</View>
  );

  const content = keyboardAvoiding ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      {inner}
    </KeyboardAvoidingView>
  ) : (
    inner
  );

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor }, style]}
      edges={edges}
    >
      <StatusBar style="dark" backgroundColor={backgroundColor} />
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 8,
  },
  flat: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});
