import { View, TextInput, StyleSheet } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import OnboardingShell from '@/components/OnboardingShell';

const SURFACE = '#111118';
const BORDER = 'rgba(255,255,255,0.1)';
const TEXT = '#F0F0F5';
const MUTED = '#6B6B7E';

export default function Step1() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  return (
    <OnboardingShell
      step={1}
      title="Comment tu t'appelles ?"
      subtitle="Ton vrai prénom pour que tes partenaires te reconnaissent."
      onNext={() => router.push('/onboarding/step2')}
      nextDisabled={!firstName.trim() || !lastName.trim()}
    >
      <View style={s.fields}>
        <TextInput
          style={s.input}
          placeholder="Prénom"
          placeholderTextColor={MUTED}
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
          autoFocus
        />
        <TextInput
          style={s.input}
          placeholder="Nom"
          placeholderTextColor={MUTED}
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
        />
      </View>
    </OnboardingShell>
  );
}

const s = StyleSheet.create({
  fields: { gap: 14 },
  input: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    height: 54,
    paddingHorizontal: 18,
    color: TEXT,
    fontSize: 16,
  },
});
