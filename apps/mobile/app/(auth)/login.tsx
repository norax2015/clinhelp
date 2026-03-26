import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!password.trim()) {
      setError('Password is required.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function fillDemo() {
    setEmail('admin@clinhelpdemo.com');
    setPassword('ClinHelp2024!');
    setError(null);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="light" backgroundColor="#0F1F3D" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo block */}
          <View style={styles.logoBlock}>
            <View style={styles.logoIconWrap}>
              <Ionicons name="medical" size={36} color="#FFFFFF" />
            </View>
            <Text style={styles.logoText}>ClinHelp</Text>
            <Text style={styles.poweredBy}>Powered by Norax Solutions</Text>
          </View>

          {/* Form card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign In</Text>
            <Text style={styles.cardSubtitle}>
              Enter your credentials to access your account
            </Text>

            <View style={styles.form}>
              <Input
                label="Email address"
                value={email}
                onChangeText={setEmail}
                placeholder="you@organization.com"
                keyboardType="email-address"
                autoComplete="email"
                leftIcon="mail-outline"
                editable={!loading}
              />
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                autoComplete="password"
                leftIcon="lock-closed-outline"
                editable={!loading}
              />

              {error ? (
                <View style={styles.errorBox}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={16}
                    color="#DC2626"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
                fullWidth
                style={{ marginTop: 8 }}
              />
            </View>
          </View>

          {/* Demo hint */}
          <TouchableOpacity style={styles.demoHint} onPress={fillDemo} activeOpacity={0.7}>
            <Ionicons name="information-circle-outline" size={15} color="#64748B" style={{ marginRight: 6 }} />
            <Text style={styles.demoHintText}>
              Demo: admin@clinhelpdemo.com / ClinHelp2024!
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F1F3D',
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 48,
  },
  logoBlock: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  poweredBy: {
    marginTop: 4,
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '400',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F1F3D',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 18,
  },
  form: {
    gap: 4,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#DC2626',
    lineHeight: 18,
  },
  demoHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
  demoHintText: {
    fontSize: 12,
    color: '#64748B',
  },
});
