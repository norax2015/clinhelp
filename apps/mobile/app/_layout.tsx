import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient } from '../lib/queryClient';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="patients/[id]"
                options={{ presentation: 'card' }}
              />
              <Stack.Screen
                name="encounters/new"
                options={{ presentation: 'modal' }}
              />
              <Stack.Screen
                name="encounters/[id]"
                options={{ presentation: 'card' }}
              />
              <Stack.Screen
                name="notifications"
                options={{ presentation: 'card' }}
              />
            </Stack>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </View>
  );
}
