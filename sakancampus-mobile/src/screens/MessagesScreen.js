import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Image,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getConversations, getMessagesWithUser, sendMessage, startTyping, stopTyping, uploadMessageImage, getUserProfile } from '../api/messages';
import { palette, shadows } from '../theme';

function ConversationsSkeleton() {
  return (
    <View style={styles.list}>
      <View style={styles.hero}>
        <View style={styles.heroCircleBlue} />
        <View style={styles.heroCircleOrange} />
        <View style={styles.skeletonHeroTitle} />
        <View style={styles.skeletonHeroSub} />
      </View>
      {Array.from({ length: 5 }).map((_, idx) => (
        <View key={idx} style={styles.convSkeletonCard}>
          <View style={styles.skeletonLineLg} />
          <View style={styles.skeletonLineMd} />
        </View>
      ))}
    </View>
  );
}

function toTime(input) {
  if (!input) return '';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getInitials(name) {
  const text = String(name || '').trim();
  if (!text) return 'U';
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

function TypingIndicator({ label = 'Utilisateur' }) {
  const dots = useRef(Array.from({ length: 3 }, () => new Animated.Value(0.35))).current;

  useEffect(() => {
    const loops = dots.map((dot, index) => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 320,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.35,
            duration: 320,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );

      const timeoutId = setTimeout(() => animation.start(), index * 140);
      return { animation, timeoutId };
    });

    return () => {
      loops.forEach(({ animation, timeoutId }) => {
        clearTimeout(timeoutId);
        animation.stop();
      });
    };
  }, [dots]);

  return (
    <View style={styles.typingBubble}>
      <Text style={styles.typingLabel}>{label} ecrit</Text>
      <View style={styles.typingDots}>
        {dots.map((dot, index) => (
          <Animated.View
            key={index}
            style={[
              styles.typingDot,
              {
                opacity: dot,
                transform: [
                  {
                    translateY: dot.interpolate({
                      inputRange: [0.35, 1],
                      outputRange: [0, -3],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

export default function MessagesScreen({ token, forcedUserId = '', onForcedUserHandled }) {
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [conversations, setConversations] = useState([]);
  const [activeUserId, setActiveUserId] = useState('');
  const [tempChatUser, setTempChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const [convFilter, setConvFilter] = useState('all');
  const [pickedImage, setPickedImage] = useState(null);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const stopTimerRef = useRef(null);
  const typingRef = useRef(false);

  const activeConv = useMemo(
    () => conversations.find((c) => String(c.user?._id) === String(activeUserId)),
    [conversations, activeUserId]
  );

  // Resolve display user: prefer activeConv, fallback to tempChatUser
  const displayUser = activeConv?.user || tempChatUser;

  const loadConversations = useCallback(async () => {
    setLoadingConversations(true);
    try {
      const data = await getConversations(token);
      setConversations(Array.isArray(data?.conversations) ? data.conversations : []);
      setError('');
    } catch (err) {
      setError(err.message || 'Erreur chargement conversations.');
    } finally {
      setLoadingConversations(false);
    }
  }, [token]);

  const loadMessages = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const data = await getMessagesWithUser(token, userId);
      const rows = Array.isArray(data?.messages) ? data.messages : [];
      const mapped = rows.map((m) => ({
        id: String(m?._id || Math.random()),
        text: m?.text || '',
        imageUrl: m?.imageUrl || null,
        mine: String(m?.sender?._id || m?.sender) !== String(userId),
        time: toTime(m?.createdAt),
      }));
      setMessages(mapped);
      setRemoteTyping(!!data?.isTyping);
    } catch {
      // Ignore and retry on next poll.
    }
  }, [token]);

  useEffect(() => {
    loadConversations();
    const id = setInterval(loadConversations, 6000);
    return () => clearInterval(id);
  }, [loadConversations]);

  useEffect(() => {
    if (!activeUserId) return;
    loadMessages(activeUserId);
    const id = setInterval(() => loadMessages(activeUserId), 3000);
    return () => clearInterval(id);
  }, [activeUserId, loadMessages]);

  useEffect(() => {
    const next = String(forcedUserId || '');
    if (!next) {
      setTempChatUser(null);
      return;
    }
    setActiveUserId(next);
    
    // Fetch user profile for display in case it's a new conversation
    if (token) {
      getUserProfile(token, next)
        .then((data) => {
          if (data?.user) {
            setTempChatUser({
              _id: next,
              name: data.user.name || 'Utilisateur',
              photo: data.user.photo || null,
            });
          }
        })
        .catch(() => {
          // If fetch fails, just keep temp user null
        });
    }
    
    if (onForcedUserHandled) onForcedUserHandled();
  }, [forcedUserId, onForcedUserHandled, token]);

  useEffect(() => {
    if (!activeUserId) return;
    if (!draft.trim()) {
      if (typingRef.current) {
        typingRef.current = false;
        stopTyping(token, activeUserId).catch(() => {});
      }
      return;
    }

    if (!typingRef.current) {
      typingRef.current = true;
      startTyping(token, activeUserId).catch(() => {});
    }

    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
    stopTimerRef.current = setTimeout(() => {
      typingRef.current = false;
      stopTyping(token, activeUserId).catch(() => {});
      stopTimerRef.current = null;
    }, 2000);
  }, [draft, activeUserId, token]);

  const handleSend = async () => {
    const text = draft.trim();
    if ((!text && !pickedImage) || !activeUserId || sending) return;

    setSending(true);
    setDraft('');
    if (typingRef.current) {
      typingRef.current = false;
      stopTyping(token, activeUserId).catch(() => {});
    }

    try {
      let uploaded = null;
      if (pickedImage) {
        uploaded = await uploadMessageImage(token, pickedImage);
      }
      await sendMessage(token, activeUserId, text, uploaded);
      setPickedImage(null);
      setError('');
      await loadMessages(activeUserId);
      await loadConversations();
    } catch (err) {
      const msg = err.message || 'Erreur envoi message.';
      setError(msg);
      Alert.alert('Erreur', msg);
    } finally {
      setSending(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset?.uri) return;
    setPickedImage(asset);
  };

  const filteredConversations = conversations.filter((c) => {
    const n = String(c?.user?.name || '').toLowerCase();
    const t = String(c?.lastMessage?.text || '').toLowerCase();
    const q = search.trim().toLowerCase();
    const unread = Number(c?.unreadCount || 0) > 0;
    const filterOk = convFilter === 'unread' ? unread : true;
    if (!q) return filterOk;
    return filterOk && (n.includes(q) || t.includes(q));
  });

  const unreadTotal = conversations.reduce((acc, c) => acc + Number(c?.unreadCount || 0), 0);

  return (
    <SafeAreaView style={styles.safe}>
      {!activeUserId ? (
        loadingConversations ? (
          <ConversationsSkeleton />
        ) : (
          <FlatList
            data={filteredConversations}
            keyExtractor={(item, idx) => String(item?.user?._id || idx)}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.empty}>Pas de conversations.</Text>}
            ListHeaderComponent={
              <View>
                <View style={styles.hero}>
                  <View style={styles.heroCircleBlue} />
                  <View style={styles.heroCircleOrange} />
                  <Text style={styles.heroTitle}>Messages Hub</Text>
                  <Text style={styles.heroSub}>Conversations organisees, rapides et claires.</Text>
                  <View style={styles.statRow}>
                    <Text style={styles.statPill}>{conversations.length} chats</Text>
                    <Text style={styles.statPill}>{unreadTotal} non lus</Text>
                  </View>
                </View>
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <View style={styles.searchWrap}>
                  <Ionicons name="search-outline" size={15} color={palette.textMuted} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher conversation"
                    placeholderTextColor={palette.textMuted}
                    value={search}
                    onChangeText={setSearch}
                  />
                </View>
                <View style={styles.convFilterRow}>
                  <Pressable
                    style={[styles.convFilterChip, convFilter === 'all' && styles.convFilterChipActive]}
                    onPress={() => setConvFilter('all')}
                  >
                    <Text style={[styles.convFilterText, convFilter === 'all' && styles.convFilterTextActive]}>Tous</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.convFilterChip, convFilter === 'unread' && styles.convFilterChipActive]}
                    onPress={() => setConvFilter('unread')}
                  >
                    <Text style={[styles.convFilterText, convFilter === 'unread' && styles.convFilterTextActive]}>Non lus</Text>
                  </Pressable>
                </View>
              </View>
            }
            renderItem={({ item }) => (
              <Pressable
                style={styles.convCard}
                onPress={() => setActiveUserId(String(item?.user?._id || ''))}
              >
                <View style={styles.convAvatar}>
                  <Text style={styles.convAvatarText}>{getInitials(item?.user?.name)}</Text>
                </View>
                <View style={styles.convBody}>
                  <View style={styles.convTopRow}>
                    <Text style={styles.convName}>{item?.user?.name || 'Utilisateur'}</Text>
                    <Text style={styles.convTime}>{toTime(item?.lastMessage?.createdAt)}</Text>
                  </View>
                  <Text style={styles.convMeta} numberOfLines={1}>{item?.lastMessage?.text || 'Aucun message'}</Text>
                </View>
                <View style={styles.convRightCol}>
                  {Number(item?.unreadCount || 0) > 0 ? (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{Number(item?.unreadCount || 0)}</Text>
                    </View>
                  ) : null}
                  <Ionicons name="chevron-forward" size={15} color={palette.textMuted} />
                </View>
              </Pressable>
            )}
          />
        )
      ) : (
        <View style={styles.chatWrap}>
          <View style={styles.chatHeader}>
            <Pressable style={styles.backBtn} onPress={() => setActiveUserId('')}>
              <Ionicons name="chevron-back" size={16} color={palette.primaryOrangeDark} />
              <Text style={styles.back}>Retour</Text>
            </Pressable>
            <View style={styles.chatAvatar}>
              <Text style={styles.chatAvatarText}>{getInitials(displayUser?.name)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.chatTitle}>{displayUser?.name || 'Chat'}</Text>
              <Text style={styles.chatSub}>{remoteTyping ? 'En train d ecrire...' : 'Actif'}</Text>
            </View>
            <View style={styles.chatStatusPill}>
              <View style={styles.chatStatusDot} />
              <Text style={styles.chatStatusText}>{remoteTyping ? 'Typing' : 'Online'}</Text>
            </View>
          </View>

          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.msgList}
            renderItem={({ item }) => (
              <View style={[styles.msgBubble, item.mine ? styles.msgMine : styles.msgOther]}>
                {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.msgImage} /> : null}
                <Text style={[styles.msgText, item.mine ? styles.msgTextMine : styles.msgTextOther]}>{item.text}</Text>
                <Text style={styles.msgTime}>{item.time}</Text>
              </View>
            )}
            ListFooterComponent={
              remoteTyping ? (
                <TypingIndicator label={displayUser?.name || 'Utilisateur'} />
              ) : null
            }
          />

          <View style={styles.composer}>
            <Pressable style={styles.imageBtn} onPress={pickImage}>
              <Ionicons name="image-outline" size={17} color={palette.primaryBlueDark} />
            </Pressable>
            <TextInput
              style={styles.input}
              placeholder="Ecrire un message..."
              placeholderTextColor={palette.textMuted}
              value={draft}
              onChangeText={setDraft}
            />
            <Pressable style={styles.sendBtn} onPress={handleSend}>
              {sending ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name="send" size={15} color="#fff" />}
            </Pressable>
          </View>
          {!!error ? <Text style={styles.errorInline}>{error}</Text> : null}
          {pickedImage?.uri ? (
            <View style={styles.previewRow}>
              <Image source={{ uri: pickedImage.uri }} style={styles.previewImage} />
              <Pressable onPress={() => setPickedImage(null)}>
                <Text style={styles.removePreview}>Retirer image</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 14, gap: 10, paddingBottom: 30 },
  hero: {
    backgroundColor: palette.darkHero,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    overflow: 'hidden',
  },
  heroCircleBlue: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 170,
    height: 170,
    borderRadius: 999,
    backgroundColor: 'rgba(37,99,235,0.36)',
  },
  heroCircleOrange: {
    position: 'absolute',
    bottom: -55,
    left: -45,
    width: 175,
    height: 175,
    borderRadius: 999,
    backgroundColor: 'rgba(249,115,22,0.24)',
  },
  heroTitle: { color: palette.textOnDark, fontSize: 22, fontWeight: '900' },
  heroSub: { color: palette.textOnDarkMuted, marginTop: 4, fontWeight: '600' },
  statRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  statPill: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  skeletonHeroTitle: {
    width: '40%',
    height: 18,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  skeletonHeroSub: {
    width: '68%',
    height: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(203,213,225,0.8)',
  },
  convSkeletonCard: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.borderStrong,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    ...shadows.soft,
  },
  skeletonLineLg: {
    height: 13,
    width: '58%',
    borderRadius: 8,
    backgroundColor: palette.surfaceAlt,
    marginBottom: 8,
  },
  skeletonLineMd: {
    height: 11,
    width: '36%',
    borderRadius: 8,
    backgroundColor: palette.primaryBlueSoft,
  },
  empty: { color: palette.textMuted, textAlign: 'center', marginTop: 24 },
  error: { color: palette.danger, marginBottom: 10 },
  convCard: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.borderStrong,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...shadows.card,
  },
  convAvatar: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: palette.primaryBlueSoft,
    borderWidth: 1,
    borderColor: '#93c5fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  convAvatarText: { color: palette.primaryBlueDark, fontWeight: '900', fontSize: 12 },
  convBody: { flex: 1 },
  convTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: palette.primaryOrange,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  searchWrap: {
    borderWidth: 1,
    borderColor: palette.borderStrong,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: palette.surface,
    ...shadows.soft,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    color: palette.textMain,
  },
  convFilterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  convFilterChip: {
    borderWidth: 1,
    borderColor: palette.borderStrong,
    borderRadius: 999,
    backgroundColor: palette.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  convFilterChipActive: {
    borderColor: palette.primaryBlue,
    backgroundColor: palette.primaryBlueSoft,
  },
  convFilterText: { color: palette.textMuted, fontWeight: '700', fontSize: 12 },
  convFilterTextActive: { color: palette.primaryBlueDark },
  convName: { color: palette.textMain, fontWeight: '800', fontSize: 16 },
  convMeta: { color: palette.textMuted, marginTop: 4, fontSize: 13 },
  convTime: { color: palette.textMuted, fontWeight: '700', fontSize: 11 },
  convRightCol: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 42,
    marginLeft: 4,
  },
  chatWrap: { flex: 1 },
  chatHeader: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: palette.borderStrong,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: palette.surface,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: palette.borderStrong,
    backgroundColor: palette.surfaceAlt,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  back: { color: palette.primaryOrangeDark, fontWeight: '700' },
  chatAvatar: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: palette.primaryBlueSoft,
    borderWidth: 1,
    borderColor: '#93c5fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatAvatarText: { color: palette.primaryBlueDark, fontWeight: '900', fontSize: 11 },
  chatTitle: { color: palette.textMain, fontWeight: '800', fontSize: 16 },
  chatSub: { color: palette.textMuted, marginTop: 2, fontWeight: '600', fontSize: 12 },
  chatStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    backgroundColor: '#f0fdf4',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chatStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#22c55e',
  },
  chatStatusText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '800',
  },
  msgList: { padding: 12, gap: 8 },
  msgBubble: { maxWidth: '84%', borderRadius: 13, padding: 10 },
  msgMine: { alignSelf: 'flex-end', backgroundColor: palette.primaryBlue },
  msgOther: {
    alignSelf: 'flex-start',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  msgText: { fontSize: 14 },
  msgTextMine: { color: '#fff' },
  msgTextOther: { color: palette.textMain },
  msgImage: { width: 180, height: 140, borderRadius: 10, marginBottom: 6, backgroundColor: '#cbd5e1' },
  msgTime: { color: '#334155', marginTop: 4, fontSize: 11, fontWeight: '600' },
  typingBubble: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    marginLeft: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: palette.surfaceAlt,
    borderWidth: 1,
    borderColor: palette.border,
  },
  typingLabel: { color: palette.textMuted, fontSize: 12, fontWeight: '700' },
  typingDots: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  typingDot: { width: 5, height: 5, borderRadius: 999, backgroundColor: palette.primaryOrangeDark },
  composer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: palette.surface,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.borderStrong,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: palette.textMain,
    backgroundColor: palette.surfaceAlt,
  },
  imageBtn: {
    width: 38,
    borderRadius: 10,
    backgroundColor: palette.primaryBlueSoft,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#93c5fd',
  },
  sendBtn: {
    width: 40,
    borderRadius: 10,
    backgroundColor: palette.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewRow: {
    borderTopWidth: 1,
    borderTopColor: palette.border,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: palette.surface,
  },
  previewImage: { width: 56, height: 56, borderRadius: 8 },
  removePreview: { color: palette.primaryOrangeDark, fontWeight: '700' },
  errorInline: { color: palette.danger, paddingHorizontal: 12, paddingBottom: 8, fontSize: 12 },
});
