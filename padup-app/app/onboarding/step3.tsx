import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import OnboardingShell from '@/components/OnboardingShell';

const SURFACE = '#111118';
const BORDER = 'rgba(255,255,255,0.1)';
const ACCENT = '#4A8FE8';
const TEXT = '#F0F0F5';
const MUTED = '#6B6B7E';
const BG = '#0A0A0F';

// 1, 1+, 2, 2+, … 9, 9+, 10
const LEVELS: string[] = [];
for (let i = 1; i <= 9; i++) {
  LEVELS.push(String(i));
  LEVELS.push(`${i}+`);
}
LEVELS.push('10');

export default function Step3() {
  // indexes of selected levels (1 or 2 adjacent)
  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);

  function handleTap(idx: number) {
    // Nothing selected yet
    if (start === null) {
      setStart(idx);
      setEnd(null);
      return;
    }
    // Tap the already-selected start → deselect
    if (idx === start && end === null) {
      setStart(null);
      return;
    }
    // Tap the end of a range → remove end (keep start)
    if (idx === end) {
      setEnd(null);
      return;
    }
    // Tap adjacent to start (no range yet) → create range
    if (end === null && Math.abs(idx - start) === 1) {
      const lo = Math.min(idx, start);
      const hi = Math.max(idx, start);
      setStart(lo);
      setEnd(hi);
      return;
    }
    // Tap adjacent to existing range edges → extend/contract
    if (end !== null) {
      if (idx === start - 1) { setStart(idx); return; }
      if (idx === end + 1)   { setEnd(idx);   return; }
    }
    // Anything else → reset to new single selection
    setStart(idx);
    setEnd(null);
  }

  function isSelected(idx: number) {
    if (start === null) return false;
    if (end === null) return idx === start;
    return idx >= start && idx <= end;
  }

  function isEdge(idx: number) {
    return idx === start || idx === end;
  }

  const label = start !== null
    ? end !== null
      ? `${LEVELS[start]} / ${LEVELS[end]}`
      : LEVELS[start]
    : null;

  return (
    <OnboardingShell
      step={3}
      title="Ton niveau de jeu"
      subtitle="Sélectionne un niveau ou une fourchette en tapant deux cases adjacentes."
      onNext={() => router.push('/onboarding/step4')}
      nextDisabled={start === null}
    >
      <View style={s.wrapper}>
        {/* Grid */}
        <View style={s.grid}>
          {LEVELS.map((lvl, idx) => {
            const sel = isSelected(idx);
            const edge = isEdge(idx);
            const isInRange = sel && !edge && end !== null;
            return (
              <TouchableOpacity
                key={lvl}
                style={[
                  s.cell,
                  sel && s.cellSel,
                  isInRange && s.cellRange,
                ]}
                onPress={() => handleTap(idx)}
                activeOpacity={0.75}
              >
                <Text style={[s.cellText, sel && s.cellTextSel]}>{lvl}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected display */}
        {label ? (
          <View style={s.result}>
            <Text style={s.resultLabel}>Niveau sélectionné</Text>
            <Text style={s.resultValue}>{label}</Text>
            <Text style={s.resultHint}>
              {end !== null
                ? 'Fourchette entre ' + LEVELS[start!] + ' et ' + LEVELS[end]
                : 'Tape une case adjacente pour créer une fourchette'}
            </Text>
          </View>
        ) : (
          <View style={s.hint}>
            <Text style={s.hintText}>Tape un niveau pour le sélectionner</Text>
          </View>
        )}
      </View>
    </OnboardingShell>
  );
}

const s = StyleSheet.create({
  wrapper: { gap: 20 },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cell: {
    width: 56,
    height: 48,
    borderRadius: 12,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellSel: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  cellRange: {
    backgroundColor: 'rgba(74,143,232,0.25)',
    borderColor: 'rgba(74,143,232,0.5)',
  },
  cellText: {
    fontSize: 15,
    fontWeight: '700',
    color: MUTED,
  },
  cellTextSel: {
    color: '#fff',
  },

  result: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: 'rgba(74,143,232,0.3)',
    borderRadius: 16,
    padding: 18,
    gap: 4,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 12,
    color: MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 32,
    fontWeight: '800',
    color: ACCENT,
  },
  resultHint: {
    fontSize: 12,
    color: MUTED,
    textAlign: 'center',
  },

  hint: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  hintText: {
    fontSize: 13,
    color: MUTED,
  },
});
