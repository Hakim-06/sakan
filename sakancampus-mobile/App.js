import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text } from 'react-native';
import { getMe, login, logout, register, resendVerification, verifyEmailCode } from './src/api/auth';
import FeedScreen from './src/screens/FeedScreen';
import LoginScreen from './src/screens/LoginScreen';
import { clearToken, getToken, saveToken } from './src/storage/token';
import RegisterScreen from './src/screens/RegisterScreen';

export default function App() {
  const [booting, setBooting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [authScreen, setAuthScreen] = useState('login');

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = await getToken();
        if (!token) {
          setBooting(false);
          return;
        }

        const data = await getMe(token);
        setToken(token);
        setUser(data.user || null);
      } catch {
        await clearToken();
        setToken('');
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
      setToken(token);
      setUser(data.user || null);
    } catch (err) {
      setError(err.message || 'Connexion impossible.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (name, email, password) => {
    return register(name, email, password);
  };

  const handleVerifyCode = async (email, code) => {
    const data = await verifyEmailCode(email, code);
    const nextToken = data?.token;
    if (!nextToken) {
      throw new Error('Verification reussie mais token manquant.');
    }

    await saveToken(nextToken);
    setToken(nextToken);
    setUser(data.user || null);
    setAuthScreen('login');
    return data;
  };

  const handleResendCode = async (email) => {
    return resendVerification(email);
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await logout(token);
      }
    } catch {
      // Ignore logout API errors and clear local session anyway.
    }
    await clearToken();
    setToken('');
    setUser(null);
    setAuthScreen('login');
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
    if (authScreen === 'register') {
      return (
        <RegisterScreen
          onRegister={handleRegister}
          onVerifyCode={handleVerifyCode}
          onResendCode={handleResendCode}
          onBackLogin={() => setAuthScreen('login')}
        />
      );
    }

    return (
      <LoginScreen
        onSubmit={handleLogin}
        loading={loading}
        error={error}
        onGoRegister={() => {
          setError('');
          setAuthScreen('register');
        }}
      />
    );
  }

  return <FeedScreen token={token} user={user} onLogout={handleLogout} />;
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
