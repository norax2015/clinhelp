import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCreateEncounter } from '../../hooks/useEncounters';
import { usePatients } from '../../hooks/usePatients';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Header } from '../../components/layout/Header';
import type { EncounterType, VisitMode } from '@clinhelp/types';
import { getEncounterTypeLabel, getVisitModeLabel, formatName } from '../../lib/utils';

const ENCOUNTER_TYPES: EncounterType[] = ['intake', 'follow_up', 'therapy', 'med_management'];
const VISIT_MODES: VisitMode[] = ['in_person', 'telehealth', 'phone', 'async'];

function OptionButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.optionBtn, selected && styles.optionBtnSelected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {selected ? (
        <Ionicons name="checkmark-circle" size={16} color="#0EA5E9" style={{ marginRight: 6 }} />
      ) : (
        <Ionicons name="ellipse-outline" size={16} color="#CBD5E1" style={{ marginRight: 6 }} />
      )}
      <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function NewEncounterScreen() {
  const router = useRouter();
  const createEncounter = useCreateEncounter();
  const { data: patientsData } = usePatients();
  const patients = patientsData?.data ?? (Array.isArray(patientsData) ? (patientsData as any) : []);

  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientPicker, setShowPatientPicker] = useState(false);
  const [encounterType, setEncounterType] = useState<EncounterType>('follow_up');
  const [visitMode, setVisitMode] = useState<VisitMode>('in_person');
  const [chiefComplaint, setChiefComplaint] = useState('');

  const filteredPatients = patients.filter((p: any) => {
    const fullName = formatName(p.firstName, p.lastName).toLowerCase();
    const mrn = p.mrn.toLowerCase();
    const q = patientSearch.toLowerCase();
    return fullName.includes(q) || mrn.includes(q);
  });

  const selectedPatient = patients.find((p: any) => p.id === selectedPatientId);

  async function handleCreate() {
    if (!selectedPatientId) {
      Alert.alert('Required', 'Please select a patient.');
      return;
    }
    try {
      const encounter = await createEncounter.mutateAsync({
        patientId: selectedPatientId,
        type: encounterType,
        visitMode,
        chiefComplaint: chiefComplaint.trim() || undefined,
      });
      router.replace(`/encounters/${encounter.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Could not create encounter. Please try again.';
      Alert.alert('Error', msg);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Header title="New Encounter" showBack />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Patient selection */}
        <Text style={styles.fieldLabel}>Patient *</Text>
        <TouchableOpacity
          style={styles.patientPicker}
          onPress={() => setShowPatientPicker((v) => !v)}
          activeOpacity={0.8}
        >
          <Ionicons name="person-outline" size={18} color="#94A3B8" style={{ marginRight: 10 }} />
          <Text style={[styles.patientPickerText, !selectedPatient && styles.placeholder]}>
            {selectedPatient
              ? formatName(selectedPatient.firstName, selectedPatient.lastName)
              : 'Select a patient...'}
          </Text>
          <Ionicons
            name={showPatientPicker ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#94A3B8"
          />
        </TouchableOpacity>

        {showPatientPicker ? (
          <View style={styles.patientDropdown}>
            <Input
              placeholder="Search patients..."
              value={patientSearch}
              onChangeText={setPatientSearch}
              leftIcon="search-outline"
              containerStyle={{ marginBottom: 0 }}
            />
            <ScrollView style={styles.patientList} nestedScrollEnabled>
              {filteredPatients.length === 0 ? (
                <Text style={styles.noPatients}>No patients found.</Text>
              ) : (
                filteredPatients.slice(0, 20).map((p: any) => (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.patientOption}
                    onPress={() => {
                      setSelectedPatientId(p.id);
                      setShowPatientPicker(false);
                      setPatientSearch('');
                    }}
                  >
                    <Text style={styles.patientOptionName}>
                      {formatName(p.firstName, p.lastName)}
                    </Text>
                    <Text style={styles.patientOptionMrn}>MRN {p.mrn}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        ) : null}

        {/* Encounter type */}
        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Encounter Type</Text>
        <View style={styles.optionGrid}>
          {ENCOUNTER_TYPES.map((t) => (
            <OptionButton
              key={t}
              label={getEncounterTypeLabel(t)}
              selected={encounterType === t}
              onPress={() => setEncounterType(t)}
            />
          ))}
        </View>

        {/* Visit mode */}
        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Visit Mode</Text>
        <View style={styles.optionGrid}>
          {VISIT_MODES.map((m) => (
            <OptionButton
              key={m}
              label={getVisitModeLabel(m)}
              selected={visitMode === m}
              onPress={() => setVisitMode(m)}
            />
          ))}
        </View>

        {/* Chief complaint */}
        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Chief Complaint</Text>
        <View style={styles.textAreaWrap}>
          <Input
            placeholder="Describe the primary reason for this visit..."
            value={chiefComplaint}
            onChangeText={setChiefComplaint}
            multiline
            numberOfLines={4}
            containerStyle={{ marginBottom: 0 }}
            style={{ minHeight: 90, textAlignVertical: 'top' }}
          />
        </View>

        <Button
          title="Create Encounter"
          onPress={handleCreate}
          loading={createEncounter.isPending}
          fullWidth
          style={{ marginTop: 28 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  patientPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  patientPickerText: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
  },
  placeholder: {
    color: '#94A3B8',
  },
  patientDropdown: {
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  patientList: {
    maxHeight: 200,
  },
  patientOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  patientOptionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  patientOptionMrn: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 1,
  },
  noPatients: {
    padding: 14,
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  optionBtnSelected: {
    borderColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
  },
  optionLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  optionLabelSelected: {
    color: '#0EA5E9',
    fontWeight: '700',
  },
  textAreaWrap: {
    // wrapper for multi-line input
  },
});
