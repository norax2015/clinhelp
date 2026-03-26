import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  useEncounter,
  useEncounterNote,
  useGenerateNote,
  useSaveNote,
} from '../../hooks/useEncounters';
import { NotePreview } from '../../components/encounters/NotePreview';
import { GenerateNoteButton } from '../../components/encounters/GenerateNoteButton';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { Header } from '../../components/layout/Header';
import {
  formatName,
  formatDateTime,
  getEncounterTypeLabel,
  getVisitModeLabel,
} from '../../lib/utils';

function getStatusBadge(status: string): { label: string; color: string; bg: string } {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    scheduled: { label: 'Scheduled', color: '#D97706', bg: '#FEF3C7' },
    in_progress: { label: 'In Progress', color: '#0EA5E9', bg: '#E0F2FE' },
    completed: { label: 'Completed', color: '#16A34A', bg: '#DCFCE7' },
    cancelled: { label: 'Cancelled', color: '#6B7280', bg: '#F3F4F6' },
    no_show: { label: 'No Show', color: '#DC2626', bg: '#FEE2E2' },
  };
  return map[status] ?? { label: status, color: '#6B7280', bg: '#F3F4F6' };
}

export default function EncounterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const encounter = useEncounter(id);
  const noteQuery = useEncounterNote(id);
  const generateNote = useGenerateNote(id);
  const saveNote = useSaveNote();

  const [noteContent, setNoteContent] = useState('');
  const [noteEdited, setNoteEdited] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  // Sync note content when loaded
  useEffect(() => {
    if (noteQuery.data?.content && !noteEdited) {
      setNoteContent(noteQuery.data.content);
    }
  }, [noteQuery.data?.content, noteEdited]);

  // Sync generated note content
  useEffect(() => {
    if (generateNote.data?.content) {
      setNoteContent(generateNote.data.content);
      setNoteEdited(false);
    }
  }, [generateNote.data]);

  async function handleGenerateNote() {
    try {
      await generateNote.mutateAsync('SOAP');
    } catch (err: any) {
      Alert.alert(
        'Generation Failed',
        err?.response?.data?.message ?? 'Could not generate note. Please try again.',
      );
    }
  }

  async function handleSaveDraft() {
    const note = noteQuery.data;
    if (!note) {
      Alert.alert('No Note', 'Generate a note first before saving.');
      return;
    }
    try {
      await saveNote.mutateAsync({
        encounterId: id,
        noteId: note.id,
        content: noteContent,
      });
      Alert.alert('Saved', 'Note draft saved successfully.');
      setNoteEdited(false);
    } catch {
      Alert.alert('Error', 'Could not save the note. Please try again.');
    }
  }

  if (encounter.isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <Header title="Encounter" showBack />
        <Spinner />
      </SafeAreaView>
    );
  }

  if (encounter.isError || !encounter.data) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <Header title="Encounter" showBack />
        <ErrorState
          message="Could not load encounter details."
          onRetry={encounter.refetch}
        />
      </SafeAreaView>
    );
  }

  const enc = encounter.data;
  const statusBadge = getStatusBadge(enc.status);
  const patientName = enc.patient
    ? formatName(enc.patient.firstName, enc.patient.lastName)
    : 'Patient';

  const displayNoteContent = generateNote.data?.content ?? noteContent;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <Header title="Encounter Detail" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Patient info header */}
        <View style={styles.patientCard}>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{patientName}</Text>
            {enc.patient?.mrn ? (
              <Text style={styles.patientMrn}>MRN {enc.patient.mrn}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            onPress={() => enc.patientId && router.push(`/patients/${enc.patientId}`)}
            style={styles.viewPatientBtn}
          >
            <Text style={styles.viewPatientLabel}>View Patient</Text>
            <Ionicons name="chevron-forward" size={14} color="#0EA5E9" />
          </TouchableOpacity>
        </View>

        {/* Encounter info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>{getEncounterTypeLabel(enc.type)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mode</Text>
            <Text style={styles.infoValue}>{getVisitModeLabel(enc.visitMode)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>
              {formatDateTime(enc.scheduledAt ?? enc.createdAt)}
            </Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Status</Text>
            <Badge
              label={statusBadge.label}
              color={statusBadge.color}
              backgroundColor={statusBadge.bg}
              small
            />
          </View>
        </View>

        {enc.chiefComplaint ? (
          <View style={styles.complaintCard}>
            <Text style={styles.complaintLabel}>Chief Complaint</Text>
            <Text style={styles.complaintText}>{enc.chiefComplaint}</Text>
          </View>
        ) : null}

        {/* Generate note section */}
        <Text style={styles.sectionTitle}>Clinical Note</Text>

        {noteQuery.isLoading ? (
          <Spinner size="small" />
        ) : (
          <>
            <GenerateNoteButton
              onPress={handleGenerateNote}
              loading={generateNote.isPending}
              disabled={generateNote.isPending}
            />

            {displayNoteContent ? (
              <View style={{ marginTop: 16 }}>
                <NotePreview
                  content={displayNoteContent}
                  editable
                  onChangeText={(text) => {
                    setNoteContent(text);
                    setNoteEdited(true);
                  }}
                />

                <View style={styles.noteActions}>
                  <Button
                    title="Save Draft"
                    onPress={handleSaveDraft}
                    loading={saveNote.isPending}
                    variant="primary"
                    style={{ flex: 1, marginRight: 8 }}
                  />
                  <Button
                    title="View Transcript"
                    onPress={() => setShowTranscript((v) => !v)}
                    variant="secondary"
                    style={{ flex: 1 }}
                  />
                </View>

                {showTranscript ? (
                  <View style={styles.transcriptBox}>
                    <Ionicons
                      name="mic-outline"
                      size={18}
                      color="#64748B"
                      style={{ marginBottom: 8 }}
                    />
                    <Text style={styles.transcriptText}>
                      Transcript processing... Audio analysis will appear here once the
                      recording has been processed.
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : (
              <View style={styles.noNotePlaceholder}>
                <Ionicons name="document-text-outline" size={36} color="#CBD5E1" />
                <Text style={styles.noNoteText}>
                  Tap "Generate Note" to create an AI-assisted draft from this encounter.
                </Text>
              </View>
            )}
          </>
        )}
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
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1F3D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  patientMrn: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  viewPatientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewPatientLabel: {
    fontSize: 13,
    color: '#0EA5E9',
    fontWeight: '600',
    marginRight: 2,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 14,
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
  },
  complaintCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  complaintLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0EA5E9',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  complaintText: {
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1F3D',
    marginBottom: 12,
  },
  noteActions: {
    flexDirection: 'row',
    marginTop: 14,
  },
  transcriptBox: {
    marginTop: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  transcriptText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  noNotePlaceholder: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  noNoteText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
});
