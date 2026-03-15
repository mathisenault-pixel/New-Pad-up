import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/auth';

const BG = '#0A0A0F';
const ACCENT = '#4A8FE8';
const SURFACE = '#111118';
const BORDER = 'rgba(255,255,255,0.1)';
const TEXT = '#F0F0F5';
const MUTED = '#6B6B7E';

export default function EmailAuthScreen() {
  const { signIn } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        style={s.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Back */}
        <TouchableOpacity style={s.back} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color={TEXT} />
          <Text style={s.backText}>Retour</Text>
        </TouchableOpacity>

        {/* Title */}
        <View style={s.header}>
          <Text style={s.title}>
            {mode === 'register' ? 'Créer un compte' : 'Se connecter'}
          </Text>
          <Text style={s.subtitle}>
            {mode === 'register'
              ? 'Rejoins la communauté Pad\'up'
              : 'Content de te revoir'}
          </Text>
        </View>

        {/* Form */}
        <View style={s.form}>
          {mode === 'register' && (
            <View style={s.inputWrap}>
              <Ionicons name="person-outline" size={18} color={MUTED} style={s.inputIcon} />
              <TextInput
                style={s.input}
                placeholder="Prénom & nom"
                placeholderTextColor={MUTED}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={s.inputWrap}>
            <Ionicons name="mail-outline" size={18} color={MUTED} style={s.inputIcon} />
            <TextInput
              style={s.input}
              placeholder="Adresse email"
              placeholderTextColor={MUTED}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={s.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color={MUTED} style={s.inputIcon} />
            <TextInput
              style={s.input}
              placeholder="Mot de passe"
              placeholderTextColor={MUTED}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={s.btn}
          onPress={() => mode === 'register' ? router.push('/onboarding/step1') : signIn()}
          activeOpacity={0.85}
        >
          <Text style={s.btnText}>
            {mode === 'register' ? 'Créer mon compte' : 'Se connecter'}
          </Text>
        </TouchableOpacity>

        {/* Switch mode */}
        <TouchableOpacity
          style={s.switchRow}
          onPress={() => setMode(mode === 'register' ? 'login' : 'register')}
          activeOpacity={0.7}
        >
          <Text style={s.switchText}>
            {mode === 'register' ? 'Déjà un compte ? ' : 'Pas encore de compte ? '}
          </Text>
          <Text style={s.switchLink}>
            {mode === 'register' ? 'Se connecter' : 'S\'inscrire'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 44,
    paddingBottom: 40,
  },

  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 16,
    marginBottom: 40,
  },
  backText: {
    color: TEXT,
    fontSize: 15,
  },

  header: {
    marginBottom: 36,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT,
  },
  subtitle: {
    fontSize: 15,
    color: MUTED,
  },

  form: {
    gap: 14,
    marginBottom: 28,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    height: 52,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: TEXT,
    fontSize: 15,
  },

  btn: {
    backgroundColor: ACCENT,
    borderRadius: 16,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  switchText: {
    color: MUTED,
    fontSize: 14,
  },
  switchLink: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '600',
  },
});
