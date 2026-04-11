import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { updateProfile } from '../api/users';

export default function ProfileScreen({ token, user, onUserUpdated, onLogout }) {
  const [name, setName] = useState(user?.name || '');
  const [ecole, setEcole] = useState(user?.ecole || '');
  const [city, setCity] = useState(user?.city || '');
  const [budget, setBudget] = useState(String(user?.budget || '1500'));
  const [bio, setBio] = useState(user?.bio || '');
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setFeedback({ type: '', text: '' });
    try {
      const payload = {
        name: name.trim(),
        ecole: ecole.trim(),
        city: city.trim(),
        budget: Number(budget || 0),
        bio: bio.trim(),
      };
      const data = await updateProfile(token, payload);
      if (data?.user) onUserUpdated(data.user);
      setFeedback({ type: 'success', text: 'Profil mis a jour.' });
      Alert.alert('Succes', 'Profil mis a jour.');
    } catch (err) {
      const msg = err.message || 'Erreur mise a jour profil.';
      setFeedback({ type: 'error', text: msg });
      Alert.alert('Erreur', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrap}>
        <Text style={styles.title}>Mon Profil</Text>

        <TextInput style={styles.input} placeholder="Nom" placeholderTextColor="#94a3b8" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Ecole" placeholderTextColor="#94a3b8" value={ecole} onChangeText={setEcole} />
        <TextInput style={styles.input} placeholder="Ville" placeholderTextColor="#94a3b8" value={city} onChangeText={setCity} />
        <TextInput style={styles.input} placeholder="Budget" placeholderTextColor="#94a3b8" keyboardType="number-pad" value={budget} onChangeText={setBudget} />
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Bio"
          placeholderTextColor="#94a3b8"
          multiline
          value={bio}
          onChangeText={setBio}
        />

        {!!feedback.text && <Text style={[styles.feedback, feedback.type === 'error' && styles.feedbackError]}>{feedback.text}</Text>}

        <Pressable style={[styles.btn, saving && styles.btnDisabled]} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Sauvegarder</Text>}
        </Pressable>

        <Pressable style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f172a' },
  wrap: { flex: 1, padding: 16 },
  title: { color: '#f8fafc', fontSize: 24, fontWeight: '800', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    color: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#111827',
  },
  textarea: { minHeight: 90, textAlignVertical: 'top' },
  feedback: { color: '#86efac', marginBottom: 10 },
  feedbackError: { color: '#fda4af' },
  btn: {
    backgroundColor: '#ea580c',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 11,
    marginBottom: 10,
  },
  btnText: { color: '#fff', fontWeight: '700' },
  btnDisabled: { opacity: 0.6 },
  logoutBtn: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 11,
  },
  logoutText: { color: '#f8fafc', fontWeight: '700' },
});
