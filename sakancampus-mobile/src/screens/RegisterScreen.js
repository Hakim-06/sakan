import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function RegisterScreen({ onRegister, onVerifyCode, onResendCode, onBackLogin }) {
  const [step, setStep] = useState('register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const canRegister = name.trim().length >= 2 && email.trim().length >= 5 && password.length >= 6 && !loading;
  const canVerify = email.trim().length >= 5 && code.trim().length === 6 && !loading;

  const handleRegister = async () => {
    if (!canRegister) return;
    setLoading(true);
    setError('');
    setInfo('');

    try {
      const data = await onRegister(name.trim(), email.trim(), password);
      setInfo(data?.message || 'Compte cree. Verifie ton email.');
      if (data?.devVerificationCode) {
        setInfo((prev) => `${prev} Code dev: ${data.devVerificationCode}`);
      }
      setStep('verify');
    } catch (err) {
      setError(err.message || 'Inscription impossible.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!canVerify) return;
    setLoading(true);
    setError('');
    setInfo('');

    try {
      await onVerifyCode(email.trim(), code.trim());
      setInfo('Email verifie. Connexion effectuee.');
    } catch (err) {
      setError(err.message || 'Code invalide.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim() || loading) return;
    setLoading(true);
    setError('');

    try {
      const data = await onResendCode(email.trim());
      setInfo(data?.message || 'Code renvoye.');
      if (data?.devVerificationCode) {
        setInfo((prev) => `${prev} Code dev: ${data.devVerificationCode}`);
      }
    } catch (err) {
      setError(err.message || 'Impossible de renvoyer le code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.wrap}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Creer un compte</Text>
          <Text style={styles.subtitle}>
            {step === 'register' ? 'Inscription rapide' : 'Verification email'}
          </Text>

          {step === 'register' ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nom"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Email"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="Mot de passe"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
              />

              {!!error && <Text style={styles.error}>{error}</Text>}
              {!!info && <Text style={styles.info}>{info}</Text>}

              <Pressable style={[styles.btn, !canRegister && styles.btnDisabled]} onPress={handleRegister} disabled={!canRegister}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>S'inscrire</Text>}
              </Pressable>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Email"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="Code 6 chiffres"
                placeholderTextColor="#94a3b8"
                value={code}
                onChangeText={setCode}
              />

              {!!error && <Text style={styles.error}>{error}</Text>}
              {!!info && <Text style={styles.info}>{info}</Text>}

              <Pressable style={[styles.btn, !canVerify && styles.btnDisabled]} onPress={handleVerify} disabled={!canVerify}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Verifier</Text>}
              </Pressable>

              <Pressable style={styles.linkBtn} onPress={handleResend}>
                <Text style={styles.link}>Renvoyer le code</Text>
              </Pressable>
            </>
          )}

          <Pressable style={styles.linkBtn} onPress={onBackLogin}>
            <Text style={styles.link}>Retour a la connexion</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f172a' },
  wrap: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  card: {
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  title: { color: '#f8fafc', fontSize: 26, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: '#94a3b8', fontSize: 14, marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    color: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 10,
    backgroundColor: '#0b1220',
  },
  btn: {
    marginTop: 6,
    borderRadius: 12,
    backgroundColor: '#ea580c',
    alignItems: 'center',
    paddingVertical: 12,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontWeight: '700' },
  linkBtn: { marginTop: 12, alignItems: 'center' },
  link: { color: '#fdba74', fontWeight: '700' },
  error: { color: '#fda4af', marginBottom: 6, fontSize: 13 },
  info: { color: '#86efac', marginBottom: 6, fontSize: 13 },
});
