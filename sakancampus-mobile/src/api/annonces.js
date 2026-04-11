import { api } from './client';

export async function getAnnonces(token) {
  return api('/annonces', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createAnnonce(token, payload) {
  return api('/annonces', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}
