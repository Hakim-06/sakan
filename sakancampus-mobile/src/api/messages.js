import { api } from './client';

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

export async function sendMessage(token, userId, text) {
  return api(`/messages/${userId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ text }),
  });
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
