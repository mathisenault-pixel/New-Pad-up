import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import OnboardingShell from '@/components/OnboardingShell';

const SURFACE = '#111118';
const BORDER = 'rgba(255,255,255,0.1)';
const ACCENT = '#4A8FE8';
const TEXT = '#F0F0F5';
const MUTED = '#6B6B7E';

export default function Step2() {
  const [username, setUsername] = useState('');

  const isValid = username.trim().length >= 3;

  return (
    <OnboardingShell
      step={2}
      title="Ton nom d'utilisateur"
      subtitle="Il sera visible par les autres joueurs. Unique et inoubliable."
      onNext={() => router.push('/onboarding/step3')}
      nextDisabled={!isValid}
    >
      <View style={s.wrap}>
        <View style={s.inputRow}>
          <Text style={s.at}>@</Text>
          <TextInput
            style={s.input}
            placeholder="monpseudo"
            placeholderTextColor={MUTED}
            value={username}
            onChangeText={(t) => setUsername(t.toLowerCase().replace(/\s/g, ''))}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />
        </View>
        {username.length > 0 && username.length < 3 && (
          <Text style={s.hint}>Minimum 3 caractères</Text>
        )}
        {isValid && (
          <Text style={s.valid}>✓ @{username} est disponible</Text>
        )}
      </View>
    </OnboardingShell>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 10 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    height: 54,
    paddingHorizontal: 18,
    gap: 4,
  },
  at: { color: MUTED, fontSize: 18, fontWeight: '600' },
  input: { flex: 1, color: '#F0F0F5', fontSize: 16 },
  hint: { fontSize: 13, color: MUTED, paddingLeft: 4 },
  valid: { fontSize: 13, color: '#4ade80', paddingLeft: 4 },
});
