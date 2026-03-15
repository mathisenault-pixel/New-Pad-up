import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import OnboardingShell from '@/components/OnboardingShell';

const SURFACE = '#111118';
const BORDER = 'rgba(255,255,255,0.1)';
const ACCENT = '#4A8FE8';
const TEXT = '#F0F0F5';
const MUTED = '#6B6B7E';

const SIDES = [
  {
    id: 'drive',
    label: 'Côté Drive',
    desc: 'Côté gauche du terrain (vu depuis le fond)',
    emoji: '🎯',
  },
  {
    id: 'revers',
    label: 'Côté Revers',
    desc: 'Côté droit du terrain (vu depuis le fond)',
    emoji: '🏓',
  },
  {
    id: 'both',
    label: 'Les deux',
    desc: "Je m'adapte selon l'équipe",
    emoji: '🔄',
  },
];

export default function Step4() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <OnboardingShell
      step={4}
      title="Ton côté préféré"
      subtitle="Sur quel côté tu te sens le mieux ?"
      onNext={() => router.push('/onboarding/step5')}
      nextDisabled={!selected}
    >
      <View style={s.list}>
        {SIDES.map((side) => {
          const active = selected === side.id;
          return (
            <TouchableOpacity
              key={side.id}
              style={[s.card, active && s.cardActive]}
              onPress={() => setSelected(side.id)}
              activeOpacity={0.8}
            >
              <Text style={s.emoji}>{side.emoji}</Text>
              <View style={s.cardText}>
                <Text style={[s.label, active && s.labelActive]}>{side.label}</Text>
                <Text style={s.desc}>{side.desc}</Text>
              </View>
              {active && (
                <View style={s.check}>
                  <Text style={s.checkMark}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </OnboardingShell>
  );
}

const s = StyleSheet.create({
  list: { gap: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 18,
  },
  cardActive: {
    borderColor: ACCENT,
    backgroundColor: 'rgba(74,143,232,0.08)',
  },
  emoji: { fontSize: 28 },
  cardText: { flex: 1, gap: 4 },
  label: { fontSize: 16, fontWeight: '600', color: TEXT },
  labelActive: { color: ACCENT },
  desc: { fontSize: 13, color: MUTED },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { color: '#fff', fontSize: 13, fontWeight: '700' },
});
