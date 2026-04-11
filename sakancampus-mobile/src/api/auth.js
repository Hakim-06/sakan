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

export async function register(name, email, password) {
  return api('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function verifyEmailCode(email, code) {
  return api('/auth/verify-email-code', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}

export async function resendVerification(email) {
  return api('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function logout(token) {
  return api('/auth/logout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
