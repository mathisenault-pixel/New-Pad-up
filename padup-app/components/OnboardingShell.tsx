import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const BG = '#0A0A0F';
const ACCENT = '#4A8FE8';
const MUTED = '#6B6B7E';
const TEXT = '#F0F0F5';
const TOTAL = 6;

type Props = {
  step: number;
  title: string;
  subtitle?: string;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  children: React.ReactNode;
};

export default function OnboardingShell({
  step,
  title,
  subtitle,
  onNext,
  nextLabel = 'Continuer',
  nextDisabled = false,
  children,
}: Props) {
  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="light-content" />

      {/* Progress bar */}
      <View style={s.progressTrack}>
        <View style={[s.progressFill, { width: `${(step / TOTAL) * 100}%` }]} />
      </View>

      <KeyboardAvoidingView
        style={s.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={s.top}>
          {step > 1 ? (
            <TouchableOpacity style={s.back} onPress={() => router.back()} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={22} color={TEXT} />
            </TouchableOpacity>
          ) : (
            <View style={s.back} />
          )}
          <Text style={s.stepLabel}>{step} / {TOTAL}</Text>
        </View>

        {/* Question */}
        <View style={s.question}>
          <Text style={s.title}>{title}</Text>
          {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
        </View>

        {/* Content */}
        <View style={s.content}>{children}</View>

        {/* Next */}
        <TouchableOpacity
          style={[s.btn, nextDisabled && s.btnDisabled]}
          onPress={onNext}
          activeOpacity={0.85}
          disabled={nextDisabled}
        >
          <Text style={s.btnText}>{nextLabel}</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  progressFill: {
    height: 3,
    backgroundColor: ACCENT,
    borderRadius: 2,
  },

  inner: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 32,
  },

  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 40,
  },
  back: { width: 36, height: 36, justifyContent: 'center' },
  stepLabel: { fontSize: 13, color: MUTED, fontWeight: '500' },

  question: { marginBottom: 36, gap: 8 },
  title: { fontSize: 28, fontWeight: '700', color: TEXT, lineHeight: 34 },
  subtitle: { fontSize: 15, color: MUTED, lineHeight: 22 },

  content: { flex: 1 },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: ACCENT,
    borderRadius: 16,
    height: 54,
  },
  btnDisabled: { opacity: 0.35 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
