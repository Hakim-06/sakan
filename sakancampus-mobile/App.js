import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text } from 'react-native';
import { login, getMe } from './src/api/auth';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import { clearToken, getToken, saveToken } from './src/storage/token';

export default function App() {
  const [booting, setBooting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = await getToken();
        if (!token) {
          setBooting(false);
          return;
        }

        const data = await getMe(token);
        setUser(data.user || null);
      } catch {
        await clearToken();
        setUser(null);
      } finally {
        setBooting(false);
      }
    };

    bootstrap();
  }, []);

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError('');

    try {
      const data = await login(email, password);
      const token = data.token;
      if (!token) throw new Error('Token manquant.');

      await saveToken(token);
      setUser(data.user || null);
    } catch (err) {
      setError(err.message || 'Connexion impossible.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await clearToken();
    setUser(null);
  };

  if (booting) {
    return (
      <SafeAreaView style={styles.bootWrap}>
        <ActivityIndicator color="#ea580c" size="large" />
        <Text style={styles.bootText}>Chargement...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return <LoginScreen onSubmit={handleLogin} loading={loading} error={error} />;
  }

  return <HomeScreen user={user} onLogout={handleLogout} />;
}

const styles = StyleSheet.create({
  bootWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    gap: 10,
  },
  bootText: {
    color: '#cbd5e1',
    fontSize: 14,
  },
});
