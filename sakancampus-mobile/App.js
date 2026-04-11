import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getMe, login, logout, register, resendVerification, verifyEmailCode } from './src/api/auth';
import FeedScreen from './src/screens/FeedScreen';
import LoginScreen from './src/screens/LoginScreen';
import { clearToken, getToken, saveToken } from './src/storage/token';
import RegisterScreen from './src/screens/RegisterScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PublishScreen from './src/screens/PublishScreen';
import { getUnreadCount } from './src/api/messages';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [booting, setBooting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [authScreen, setAuthScreen] = useState('login');
  const [unreadCount, setUnreadCount] = useState(0);

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
    setUnreadCount(0);
  };

  useEffect(() => {
    if (!token || !user) return;

    const loadUnread = async () => {
      try {
        const data = await getUnreadCount(token);
        setUnreadCount(Number(data?.count || 0));
      } catch {
        // Ignore transient count errors.
      }
    };

    loadUnread();
    const id = setInterval(loadUnread, 12000);
    return () => clearInterval(id);
  }, [token, user]);

  if (booting) {
    return (
      <SafeAreaView style={styles.bootWrap}>
        <ActivityIndicator color="#ea580c" size="large" />
        <Text style={styles.bootText}>Chargement...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          {authScreen !== 'register' ? (
            <Stack.Screen name="Login">
              {() => (
                <LoginScreen
                  onSubmit={handleLogin}
                  loading={loading}
                  error={error}
                  onGoRegister={() => {
                    setError('');
                    setAuthScreen('register');
                  }}
                />
              )}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Register">
              {() => (
                <RegisterScreen
                  onRegister={handleRegister}
                  onVerifyCode={handleVerifyCode}
                  onResendCode={handleResendCode}
                  onBackLogin={() => setAuthScreen('login')}
                />
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#111827' },
          headerTintColor: '#f8fafc',
          tabBarStyle: { backgroundColor: '#111827', borderTopColor: '#1f2937' },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#cbd5e1',
          tabBarActiveBackgroundColor: '#ea580c',
          tabBarLabelStyle: { fontWeight: '700', fontSize: 12 },
          tabBarItemStyle: { borderRadius: 10, marginHorizontal: 4, marginVertical: 6 },
          sceneStyle: { backgroundColor: '#0f172a' },
        }}
      >
        <Tab.Screen name="Feed" options={{ title: 'Feed' }}>
          {() => <FeedScreen token={token} user={user} onUserUpdated={setUser} />}
        </Tab.Screen>

        <Tab.Screen
          name="Messages"
          options={{
            title: 'Messages',
            tabBarBadge: unreadCount > 0 ? (unreadCount > 99 ? '99+' : unreadCount) : undefined,
          }}
        >
          {() => <MessagesScreen token={token} />}
        </Tab.Screen>

        <Tab.Screen name="Publier" options={{ title: 'Publier' }}>
          {() => <PublishScreen token={token} />}
        </Tab.Screen>

        <Tab.Screen name="Profil" options={{ title: 'Profil' }}>
          {() => (
            <ProfileScreen
              token={token}
              user={user}
              onUserUpdated={setUser}
              onLogout={handleLogout}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0f172a',
    card: '#111827',
    border: '#1f2937',
    text: '#f8fafc',
    primary: '#ea580c',
  },
};

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
