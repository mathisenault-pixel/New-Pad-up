import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/auth';

const { height } = Dimensions.get('window');

const BG = '#0A0A0F';
const ACCENT = '#4A8FE8';
const SURFACE = '#111118';
const BORDER = 'rgba(255,255,255,0.1)';
const TEXT = '#F0F0F5';
const MUTED = '#6B6B7E';

export default function WelcomeScreen() {
  const { signIn } = useAuth();

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="light-content" />

      <View style={s.circle1} />
      <View style={s.circle2} />

      {/* Hero */}
      <View style={s.hero}>
        <View style={s.logoWrap}>
          <Ionicons name="tennisball" size={38} color={ACCENT} />
        </View>
        <Text style={s.brand}>PAD'UP</Text>
        <Text style={s.tagline}>La plateforme des joueurs de padel</Text>
      </View>

      {/* Buttons */}
      <View style={s.actions}>
        <TouchableOpacity style={s.btnApple} onPress={() => router.push('/email-auth')} activeOpacity={0.85}>
          <Ionicons name="logo-apple" size={20} color="#fff" />
          <Text style={s.btnAppleText}>Continuer avec Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.btnGoogle} onPress={() => router.push('/email-auth')} activeOpacity={0.85}>
          <View style={s.googleIcon}><Text style={s.googleG}>G</Text></View>
          <Text style={s.btnGoogleText}>Continuer avec Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.btnEmail} onPress={() => router.push('/email-auth')} activeOpacity={0.85}>
          <Ionicons name="mail-outline" size={20} color={TEXT} />
          <Text style={s.btnEmailText}>S'inscrire avec l'email</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.loginRow} onPress={() => router.push('/login')} activeOpacity={0.7}>
          <Text style={s.loginText}>Déjà un compte ? </Text>
          <Text style={s.loginLink}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 44,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },

  circle1: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(74,143,232,0.07)',
    top: -100,
    right: -100,
  },
  circle2: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(74,143,232,0.04)',
    bottom: 160,
    left: -80,
  },

  // Hero — centré verticalement dans la moitié haute
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(74,143,232,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74,143,232,0.2)',
    marginBottom: 8,
  },
  brand: {
    fontSize: 38,
    fontWeight: '900',
    color: TEXT,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 15,
    color: MUTED,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Buttons — en bas
  actions: {
    gap: 12,
    paddingHorizontal: 12,
  },

  btnApple: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    height: 54,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  btnAppleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  btnGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    height: 54,
  },
  btnGoogleText: {
    color: '#1C1C1E',
    fontSize: 16,
    fontWeight: '600',
  },
  googleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },

  btnEmail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: SURFACE,
    borderRadius: 16,
    height: 54,
    borderWidth: 1,
    borderColor: BORDER,
  },
  btnEmailText: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '600',
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
  },
  loginText: {
    color: MUTED,
    fontSize: 14,
  },
  loginLink: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '700',
  },
});
