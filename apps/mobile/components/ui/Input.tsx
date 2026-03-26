import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: object;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  secureTextEntry,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry ?? false);

  const isPassword = secureTextEntry;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputWrapperFocused,
          error ? styles.inputWrapperError : null,
        ]}
      >
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={18}
            color="#94A3B8"
            style={styles.leftIcon}
          />
        ) : null}
        <TextInput
          style={[styles.input, leftIcon ? styles.inputWithLeft : null]}
          placeholderTextColor="#94A3B8"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={isPassword ? hidden : false}
          autoCapitalize="none"
          {...props}
        />
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setHidden((h) => !h)}
            style={styles.rightIconBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color="#94A3B8"
            />
          </TouchableOpacity>
        ) : rightIcon ? (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIconBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name={rightIcon} size={18} color="#94A3B8" />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  inputWrapperFocused: {
    borderColor: '#0EA5E9',
  },
  inputWrapperError: {
    borderColor: '#DC2626',
  },
  leftIcon: {
    marginLeft: 12,
  },
  rightIconBtn: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1E293B',
  },
  inputWithLeft: {
    paddingLeft: 8,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: '#DC2626',
  },
});
