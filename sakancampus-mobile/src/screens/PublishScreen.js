import { useEffect, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { createAnnonce, deleteAnnonce, getMyAnnonces, updateAnnonce } from '../api/annonces';

export default function PublishScreen({ token, onPublished }) {
  const [editingId, setEditingId] = useState('');
  const [city, setCity] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  const [mine, setMine] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = city.trim().length >= 2 && Number(budget) > 0 && !loading;

  const loadMine = async () => {
    try {
      const data = await getMyAnnonces(token);
      setMine(Array.isArray(data?.annonces) ? data.annonces : []);
    } catch {
      // Ignore load failure in UI for now.
    }
  };

  useEffect(() => {
    loadMine();
  }, []);

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
      if (editingId) {
        await updateAnnonce(token, editingId, payload);
        setFeedback('Annonce mise a jour.');
      } else {
        await createAnnonce(token, payload);
        setFeedback('Annonce publiee avec succes.');
      }
      setCity('');
      setBudget('');
      setDescription('');
      setEditingId('');
      await loadMine();
      if (onPublished) onPublished();
    } catch (err) {
      setFeedback(err.message || 'Erreur publication.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(String(item?._id || item?.id || ''));
    setCity(String(item?.city || ''));
    setBudget(String(item?.budget || ''));
    setDescription(String(item?.description || ''));
  };

  const handleDelete = async (item) => {
    const id = String(item?._id || item?.id || '');
    if (!id) return;
    try {
      await deleteAnnonce(token, id);
      if (editingId === id) {
        setEditingId('');
        setCity('');
        setBudget('');
        setDescription('');
      }
      setFeedback('Annonce supprimee.');
      await loadMine();
    } catch (err) {
      setFeedback(err.message || 'Erreur suppression.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrap}>
        <Text style={styles.title}>{editingId ? 'Modifier annonce' : 'Publier annonce'}</Text>

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
          <Text style={styles.btnText}>{loading ? 'Traitement...' : editingId ? 'Enregistrer' : 'Publier'}</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Mes annonces</Text>
        <FlatList
          data={mine}
          keyExtractor={(item, idx) => String(item?._id || item?.id || idx)}
          contentContainerStyle={styles.mineList}
          ListEmptyComponent={<Text style={styles.empty}>Aucune annonce perso.</Text>}
          renderItem={({ item }) => (
            <View style={styles.mineCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mineCity}>{item?.city || 'Ville'}</Text>
                <Text style={styles.mineMeta}>{Number(item?.budget || 0)} DH/mois</Text>
              </View>
              <Pressable style={styles.actionBtn} onPress={() => handleEdit(item)}>
                <Text style={styles.actionText}>Edit</Text>
              </Pressable>
              <Pressable style={[styles.actionBtn, styles.actionDanger]} onPress={() => handleDelete(item)}>
                <Text style={styles.actionText}>Delete</Text>
              </Pressable>
            </View>
          )}
        />
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
  sectionTitle: { color: '#f8fafc', fontSize: 18, fontWeight: '800', marginTop: 20, marginBottom: 10 },
  mineList: { paddingBottom: 14, gap: 8 },
  mineCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mineCity: { color: '#f8fafc', fontWeight: '800' },
  mineMeta: { color: '#94a3b8', marginTop: 2 },
  actionBtn: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  actionDanger: { backgroundColor: '#7f1d1d', borderColor: '#991b1b' },
  actionText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  empty: { color: '#94a3b8' },
});
