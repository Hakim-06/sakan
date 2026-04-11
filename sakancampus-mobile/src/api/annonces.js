import { api } from './client';

export async function getAnnonces(token) {
  return api('/annonces', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
