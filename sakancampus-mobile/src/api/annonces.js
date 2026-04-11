import { api } from './client';

export async function getAnnonces(token) {
  return api('/annonces', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getMyAnnonces(token) {
  return api('/annonces/mine', {
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

export async function updateAnnonce(token, annonceId, payload) {
  return api(`/annonces/${annonceId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteAnnonce(token, annonceId) {
  return api(`/annonces/${annonceId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
