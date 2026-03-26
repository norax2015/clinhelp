import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { usePatients } from '../../hooks/usePatients';
import { PatientRow } from '../../components/patients/PatientRow';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import type { Patient } from '@clinhelp/types';

export default function PatientsScreen() {
  const [search, setSearch] = useState('');
  const { data, isLoading, isError, refetch } = usePatients(search || undefined);

  const patients: Patient[] = data?.data ?? (Array.isArray(data) ? (data as any) : []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" backgroundColor="#F8FAFC" />

      <View style={styles.header}>
        <Text style={styles.title}>Patients</Text>
      </View>

      <View style={styles.searchBar}>
        <Input
          placeholder="Search by name or MRN..."
          value={search}
          onChangeText={setSearch}
          leftIcon="search-outline"
          rightIcon={search ? 'close-circle' : undefined}
          onRightIconPress={() => setSearch('')}
          containerStyle={{ marginBottom: 0 }}
        />
      </View>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorState
          message="Could not load patients. Check your connection."
          onRetry={refetch}
        />
      ) : patients.length === 0 ? (
        <EmptyState
          icon="people-outline"
          title={search ? 'No results found' : 'No patients yet'}
          message={search ? `No patients match "${search}".` : 'Patients will appear here once added.'}
        />
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PatientRow patient={item} />}
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
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F1F3D',
  },
  searchBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  list: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
});
