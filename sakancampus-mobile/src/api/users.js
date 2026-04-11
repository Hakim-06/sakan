import { api } from './client';

export async function updateProfile(token, payload) {
  return api('/users/profile', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}
