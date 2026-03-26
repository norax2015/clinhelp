import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  usePatient,
  usePatientDiagnoses,
  usePatientMedications,
  usePatientEncounters,
  usePatientScreenings,
} from '../../hooks/usePatients';
import { PatientHeader } from '../../components/patients/PatientHeader';
import { DiagnosisRow } from '../../components/patients/DiagnosisRow';
import { EncounterRow } from '../../components/encounters/EncounterRow';
import { ScoreBadge } from '../../components/screenings/ScoreBadge';
import { Spinner } from '../../components/ui/Spinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Header } from '../../components/layout/Header';
import { formatDate } from '../../lib/utils';

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const patient = usePatient(id);
  const diagnoses = usePatientDiagnoses(id);
  const medications = usePatientMedications(id);
  const encounters = usePatientEncounters(id);
  const screenings = usePatientScreenings(id);

  if (patient.isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <Header title="Patient" showBack />
        <Spinner />
      </SafeAreaView>
    );
  }

  if (patient.isError || !patient.data) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <Header title="Patient" showBack />
        <ErrorState
          message="Could not load patient details."
          onRetry={patient.refetch}
        />
      </SafeAreaView>
    );
  }

  const p = patient.data;
  const activeMedications = (medications.data ?? []).filter((m) => m.status === 'active');
  const topDiagnoses = (diagnoses.data ?? []).slice(0, 3);
  const topEncounters = (encounters.data ?? []).slice(0, 3);
  const topScreenings = (screenings.data ?? []).slice(0, 2);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Header
        title="Patient Detail"
        showBack
        rightAction={{
          icon: 'add-circle-outline',
          onPress: () => router.push('/encounters/new'),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <PatientHeader patient={p} />

        {/* Demographics */}
        <View style={styles.section}>
          <SectionHeader title="Demographics" />
          <View style={styles.card}>
            <InfoRow label="Date of Birth" value={formatDate(p.dateOfBirth)} />
            <InfoRow label="Sex" value={p.sex.charAt(0).toUpperCase() + p.sex.slice(1)} />
            {p.phone ? <InfoRow label="Phone" value={p.phone} /> : null}
            {p.email ? <InfoRow label="Email" value={p.email} /> : null}
            {p.insurancePrimary ? (
              <InfoRow label="Insurance" value={p.insurancePrimary} last />
            ) : (
              <InfoRow label="Insurance" value="—" last />
            )}
          </View>
        </View>

        {/* Diagnoses */}
        <View style={styles.section}>
          <SectionHeader title="Recent Diagnoses" />
          <View style={styles.card}>
            {diagnoses.isLoading ? (
              <Spinner size="small" />
            ) : topDiagnoses.length > 0 ? (
              topDiagnoses.map((d) => <DiagnosisRow key={d.id} diagnosis={d} />)
            ) : (
              <EmptyState icon="medical-outline" title="No diagnoses on record" />
            )}
          </View>
        </View>

        {/* Medications */}
        <View style={styles.section}>
          <SectionHeader title="Active Medications" />
          <View style={styles.card}>
            {medications.isLoading ? (
              <Spinner size="small" />
            ) : activeMedications.length > 0 ? (
              activeMedications.slice(0, 3).map((m) => (
                <View key={m.id} style={styles.medRow}>
                  <View style={styles.medInfo}>
                    <Text style={styles.medName}>{m.name}</Text>
                    <Text style={styles.medDetail}>
                      {m.dosage} · {m.frequency}
                      {m.route ? ` · ${m.route}` : ''}
                    </Text>
                  </View>
                  <View style={styles.medBadge}>
                    <Text style={styles.medBadgeText}>Active</Text>
                  </View>
                </View>
              ))
            ) : (
              <EmptyState icon="flask-outline" title="No active medications" />
            )}
          </View>
        </View>

        {/* Encounters */}
        <View style={styles.section}>
          <SectionHeader title="Recent Encounters" />
          <View style={[styles.card, { overflow: 'hidden' }]}>
            {encounters.isLoading ? (
              <Spinner size="small" />
            ) : topEncounters.length > 0 ? (
              topEncounters.map((e) => (
                <EncounterRow key={e.id} encounter={{ ...e, patient: p }} />
              ))
            ) : (
              <EmptyState icon="clipboard-outline" title="No encounters yet" />
            )}
          </View>
        </View>

        {/* Screenings */}
        <View style={[styles.section, { marginBottom: 32 }]}>
          <SectionHeader title="Recent Screenings" />
          <View style={styles.card}>
            {screenings.isLoading ? (
              <Spinner size="small" />
            ) : topScreenings.length > 0 ? (
              topScreenings.map((s) => (
                <ScoreBadge
                  key={s.id}
                  score={s.totalScore}
                  severity={s.severity}
                  type={s.type}
                />
              ))
            ) : (
              <EmptyState icon="bar-chart-outline" title="No screenings recorded" />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  medDetail: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  medBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  medBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
  },
});
