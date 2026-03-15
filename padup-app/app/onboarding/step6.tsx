import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/auth';

const BG = '#0A0A0F';
const ACCENT = '#4A8FE8';
const TEXT = '#F0F0F5';
const MUTED = '#6B6B7E';
const SURFACE = '#111118';
const BORDER = 'rgba(255,255,255,0.1)';

export default function Step6() {
  const { signIn } = useAuth();
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={s.root}>
      <Animated.View style={[s.inner, { opacity, transform: [{ scale }] }]}>
        {/* Icône */}
        <View style={s.iconWrap}>
          <Text style={s.confetti}>🎉</Text>
        </View>

        {/* Texte */}
        <Text style={s.title}>Tu es prêt !</Text>
        <Text style={s.subtitle}>
          Ton profil est créé. Bienvenue dans la communauté Pad'up — réserve, joue, progresse.
        </Text>

        {/* Récap */}
        <View style={s.recap}>
          <RecapRow icon="checkmark-circle" label="Profil créé" />
          <RecapRow icon="people-outline" label="Accès à la communauté" />
          <RecapRow icon="calendar-outline" label="Réservation de terrains" />
          <RecapRow icon="trophy-outline" label="Tournois & classements" />
        </View>
      </Animated.View>

      {/* CTA */}
      <TouchableOpacity style={s.btn} onPress={signIn} activeOpacity={0.85}>
        <Text style={s.btnText}>Allons-y !</Text>
        <Ionicons name="arrow-forward" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function RecapRow({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={r.row}>
      <Ionicons name={icon} size={18} color={ACCENT} />
      <Text style={r.label}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 28,
    paddingBottom: 48,
    paddingTop: 80,
    justifyContent: 'space-between',
  },
  inner: { alignItems: 'center', gap: 20 },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: 'rgba(74,143,232,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(74,143,232,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  confetti: { fontSize: 44 },
  title: { fontSize: 34, fontWeight: '800', color: TEXT, textAlign: 'center' },
  subtitle: {
    fontSize: 15,
    color: MUTED,
    textAlign: 'center',
    lineHeight: 23,
    paddingHorizontal: 8,
  },
  recap: {
    width: '100%',
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 18,
    padding: 20,
    gap: 14,
    marginTop: 8,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: ACCENT,
    borderRadius: 16,
    height: 54,
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});

const r = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  label: { fontSize: 15, color: TEXT, fontWeight: '500' },
});
