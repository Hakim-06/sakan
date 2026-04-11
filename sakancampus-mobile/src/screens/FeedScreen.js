import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getAnnonces } from '../api/annonces';

function Item({ item, onOpen }) {
  const city = item?.city || 'Ville inconnue';
  const budget = Number(item?.budget || 0);
  const owner = item?.owner?.name || item?.name || 'Utilisateur';

  return (
    <Pressable style={styles.card} onPress={() => onOpen(item)}>
      <Text style={styles.city}>{city}</Text>
      <Text style={styles.owner}>Par: {owner}</Text>
      <Text style={styles.price}>{budget} DH/mois</Text>
      <Text style={styles.more}>Voir details</Text>
    </Pressable>
  );
}

export default function FeedScreen({ token, user }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [annonces, setAnnonces] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async (withRefresh = false) => {
    try {
      if (withRefresh) setRefreshing(true);
      else setLoading(true);
      setError('');

      const data = await getAnnonces(token);
      setAnnonces(Array.isArray(data?.annonces) ? data.annonces : []);
    } catch (err) {
      setError(err.message || 'Impossible de charger les annonces.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    load(false);
  }, [load]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Feed Mobile</Text>
          <Text style={styles.subtitle}>Bienvenue {user?.name || 'User'}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#ea580c" size="large" />
        </View>
      ) : (
        <FlatList
          data={annonces}
          keyExtractor={(item, idx) => String(item?._id || item?.id || idx)}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
          renderItem={({ item }) => <Item item={item} onOpen={setSelected} />}
          ListEmptyComponent={<Text style={styles.empty}>Aucune annonce pour le moment.</Text>}
          ListHeaderComponent={error ? <Text style={styles.error}>{error}</Text> : null}
        />
      )}

      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{selected?.city || 'Annonce'}</Text>
            <Text style={styles.modalLine}>Budget: {Number(selected?.budget || 0)} DH/mois</Text>
            <Text style={styles.modalLine}>Owner: {selected?.owner?.name || selected?.name || 'Utilisateur'}</Text>
            <Text style={styles.modalDesc}>{selected?.description || 'Aucune description disponible.'}</Text>
            <Pressable style={styles.closeBtn} onPress={() => setSelected(null)}>
              <Text style={styles.closeText}>Fermer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: '#f8fafc', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#94a3b8', marginTop: 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 14, gap: 10 },
  card: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 14,
    padding: 14,
  },
  city: { color: '#f8fafc', fontSize: 18, fontWeight: '800' },
  owner: { color: '#cbd5e1', marginTop: 4 },
  price: { color: '#fdba74', marginTop: 8, fontWeight: '800' },
  more: { color: '#93c5fd', marginTop: 8, fontWeight: '700' },
  empty: { color: '#94a3b8', textAlign: 'center', marginTop: 32 },
  error: { color: '#fda4af', marginBottom: 12 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(2,6,23,0.7)',
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: { color: '#f8fafc', fontSize: 20, fontWeight: '800', marginBottom: 10 },
  modalLine: { color: '#cbd5e1', marginBottom: 6 },
  modalDesc: { color: '#e2e8f0', marginTop: 8, marginBottom: 14 },
  closeBtn: {
    backgroundColor: '#ea580c',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  closeText: { color: '#fff', fontWeight: '700' },
});
