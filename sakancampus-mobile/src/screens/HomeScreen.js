import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen({ user, onLogout }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>SakanCampus Mobile</Text>
        <Text style={styles.subtitle}>Bienvenue {user?.name || 'User'}</Text>
        <Text style={styles.caption}>{user?.email || ''}</Text>

        <Pressable style={styles.btn} onPress={onLogout}>
          <Text style={styles.btnText}>Se deconnecter</Text>
        </Pressable>

        <StatusBar style="light" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  caption: {
    color: '#94a3b8',
    marginBottom: 16,
  },
  btn: {
    backgroundColor: '#ea580c',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
  },
});
