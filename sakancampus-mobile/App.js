import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { getMe, login, logout, register, resendVerification, verifyEmailCode } from './src/api/auth';
import FeedScreen from './src/screens/FeedScreen';
import LoginScreen from './src/screens/LoginScreen';
import { clearToken, getToken, saveToken } from './src/storage/token';
import RegisterScreen from './src/screens/RegisterScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import ProfileScreen from './src/screens/ProfileScreen';

export default function App() {
  const [booting, setBooting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [authScreen, setAuthScreen] = useState('login');
  const [tab, setTab] = useState('feed');

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
    setTab('feed');
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

  return (
    <SafeAreaView style={styles.appSafe}>
      <View style={styles.appBody}>
        {tab === 'feed' && <FeedScreen token={token} user={user} />}
        {tab === 'messages' && <MessagesScreen token={token} />}
        {tab === 'profile' && (
          <ProfileScreen
            token={token}
            user={user}
            onUserUpdated={setUser}
            onLogout={handleLogout}
          />
        )}
      </View>

      <View style={styles.tabBar}>
        <Pressable style={[styles.tabBtn, tab === 'feed' && styles.tabBtnActive]} onPress={() => setTab('feed')}>
          <Text style={[styles.tabText, tab === 'feed' && styles.tabTextActive]}>Feed</Text>
        </Pressable>
        <Pressable style={[styles.tabBtn, tab === 'messages' && styles.tabBtnActive]} onPress={() => setTab('messages')}>
          <Text style={[styles.tabText, tab === 'messages' && styles.tabTextActive]}>Messages</Text>
        </Pressable>
        <Pressable style={[styles.tabBtn, tab === 'profile' && styles.tabBtnActive]} onPress={() => setTab('profile')}>
          <Text style={[styles.tabText, tab === 'profile' && styles.tabTextActive]}>Profil</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
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
  appSafe: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  appBody: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    backgroundColor: '#111827',
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: 8,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#ea580c',
  },
  tabText: {
    color: '#cbd5e1',
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#fff',
  },
});
