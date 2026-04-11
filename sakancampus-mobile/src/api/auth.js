import { api } from './client';

export async function login(email, password) {
  return api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getMe(token) {
  return api('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
