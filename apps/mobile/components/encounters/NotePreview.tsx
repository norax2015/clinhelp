import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotePreviewProps {
  content: string;
  editable?: boolean;
  onChangeText?: (text: string) => void;
}

export function NotePreview({ content, editable = false, onChangeText }: NotePreviewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.disclaimer}>
        <Ionicons name="information-circle-outline" size={14} color="#D97706" style={{ marginRight: 6 }} />
        <Text style={styles.disclaimerText}>
          AI-assisted draft — review and edit before finalizing
        </Text>
      </View>
      {editable ? (
        <TextInput
          style={styles.editor}
          value={content}
          onChangeText={onChangeText}
          multiline
          textAlignVertical="top"
          placeholder="Note content will appear here..."
          placeholderTextColor="#94A3B8"
        />
      ) : (
        <Text style={styles.text} selectable>
          {content}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 14,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#D97706',
    fontWeight: '500',
  },
  text: {
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 20,
  },
  editor: {
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 20,
    minHeight: 200,
  },
});
