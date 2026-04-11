import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getAnnonces } from '../api/annonces';

function Item({ item }) {
  const city = item?.city || 'Ville inconnue';
  const budget = Number(item?.budget || 0);
  const owner = item?.owner?.name || item?.name || 'Utilisateur';

  return (
    <View style={styles.card}>
      <Text style={styles.city}>{city}</Text>
      <Text style={styles.owner}>Par: {owner}</Text>
      <Text style={styles.price}>{budget} DH/mois</Text>
    </View>
  );
}

export default function FeedScreen({ token, user, onLogout }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [annonces, setAnnonces] = useState([]);

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
        <Pressable style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
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
          renderItem={({ item }) => <Item item={item} />}
          ListEmptyComponent={<Text style={styles.empty}>Aucune annonce pour le moment.</Text>}
          ListHeaderComponent={error ? <Text style={styles.error}>{error}</Text> : null}
        />
      )}
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
  logoutBtn: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutText: { color: '#f8fafc', fontWeight: '700' },
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
  empty: { color: '#94a3b8', textAlign: 'center', marginTop: 32 },
  error: { color: '#fda4af', marginBottom: 12 },
});
