import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEncounters } from '../../hooks/useEncounters';
import { EncounterRow } from '../../components/encounters/EncounterRow';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';

export default function EncountersScreen() {
  const router = useRouter();
  const { data: encounters, isLoading, isError, refetch } = useEncounters();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" backgroundColor="#F8FAFC" />

      <View style={styles.header}>
        <Text style={styles.title}>Encounters</Text>
        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => router.push('/encounters/new')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.newBtnLabel}>New</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorState
          message="Could not load encounters. Check your connection."
          onRetry={refetch}
        />
      ) : !encounters?.length ? (
        <EmptyState
          icon="clipboard-outline"
          title="No encounters yet"
          message="Create your first encounter to get started."
        />
      ) : (
        <FlatList
          data={encounters}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EncounterRow encounter={item} />}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F1F3D',
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0EA5E9',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  newBtnLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  list: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
});
