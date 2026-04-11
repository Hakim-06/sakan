import { api } from './client';
import { API_BASE_URL } from '../config/env';

export async function getConversations(token) {
  return api('/messages/conversations', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getMessagesWithUser(token, userId) {
  return api(`/messages/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function sendMessage(token, userId, text, imagePayload = null) {
  const body = { text };
  if (imagePayload?.imageUrl && imagePayload?.imagePublicId) {
    body.imageUrl = imagePayload.imageUrl;
    body.imagePublicId = imagePayload.imagePublicId;
  }

  return api(`/messages/${userId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
}

export async function uploadMessageImage(token, asset) {
  const formData = new FormData();
  formData.append('image', {
    uri: asset.uri,
    name: asset.fileName || `chat-${Date.now()}.jpg`,
    type: asset.mimeType || 'image/jpeg',
  });

  const res = await fetch(`${API_BASE_URL}/messages/upload/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Upload image impossible');
  }
  return data;
}

export async function startTyping(token, userId) {
  return api(`/messages/typing/start/${userId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function stopTyping(token, userId) {
  return api(`/messages/typing/stop/${userId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}
