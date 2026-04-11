import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getConversations, getMessagesWithUser, sendMessage, startTyping, stopTyping, uploadMessageImage } from '../api/messages';

function toTime(input) {
  if (!input) return '';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessagesScreen({ token }) {
  const [conversations, setConversations] = useState([]);
  const [activeUserId, setActiveUserId] = useState('');
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [pickedImage, setPickedImage] = useState(null);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const stopTimerRef = useRef(null);
  const typingRef = useRef(false);

  const activeConv = useMemo(
    () => conversations.find((c) => String(c.user?._id) === String(activeUserId)),
    [conversations, activeUserId]
  );

  const loadConversations = useCallback(async () => {
    try {
      const data = await getConversations(token);
      setConversations(Array.isArray(data?.conversations) ? data.conversations : []);
    } catch {
      // Keep UI stable on transient failure.
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
    if ((!text && !pickedImage) || !activeUserId) return;

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
      await loadMessages(activeUserId);
      await loadConversations();
    } catch {
      // Keep silent for now.
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

  return (
    <SafeAreaView style={styles.safe}>
      {!activeUserId ? (
        <FlatList
          data={conversations}
          keyExtractor={(item, idx) => String(item?.user?._id || idx)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>Pas de conversations.</Text>}
          renderItem={({ item }) => (
            <Pressable
              style={styles.convCard}
              onPress={() => setActiveUserId(String(item?.user?._id || ''))}
            >
              <Text style={styles.convName}>{item?.user?.name || 'Utilisateur'}</Text>
              <Text style={styles.convMeta}>{item?.lastMessage?.text || 'Aucun message'}</Text>
            </Pressable>
          )}
        />
      ) : (
        <View style={styles.chatWrap}>
          <View style={styles.chatHeader}>
            <Pressable onPress={() => setActiveUserId('')}>
              <Text style={styles.back}>Retour</Text>
            </Pressable>
            <Text style={styles.chatTitle}>{activeConv?.user?.name || 'Chat'}</Text>
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
                <Text style={styles.typing}>{activeConv?.user?.name || 'Utilisateur'} ecrit...</Text>
              ) : null
            }
          />

          <View style={styles.composer}>
            <Pressable style={styles.imageBtn} onPress={pickImage}>
              <Text style={styles.imageBtnText}>Img</Text>
            </Pressable>
            <TextInput
              style={styles.input}
              placeholder="Ecrire un message..."
              placeholderTextColor="#94a3b8"
              value={draft}
              onChangeText={setDraft}
            />
            <Pressable style={styles.sendBtn} onPress={handleSend}>
              <Text style={styles.sendText}>Send</Text>
            </Pressable>
          </View>
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
  safe: { flex: 1, backgroundColor: '#0f172a' },
  list: { padding: 14, gap: 10 },
  empty: { color: '#94a3b8', textAlign: 'center', marginTop: 24 },
  convCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 12,
    padding: 12,
  },
  convName: { color: '#f8fafc', fontWeight: '800', fontSize: 16 },
  convMeta: { color: '#94a3b8', marginTop: 4 },
  chatWrap: { flex: 1 },
  chatHeader: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  back: { color: '#fdba74', fontWeight: '700' },
  chatTitle: { color: '#f8fafc', fontWeight: '800', fontSize: 16 },
  msgList: { padding: 12, gap: 8 },
  msgBubble: { maxWidth: '84%', borderRadius: 12, padding: 10 },
  msgMine: { alignSelf: 'flex-end', backgroundColor: '#ea580c' },
  msgOther: { alignSelf: 'flex-start', backgroundColor: '#1f2937' },
  msgText: { fontSize: 14 },
  msgTextMine: { color: '#fff' },
  msgTextOther: { color: '#e2e8f0' },
  msgImage: { width: 180, height: 140, borderRadius: 10, marginBottom: 6, backgroundColor: '#0b1220' },
  msgTime: { color: '#cbd5e1', marginTop: 4, fontSize: 11 },
  typing: { color: '#94a3b8', marginTop: 10, marginLeft: 4, fontSize: 12, fontWeight: '700' },
  composer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 10,
    color: '#f8fafc',
    backgroundColor: '#111827',
  },
  imageBtn: {
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  imageBtnText: { color: '#cbd5e1', fontWeight: '700' },
  sendBtn: {
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#ea580c',
    justifyContent: 'center',
  },
  sendText: { color: '#fff', fontWeight: '700' },
  previewRow: {
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  previewImage: { width: 56, height: 56, borderRadius: 8 },
  removePreview: { color: '#fdba74', fontWeight: '700' },
});
