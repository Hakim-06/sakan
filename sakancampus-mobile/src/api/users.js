import { api } from './client';

export async function updateProfile(token, payload) {
  return api('/users/profile', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function toggleFavorite(token, annonceId) {
  return api(`/users/favorites/${annonceId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}
