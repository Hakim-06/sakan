import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { createAnnonce } from '../api/annonces';

export default function PublishScreen({ token, onPublished }) {
  const [city, setCity] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = city.trim().length >= 2 && Number(budget) > 0 && !loading;

  const handlePublish = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setFeedback('');
    try {
      const payload = {
        city: city.trim(),
        budget: Number(budget),
        description: description.trim(),
        amenities: [],
        photos: [],
      };
      await createAnnonce(token, payload);
      setFeedback('Annonce publiee avec succes.');
      setCity('');
      setBudget('');
      setDescription('');
      if (onPublished) onPublished();
    } catch (err) {
      setFeedback(err.message || 'Erreur publication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrap}>
        <Text style={styles.title}>Publier annonce</Text>

        <TextInput style={styles.input} placeholder="Ville" placeholderTextColor="#94a3b8" value={city} onChangeText={setCity} />
        <TextInput style={styles.input} placeholder="Budget (DH)" placeholderTextColor="#94a3b8" keyboardType="number-pad" value={budget} onChangeText={setBudget} />
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Description"
          placeholderTextColor="#94a3b8"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        {!!feedback && <Text style={styles.feedback}>{feedback}</Text>}

        <Pressable style={[styles.btn, !canSubmit && styles.btnDisabled]} disabled={!canSubmit} onPress={handlePublish}>
          <Text style={styles.btnText}>{loading ? 'Publication...' : 'Publier'}</Text>
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
  btn: {
    backgroundColor: '#ea580c',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 11,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontWeight: '700' },
});
