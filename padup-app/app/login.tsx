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

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
        </TouchableOpacity>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Connexion</Text>
          <Text style={s.subtitle}>Content de te revoir 👋</Text>
        </View>

        {/* Form */}
        <View style={s.form}>
          <View style={s.fieldWrap}>
            <Text style={s.label}>Email</Text>
            <View style={s.inputWrap}>
              <TextInput
                style={s.input}
                placeholder="ton@email.com"
                placeholderTextColor={MUTED}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={s.fieldWrap}>
            <View style={s.labelRow}>
              <Text style={s.label}>Mot de passe</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={s.forgot}>Oublié ?</Text>
              </TouchableOpacity>
            </View>
            <View style={s.inputWrap}>
              <TextInput
                style={s.input}
                placeholder="••••••••"
                placeholderTextColor={MUTED}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={MUTED}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity style={s.btn} onPress={signIn} activeOpacity={0.85}>
          <Text style={s.btnText}>Se connecter</Text>
        </TouchableOpacity>

        {/* Register link */}
        <TouchableOpacity
          style={s.registerRow}
          onPress={() => router.replace('/email-auth')}
          activeOpacity={0.7}
        >
          <Text style={s.registerText}>Pas encore de compte ? </Text>
          <Text style={s.registerLink}>S'inscrire</Text>
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
    paddingHorizontal: 28,
    paddingBottom: 40,
  },

  back: {
    marginTop: 16,
    marginBottom: 48,
    width: 36,
  },

  header: {
    marginBottom: 40,
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: TEXT,
  },
  subtitle: {
    fontSize: 15,
    color: MUTED,
  },

  form: {
    gap: 20,
    marginBottom: 32,
  },
  fieldWrap: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: MUTED,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgot: {
    fontSize: 13,
    color: ACCENT,
    fontWeight: '500',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    height: 54,
    paddingHorizontal: 18,
  },
  input: {
    flex: 1,
    color: TEXT,
    fontSize: 16,
  },

  btn: {
    backgroundColor: ACCENT,
    borderRadius: 16,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: MUTED,
    fontSize: 14,
  },
  registerLink: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: '600',
  },
});
